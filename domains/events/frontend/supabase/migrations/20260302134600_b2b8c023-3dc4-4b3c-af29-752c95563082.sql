
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'organizer', 'host', 'staff', 'sponsor', 'speaker', 'attendee');
CREATE TYPE public.event_type AS ENUM ('professional', 'social');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'ended');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE public.checkin_status AS ENUM ('not_checked_in', 'checked_in');
CREATE TYPE public.rsvp_response AS ENUM ('yes', 'no', 'maybe');
CREATE TYPE public.invited_status AS ENUM ('not_sent', 'sent');
CREATE TYPE public.rsvp_status AS ENUM ('no_response', 'yes', 'no', 'maybe');
CREATE TYPE public.message_channel AS ENUM ('email', 'sms');
CREATE TYPE public.sponsor_tier AS ENUM ('platinum', 'gold', 'silver');
CREATE TYPE public.event_privacy AS ENUM ('public', 'link_only', 'password');

-- ============================================
-- UTILITY: updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- USER ROLES (separate table for security)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Auto-assign attendee role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'attendee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type event_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  location_name TEXT,
  location_address TEXT,
  location_map_url TEXT,
  status event_status NOT NULL DEFAULT 'draft',
  privacy event_privacy NOT NULL DEFAULT 'public',
  password TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_template_id TEXT,
  host_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are viewable by everyone" ON public.events
  FOR SELECT USING (status = 'published' OR created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update their events" ON public.events
  FOR UPDATE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Owners can delete their events" ON public.events
  FOR DELETE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_events_type ON public.events(type);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_created_by ON public.events(created_by);

-- ============================================
-- TICKETS (Professional only)
-- ============================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  sales_start TIMESTAMPTZ,
  sales_end TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tickets viewable by everyone" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Event owners can manage tickets" ON public.tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = tickets.event_id AND (events.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin')))
  );

-- ============================================
-- REGISTRATIONS (Professional)
-- ============================================
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  total_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  qr_code_value TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  checkin_status checkin_status NOT NULL DEFAULT 'not_checked_in',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations" ON public.registrations
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events WHERE events.id = registrations.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Anyone can register" ON public.registrations
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Event owners can update registrations" ON public.registrations
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = registrations.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================
-- RSVPS (Social)
-- ============================================
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  response rsvp_response NOT NULL DEFAULT 'maybe',
  plus_one_name TEXT,
  meal_preference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVPs viewable by event owner" ON public.rsvps
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = rsvps.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Anyone can RSVP" ON public.rsvps
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Event owners can manage RSVPs" ON public.rsvps
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = rsvps.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- GUESTS (Social guest list)
-- ============================================
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  invited_status invited_status NOT NULL DEFAULT 'not_sent',
  rsvp_status rsvp_status NOT NULL DEFAULT 'no_response',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can manage guests" ON public.guests
  FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- SESSIONS (Professional agenda)
-- ============================================
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  speaker_name TEXT,
  track_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions viewable by everyone" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Event owners can manage sessions" ON public.sessions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = sessions.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- SPONSORS (Professional)
-- ============================================
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier sponsor_tier NOT NULL DEFAULT 'silver',
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors viewable by everyone" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Event owners can manage sponsors" ON public.sponsors
  FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = sponsors.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- MESSAGES (Email/SMS logs)
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  channel message_channel NOT NULL DEFAULT 'email',
  recipient TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can manage messages" ON public.messages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = messages.event_id AND events.created_by = auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- STORAGE: event cover images
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

CREATE POLICY "Event images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their uploaded images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their uploaded images" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

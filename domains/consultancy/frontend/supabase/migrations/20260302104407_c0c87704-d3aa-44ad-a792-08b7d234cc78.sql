
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'waitlisted');
CREATE TYPE public.resource_type AS ENUM ('article', 'guide', 'checklist', 'template');
CREATE TYPE public.consultation_type AS ENUM ('business', 'career', 'travel');

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER ROLES TABLE (separate from profiles for security)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: has_role (SECURITY DEFINER)
-- ============================================
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

-- ============================================
-- AVAILABILITY RULES
-- ============================================
CREATE TABLE public.availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
  buffer_minutes INTEGER NOT NULL DEFAULT 10,
  consultation_type consultation_type NOT NULL DEFAULT 'business',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TIME BLOCKS (admin-defined blocked times)
-- ============================================
CREATE TABLE public.time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Blocked',
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consultation_type consultation_type NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- APPLICATIONS
-- ============================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  application_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consultation_type consultation_type NOT NULL,
  status application_status NOT NULL DEFAULT 'submitted',
  form_data JSONB NOT NULL DEFAULT '{}',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- APPLICATION STATUS LOG
-- ============================================
CREATE TABLE public.application_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  old_status application_status,
  new_status application_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.application_status_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- APPLICATION DOCUMENTS
-- ============================================
CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CMS: PAGES
-- ============================================
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CMS: RESOURCES
-- ============================================
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  resource_type resource_type NOT NULL DEFAULT 'article',
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  consultation_type consultation_type,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CMS: WEBINARS
-- ============================================
CREATE TABLE public.webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  webinar_url TEXT,
  thumbnail_url TEXT,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_free BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CMS: TESTIMONIALS
-- ============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_image_url TEXT,
  quote TEXT NOT NULL,
  consultation_type consultation_type,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CONTACT FORM SUBMISSIONS
-- ============================================
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  consultation_type consultation_type,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STORAGE BUCKET FOR DOCUMENTS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('application-documents', 'application-documents', false, 10485760);

-- ============================================
-- CODE GENERATION FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_booking_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    code := 'BK-ALC-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_application_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    code := 'APP-ALC-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    SELECT EXISTS(SELECT 1 FROM public.applications WHERE application_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- ============================================
-- TRIGGERS: Auto-generate codes
-- ============================================
CREATE OR REPLACE FUNCTION public.set_booking_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    NEW.booking_code := public.generate_booking_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_code();

CREATE OR REPLACE FUNCTION public.set_application_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.application_code IS NULL OR NEW.application_code = '' THEN
    NEW.application_code := public.generate_application_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_application_code
  BEFORE INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_application_code();

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_availability_rules_updated_at BEFORE UPDATE ON public.availability_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON public.webinars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- TRIGGER: Application status log
-- ============================================
CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_status_log (application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_application_status
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_status_change();

-- ============================================
-- RLS POLICIES: PROFILES
-- ============================================
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS POLICIES: USER ROLES
-- ============================================
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: AVAILABILITY RULES
-- ============================================
CREATE POLICY "Anyone can view active rules" ON public.availability_rules FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage rules" ON public.availability_rules FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES: TIME BLOCKS
-- ============================================
CREATE POLICY "Admins can manage time blocks" ON public.time_blocks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES: BOOKINGS
-- ============================================
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES: APPLICATIONS
-- ============================================
CREATE POLICY "Anyone can create applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete applications" ON public.applications FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES: APPLICATION STATUS LOG
-- ============================================
CREATE POLICY "Admins can view status logs" ON public.application_status_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert logs" ON public.application_status_log FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS POLICIES: APPLICATION DOCUMENTS
-- ============================================
CREATE POLICY "Admins can manage documents" ON public.application_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can upload documents" ON public.application_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own documents" ON public.application_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid())
);

-- ============================================
-- RLS POLICIES: CMS TABLES (pages, resources, webinars, testimonials)
-- ============================================
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published resources" ON public.resources FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published webinars" ON public.webinars FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage webinars" ON public.webinars FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES: CONTACT SUBMISSIONS
-- ============================================
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- STORAGE RLS: APPLICATION DOCUMENTS BUCKET
-- ============================================
CREATE POLICY "Admins can access all documents" ON storage.objects FOR ALL USING (bucket_id = 'application-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'application-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- FUNCTION: Check application status by code (public)
-- ============================================
CREATE OR REPLACE FUNCTION public.check_application_status(app_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'application_code', a.application_code,
    'status', a.status,
    'consultation_type', a.consultation_type,
    'submitted_at', a.created_at,
    'updated_at', a.updated_at
  ) INTO result
  FROM public.applications a
  WHERE a.application_code = app_code;

  IF result IS NULL THEN
    RETURN jsonb_build_object('error', 'Application not found');
  END IF;

  RETURN result;
END;
$$;

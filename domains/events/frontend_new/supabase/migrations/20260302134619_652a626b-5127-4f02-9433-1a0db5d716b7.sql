
-- The "Anyone can register" and "Anyone can RSVP" policies use WITH CHECK (true) intentionally
-- because guest checkout / anonymous RSVPs are a core requirement.
-- We'll tighten them by requiring that the referenced event exists and is published.

DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;
CREATE POLICY "Anyone can register for published events" ON public.registrations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = registrations.event_id AND events.status = 'published')
  );

DROP POLICY IF EXISTS "Anyone can RSVP" ON public.rsvps;
CREATE POLICY "Anyone can RSVP to published events" ON public.rsvps
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = rsvps.event_id AND events.status = 'published')
  );

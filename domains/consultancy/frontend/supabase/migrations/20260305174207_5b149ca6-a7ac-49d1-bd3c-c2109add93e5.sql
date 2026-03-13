
-- Fix ALL RLS policies: change from RESTRICTIVE to PERMISSIVE

-- ============ applications ============
DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;

CREATE POLICY "Admins can delete applications" ON public.applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ application_documents ============
DROP POLICY IF EXISTS "Admins can manage documents" ON public.application_documents;
DROP POLICY IF EXISTS "Anyone can upload documents" ON public.application_documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.application_documents;

CREATE POLICY "Admins can manage documents" ON public.application_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can upload documents" ON public.application_documents FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view own documents" ON public.application_documents FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM applications WHERE applications.id = application_documents.application_id AND applications.user_id = auth.uid()));

-- ============ application_status_log ============
DROP POLICY IF EXISTS "Admins can view status logs" ON public.application_status_log;
DROP POLICY IF EXISTS "System can insert logs" ON public.application_status_log;

CREATE POLICY "Admins can view status logs" ON public.application_status_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert logs" ON public.application_status_log FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============ bookings ============
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ contact_submissions ============
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============ pages ============
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.pages;

CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT TO anon, authenticated USING (is_published = true);

-- ============ profiles ============
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ resources ============
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
DROP POLICY IF EXISTS "Anyone can view published resources" ON public.resources;

CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view published resources" ON public.resources FOR SELECT TO anon, authenticated USING (is_published = true);

-- ============ testimonials ============
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view published testimonials" ON public.testimonials;

CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true);

-- ============ time_blocks ============
DROP POLICY IF EXISTS "Admins can manage time blocks" ON public.time_blocks;

CREATE POLICY "Admins can manage time blocks" ON public.time_blocks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ user_roles ============
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ webinars ============
DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
DROP POLICY IF EXISTS "Anyone can view published webinars" ON public.webinars;

CREATE POLICY "Admins can manage webinars" ON public.webinars FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view published webinars" ON public.webinars FOR SELECT TO anon, authenticated USING (is_published = true);

-- ============ availability_rules ============
DROP POLICY IF EXISTS "Admins can manage rules" ON public.availability_rules;
DROP POLICY IF EXISTS "Anyone can view active rules" ON public.availability_rules;

CREATE POLICY "Admins can manage rules" ON public.availability_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view active rules" ON public.availability_rules FOR SELECT TO anon, authenticated USING (is_active = true);

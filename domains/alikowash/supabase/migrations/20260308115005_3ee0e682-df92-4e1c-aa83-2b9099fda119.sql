
-- Add rate limiting: contacts can only submit 5 per hour per email
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.contacts WHERE email = NEW.email AND created_at > now() - interval '1 hour') >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER check_contact_rate BEFORE INSERT ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();

-- Add rate limiting for donations: 10 per hour per email
CREATE OR REPLACE FUNCTION public.check_donation_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.donations WHERE email = NEW.email AND created_at > now() - interval '1 hour') >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER check_donation_rate BEFORE INSERT ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.check_donation_rate_limit();

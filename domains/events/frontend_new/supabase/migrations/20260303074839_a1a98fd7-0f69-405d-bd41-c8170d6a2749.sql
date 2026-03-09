
-- Create a function to verify event passwords server-side
CREATE OR REPLACE FUNCTION public.verify_event_password(_event_id uuid, _password text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.events
    WHERE id = _event_id
      AND password IS NOT NULL
      AND password = extensions.crypt(_password, password)
  );
END;
$$;

-- Also fix the hash trigger to use extensions schema
CREATE OR REPLACE FUNCTION public.hash_event_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.password IS NOT NULL AND NEW.password != '' THEN
    IF NEW.password NOT LIKE '$2%' THEN
      NEW.password := extensions.crypt(NEW.password, extensions.gen_salt('bf', 10));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create trigger function to hash event passwords before insert/update
CREATE OR REPLACE FUNCTION public.hash_event_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only hash if password is being set/changed and isn't already hashed
  IF NEW.password IS NOT NULL AND NEW.password != '' THEN
    -- Check if it's already a bcrypt hash (starts with $2)
    IF NEW.password NOT LIKE '$2%' THEN
      NEW.password := crypt(NEW.password, gen_salt('bf', 10));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create triggers for insert and update
CREATE TRIGGER hash_event_password_on_insert
  BEFORE INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_event_password();

CREATE TRIGGER hash_event_password_on_update
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  WHEN (OLD.password IS DISTINCT FROM NEW.password)
  EXECUTE FUNCTION public.hash_event_password();

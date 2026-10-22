-- ============================================================
-- Contact messages + youth registrations
-- Run once in the Supabase SQL Editor.
--
-- Who can do what:
--   * anon / authenticated  -> INSERT only (through /api/contact and
--                              /api/register, which add a honeypot and
--                              this table's rate limit).
--   * admins                -> read, mark read, delete.
-- "Admin" is an explicit allowlist (public.admin_users), not "any
-- signed-in user", because public sign-up is enabled on this project.
-- ============================================================

-- ---------- Admin allowlist ----------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_users FROM anon, authenticated;
-- No policies: only the service role / SQL editor manages this list.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid()));
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Today the project has exactly one auth user (the admin hub login).
-- Add future admins with:
--   INSERT INTO public.admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'someone@example.org';
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users
ON CONFLICT DO NOTHING;

-- ---------- Tables ----------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name)  BETWEEN 1 AND 120),
  email       TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('Young Kenyan', 'Partner Organization', 'Donor / Funder', 'Media / Press', 'Other')),
  body        TEXT NOT NULL CHECK (char_length(body)  BETWEEN 1 AND 5000),
  locale      TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'sw', 'fr')),
  read        BOOLEAN NOT NULL DEFAULT false,
  ip_hash     TEXT,           -- sha256 of the sender IP, only used for rate limiting
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_ip_recent_idx  ON public.contact_messages (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS public.youth_registrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL CHECK (char_length(name)  BETWEEN 1 AND 120),
  email          TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  county         TEXT NOT NULL CHECK (char_length(county) BETWEEN 1 AND 60),
  age            SMALLINT NOT NULL CHECK (age BETWEEN 15 AND 35),
  interests      TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(interests) <= 12),
  other_interest TEXT CHECK (char_length(other_interest) <= 200),
  locale         TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'sw', 'fr')),
  ip_hash        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS youth_registrations_created_at_idx ON public.youth_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS youth_registrations_ip_recent_idx  ON public.youth_registrations (ip_hash, created_at);

-- ---------- Rate limit (enforced in the database) ----------
-- At most 5 rows per ip_hash per table in any 10 minutes. Raises
-- 'rate_limited', which the API routes turn into HTTP 429.
CREATE OR REPLACE FUNCTION public.enforce_submission_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent INT;
BEGIN
  IF NEW.ip_hash IS NULL THEN
    RETURN NEW;
  END IF;
  EXECUTE format(
    'SELECT count(*) FROM %I.%I WHERE ip_hash = $1 AND created_at > now() - interval ''10 minutes''',
    TG_TABLE_SCHEMA, TG_TABLE_NAME
  ) INTO recent USING NEW.ip_hash;
  IF recent >= 5 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_submission_rate_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS contact_messages_rate_limit ON public.contact_messages;
CREATE TRIGGER contact_messages_rate_limit
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_submission_rate_limit();

DROP TRIGGER IF EXISTS youth_registrations_rate_limit ON public.youth_registrations;
CREATE TRIGGER youth_registrations_rate_limit
  BEFORE INSERT ON public.youth_registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_submission_rate_limit();

-- ---------- Privileges ----------
-- Visitors may only insert the form columns; read/created_at/id stay at
-- their defaults. Admins (authenticated + is_admin()) read/update/delete.
REVOKE ALL ON public.contact_messages    FROM anon, authenticated;
REVOKE ALL ON public.youth_registrations FROM anon, authenticated;

GRANT INSERT (name, email, sender_type, body, locale, ip_hash)
  ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT UPDATE (read)  ON public.contact_messages TO authenticated;

GRANT INSERT (name, email, county, age, interests, other_interest, locale, ip_hash)
  ON public.youth_registrations TO anon, authenticated;
GRANT SELECT, DELETE ON public.youth_registrations TO authenticated;

-- ---------- Row Level Security ----------
ALTER TABLE public.contact_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can send contact messages" ON public.contact_messages;
CREATE POLICY "public can send contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (read = false);

DROP POLICY IF EXISTS "admins read contact messages" ON public.contact_messages;
CREATE POLICY "admins read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "admins update contact messages" ON public.contact_messages;
CREATE POLICY "admins update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "admins delete contact messages" ON public.contact_messages;
CREATE POLICY "admins delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "public can register" ON public.youth_registrations;
CREATE POLICY "public can register" ON public.youth_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admins read registrations" ON public.youth_registrations;
CREATE POLICY "admins read registrations" ON public.youth_registrations
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "admins delete registrations" ON public.youth_registrations;
CREATE POLICY "admins delete registrations" ON public.youth_registrations
  FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

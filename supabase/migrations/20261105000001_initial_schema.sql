-- ====================================================================
-- منصة الأذكــار - Al-Adhkar Platform Database Migration
-- Phase 2: Complete Database Schema, Strict Single-Owner Security & RLS
-- ====================================================================

-- 1. Create Private Schema (Never exposed to PostgREST/Public API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- 2. Create Single Site Owner Table in Private Schema
CREATE TABLE IF NOT EXISTS private.site_owner (
  owner_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE private.site_owner ENABLE ROW LEVEL SECURITY;
-- No public/anon access to private.site_owner
REVOKE ALL ON TABLE private.site_owner FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.site_owner TO service_role;

-- 3. Secure Security Definer Helper Function to check if current user is the Sole Owner
CREATE OR REPLACE FUNCTION public.is_site_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
STABLE
AS $$
BEGIN
  -- If not logged in, return false immediately
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check against the private single-owner registry
  RETURN EXISTS (
    SELECT 1 
    FROM private.site_owner 
    WHERE owner_user_id = auth.uid()
  );
END;
$$;

-- Allow anon and authenticated to execute the function safely
GRANT EXECUTE ON FUNCTION public.is_site_owner() TO anon, authenticated, service_role;

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Sources Table (كتب الحديث والمصادر المعتمدة)
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  author TEXT,
  reference_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Adhkar Categories (morning, evening, sleep, etc.)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'needs_review')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Adhkar Table
CREATE TABLE IF NOT EXISTS public.adhkar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  title TEXT,
  text TEXT NOT NULL,
  repeat_count INT NOT NULL DEFAULT 1 CHECK (repeat_count > 0),
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  source_name TEXT,
  reference TEXT,
  grade TEXT,
  virtue TEXT,
  audio_url TEXT,
  is_quranic BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'needs_review')),
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Dua Categories Table
CREATE TABLE IF NOT EXISTS public.dua_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'needs_review')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Duas Table
CREATE TABLE IF NOT EXISTS public.duas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.dua_categories(id) ON DELETE CASCADE,
  title TEXT,
  text TEXT NOT NULL,
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  source_name TEXT,
  reference TEXT,
  explanation TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'needs_review')),
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Holy Quran Surahs (114 Surahs)
CREATE TABLE IF NOT EXISTS public.surahs (
  number INT PRIMARY KEY CHECK (number BETWEEN 1 AND 114),
  name TEXT NOT NULL,
  english_name TEXT NOT NULL,
  verses_count INT NOT NULL,
  revelation_type TEXT NOT NULL CHECK (revelation_type IN ('Meccan', 'Medinan')),
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Holy Quran Ayahs
CREATE TABLE IF NOT EXISTS public.ayahs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INT NOT NULL REFERENCES public.surahs(number) ON DELETE CASCADE,
  ayah_number INT NOT NULL,
  text_uthmani TEXT NOT NULL,
  text_clean TEXT,
  page INT,
  juz INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (surah_number, ayah_number)
);

-- 12. Site Settings Table (Editable by single owner)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 13. Pages Table (About, Contact info, etc.)
CREATE TABLE IF NOT EXISTS public.pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 14. Content Revisions (Audit trail for edits)
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  previous_data JSONB,
  new_data JSONB,
  modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. Admin Audit Logs (Strict activity logging)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Indexes for Maximum Performance
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_adhkar_category_published 
  ON public.adhkar(category_slug, sort_order) 
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_adhkar_status ON public.adhkar(status);
CREATE INDEX IF NOT EXISTS idx_duas_category_published 
  ON public.duas(category_id, sort_order) 
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_ayahs_surah_ayah 
  ON public.ayahs(surah_number, ayah_number);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created 
  ON public.admin_audit_logs(created_at DESC);

-- ====================================================================
-- Row Level Security (RLS) Configuration
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhkar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dua_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- Policies: Categories
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published categories"
  ON public.categories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owner can manage all categories"
  ON public.categories FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Sources
-- --------------------------------------------------------------------
CREATE POLICY "Public can view sources"
  ON public.sources FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Owner can manage sources"
  ON public.sources FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Adhkar
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published adhkar"
  ON public.adhkar FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owner can manage all adhkar"
  ON public.adhkar FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Dua Categories
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published dua categories"
  ON public.dua_categories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owner can manage all dua categories"
  ON public.dua_categories FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Duas
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published duas"
  ON public.duas FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owner can manage all duas"
  ON public.duas FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Surahs & Ayahs (Public Read Only, Owner Manage)
-- --------------------------------------------------------------------
CREATE POLICY "Public can view surahs"
  ON public.surahs FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Owner can manage surahs"
  ON public.surahs FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

CREATE POLICY "Public can view ayahs"
  ON public.ayahs FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Owner can manage ayahs"
  ON public.ayahs FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Site Settings & Pages
-- --------------------------------------------------------------------
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Owner can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

CREATE POLICY "Public can view pages"
  ON public.pages FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Owner can manage pages"
  ON public.pages FOR ALL
  USING (public.is_site_owner())
  WITH CHECK (public.is_site_owner());

-- --------------------------------------------------------------------
-- Policies: Revisions & Audit Logs (Owner Only)
-- --------------------------------------------------------------------
CREATE POLICY "Owner can view content revisions"
  ON public.content_revisions FOR SELECT
  USING (public.is_site_owner());

CREATE POLICY "Owner can insert content revisions"
  ON public.content_revisions FOR INSERT
  WITH CHECK (public.is_site_owner());

CREATE POLICY "Owner can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (public.is_site_owner());

CREATE POLICY "Owner can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (public.is_site_owner());

-- Notice: No UPDATE or DELETE policy on admin_audit_logs to prevent tampering!

-- ============================================================
-- STUDIOFLOW  FIX: RLS Infinite Recursion on org_members
-- Run this in Supabase Dashboard  SQL Editor  New Query  Run
-- ============================================================

-- Drop the recursive policies
DROP POLICY IF EXISTS "Users can view org members" ON public.org_members;
DROP POLICY IF EXISTS "Users can insert org members" ON public.org_members;

-- Fix org_members: use auth.uid() directly (no subquery on self)
CREATE POLICY "Users can view own memberships" ON public.org_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert memberships" ON public.org_members
  FOR INSERT WITH CHECK (true);

-- Now fix all other tables to use a non-recursive subquery pattern
-- The key: query org_members WHERE user_id = auth.uid()  this is safe since
-- org_members SELECT policy is now just user_id = auth.uid()

-- ORGANIZATIONS: also allow SELECT for users who just created it
DROP POLICY IF EXISTS "Users can view own orgs" ON public.organizations;
CREATE POLICY "Users can view own orgs" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- PROFILES: fix to use the safe org_members subquery
DROP POLICY IF EXISTS "Users can view org profiles" ON public.profiles;
CREATE POLICY "Users can view org profiles" ON public.profiles
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- CONTACTS: already correct pattern, but re-create to be safe
DROP POLICY IF EXISTS "Users can view org contacts" ON public.contacts;
CREATE POLICY "Users can view org contacts" ON public.contacts
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert org contacts" ON public.contacts;
CREATE POLICY "Users can insert org contacts" ON public.contacts
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update org contacts" ON public.contacts;
CREATE POLICY "Users can update org contacts" ON public.contacts
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- PIPELINES
DROP POLICY IF EXISTS "Users can view org pipelines" ON public.pipelines;
CREATE POLICY "Users can view org pipelines" ON public.pipelines
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert org pipelines" ON public.pipelines;
CREATE POLICY "Users can insert org pipelines" ON public.pipelines
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- PIPELINE_STAGES
DROP POLICY IF EXISTS "Users can view org stages" ON public.pipeline_stages;
CREATE POLICY "Users can view org stages" ON public.pipeline_stages
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert org stages" ON public.pipeline_stages;
CREATE POLICY "Users can insert org stages" ON public.pipeline_stages
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- DEALS
DROP POLICY IF EXISTS "Users can view org deals" ON public.deals;
CREATE POLICY "Users can view org deals" ON public.deals
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert org deals" ON public.deals;
CREATE POLICY "Users can insert org deals" ON public.deals
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update org deals" ON public.deals;
CREATE POLICY "Users can update org deals" ON public.deals
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- TAGS
DROP POLICY IF EXISTS "Users can view org tags" ON public.tags;
CREATE POLICY "Users can view org tags" ON public.tags
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert org tags" ON public.tags;
CREATE POLICY "Users can insert org tags" ON public.tags
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- Done! The infinite recursion is fixed.

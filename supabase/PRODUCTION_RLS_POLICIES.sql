-- =====================================================
-- PRODUCTION RLS POLICIES
-- S.R.B ENGINEERING & CONSTRUCTION
-- =====================================================
-- These policies provide proper security:
-- - Public READ for projects, services, team, stats
-- - Authenticated WRITE (insert/update/delete) for admin
-- - Contact messages: anyone can submit, only admin can view
-- =====================================================

-- =====================================================
-- OPTION A: Using Supabase Auth (Recommended)
-- =====================================================
-- This requires setting up a Supabase Auth user for admin.
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Create: email: info@srbeng.com, password: [secure password]

-- First, drop all existing "anyone can" policies
drop policy if exists "anyone can insert projects" on public.projects;
drop policy if exists "anyone can update projects" on public.projects;
drop policy if exists "anyone can delete projects" on public.projects;

drop policy if exists "anyone can insert services" on public.services;
drop policy if exists "anyone can update services" on public.services;
drop policy if exists "anyone can delete services" on public.services;

drop policy if exists "anyone can insert team_members" on public.team_members;
drop policy if exists "anyone can update team_members" on public.team_members;
drop policy if exists "anyone can delete team_members" on public.team_members;

drop policy if exists "anyone can insert stats" on public.stats;
drop policy if exists "anyone can update stats" on public.stats;
drop policy if exists "anyone can delete stats" on public.stats;

-- Create authenticated-only write policies for projects
create policy "authenticated users can insert projects" 
  on public.projects for insert 
  to authenticated 
  with check (true);

create policy "authenticated users can update projects" 
  on public.projects for update 
  to authenticated 
  using (true);

create policy "authenticated users can delete projects" 
  on public.projects for delete 
  to authenticated 
  using (true);

-- Create authenticated-only write policies for services
create policy "authenticated users can insert services" 
  on public.services for insert 
  to authenticated 
  with check (true);

create policy "authenticated users can update services" 
  on public.services for update 
  to authenticated 
  using (true);

create policy "authenticated users can delete services" 
  on public.services for delete 
  to authenticated 
  using (true);

-- Create authenticated-only write policies for team_members
create policy "authenticated users can insert team_members" 
  on public.team_members for insert 
  to authenticated 
  with check (true);

create policy "authenticated users can update team_members" 
  on public.team_members for update 
  to authenticated 
  using (true);

create policy "authenticated users can delete team_members" 
  on public.team_members for delete 
  to authenticated 
  using (true);

-- Create authenticated-only write policies for stats
create policy "authenticated users can insert stats" 
  on public.stats for insert 
  to authenticated 
  with check (true);

create policy "authenticated users can update stats" 
  on public.stats for update 
  to authenticated 
  using (true);

create policy "authenticated users can delete stats" 
  on public.stats for delete 
  to authenticated 
  using (true);

-- Contact messages: anyone can submit, only authenticated can view
drop policy if exists "anyone can submit contact messages" on public.contact_messages;

create policy "anyone can submit contact messages" 
  on public.contact_messages for insert 
  with check (true);

create policy "authenticated users can view contact messages" 
  on public.contact_messages for select 
  to authenticated 
  using (true);

create policy "authenticated users can update contact messages" 
  on public.contact_messages for update 
  to authenticated 
  using (true);

create policy "authenticated users can delete contact messages" 
  on public.contact_messages for delete 
  to authenticated 
  using (true);

-- =====================================================
-- OPTION B: Using Service Role Key (Alternative)
-- =====================================================
-- If you prefer to keep client-side auth simple and use 
-- the service role key for admin operations, the current
-- development policies work BUT you must:
-- 1. Never expose the service role key in client code
-- 2. Use a server-side function (Edge Function) for admin ops
-- 3. The anon key should only allow public reads

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify policies are set correctly:

-- Check all policies on projects table:
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'projects';

-- Check all policies on services table:
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'services';

-- Fix RLS policies to allow public CRUD operations
-- This is needed because the frontend uses the anon key, not authenticated users

-- Drop existing restrictive policies
drop policy if exists "admins can manage projects" on public.projects;
drop policy if exists "admins can delete projects" on public.projects;
drop policy if exists "admins can insert projects" on public.projects;

drop policy if exists "admins can manage services" on public.services;
drop policy if exists "admins can delete services" on public.services;
drop policy if exists "admins can insert services" on public.services;

-- Create permissive policies for projects (public CRUD)
create policy "anyone can insert projects" on public.projects for insert with check (true);
create policy "anyone can update projects" on public.projects for update using (true);
create policy "anyone can delete projects" on public.projects for delete using (true);

-- Create permissive policies for services (public CRUD)
create policy "anyone can insert services" on public.services for insert with check (true);
create policy "anyone can update services" on public.services for update using (true);
create policy "anyone can delete services" on public.services for delete using (true);

-- Allow CRUD on team_members
create policy "anyone can insert team_members" on public.team_members for insert with check (true);
create policy "anyone can update team_members" on public.team_members for update using (true);
create policy "anyone can delete team_members" on public.team_members for delete using (true);

-- Allow CRUD on stats
create policy "anyone can insert stats" on public.stats for insert with check (true);
create policy "anyone can update stats" on public.stats for update using (true);
create policy "anyone can delete stats" on public.stats for delete using (true);

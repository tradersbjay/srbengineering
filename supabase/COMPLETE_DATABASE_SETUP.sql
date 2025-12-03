-- =====================================================
-- S.R.B ENGINEERING COMPLETE DATABASE SETUP
-- Run this entire script in your Supabase SQL Editor
-- Project: zenpcuwtvdetqpncwlmm.supabase.co
-- =====================================================

-- Enable required extensions
create extension if not exists pgcrypto;

-- =====================================================
-- STEP 1: Create Tables
-- =====================================================

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  category text not null,
  description text,
  image text,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  qualifications jsonb default '[]'::jsonb,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stats (counters displayed on site)
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value integer not null default 0,
  suffix text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contact messages (store form submissions)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone_number text,
  email_address text not null,
  interested_service text,
  message text,
  received_at timestamptz default now(),
  handled boolean default false
);

-- Admin users (optional, hashed password)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- =====================================================
-- STEP 2: Create Trigger Function
-- =====================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists trg_team_updated_at on public.team_members;
create trigger trg_team_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

drop trigger if exists trg_stats_updated_at on public.stats;
create trigger trg_stats_updated_at
  before update on public.stats
  for each row execute function public.set_updated_at();

-- =====================================================
-- STEP 3: Enable RLS and Create Policies
-- =====================================================

-- Enable RLS on all tables
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.stats enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- Drop existing policies if they exist
drop policy if exists "projects are publicly readable" on public.projects;
drop policy if exists "anyone can insert projects" on public.projects;
drop policy if exists "anyone can update projects" on public.projects;
drop policy if exists "anyone can delete projects" on public.projects;

drop policy if exists "services are publicly readable" on public.services;
drop policy if exists "anyone can insert services" on public.services;
drop policy if exists "anyone can update services" on public.services;
drop policy if exists "anyone can delete services" on public.services;

drop policy if exists "team members are publicly readable" on public.team_members;
drop policy if exists "anyone can insert team_members" on public.team_members;
drop policy if exists "anyone can update team_members" on public.team_members;
drop policy if exists "anyone can delete team_members" on public.team_members;

drop policy if exists "stats are publicly readable" on public.stats;
drop policy if exists "anyone can insert stats" on public.stats;
drop policy if exists "anyone can update stats" on public.stats;
drop policy if exists "anyone can delete stats" on public.stats;

drop policy if exists "anyone can submit contact messages" on public.contact_messages;

-- PUBLIC READ policies
create policy "projects are publicly readable" on public.projects for select using (true);
create policy "services are publicly readable" on public.services for select using (true);
create policy "team members are publicly readable" on public.team_members for select using (true);
create policy "stats are publicly readable" on public.stats for select using (true);

-- PUBLIC CRUD policies (for development/admin)
create policy "anyone can insert projects" on public.projects for insert with check (true);
create policy "anyone can update projects" on public.projects for update using (true);
create policy "anyone can delete projects" on public.projects for delete using (true);

create policy "anyone can insert services" on public.services for insert with check (true);
create policy "anyone can update services" on public.services for update using (true);
create policy "anyone can delete services" on public.services for delete using (true);

create policy "anyone can insert team_members" on public.team_members for insert with check (true);
create policy "anyone can update team_members" on public.team_members for update using (true);
create policy "anyone can delete team_members" on public.team_members for delete using (true);

create policy "anyone can insert stats" on public.stats for insert with check (true);
create policy "anyone can update stats" on public.stats for update using (true);
create policy "anyone can delete stats" on public.stats for delete using (true);

-- Contact messages (anyone can submit)
create policy "anyone can submit contact messages" on public.contact_messages for insert with check (true);

-- =====================================================
-- STEP 4: Create Indexes
-- =====================================================

create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_year on public.projects(year);
create index if not exists idx_services_title on public.services(title);
create index if not exists idx_contact_messages_email on public.contact_messages(email_address);
create index if not exists idx_contact_messages_received on public.contact_messages(received_at);
create index if not exists idx_team_members_role on public.team_members(role);

-- =====================================================
-- STEP 5: Seed Initial Data
-- =====================================================

-- Insert sample projects
INSERT INTO public.projects (title, year, category, location, image, description) VALUES
('Shrestha Family Residence', '2023', 'Residential', 'Kathmandu', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Modern 3-story family home with traditional Nepali architectural elements'),
('Himalayan View Hotel', '2022', 'Commercial', 'Pokhara', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '45-room boutique hotel with stunning mountain views'),
('Prefab Steel Warehouse', '2024', 'Steel/Prefab', 'Birgunj', 'https://images.unsplash.com/photo-1553246969-7dcb4e9e1b75?w=800', '10,000 sqft industrial warehouse with steel frame construction'),
('Gurung Community Hall', '2023', 'Commercial', 'Gorkha', 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800', 'Multi-purpose community center for local events'),
('Thapa Luxury Villa', '2024', 'Residential', 'Lalitpur', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', '4-bedroom luxury villa with rooftop garden'),
('Sunrise Office Complex', '2023', 'Commercial', 'Kathmandu', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', '8-story modern office building in the business district'),
('Quick-Build School Annex', '2024', 'Steel/Prefab', 'Chitwan', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', 'Prefab classroom building completed in just 3 months')
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO public.services (title, description, icon) VALUES
('Residential Construction', 'Custom home building from foundation to finish. We specialize in modern Nepali homes that blend traditional aesthetics with contemporary comfort and earthquake-resistant design.', 'home'),
('Commercial Buildings', 'Office complexes, retail spaces, hotels, and industrial facilities. Our commercial projects meet international standards while respecting local building codes.', 'building2'),
('Steel & Prefab Structures', 'Fast-track construction using prefabricated steel components. Ideal for warehouses, factories, schools, and quick-build projects with tight deadlines.', 'warehouse'),
('Renovation & Retrofitting', 'Modernize existing structures with earthquake retrofitting, interior renovation, and structural upgrades. Breathe new life into old buildings.', 'wrench'),
('Architectural Design', 'Complete architectural services from concept to construction documents. 3D visualization and sustainable design options available.', 'compass'),
('Project Management', 'End-to-end project management ensuring on-time, on-budget delivery. We handle permits, contractors, and quality control so you don''t have to.', 'clipboard-list')
ON CONFLICT DO NOTHING;

-- Insert team members
INSERT INTO public.team_members (name, role, qualifications, image) VALUES
('Shashank Sharma', 'Founder & Lead Engineer', '["B.E. Civil Engineering", "15+ Years Experience", "Licensed Structural Engineer"]', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'),
('Priya Thapa', 'Senior Architect', '["M.Arch Architecture", "LEED Certified", "10+ Years Experience"]', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'),
('Rajesh Gurung', 'Project Manager', '["MBA Construction Management", "PMP Certified", "8+ Years Experience"]', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION: Check that everything was created
-- =====================================================

-- Show table counts
SELECT 'projects' as table_name, count(*) as row_count FROM public.projects
UNION ALL
SELECT 'services', count(*) FROM public.services
UNION ALL
SELECT 'team_members', count(*) FROM public.team_members
UNION ALL
SELECT 'contact_messages', count(*) FROM public.contact_messages;

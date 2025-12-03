-- Create core tables for SRB Engineering website

-- Enable required extensions
create extension if not exists pgcrypto;

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

-- Trigger functions to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger trg_team_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

create trigger trg_stats_updated_at
  before update on public.stats
  for each row execute function public.set_updated_at();

-- Convenience functions (basic CRUD)

-- Add project
create or replace function public.add_project(
  _title text,
  _year text,
  _category text,
  _description text,
  _image text,
  _location text
) returns public.projects as $$
declare
  p public.projects%rowtype;
begin
  insert into public.projects(title, year, category, description, image, location)
  values (_title, _year, _category, _description, _image, _location)
  returning * into p;
  return p;
end;
$$ language plpgsql security definer;

-- Update project (partial fields via jsonb)
create or replace function public.update_project(_id uuid, _patch jsonb)
returns public.projects as $$
declare
  cur public.projects%rowtype;
  q text;
begin
  -- apply patch fields
  update public.projects set
    title = coalesce(_patch->>'title', title),
    year = coalesce(_patch->>'year', year),
    category = coalesce(_patch->>'category', category),
    description = coalesce(_patch->>'description', description),
    image = coalesce(_patch->>'image', image),
    location = coalesce(_patch->>'location', location),
    updated_at = now()
  where id = _id
  returning * into cur;
  return cur;
end;
$$ language plpgsql security definer;

-- Delete project
create or replace function public.delete_project(_id uuid)
returns void as $$
begin
  delete from public.projects where id = _id;
end;
$$ language plpgsql security definer;

-- Add service
create or replace function public.add_service(_title text, _description text, _icon text)
returns public.services as $$
declare s public.services%rowtype; begin
  insert into public.services(title, description, icon) values (_title, _description, _icon) returning * into s; return s; end;
$$ language plpgsql security definer;

-- Update service
create or replace function public.update_service(_id uuid, _patch jsonb)
returns public.services as $$
declare cur public.services%rowtype; begin
  update public.services set
    title = coalesce(_patch->>'title', title),
    description = coalesce(_patch->>'description', description),
    icon = coalesce(_patch->>'icon', icon),
    updated_at = now()
  where id = _id
  returning * into cur;
  return cur;
end;
$$ language plpgsql security definer;

-- Add team member
create or replace function public.add_team_member(_name text, _role text, _qualifications jsonb, _image text)
returns public.team_members as $$
declare t public.team_members%rowtype; begin
  insert into public.team_members(name, role, qualifications, image) values (_name, _role, _qualifications, _image) returning * into t; return t; end;
$$ language plpgsql security definer;

-- Insert contact message
create or replace function public.insert_contact_message(
  _full_name text,
  _phone text,
  _email text,
  _interested_service text,
  _message text
) returns public.contact_messages as $$
declare m public.contact_messages%rowtype; begin
  insert into public.contact_messages(full_name, phone_number, email_address, interested_service, message) values (_full_name, _phone, _email, _interested_service, _message) returning * into m; return m; end;
$$ language plpgsql security definer;

-- Simple select functions for frontend convenience
create or replace function public.get_projects() returns setof public.projects as $$
  select * from public.projects order by created_at desc;
$$ language sql stable;

create or replace function public.get_services() returns setof public.services as $$
  select * from public.services order by created_at desc;
$$ language sql stable;

create or replace function public.get_team_members() returns setof public.team_members as $$
  select * from public.team_members order by created_at desc;
$$ language sql stable;

create or replace function public.get_stats() returns setof public.stats as $$
  select * from public.stats order by label asc;
$$ language sql stable;

-- Storage bucket setup (for project images, team photos, etc.)
-- Note: Bucket creation via SQL is limited; RLS policies are set here

-- Enable RLS on all tables
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.stats enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- Policies for public read (anonymous users can view projects, services, etc.)
create policy "projects are publicly readable" on public.projects for select using (true);
create policy "services are publicly readable" on public.services for select using (true);
create policy "team members are publicly readable" on public.team_members for select using (true);
create policy "stats are publicly readable" on public.stats for select using (true);

-- Policies for insert contact messages (public, no auth required)
create policy "anyone can submit contact messages" on public.contact_messages for insert with check (true);

-- Policies for admin operations (authenticated users only - restrict as needed)
create policy "admins can manage projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "admins can delete projects" on public.projects for delete using (auth.role() = 'authenticated');
create policy "admins can insert projects" on public.projects for insert with check (auth.role() = 'authenticated');

create policy "admins can manage services" on public.services for update using (auth.role() = 'authenticated');
create policy "admins can delete services" on public.services for delete using (auth.role() = 'authenticated');
create policy "admins can insert services" on public.services for insert with check (auth.role() = 'authenticated');

-- Indexes for better query performance
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_year on public.projects(year);
create index if not exists idx_services_title on public.services(title);
create index if not exists idx_contact_messages_email on public.contact_messages(email_address);
create index if not exists idx_contact_messages_received on public.contact_messages(received_at);
create index if not exists idx_team_members_role on public.team_members(role);

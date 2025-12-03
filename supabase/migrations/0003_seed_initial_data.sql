-- Seed initial data for SRB Engineering website

-- Insert initial projects
insert into public.projects (title, year, category, description, image, location) values
('Commercial Complex Development', '2023', 'Commercial', 'Modern commercial complex with 50,000 sq ft of office and retail space', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Downtown District'),
('Residential Township', '2022', 'Residential', 'Large-scale residential township with 500+ units and amenities', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800', 'Suburban Area'),
('Steel Frame Factory', '2023', 'Steel/Prefab', 'Industrial facility with prefabricated steel structure', 'https://images.unsplash.com/photo-1478860409698-8707c313ee8b?w=800', 'Industrial Zone'),
('Infrastructure Consulting', '2024', 'Consulting', 'Strategic consulting for major infrastructure project', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'Regional'),
('Mixed-Use Development', '2023', 'Commercial', 'Combined retail, office and residential spaces', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'City Center')
on conflict do nothing;

-- Insert initial services
insert into public.services (title, description, icon) values
('Design & Build', 'Complete design and construction services from concept to completion', 'building2'),
('Project Management', 'Professional project oversight and management throughout execution', 'clipboard'),
('Structural Engineering', 'Expert structural design and engineering solutions', 'zap'),
('Consulting Services', 'Strategic consulting for engineering and construction projects', 'briefcase'),
('Quality Assurance', 'Rigorous QA and testing for all construction phases', 'checkCircle')
on conflict do nothing;

-- Insert initial team members
insert into public.team_members (name, role, qualifications, image) values
('Shashank Kumar', 'CEO & Founder', '["B.Tech Civil Engineering", "15+ years industry experience", "Certified Project Manager"]'::jsonb, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('Rajesh Singh', 'Chief Technical Officer', '["M.Tech Structural Engineering", "12+ years technical leadership", "ISO 9001 Certified"]'::jsonb, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
('Priya Sharma', 'Project Manager', '["B.Tech Civil Engineering", "8+ years project management", "PMP Certified"]'::jsonb, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400')
on conflict do nothing;

-- Insert initial stats
insert into public.stats (label, value, suffix) values
('Projects Completed', 45, ''),
('Years of Experience', 15, '+'),
('Team Members', 32, ''),
('Client Satisfaction', 98, '%')
on conflict do nothing;

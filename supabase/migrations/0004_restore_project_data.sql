-- Migration: Restore all original S.R.B Engineering project data

-- Insert all 7 projects
INSERT INTO public.projects (id, title, year, category, location, image, description, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Lagankhel Commercial Complex', '2025-Ongoing', 'Commercial', 'Lagankhel, Lalitpur', 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?auto=format&fit=crop&q=80&w=1200', 'An ambitious ongoing commercial complex construction featuring advanced reinforced concrete structure designed for high-traffic retail and office spaces. Currently in the structural framing phase.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Manbhawan Residence', '2022-2024', 'Residential', 'Manbhawan, Lalitpur', 'https://images.unsplash.com/photo-1600596542815-6ad4c7213aa5?auto=format&fit=crop&q=80&w=1200', 'A complete design and build project for a modern luxury residence. Features include a contemporary facade, energy-efficient lighting, and a rooftop garden with panoramic views.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Paknajol Residence Extension', '2023-24', 'Residential', 'Paknajol, Kathmandu', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200', 'Vertical extension and structural reinforcement of an existing residence. Utilized lightweight steel structures to ensure safety while adding significant living space.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Sathghumti Commercial', '2019-2022', 'Commercial', 'Thamel, Kathmandu', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200', 'Development of a multi-story commercial building in the heart of the tourist district. Designed to maximize floor area while adhering to strict zoning regulations.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Thamel Mixed-Use Complex', '2018-2020', 'Commercial', 'Thamel, Kathmandu', 'https://images.unsplash.com/photo-1577761133163-475b7dc7828f?auto=format&fit=crop&q=80&w=1200', 'Construction of a dynamic mixed-use complex combining retail on lower floors with hospitality suites above. Successfully navigated complex site logistics in a busy urban area.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Kaldhara Prefab House', '2019', 'Steel/Prefab', 'Kaldhara, Kathmandu', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', 'Rapid construction of a prefabricated steel structure house. This project demonstrated the speed and efficiency of modern prefab technologies for residential needs.', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, 'Kamalpokhari Residence', '2018-2020', 'Residential', 'Kamalpokhari, Kathmandu', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1200', 'Complete residential construction project delivered with excellence, focusing on traditional aesthetics blended with modern structural stability.', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert all 6 services
INSERT INTO public.services (id, title, description, icon, created_at, updated_at)
VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, 'Design & Build', 'End-to-end construction services from architectural planning to final handover, ensuring seamless execution.', 'building2', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440002'::uuid, 'Structural Engineering', 'Expert structural analysis, design, and retrofitting to ensure safety and durability of buildings.', 'ruler', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440003'::uuid, 'Green Energy Solutions', 'Consultancy and implementation of sustainable energy systems including solar power and energy-efficient designs.', 'zap', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440004'::uuid, 'Water Supply Engineering', 'Design and management of water supply systems, drainage, and sanitation for residential and commercial projects.', 'droplets', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440005'::uuid, 'Prefab & Steel Structures', 'Specialized construction of pre-engineered buildings and steel structures for rapid and robust development.', 'hard-hat', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440006'::uuid, 'Project Estimation', 'Detailed cost estimation, valuation, and quantity surveying to maximize value for money.', 'pencil-ruler', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440007'::uuid, 'Engineering Consulting', 'Comprehensive engineering consulting services, offering technical guidance, feasibility assessments, detailed engineering design, project management support, and sustainable infrastructure solutions.', 'pencil-ruler', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT 'Projects restored' as status, COUNT(*) as project_count FROM public.projects
UNION ALL
SELECT 'Services restored' as status, COUNT(*) as service_count FROM public.services;

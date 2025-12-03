-- Storage bucket setup for SRB Engineering

-- Insert buckets
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('team-photos', 'team-photos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('service-assets', 'service-assets', true) on conflict (id) do nothing;

-- RLS policies for project-images
create policy "Project images public read" on storage.objects for select using (bucket_id = 'project-images');
create policy "Project images auth upload" on storage.objects for insert with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
create policy "Project images auth delete" on storage.objects for delete using (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- RLS policies for team-photos
create policy "Team photos public read" on storage.objects for select using (bucket_id = 'team-photos');
create policy "Team photos auth upload" on storage.objects for insert with check (bucket_id = 'team-photos' and auth.role() = 'authenticated');
create policy "Team photos auth delete" on storage.objects for delete using (bucket_id = 'team-photos' and auth.role() = 'authenticated');

-- RLS policies for service-assets
create policy "Service assets public read" on storage.objects for select using (bucket_id = 'service-assets');
create policy "Service assets auth upload" on storage.objects for insert with check (bucket_id = 'service-assets' and auth.role() = 'authenticated');
create policy "Service assets auth delete" on storage.objects for delete using (bucket_id = 'service-assets' and auth.role() = 'authenticated');

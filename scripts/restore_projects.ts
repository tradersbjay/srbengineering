#!/usr/bin/env node

/**
 * Script to restore all S.R.B Engineering project data to Supabase
 * Run with: npx tsx scripts/restore_projects.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zenpcuwtvdetqpncwlmm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbnBjdXd0dmRldHFwbmN3bG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjQyMDUsImV4cCI6MjA4MDM0MDIwNX0.BfXneJHwf0HLkrGU6gVxagTwjwph65Plq3g663NulLk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PROJECTS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Lagankhel Commercial Complex',
    year: '2025-Ongoing',
    category: 'Commercial',
    location: 'Lagankhel, Lalitpur',
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?auto=format&fit=crop&q=80&w=1200',
    description: 'An ambitious ongoing commercial complex construction featuring advanced reinforced concrete structure designed for high-traffic retail and office spaces. Currently in the structural framing phase.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Manbhawan Residence',
    year: '2022-2024',
    category: 'Residential',
    location: 'Manbhawan, Lalitpur',
    image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7213aa5?auto=format&fit=crop&q=80&w=1200',
    description: 'A complete design and build project for a modern luxury residence. Features include a contemporary facade, energy-efficient lighting, and a rooftop garden with panoramic views.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Paknajol Residence Extension',
    year: '2023-24',
    category: 'Residential',
    location: 'Paknajol, Kathmandu',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
    description: 'Vertical extension and structural reinforcement of an existing residence. Utilized lightweight steel structures to ensure safety while adding significant living space.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Sathghumti Commercial',
    year: '2019-2022',
    category: 'Commercial',
    location: 'Thamel, Kathmandu',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200',
    description: 'Development of a multi-story commercial building in the heart of the tourist district. Designed to maximize floor area while adhering to strict zoning regulations.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Thamel Mixed-Use Complex',
    year: '2018-2020',
    category: 'Commercial',
    location: 'Thamel, Kathmandu',
    image: 'https://images.unsplash.com/photo-1577761133163-475b7dc7828f?auto=format&fit=crop&q=80&w=1200',
    description: 'Construction of a dynamic mixed-use complex combining retail on lower floors with hospitality suites above. Successfully navigated complex site logistics in a busy urban area.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Kaldhara Prefab House',
    year: '2019',
    category: 'Steel/Prefab',
    location: 'Kaldhara, Kathmandu',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    description: 'Rapid construction of a prefabricated steel structure house. This project demonstrated the speed and efficiency of modern prefab technologies for residential needs.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: 'Kamalpokhari Residence',
    year: '2018-2020',
    category: 'Residential',
    location: 'Kamalpokhari, Kathmandu',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1200',
    description: 'Complete residential construction project delivered with excellence, focusing on traditional aesthetics blended with modern structural stability.'
  }
];

const SERVICES = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    title: 'Design & Build',
    description: 'End-to-end construction services from architectural planning to final handover, ensuring seamless execution.',
    icon: 'building2'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    title: 'Structural Engineering',
    description: 'Expert structural analysis, design, and retrofitting to ensure safety and durability of buildings.',
    icon: 'ruler'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    title: 'Green Energy Solutions',
    description: 'Consultancy and implementation of sustainable energy systems including solar power and energy-efficient designs.',
    icon: 'zap'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    title: 'Water Supply Engineering',
    description: 'Design and management of water supply systems, drainage, and sanitation for residential and commercial projects.',
    icon: 'droplets'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    title: 'Prefab & Steel Structures',
    description: 'Specialized construction of pre-engineered buildings and steel structures for rapid and robust development.',
    icon: 'hard-hat'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440006',
    title: 'Project Estimation',
    description: 'Detailed cost estimation, valuation, and quantity surveying to maximize value for money.',
    icon: 'pencil-ruler'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440007',
    title: 'Engineering Consulting',
    description: 'Comprehensive engineering consulting services, offering technical guidance, feasibility assessments, detailed engineering design, project management support, and sustainable infrastructure solutions.',
    icon: 'pencil-ruler'
  }
];

async function restoreData() {
  try {
    console.log('🔄 Starting data restoration...\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    const { error: deleteProjectsError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    const { error: deleteServicesError } = await supabase
      .from('services')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteProjectsError) console.warn('⚠️ Error clearing projects:', deleteProjectsError.message);
    if (deleteServicesError) console.warn('⚠️ Error clearing services:', deleteServicesError.message);

    // Insert projects
    console.log('\n📁 Inserting projects...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .insert(PROJECTS)
      .select();

    if (projectsError) {
      console.error('❌ Error inserting projects:', projectsError.message);
      throw projectsError;
    }
    console.log(`✅ Successfully inserted ${projectsData?.length || 0} projects`);

    // Insert services
    console.log('\n🔧 Inserting services...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert(SERVICES)
      .select();

    if (servicesError) {
      console.error('❌ Error inserting services:', servicesError.message);
      throw servicesError;
    }
    console.log(`✅ Successfully inserted ${servicesData?.length || 0} services`);

    console.log('\n✨ Data restoration completed successfully!');
    console.log(`
📊 Summary:
   • Projects: ${projectsData?.length || 0} / 7
   • Services: ${servicesData?.length || 0} / 7
    `);

  } catch (error) {
    console.error('\n❌ Restoration failed:', error);
    process.exit(1);
  }
}

restoreData();

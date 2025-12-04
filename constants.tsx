import React from 'react';
import { TeamMember, Project, Service, Stat } from './types';
import {
  Building2,
  Ruler,
  Zap,
  Droplets,
  HardHat,
  PencilRuler
} from 'lucide-react';

export const COMPANY_INFO = {
  name: "S.R.B Engineering & Construction Pvt. Ltd.",
  regNo: "191448/74/075",
  established: 2018,
  address: "KA. MA. PA-16, Kathmandu",
  phone: "+977 9843919796",
  email: "info@srbeng.com",
  tagline: "Design & Build Solutions Since 2018",
  description: "S.R.B Engineering & Construction Pvt. Ltd. is a dynamic company, established in 2018, specializes in delivering end-to-end construction solutions. We combine innovative design, engineering expertise, and quality craftsmanship to bring our clients’ visions to life.\n In addition to turnkey construction services, we also provide comprehensive engineering consulting services, offering technical guidance, feasibility assessments, detailed engineering design, project management support, and sustainable infrastructure solutions tailored to client needs."
};

export const MISSION_VISION = {
  mission: "Our mission is to provide end-to-end construction and engineering consulting services that combine creativity, technical excellence, and reliable project execution. We are committed to: \n •Delivering high-quality, sustainable, and cost-effective solutions.\n •Leveraging innovation and engineering expertise to meet evolving client needs.\n •Ensuring transparency, safety, and professionalism in all our projects.\n •Building long-term relationships through trust, integrity, and exceptional service.",
  vision: "To become a trusted leader in sustainable design, engineering, and construction by delivering innovative, efficient, and resilient infrastructure that enhances communities and shapes a better future."
};

export const TEAM_MEMBERS: TeamMember[] = [
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Lagankhel Commercial Complex",
    year: "2025-Ongoing",
    category: "Commercial",
    location: "Lagankhel, Lalitpur",
    image: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?auto=format&fit=crop&q=80&w=1200", // High res construction site/commercial
    description: "An ambitious ongoing commercial complex construction featuring advanced reinforced concrete structure designed for high-traffic retail and office spaces. Currently in the structural framing phase."
  },
  {
    id: "p2",
    title: "Manbhawan Residence",
    year: "2022-2024",
    category: "Residential",
    location: "Manbhawan, Lalitpur",
    image: "https://images.unsplash.com/photo-1600596542815-6ad4c7213aa5?auto=format&fit=crop&q=80&w=1200", // Modern luxury house
    description: "A complete design and build project for a modern luxury residence. Features include a contemporary facade, energy-efficient lighting, and a rooftop garden with panoramic views."
  },
  {
    id: "p3",
    title: "Paknajol Residence Extension",
    year: "2023-24",
    category: "Residential",
    location: "Paknajol, Kathmandu",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200", // Construction/Extension work
    description: "Vertical extension and structural reinforcement of an existing residence. Utilized lightweight steel structures to ensure safety while adding significant living space."
  },
  {
    id: "p4",
    title: "Sathghumti Commercial",
    year: "2019-2022",
    category: "Commercial",
    location: "Thamel, Kathmandu",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200", // Modern commercial building
    description: "Development of a multi-story commercial building in the heart of the tourist district. Designed to maximize floor area while adhering to strict zoning regulations."
  },
  {
    id: "p5",
    title: "Thamel Mixed-Use Complex",
    year: "2018-2020",
    category: "Commercial",
    location: "Thamel, Kathmandu",
    image: "https://images.unsplash.com/photo-1577761133163-475b7dc7828f?auto=format&fit=crop&q=80&w=1200", // Busy street/commercial
    description: "Construction of a dynamic mixed-use complex combining retail on lower floors with hospitality suites above. Successfully navigated complex site logistics in a busy urban area."
  },
  {
    id: "p6",
    title: "Kaldhara Prefab House",
    year: "2019",
    category: "Steel/Prefab",
    location: "Kaldhara, Kathmandu",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", // Residential/Small house
    description: "Rapid construction of a prefabricated steel structure house. This project demonstrated the speed and efficiency of modern prefab technologies for residential needs."
  },
  {
    id: "p7",
    title: "Kamalpokhari Residence",
    year: "2018-2020",
    category: "Residential",
    location: "Kamalpokhari, Kathmandu",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1200", // House
    description: "Complete residential construction project delivered with excellence, focusing on traditional aesthetics blended with modern structural stability."
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "s1",
    title: "Design & Build",
    description: "End-to-end construction services from architectural planning to final handover, ensuring seamless execution.",
    icon: "building2"
  },
  {
    id: "s2",
    title: "Structural Engineering",
    description: "Expert structural analysis, design, and retrofitting to ensure safety and durability of buildings.",
    icon: "ruler"
  },
  {
    id: "s3",
    title: "Green Energy Solutions",
    description: "Consultancy and implementation of sustainable energy systems including solar power and energy-efficient designs.",
    icon: "zap"
  },
  {
    id: "s4",
    title: "Water Supply Engineering",
    description: "Design and management of water supply systems, drainage, and sanitation for residential and commercial projects.",
    icon: "droplets"
  },
  {
    id: "s5",
    title: "Prefab & Steel Structures",
    description: "Specialized construction of pre-engineered buildings and steel structures for rapid and robust development.",
    icon: "hard-hat"
  },
  {
    id: "s6",
    title: "Project Estimation",
    description: "Detailed cost estimation, valuation, and quantity surveying to maximize value for money.",
    icon: "pencil-ruler"
  }
];
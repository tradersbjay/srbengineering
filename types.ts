import React from 'react';

export interface TeamMember {
  name: string;
  role: string;
  qualifications: string[];
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Residential' | 'Commercial' | 'Steel/Prefab' | 'Consulting' | 'Other';
  description?: string;
  image: string;
  location: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string; // Icon name as string (e.g., "building2", "zap") for JSON serialization
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}
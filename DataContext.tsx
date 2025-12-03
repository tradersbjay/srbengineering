import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Service } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES } from './constants';
import { supabase } from './lib/supabase';

interface DataContextType {
  projects: Project[];
  services: Service[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getStats: () => { label: string; value: number; suffix?: string }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const useSupabaseBackend = !!supabaseUrl && !!supabaseAnonKey;

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from Supabase on mount
  useEffect(() => {
    if (!useSupabaseBackend) {
      console.log('Supabase not configured, using local data');
      setIsLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects from Supabase:', error);
          setProjects(INITIAL_PROJECTS);
        } else {
          console.log('Loaded projects from Supabase:', data);
          setProjects(data || INITIAL_PROJECTS);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setProjects(INITIAL_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [useSupabaseBackend]);

  // Fetch services from Supabase on mount
  useEffect(() => {
    if (!useSupabaseBackend) return;

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching services from Supabase:', error);
          setServices(INITIAL_SERVICES);
        } else {
          console.log('Loaded services from Supabase:', data);
          setServices(data || INITIAL_SERVICES);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setServices(INITIAL_SERVICES);
      }
    };

    fetchServices();
  }, [useSupabaseBackend]);

  const addProject = async (project: Project) => {
    console.log('Adding project:', project);

    if (!useSupabaseBackend) {
      setProjects(prev => [...prev, project]);
      return;
    }

    try {
      // Remove the ID - let the database generate a UUID
      const { id, ...projectWithoutId } = project;
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectWithoutId])
        .select()
        .single();

      if (error) {
        console.error('Error adding project to Supabase:', error);
        alert('Failed to add project: ' + error.message);
      } else if (data) {
        console.log('Project added to Supabase:', data);
        setProjects(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add project:', err);
      alert('Failed to add project');
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    console.log('Updating project:', id, updatedProject);

    if (!useSupabaseBackend) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject } : p));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating project in Supabase:', error);
        alert('Failed to update project: ' + error.message);
      } else if (data && data.length > 0) {
        const updatedData = data[0];
        console.log('Project updated in Supabase:', updatedData);
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
      }
    } catch (err) {
      console.error('Failed to update project:', err);
      alert('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      if (!useSupabaseBackend) {
        setProjects(prev => prev.filter(p => p.id !== id));
        return;
      }

      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting project from Supabase:', error);
          alert('Failed to delete project: ' + error.message);
        } else {
          console.log('Project deleted from Supabase');
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const addService = async (service: Service) => {
    console.log('Adding service:', service);

    if (!useSupabaseBackend) {
      setServices(prev => [...prev, service]);
      return;
    }

    try {
      // Remove the ID - let the database generate a UUID
      const { id, ...serviceWithoutId } = service;
      
      const { data, error } = await supabase
        .from('services')
        .insert([serviceWithoutId])
        .select()
        .single();

      if (error) {
        console.error('Error adding service to Supabase:', error);
        alert('Failed to add service: ' + error.message);
      } else if (data) {
        console.log('Service added to Supabase:', data);
        setServices(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add service:', err);
      alert('Failed to add service');
    }
  };

  const updateService = async (id: string, updatedService: Partial<Service>) => {
    console.log('Updating service:', id, updatedService);

    if (!useSupabaseBackend) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedService } : s));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .update(updatedService)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating service in Supabase:', error);
        alert('Failed to update service: ' + error.message);
      } else if (data && data.length > 0) {
        const updatedData = data[0];
        console.log('Service updated in Supabase:', updatedData);
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
      }
    } catch (err) {
      console.error('Failed to update service:', err);
      alert('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      if (!useSupabaseBackend) {
        setServices(prev => prev.filter(s => s.id !== id));
        return;
      }

      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting service from Supabase:', error);
          alert('Failed to delete service: ' + error.message);
        } else {
          console.log('Service deleted from Supabase');
          setServices(prev => prev.filter(s => s.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete service:', err);
        alert('Failed to delete service');
      }
    }
  };

  const getStats = () => {
    // Calculate years of experience with March 31 as anniversary date
    const today = new Date();
    const currentYear = today.getFullYear();
    const annualAnniversary = new Date(currentYear, 2, 31); // March 31
    
    // If we haven't passed March 31 yet this year, use last year's anniversary
    let experience = currentYear - 2018;
    if (today < annualAnniversary) {
      experience = currentYear - 2018 - 1;
    }
    
    const residentialCount = projects.filter(p => p.category === 'Residential').length;
    const commercialCount = projects.filter(p => p.category === 'Commercial').length;
    const steelCount = projects.filter(p => p.category === 'Steel/Prefab').length;
    const consultingCount = projects.filter(p => p.category === 'Consulting').length;

    return [
      { label: "Years of Experience", value: experience, suffix: "+" },
      { label: "Residential Projects", value: residentialCount },
      { label: "Commercial Buildings", value: commercialCount },
      { label: "Steel/Prefab Structures", value: steelCount },
      { label: "Consulting Projects", value: consultingCount },
    ];
  };

  return (
    <DataContext.Provider value={{
      projects,
      services,
      addProject,
      updateProject,
      deleteProject,
      addService,
      updateService,
      deleteService,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
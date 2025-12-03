import React, { useState } from 'react';
import { useData } from '../DataContext';
import { X, Calendar, MapPin, Tag } from 'lucide-react';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { projects } = useData();
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Calculate unique categories from existing projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-brand-blue font-bold tracking-wider uppercase text-3xl mb-3">Our Portfolio</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-brand-blue text-white shadow-md transform scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-brand-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id || index} 
              onClick={() => openModal(project)}
              className="group relative overflow-hidden rounded-md shadow-md cursor-pointer hover:shadow-2xl transition-all duration-500 ease-out"
            >
              <div className="aspect-w-4 aspect-h-3 h-72 overflow-hidden bg-gray-200">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-brand-yellow text-xs font-bold text-black mb-2 rounded-sm shadow-sm">
                  {project.category}
                </span>
                <h4 className="text-white text-xl font-bold mb-1 drop-shadow-md">{project.title}</h4>
                <p className="text-gray-200 text-sm mb-3 flex items-center gap-2">
                  <MapPin size={14} /> {project.location}
                </p>
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <span className="mt-3 inline-block text-brand-yellow text-xs font-bold uppercase tracking-wider underline">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-fade-in-up">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white md:text-gray-800 md:bg-gray-100 md:hover:bg-gray-200 p-2 rounded-full transition-colors backdrop-blur-md md:backdrop-blur-none"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-brand-yellow text-black text-xs font-bold uppercase rounded-full">
                  {selectedProject.category}
                </span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{selectedProject.title}</h3>
              
              <div className="space-y-4 mb-8 text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin className="text-brand-blue shrink-0" size={20} />
                  <span>{selectedProject.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-brand-blue shrink-0" size={20} />
                  <span>{selectedProject.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="text-brand-blue shrink-0" size={20} />
                  <span>{selectedProject.category} Project</span>
                </div>
              </div>

              <div className="prose text-gray-600">
                <p className="leading-relaxed">
                  {selectedProject.description || "No description available for this project."}
                </p>
                <p className="mt-4">
                  This project highlights our commitment to quality, timely delivery, and engineering excellence. From initial concept to final handover, every detail was meticulously managed to meet the client's vision.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                  onClick={closeModal}
                  className="text-brand-blue font-bold hover:text-blue-800 transition-colors"
                >
                  &larr; Back to Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
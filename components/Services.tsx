import React from 'react';
import { useData } from '../DataContext';
import { getServiceIcon } from '../utils.tsx';

const Services: React.FC = () => {
  const { services } = useData();

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">What We Do</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Comprehensive Engineering and Construction Solutions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id || index} 
              className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-transparent hover:border-brand-blue group"
            >
              <div className="mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                {getServiceIcon(service.icon)}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
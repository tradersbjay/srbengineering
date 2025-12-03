import React from 'react';
import { scrollToSection } from '../utils.tsx';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative bg-brand-blue h-screen max-h-[800px] flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop" 
          alt="Modern Architecture" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="border-l-4 border-brand-yellow pl-6 mb-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Building Your <br />
              <span className="text-brand-yellow">Vision</span> Into Reality
            </h1>
          </div>
          
          <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
            S.R.B Engineering & Construction delivers tailored consulting and premium construction services, with sustainability and trust at the core of everything we do.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#projects" 
              onClick={(e) => scrollToSection(e, '#projects')}
              className="px-8 py-4 bg-brand-yellow hover:bg-yellow-400 text-black font-bold rounded-sm text-center transition-colors shadow-lg cursor-pointer"
            >
              View Our Projects
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, '#contact')}
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-brand-blue font-bold rounded-sm text-center transition-colors cursor-pointer"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
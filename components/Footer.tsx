import React from 'react';
import { COMPANY_INFO } from '../constants';
import { scrollToSection } from '../utils.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-4">
              <div className="w-14 h-6 md:w-20 md:h-8 bg-brand-yellow flex items-center justify-center font-bold text-black rounded text-xs md:text-lg flex-shrink-0">
                S.R.B.
              </div>
              <span className="font-bold text-sm md:text-xl tracking-tight line-clamp-2">Engineering & Construction</span>
            </div>
            <p className="text-gray-300 text-xs mt-2">
              Reg No: {COMPANY_INFO.regNo}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-yellow">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-100">
              <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="hover:text-brand-yellow transition-colors">Home</a></li>
              <li><a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-brand-yellow transition-colors">About Us</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="hover:text-brand-yellow transition-colors">Services</a></li>
              <li><a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-brand-yellow transition-colors">Projects</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:text-brand-yellow transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-yellow">Our Expertise</h4>
            <ul className="space-y-3 text-sm text-gray-100">
              <li>Construction & Design</li>
              <li>Structural Analysis</li>
              <li>Engineering Consulting Services</li>
              <li>Water Supply Systems</li>
              <li>Prefabricated Structures</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name} All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social placeholders */}
            <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Facebook</a>
            <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
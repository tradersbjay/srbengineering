import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils.tsx';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSSR, setIsSSR] = useState(true); // Server-side render flag

  // Initialize on client-side only
  useEffect(() => {
    setIsSSR(false);
    
    // Restore menu state from localStorage if available
    const storedState = isSSR ? null : localStorage.getItem('navbar-menu-open');
    if (storedState === 'true') {
      setIsOpen(true);
    }
  }, []);

  // Persist menu state to localStorage
  useEffect(() => {
    if (!isSSR) {
      localStorage.setItem('navbar-menu-open', isOpen ? 'true' : 'false');
    }
  }, [isOpen, isSSR]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (!isSSR && isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isSSR]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    scrollToSection(e, href);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100 min-h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full py-2 md:py-0">
          {/* Brand Logo - Responsive */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-2 md:gap-3 group transition-opacity hover:opacity-80"
              aria-label="S.R.B. Engineering & Construction - Home"
            >
              {/* Badge - Responsive Size */}
              <div className="w-12 h-6 md:w-20 md:h-10 bg-brand-yellow flex items-center justify-center font-bold text-xs md:text-xl rounded shadow-sm text-black flex-shrink-0">
                S.R.B.
              </div>
              
              {/* Brand Text - Responsive (now visible on mobile, wraps gracefully) */}
              <div className="flex flex-col ml-2 min-w-0">
                {/* Full name - visible on all sizes but adapts */}
                <span className="font-bold text-sm md:text-base lg:text-xl tracking-tight text-brand-black leading-tight whitespace-normal max-w-[180px] md:max-w-none">
                  ENGINEERING &amp; <wbr/>CONSTRUCTION
                </span>
                {/* no subtitle — single brand label shown to avoid duplicates */}
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-700 hover:text-brand-blue hover:border-b-2 hover:border-brand-blue px-1 py-2 text-sm font-medium transition-all duration-300 relative"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded-sm font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button - Visible on mobile only */}
          <div className="flex items-center md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue transition-all duration-300 min-h-[44px] min-w-[44px]"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animated Dropdown */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-gray-100 origin-top transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen 
            ? 'max-h-96 opacity-100 visible shadow-lg' 
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-700 hover:bg-gray-50 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue min-h-[44px] flex items-center"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-brand-yellow hover:bg-yellow-400 text-black block px-3 py-2 rounded-md text-base font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue min-h-[44px] flex items-center mt-2"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
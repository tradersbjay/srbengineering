import React from 'react';
import {
  Building2,
  Ruler,
  Zap,
  Droplets,
  HardHat,
  PencilRuler,
  Wrench
} from 'lucide-react';

export const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
  e.preventDefault();
  
  // If we are on the admin page (#/srb-admin), we need to go to home first
  const isHomePage = window.location.hash === '' || window.location.hash === '#/';

  if (href.startsWith('#')) {
    const targetId = href;
    const element = document.querySelector(targetId);

    if (element && isHomePage) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
        // If element not found or we are on admin page, navigate to home then hash
        // We use window.location.hash = '' to go to root, then we might need to scroll
        // For simplicity in this demo, just resetting to root is often enough, 
        // but to deep link we would need a layout effect. 
        // Here we simply go to root.
        window.location.hash = '';
        setTimeout(() => {
          const el = document.querySelector(targetId);
           if (el) {
             el.scrollIntoView({ behavior: 'smooth' });
           }
        }, 100);
    }
  }
};

/**
 * Icon mapper function - converts icon name strings to Lucide React components
 */
export const getServiceIcon = (iconName?: string) => {
  const iconClass = "w-10 h-10 text-brand-blue";
  
  switch (iconName?.toLowerCase()) {
    case 'building2':
      return <Building2 className={iconClass} />;
    case 'ruler':
      return <Ruler className={iconClass} />;
    case 'zap':
      return <Zap className={iconClass} />;
    case 'droplets':
      return <Droplets className={iconClass} />;
    case 'hard-hat':
      return <HardHat className={iconClass} />;
    case 'pencil-ruler':
      return <PencilRuler className={iconClass} />;
    case 'wrench':
      return <Wrench className={iconClass} />;
    default:
      return <Wrench className={iconClass} />; // Default fallback
  }
};
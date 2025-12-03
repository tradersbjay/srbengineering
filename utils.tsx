import React from 'react';
import * as LucideIcons from 'lucide-react';
import {
  Building2,
  Ruler,
  Zap,
  Droplets,
  HardHat,
  PencilRuler,
  Wrench,
  SquareGantt,
  Building,
  Home,
  Container,
  Hammer,
  LayoutDashboard
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

  // If iconName is a URL or data URI, render it as an image with brand color
  if (iconName && /^(https?:\/\/|data:|\/)/i.test(iconName)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={iconName} 
        alt="service icon" 
        className="w-10 h-10 object-contain rounded" 
        style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(84%) saturate(1211%) hue-rotate(172deg) brightness(101%) contrast(101%)' }}
      />
    );
  }
  
  switch (iconName?.toLowerCase()) {
    case 'building2':
      return <Building2 className={iconClass} />;
    case 'building':
      return <Building className={iconClass} />;
    case 'house':
      return <Home className={iconClass} />;
    case 'container':
      return <Container className={iconClass} />;
    case 'ruler':
      return <Ruler className={iconClass} />;
    case 'zap':
      return <Zap className={iconClass} />;
    case 'droplets':
      return <Droplets className={iconClass} />;
    case 'hard-hat':
    case 'hardhat':
      return <HardHat className={iconClass} />;
    case 'pencil-ruler':
      return <PencilRuler className={iconClass} />;
    case 'wrench':
      return <Wrench className={iconClass} />;
    case 'square-chart-gantt':
    case 'squarechartgantt':
      return <SquareGantt className={iconClass} />;
    case 'hammer':
      return <Hammer className={iconClass} />;
    case 'layout-dashboard':
    case 'layoutdashboard':
      return <LayoutDashboard className={iconClass} />;
    default:
      // Try to dynamically render any Lucide icon by PascalCase name
      if (iconName) {
        const IconComponent = (LucideIcons as any)[iconName];
        if (IconComponent && typeof IconComponent === 'function') {
          try {
            return React.createElement(IconComponent, { className: iconClass });
          } catch {
            // Fall through to default
          }
        }
      }
      return <Wrench className={iconClass} />;
  }
};

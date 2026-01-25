import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import { DataProvider } from './DataContext';

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  // Simple Hash Router implementation
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <DataProvider>
      <div className="min-h-screen font-sans bg-white text-gray-900">
        {currentHash === '#/srb-admin' ? (
          <Admin />
        ) : (
          <MainLayout />
        )}
      </div>
    </DataProvider>
  );
};

export default App;
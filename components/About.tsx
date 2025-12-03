import React from 'react';
import { COMPANY_INFO, MISSION_VISION } from '../constants';
import { useData } from '../DataContext';
import { Target, Eye } from 'lucide-react';

const About: React.FC = () => {
  const { getStats } = useData();
  const stats = getStats();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-yellow/20 rounded-full z-0"></div>
            <img
              src="https://plus.unsplash.com/premium_photo-1723489242223-865b4a8cf7b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Engineering Team"
              className="relative z-10 w-full rounded-sm shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-yellow z-0 hidden md:block"></div>
          </div>

          <div>
            <h4 className="text-brand-blue font-bold uppercase tracking-wide text-sm mb-2">Who We Are</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              S.R.B Engineering & Construction
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed whitespace-pre-wrap">
              {COMPANY_INFO.description}
            </p>
            <div className="p-4 bg-gray-50 border-l-4 border-brand-blue mb-6">
              <p className="font-semibold text-gray-800">Reg No: {COMPANY_INFO.regNo}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-brand-blue w-6 h-6" />
                  <h3 className="font-bold text-lg text-brand-blue">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{MISSION_VISION.mission}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="text-brand-blue w-6 h-6" />
                  <h3 className="font-bold text-lg text-brand-blue">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{MISSION_VISION.vision}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="bg-brand-blue rounded-xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-yellow opacity-20 rounded-full"></div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="p-2">
                <div className="text-4xl md:text-5xl font-extrabold text-brand-yellow mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-200 text-sm md:text-base font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
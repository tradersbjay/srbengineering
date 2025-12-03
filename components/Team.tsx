import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { GraduationCap } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">Our Experts</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Meet The Team</h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            A dedicated team of engineers and professionals committed to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <div key={index} className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute bottom-0 w-full h-1 bg-brand-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h4>
                <p className="text-brand-blue font-medium text-sm uppercase mb-4">{member.role}</p>

                <div className="space-y-2">
                  {member.qualifications.map((qual, qIndex) => (
                    <div key={qIndex} className="flex items-start text-xs text-gray-500">
                      <GraduationCap className="w-3 h-3 mr-2 mt-0.5 shrink-0 text-brand-blue" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
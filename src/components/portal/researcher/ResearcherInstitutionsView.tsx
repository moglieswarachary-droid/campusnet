import React from 'react';
import { Building2, Search, ExternalLink, Cpu, Database, Award, MapPin } from 'lucide-react';

export const ResearcherInstitutionsView: React.FC = () => {
  const institutions = [
    {
      id: 'inst-1',
      name: 'Indian Institute of Science (IISc)',
      city: 'Bengaluru, India',
      category: 'Premier Research Institute',
      facilities: ['Param Pravega 3.3 PFLOPS Supercomputing Facility', 'Centre for Nano Science and Engineering (CeNSE)', 'Robert Bosch Centre for Cyber-Physical Systems'],
      activeProjects: 48,
      nirf: '#1 in India (Research)',
      website: 'https://iisc.ac.in'
    },
    {
      id: 'inst-2',
      name: 'Indian Institute of Technology Bombay (IITB)',
      city: 'Mumbai, India',
      category: 'Institute of National Eminence',
      facilities: ['Centre for Research in Nanotechnology & Science (CRNTS)', 'Wadhwani AI & Data Science Center', 'Aerospace Avionics Testbed'],
      activeProjects: 62,
      nirf: '#3 in India (Overall)',
      website: 'https://iitb.ac.in'
    },
    {
      id: 'inst-3',
      name: 'Tata Institute of Fundamental Research (TIFR)',
      city: 'Mumbai & Hyderabad, India',
      category: 'DAE Research Center',
      facilities: ['Pelletron Particle Accelerator Facility', 'National Supercomputing Mission GPU Cluster', 'Low Temperature Quantum Physics Labs'],
      activeProjects: 31,
      nirf: 'A++ NAAC',
      website: 'https://tifr.res.in'
    }
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
              Partner Laboratories & Central Facilities
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              National supercomputing facilities, fabrication cleanrooms, and multi-institutional consortia
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {institutions.map(inst => (
          <div
            key={inst.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6954C8] border border-purple-200">
                  {inst.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#182442] mt-1.5">{inst.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inst.city}</span> • <strong>{inst.nirf}</strong>
                </p>
              </div>

              <a
                href={inst.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 self-start"
              >
                <span>Institutional Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400">Available Research Facilities:</span>
              <div className="flex flex-wrap gap-2">
                {inst.facilities.map(fac => (
                  <span key={fac} className="text-xs font-semibold bg-[#F4F6FA] text-slate-700 px-3 py-1 rounded-xl border border-slate-200/70 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#6954C8]" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

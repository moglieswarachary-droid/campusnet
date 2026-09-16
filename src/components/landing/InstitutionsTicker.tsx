import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Lock, ExternalLink } from 'lucide-react';

export const InstitutionsTicker: React.FC = () => {
  const institutes = [
    { name: 'IIT Bombay', logo: '🏛️' },
    { name: 'IIT Madras', logo: '🔬' },
    { name: 'IIT Delhi', logo: '⚡' },
    { name: 'IISc Bangalore', logo: '🧪' },
    { name: 'NITK Surathkal', logo: '💻' },
    { name: 'Anna University', logo: '🎓' }
  ];

  return (
    <section className="py-12 bg-slate-50/70 border-b border-slate-200 text-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200 uppercase tracking-wider">
            VERIFIED INSTITUTIONAL NETWORK
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Connected to India's Premier Research Hubs
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Authenticated via National Knowledge Network (NKN) & DigiLocker Student Credential API.
          </p>
        </div>

        {/* Institution Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 max-w-4xl mx-auto">
          {institutes.map((inst, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-warm-xs text-xs font-extrabold text-slate-800 hover:shadow-warm-md hover:border-blue-300 transition-all cursor-default"
            >
              <span>{inst.logo}</span>
              <span>{inst.name}</span>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar matching screenshot */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Direct API Sync with AISHE Portal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>DigiLocker Certified Student Identity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Zero Public ID Exposure Architecture</span>
          </div>
        </div>

      </div>
    </section>
  );
};

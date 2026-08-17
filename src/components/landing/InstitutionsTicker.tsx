import React from 'react';
import { ShieldCheck, Building2, Award, CheckCircle } from 'lucide-react';

export const InstitutionsTicker: React.FC = () => {
  const institutions = [
    'IIT Bombay', 'IIT Madras', 'IIT Delhi', 'IISc Bangalore', 
    'NITK Surathkal', 'Anna University (CEG)', 'VJTI Mumbai', 
    'BITS Pilani', 'DTU Delhi', 'NID Ahmedabad', 'AIIMS Delhi'
  ];

  return (
    <div className="bg-white border-y border-campus-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex-shrink-0 md:max-w-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-campus-red">
              <ShieldCheck className="w-4 h-4" />
              Verified Institutional Network
            </div>
            <p className="text-xs text-campus-muted-text mt-0.5">
              Connecting 150+ colleges, research labs & government challenge nodes.
            </p>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-6 sm:gap-8 min-w-max">
              {institutions.map((inst, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-campus-warm-white border border-campus-border/80 text-xs font-bold text-campus-slate-text"
                >
                  <Building2 className="w-3.5 h-3.5 text-campus-blue" />
                  {inst}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

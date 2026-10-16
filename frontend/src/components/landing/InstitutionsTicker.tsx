import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export const InstitutionsTicker: React.FC = () => {
  const institutions = [
    'IIT Bombay', 'IIT Madras', 'IIT Delhi', 'IISc Bangalore', 
    'NITK Surathkal', 'Anna University (CEG)', 'VJTI Mumbai', 
    'BITS Pilani', 'DTU Delhi', 'NID Ahmedabad', 'AIIMS Delhi'
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex-shrink-0 md:max-w-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Accredited Network</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connecting 450+ colleges & institutions across 28 States & UTs.
            </p>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-3 sm:gap-4 min-w-max">
              {institutions.map((inst, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

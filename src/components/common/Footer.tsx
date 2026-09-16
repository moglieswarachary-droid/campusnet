import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, ShieldCheck, Award, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setAuthModalType, switchRole } = useApp();

  const consortia = ['IIT Bombay', 'IIT Madras', 'IIT Delhi', 'IISc Bangalore', 'NITK Surathkal'];

  return (
    <footer className="bg-slate-950 text-white pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Participating Technical Consortia Ticker Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>PARTICIPATING TECHNICAL CONSORTIA</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-bold text-slate-200">
            {consortia.map((c, idx) => (
              <span key={idx} className="hover:text-blue-400 transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-8 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-warm-md">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Campus<span className="text-pink-500">Net</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Open platform unifying collegiate technical hackathons, doctoral labs, patent filings, and corporate grants across India.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-800">
                AICTE / UGC Aligned
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-800">
                AICTE Recognized
              </span>
            </div>
          </div>

          {/* Column 2: Role Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Role Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => { switchRole('student'); setActiveTab('dashboard'); }} className="hover:text-white transition-colors">
                  Student Innovators
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('mentor'); setActiveTab('dashboard'); }} className="hover:text-white transition-colors">
                  Faculty & R&D Mentors
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('researcher'); setActiveTab('dashboard'); }} className="hover:text-white transition-colors">
                  Institute Deans & Incubators
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('discover')} className="hover:text-white transition-colors">
                  Corporate R&D Sponsors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Initiatives & Grants */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Initiatives & Grants</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>National Hardware Grand Challenge</li>
              <li>Inter-NIT Innovation Fellowship</li>
              <li>Open Access Preprint Archive</li>
              <li>IPR & Patent Fast-Track Desk</li>
            </ul>
          </div>

          {/* Column 4: Statutory Telemetry */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Statutory Telemetry</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p>Operated under Ministry of Education Innovation Cell (MIC) open telemetry protocol v2.4.</p>
              <p>NKN Interoperability Compliant.</p>
              <p>DigiLocker Verified Credentials (ISO/IEC 27001 Certified System).</p>
            </div>
          </div>

        </div>

        {/* Sub-footer Copyright Bar matching screenshot */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CampusNet National Technical Council. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Framework</span>
            <span className="hover:text-slate-300 cursor-pointer">Research Ethics Code</span>
            <span className="hover:text-slate-300 cursor-pointer">API Documentation</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

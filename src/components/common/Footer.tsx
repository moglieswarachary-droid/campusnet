import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Layers, ShieldCheck, Award, CheckCircle2, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openAuthModal, switchRole } = useApp();
  const navigate = useNavigate();

  const handleNav = (tab: any, path: string) => {
    setActiveTab(tab);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold shadow-xs">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-indigo-400">Net+</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier national academic innovation network connecting higher education institutions, faculty guides, PhD scholars, and student teams.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-900 px-2.5 py-1 rounded-full text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Verified Student Identity
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-900 px-2.5 py-1 rounded-full text-slate-300 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                QR Verifiable Credentials
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-900 px-2.5 py-1 rounded-full text-slate-300 border border-slate-800">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Private 6-Member Workspace
              </span>
            </div>
          </div>

          {/* Portals & Gateways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Dedicated Portals</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    switchRole('student');
                    handleNav('dashboard', '/dashboard');
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    switchRole('mentor');
                    handleNav('dashboard', '/dashboard');
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Faculty Mentor Portal
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    switchRole('researcher');
                    handleNav('dashboard', '/dashboard');
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  PhD Research Portal
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => {
                    window.location.href = '/organization/login';
                  }} 
                  className="text-rose-400 font-semibold hover:underline transition-colors cursor-pointer"
                >
                  Host an Event (Organizer Portal)
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => openAuthModal('student', 'register')} 
                  className="text-indigo-400 font-semibold hover:underline transition-colors cursor-pointer"
                >
                  + Student Registration
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => openAuthModal('mentor', 'register')} 
                  className="text-amber-400 font-semibold hover:underline transition-colors cursor-pointer"
                >
                  + Faculty Onboarding
                </button>
              </li>
            </ul>
          </div>

          {/* National Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('discover', '/discover')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  National Discovery
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('projects', '/projects')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Projects Ecosystem
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('events', '/events')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Academic Events & SIH
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('mentors', '/mentors')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Verified Mentors
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('certificates', '/certificates')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Verify Credentials
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Standards</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                Inter-Collegiate Team Engine
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                GPS Geo-fenced Event Attendance
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                AICTE Framework Aligned
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                Tamper-Proof QR Certificates
              </p>
            </div>
          </div>

        </div>

        {/* Sub-footer / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CampusNet+ National Academic & Innovation Network. All rights reserved.</p>
          
          <div className="flex items-center gap-5 flex-wrap">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, ShieldCheck, Award, HeartHandshake, FileText, CheckCircle2, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setAuthModalType } = useApp();

  return (
    <footer className="bg-campus-deep-blue text-white pt-16 pb-24 lg:pb-12 border-t border-campus-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-campus-deep-blue flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-campus-blue" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Campus<span className="text-campus-bright-red">Link</span>
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              The premier national academic innovation ecosystem connecting students, departments, universities, mentors, PhD researchers, and government challenges.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full text-gray-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-campus-bright-red" />
                Verified Student Identity
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full text-gray-200 border border-white/10">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                QR Verifiable Certs
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full text-gray-200 border border-white/10">
                <Lock className="w-3.5 h-3.5 text-green-400" />
                Private 6-Member Workspace
              </span>
            </div>
          </div>

          {/* Innovation Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Innovation Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('discover')} className="text-gray-300 hover:text-white transition-colors">
                  Find Your Team
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className="text-gray-300 hover:text-white transition-colors">
                  Explore Projects
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="text-gray-300 hover:text-white transition-colors">
                  Upcoming Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mentors')} className="text-gray-300 hover:text-white transition-colors">
                  Verified Faculty Mentors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('research')} className="text-gray-300 hover:text-white transition-colors">
                  PhD Research Network
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Learning */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Academic Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('ask')} className="text-gray-300 hover:text-white transition-colors">
                  Ask Campus (Q&A)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('stories')} className="text-gray-300 hover:text-white transition-colors">
                  Campus Stories (Demos)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('certificates')} className="text-gray-300 hover:text-white transition-colors">
                  Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portfolio')} className="text-gray-300 hover:text-white transition-colors">
                  Student Innovation Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => setAuthModalType('mentor_onboarding')} className="text-gray-300 hover:text-white transition-colors">
                  Mentor Onboarding Flow
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Institutional Standards</h4>
            <div className="text-xs text-gray-400 space-y-2">
              <p className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                Inter-Collegiate Team Protocols
              </p>
              <p className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                GPS Geo-fenced Event Attendance
              </p>
              <p className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                CDSCO/AICTE Compliance Alignment
              </p>
              <p className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                Zero Public ID Exposure Guarantee
              </p>
            </div>
          </div>

        </div>

        {/* Sub-footer / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 CampusLink Academic Innovation Network. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Whitepaper</span>
            {/* Protected internal security audit view */}
            <button 
              onClick={() => setActiveTab('admin')} 
              className="text-gray-500 hover:text-gray-400 text-[11px] underline"
              title="Protected System Security Portal"
            >
              [SecOps Portal]
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

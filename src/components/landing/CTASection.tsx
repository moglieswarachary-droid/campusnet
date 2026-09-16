import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Zap, Building2, Layers, ShieldCheck } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthModalType, setActiveTab } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Navy Blue Card matching screenshot */}
        <div className="bg-[#0B132B] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-slate-800 text-center">
          
          {/* Subtle Ambient Background Gradient Circle */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            
            {/* Top Yellow Lightning Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>READY TO BUILD THE FUTURE OF INDIAN INNOVATION?</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Join 50,000+ Students, Mentors and Researchers on CampusNet.
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              From first-year prototypes to national government hackathon trophies and published IEEE papers — start your collaborative journey today with zero friction.
            </p>

            {/* Action Buttons matching screenshot */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setAuthModalType('student_register')}
                className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer"
              >
                <span>🚀 Claim Student Access</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('discover');
                  navigate('/discover');
                }}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-extrabold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
              >
                <span>Explore without Sign-in</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Bullets inside Card */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                • 180+ Affiliated Institutions
              </span>
              <span className="flex items-center gap-1.5">
                • Multi-Disciplinary Team Engine
              </span>
              <span className="flex items-center gap-1.5">
                • Free Student Access
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, UserCheck, GraduationCap, Building2 } from 'lucide-react';

export const CTASection: React.FC = () => {
  const { setAuthModalType, setActiveTab } = useApp();

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-campus-border text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-campus-red" />
          Ready to Build the Future of Student Innovation?
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-campus-deep-blue tracking-tight">
          Join Over 50,000+ Students, Mentors <br className="hidden sm:block" />
          and Researchers on CampusLink.
        </h2>

        <p className="text-base sm:text-lg text-campus-slate-text/80 max-w-2xl mx-auto leading-relaxed">
          From first-year prototypes to national government hackathon trophies and published IEEE papers — start your collaborative journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setAuthModalType('student_register')}
            className="campus-btn-red text-base px-8 py-4 rounded-xl shadow-warm-lg w-full sm:w-auto"
          >
            <UserCheck className="w-5 h-5" />
            Verify Student Account
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAuthModalType('mentor_onboarding')}
            className="campus-btn-secondary text-base px-7 py-4 rounded-xl w-full sm:w-auto"
          >
            <GraduationCap className="w-5 h-5 text-campus-blue" />
            Register as Verified Mentor
          </button>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-campus-muted-text">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-campus-blue" />
            150+ Affiliated Institutions
          </span>
          <span>•</span>
          <span>Multi-Disciplinary Team Engine</span>
          <span>•</span>
          <span>Zero Public ID Exposure</span>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, Landmark, ArrowRight, CheckCircle2, FileCheck } from 'lucide-react';

export const GovtChallengesSection: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-campus-deep-blue via-[#0c2e64] to-campus-blue rounded-3xl p-8 sm:p-12 lg:p-14 text-white shadow-warm-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-400/30">
              <Landmark className="w-4 h-4 text-green-400" />
              National Ministry & Institutional Challenges
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Real Government Problems. <br />
              <span className="text-amber-300">National Incubation Pipelines.</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              Central Ministries and State Nodal Centers release verified problem statements directly onto CampusNet. Student teams compete with verified GPS attendance, peer review, and transparent evaluation rubrics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-2xl font-extrabold text-amber-300">₹45 Lakhs+</div>
                <div className="text-xs text-gray-300 mt-0.5">Annual Incubation Grants</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-2xl font-extrabold text-green-400">100% Bonafide</div>
                <div className="text-xs text-gray-300 mt-0.5">Verified Student Roster</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-2xl font-extrabold text-white">QR Validated</div>
                <div className="text-xs text-gray-300 mt-0.5">Digital Merit Certificates</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setActiveTab('events')}
                className="campus-btn-red text-sm px-8 py-3.5 rounded-xl shadow-warm-lg w-full sm:w-auto"
              >
                Browse Government Challenges
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className="campus-btn-secondary text-sm px-6 py-3.5 rounded-xl bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto"
              >
                Verify a Digital Certificate
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

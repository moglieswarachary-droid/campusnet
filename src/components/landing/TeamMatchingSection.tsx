import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ShieldCheck, ArrowRight, Sparkles, Check, Plus, UserPlus } from 'lucide-react';

export const TeamMatchingSection: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedDiscipline, setSelectedDiscipline] = useState<'ai' | 'hardware' | 'mech' | 'design' | 'research'>('ai');

  const disciplines = [
    { id: 'ai', name: 'AI & Data Science', dept: 'CSE / AI', skill: 'Computer Vision, PyTorch, Edge AI', college: 'NITK Surathkal' },
    { id: 'hardware', name: 'Hardware & ECE', dept: 'ECE / Embedded', skill: 'ESP32, LoRaWAN, Circuit Design', college: 'Anna University' },
    { id: 'mech', name: 'Mechanical & Mechatronics', dept: 'Mechanical', skill: 'SolidWorks, Drone Airframe, FEA', college: 'VJTI Mumbai' },
    { id: 'design', name: 'Human-Centered UI/UX', dept: 'Interaction Design', skill: 'Figma, Telemetry Dashboards, a11y', college: 'NID Ahmedabad' },
    { id: 'research', name: 'Domain Scientist', dept: 'Agro-Informatics', skill: 'Plant Pathology, Spectral Data', college: 'IISc Bangalore' }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Description */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              Department-to-Department Network
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-campus-deep-blue leading-tight">
              Break Academic Silos. <br />
              <span className="text-campus-red">Form Multi-College Teams.</span>
            </h2>

            <p className="text-sm sm:text-base text-campus-slate-text/80 leading-relaxed">
              Real-world breakthroughs require interdisciplinary talent. CampusLink intelligently matches students from one department with students from other colleges, universities, and research institutes based on real project requirements.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-campus-warm-white border border-campus-border">
                <div className="w-7 h-7 rounded-lg bg-campus-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-campus-deep-blue">Specify 6-Member Required Roles</h4>
                  <p className="text-xs text-campus-muted-text mt-0.5">
                    Define slots for AI/ML, ECE, Mechanical, UI/UX, Cloud, and Domain Researchers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-campus-warm-white border border-campus-border">
                <div className="w-7 h-7 rounded-lg bg-campus-red text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-campus-deep-blue">Cross-Disciplinary Eligibility Search</h4>
                  <p className="text-xs text-campus-muted-text mt-0.5">
                    Search bonafide verified students across 150+ institutions with skill matching.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('discover')}
                className="campus-btn-primary text-sm px-6 py-3 rounded-xl"
              >
                Launch "Find My Team"
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Interactive Slot Visualizer */}
          <div className="bg-campus-warm-white rounded-3xl p-6 sm:p-8 border border-campus-border shadow-warm-lg">
            
            <div className="flex items-center justify-between pb-4 border-b border-campus-border mb-6">
              <div>
                <h3 className="font-bold text-base text-campus-deep-blue">
                  6-Member Project Formation Matrix
                </h3>
                <p className="text-xs text-campus-muted-text">Example: Autonomous Agricultural Drone</p>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                5 / 6 Slots Filled
              </span>
            </div>

            <div className="space-y-3">
              {disciplines.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDiscipline(d.id as any)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDiscipline === d.id
                      ? 'bg-white border-campus-blue shadow-warm-sm scale-[1.01]'
                      : 'bg-white/70 border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4 text-campus-blue" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-campus-slate-text">{d.name}</div>
                      <div className="text-[11px] text-campus-muted-text">{d.dept} • {d.college}</div>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-md border border-blue-200">
                    Filled
                  </span>
                </div>
              ))}

              {/* Empty 6th Slot */}
              <div 
                onClick={() => setActiveTab('discover')}
                className="p-3.5 rounded-2xl border-2 border-dashed border-campus-border hover:border-campus-red bg-white/40 hover:bg-red-50/40 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-campus-red flex items-center justify-center font-bold text-xs">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-campus-slate-text">Slot #6: Backend & Cloud Streaming Lead</div>
                    <div className="text-[11px] text-campus-muted-text">Seeking CSE / IT Student (FastAPI / WebSockets)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-campus-red">
                  + Recruit
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

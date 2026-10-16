import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2, Award, Zap, Star, ShieldCheck, TrendingUp,
  Plus, Edit3, Sparkles, BookOpen, ExternalLink, Code2, Layers
} from 'lucide-react';

export const StudentSkillsView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Technical skills dataset
  const skillCategories = [
    {
      category: 'AI / Machine Learning & Robotics',
      skills: [
        { name: 'PyTorch & TorchScript', level: 'Advanced', verified: true, endorsements: 18, project: 'AgriVision Micro-Drone' },
        { name: 'TensorRT & Edge Optimization', level: 'Advanced', verified: true, endorsements: 14, project: 'AgriVision Micro-Drone' },
        { name: 'ROS 2 & Gazebo Simulation', level: 'Intermediate', verified: true, endorsements: 11, project: 'Smart India Hackathon' },
        { name: 'Computer Vision (YOLOv8, OpenCV)', level: 'Advanced', verified: true, endorsements: 22, project: 'Autonomous Spray Sim' }
      ]
    },
    {
      category: 'Full-Stack & Systems Architecture',
      skills: [
        { name: 'TypeScript & React 19', level: 'Advanced', verified: true, endorsements: 28, project: 'CampusNet Portal' },
        { name: 'FastAPI & Python AsyncIO', level: 'Advanced', verified: true, endorsements: 19, project: 'Telemetry Ingestion API' },
        { name: 'PostgreSQL & Redis Caching', level: 'Intermediate', verified: false, endorsements: 8, project: 'Course Ledger' },
        { name: 'Docker & Microservices', level: 'Intermediate', verified: true, endorsements: 12, project: 'Drone Cloud Gateway' }
      ]
    },
    {
      category: 'Embedded & Hardware Prototyping',
      skills: [
        { name: 'ESP32 & STM32 Firmware (C++)', level: 'Intermediate', verified: true, endorsements: 9, project: 'Flight Controller' },
        { name: 'CAN Bus & MAVLink Telemetry', level: 'Intermediate', verified: true, endorsements: 7, project: 'AgriVision Micro-Drone' }
      ]
    }
  ];

  // Verified Badges earned by student
  const verifiedBadges = [
    {
      id: 'badge-01',
      title: 'Smart India Hackathon 2026 Finalist',
      issuer: 'Ministry of Education Innovation Cell (MIC)',
      date: 'April 2026',
      icon: Award,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'badge-02',
      title: 'Certified Edge AI Vision Developer',
      issuer: 'NVIDIA Deep Learning Institute (DLI)',
      date: 'February 2026',
      icon: ShieldCheck,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'badge-03',
      title: 'Open Source Collegiate Contributor',
      issuer: 'GitHub Campus Experts Program',
      date: 'January 2026',
      icon: Code2,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'badge-04',
      title: 'Distinguished Research Colloquium Presenter',
      issuer: 'CampusNet Academic Network',
      date: 'November 2025',
      icon: BookOpen,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  // Innovation Score Breakdown
  const innovationMetrics = [
    { label: 'Project Delivery & Milestones', score: 280, max: 300, pct: 93 },
    { label: 'Hackathon & Competitive Coding', score: 240, max: 250, pct: 96 },
    { label: 'Faculty & Peer Reviews', score: 180, max: 200, pct: 90 },
    { label: 'Verified Certifications & MOOCs', score: 140, max: 150, pct: 93 }
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    addToast({
      type: 'success',
      message: `Competency "${newSkill}" recorded in your student growth ledger.`
    });
    setNewSkill('');
    setIsAdding(false);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
                Skills & Innovation Ledger
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Verified Bonafide
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verifiable technical competencies, peer endorsements, and academic innovation scores
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="campus-btn-primary text-xs py-2 px-3.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Competency</span>
        </button>
      </div>

      {/* Add Skill Form Drawer */}
      {isAdding && (
        <form onSubmit={handleAddSkill} className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 flex items-center gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Enter technical skill (e.g. Next.js, Rust, Kubernetes)..."
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-campus-blue"
            autoFocus
          />
          <button type="submit" className="campus-btn-primary text-xs py-2 px-4 rounded-xl">
            Save Skill
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Innovation Score & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Innovation Score Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Composite CampusNet Index
              </span>
              <h3 className="text-xl font-black text-campus-deep-blue mt-0.5">Innovation Score: 840</h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Top 3% Collegiate Rank
            </span>
          </div>

          <div className="space-y-3.5">
            {innovationMetrics.map(m => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{m.label}</span>
                  <span className="font-bold text-campus-deep-blue">{m.score} / {m.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-campus-blue rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 leading-snug">
            Calculated algorithmically from verified project milestone deliveries, faculty feedback scores, and verified hackathon finishes.
          </p>
        </div>

        {/* Verified Badges & Accreditations (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-campus-deep-blue">Verified Academic & Hackathon Badges</h3>
            <span className="text-xs font-bold text-slate-500">{verifiedBadges.length} Badges Earned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedBadges.map(b => {
              const Icon = b.icon;
              return (
                <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${b.badgeColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{b.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{b.issuer}</p>
                    <span className="text-[9.5px] font-semibold text-slate-400 mt-1 block">{b.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categorized Skills Directory */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Technical Competencies & Endorsement Ledger
        </h3>

        <div className="space-y-4">
          {skillCategories.map(cat => (
            <div key={cat.category} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-campus-deep-blue">{cat.category}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.skills.map(sk => (
                  <div key={sk.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{sk.name}</span>
                        {sk.verified && (
                          <span title="Faculty Verified">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Applied in: <strong>{sk.project}</strong></p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        {sk.level}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block mt-1 font-semibold">
                        {sk.endorsements} Endorsements
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

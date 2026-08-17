import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, ShieldCheck, Sparkles, Users, 
  Layers, Award, GraduationCap, Cpu, Compass
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setAuthModalType, setIsAIModalOpen } = useApp();
  const [selectedNode, setSelectedNode] = useState<'ai' | 'ece' | 'mech' | 'mentor' | 'event'>('ai');

  const nodeInfo = {
    ai: {
      title: 'Aarav Sharma (AI/ML Lead)',
      college: 'NITK Surathkal',
      role: 'Quantized TensorRT & Vision Algorithms',
      badge: 'Verified Student • Innovation Score: 840'
    },
    ece: {
      title: 'Pooja Iyer (Hardware & Sensors)',
      college: 'CEG Anna University',
      role: 'Custom ESP32 LoRaWAN Telemetry PCB',
      badge: 'Verified Student • Hardware Lead'
    },
    mech: {
      title: 'Vikramaditya (Mechatronics)',
      college: 'VJTI Mumbai',
      role: 'Carbon-Fiber Aerodynamics & FEA Stress',
      badge: 'Verified Student • Robotics Finalist'
    },
    mentor: {
      title: 'Dr. Arvind Rao (Research Mentor)',
      college: 'IIT Bombay Computer Vision Lab',
      role: 'Edge Computing & Milestone Validation',
      badge: 'Verified Mentor • 14 Yrs Experience'
    },
    event: {
      title: 'Smart India Hackathon 2026',
      college: 'Ministry of Education & AICTE',
      role: 'Grand Finale Hardware Prototype Track',
      badge: 'National Government Challenge • ₹1,00,000 Prize'
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 academic-mesh-bg">
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-campus-soft-blue/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-campus-border shadow-warm-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-campus-bright-red pulse-live"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-campus-deep-blue">
              The Student Innovation & Research Network
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-campus-deep-blue leading-[1.12]">
            BUILD. CONNECT. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-blue via-campus-deep-blue to-campus-red">
              RESEARCH. INNOVATE.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-campus-slate-text/80 font-normal leading-relaxed max-w-2xl mx-auto">
            One ecosystem for students, researchers, mentors and institutions to discover opportunities, build teams, solve problems and turn ideas into impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => setActiveTab('discover')}
              className="campus-btn-primary w-full sm:w-auto px-8 py-3.5 text-base rounded-xl shadow-warm-lg"
            >
              <Compass className="w-5 h-5" />
              Explore Opportunities
            </button>

            <button
              onClick={() => setAuthModalType('student_register')}
              className="campus-btn-secondary w-full sm:w-auto px-7 py-3.5 text-base rounded-xl"
            >
              Join CampusLink
              <ArrowRight className="w-4 h-4 text-campus-red" />
            </button>
          </div>
        </div>

        {/* Interactive Inter-Departmental Network Visualizer Card */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-campus-border shadow-warm-xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="campus-badge-verified">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Inter-Departmental Formation Engine
                  </span>
                  <span className="text-xs font-bold text-campus-muted-text">Live Interactive Demo</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-campus-deep-blue mt-1">
                  How CampusLink Forms High-Impact Interdisciplinary Teams
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-soft-blue text-campus-blue text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-campus-red" />
                  Ask AI Matcher
                </button>
              </div>
            </div>

            {/* Visual Node Diagram */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Left Column: Department Nodes */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-campus-muted-text mb-2">
                  1. Cross-College Student Nodes
                </div>

                <div 
                  onClick={() => setSelectedNode('ai')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedNode === 'ai'
                      ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.02]'
                      : 'bg-campus-warm-white border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-campus-blue text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">AI & ML Lead</h4>
                      <span className="text-[10px] font-bold text-campus-blue bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        NITK
                      </span>
                    </div>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">Aarav Sharma • Edge Vision</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedNode('ece')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedNode === 'ece'
                      ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.02]'
                      : 'bg-campus-warm-white border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-campus-deep-blue text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">Hardware & ECE</h4>
                      <span className="text-[10px] font-bold text-campus-blue bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        Anna Univ
                      </span>
                    </div>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">Pooja Iyer • LoRaWAN Telemetry</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedNode('mech')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedNode === 'mech'
                      ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.02]'
                      : 'bg-campus-warm-white border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-campus-slate-text text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">Mechatronics Lead</h4>
                      <span className="text-[10px] font-bold text-campus-blue bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        VJTI
                      </span>
                    </div>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">Vikramaditya • Drone Airframe</p>
                  </div>
                </div>
              </div>

              {/* Center Column: Interactive Connection Core */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-campus-deep-blue to-campus-blue text-white text-center shadow-warm-xl relative">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  Active Collaboration
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  AgriVision AI Project
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                  Multi-institution team matched by skills, department requirements and hackathon eligibility.
                </p>

                <div className="w-full bg-white/10 rounded-xl p-3 text-left border border-white/15">
                  <div className="text-[10.5px] uppercase font-bold text-blue-200 mb-1">Selected Node Detail:</div>
                  <div className="text-xs font-bold text-white">{nodeInfo[selectedNode].title}</div>
                  <div className="text-[11px] text-amber-200 font-medium">{nodeInfo[selectedNode].college}</div>
                  <div className="text-[11px] text-gray-200 mt-1">{nodeInfo[selectedNode].role}</div>
                  <div className="text-[10px] text-green-300 font-semibold mt-1.5">{nodeInfo[selectedNode].badge}</div>
                </div>
              </div>

              {/* Right Column: Mentor & Event Nodes */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-campus-muted-text mb-2">
                  2. Mentor & Challenge Match
                </div>

                <div 
                  onClick={() => setSelectedNode('mentor')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedNode === 'mentor'
                      ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.02]'
                      : 'bg-campus-warm-white border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-campus-red text-white flex items-center justify-center font-bold flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">Verified Mentor</h4>
                      <span className="text-[10px] font-bold text-campus-red bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        96% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">Dr. Arvind Rao • IIT Bombay</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedNode('event')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedNode === 'event'
                      ? 'bg-campus-soft-blue border-campus-blue shadow-warm-sm scale-[1.02]'
                      : 'bg-campus-warm-white border-campus-border hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">Govt Challenge</h4>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                        SIH 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">National Nodal Finals Track</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-campus-border flex items-center justify-between">
                  <div className="text-xs text-campus-slate-text font-semibold">
                    Looking for a team or mentor?
                  </div>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="text-xs font-bold text-campus-blue hover:underline"
                  >
                    Start Matching →
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, ShieldCheck, FolderKanban, Building2, 
  ArrowRight, Sparkles, Award, Users, BookOpen, KeyRound,
  TrendingUp, Network, Coins, FlaskConical
} from 'lucide-react';
import { FederatedSearchDropdown } from './FederatedSearchDropdown';
import { RoleAuthSidebar } from './RoleAuthSidebar';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveTab, events, mentors, projects, researchers } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const publishedEventsCount = events.filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live').length;
  const verifiedMentorsCount = mentors.length;
  const projectsAndResearchCount = projects.length + researchers.length;

  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 academic-mesh-bg overflow-hidden">
      {/* Subtle radial ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Mobile Quick Action Pill for Role Gateways */}
        <div className="lg:hidden flex items-center justify-between bg-white/95 p-3 rounded-2xl border border-campus-border shadow-warm-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
            <span className="text-xs font-bold text-campus-deep-blue">
              Role Access & Portals:
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="text-xs font-bold text-white bg-campus-deep-blue hover:bg-slate-800 px-3.5 py-1.5 rounded-xl shadow-warm-xs flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        </div>

        {/* Desktop Split Layout: Left Persistent Role Sidebar + Center Hero */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Persistent Role Authentication Sidebar */}
          <RoleAuthSidebar 
            isMobileDrawerOpen={isMobileDrawerOpen} 
            setIsMobileDrawerOpen={setIsMobileDrawerOpen} 
          />

          {/* Center/Right Hero Content */}
          <div className="flex-1 w-full space-y-8 text-center">
            
            {/* National Badge Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50/80 border border-pink-200/80 text-pink-700 text-xs font-extrabold tracking-wide backdrop-blur-sm animate-in fade-in duration-300">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse"></span>
              <span>NATIONAL ACADEMIC INNOVATION & RESEARCH NETWORK</span>
            </div>

            {/* Main Headline & Subtitle matching the screenshot */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] uppercase">
                CONNECT. MENTOR.<br />
                RESEARCH. <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">INNOVATE.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                India's unified ecosystem connecting 50,000+ collegiate innovators, verified research chairs, and national competitions across premier institutes.
              </p>
            </div>

            {/* Single Federated Universal Search Bar */}
            <div className="pt-1 max-w-2xl mx-auto">
              <FederatedSearchDropdown />
            </div>

            {/* Floating Metrics Bar (Exact Match from Screenshot) */}
            <div className="pt-4 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-warm-md p-3.5 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/60">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">4,820</div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">ACTIVE SQUADS</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100/60">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">150+ Nodes</div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">UNIVERSITIES & IITS</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/60">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">₹1.8 Cr+</div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">DIRECT GRANTS WON</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">320 Labs</div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">OPEN PHD RESEARCH</div>
                  </div>
                </div>

              </div>
            </div>

            {/* 4 PRIMARY ACTION CARDS */}
            <div className="pt-2 sm:pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
                
                {/* Card 1: Discover Events */}
                <button
                  onClick={() => setActiveTab('events')}
                  className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-md hover:shadow-warm-xl hover:border-campus-blue transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-warm-xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-campus-blue bg-campus-soft-blue px-2.5 py-1 rounded-full">
                        {publishedEventsCount} Active
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-campus-deep-blue group-hover:text-campus-blue transition-colors">
                      Discover Events
                    </h3>
                    <p className="text-xs text-campus-muted-text mt-1 leading-relaxed">
                      National hackathons, government challenges & coding symposiums.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-campus-border/60 flex items-center justify-between text-xs font-bold text-campus-blue">
                    <span>Browse Challenges</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 2: Find a Mentor */}
                <button
                  onClick={() => setActiveTab('mentors')}
                  className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-md hover:shadow-warm-xl hover:border-amber-500 transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-warm-xs">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                        {verifiedMentorsCount} Faculty Guides
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-campus-deep-blue group-hover:text-amber-700 transition-colors">
                      Find a Mentor
                    </h3>
                    <p className="text-xs text-campus-muted-text mt-1 leading-relaxed">
                      Connect with verified professors for project guidance & milestones.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-campus-border/60 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>View Directory</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 3: Explore Projects & Research */}
                <button
                  onClick={() => setActiveTab('projects')}
                  className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-md hover:shadow-warm-xl hover:border-purple-500 transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-warm-xs">
                        <FolderKanban className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full">
                        {projectsAndResearchCount} Projects & Labs
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-campus-deep-blue group-hover:text-purple-700 transition-colors">
                      Explore Projects & Research
                    </h3>
                    <p className="text-xs text-campus-muted-text mt-1 leading-relaxed">
                      Student hardware/software prototypes & PhD doctoral preprints.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-campus-border/60 flex items-center justify-between text-xs font-bold text-purple-700">
                    <span>Explore Ecosystem</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 4: Host Event (Organizer Flow) */}
                <button
                  onClick={() => {
                    navigate('/organizer');
                  }}
                  className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-md hover:shadow-warm-xl hover:border-campus-red transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-campus-red flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-warm-xs">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-campus-red bg-red-50 px-2.5 py-1 rounded-full">
                        Institutions
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-campus-deep-blue group-hover:text-campus-red transition-colors">
                      Host Event
                    </h3>
                    <p className="text-xs text-campus-muted-text mt-1 leading-relaxed">
                      Submit hosting proposal with institution proof for accreditation.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-campus-border/60 flex items-center justify-between text-xs font-bold text-campus-red">
                    <span>Organizer Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

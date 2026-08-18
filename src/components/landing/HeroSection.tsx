import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, ShieldCheck, FolderKanban, Building2, 
  ArrowRight, Sparkles, Award, Users, BookOpen, KeyRound 
} from 'lucide-react';
import { FederatedSearchDropdown } from './FederatedSearchDropdown';
import { RoleAuthSidebar } from './RoleAuthSidebar';

export const HeroSection: React.FC = () => {
  const { setActiveTab, events, mentors, projects, researchers } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const publishedEventsCount = events.filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live').length;
  const verifiedMentorsCount = mentors.length;
  const projectsAndResearchCount = projects.length + researchers.length;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-6 pb-12 sm:pt-8 sm:pb-16 px-4 sm:px-6 lg:px-8 academic-mesh-bg overflow-hidden">
      {/* Subtle radial ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-campus-soft-blue/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full my-auto space-y-6">
        
        {/* Mobile Quick Action Pill for Role Gateways */}
        <div className="lg:hidden flex items-center justify-between bg-white/95 p-3 rounded-2xl border border-campus-border shadow-warm-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-campus-bright-red pulse-live" />
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

          {/* Right/Center Hero Content */}
          <div className="flex-1 w-full space-y-8 sm:space-y-10 text-center">
            
            {/* National Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-campus-border shadow-warm-sm backdrop-blur-sm animate-in fade-in duration-300">
              <span className="w-2 h-2 rounded-full bg-campus-bright-red pulse-live"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-campus-deep-blue">
                National Academic Innovation & Research Network
              </span>
            </div>

            {/* 1-Line Headline & 1-Line Subtext */}
            <div className="space-y-3 max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-campus-deep-blue leading-tight">
                CONNECT. MENTOR. <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-blue via-campus-deep-blue to-campus-red">RESEARCH. INNOVATE.</span>
              </h1>
              <p className="text-xs sm:text-base text-campus-slate-text/90 font-medium max-w-xl mx-auto">
                Discover hackathons, find faculty mentors, collaborate on research, and build national-scale projects across India.
              </p>
            </div>

            {/* Single Federated Universal Search Bar */}
            <div className="pt-1">
              <FederatedSearchDropdown />
            </div>

            {/* EXACTLY 4 PRIMARY ACTION CARDS */}
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
                    const url = new URL(window.location.href);
                    url.searchParams.set('portal', 'organizer');
                    window.location.href = url.toString();
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

      {/* Minimal Footer Strip on Landing */}
      <div className="mt-8 pt-4 border-t border-campus-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-campus-muted-text max-w-6xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <span>CampusNet India Ecosystem</span>
          <span>•</span>
          <span>AISHE & National Nodal Connected</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('discover')} className="hover:text-campus-blue">Institutions</button>
          <button onClick={() => setActiveTab('certificates')} className="hover:text-campus-blue">Verify QR Certificate</button>
          <button onClick={() => setActiveTab('ask')} className="hover:text-campus-blue">Ask Campus</button>
        </div>
      </div>
    </section>
  );
};


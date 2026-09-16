import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  GraduationCap, 
  FolderKanban, 
  FlaskConical, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Building2,
  Activity
} from 'lucide-react';

export const EcosystemPillarsSection: React.FC = () => {
  const navigate = useNavigate();
  const { events, mentors, projects, researchers, setActiveTab } = useApp();

  const handleNavigate = (path: string, tab: any) => {
    setActiveTab(tab);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pillars = [
    {
      id: 'students',
      title: 'Student Innovators Gateway',
      subtitle: 'Hackathons, Teams & Build Portfolio',
      badge: `${events.length} Live Competitions`,
      badgeColor: 'bg-red-50 text-campus-red border-red-200',
      icon: Trophy,
      iconBg: 'bg-red-100/80 text-campus-red',
      borderColor: 'hover:border-campus-red',
      description: 'Participate in national hackathons, form cross-college 6-member squads, and build verified milestone portfolios.',
      features: ['SIH & Ministry Challenges', 'Inter-College Team Engine', 'GPS QR Ticket Attendance'],
      btnText: 'Explore Hackathons & Teams',
      btnClass: 'campus-btn-red',
      path: '/events',
      tab: 'events'
    },
    {
      id: 'mentors',
      title: 'Faculty & PhD Mentors Gateway',
      subtitle: 'Milestone Reviews & Thesis Guidance',
      badge: `${mentors.length} Verified Chairs`,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: GraduationCap,
      iconBg: 'bg-amber-100/80 text-amber-700',
      borderColor: 'hover:border-amber-500',
      description: 'Connect with Vidwan-verified professors for 1-on-1 project guidance, milestone reviews, and mentorship certificates.',
      features: ['Vidwan ID Verified Guides', 'Milestone Approval Sign-offs', 'Accredited Cert Issuance'],
      btnText: 'Find Faculty Mentor',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
      path: '/mentors',
      tab: 'mentors'
    },
    {
      id: 'research',
      title: 'Research & Preprints Hub',
      subtitle: 'IEEE Papers, Datasets & Lab Openings',
      badge: `${researchers.length} Doctoral Labs`,
      badgeColor: 'bg-blue-50 text-campus-blue border-blue-200',
      icon: FlaskConical,
      iconBg: 'bg-blue-100/80 text-campus-blue',
      borderColor: 'hover:border-campus-blue',
      description: 'Collaborate with PhD scholars across IITs and IISc, access open datasets, publish preprints, and join university labs.',
      features: ['Open Lab RA Positions', 'Open-Access Preprint Index', 'Inter-Lab Co-Authorships'],
      btnText: 'Enter Research Network',
      btnClass: 'campus-btn-primary',
      path: '/research',
      tab: 'research'
    },
    {
      id: 'organizer',
      title: 'Institutional Event Hosting',
      subtitle: 'QR Attendance, Rubrics & NAAC Reports',
      badge: 'Colleges & Universities',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Building2,
      iconBg: 'bg-purple-100/80 text-purple-700',
      borderColor: 'hover:border-purple-500',
      description: 'Full-stack organizer engine with GPS-geofenced QR scanner, weighted jury rubrics, and NAAC/NIRF exportable reports.',
      features: ['Anti-Proxy GPS Geofence', 'External Jury Access Keys', 'Exportable NAAC Audits'],
      btnText: 'Access Organizer Portal',
      btnClass: 'bg-purple-600 hover:bg-purple-700 text-white font-bold',
      path: '/organizer',
      tab: 'organizer'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-campus-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching the user's screenshot */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ACADEMIC R&D ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Four Core Innovation Gateways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Direct operational pipelines replacing disjointed campus portals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telemetry: HIG Grid v2.4 Active</span>
            </span>
          </div>
        </div>

        {/* 4 Core Innovation Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`bg-campus-warm-white/70 hover:bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-xl ${pillar.borderColor} transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${pillar.iconBg} flex items-center justify-center font-bold shadow-warm-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Titles */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Redirect Button */}
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => handleNavigate(pillar.path, pillar.tab)}
                    className={`w-full ${pillar.btnClass} text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 shadow-warm-xs hover:shadow-warm-md transition-all cursor-pointer`}
                  >
                    <span>{pillar.btnText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

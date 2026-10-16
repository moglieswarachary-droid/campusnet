import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  GraduationCap, 
  FolderKanban, 
  FlaskConical, 
  Users, 
  PlayCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const EcosystemPillarsSection: React.FC = () => {
  const navigate = useNavigate();
  const { events, mentors, projects, researchers, teams, stories, setActiveTab } = useApp();

  const handleNavigate = (path: string, tab: any) => {
    setActiveTab(tab);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pillars = [
    {
      id: 'events',
      title: 'National Hackathons & Challenges',
      subtitle: 'Government & University Competitions',
      badge: `${events.length} Live & Upcoming`,
      badgeColor: 'bg-red-50 text-campus-red border-red-200',
      icon: Trophy,
      iconBg: 'bg-red-100/70 text-campus-red',
      borderColor: 'hover:border-campus-red',
      description: 'Smart India Hackathon nodes, ministry problem statements, GPS venue check-ins, and verified QR attendance.',
      features: ['AISHE-accredited fests', 'Direct prize disbursements', 'Government challenge tracks'],
      btnText: 'Explore Hackathons & Events',
      btnClass: 'campus-btn-red',
      path: '/events',
      tab: 'events'
    },
    {
      id: 'mentors',
      title: 'Faculty & Industry Mentorship',
      subtitle: '1-on-1 Milestone Guidance',
      badge: `${mentors.length} Verified Guides`,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: GraduationCap,
      iconBg: 'bg-amber-100/70 text-amber-700',
      borderColor: 'hover:border-amber-500',
      description: 'Connect with professors, research chairs, and industry leaders for structured milestone reviews and patent guidance.',
      features: ['Vidwan ID verified', 'Milestone sign-offs', 'Accredited cert issuing'],
      btnText: 'Find Your Faculty Mentor',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
      path: '/mentors',
      tab: 'mentors'
    },
    {
      id: 'projects',
      title: 'Student Innovation Directory',
      subtitle: 'Hardware, Software & AI Prototypes',
      badge: `${projects.length} Public Innovations`,
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: FolderKanban,
      iconBg: 'bg-purple-100/70 text-purple-700',
      borderColor: 'hover:border-purple-500',
      description: 'Inter-college repository of student hardware models, AI systems, open-source codebases, and live web previews.',
      features: ['Tech stack filtering', 'Live prototype links', 'Peer peer-review feedback'],
      btnText: 'Browse Student Projects',
      btnClass: 'bg-purple-600 hover:bg-purple-700 text-white font-bold',
      path: '/projects',
      tab: 'projects'
    },
    {
      id: 'research',
      title: 'PhD Research Hub & Preprints',
      subtitle: 'Doctoral Network & Academic Labs',
      badge: `${researchers.length} Active Labs`,
      badgeColor: 'bg-blue-50 text-campus-blue border-blue-200',
      icon: FlaskConical,
      iconBg: 'bg-blue-100/70 text-campus-blue',
      borderColor: 'hover:border-campus-blue',
      description: 'Collaborate with PhD scholars, explore funded research grants, review open preprints, and join university lab projects.',
      features: ['Open lab RA openings', 'Preprint discussions', 'Inter-lab co-authorship'],
      btnText: 'Enter Research Network',
      btnClass: 'campus-btn-primary',
      path: '/research',
      tab: 'research'
    },
    {
      id: 'teams',
      title: 'Interdisciplinary Team Matrix',
      subtitle: '6-Member Balanced Squads',
      badge: `${teams.length} Active Squads`,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Users,
      iconBg: 'bg-emerald-100/70 text-emerald-700',
      borderColor: 'hover:border-emerald-500',
      description: 'Assemble high-performing teams with automated skill balance across Developer, Designer, Domain Expert & Pitch Lead.',
      features: ['Skill gap analysis', 'Cross-college rosters', 'Real-time team kanban'],
      btnText: 'Build or Join a Team',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
      path: '/workspace',
      tab: 'workspace'
    },
    {
      id: 'stories',
      title: 'Campus Stories & Demo Reels',
      subtitle: '60s Video Pitches & Build Reels',
      badge: `${stories.length} Story Reels`,
      badgeColor: 'bg-pink-50 text-pink-800 border-pink-200',
      icon: PlayCircle,
      iconBg: 'bg-pink-100/70 text-pink-700',
      borderColor: 'hover:border-pink-500',
      description: 'Watch fast video demo reels from student builders, hackathon winners, and campus innovators across 150+ institutions.',
      features: ['60-second elevator pitches', 'Prototype video proofs', 'Campus buzz showcase'],
      btnText: 'Watch Campus Stories',
      btnClass: 'bg-pink-600 hover:bg-pink-700 text-white font-bold',
      path: '/stories',
      tab: 'stories'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-campus-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-soft-blue text-campus-deep-blue text-xs font-extrabold border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-campus-red" />
              Comprehensive Academic Framework
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-campus-deep-blue tracking-tight">
              Explore CampusNet Ecosystem Hubs
            </h2>
            <p className="text-xs sm:text-sm text-campus-muted-text max-w-2xl leading-relaxed">
              Instant one-click gateways to all innovation pillars. Direct links into full directories with zero clutter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('/discover', 'discover')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-campus-deep-blue bg-campus-warm-white hover:bg-slate-200 border border-campus-border transition-all shadow-warm-xs"
            >
              <Building2 className="w-4 h-4 text-campus-blue" />
              <span>Full Directory View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6-Card Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`bg-campus-warm-white/70 hover:bg-white rounded-3xl p-6 sm:p-7 border border-campus-border shadow-warm-sm hover:shadow-warm-xl ${pillar.borderColor} transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${pillar.iconBg} flex items-center justify-center font-bold shadow-warm-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Titles */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-campus-muted-text">
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-lg font-black text-campus-deep-blue group-hover:text-campus-blue transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-campus-slate-text/80 mt-2.5 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="mt-4 pt-3 border-t border-campus-border/70 space-y-1.5">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-campus-slate-text/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-campus-blue flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Redirect Button */}
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => handleNavigate(pillar.path, pillar.tab)}
                    className={`w-full ${pillar.btnClass} text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-warm-xs hover:shadow-warm-md transition-all cursor-pointer`}
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

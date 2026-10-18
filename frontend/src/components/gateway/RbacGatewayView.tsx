import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  GraduationCap, ShieldCheck, BookOpen, Building2, 
  ArrowRight, Sparkles, Award, Users, CheckCircle2, 
  Compass, ExternalLink, HelpCircle, Lock, ChevronRight,
  Globe, Search, Layers, FileCheck, Shield, Key,
  Calendar, ShieldAlert, Sparkle, Mail, Phone
} from 'lucide-react';

export const RbacGatewayView: React.FC = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [gatewayIntent, setGatewayIntent] = useState<'login' | 'register'>('login');

  const portals = [
    {
      id: 'student',
      title: 'Student / Innovator',
      subtitle: 'Undergraduates & Innovators',
      icon: GraduationCap,
      color: 'blue',
      cardBg: 'from-blue-50/50 to-white hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      btnBg: 'bg-campus-blue hover:bg-campus-deep-blue text-white shadow-blue-600/20',
      description: 'Join hackathon teams, build projects, connect with mentors, and earn verified credentials.',
      features: [
        'Team workspaces & hackathons',
        '1-on-1 faculty mentor guidance',
        'Verifiable digital credentials'
      ],
      loginRoute: '/student/login'
    },
    {
      id: 'mentor',
      title: 'Faculty / Mentor',
      subtitle: 'Professors & Guides',
      icon: ShieldCheck,
      color: 'amber',
      cardBg: 'from-amber-50/50 to-white hover:border-amber-300',
      iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      description: 'Review student milestones, guide innovation teams, and endorse collegiate solutions.',
      features: [
        'Mentorship requests & guidance',
        'Milestone evaluations & grading',
        'Tamper-proof certificate issuing'
      ],
      loginRoute: '/mentor/login'
    },
    {
      id: 'researcher',
      title: 'PhD Scholar / Researcher',
      subtitle: 'Doctoral Scholars & Fellows',
      icon: BookOpen,
      color: 'purple',
      cardBg: 'from-purple-50/50 to-white hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
      btnBg: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20',
      description: 'Publish open preprints, recruit student RAs, and collaborate across university labs.',
      features: [
        'Publish preprints & datasets',
        'Recruit undergraduate RAs',
        'Cross-lab peer collaboration'
      ],
      loginRoute: '/research/login'
    },
    {
      id: 'organization',
      title: 'Institution / College',
      subtitle: 'Universities & Campuses',
      icon: Building2,
      color: 'emerald',
      cardBg: 'from-emerald-50/50 to-white hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      description: 'Manage campus chapters, verify institutional status, and oversee regional hackathons.',
      features: [
        'AISHE / institutional verification',
        'Host conclaves & hackathons',
        'Club & coordinator governance'
      ],
      loginRoute: '/organization/login'
    },
    {
      id: 'event_manager',
      title: 'Event / Conclave Lead',
      subtitle: 'Hackathon & Event Leads',
      icon: Calendar,
      color: 'cyan',
      cardBg: 'from-cyan-50/50 to-white hover:border-cyan-300',
      iconBg: 'bg-cyan-600 text-white shadow-cyan-500/20',
      btnBg: 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-cyan-700/20',
      description: 'Coordinate hackathon submissions, live QR attendance check-ins, and judging rubrics.',
      features: [
        'Host consoles & team rosters',
        'Live QR attendance scanner',
        'Judging rubrics & award rankings'
      ],
      loginRoute: '/event-manager/login'
    }
  ];

  const filteredPortals = portals.filter(p => 
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-campus-blue selection:text-white">
      {/* Top Banner & Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-blue to-campus-deep-blue flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-campus-deep-blue">
                  CampusNet<span className="text-campus-red">+</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                National Academic Networking & Innovation Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-campus-blue text-xs font-semibold shadow-2xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero-Trust Role-Based Access Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-campus-deep-blue tracking-tight">
            Welcome to Campus<span className="text-campus-red">Net+</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose your authorized institutional portal. Sign in seamlessly with passwordless <strong>Email OTP</strong>. Access permissions are strictly server-enforced by your verified academic credentials.
          </p>

          {/* Quick Filter Bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search across collegiate portals..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5 Academic & Collegiate Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredPortals.map((portal) => {
            const Icon = portal.icon;

            return (
              <div
                key={portal.id}
                className={`bg-gradient-to-b ${portal.cardBg} rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group`}
              >
                <div>
                  {/* Top Header with Portal Icon */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${portal.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {/* Title & Friendly Role Description */}
                  <div className="mb-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-campus-deep-blue group-hover:text-campus-blue transition-colors leading-snug">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {portal.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                    {portal.description}
                  </p>

                  {/* Short Workspace Capabilities */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Workspace Capabilities:
                    </p>
                    <ul className="space-y-1.5">
                      {portal.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Friendly & Compact Action Button for Mobile and Laptop */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => navigate(portal.loginRoute)}
                    className={`w-full py-2 sm:py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] ${portal.btnBg}`}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        {/* Public Discovery / Browse as Guest Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-campus-blue shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-campus-deep-blue">
                Looking to Explore Without an Account?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Browse our open academic repository, explore national hackathons, read student research papers, and view live innovation projects before signing in.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/landing')}
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-campus-blue text-campus-blue hover:bg-blue-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Explore Ecosystem as Guest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Administrative & Compliance Footer Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Zero-Trust Server-Enforced RBAC & Cryptographic OTP</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-campus-blue" />
              <span>AISHE, AICTE & UGC Statutory Compliance</span>
            </span>
          </div>

          {/* Platform Security Note */}
          <div className="text-[11px] text-slate-400">
            <span>Argon2id Hash • Anti-Replay Token Expiry • Constant-Time Comparison</span>
          </div>
        </div>
      </main>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-campus-blue" />
                <h3 className="text-base font-bold text-campus-deep-blue">CampusNet+ RBAC Security Architecture</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Authentication vs. Authorization Principle:</strong>
              </p>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                The OTP is strictly for <strong>authentication</strong> (verifying who you are). It never grants access to a role simply because you selected a portal on the frontend. The backend verifies your registered roles before issuing an access token.
              </div>

              <p className="font-bold text-slate-800 pt-1">Academic & Statutory Portals Architecture:</p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="text-blue-700">Student:</strong> Undergraduates and postgraduates building projects and participating in conclaves.</li>
                <li><strong className="text-amber-700">Mentor:</strong> Professors and specialists evaluating student milestones and guiding teams.</li>
                <li><strong className="text-purple-700">Research:</strong> Doctoral scholars publishing open papers and managing lab collaborations.</li>
                <li><strong className="text-emerald-700">Organization:</strong> Accredited universities and colleges hosting regional and national hackathons.</li>
                <li><strong className="text-cyan-700">Event Manager:</strong> Conclave chairs managing registrations, live QR check-ins, and judging rubrics.</li>
              </ul>
              <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] mt-2 space-y-1 border border-slate-800">
                <p className="font-bold text-red-400">Restricted Statutory & Governance Clearances:</p>
                <p>• <strong>Level 4 Reviewer:</strong> AICTE & UGC statutory bodies for institutional audit, guidelines, and compliance.</p>
                <p>• <strong>Level 5 Super Admin:</strong> Root security authority for system-wide audit trails, policy moderation, and master ledgers.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

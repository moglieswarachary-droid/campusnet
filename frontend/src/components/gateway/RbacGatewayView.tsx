import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, ShieldCheck, BookOpen, Building2, 
  ArrowRight, Sparkles, Award, Users, CheckCircle2, 
  Compass, ExternalLink, HelpCircle, Lock, ChevronRight,
  Globe, Search, Layers, FileCheck, Shield, Key
} from 'lucide-react';

export const RbacGatewayView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentOrganizer, currentSuperAdmin, activeRole, switchRole } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Determine if there is an active session
  const isLoggedIn = !!(currentUser || currentOrganizer || currentSuperAdmin);
  const activeRoleDisplay = currentSuperAdmin 
    ? 'Super Admin' 
    : currentOrganizer 
      ? 'Organization Owner' 
      : (currentUser?.activeAppRole === 'PHD_RESEARCHER' || currentUser?.role === 'researcher' || activeRole === 'researcher')
        ? 'PhD Scholar' 
        : (currentUser?.activeAppRole === 'MENTOR' || currentUser?.role === 'mentor' || activeRole === 'mentor')
          ? 'Faculty Mentor' 
          : 'Student Innovator';

  const activeDisplayName = currentSuperAdmin
    ? (currentSuperAdmin.name || 'Super Admin Executive')
    : currentOrganizer
      ? currentOrganizer.coordinatorName
      : currentUser?.name || 'Active User';

  const handleActiveWorkspaceClick = () => {
    if (currentSuperAdmin) {
      navigate('/admin');
    } else if (currentOrganizer) {
      navigate('/organization/dashboard');
    } else if (currentUser?.activeAppRole === 'PHD_RESEARCHER' || currentUser?.role === 'researcher' || activeRole === 'researcher') {
      navigate('/researcher/dashboard');
    } else if (currentUser?.activeAppRole === 'MENTOR' || currentUser?.role === 'mentor' || activeRole === 'mentor') {
      navigate('/mentor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const [gatewayIntent, setGatewayIntent] = useState<'login' | 'register'>('login');

  const portals = [
    {
      id: 'student',
      title: 'Student / Innovator',
      badge: 'Undergraduates & Postgraduates',
      icon: GraduationCap,
      color: 'blue',
      cardBg: 'from-blue-50/50 to-white hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      btnBg: 'bg-campus-blue hover:bg-campus-deep-blue text-white shadow-blue-600/20',
      description: 'Discover opportunities, build projects, join teams, and grow your academic portfolio.',
      features: [
        'Team project workspaces & hackathon registrations',
        'Direct 1-on-1 mentorship requests & chat',
        'Verifiable digital innovation transcripts & credentials',
        'Peer collaboration across 500+ colleges nationwide'
      ],
      signInAction: 'Sign In to Student Portal',
      signUpAction: 'Create Student Account',
      loginRoute: '/student/login',
      registerRoute: '/student/register',
      forgotRoute: '/student/forgot-password'
    },
    {
      id: 'mentor',
      title: 'Faculty / Mentor',
      badge: 'Professors & Domain Specialists',
      icon: ShieldCheck,
      color: 'amber',
      cardBg: 'from-amber-50/50 to-white hover:border-amber-300',
      iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      description: 'Guide student teams, review projects, and support academic growth.',
      features: [
        'Inbox for project guidance & mentorship requests',
        'Milestone evaluations & rubric grading',
        'Issue tamper-proof mentorship certificates',
        'Curate team recommendations for national hackathons'
      ],
      signInAction: 'Sign In to Mentor Portal',
      signUpAction: 'Join as Faculty Mentor',
      loginRoute: '/mentor/login',
      registerRoute: '/mentor/register',
      forgotRoute: '/mentor/forgot-password'
    },
    {
      id: 'researcher',
      title: 'PhD Scholar / Researcher',
      badge: 'Doctoral Scholars & R&D Scientists',
      icon: BookOpen,
      color: 'purple',
      cardBg: 'from-purple-50/50 to-white hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      btnBg: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20',
      description: 'Publish research, discover collaborators, and explore innovation opportunities.',
      features: [
        'Publish pre-prints & open research whitepapers',
        'Recruit undergraduate Research Assistants (RAs)',
        'Conference presentation tracking & peer discussions',
        'ORCID iD & Vidwan verified scientific indexing'
      ],
      signInAction: 'Sign In to Research Portal',
      signUpAction: 'Onboard as PhD Scholar',
      loginRoute: '/researcher/login',
      registerRoute: '/researcher/register',
      forgotRoute: '/researcher/forgot-password'
    },
    {
      id: 'organization',
      title: 'Institution / Event Organizer',
      badge: 'Colleges, Universities & Conclaves',
      icon: Building2,
      color: 'emerald',
      cardBg: 'from-emerald-50/50 to-white hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      description: 'Verify your institution, host academic events, and connect with students nationwide.',
      features: [
        'AISHE / UGC institution verification & audit status',
        'End-to-end hackathon & symposium hosting workflow',
        'Real-time student team registrations & QR check-in',
        'Automated verifiable participation certificates'
      ],
      signInAction: 'Sign In to Institution Portal',
      signUpAction: 'Register Your Institution',
      loginRoute: '/organization/login',
      registerRoute: '/organization/register',
      forgotRoute: '/organization/forgot-password'
    }
  ];

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
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-campus-blue border border-blue-200 hidden sm:inline-block">
                  RBAC Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                National Academic Networking Platform
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-campus-blue px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Support</span>
            </button>

            <button
              onClick={() => navigate('/landing')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-campus-blue bg-blue-50 hover:bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Browse as Guest</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-campus-blue text-xs font-semibold shadow-2xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Dedicated Role-Based Access Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-campus-deep-blue tracking-tight leading-tight">
            Welcome to CampusNet<span className="text-campus-red">+</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Choose your workspace to sign in or register new credentials across student, mentor, research, and institutional networks.
          </p>

          {/* Prominent Gateway Intent Switcher (Sign In vs Sign Up) */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-slate-200/90 border border-slate-300 shadow-inner">
              <button
                type="button"
                onClick={() => setGatewayIntent('login')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  gatewayIntent === 'login'
                    ? 'bg-white text-campus-deep-blue shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-4 h-4 text-campus-blue" />
                <span>Workspace Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setGatewayIntent('register')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  gatewayIntent === 'register'
                    ? 'bg-white text-campus-deep-blue shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>New Registration / Sign Up</span>
              </button>
            </div>
          </div>
        </div>

        {/* The 4 Independent Role Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {portals.map((portal) => {
            const Icon = portal.icon;

            return (
              <div
                key={portal.id}
                className={`bg-gradient-to-b ${portal.cardBg} rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group`}
              >
                <div>
                  {/* Top Header with Icon and Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${portal.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${portal.badgeBg}`}>
                      {portal.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Description Container with Min-Height for Alignment */}
                  <div className="min-h-[58px] mb-2">
                    <h3 className="text-lg font-bold text-campus-deep-blue group-hover:text-campus-blue transition-colors leading-snug">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {portal.badge}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[48px]">
                    {portal.description}
                  </p>

                  {/* Feature Highlights with Min-Height for Consistent Baseline */}
                  <div className="space-y-2 border-t border-slate-100 pt-3 mb-6 min-h-[148px]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Workspace Capabilities:
                    </p>
                    <ul className="space-y-1.5">
                      {portal.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dual Action Buttons (Sign In & Register) Aligned to Bottom */}
                <div className="space-y-2.5 pt-2">
                  {gatewayIntent === 'login' ? (
                    <>
                      {/* Primary: Sign In */}
                      <button
                        onClick={() => navigate(portal.loginRoute)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer ${portal.btnBg}`}
                      >
                        <span>{portal.signInAction}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* Secondary: Register */}
                      <button
                        onClick={() => navigate(portal.registerRoute)}
                        className="w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all duration-200 shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{portal.signUpAction}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Primary: Register */}
                      <button
                        onClick={() => navigate(portal.registerRoute)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer ${portal.btnBg}`}
                      >
                        <span>{portal.signUpAction}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* Secondary: Sign In */}
                      <button
                        onClick={() => navigate(portal.loginRoute)}
                        className="w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all duration-200 shadow-2xs cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-500" />
                        <span>{portal.signInAction}</span>
                      </button>
                    </>
                  )}

                  <div className="flex items-center justify-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => navigate(portal.forgotRoute)}
                      className="hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Public Discovery / Browse as Guest Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Globe className="w-6 h-6 text-campus-blue" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-campus-deep-blue">
                  Looking to explore public events, hackathons, and research projects?
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  No Login Required
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Browse as Guest to discover published collegiate events, open-source student innovation repositories, PhD research pre-prints, and verified faculty mentors nationwide.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/landing')}
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-campus-blue text-campus-blue hover:bg-blue-50 text-xs font-bold transition-all shadow-xs"
          >
            <span>Browse as Guest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Administrative & Compliance Footer Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Server-Enforced RBAC & Multi-Tenant Isolation</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-campus-blue" />
              <span>All 28 States & 8 Union Territories Supported</span>
            </span>
          </div>

          {/* Platform Security Note */}
          <div className="text-[11px] text-slate-400">
            <span>Enterprise Security • Strict Resource-Level RBAC</span>
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
                <h3 className="text-base font-bold text-campus-deep-blue">CampusNet+ Access Guide</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Which workspace should I choose?</strong>
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-blue-700">Student Portal:</strong> For university students participating in hackathons, team projects, and seeking mentorship.</li>
                <li><strong className="text-amber-700">Mentor Portal:</strong> For professors and industry guides reviewing student projects and approving milestones.</li>
                <li><strong className="text-purple-700">Research Portal:</strong> For PhD scholars publishing whitepapers and hiring student research assistants.</li>
                <li><strong className="text-emerald-700">Organization Portal:</strong> For college conveners, deans, and hackathon chairs managing events.</li>
              </ul>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 mt-3">
                <p className="font-semibold">Multi-Role Accounts:</p>
                <p className="text-[11px] mt-0.5">
                  If your account possesses multiple authorized roles (e.g. Faculty Mentor + PhD Scholar), you can switch workspaces dynamically using the Workspace Switcher in your portal header.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
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

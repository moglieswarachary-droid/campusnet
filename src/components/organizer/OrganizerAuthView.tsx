import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, KeyRound, ArrowLeft, Eye, EyeOff,
  School, Check, Key
} from 'lucide-react';

import { OrganizationRegistrationWizard } from './OrganizationRegistrationWizard';

interface Props {
  initialMode?: 'login' | 'register';
}

interface DemoCollegeOption {
  id: string;
  institutionId: string;
  name: string;
  shortName: string;
  state: string;
  district: string;
  email: string;
  coordinator: string;
  designation: string;
  categoryTag: string;
}

const FIVE_DEMO_COLLEGES: DemoCollegeOption[] = [
  {
    id: 'KEC-DEMO-001',
    institutionId: 'inst-kec-001',
    name: 'Kuppam Engineering College',
    shortName: 'KEC Kuppam',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    email: 'organizer.demo@campusnet-demo.in',
    coordinator: 'Dr. Anand Kumar',
    designation: 'Dean of Innovation & Hackathons',
    categoryTag: 'Autonomous Engineering'
  },
  {
    id: 'IITB-ORG-002',
    institutionId: 'inst-001',
    name: 'IIT Bombay',
    shortName: 'IIT Bombay',
    state: 'Maharashtra',
    district: 'Mumbai',
    email: 'techfest.coord@iitb.ac.in',
    coordinator: 'Rohan Varma',
    designation: 'Convener - National Techfest',
    categoryTag: 'Institute of National Importance'
  },
  {
    id: 'CNU-DEMO-003',
    institutionId: 'inst-cnu-002',
    name: 'Indian Institute of Science (IISc)',
    shortName: 'IISc Bengaluru',
    state: 'Karnataka',
    district: 'Bengaluru',
    email: 'iisc.events@campusnet-demo.in',
    coordinator: 'Prof. Sudhir Sen',
    designation: 'Convener Academic Conclaves',
    categoryTag: 'Premier Research Institute'
  },
  {
    id: 'NITW-DEMO-004',
    institutionId: 'inst-nitw-004',
    name: 'NIT Warangal',
    shortName: 'NIT Warangal',
    state: 'Telangana',
    district: 'Warangal',
    email: 'nitw.techno@campusnet-demo.in',
    coordinator: 'Dr. K. Rajeshwar',
    designation: 'Dean of Student Affairs',
    categoryTag: 'National Institute of Technology'
  },
  {
    id: 'ANNA-DEMO-005',
    institutionId: 'inst-anna-005',
    name: 'Anna University (CEG Campus)',
    shortName: 'Anna Univ Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    email: 'annauniv.conclave@campusnet-demo.in',
    coordinator: 'Dr. Priya Sundaram',
    designation: 'Convener, National Conclave',
    categoryTag: 'State Technical University'
  }
];

export const OrganizerAuthView: React.FC<Props> = ({ initialMode }) => {
  const { organizerLogin } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(() => {
    if (initialMode) return initialMode;
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('/register') || s.includes('action=register')) return 'register';
    }
    return 'login';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes('/register') || s.includes('action=register')) {
        setMode('register');
      } else if (p.includes('/login')) {
        setMode('login');
      }
    }
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  const [selectedDemoId, setSelectedDemoId] = useState<string>('KEC-DEMO-001');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (mode === 'register') {
    return (
      <OrganizationRegistrationWizard
        onNavigateToLogin={() => setMode('login')}
        onSuccess={() => {
          // Handled by router/context
        }}
      />
    );
  }

  const [loggingInCollegeId, setLoggingInCollegeId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    organizerLogin(emailOrId, password);
  };

  const handleSelectDemoCollege = (college: DemoCollegeOption, autoLogin = true) => {
    setSelectedDemoId(college.id);
    setEmailOrId(college.email);
    setPassword('');

    if (autoLogin) {
      setLoggingInCollegeId(college.id);
      const success = organizerLogin(college.email);
      if (!success) {
        setLoggingInCollegeId(null);
      }
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Soft Ambient Blurred Glowing Orbs in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-amber-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-[32rem] h-[32rem] bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              title="Return to RBAC Gateway"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to RBAC Gateway</span>
            </a>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-warm-xs">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    Campus<span className="text-amber-600">Net+</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md">
                    ORGANIZATION PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">Institutional Event Hosting & Certification Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                window.history.pushState(null, '', '/organization/register');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-warm-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Register New Institution</span>
            </button>
            <div className="text-xs text-slate-500 hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TLS Encrypted Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full space-y-6 my-auto">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-warm-xs">
              <School className="w-3.5 h-3.5 text-amber-700" />
              <span>National Academic Event Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign in to your Organization Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Verify your institution, host academic events, manage student registrations, and connect with collegiate innovators nationwide.
            </p>
          </div>

          {/* Segmented Mode Switcher: Institutional Sign In vs Register Institution */}
          <div className="grid grid-cols-2 p-1 bg-slate-200/90 rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold shadow-inner">
            <button
              type="button"
              className="py-2.5 rounded-xl transition-all bg-white text-slate-950 shadow-sm font-extrabold cursor-default"
            >
              Institutional Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                if (typeof window !== 'undefined') window.history.pushState(null, '', '/organization/register');
              }}
              className="py-2.5 rounded-xl transition-all cursor-pointer text-slate-600 hover:text-slate-900"
            >
              + Register Institution
            </button>
          </div>

          {/* 5 DEMO LOGINS SELECTOR CARD (Clean White / Frosted Blur) */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-warm-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>5 Seeded Verified Colleges (1-Click Demo Login)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                5 COLLEGES AVAILABLE
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              Click any of the 5 institutions below to instantly prefill credentials or log in with that college:
            </p>

            {/* 5 Colleges Grid - 1-Click Login Enabled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {FIVE_DEMO_COLLEGES.map((college) => {
                const isSelected = selectedDemoId === college.id;
                const isLoggingIn = loggingInCollegeId === college.id;

                return (
                  <div
                    key={college.id}
                    onClick={() => handleSelectDemoCollege(college, true)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between hover:shadow-warm-md hover:-translate-y-0.5 active:translate-y-0 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/95 shadow-warm-xs ring-2 ring-amber-400/50'
                        : 'border-slate-200 bg-white/80 hover:bg-white hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Top State & ID Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                          {college.state}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
                          {college.id}
                        </span>
                      </div>

                      {/* Institution Name */}
                      <div className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-amber-800 transition-colors" title={college.name}>
                        {college.shortName}
                      </div>

                      {/* Coordinator & Designation */}
                      <div className="text-[11px] font-semibold text-slate-700 truncate mt-1">
                        {college.coordinator}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {college.designation}
                      </div>

                      {/* Official Login Credentials Box */}
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50/90 border border-slate-200/70 text-[10px] font-mono space-y-1 text-slate-600">
                        <div className="truncate flex items-center gap-1.5">
                          <span className="text-slate-400 font-sans text-[9px] uppercase font-bold tracking-wider">Email:</span>
                          <span className="text-slate-800 font-semibold truncate">{college.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-sans text-[9px] uppercase font-bold tracking-wider">Access:</span>
                          <span className="text-emerald-700 font-sans font-bold text-[9px] uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            1-Click Verified Sign-In
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Action Buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDemoCollege(college, true);
                        }}
                        disabled={isLoggingIn}
                        className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all group-hover:scale-[1.02] cursor-pointer"
                      >
                        {isLoggingIn ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Logging In...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                            <span>1-Click Login Now</span>
                            <ArrowRight className="w-3 h-3 text-slate-950" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDemoCollege(college, false);
                          }}
                          className="hover:text-slate-700 hover:underline transition-colors"
                        >
                          Prefill form only
                        </button>
                        {isSelected && (
                          <span className="text-amber-700 font-bold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active in form
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN LOGIN CARD (Frosted Glass Blur on Pure White Container) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-warm-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Coordinator Credentials</h2>
                <p className="text-xs text-slate-500">Edit or enter your college credentials below anytime</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>

            {!showForgotPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email / ID input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Institutional Email or College ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailOrId}
                      onChange={e => setEmailOrId(e.target.value)}
                      placeholder="e.g. organizer.demo@campusnet-demo.in or KEC-DEMO-001"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password input with toggle visibility */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Coordinator Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Remember coordinator session on this browser</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Registration link */}
                <div className="pt-3 border-t border-slate-100 text-center text-xs">
                  <span className="text-slate-600">Want to host an event for your college? </span>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                  >
                    Register New Institution
                  </button>
                </div>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Coordinator Password Recovery</h3>
                  <button onClick={() => setShowForgotPassword(false)} className="text-xs text-slate-500 hover:text-slate-900">Back</button>
                </div>

                {resetSent ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="font-bold text-sm">Recovery Instructions Sent</p>
                    <p className="text-[11px] text-slate-600">
                      An authenticated recovery link has been sent to <strong>{resetEmail}</strong> with an OTP confirmation token.
                    </p>
                    <button
                      onClick={() => { setResetSent(false); setShowForgotPassword(false); }}
                      className="text-xs font-bold text-amber-700 underline pt-2 block mx-auto"
                    >
                      Return to Organizer Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Enter the verified institutional email address associated with your college coordinator account:
                    </p>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="e.g. organizer@kec.ac.in"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-warm-xs"
                    >
                      Send Password Recovery Link
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Compliance & Security Footnote */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>Protected by CampusNet Institutional Role-Based Access Controls (RBAC)</p>
            <p>© 2026 CampusNet National Academic & Innovation Network</p>
          </div>

        </div>
      </main>

    </div>
  );
};

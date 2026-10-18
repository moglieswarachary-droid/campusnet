import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, KeyRound, ArrowLeft, Eye, EyeOff,
  School, Check, Key
} from 'lucide-react';

import { OrganizationRegistrationWizard } from './OrganizationRegistrationWizard';
import { PortalOtpLoginView } from '../auth/PortalOtpLoginView';
import { Calendar } from 'lucide-react';

interface Props {
  initialMode?: 'login' | 'register';
}



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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    organizerLogin(emailOrId, password);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
  };

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const isEventManager = typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/event-manager');

  if (mode === 'login' && !showPasswordLogin) {
    if (isEventManager) {
      return (
        <PortalOtpLoginView
          portal="event_manager"
          portalTitle="Event Manager Portal"
          portalSubtitle="Host national hackathons, coordinate judging rubrics, track live QR check-ins, and issue credentials."
          portalBadge="Level 2: Events"
          portalIcon={Calendar}
          accentColor="cyan"
          onFallbackPassword={() => setShowPasswordLogin(true)}
        />
      );
    }

    return (
      <PortalOtpLoginView
        portal="organization"
        portalTitle="Institution / Organization Portal"
        portalSubtitle="Manage institutional verification, oversee campus conclaves, and manage official club memberships."
        portalBadge="Level 3: Institution"
        portalIcon={Building2}
        accentColor="emerald"
        registerUrl="/organization/register"
        registerLabel="Register Your Institution →"
        onFallbackPassword={() => setShowPasswordLogin(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Switch to OTP banner if on password login */}
      {showPasswordLogin && (
        <div className="relative z-20 bg-emerald-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
          <span>Using legacy institutional password login.</span>
          <button
            type="button"
            onClick={() => setShowPasswordLogin(false)}
            className="underline font-bold text-emerald-100 hover:text-white cursor-pointer"
          >
            Switch to Passwordless OTP →
          </button>
        </div>
      )}

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

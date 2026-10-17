import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, ShieldCheck, Lock, User, 
  ArrowRight, KeyRound, Sparkles, CheckCircle2,
  FileCheck
} from 'lucide-react';
import { PortalOtpLoginView, DemoPersona } from '../auth/PortalOtpLoginView';

const REVIEWER_DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Dr. Sunita Murthy',
    roleDescription: 'AICTE Review Board Member',
    email: 'sunita.reviewer@aicte.gov.in',
    mobile: '+91 98765 43215',
    badge: 'AICTE Reviewer'
  }
];

const SUPER_ADMIN_DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Rajesh SuperAdmin',
    roleDescription: 'Level-5 Platform Governance & Security',
    email: 'rajesh.superadmin@campusnet.gov.in',
    mobile: '+91 98765 43216',
    badge: 'Super Admin'
  }
];

export const SuperAdminAuthView: React.FC = () => {
  const { superAdminLogin } = useApp();

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const isReviewer = typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/reviewer');

  if (!showPasswordLogin) {
    if (isReviewer) {
      return (
        <PortalOtpLoginView
          portal="reviewer"
          portalTitle="Platform Reviewer Console"
          portalSubtitle="AICTE & National Innovation Board accreditation, institutional audits, and event moderation."
          portalBadge="Level 4: Reviewer"
          portalIcon={FileCheck}
          accentColor="rose"
          onFallbackPassword={() => setShowPasswordLogin(true)}
          demoPersonas={REVIEWER_DEMO_PERSONAS}
        />
      );
    }

    return (
      <PortalOtpLoginView
        portal="super_admin"
        portalTitle="Super Admin Governance Console"
        portalSubtitle="National innovation platform governance, institution master control, RBAC policy moderation, and audit logs."
        portalBadge="Level 5: Super Admin"
        portalIcon={ShieldAlert}
        accentColor="red"
        onFallbackPassword={() => setShowPasswordLogin(true)}
        demoPersonas={SUPER_ADMIN_DEMO_PERSONAS}
      />
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    superAdminLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      
      {/* Switch to OTP banner if on password login */}
      <div className="bg-red-950/60 border-b border-red-500/30 px-4 py-2 text-center text-xs text-red-200 flex items-center justify-center gap-2">
        <span>Using administrative password + MFA console.</span>
        <button
          type="button"
          onClick={() => setShowPasswordLogin(false)}
          className="underline font-bold text-red-400 hover:text-white cursor-pointer"
        >
          Use Passwordless OTP →
        </button>
      </div>
      
      {/* Top Header */}
      <header className="border-b border-red-950/40 bg-slate-950/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">
                  Campus<span className="text-red-500">Net</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded">
                  Super Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400">National Innovation Ecosystem Governance & Moderation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>← Return to Gateway</span>
            </button>
            <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Restricted Level-5 Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Super Administrator Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Authorized central oversight authority for managing all universities, colleges, student researchers, and event compliance across India.
            </p>
          </div>

          {/* Security Directive Notice */}
          <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-red-300 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                Root Authority Verification
              </span>
              <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded font-mono text-red-300">PROTECTED CONSOLE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Enter authorized administrator credentials and hardware TOTP token to unlock governance controls.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Super Admin Identifier / Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. superadmin.demo"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hardware MFA Security Token *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={e => setMfaCode(e.target.value)}
                    placeholder="6-digit TOTP code"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-amber-400 font-mono tracking-widest outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-xl shadow-red-950/50 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Authorize & Unlock Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>Protected by CampusNet Government Compliance Layer</p>
            <p>© 2026 CampusNet National Academic Governance</p>
          </div>

        </div>
      </main>

    </div>
  );
};

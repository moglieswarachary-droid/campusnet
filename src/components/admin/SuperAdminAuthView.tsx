import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, ShieldCheck, Lock, User, 
  ArrowRight, KeyRound, Sparkles, CheckCircle2 
} from 'lucide-react';

export const SuperAdminAuthView: React.FC = () => {
  const { superAdminLogin } = useApp();

  const [username, setUsername] = useState('superadmin.demo');
  const [password, setPassword] = useState('Admin@CampusNet2026');
  const [mfaCode, setMfaCode] = useState('849201');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    superAdminLogin(username, password);
  };

  const handleQuickDemo = () => {
    setUsername('superadmin.demo');
    setPassword('Admin@CampusNet2026');
    setMfaCode('849201');
    superAdminLogin('superadmin.demo', 'Admin@CampusNet2026');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      
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

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Restricted Level-5 Access</span>
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

          {/* Dev Demo Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-red-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Seeded Super Admin Credentials
              </span>
              <span className="text-[10px] bg-red-400/20 px-2 py-0.5 rounded font-mono">ROOT DEV</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Demo credentials pre-filled: <code className="text-red-300 font-mono">superadmin.demo</code> / <code className="text-red-300 font-mono">Admin@CampusNet2026</code>
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-white font-bold text-xs border border-red-700 transition-colors"
            >
              1-Click Super Admin Login
            </button>
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

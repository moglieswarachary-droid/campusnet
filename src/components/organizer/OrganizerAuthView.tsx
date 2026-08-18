import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, KeyRound 
} from 'lucide-react';

export const OrganizerAuthView: React.FC = () => {
  const { organizerLogin, organizers } = useApp();

  const [emailOrId, setEmailOrId] = useState('organizer.demo@campusnet-demo.in');
  const [password, setPassword] = useState('CampusNet@Demo2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    organizerLogin(emailOrId, password);
  };

  const handleQuickDemo = (orgId: string) => {
    const org = organizers.find(o => o.id === orgId) || organizers[0];
    setEmailOrId(org.officialEmail);
    setPassword('CampusNet@Demo2026');
    organizerLogin(org.officialEmail, 'CampusNet@Demo2026');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">
                  Campus<span className="text-amber-400">Net</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Organizer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Institutional Event Management & Certification Console</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Secure TLS Encrypted Access</span>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Coordinator Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Log in with your authorized college email or Institution ID to manage hackathons, verify student attendance, and issue certificates.
            </p>
          </div>

          {/* Dev Demo Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Seeded Development Demo Accounts
              </span>
              <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded font-mono">DEV MODE</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Click any verified college profile to log in instantly without typing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('KEC-DEMO-001')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 text-[11px] transition-colors"
              >
                <div className="font-bold text-amber-300 truncate">Kuppam Engg College</div>
                <div className="text-slate-400 text-[10px]">ID: KEC-DEMO-001</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('CNU-DEMO-002')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 text-[11px] transition-colors"
              >
                <div className="font-bold text-blue-300 truncate">CampusNet Demo Univ</div>
                <div className="text-slate-400 text-[10px]">ID: CNU-DEMO-002</div>
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
            {!showForgotPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official Institutional Email or ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailOrId}
                      onChange={e => setEmailOrId(e.target.value)}
                      placeholder="e.g. organizer.demo@campusnet-demo.in or KEC-DEMO-001"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Remember coordinator session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">Account Recovery & Reset</h3>
                  <button onClick={() => setShowForgotPassword(false)} className="text-xs text-slate-400 hover:text-white">Back</button>
                </div>

                {resetSent ? (
                  <div className="p-4 rounded-2xl bg-green-950/40 border border-green-500/30 text-xs text-green-300 space-y-2 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
                    <p className="font-bold">Password Reset Link Dispatched</p>
                    <p className="text-[11px] text-slate-300">
                      An authenticated recovery link has been sent to <strong>{resetEmail}</strong> with an OTP confirmation token.
                    </p>
                    <button
                      onClick={() => { setResetSent(false); setShowForgotPassword(false); }}
                      className="text-xs font-bold text-amber-400 underline pt-2"
                    >
                      Return to Organizer Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-3">
                    <p className="text-xs text-slate-400">
                      Enter the verified institutional email address associated with your college coordinator account:
                    </p>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="e.g. organizer@kec.ac.in"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                    >
                      Send Password Recovery Link
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>Protected by CampusNet Institutional Role-Based Access Controls (RBAC)</p>
            <p>© 2026 CampusNet National Academic & Innovation Network</p>
          </div>

        </div>
      </main>

    </div>
  );
};

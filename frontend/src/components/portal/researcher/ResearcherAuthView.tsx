import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { 
  BookOpen, Mail, Lock, ArrowRight, ArrowLeft, 
  Eye, EyeOff, Sparkles, CheckCircle2, Award, 
  KeyRound, User, AlertCircle, RefreshCw, Compass, Key
} from 'lucide-react';

import { PortalOtpLoginView, DemoPersona } from '../../auth/PortalOtpLoginView';

const RESEARCHER_DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Dr. Vikram Research',
    roleDescription: 'Doctoral Scholar (IISc Bengaluru)',
    email: 'vikram.research@iisc.ac.in',
    mobile: '+91 98765 43212',
    badge: 'PhD Scholar'
  },
  {
    name: 'Pooja Sundaram',
    roleDescription: 'Neuromorphic Computing Lab (IISc)',
    email: 'pooja.sundaram@iisc.ac.in',
    mobile: '+91 98765 43222',
    badge: 'PhD Scholar'
  }
];

interface Props {
  mode?: 'login' | 'register' | 'forgot-password';
}

export const ResearcherAuthView: React.FC<Props> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole, setCurrentUser, addToast, researchers } = useApp();

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [currentMode, setCurrentMode] = useState<'login' | 'register' | 'forgot-password'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('register')) return 'register';
      if (window.location.pathname.includes('forgot-password')) return 'forgot-password';
    }
    return mode;
  });

  useEffect(() => {
    if (location.pathname.includes('register')) {
      setCurrentMode('register');
    } else if (location.pathname.includes('forgot-password')) {
      setCurrentMode('forgot-password');
    } else if (mode) {
      setCurrentMode(mode);
    }
  }, [mode, location.pathname]);

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setCurrentMode(newMode);
    setErrorMsg('');
    setIsOtpStep(false);
    navigate(newMode === 'register' ? '/researcher/register' : '/researcher/login');
  };

  const [emailOrOrcid, setEmailOrOrcid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [thesisTopic, setThesisTopic] = useState('Neuromorphic Computing & Spiking Neural Architectures');
  const [institution, setInstitution] = useState('Indian Institute of Science (IISc), Bengaluru');
  const [labName, setLabName] = useState('Neuromorphic Intelligence & Cognitive Computing Lab');
  const [advisorName, setAdvisorName] = useState('Prof. Sudhir Sen');
  const [orcidId, setOrcidId] = useState('0000-0002-8819-421X');

  // OTP Verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/researcher/dashboard';

  // 1-Click Demo Researcher Login
  const handleDemoResearcherLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoResearcher = researchers[0] || {
        id: 'res-001',
        name: 'Pooja Sundaram',
        email: 'pooja.sundaram@iisc.ac.in',
        role: 'researcher',
        roles: ['PHD_RESEARCHER'],
        activeAppRole: 'PHD_RESEARCHER',
        institution: 'Indian Institute of Science (IISc), Bengaluru',
        department: 'Computational and Data Sciences (CDS)',
        avatar: ''
      };

      setCurrentUser({
        ...demoResearcher,
        role: 'researcher',
        roles: ['PHD_RESEARCHER'],
        activeAppRole: 'PHD_RESEARCHER'
      } as any);
      switchRole('researcher');
      setIsLoading(false);
      addToast({ type: 'success', message: 'Welcome back, Pooja! Signed into Research Portal.' });
      navigate(redirectTarget);
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrOrcid.trim() || !password.trim()) {
      setErrorMsg('Please enter your research email/ORCID iD and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const matched = researchers.find(r => r.email.toLowerCase() === emailOrOrcid.toLowerCase()) || researchers[0];
      setCurrentUser({
        ...matched,
        role: 'researcher',
        roles: ['PHD_RESEARCHER'],
        activeAppRole: 'PHD_RESEARCHER'
      } as any);
      switchRole('researcher');
      setIsLoading(false);
      addToast({ type: 'success', message: `Welcome back, ${matched.name}!` });
      navigate(redirectTarget);
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailOrOrcid || !password) {
      setErrorMsg('Please fill in all required research details.');
      return;
    }
    setIsOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setErrorMsg('Invalid code. Please enter demo verification OTP 123456');
      return;
    }

    if (currentMode === 'forgot-password') {
      setResetSuccess(true);
      setTimeout(() => {
        setCurrentMode('login');
        setResetSuccess(false);
        setIsOtpStep(false);
        addToast({ type: 'success', message: 'Password successfully reset! Please login.' });
      }, 1500);
      return;
    }

    const newResearcher = {
      id: `res-${Date.now()}`,
      name: fullName,
      email: emailOrOrcid,
      role: 'researcher' as const,
      roles: ['PHD_RESEARCHER' as const],
      activeAppRole: 'PHD_RESEARCHER' as const,
      institution,
      department: labName,
      orcid_id: orcidId,
      advisor_name: advisorName,
      thesis_title: thesisTopic,
      avatar: '',
      bio: 'Doctoral researcher passionate about deep learning and scientific computing.'
    };

    setCurrentUser(newResearcher as any);
    switchRole('researcher');
    addToast({ type: 'success', message: 'PhD Scholar account onboarded and verified!' });
    navigate('/researcher/dashboard');
  };

  if (currentMode === 'login' && !showPasswordLogin) {
    return (
      <PortalOtpLoginView
        portal="researcher"
        portalTitle="PhD Scholar & Research Portal"
        portalSubtitle="Publish research pre-prints, recruit research assistants, and collaborate across laboratories."
        portalBadge="Level 3: Research"
        portalIcon={BookOpen}
        accentColor="purple"
        registerUrl="/researcher/register"
        registerLabel="Onboard as PhD Scholar →"
        onFallbackPassword={() => setShowPasswordLogin(true)}
        demoPersonas={RESEARCHER_DEMO_PERSONAS}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-purple-700 selection:text-white">
      {/* Top Back Navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RBAC Gateway</span>
        </button>
        <span className="text-[11px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
          Research Portal
        </span>
      </div>

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-900/15">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {currentMode === 'login' && 'Sign in to your Research Portal'}
          {currentMode === 'register' && 'PhD Scholar Onboarding'}
          {currentMode === 'forgot-password' && 'Scholar Password Recovery'}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          {currentMode === 'login' && 'Publish research, discover collaborators, and explore innovation opportunities.'}
          {currentMode === 'register' && 'Publish scientific pre-prints, recruit RAs, and connect with academic labs.'}
          {currentMode === 'forgot-password' && 'Enter your institutional research email to reset your password.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 space-y-6">
          
          {/* Switch to OTP banner if on password login */}
          {currentMode === 'login' && showPasswordLogin && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-purple-800 font-medium">Using legacy password login</span>
              <button
                type="button"
                onClick={() => setShowPasswordLogin(false)}
                className="font-bold text-purple-700 hover:underline cursor-pointer"
              >
                Use Passwordless OTP →
              </button>
            </div>
          )}

          {/* Segmented Mode Switcher: Sign In vs Sign Up */}
          {!isOtpStep && currentMode !== 'forgot-password' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  currentMode === 'login' 
                    ? 'bg-white text-purple-900 shadow-xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  currentMode === 'register' 
                    ? 'bg-white text-purple-900 shadow-xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Onboard as Scholar
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Password successfully reset! Redirecting to login...</span>
            </div>
          )}

          {isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Enter Research Verification OTP</h4>
                <p className="text-xs text-slate-500">
                  Enter 6-digit code sent to your academic inbox. (Demo OTP: <strong className="text-purple-700">123456</strong>)
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-md transition-all"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </form>
          ) : currentMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* 1-Click Quick Demo Button */}
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>1-Click PhD Scholar Evaluation Account</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoResearcherLogin}
                  disabled={isLoading}
                  className="w-full py-2 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign in as Pooja Sundaram (IISc Bengaluru)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Or manual scholar login</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Research Email or ORCID iD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrOrcid}
                    onChange={(e) => setEmailOrOrcid(e.target.value)}
                    placeholder="pooja.sundaram@iisc.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentMode('forgot-password')}
                    className="text-[11px] font-semibold text-purple-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating Scholar...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Research Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <span>New PhD scholar or scientist? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className="font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  Onboard here
                </button>
              </div>
            </form>
          ) : currentMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja Sundaram"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Email *
                  </label>
                  <input
                    type="email"
                    value={emailOrOrcid}
                    onChange={(e) => setEmailOrOrcid(e.target.value)}
                    placeholder="scholar@inst.ac.in"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ORCID iD
                  </label>
                  <input
                    type="text"
                    value={orcidId}
                    onChange={(e) => setOrcidId(e.target.value)}
                    placeholder="0000-0002-8819-421X"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Thesis / Research Topic
                </label>
                <input
                  type="text"
                  value={thesisTopic}
                  onChange={(e) => setThesisTopic(e.target.value)}
                  placeholder="e.g. Neuromorphic Computing & Edge AI"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Advisor / Guide
                  </label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lab / Department
                  </label>
                  <input
                    type="text"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition-all"
              >
                Proceed to Verification
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                <span>Already onboarded? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Research Email
                </label>
                <input
                  type="email"
                  value={emailOrOrcid}
                  onChange={(e) => setEmailOrOrcid(e.target.value)}
                  placeholder="scholar@iisc.ac.in"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition-all"
              >
                Send Research OTP
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setCurrentMode('login')}
                  className="font-bold text-slate-600 hover:text-purple-700"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

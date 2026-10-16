import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { 
  ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, 
  Eye, EyeOff, Sparkles, CheckCircle2, Award, 
  KeyRound, User, BookOpen, AlertCircle, RefreshCw,
  School, GraduationCap, Key
} from 'lucide-react';

interface Props {
  mode?: 'login' | 'register' | 'forgot-password';
}

export const MentorAuthView: React.FC<Props> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole, setCurrentUser, addToast, mentors } = useApp();

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
    navigate(newMode === 'register' ? '/mentor/register' : '/mentor/login');
  };

  const [emailOrEmpId, setEmailOrEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('Associate Professor & Head of Robotics');
  const [institution, setInstitution] = useState('Indian Institute of Technology Bombay');
  const [domain, setDomain] = useState('Autonomous Systems, Computer Vision, Edge AI');
  const [employeeId, setEmployeeId] = useState('IITB-FAC-8842');
  const [vidwanUrl, setVidwanUrl] = useState('https://vidwan.inflibnet.ac.in/profile/99214');
  const [maxMentees, setMaxMentees] = useState('5');

  // OTP Verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/mentor/dashboard';

  // 1-Click Demo Mentor Login
  const handleDemoMentorLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoMentor = mentors[0] || {
        id: 'mnt-001',
        name: 'Dr. Arvind Rao',
        email: 'arvind.rao@iitb.ac.in',
        role: 'mentor',
        roles: ['MENTOR', 'PHD_RESEARCHER'],
        activeAppRole: 'MENTOR',
        institution: 'Indian Institute of Technology Bombay',
        designation: 'Associate Professor & Head of Robotics',
        avatar: ''
      };

      setCurrentUser({
        ...demoMentor,
        roles: ['MENTOR', 'PHD_RESEARCHER'],
        activeAppRole: 'MENTOR'
      } as any);
      switchRole('mentor');
      setIsLoading(false);
      addToast({ type: 'success', message: 'Welcome back, Dr. Arvind Rao! Signed into Mentor Portal.' });
      navigate(redirectTarget);
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrEmpId.trim() || !password.trim()) {
      setErrorMsg('Please enter your faculty email/employee ID and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const matched = mentors.find(m => m.email.toLowerCase() === emailOrEmpId.toLowerCase()) || mentors[0];
      setCurrentUser({
        ...matched,
        role: 'mentor',
        roles: ['MENTOR'],
        activeAppRole: 'MENTOR'
      } as any);
      switchRole('mentor');
      setIsLoading(false);
      addToast({ type: 'success', message: `Welcome back, ${matched.name}!` });
      navigate(redirectTarget);
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailOrEmpId || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    setIsOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setErrorMsg('Invalid code. Please enter demo OTP 123456');
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

    const newMentor = {
      id: `mnt-${Date.now()}`,
      name: fullName,
      email: emailOrEmpId,
      role: 'mentor' as const,
      roles: ['MENTOR' as const],
      activeAppRole: 'MENTOR' as const,
      institution,
      designation,
      domain: domain.split(',').map(d => d.trim()),
      vidwan_profile_url: vidwanUrl,
      verifiedFaculty: true,
      avatar: '',
      bio: 'Experienced academic researcher and hackathon mentor.'
    };

    setCurrentUser(newMentor as any);
    switchRole('mentor');
    addToast({ type: 'success', message: 'Faculty Mentor onboarding completed successfully!' });
    navigate('/mentor/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Back Navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RBAC Gateway</span>
        </button>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          Mentor Portal
        </span>
      </div>

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-900/15">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {currentMode === 'login' && 'Sign in to your Mentor Portal'}
          {currentMode === 'register' && 'Faculty & Mentor Onboarding'}
          {currentMode === 'forgot-password' && 'Mentor Password Recovery'}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          {currentMode === 'login' && 'Guide student teams, review projects, and support academic growth.'}
          {currentMode === 'register' && 'Join India\'s premier academic mentor network to evaluate hackathon milestones.'}
          {currentMode === 'forgot-password' && 'Enter your verified faculty email to reset your portal password.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 space-y-6">
          
          {/* Segmented Mode Switcher: Sign In vs Sign Up */}
          {!isOtpStep && currentMode !== 'forgot-password' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  currentMode === 'login' 
                    ? 'bg-white text-amber-900 shadow-xs font-extrabold' 
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
                    ? 'bg-white text-amber-900 shadow-xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Join as Faculty Mentor
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
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Enter Faculty OTP Code</h4>
                <p className="text-xs text-slate-500">
                  Enter 6-digit code sent to your academic email. (Demo OTP: <strong className="text-amber-700">123456</strong>)
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all"
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
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>1-Click Mentor Evaluation Account</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoMentorLogin}
                  disabled={isLoading}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign in as Dr. Arvind Rao (IIT Bombay)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Or manual faculty login</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty Email or Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrEmpId}
                    onChange={(e) => setEmailOrEmpId(e.target.value)}
                    placeholder="professor@iitb.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
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
                    className="text-[11px] font-semibold text-amber-700 hover:underline"
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
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
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
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Faculty Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Mentor Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <span>Want to join as a faculty mentor? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Onboard here
                </button>
              </div>
            </form>
          ) : currentMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (with Title) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Arvind Rao"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Faculty Email *
                  </label>
                  <input
                    type="email"
                    value={emailOrEmpId}
                    onChange={(e) => setEmailOrEmpId(e.target.value)}
                    placeholder="name@inst.ac.in"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="FAC-8842"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Research / Mentorship Domains
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Edge AI, Robotics, Embedded Systems"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                Proceed to Verification
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                <span>Already onboarded? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty Email Address
                </label>
                <input
                  type="email"
                  value={emailOrEmpId}
                  onChange={(e) => setEmailOrEmpId(e.target.value)}
                  placeholder="faculty@iitb.ac.in"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                Send Faculty OTP
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setCurrentMode('login')}
                  className="font-bold text-slate-600 hover:text-amber-700"
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

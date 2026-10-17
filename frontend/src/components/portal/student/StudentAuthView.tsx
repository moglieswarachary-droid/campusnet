import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { 
  GraduationCap, Mail, Lock, ArrowRight, ArrowLeft, 
  Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, 
  KeyRound, User, BookOpen, AlertCircle, RefreshCw, Key
} from 'lucide-react';

import { PortalOtpLoginView, DemoPersona } from '../../auth/PortalOtpLoginView';

const STUDENT_DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Aarav Sharma',
    roleDescription: 'Student Innovator & Event Manager (NITK)',
    email: 'aarav.sharma@nitk.edu.in',
    mobile: '+91 98765 43210',
    badge: 'Dual Role'
  },
  {
    name: 'Rohan Gupta',
    roleDescription: 'B.Tech CS Undergrad (IITB)',
    email: 'rohan.gupta@iitb.ac.in',
    mobile: '+91 98765 43220',
    badge: 'Student'
  },
  {
    name: 'Suspended Account Test',
    roleDescription: 'Disciplinary Suspension (Expected 403)',
    email: 'suspended.student@nitk.edu.in',
    mobile: '+91 98765 43299',
    badge: 'Suspended'
  }
];

interface Props {
  mode?: 'login' | 'register' | 'forgot-password';
}

export const StudentAuthView: React.FC<Props> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole, setCurrentUser, addToast, students } = useApp();

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
    navigate(newMode === 'register' ? '/student/register' : '/student/login');
  };

  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [institution, setInstitution] = useState('NIT Karnataka, Surathkal');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [degree, setDegree] = useState('B.Tech');
  const [batchYear, setBatchYear] = useState('2026');
  const [skills, setSkills] = useState('PyTorch, ROS 2, React, TypeScript');

  // OTP Verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Read query params for redirect
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/student/dashboard';

  // 1-Click Demo Login
  const handleDemoStudentLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoStudent = students[0] || {
        id: 'usr-001',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@nitk.edu.in',
        role: 'student',
        roles: ['STUDENT', 'EVENT_MANAGER'],
        activeAppRole: 'STUDENT',
        department: 'Computer Science & Engineering',
        institution: 'NIT Karnataka, Surathkal',
        verifiedStudent: true,
        avatar: ''
      };
      
      setCurrentUser(demoStudent as any);
      switchRole('student');
      setIsLoading(false);
      addToast({ type: 'success', message: 'Welcome back, Aarav! Signed into Student Portal.' });
      navigate(redirectTarget);
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrRoll.trim() || !password.trim()) {
      setErrorMsg('Please enter both your college email/roll number and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Find matching student or default demo student
      const matched = students.find(s => s.email.toLowerCase() === emailOrRoll.toLowerCase()) || students[0];
      
      setCurrentUser({
        ...matched,
        roles: ['STUDENT'],
        activeAppRole: 'STUDENT'
      } as any);
      switchRole('student');
      setIsLoading(false);
      addToast({ type: 'success', message: `Welcome to CampusNet+, ${matched.name}!` });
      navigate(redirectTarget);
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailOrRoll || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
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
        addToast({ type: 'success', message: 'Password updated! Please sign in with your new password.' });
      }, 1500);
      return;
    }

    // Finish registration
    const newStudent = {
      id: `std-${Date.now()}`,
      name: fullName,
      email: emailOrRoll,
      role: 'student' as const,
      roles: ['STUDENT' as const],
      activeAppRole: 'STUDENT' as const,
      institution,
      department,
      skills: skills.split(',').map(s => s.trim()),
      verifiedStudent: true,
      avatar: '',
      bio: 'Enthusiastic engineering student and hackathon innovator.',
      points: 150,
      badges: ['Early Innovator', 'Verified Scholar']
    };

    setCurrentUser(newStudent as any);
    switchRole('student');
    addToast({ type: 'success', message: 'Student account registered and verified successfully!' });
    navigate('/student/dashboard');
  };

  if (currentMode === 'login' && !showPasswordLogin) {
    return (
      <PortalOtpLoginView
        portal="student"
        portalTitle="Student Innovator Portal"
        portalSubtitle="Access hackathon teams, 1-on-1 mentorship, and digital innovation credentials."
        portalBadge="Level 1: Student"
        portalIcon={GraduationCap}
        accentColor="blue"
        registerUrl="/student/register"
        registerLabel="Create Student Account →"
        onFallbackPassword={() => setShowPasswordLogin(true)}
        demoPersonas={STUDENT_DEMO_PERSONAS}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-campus-blue selection:text-white">
      {/* Top Back to Gateway Navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-campus-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RBAC Gateway</span>
        </button>
        <span className="text-[11px] font-bold text-campus-blue bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
          Student Portal
        </span>
      </div>

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-campus-blue to-campus-deep-blue text-white flex items-center justify-center mx-auto shadow-md shadow-blue-900/15">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-campus-deep-blue tracking-tight">
          {currentMode === 'login' && 'Sign in to your Student Portal'}
          {currentMode === 'register' && 'Create your Student Account'}
          {currentMode === 'forgot-password' && 'Student Password Recovery'}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          {currentMode === 'login' && 'Discover opportunities, build projects, join teams, and grow your academic portfolio.'}
          {currentMode === 'register' && 'Join 50,000+ collegiate innovators, build teams, and showcase hackathon projects.'}
          {currentMode === 'forgot-password' && 'Enter your verified college email to receive a secure password reset OTP.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 space-y-6">
          
          {/* Switch to OTP banner if on password login */}
          {currentMode === 'login' && showPasswordLogin && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-blue-800 font-medium">Using legacy password login</span>
              <button
                type="button"
                onClick={() => setShowPasswordLogin(false)}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
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
                    ? 'bg-white text-campus-deep-blue shadow-xs font-extrabold' 
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
                    ? 'bg-white text-campus-deep-blue shadow-xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
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

          {/* OTP Verification Step */}
          {isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-campus-blue flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-campus-deep-blue">Verify Email / Phone</h4>
                <p className="text-xs text-slate-500">
                  Enter 6-digit verification code sent to your credentials. (Demo OTP: <strong className="text-campus-blue">123456</strong>)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-campus-blue hover:bg-campus-deep-blue text-white shadow-md transition-all"
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
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* 1-Click Quick Demo Button */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-campus-blue">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1-Click Student Evaluation Account</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoStudentLogin}
                  disabled={isLoading}
                  className="w-full py-2 px-3 rounded-lg bg-campus-blue hover:bg-campus-deep-blue text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign in as Aarav Sharma (NITK Student)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Or manual sign in</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College Email or Roll Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrRoll}
                    onChange={(e) => setEmailOrRoll(e.target.value)}
                    placeholder="student@nitk.edu.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
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
                    className="text-[11px] font-semibold text-campus-blue hover:underline"
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
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
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
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-campus-blue hover:bg-campus-deep-blue text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Student Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <span>Don't have a student account? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className="font-bold text-campus-blue hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </form>
          ) : currentMode === 'register' ? (
            /* Student Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College Email *
                  </label>
                  <input
                    type="email"
                    value={emailOrRoll}
                    onChange={(e) => setEmailOrRoll(e.target.value)}
                    placeholder="student@college.edu.in"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="22CS1048"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
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
                  placeholder="e.g. NIT Karnataka, Surathkal"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Python, Machine Learning, ROS"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-campus-blue hover:bg-campus-deep-blue text-white shadow-sm transition-all"
              >
                Proceed to Verification
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                <span>Already registered? </span>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="font-bold text-campus-blue hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={emailOrRoll}
                    onChange={(e) => setEmailOrRoll(e.target.value)}
                    placeholder="student@college.edu.in"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-campus-blue hover:bg-campus-deep-blue text-white shadow-sm transition-all"
              >
                Send Verification OTP
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setCurrentMode('login')}
                  className="font-bold text-slate-600 hover:text-campus-blue"
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

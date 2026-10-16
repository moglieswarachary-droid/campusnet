import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, GraduationCap, Award, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Mail, Lock, Phone, Building2, 
  MapPin, BookOpen, Briefcase, FileText, UserCheck, Eye, EyeOff,
  AlertCircle, KeyRound, RefreshCw, ChevronRight, Check
} from 'lucide-react';
import { RoleType, AppRole } from '../../types';
import { 
  MOCK_DEPARTMENTS_LIST, 
  MOCK_INSTITUTIONS_LIST, 
  MOCK_INDIAN_STATES, 
  MOCK_ORGANIZER_ACCOUNTS 
} from '../../data/mockData';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { 
  normalizeAppRole, 
  resolvePostLoginRoute, 
  getRoleDisplayName, 
  getRoleBadgeClass 
} from '../../utils/rbac';

export const AuthPortalModal: React.FC = () => {
  const { 
    authModalType, setAuthModalType, authTargetRole, authTargetMode, 
    switchRole, setActiveTab, addToast, currentUser, setCurrentUser, 
    organizerLogin 
  } = useApp();
  
  // Primary Tabs: 'student' | 'mentor' | 'scholar' | 'organizer'
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | 'scholar' | 'organizer'>('student');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Multi-Role Workspace Selection State (if user account holds multiple roles)
  const [multiRoleUser, setMultiRoleUser] = useState<any | null>(null);

  // Password Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify' | 'success'>('request');

  // Sync state whenever modal is opened
  useEffect(() => {
    if (authModalType !== 'none') {
      setValidationError(null);
      setIsOtpStep(false);
      setMultiRoleUser(null);
      setRecoveryStep('request');

      if (authTargetRole) {
        setSelectedRole(authTargetRole);
      } else if (authModalType === 'mentor_onboarding') {
        setSelectedRole('mentor');
      } else if (authModalType === 'scholar_register') {
        setSelectedRole('scholar');
      } else if (authModalType === 'organizer_login' || authModalType === 'organizer_register') {
        setSelectedRole('organizer');
      } else {
        setSelectedRole('student');
      }

      if (authTargetMode) {
        setMode(authTargetMode);
      } else if (authModalType === 'student_register' || authModalType === 'mentor_onboarding' || authModalType === 'scholar_register' || authModalType === 'organizer_register') {
        setMode('register');
      } else {
        setMode('login');
      }
    }
  }, [authModalType, authTargetRole, authTargetMode]);

  // Keyboard Navigation: Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalType !== 'none') {
        sessionStorage.setItem('campusnet_session_entered', 'true');
        setAuthModalType('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalType, setAuthModalType]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  // Student Form State
  const [stdName, setStdName] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [stdMobile, setStdMobile] = useState('');
  const [stdPassword, setStdPassword] = useState('');
  const [stdCollege, setStdCollege] = useState(MOCK_INSTITUTIONS_LIST[0]);
  const [stdDept, setStdDept] = useState(MOCK_DEPARTMENTS_LIST[0]);
  const [stdDegree, setStdDegree] = useState('B.Tech / B.E.');
  const [stdYear, setStdYear] = useState('3rd Year');
  const [stdState, setStdState] = useState('Karnataka');
  const [stdDistrict, setStdDistrict] = useState('Bengaluru Urban');
  const [stdSkills, setStdSkills] = useState('');
  const [stdInterests, setStdInterests] = useState('');
  const [stdRollNo, setStdRollNo] = useState('');

  // Mentor Form State
  const [mntName, setMntName] = useState('');
  const [mntEmail, setMntEmail] = useState('');
  const [mntMobile, setMntMobile] = useState('');
  const [mntPassword, setMntPassword] = useState('');
  const [mntDesignation, setMntDesignation] = useState('Associate Professor / Research Lead');
  const [mntOrg, setMntOrg] = useState(MOCK_INSTITUTIONS_LIST[1]);
  const [mntDept, setMntDept] = useState(MOCK_DEPARTMENTS_LIST[0]);
  const [mntExp, setMntExp] = useState('10+ Years');
  const [mntState, setMntState] = useState('Maharashtra');
  const [mntDistrict, setMntDistrict] = useState('Mumbai');
  const [mntExpertise, setMntExpertise] = useState('Edge AI, Computer Vision & Robotics');
  const [mntVidwan, setMntVidwan] = useState('https://vidwan.inflibnet.ac.in/profile/142981');

  // Scholar Form State
  const [schName, setSchName] = useState('');
  const [schEmail, setSchEmail] = useState('');
  const [schMobile, setSchMobile] = useState('');
  const [schInstitution, setSchInstitution] = useState('Indian Institute of Science (IISc Bangalore)');
  const [schDept, setSchDept] = useState('Computational and Data Sciences');
  const [schArea, setSchArea] = useState('Privacy-Preserving Federated Learning');
  const [schSupervisor, setSchSupervisor] = useState('Prof. Chiranjib Bhattacharyya');
  const [schScholarId, setSchScholarId] = useState('IISC-PHD-2024-09');
  const [schState, setSchState] = useState('Karnataka');
  const [schDistrict, setSchDistrict] = useState('Bengaluru Urban');

  // Organizer Form State
  const [orgEmail, setOrgEmail] = useState('organizer.demo@campusnet-demo.in');
  const [orgPassword, setOrgPassword] = useState('');
  const [orgInstitution, setOrgInstitution] = useState('Kuppam Engineering College (KEC)');
  const [orgCoordinator, setOrgCoordinator] = useState('Dr. Anand Kumar');
  const [orgDesignation, setOrgDesignation] = useState('Dean of Innovation & Event Lead');
  const [orgMobile, setOrgMobile] = useState('+91 94401 23456');
  const [orgCategory, setOrgCategory] = useState('Engineering College');
  const [orgState, setOrgState] = useState('Andhra Pradesh');
  const [orgDistrict, setOrgDistrict] = useState('Chittoor');
  const [orgCity, setOrgCity] = useState('Kuppam');

  if (authModalType === 'none') return null;

  // District options derived dynamically from selected state (covering all 28 states & 8 UTs)
  const currentDistricts = (stateName: string) => {
    const list = getDistrictsByStateName(stateName);
    return list.length > 0 ? list : ['Central', 'North', 'South', 'East', 'West'];
  };

  // Safe dismiss for guest exploration
  const handleDismissAsGuest = () => {
    sessionStorage.setItem('campusnet_session_entered', 'true');
    setAuthModalType('none');
  };

  // Complete Login Routing
  const completeLoginSuccess = (role: AppRole, displayName: string, orgStatus?: any) => {
    sessionStorage.setItem('campusnet_session_entered', 'true');
    setAuthModalType('none');
    
    // Check if query params contain a redirect target
    const searchParams = new URLSearchParams(window.location.search);
    const redirectParam = searchParams.get('redirect');

    const targetRoute = resolvePostLoginRoute(role, orgStatus, redirectParam || undefined);

    addToast({
      type: 'success',
      title: `${displayName} Session Activated`,
      message: `Welcome! Entering your ${getRoleDisplayName(role)} workspace.`
    });

    if (role === 'ORGANIZATION_OWNER' || role === 'EVENT_MANAGER') {
      window.location.href = targetRoute;
    } else if (role === 'PLATFORM_REVIEWER' || role === 'SUPER_ADMIN') {
      window.location.href = targetRoute;
    } else {
      setActiveTab('dashboard');
      if (typeof window !== 'undefined' && window.location.pathname !== targetRoute) {
        window.history.pushState(null, '', targetRoute);
      }
    }
  };

  // Submit Handler: Student
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'login') {
      // Check for multi-role demo account (e.g. Karthik Raja: Student + Event Manager)
      if (stdEmail.toLowerCase().includes('karthik') || stdEmail.toLowerCase().includes('multi')) {
        setMultiRoleUser({
          id: 'usr-multi-001',
          name: 'Karthik Raja',
          email: stdEmail || 'karthik.raja@campusnet.in',
          roles: ['STUDENT', 'EVENT_MANAGER'] as AppRole[],
          institution: 'Kuppam Engineering College'
        });
        return;
      }

      switchRole('student');
      completeLoginSuccess('STUDENT', 'Student Innovator');
    } else if (mode === 'register') {
      if (!isOtpStep) {
        if (!stdEmail || !stdName || !stdRollNo) {
          setValidationError('Please complete all mandatory bonafide registration fields.');
          return;
        }
        setIsOtpStep(true);
        setOtpTimer(60);
        addToast({
          type: 'info',
          title: 'Verification Code Dispatched',
          message: `A 6-digit code has been sent to ${stdEmail}. (Enter 123456 to verify)`
        });
        return;
      }

      // OTP Verification check
      if (otpInput !== '123456' && otpInput.length !== 6) {
        setValidationError('Invalid 6-digit verification code. Please enter 123456.');
        return;
      }

      setCurrentUser(prev => ({
        ...prev,
        name: stdName || prev.name,
        email: stdEmail || prev.email,
        mobile: stdMobile || prev.mobile,
        institution: stdCollege || prev.institution,
        department: stdDept || prev.department,
        course: `${stdDegree} in ${stdDept}`,
        year: stdYear || prev.year,
        studentId: stdRollNo || prev.studentId,
        skills: stdSkills ? stdSkills.split(',').map(s => s.trim()) : prev.skills,
        interests: stdInterests ? stdInterests.split(',').map(s => s.trim()) : prev.interests,
        state: stdState,
        city: stdDistrict,
        verifiedStudent: true,
        role: 'student',
        roles: ['STUDENT']
      }));

      switchRole('student');
      completeLoginSuccess('STUDENT', stdName || 'Student Innovator');
    }
  };

  // Submit Handler: Mentor
  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'login') {
      // Check multi-role demo account (Dr. Meenakshi: Mentor + Platform Reviewer)
      if (mntEmail.toLowerCase().includes('meenakshi')) {
        setMultiRoleUser({
          id: 'usr-mnt-multi-001',
          name: 'Dr. Meenakshi Sundaram',
          email: mntEmail || 'meenakshi.s@campusnet.in',
          roles: ['MENTOR', 'PLATFORM_REVIEWER'] as AppRole[],
          institution: 'Anna University'
        });
        return;
      }

      switchRole('mentor');
      completeLoginSuccess('MENTOR', 'Faculty Mentor');
    } else if (mode === 'register') {
      if (!isOtpStep) {
        if (!mntEmail || !mntName) {
          setValidationError('Please complete all mandatory academic verification fields.');
          return;
        }
        setIsOtpStep(true);
        setOtpTimer(60);
        addToast({
          type: 'info',
          title: 'Institutional Verification Code Dispatched',
          message: `Code sent to ${mntEmail}. Enter 123456 to verify academic accreditation.`
        });
        return;
      }

      if (otpInput !== '123456' && otpInput.length !== 6) {
        setValidationError('Invalid code. Enter 123456.');
        return;
      }

      switchRole('mentor');
      completeLoginSuccess('MENTOR', mntName || 'Faculty Mentor');
    }
  };

  // Submit Handler: PhD Scholar
  const handleScholarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'login') {
      switchRole('researcher');
      completeLoginSuccess('PHD_RESEARCHER', 'PhD Scholar');
    } else if (mode === 'register') {
      if (!isOtpStep) {
        if (!schEmail || !schName || !schScholarId) {
          setValidationError('Please provide doctoral candidate details.');
          return;
        }
        setIsOtpStep(true);
        setOtpTimer(60);
        addToast({
          type: 'info',
          title: 'Doctoral Verification Code Dispatched',
          message: `Code sent to ${schEmail}. Enter 123456 to verify university lab ID.`
        });
        return;
      }

      if (otpInput !== '123456' && otpInput.length !== 6) {
        setValidationError('Invalid code. Enter 123456.');
        return;
      }

      switchRole('researcher');
      completeLoginSuccess('PHD_RESEARCHER', schName || 'PhD Scholar');
    }
  };

  // Submit Handler: Organization
  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'login') {
      const ok = organizerLogin(orgEmail, orgPassword);
      if (ok) {
        // If unverified/pending, route to verify
        const found = MOCK_ORGANIZER_ACCOUNTS.find(o => o.officialEmail.toLowerCase() === orgEmail.toLowerCase());
        const status = found?.verificationStatus || 'verified';
        completeLoginSuccess('ORGANIZATION_OWNER', found?.institutionName || 'Institution Organizer', status);
      }
    } else if (mode === 'register') {
      if (!isOtpStep) {
        if (!orgEmail || !orgInstitution || !orgCoordinator) {
          setValidationError('Please provide official institution identity and coordinator credentials.');
          return;
        }
        setIsOtpStep(true);
        setOtpTimer(60);
        addToast({
          type: 'info',
          title: 'Official Domain Verification Dispatched',
          message: `Verification code sent to ${orgEmail}. Enter 123456.`
        });
        return;
      }

      if (otpInput !== '123456' && otpInput.length !== 6) {
        setValidationError('Invalid code. Enter 123456.');
        return;
      }

      // Successful registration: institution is created in 'under_review' verification status
      sessionStorage.setItem('campusnet_session_entered', 'true');
      setAuthModalType('none');
      window.location.href = '/organization/verify';
      addToast({
        type: 'info',
        title: 'Institution Registration Submitted',
        message: 'Your profile is under institutional review. You can create draft events while approval is processed.'
      });
    }
  };

  // Password Recovery Handler
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (recoveryStep === 'request') {
      if (!recoveryEmail) {
        setValidationError('Please enter your registered institutional email.');
        return;
      }
      setRecoveryStep('verify');
      addToast({
        type: 'info',
        title: 'Password Recovery Code Dispatched',
        message: `Recovery OTP sent to ${recoveryEmail}. Enter 123456 to continue.`
      });
    } else if (recoveryStep === 'verify') {
      if (recoveryOtp !== '123456' && recoveryOtp.length !== 6) {
        setValidationError('Invalid 6-digit recovery code. Please enter 123456.');
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        setValidationError('New password must contain at least 8 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setValidationError('Passwords do not match. Please re-enter.');
        return;
      }
      setRecoveryStep('success');
      addToast({
        type: 'success',
        title: 'Password Updated Successfully',
        message: 'Your account credentials have been reset. You may now sign in.'
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismissAsGuest();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-portal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={handleDismissAsGuest}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Authentication Gateway"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-2.5 py-0.5 rounded-full">
              Role-Based Access Control • Pre-Landing Gateway
            </span>
          </div>
          
          <h2 id="auth-portal-title" className="text-xl sm:text-2xl font-black tracking-tight">
            Campus<span className="text-amber-400">Net+</span> Unified Access Portal
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Authenticate to access your verified role workspace, manage projects, or host academic events.
          </p>

          {/* 4 PRIMARY ROLE GATEWAY TABS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 p-1.5 bg-white/10 rounded-2xl backdrop-blur-sm">
            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setIsOtpStep(false); setMode('login'); setValidationError(null); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('mentor'); setIsOtpStep(false); setMode('login'); setValidationError(null); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'mentor'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('scholar'); setIsOtpStep(false); setMode('login'); setValidationError(null); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'scholar'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>PhD Scholar</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('organizer'); setIsOtpStep(false); setMode('login'); setValidationError(null); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'organizer'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Organizer</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setIsOtpStep(false); setValidationError(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                mode === 'login' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Existing Account Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setIsOtpStep(false); setValidationError(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                mode === 'register' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Register New {selectedRole === 'student' ? 'Student' : selectedRole === 'mentor' ? 'Faculty Mentor' : selectedRole === 'scholar' ? 'Doctoral Scholar' : 'Institution Host'}
            </button>
          </div>

          {/* Quick Demo Pre-fill for Evaluation */}
          {mode === 'login' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Demo:</span>
              <button
                type="button"
                onClick={() => {
                  if (selectedRole === 'student') {
                    setStdEmail('aarav.sharma@nitk.edu.in');
                    completeLoginSuccess('STUDENT', 'Aarav Sharma (NITK)');
                  } else if (selectedRole === 'mentor') {
                    setMntEmail('arvind.rao@iitb.ac.in');
                    completeLoginSuccess('MENTOR', 'Dr. Arvind Rao (IITB)');
                  } else if (selectedRole === 'scholar') {
                    setSchEmail('kavya.r@iisc.ac.in');
                    completeLoginSuccess('PHD_RESEARCHER', 'Kavya Ramanathan (IISc)');
                  } else {
                    setOrgEmail('organizer.demo@campusnet-demo.in');
                    organizerLogin('organizer.demo@campusnet-demo.in');
                    completeLoginSuccess('ORGANIZATION_OWNER', 'Dr. Anand Kumar (KEC)');
                  }
                }}
                className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                1-Click Demo Login →
              </button>
            </div>
          )}
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* MULTI-ROLE WORKSPACE CHOOSER STEP */}
        {multiRoleUser ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                Multi-Role Authorized Account
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Welcome back, {multiRoleUser.name}!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Your account is assigned multiple verified roles. Choose which authorized workspace you would like to enter:
              </p>
            </div>

            <div className="space-y-2.5">
              {multiRoleUser.roles.map((r: AppRole) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => completeLoginSuccess(r, multiRoleUser.name)}
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      {r === 'STUDENT' ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Enter {getRoleDisplayName(r)} Workspace
                      </h4>
                      <p className="text-xs text-slate-500">
                        {r === 'STUDENT' ? 'Access projects, teams, hackathons, and innovation transcript.' : 'Manage institution events, participants, and judging.'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : mode === 'forgot_password' ? (
          /* PASSWORD RECOVERY VIEW */
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Account Password Recovery</span>
              </h3>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Back to Sign In
              </button>
            </div>

            {recoveryStep === 'request' && (
              <form onSubmit={handlePasswordRecovery} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Enter your registered institutional email. We will dispatch a 6-digit verification code to confirm your identity.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={e => setRecoveryEmail(e.target.value)}
                      placeholder="you@college.edu.in"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Dispatch Recovery OTP
                </button>
              </form>
            )}

            {recoveryStep === 'verify' && (
              <form onSubmit={handlePasswordRecovery} className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                  Code dispatched to <strong>{recoveryEmail}</strong>. (For demo verification, enter: <strong>123456</strong>)
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={recoveryOtp}
                    onChange={e => setRecoveryOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Verify Code & Reset Password
                </button>
              </form>
            )}

            {recoveryStep === 'success' && (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Password Reset Complete</h4>
                <p className="text-xs text-slate-500">
                  Your security credentials have been updated. You can now authenticate.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ROLE SPECIFIC AUTHENTICATION FORM BODY */
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            
            {/* 1. STUDENT FLOW */}
            {selectedRole === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {mode === 'login' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Institutional / Student Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={stdEmail}
                          onChange={e => setStdEmail(e.target.value)}
                          placeholder="aarav.sharma@nitk.edu.in"
                          required
                          className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={stdPassword || 'CampusNet@Demo2026'}
                          onChange={e => setStdPassword(e.target.value)}
                          required
                          className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-500">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                        <span>Remember device</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => { setMode('forgot_password'); setRecoveryEmail(stdEmail); }}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Sign In to Student Innovation Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : !isOtpStep ? (
                  /* Student Registration Fields */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={stdName}
                          onChange={e => setStdName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">College Roll No / Student ID *</label>
                        <input
                          type="text"
                          value={stdRollNo}
                          onChange={e => setStdRollNo(e.target.value)}
                          placeholder="e.g. 2023CSB1042"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Institutional Email *</label>
                        <input
                          type="email"
                          value={stdEmail}
                          onChange={e => setStdEmail(e.target.value)}
                          placeholder="name@college.edu.in"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          value={stdMobile}
                          onChange={e => setStdMobile(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* State & District Selectors (28 States & 8 UTs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">State / UT (All 36) *</label>
                        <select
                          value={stdState}
                          onChange={e => {
                            setStdState(e.target.value);
                            setStdDistrict(currentDistricts(e.target.value)[0]);
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none bg-white"
                        >
                          {ALL_STATE_AND_UT_NAMES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">District / City *</label>
                        <select
                          value={stdDistrict}
                          onChange={e => setStdDistrict(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none bg-white"
                        >
                          {currentDistricts(stdState).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">College / University *</label>
                        <select
                          value={stdCollege}
                          onChange={e => setStdCollege(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none bg-white"
                        >
                          {MOCK_INSTITUTIONS_LIST.map(inst => (
                            <option key={inst} value={inst}>{inst}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Department *</label>
                        <select
                          value={stdDept}
                          onChange={e => setStdDept(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-600 outline-none bg-white"
                        >
                          {MOCK_DEPARTMENTS_LIST.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Proceed to Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* OTP Step */
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                      Dispatched 6-digit verification code to <strong>{stdEmail}</strong>. (Use code: <strong>123456</strong>)
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Enter 6-Digit Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl focus:border-indigo-600 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Expires in {otpTimer}s</span>
                      <button
                        type="button"
                        onClick={() => { setOtpTimer(60); addToast({ type: 'info', title: 'Code Resent', message: 'Enter 123456' }); }}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Complete Bonafide Student Verification
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* 2. MENTOR FLOW */}
            {selectedRole === 'mentor' && (
              <form onSubmit={handleMentorSubmit} className="space-y-4">
                {mode === 'login' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Institutional Faculty Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={mntEmail}
                          onChange={e => setMntEmail(e.target.value)}
                          placeholder="arvind.rao@iitb.ac.in"
                          required
                          className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        defaultValue="CampusNet@Demo2026"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Sign In to Faculty Mentor Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : !isOtpStep ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Faculty Full Name *</label>
                        <input
                          type="text"
                          value={mntName}
                          onChange={e => setMntName(e.target.value)}
                          placeholder="e.g. Dr. Arvind Rao"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Designation *</label>
                        <input
                          type="text"
                          value={mntDesignation}
                          onChange={e => setMntDesignation(e.target.value)}
                          placeholder="Associate Professor"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Institutional Email *</label>
                        <input
                          type="email"
                          value={mntEmail}
                          onChange={e => setMntEmail(e.target.value)}
                          placeholder="faculty@iitb.ac.in"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Vidwan Profile Link</label>
                        <input
                          type="url"
                          value={mntVidwan}
                          onChange={e => setMntVidwan(e.target.value)}
                          placeholder="https://vidwan.inflibnet.ac.in/profile/142981"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer mt-2"
                    >
                      Proceed to Verification OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      Dispatched code to <strong>{mntEmail}</strong>. (Enter: <strong>123456</strong>)
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700"
                    >
                      Verify Faculty Accreditation
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* 3. SCHOLAR FLOW */}
            {selectedRole === 'scholar' && (
              <form onSubmit={handleScholarSubmit} className="space-y-4">
                {mode === 'login' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Doctoral Candidate Email
                      </label>
                      <input
                        type="email"
                        value={schEmail}
                        onChange={e => setSchEmail(e.target.value)}
                        placeholder="kavya.r@iisc.ac.in"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        defaultValue="CampusNet@Demo2026"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Sign In to Doctoral Research Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : !isOtpStep ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Candidate Name *</label>
                        <input
                          type="text"
                          value={schName}
                          onChange={e => setSchName(e.target.value)}
                          placeholder="Kavya Ramanathan"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Doctoral Scholar ID *</label>
                        <input
                          type="text"
                          value={schScholarId}
                          onChange={e => setSchScholarId(e.target.value)}
                          placeholder="IISC-PHD-2024-09"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      Proceed to Verification OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                      Dispatched code to <strong>{schEmail}</strong>. (Enter: <strong>123456</strong>)
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Verify Doctoral Candidacy
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* 4. ORGANIZER FLOW */}
            {selectedRole === 'organizer' && (
              <form onSubmit={handleOrganizerSubmit} className="space-y-4">
                {mode === 'login' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Official Institution / Coordinator Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={orgEmail}
                          onChange={e => setOrgEmail(e.target.value)}
                          placeholder="organizer.demo@campusnet-demo.in"
                          required
                          className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        defaultValue="CampusNet@Demo2026"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                      />
                    </div>

                    {/* Quick Demo Pre-fill for 5 Colleges */}
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
                      <div className="font-bold text-emerald-900 mb-1">Quick Select Verified College:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {MOCK_ORGANIZER_ACCOUNTS.map(o => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              setOrgEmail(o.officialEmail);
                              organizerLogin(o.officialEmail);
                              completeLoginSuccess('ORGANIZATION_OWNER', o.institutionName, o.verificationStatus);
                            }}
                            className="text-[11px] font-semibold bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md transition-colors"
                          >
                            {o.institutionName.split(' ')[0]} ({o.state.slice(0, 2)})
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Access Organization Dashboard & Events</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : !isOtpStep ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">College / University Name *</label>
                        <input
                          type="text"
                          value={orgInstitution}
                          onChange={e => setOrgInstitution(e.target.value)}
                          placeholder="e.g. Kuppam Engineering College"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Coordinator Name *</label>
                        <input
                          type="text"
                          value={orgCoordinator}
                          onChange={e => setOrgCoordinator(e.target.value)}
                          placeholder="Dr. Anand Kumar"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Official Institution Email *</label>
                        <input
                          type="email"
                          value={orgEmail}
                          onChange={e => setOrgEmail(e.target.value)}
                          placeholder="coordinator@kec.ac.in"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Mobile *</label>
                        <input
                          type="tel"
                          value={orgMobile}
                          onChange={e => setOrgMobile(e.target.value)}
                          placeholder="+91 94401 23456"
                          required
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* State & District Selectors (All 28 States & 8 UTs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">State / UT (All 36) *</label>
                        <select
                          value={orgState}
                          onChange={e => {
                            setOrgState(e.target.value);
                            setOrgDistrict(currentDistricts(e.target.value)[0]);
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none bg-white"
                        >
                          {ALL_STATE_AND_UT_NAMES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">District *</label>
                        <select
                          value={orgDistrict}
                          onChange={e => setOrgDistrict(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none bg-white"
                        >
                          {currentDistricts(orgState).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer mt-2"
                    >
                      Proceed to Official Verification OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                      Dispatched official domain code to <strong>{orgEmail}</strong>. (Enter: <strong>123456</strong>)
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
                    >
                      Submit Institution Registration for Accreditation
                    </button>
                  </div>
                )}
              </form>
            )}

          </div>
        )}

        {/* BOTTOM GUEST & SEPARATED ADMIN ENTRY POINTS */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          
          {/* Guest Browsing Action */}
          <div className="flex items-center gap-1.5">
            <span>Want to discover events first?</span>
            <button
              type="button"
              onClick={handleDismissAsGuest}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Browse as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User as UserType } from '../../types';
import {
  Mail, ArrowRight, ArrowLeft, ShieldCheck,
  CheckCircle2, AlertCircle, RefreshCw, KeyRound, Globe
} from 'lucide-react';

export interface DemoPersona {
  name: string;
  roleDescription: string;
  email: string;
  mobile?: string;
  badge?: string;
}

export type PortalKey =
  | 'student'
  | 'mentor'
  | 'researcher'
  | 'organization'
  | 'event_manager'
  | 'reviewer'
  | 'super_admin';

interface PortalOtpLoginViewProps {
  portal: PortalKey;
  portalTitle: string;
  portalSubtitle: string;
  portalBadge: string;
  portalIcon: React.ComponentType<{ className?: string }>;
  accentColor: 'blue' | 'amber' | 'purple' | 'emerald' | 'cyan' | 'rose' | 'red';
  registerUrl?: string;
  registerLabel?: string;
  onFallbackPassword?: () => void;
  demoPersonas?: any[];
}

const ACCENT_STYLES: Record<string, {
  headerBg: string;
  badgeBg: string;
  btnPrimary: string;
  ringFocus: string;
}> = {
  blue: {
    headerBg: 'from-blue-600 to-indigo-900',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    ringFocus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  },
  amber: {
    headerBg: 'from-amber-600 to-amber-900',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    ringFocus: 'focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
  },
  purple: {
    headerBg: 'from-purple-600 to-indigo-950',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    btnPrimary: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20',
    ringFocus: 'focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
  },
  emerald: {
    headerBg: 'from-emerald-600 to-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    ringFocus: 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
  },
  cyan: {
    headerBg: 'from-cyan-600 to-cyan-950',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    btnPrimary: 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-cyan-700/20',
    ringFocus: 'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500'
  },
  rose: {
    headerBg: 'from-rose-600 to-rose-950',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    btnPrimary: 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-700/20',
    ringFocus: 'focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
  },
  red: {
    headerBg: 'from-red-700 to-slate-950',
    badgeBg: 'bg-red-100 text-red-800 border-red-200',
    btnPrimary: 'bg-red-700 hover:bg-red-800 text-white shadow-red-700/20',
    ringFocus: 'focus:ring-2 focus:ring-red-500 focus:border-red-500'
  }
};

export const PortalOtpLoginView: React.FC<PortalOtpLoginViewProps> = ({
  portal,
  portalTitle,
  portalSubtitle,
  portalBadge,
  portalIcon: PortalIcon,
  accentColor,
  registerUrl,
  registerLabel
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, setCurrentOrganizer, setCurrentSuperAdmin, switchRole, addToast } = useApp();

  const styles = ACCENT_STYLES[accentColor] || ACCENT_STYLES.blue;

  // Step: 'email' | 'otp'
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const requestedRedirect = searchParams.get('redirect');

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Request OTP via Email
  const handleRequestOtp = async () => {
    setErrorMsg('');
    const email = emailInput.trim().toLowerCase();

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    try {
      const response = await fetch(`${apiBase}/api/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'email',
          identifier: email,
          portal
        })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        setErrorMsg('Authentication gateway returned an unexpected response. Please check server connection.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to dispatch verification code. Please try again.');
        setIsLoading(false);
        return;
      }

      setStep('otp');
      setCooldownSeconds(data.cooldownSeconds || 60);
      setOtpDigits(['', '', '', '', '', '']);

      addToast({
        type: 'info',
        title: 'Verification Code Dispatched',
        message: `A 6-digit one-time code has been sent to ${email}.`
      });

      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMsg('Network error connecting to authentication gateway. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg('');
    const char = value.slice(-1).replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    digitInputRefs.current[nextIdx]?.focus();
  };

  // Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    const email = emailInput.trim().toLowerCase();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

    try {
      const response = await fetch(`${apiBase}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          code: fullCode,
          portal
        })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        setErrorMsg('Authentication gateway returned an unexpected response format.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMsg(data.error || 'Invalid or expired verification code. Please check and try again.');
        if (response.status === 400 || response.status === 401) {
          setOtpDigits(['', '', '', '', '', '']);
          digitInputRefs.current[0]?.focus();
        }
        setIsLoading(false);
        return;
      }

      setIsVerified(true);

      // Persist auth tokens
      sessionStorage.setItem('campusnet_token', data.token);
      localStorage.setItem('campusnet_token', data.token);
      sessionStorage.setItem('campusnet_session_entered', 'true');

      // Update real user profile session
      const user = data.user;
      const formattedName = user.name || (email ? email.split('@')[0].replace(/[._-]/g, ' ') : 'Innovator');
      const capitalizedName = formattedName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const formattedUser: UserType = {
        id: user.id || `usr-${Date.now()}`,
        name: capitalizedName,
        email: user.email || email,
        mobile: user.mobile || '',
        studentId: user.studentId || user.rollNumber || '',
        institution: user.institution || 'Verified Academic Network',
        university: user.university || user.institution || 'Verified Academic Network',
        department: user.department || 'Academic Department',
        course: user.course || '',
        year: user.year || '',
        state: user.state || '',
        city: user.city || '',
        verifiedStudent: portal === 'student',
        avatar: user.avatar || '',
        innovationScore: user.innovationScore || 0,
        skills: user.skills || [],
        badges: user.badges || [],
        bio: user.bio || '',
        interests: user.interests || [],
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        leetcode: user.leetcode || '',
        instagram: user.instagram || '',
        role: portal === 'mentor' ? 'mentor' : portal === 'researcher' ? 'researcher' : portal === 'organization' ? 'organizer' : 'student',
        activeAppRole: portal === 'mentor' ? 'MENTOR' : portal === 'researcher' ? 'PHD_RESEARCHER' : portal === 'organization' ? 'ORGANIZATION_OWNER' : 'STUDENT',
        roles: user.roles || [portal.toUpperCase()],
        connectionsCount: user.connectionsCount || 0,
        connectedUserIds: user.connectedUserIds || [],
        savedItemIds: user.savedItemIds || [],
        privacy: {
          emailPublic: true,
          phonePublic: false,
          showProjectsToPublic: true
        },
        status: 'active'
      };

      localStorage.setItem('campusnet_user', JSON.stringify(formattedUser));

      if (portal === 'student') {
        switchRole('student');
        setCurrentUser(formattedUser);
      } else if (portal === 'mentor') {
        switchRole('mentor');
        setCurrentUser(formattedUser);
      } else if (portal === 'researcher') {
        switchRole('researcher');
        setCurrentUser(formattedUser);
      } else if (portal === 'organization' || portal === 'event_manager') {
        switchRole('organizer');
        const orgSession = {
          id: formattedUser.id || 'org-001',
          institutionId: 'inst-001',
          institutionName: formattedUser.institution,
          officialEmail: formattedUser.email,
          coordinatorName: formattedUser.name,
          designation: portal === 'event_manager' ? 'Event Coordinator' : 'Institutional Lead',
          mobile: formattedUser.mobile,
          department: formattedUser.department,
          state: 'Karnataka',
          district: 'Surathkal',
          city: 'Surathkal',
          role: 'institution_admin' as const,
          verificationStatus: 'verified' as const,
          avatar: formattedUser.avatar || '',
          lastLoginAt: new Date().toISOString(),
          eventsCreatedCount: 0
        };
        setCurrentOrganizer(orgSession);
        localStorage.setItem('campusnet_organizer_session', JSON.stringify(orgSession));
        setCurrentUser(formattedUser);
      } else if (portal === 'reviewer') {
        const reviewerSession = {
          id: formattedUser.id || 'rev-aicte-001',
          username: formattedUser.email.split('@')[0],
          email: formattedUser.email,
          name: formattedUser.name,
          role: 'moderator' as const,
          avatar: formattedUser.avatar || '',
          mfaEnabled: true,
          lastLoginAt: new Date().toISOString()
        };
        setCurrentSuperAdmin(reviewerSession);
        localStorage.setItem('campusnet_admin_session', JSON.stringify(reviewerSession));
        setCurrentUser(formattedUser);
      } else if (portal === 'super_admin') {
        const adminSession = {
          id: formattedUser.id || 'adm-001',
          username: formattedUser.email.split('@')[0],
          email: formattedUser.email,
          name: formattedUser.name,
          role: 'super_admin' as const,
          avatar: formattedUser.avatar || '',
          mfaEnabled: true,
          lastLoginAt: new Date().toISOString()
        };
        setCurrentSuperAdmin(adminSession);
        localStorage.setItem('campusnet_admin_session', JSON.stringify(adminSession));
        setCurrentUser(formattedUser);
      }

      addToast({
        type: 'success',
        title: 'Authentication Successful 🎉',
        message: `Welcome, ${formattedUser.name}! Signed into ${portalTitle}.`
      });

      const destination = requestedRedirect && requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
        ? requestedRedirect
        : (data.redirectUrl || '/student/dashboard');

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 500);

    } catch {
      setErrorMsg('Verification failed due to a network interruption. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-campus-blue selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-campus-blue px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Gateway</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-lg font-black tracking-tight text-campus-deep-blue">
              CampusNet<span className="text-campus-red">+</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Visual Header Banner */}
            <div className={`p-6 bg-gradient-to-r ${styles.headerBg} text-white relative overflow-hidden`}>
              <div className="flex items-start justify-between relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <PortalIcon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/90 border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Secure Email OTP</span>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <h1 className="text-xl font-black tracking-tight text-white">{portalTitle}</h1>
                <p className="text-xs text-white/80 mt-1 font-medium leading-relaxed">
                  {portalSubtitle}
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
                </div>
              )}

              {/* Success Alert */}
              {isVerified && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 animate-bounce" />
                  <div className="font-bold">Identity verified! Redirecting to workspace...</div>
                </div>
              )}

              {/* STEP 1: EMAIL ENTRY */}
              {step === 'email' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRequestOtp();
                        }}
                        placeholder="e.g. yourname@university.edu.in"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all outline-hidden ${styles.ringFocus}`}
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      We will send a 6-digit one-time passcode to your email inbox.
                    </p>
                  </div>

                  {/* Send Code Button */}
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${styles.btnPrimary} ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Dispatching Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-blue-500 block">Verification code sent to</span>
                        <span className="font-bold text-blue-950 truncate">{emailInput.trim().toLowerCase()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('email');
                        setErrorMsg('');
                      }}
                      className="text-[11px] font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="space-y-2">
                    <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter 6-Digit Code
                    </label>
                    
                    <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { digitInputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className={`w-11 sm:w-12 h-14 text-center text-xl font-mono font-black rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden transition-all shadow-inner ${styles.ringFocus} ${
                            digit ? 'border-slate-400 bg-white shadow-xs' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isVerified}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${styles.btnPrimary} ${
                      isLoading || isVerified ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign In to {portalTitle}</span>
                      </>
                    )}
                  </button>

                  {/* Resend Cooldown */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('email');
                        setErrorMsg('');
                      }}
                      className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      ← Back
                    </button>

                    {cooldownSeconds > 0 ? (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Resend code in <strong className="text-slate-700">{cooldownSeconds}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRequestOtp()}
                        className="font-bold text-campus-blue hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Register Prompt */}
            {registerUrl && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/90 text-center text-xs text-slate-600">
                <span>New to CampusNet? </span>
                <Link to={registerUrl} className="font-bold text-campus-blue hover:underline">
                  {registerLabel || 'Create an account →'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

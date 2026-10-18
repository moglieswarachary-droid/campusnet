import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { INITIAL_CURRENT_USER } from '../../data/mockData';
import { User as UserType } from '../../types';
import {
  Mail, Phone, ArrowRight, ArrowLeft, ShieldCheck,
  CheckCircle2, AlertCircle, RefreshCw, Sparkles,
  Lock, KeyRound, Globe, Building2, User, ChevronDown,
  Info, ShieldAlert, Sparkle, ExternalLink
} from 'lucide-react';

export type PortalKey =
  | 'student'
  | 'mentor'
  | 'researcher'
  | 'organization'
  | 'event_manager'
  | 'reviewer'
  | 'super_admin';

export interface DemoPersona {
  name: string;
  roleDescription: string;
  email: string;
  mobile: string;
  badge: string;
}

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
  demoPersonas?: DemoPersona[];
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', placeholder: '98765 43210' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸', placeholder: '202 555 0123' },
  { code: '+44', country: 'UK', flag: '🇬🇧', placeholder: '7911 123456' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', placeholder: '8123 4567' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', placeholder: '50 123 4567' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', placeholder: '412 345 678' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', placeholder: '151 12345678' }
];

const ACCENT_STYLES: Record<string, {
  headerBg: string;
  badgeBg: string;
  iconBg: string;
  btnPrimary: string;
  ringFocus: string;
  borderActive: string;
}> = {
  blue: {
    headerBg: 'from-blue-600 via-blue-700 to-indigo-900',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
    ringFocus: 'focus:ring-blue-500 focus:border-blue-500',
    borderActive: 'border-blue-500 text-blue-600 bg-blue-50/60'
  },
  amber: {
    headerBg: 'from-amber-600 via-orange-600 to-amber-900',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
    ringFocus: 'focus:ring-amber-500 focus:border-amber-500',
    borderActive: 'border-amber-500 text-amber-700 bg-amber-50/60'
  },
  purple: {
    headerBg: 'from-purple-600 via-purple-700 to-indigo-950',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
    btnPrimary: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/25',
    ringFocus: 'focus:ring-purple-500 focus:border-purple-500',
    borderActive: 'border-purple-500 text-purple-700 bg-purple-50/60'
  },
  emerald: {
    headerBg: 'from-emerald-600 via-teal-700 to-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
    ringFocus: 'focus:ring-emerald-500 focus:border-emerald-500',
    borderActive: 'border-emerald-500 text-emerald-700 bg-emerald-50/60'
  },
  cyan: {
    headerBg: 'from-cyan-600 via-teal-700 to-cyan-950',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    iconBg: 'bg-cyan-600 text-white shadow-cyan-500/20',
    btnPrimary: 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-cyan-700/25',
    ringFocus: 'focus:ring-cyan-500 focus:border-cyan-500',
    borderActive: 'border-cyan-500 text-cyan-700 bg-cyan-50/60'
  },
  rose: {
    headerBg: 'from-rose-600 via-pink-700 to-rose-950',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
    btnPrimary: 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-700/25',
    ringFocus: 'focus:ring-rose-500 focus:border-rose-500',
    borderActive: 'border-rose-500 text-rose-700 bg-rose-50/60'
  },
  red: {
    headerBg: 'from-red-700 via-red-800 to-slate-950',
    badgeBg: 'bg-red-100 text-red-800 border-red-200',
    iconBg: 'bg-red-600 text-white shadow-red-500/20',
    btnPrimary: 'bg-red-700 hover:bg-red-800 text-white shadow-red-700/25',
    ringFocus: 'focus:ring-red-500 focus:border-red-500',
    borderActive: 'border-red-500 text-red-700 bg-red-50/60'
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
  registerLabel,
  onFallbackPassword,
  demoPersonas = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, setCurrentOrganizer, setCurrentSuperAdmin, switchRole, addToast } = useApp();

  const styles = ACCENT_STYLES[accentColor] || ACCENT_STYLES.blue;

  // Form step state: 'contact' | 'otp'
  const [step, setStep] = useState<'contact' | 'otp'>('contact');

  // Channel: EMAIL or SMS
  const [channel, setChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');

  // OTP inputs: 6 digits
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Submission & Cooldown
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devMockOtp, setDevMockOtp] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Read query params for redirect target
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

  // Format phone number with country code
  const getNormalizedContact = (): string => {
    if (channel === 'EMAIL') {
      return emailInput.trim().toLowerCase();
    }
    const cleanDigits = phoneInput.replace(/\D/g, '');
    return `${selectedCountryCode}${cleanDigits}`;
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (overrideContact?: string, overrideChannel?: 'EMAIL' | 'SMS') => {
    setErrorMsg('');
    const targetChannel = overrideChannel || channel;
    const contact = overrideContact || getNormalizedContact();

    if (targetChannel === 'EMAIL') {
      if (!contact || !contact.includes('@') || !contact.includes('.')) {
        setErrorMsg('Please enter a valid institutional or personal email address.');
        return;
      }
    } else {
      const cleanDigits = contact.replace(/\D/g, '');
      if (cleanDigits.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setIsLoading(true);
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    try {
      const response = await fetch(`${apiBase}/api/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: targetChannel,
          identifier: contact,
          portal
        })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        setErrorMsg('Authentication gateway returned an unexpected response format. Please verify backend connection.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to send one-time password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful request
      setStep('otp');
      setCooldownSeconds(data.cooldownSeconds || 60);
      setDevMockOtp(data.mockOtp || null);
      setOtpDigits(['', '', '', '', '', '']);

      addToast({
        type: 'info',
        title: 'One-Time Code Dispatched',
        message: data.message || `A 6-digit code was sent to ${contact}.`
      });

      // Auto-focus first digit on step switch
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMsg('Network error connecting to authentication gateway. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle individual digit input
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    const lastChar = clean.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = lastChar;
    setOtpDigits(nextDigits);

    // Auto-advance
    if (index < 5 && lastChar) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        digitInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  // Paste support: filling all 6 digits
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const nextDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(nextDigits);

    const targetFocus = Math.min(pasteData.length, 5);
    digitInputRefs.current[targetFocus]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your one-time password.');
      return;
    }

    setIsLoading(true);
    const contact = getNormalizedContact();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

    try {
      const response = await fetch(`${apiBase}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: contact,
          code: fullCode,
          portal,
          name: nameInput.trim()
        })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        setErrorMsg('Authentication gateway returned an unexpected response format. Please verify backend connection.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMsg(data.error || 'Invalid or expired one-time code. Please check and try again.');
        // Clear digits for re-entry on failure
        if (response.status === 400 || response.status === 401) {
          setOtpDigits(['', '', '', '', '', '']);
          digitInputRefs.current[0]?.focus();
        }
        setIsLoading(false);
        return;
      }

      // Verification success!
      setIsVerified(true);

      // Persist auth tokens
      sessionStorage.setItem('campusnet_token', data.token);
      localStorage.setItem('campusnet_token', data.token);
      sessionStorage.setItem('campusnet_session_entered', 'true');

      // Update appropriate AppContext portal session with real user identity
      const user = data.user;
      const userName = (user.name && user.name !== 'CampusNet Innovator' ? user.name : nameInput.trim()) || user.name || (user.email ? user.email.split('@')[0] : 'Innovator');
      
      const formattedUser: UserType = {
        ...INITIAL_CURRENT_USER,
        ...user,
        id: user.id || `usr-${Date.now()}`,
        name: userName,
        email: user.email,
        mobile: user.mobile || '+91 98765 43210',
        institution: user.institution || 'Indian Institute of Technology (CampusNet)',
        department: user.department || 'Computer Science & Engineering',
        role: portal === 'mentor' ? 'mentor' : portal === 'researcher' ? 'researcher' : portal === 'organization' ? 'organizer' : 'student',
        activeAppRole: portal === 'mentor' ? 'MENTOR' : portal === 'researcher' ? 'PHD_RESEARCHER' : portal === 'organization' ? 'ORGANIZATION_OWNER' : 'STUDENT',
        roles: user.roles || [portal.toUpperCase()],
        verifiedStudent: portal === 'student',
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
          institutionName: formattedUser.institution || 'National Engineering Institute',
          officialEmail: formattedUser.email,
          coordinatorName: formattedUser.name,
          designation: portal === 'event_manager' ? 'Event Coordinator' : 'Institutional Lead',
          mobile: formattedUser.mobile || '+91 98765 43213',
          department: formattedUser.department || 'Campus Conclaves',
          state: 'Karnataka',
          district: 'Dakshina Kannada',
          city: 'Surathkal',
          role: 'institution_admin' as const,
          verificationStatus: 'verified' as const,
          avatar: formattedUser.avatar || '',
          lastLoginAt: new Date().toISOString(),
          eventsCreatedCount: 3
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
        title: 'Authentication Verified 🎉',
        message: `Welcome, ${formattedUser.name}! Identity verified via ${channel === 'EMAIL' ? 'Email' : 'SMS'} OTP.`
      });

      // Navigate to destination
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

  // Helper to fill demo persona
  const handleSelectPersona = (persona: DemoPersona) => {
    setErrorMsg('');
    setNameInput(persona.name);
    if (channel === 'EMAIL') {
      setEmailInput(persona.email);
    } else {
      // Extract country code if present
      if (persona.mobile.startsWith('+91')) {
        setSelectedCountryCode('+91');
        setPhoneInput(persona.mobile.replace('+91', '').trim());
      } else {
        setPhoneInput(persona.mobile);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-campus-blue selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Return to Gateway */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-campus-blue px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to RBAC Gateway"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Gateway</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-campus-deep-blue">
                CampusNet<span className="text-campus-red">+</span>
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${styles.badgeBg}`}>
                {portalBadge}
              </span>
            </div>
          </div>

          {/* Guest link */}
          <div className="flex items-center gap-3">
            <Link
              to="/landing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-campus-blue px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Explore as Guest</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Visual Header Banner */}
            <div className={`p-6 bg-gradient-to-r ${styles.headerBg} text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <PortalIcon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/90 border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Passwordless OTP</span>
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
              
              {/* Error Message Alert */}
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

              {/* STEP 1: CONTACT SELECTION (EMAIL vs SMS) */}
              {step === 'contact' && (
                <div className="space-y-5">
                  
                  {/* Channel Toggle */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Authentication Channel
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => {
                          setChannel('EMAIL');
                          setErrorMsg('');
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          channel === 'EMAIL'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Email Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setChannel('SMS');
                          setErrorMsg('');
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          channel === 'SMS'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mobile (SMS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Channel Input Fields */}
                  {channel === 'EMAIL' ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Registered Email Address
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
                          placeholder="e.g. name@university.edu.in"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all outline-hidden ${styles.ringFocus}`}
                          autoFocus
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Enter the email associated with your institutional profile.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Registered Mobile Number
                      </label>
                      <div className="flex gap-2">
                        {/* Country code selector */}
                        <div className="relative w-36 shrink-0">
                          <select
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                            className="w-full appearance-none pl-3 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
                          >
                            {COUNTRY_CODES.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.flag} {item.code} ({item.country})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Phone number input */}
                        <div className="relative flex-1">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRequestOtp();
                            }}
                            placeholder={
                              COUNTRY_CODES.find(c => c.code === selectedCountryCode)?.placeholder || '98765 43210'
                            }
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all outline-hidden ${styles.ringFocus}`}
                            autoFocus
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        We will deliver a 6-digit one-time SMS verification token.
                      </p>
                    </div>
                  )}

                  {/* Full Name Input for Personalized Account Identity */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Your Full Name <span className="text-slate-400 font-normal">(Optional for first-time login)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Moglieswar Achary"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all outline-hidden ${styles.ringFocus}`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Appears on your portal badge, dashboard greeting, and verified project records.
                    </p>
                  </div>

                  {/* Send OTP Button */}
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
                        <span>Sending One-Time Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit One-Time Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Demo Personas Quick Fill */}
                  {demoPersonas.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Demo Personas (1-Click Fill)
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">Testing & Evaluation</span>
                      </div>
                      <div className="space-y-1.5">
                        {demoPersonas.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPersona(p)}
                            className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-between gap-2 text-xs group cursor-pointer"
                          >
                            <div className="truncate">
                              <span className="font-bold text-slate-800">{p.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {channel === 'EMAIL' ? p.email : p.mobile} • {p.roleDescription}
                              </span>
                            </div>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0 group-hover:border-slate-300">
                              Use Contact
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Password Fallback (if supported) */}
                  {onFallbackPassword && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={onFallbackPassword}
                        className="text-xs font-semibold text-slate-500 hover:text-campus-blue transition-colors cursor-pointer"
                      >
                        Prefer password authentication? Sign in with password →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  
                  {/* Delivery notification info */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 truncate">
                      {channel === 'EMAIL' ? (
                        <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent to</span>
                        <span className="font-bold text-slate-800 truncate">{getNormalizedContact()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('contact');
                        setErrorMsg('');
                        setDevMockOtp(null);
                      }}
                      className="text-[11px] font-bold text-campus-blue hover:underline shrink-0 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Developer Mock OTP Helper Badge (shows in development / test mode) */}
                  {devMockOtp && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-center gap-1.5">
                        <Sparkle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-semibold">Dev Test Code:</span>
                        <span className="font-mono font-black text-amber-700 tracking-wider bg-white px-2 py-0.5 rounded border border-amber-300">
                          {devMockOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = devMockOtp.split('').slice(0, 6);
                          setOtpDigits(digits);
                          digitInputRefs.current[5]?.focus();
                        }}
                        className="text-[10px] font-bold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  {/* 6 Digit Input Boxes */}
                  <div className="space-y-2">
                    <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter 6-Digit One-Time Password
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
                        <span>Verifying Security Token...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Enter {portalTitle}</span>
                      </>
                    )}
                  </button>

                  {/* Resend OTP Cooldown */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('contact');
                        setErrorMsg('');
                      }}
                      className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      ← Back to contact
                    </button>

                    {cooldownSeconds > 0 ? (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Resend in <strong className="text-slate-700">{cooldownSeconds}s</strong>
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

              {/* Security Architecture Footnote */}
              <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Server-Enforced RBAC:</strong> The OTP authenticates identity. Portal access is governed strictly by server-verified credentials and permissions.
                </span>
              </div>
            </div>

            {/* Bottom Register Prompt (if applicable) */}
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

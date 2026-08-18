import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, GraduationCap, Award, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Mail, Lock, Phone, Building2, 
  MapPin, BookOpen, Briefcase, FileText, UserCheck, Eye, EyeOff 
} from 'lucide-react';
import { RoleType } from '../../types';
import { MOCK_DEPARTMENTS_LIST, MOCK_INSTITUTIONS_LIST, MOCK_INDIAN_STATES } from '../../data/mockData';

export const AuthPortalModal: React.FC = () => {
  const { authModalType, setAuthModalType, switchRole, addToast, setCurrentUser } = useApp();
  
  // Primary Tabs: 'student' | 'mentor' | 'scholar'
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | 'scholar'>(() => {
    if (authModalType === 'mentor_onboarding') return 'mentor';
    if (authModalType === 'scholar_register') return 'scholar';
    return 'student';
  });

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');

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
  const [stdCity, setStdCity] = useState('Bengaluru');
  const [stdSkills, setStdSkills] = useState('');
  const [stdInterests, setStdInterests] = useState('');
  const [stdGithub, setStdGithub] = useState('');
  const [stdLinkedin, setStdLinkedin] = useState('');
  const [stdRollNo, setStdRollNo] = useState('');

  // Mentor Form State
  const [mntName, setMntName] = useState('');
  const [mntEmail, setMntEmail] = useState('');
  const [mntMobile, setMntMobile] = useState('');
  const [mntPassword, setMntPassword] = useState('');
  const [mntDesignation, setMntDesignation] = useState('Associate Professor / Research Lead');
  const [mntOrg, setMntOrg] = useState(MOCK_INSTITUTIONS_LIST[1]);
  const [mntExp, setMntExp] = useState('10+ Years');
  const [mntExpertise, setMntExpertise] = useState('Edge AI, Computer Vision & Robotics');
  const [mntDomains, setMntDomains] = useState('Agriculture & IoT, Defense & Aerospace');
  const [mntSlots, setMntSlots] = useState('3 Active Teams');
  const [mntLinkedin, setMntLinkedin] = useState('');

  // Scholar Form State
  const [schName, setSchName] = useState('');
  const [schEmail, setSchEmail] = useState('');
  const [schInstitution, setSchInstitution] = useState('Indian Institute of Science (IISc Bangalore)');
  const [schDept, setSchDept] = useState('Computational and Data Sciences');
  const [schArea, setSchArea] = useState('Privacy-Preserving Federated Learning');
  const [schSupervisor, setSchSupervisor] = useState('Prof. Chiranjib Bhattacharyya');
  const [schScholarId, setSchScholarId] = useState('IISC-PHD-2024-09');
  const [schPublications, setSchPublications] = useState('');

  if (authModalType === 'none') return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpStep && mode === 'register') {
      setIsOtpStep(true);
      addToast({
        type: 'info',
        title: 'OTP Sent for Verification',
        message: `A 6-digit verification code has been dispatched to ${stdEmail || 'your institutional email'}. (Enter 123456 to verify)`
      });
      return;
    }

    if (mode === 'login') {
      switchRole('student');
      setAuthModalType('none');
      addToast({
        type: 'success',
        title: 'Welcome to CampusNet!',
        message: 'Logged into your student innovation workspace.'
      });
    } else {
      // Register
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
        github: stdGithub || prev.github,
        linkedin: stdLinkedin || prev.linkedin,
        state: stdState,
        city: stdCity,
        verifiedStudent: true,
        role: 'student'
      }));
      switchRole('student');
      setAuthModalType('none');
      addToast({
        type: 'success',
        title: 'Student Account Registered & Verified!',
        message: 'Your bonafide profile has been registered across CampusNet India.'
      });
    }
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('mentor');
    setAuthModalType('none');
    addToast({
      type: 'success',
      title: 'Mentor Portal Activated',
      message: 'Logged in as Dr. Arvind Rao / Faculty Mentor.'
    });
  };

  const handleScholarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('researcher');
    setAuthModalType('none');
    addToast({
      type: 'success',
      title: 'PhD Scholar Portal Activated',
      message: 'Logged in as Kavya Ramanathan / IISc Bangalore Research Lab.'
    });
  };

  const quickDemoLogin = (role: RoleType) => {
    switchRole(role);
    setAuthModalType('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-warm-xl border border-campus-border overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-campus-deep-blue via-campus-blue to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setAuthModalType('none')}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              National Innovation & Research Gateway
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Campus<span className="text-amber-400">Net</span> Authentication Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg">
            Choose your official entry portal to access student hackathons, faculty mentorship, or research collaboration.
          </p>

          {/* Role Gateway Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-1 bg-white/10 rounded-2xl backdrop-blur-sm">
            <button
              onClick={() => { setSelectedRole('student'); setIsOtpStep(false); }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-campus-deep-blue shadow-warm-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => { setSelectedRole('mentor'); setIsOtpStep(false); }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'mentor'
                  ? 'bg-white text-campus-deep-blue shadow-warm-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Mentor Portal</span>
            </button>

            <button
              onClick={() => { setSelectedRole('scholar'); setIsOtpStep(false); }}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'scholar'
                  ? 'bg-white text-campus-deep-blue shadow-warm-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>PhD Scholar</span>
            </button>
          </div>
        </div>

        {/* Login / Register Toggle & Quick Demo Access */}
        <div className="px-6 pt-4 pb-2 border-b border-campus-border flex items-center justify-between flex-wrap gap-2 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('login'); setIsOtpStep(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'login' 
                  ? 'bg-campus-deep-blue text-white' 
                  : 'text-campus-muted-text hover:text-campus-slate-text'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('register'); setIsOtpStep(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'register' 
                  ? 'bg-campus-deep-blue text-white' 
                  : 'text-campus-muted-text hover:text-campus-slate-text'
              }`}
            >
              Register New {selectedRole === 'student' ? 'Student' : selectedRole === 'mentor' ? 'Mentor' : 'Scholar'}
            </button>
          </div>

          {/* Quick Demo 1-Click Action */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-campus-muted-text hidden sm:inline">Demo:</span>
            <button
              onClick={() => quickDemoLogin(selectedRole === 'student' ? 'student' : selectedRole === 'mentor' ? 'mentor' : 'researcher')}
              className="text-[11px] font-bold text-campus-blue bg-campus-soft-blue px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
            >
              1-Click Demo Login →
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* STUDENT FLOW */}
          {selectedRole === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {mode === 'login' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                      Institutional / Student Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        defaultValue="aarav.sharma@nitk.edu.in"
                        required
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                        placeholder="yourname@college.edu.in"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        defaultValue="••••••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-campus-muted-text"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-campus-muted-text">
                      <input type="checkbox" defaultChecked className="rounded text-campus-blue" />
                      Remember this device
                    </label>
                    <button type="button" onClick={() => addToast({ type: 'info', title: 'Reset Link Sent', message: 'Check your registered email inbox.' })} className="text-campus-blue font-bold hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : !isOtpStep ? (
                /* Student Registration Fields */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={stdName}
                        onChange={e => setStdName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">College Roll / Student ID *</label>
                      <input
                        type="text"
                        value={stdRollNo}
                        onChange={e => setStdRollNo(e.target.value)}
                        placeholder="e.g. 2023CSB1042"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        value={stdEmail}
                        onChange={e => setStdEmail(e.target.value)}
                        placeholder="name@college.edu.in"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        value={stdMobile}
                        onChange={e => setStdMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">College / University *</label>
                    <select
                      value={stdCollege}
                      onChange={e => setStdCollege(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                    >
                      {MOCK_INSTITUTIONS_LIST.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Department</label>
                      <select
                        value={stdDept}
                        onChange={e => setStdDept(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                      >
                        {MOCK_DEPARTMENTS_LIST.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Degree</label>
                      <select
                        value={stdDegree}
                        onChange={e => setStdDegree(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                      >
                        <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                        <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                        <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
                        <option value="B.Des / M.Des">B.Des / M.Des</option>
                        <option value="BCA / MCA">BCA / MCA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Year</label>
                      <select
                        value={stdYear}
                        onChange={e => setStdYear(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">State</label>
                      <select
                        value={stdState}
                        onChange={e => setStdState(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                      >
                        {MOCK_INDIAN_STATES.filter(s => s !== 'All India').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">City</label>
                      <input
                        type="text"
                        value={stdCity}
                        onChange={e => setStdCity(e.target.value)}
                        placeholder="e.g. Bengaluru / Surathkal"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Core Skills (comma separated)</label>
                    <input
                      type="text"
                      value={stdSkills}
                      onChange={e => setStdSkills(e.target.value)}
                      placeholder="e.g. PyTorch, React, Embedded C, ROS2"
                      className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">GitHub / Portfolio URL</label>
                      <input
                        type="url"
                        value={stdGithub}
                        onChange={e => setStdGithub(e.target.value)}
                        placeholder="https://github.com/yourhandle"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={stdLinkedin}
                        onChange={e => setStdLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/yourhandle"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* OTP Verification Step */
                <div className="p-6 text-center space-y-4 bg-campus-soft-blue/40 rounded-2xl border border-blue-200">
                  <div className="w-12 h-12 rounded-full bg-campus-blue text-white flex items-center justify-center mx-auto shadow-warm-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-campus-deep-blue text-base">Enter 6-Digit Verification OTP</h4>
                    <p className="text-xs text-campus-muted-text mt-1">
                      We sent an authorization code to <strong>{stdEmail || 'your institutional email'}</strong>.
                    </p>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-48 mx-auto text-center font-mono text-xl tracking-widest py-2.5 border-2 border-campus-blue rounded-xl outline-none font-bold bg-white"
                  />

                  <p className="text-[11px] text-campus-muted-text">
                    Didn't receive? <button type="button" onClick={() => addToast({ type: 'info', title: 'Code Resent', message: 'New OTP dispatched.' })} className="text-campus-blue font-bold underline">Resend Code</button>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full campus-btn-primary py-3 rounded-xl text-sm font-bold shadow-warm-md flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Access Student Innovation Dashboard' : isOtpStep ? 'Verify OTP & Complete Registration' : 'Continue to Email / OTP Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MENTOR FLOW */}
          {selectedRole === 'mentor' && (
            <form onSubmit={handleMentorSubmit} className="space-y-4">
              {mode === 'login' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                      Mentor / Faculty Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        defaultValue="arvind.rao@iitb.ac.in"
                        required
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        defaultValue="••••••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Full Name with Title *</label>
                      <input
                        type="text"
                        value={mntName}
                        onChange={e => setMntName(e.target.value)}
                        placeholder="e.g. Dr. Arvind Rao"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Designation *</label>
                      <input
                        type="text"
                        value={mntDesignation}
                        onChange={e => setMntDesignation(e.target.value)}
                        placeholder="e.g. Professor & Chair, AI Lab"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Organization / Institution *</label>
                      <input
                        type="text"
                        value={mntOrg}
                        onChange={e => setMntOrg(e.target.value)}
                        placeholder="e.g. IIT Bombay / NVIDIA Research"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Experience Level *</label>
                      <input
                        type="text"
                        value={mntExp}
                        onChange={e => setMntExp(e.target.value)}
                        placeholder="e.g. 12 Years"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Core Expertise Domains *</label>
                    <input
                      type="text"
                      value={mntExpertise}
                      onChange={e => setMntExpertise(e.target.value)}
                      placeholder="e.g. Computer Vision, TinyML, Power Electronics"
                      required
                      className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Available Mentoring Slots</label>
                      <select
                        value={mntSlots}
                        onChange={e => setMntSlots(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                      >
                        <option value="1 Active Team">1 Active Team</option>
                        <option value="2 Active Teams">2 Active Teams</option>
                        <option value="3 Active Teams">3 Active Teams</option>
                        <option value="4+ Active Teams">4+ Active Teams</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">LinkedIn / Faculty Webpage</label>
                      <input
                        type="url"
                        value={mntLinkedin}
                        onChange={e => setMntLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/mentor"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full campus-btn-red py-3 rounded-xl text-sm font-bold shadow-warm-md flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Access Dedicated Mentor Portal' : 'Register Faculty / Industry Mentor'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* PHD SCHOLAR FLOW */}
          {selectedRole === 'scholar' && (
            <form onSubmit={handleScholarSubmit} className="space-y-4">
              {mode === 'login' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                      PhD Scholar Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        defaultValue="kavya.r@iisc.ac.in"
                        required
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        defaultValue="••••••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">PhD Scholar Name *</label>
                      <input
                        type="text"
                        value={schName}
                        onChange={e => setSchName(e.target.value)}
                        placeholder="e.g. Kavya Ramanathan"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Research Scholar Roll ID *</label>
                      <input
                        type="text"
                        value={schScholarId}
                        onChange={e => setSchScholarId(e.target.value)}
                        placeholder="e.g. IISC-CS-PHD-2022-041"
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Research Institution *</label>
                      <input
                        type="text"
                        value={schInstitution}
                        onChange={e => setSchInstitution(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Department *</label>
                      <input
                        type="text"
                        value={schDept}
                        onChange={e => setSchDept(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Primary Research Area & Topic *</label>
                    <input
                      type="text"
                      value={schArea}
                      onChange={e => setSchArea(e.target.value)}
                      placeholder="e.g. Privacy-Preserving Federated Learning & Edge Quantization"
                      required
                      className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">PhD Supervisor / Principal Guide</label>
                      <input
                        type="text"
                        value={schSupervisor}
                        onChange={e => setSchSupervisor(e.target.value)}
                        placeholder="e.g. Prof. Chiranjib Bhattacharyya"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Publications / DOI Links</label>
                      <input
                        type="text"
                        value={schPublications}
                        onChange={e => setSchPublications(e.target.value)}
                        placeholder="e.g. IEEE / ACM papers, arXiv links"
                        className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-warm-md flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Access PhD Scholar Research Dashboard' : 'Register as Research Scholar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

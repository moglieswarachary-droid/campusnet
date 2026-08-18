import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, 
  UploadCloud, Lock, Sparkles, Building2, BookOpen, Key, Check
} from 'lucide-react';
import { MOCK_INSTITUTIONS_LIST, MOCK_DEPARTMENTS_LIST } from '../../data/mockData';

export const StudentRegistrationModal: React.FC = () => {
  const { authModalType, setAuthModalType, setCurrentUser, addToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState('Devika Menon');
  const [studentId, setStudentId] = useState('2024ECE319');
  const [institution, setInstitution] = useState('College of Engineering, Guindy (Anna University)');
  const [university, setUniversity] = useState('Anna University Chennai');
  const [department, setDepartment] = useState('Electronics & Communication Engineering (ECE)');
  const [course, setCourse] = useState('B.E. Electronics & Communication');
  const [year, setYear] = useState('2nd Year (Class of 2028)');
  
  const [email, setEmail] = useState('devika.menon@ceg.annauniv.edu');
  const [mobile, setMobile] = useState('+91 94451 88720');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [idCardFile, setIdCardFile] = useState<string | null>(null);
  const [isIdAnalyzing, setIsIdAnalyzing] = useState(false);
  const [idOcrPassed, setIdOcrPassed] = useState(false);

  const [password, setPassword] = useState('••••••••••••');
  const [usePasskey, setUsePasskey] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Embedded Systems', 'PCB Layout', 'ESP32', 'Robotics Hardware', 'MATLAB'
  ]);

  if (authModalType !== 'student_register') return null;

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('742918'); // auto-fill demo OTP for slick pairing
    addToast({
      type: 'info',
      title: 'OTP Dispatched',
      message: 'Demo verification OTP (742918) sent to ' + email
    });
  };

  const handleVerifyOtp = () => {
    if (otp === '742918' || otp.length === 6) {
      setIsOtpVerified(true);
      addToast({
        type: 'success',
        title: 'Contact Verified',
        message: 'Email & Mobile phone verified successfully.'
      });
    }
  };

  const handleSimulateIdUpload = () => {
    setIsIdAnalyzing(true);
    setTimeout(() => {
      setIdCardFile('https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=400&auto=format&fit=crop&q=80');
      setIsIdAnalyzing(false);
      setIdOcrPassed(true);
      addToast({
        type: 'success',
        title: 'ID Card Validated',
        message: 'Institutional match confirmed: Anna University Enrollment #2024ECE319.'
      });
    }, 1200);
  };

  const handleCompleteRegistration = () => {
    const newUser = {
      id: 'usr-std-' + Date.now(),
      name: fullName,
      email,
      mobile,
      studentId,
      institution,
      university,
      department,
      course,
      year,
      verifiedStudent: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      innovationScore: 750,
      skills: selectedSkills,
      badges: ['Verified Student', 'Innovator', 'Hardware Contributor'],
      bio: `Student at ${institution}, ${department}. Eager to collaborate on multi-disciplinary hackathons and research projects.`,
      interests: ['IoT', 'Robotics', 'Hardware-Software Co-Design'],
      idCardVerifiedAt: new Date().toISOString(),
      role: 'student' as const
    };

    setCurrentUser(newUser);
    setAuthModalType('none');
    addToast({
      type: 'success',
      title: 'Welcome to CampusNet! 🎉',
      message: `${fullName} is now registered with Verified Student credential.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-warm-xl border border-campus-border relative my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalType('none')}
          className="absolute top-6 right-6 p-2 rounded-xl text-campus-muted-text hover:text-campus-slate-text hover:bg-campus-warm-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="campus-badge-verified">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Verification Protocol
            </span>
            <span className="text-xs font-semibold text-campus-muted-text">Step {step} of 4</span>
          </div>
          <h2 className="text-2xl font-bold text-campus-deep-blue">
            Student Identity Onboarding
          </h2>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            CampusLink requires authenticated university credentials to ensure bonafide student status across inter-departmental teams.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                s <= step ? 'bg-campus-blue' : 'bg-campus-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Academic & Institutional Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Full Name (as per Student ID)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Enrollment / Student ID No.
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="e.g. 2024ECE319"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                College / Institution Name
              </label>
              <select
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none bg-white"
              >
                {MOCK_INSTITUTIONS_LIST.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Affiliated University
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={e => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="e.g. Anna University"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none bg-white"
                >
                  <option value="1st Year (Class of 2029)">1st Year (Class of 2029)</option>
                  <option value="2nd Year (Class of 2028)">2nd Year (Class of 2028)</option>
                  <option value="3rd Year (Class of 2027)">3rd Year (Class of 2027)</option>
                  <option value="4th Year (Class of 2026)">4th Year (Class of 2026)</option>
                  <option value="Postgraduate (M.Tech / MS)">Postgraduate (M.Tech / MS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Department / Discipline
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none bg-white"
              >
                {MOCK_DEPARTMENTS_LIST.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Contact & OTP Verification */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-campus-soft-blue/60 border border-blue-200">
              <div className="flex items-center gap-2 text-campus-deep-blue font-bold text-sm">
                <Lock className="w-4 h-4 text-campus-blue" />
                Two-Factor Institutional Contact Verification
              </div>
              <p className="text-xs text-campus-muted-text mt-1">
                Enter your official college or personal email. We verify contact information before issuing the verified student badge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="student@institution.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Mobile Number (for SMS & OTP)
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="campus-btn-primary w-full text-sm"
              >
                Send Verification OTP
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-campus-slate-text">
                    Enter 6-Digit Verification Code
                  </label>
                  <span className="text-xs text-campus-blue font-semibold">Code: 742918</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-48 text-center tracking-widest text-lg font-bold px-3.5 py-2 rounded-xl border border-campus-border focus:border-campus-blue outline-none"
                    placeholder="742918"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isOtpVerified}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isOtpVerified 
                        ? 'bg-green-600 text-white' 
                        : 'bg-campus-deep-blue text-white hover:bg-campus-blue'
                    }`}
                  >
                    {isOtpVerified ? 'Verified ✓' : 'Verify Code'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Private Student ID Card Upload */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-campus-amber" />
                Private Identity Verification Notice
              </div>
              <p className="text-xs text-amber-800/90 mt-1">
                Your Student ID card is stored in an encrypted vault and is <strong>never publicly visible</strong> to any student or external recruiter. It is used strictly to verify your academic bonafide status.
              </p>
            </div>

            {!idCardFile ? (
              <div 
                onClick={handleSimulateIdUpload}
                className="border-2 border-dashed border-campus-border hover:border-campus-blue rounded-3xl p-8 text-center cursor-pointer bg-campus-warm-white/60 hover:bg-campus-soft-blue/30 transition-colors"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-campus-border flex items-center justify-center text-campus-blue shadow-warm-sm mb-3">
                  {isIdAnalyzing ? (
                    <Sparkles className="w-7 h-7 animate-spin text-campus-red" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-campus-deep-blue">
                  {isIdAnalyzing ? 'Analyzing ID Card & Verifying OCR...' : 'Click to Upload Student ID Card (Front)'}
                </h4>
                <p className="text-xs text-campus-muted-text mt-1">
                  Supports JPG, PNG, PDF up to 10 MB. High-resolution photos speed up instant auto-approval.
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white border border-campus-border shadow-warm-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={idCardFile}
                    alt="ID Card Preview"
                    className="w-16 h-12 object-cover rounded-lg border border-campus-border"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-campus-slate-text">Student_ID_2024.jpg</span>
                      <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        OCR Validated
                      </span>
                    </div>
                    <p className="text-xs text-campus-muted-text mt-0.5">
                      Matched: {institution} • ID #{studentId}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-campus-green" />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Password, Passkey & Skills */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                  Account Password / Passkey
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
                  placeholder="Strong password"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-campus-slate-text">
                  <input
                    type="checkbox"
                    checked={usePasskey}
                    onChange={e => setUsePasskey(e.target.checked)}
                    className="w-4 h-4 text-campus-blue rounded border-campus-border"
                  />
                  Enable Fast Biometric Passkey Login
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Your Technical & Innovation Skills
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-soft-blue text-campus-blue text-xs font-semibold border border-blue-200"
                  >
                    {skill}
                    <button 
                      onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                      className="hover:text-campus-red"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="mt-8 pt-4 border-t border-campus-border flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="campus-btn-secondary text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && !isOtpVerified) {
                  addToast({
                    type: 'warning',
                    title: 'Verification Needed',
                    message: 'Please send and verify the OTP to proceed.'
                  });
                  return;
                }
                setStep((step + 1) as any);
              }}
              className="campus-btn-primary text-xs sm:text-sm"
            >
              Continue to Step {step + 1}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              className="campus-btn-red text-xs sm:text-sm shadow-warm-md"
            >
              <Check className="w-4 h-4" />
              Complete & Activate Student Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

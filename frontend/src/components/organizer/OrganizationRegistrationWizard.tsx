import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Building2, User, Mail, Phone, Lock, MapPin, 
  ShieldCheck, Check, ArrowRight, ArrowLeft, 
  AlertCircle, Sparkles, Globe, FileText, CheckCircle2 
} from 'lucide-react';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { DocumentUploadField } from './DocumentUploadField';
import { EventHostingDocument, NewOrganizationPayload } from '../../types';

interface Props {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const OrganizationRegistrationWizard: React.FC<Props> = ({ onSuccess, onNavigateToLogin }) => {
  const { registerOrganizer, addToast } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Coordinator / Administrator Details
  const [coordinatorName, setCoordinatorName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: Institution Details
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCategory, setInstitutionCategory] = useState('Engineering College');
  const [institutionType, setInstitutionType] = useState('Autonomous');
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Chittoor');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [affiliationUniversity, setAffiliationUniversity] = useState('');
  const [accreditationDetails, setAccreditationDetails] = useState('');

  // Step 3: Verification Evidence (Optional/Flexible)
  const [authorizationDoc, setAuthorizationDoc] = useState<EventHostingDocument | null>(null);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic districts when state changes
  const availableDistricts = getDistrictsByStateName(state);

  useEffect(() => {
    const districts = getDistrictsByStateName(state);
    if (districts.length > 0 && !districts.includes(district)) {
      setDistrict(districts[0]);
    }
  }, [state]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!coordinatorName.trim()) newErrors.coordinatorName = 'Coordinator full name is required.';
    if (!officialEmail.trim()) {
      newErrors.officialEmail = 'Official institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(officialEmail)) {
      newErrors.officialEmail = 'Please provide a valid institutional email address.';
    }
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[0-9+ -]{10,14}$/.test(mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number (+91).';
    }
    if (!designation.trim()) newErrors.designation = 'Designation/role is required.';
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms of service and organizer responsibilities.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!institutionName.trim()) newErrors.institutionName = 'Official institution name is required.';
    if (!city.trim()) newErrors.city = 'City/town is required.';
    if (!state) newErrors.state = 'State / UT selection is required.';
    if (!district) newErrors.district = 'District selection is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: NewOrganizationPayload = {
      coordinatorName,
      officialEmail,
      mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
      designation,
      department: department || 'Student Innovation Cell',
      password,
      institutionName,
      institutionCategory,
      institutionType,
      state,
      district,
      city,
      address,
      website,
      affiliationUniversity,
      accreditationDetails,
      documents: authorizationDoc ? [authorizationDoc] : []
    };

    const ok = registerOrganizer(payload);
    if (ok) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/organization/verify');
      }
    }
  };

  const categories = [
    'Engineering College',
    'Arts and Science College',
    'University',
    'Polytechnic College',
    'Medical / Health Science College',
    'Management Institute',
    'Research Institution',
    'Other Recognized Academic Organization'
  ];

  const types = [
    'Government',
    'Private',
    'Deemed University',
    'Autonomous College',
    'Central University',
    'State University',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-white">
      
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Return to RBAC Gateway"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to RBAC Gateway</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">
                  Campus<span className="text-amber-400">Net+</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Institution Registration
                </span>
              </div>
              <p className="text-[11px] text-slate-400">All-India Academic Event Hosting Gateway</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onNavigateToLogin) onNavigateToLogin();
            else navigate('/organization/login');
          }}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          Already registered? Sign In →
        </button>
      </header>

      {/* Main Multi-Step Form */}
      <main className="max-w-3xl w-full mx-auto my-8 space-y-6">
        
        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {[
            { step: 1, label: '1. Coordinator Details', desc: 'Contact & Account' },
            { step: 2, label: '2. Institution Profile', desc: 'Location & Affiliation' },
            { step: 3, label: '3. Verification & Submit', desc: 'Evidence & Review' },
          ].map(s => (
            <div
              key={s.step}
              onClick={() => {
                if (s.step < currentStep) setCurrentStep(s.step);
              }}
              className={`p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                currentStep === s.step
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : currentStep > s.step
                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{s.label}</span>
                {currentStep > s.step && <Check className="w-3.5 h-3.5 text-green-400" />}
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Card Body */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          
          {/* STEP 1: Organization Administrator Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>Step 1: Event Coordinator & Administrator Information</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter details of the authorized faculty member, dean, or institutional representative responsible for event hosting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Responsible Person Full Name *
                  </label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={e => setCoordinatorName(e.target.value)}
                    placeholder="e.g. Dr. K. Suresh Babu"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.coordinatorName && <p className="text-xs text-rose-400 mt-1">{errors.coordinatorName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    value={officialEmail}
                    onChange={e => setOfficialEmail(e.target.value)}
                    placeholder="e.g. coordinator@kec.ac.in"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.officialEmail && <p className="text-xs text-rose-400 mt-1">{errors.officialEmail}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mobile Number (+91 India) *
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="e.g. 9440123456"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.mobile && <p className="text-xs text-rose-400 mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Professor & Head / Dean of Innovation"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.designation && <p className="text-xs text-rose-400 mt-1">{errors.designation}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Department / Cell (Optional)
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Department of Computer Science / IIC Incubation Cell"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>
                    I confirm I am an authorized representative of this institution and agree to the CampusNet Organizer Responsibilities, Privacy Policy, and Event Safety Standards.
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-rose-400 mt-1">{errors.terms}</p>}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Institution Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Institution Details (All-India coverage) */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Step 2: Institution Profile & Geographical Location</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Colleges from all 28 States and 8 Union Territories in India are eligible to host academic events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official College / Institution Name *
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)}
                    placeholder="e.g. Kuppam Engineering College"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.institutionName && <p className="text-xs text-rose-400 mt-1">{errors.institutionName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Institution Category *
                  </label>
                  <select
                    value={institutionCategory}
                    onChange={e => setInstitutionCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Institution Type *
                  </label>
                  <select
                    value={institutionType}
                    onChange={e => setInstitutionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* State / UT Searchable Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    State or Union Territory (36 Entities) *
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none font-medium"
                  >
                    {ALL_STATE_AND_UT_NAMES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-rose-400 mt-1">{errors.state}</p>}
                </div>

                {/* District Dependent Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    District (Auto-populated for {state}) *
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none font-medium"
                  >
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-xs text-rose-400 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Kuppam"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="e.g. https://kec.ac.in"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Campus Postal Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. KES Nagar, PB No. 01, Kuppam, Chittoor District, AP - 517425"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    University Affiliation (Optional)
                  </label>
                  <input
                    type="text"
                    value={affiliationUniversity}
                    onChange={e => setAffiliationUniversity(e.target.value)}
                    placeholder="e.g. JNTU Anantapur / Anna University"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Accreditation / AISHE Details (Optional)
                  </label>
                  <input
                    type="text"
                    value={accreditationDetails}
                    onChange={e => setAccreditationDetails(e.target.value)}
                    placeholder="e.g. NAAC 'A' Grade / AISHE C-26922"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Evidence */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Step 3: Verification Evidence & Final Submission</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload optional institutional evidence (authorization letter, affiliation proof) to fast-track verification.
                </p>
              </div>

              {/* Eligibility Notice */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Fair Access Guarantee</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Do not worry if you do not have an official accreditation certificate yet. Every legitimate academic institution across all 28 States and 8 Union Territories is eligible to apply and host student competitions on CampusNet.
                </p>
              </div>

              {/* Upload Component */}
              <DocumentUploadField
                label="Authorization Letter or Institutional ID Proof (PDF/Image, max 10MB)"
                type="formal_request_letter"
                required={false}
                helpText="Letter from Principal / Dean on institutional letterhead (optional during initial registration)"
                document={authorizationDoc}
                onDocumentChange={setAuthorizationDoc}
              />

              {/* Summary Review */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Registration Review Summary</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
                  <div><strong>Coordinator:</strong> {coordinatorName}</div>
                  <div><strong>Official Email:</strong> {officialEmail}</div>
                  <div><strong>Mobile:</strong> {mobile}</div>
                  <div><strong>Institution:</strong> {institutionName}</div>
                  <div><strong>Location:</strong> {city}, {state}</div>
                  <div><strong>District:</strong> {district}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Registration & Open Workspace</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-2">
        <p>© 2026 CampusNet National Academic & Innovation Network • Safe and Verifiable Educational Network</p>
      </footer>

    </div>
  );
};

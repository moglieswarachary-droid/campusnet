import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, MapPin, Award, Users, 
  ShieldCheck, Plus, Trash2, ArrowRight, ArrowLeft, 
  Check, Sparkles, AlertCircle, FileText, CheckCircle2,
  Mail, Phone, User, Lock
} from 'lucide-react';
import { EventItem, EventPrize, EventScheduleItem, EventHostingDocument } from '../../types';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { DocumentUploadField } from './DocumentUploadField';
import { sanitizeInput } from '../../utils/validation';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const EventCreationWizard: React.FC<Props> = ({ setActiveSection }) => {
  const { currentOrganizer, createOrganizerEvent, submitEventForApproval, addToast, institutions } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form state - Step 1: Event Profile & Coordinator
  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`CN-${currentOrganizer?.institutionName.substring(0, 3).toUpperCase() || 'KEC'}-26-${Math.floor(100 + Math.random() * 900)}`);
  const [eventType, setEventType] = useState<EventItem['eventType']>('Hackathon');
  const [category, setCategory] = useState('National College Hackathon');
  const [theme, setTheme] = useState('AI, Drone Robotics & Agritech');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English / Regional');
  const [participationType, setParticipationType] = useState<'team' | 'individual'>('team');
  const [timezone, setTimezone] = useState('IST (UTC+05:30)');
  const [onlineMeetingUrl, setOnlineMeetingUrl] = useState('');
  const [onlineJoiningInstructions, setOnlineJoiningInstructions] = useState('');

  // Coordinator Details
  const [coordinatorName, setCoordinatorName] = useState(currentOrganizer?.coordinatorName || 'Dr. Suresh Babu');
  const [coordinatorEmail, setCoordinatorEmail] = useState(currentOrganizer?.officialEmail || 'suresh.babu@kec.ac.in');
  const [coordinatorPhone, setCoordinatorPhone] = useState(currentOrganizer?.mobile || '+91 94401 23456');
  const [coordinatorDesignation, setCoordinatorDesignation] = useState(currentOrganizer?.designation || 'Head of Innovation & Dean of Engineering');

  // Step 2: Location, Venue & GPS
  const [state, setState] = useState<string>(currentOrganizer?.state || 'Andhra Pradesh');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>(getDistrictsByStateName(currentOrganizer?.state || 'Andhra Pradesh'));
  const [district, setDistrict] = useState<string>('Chittoor');
  const [city, setCity] = useState(currentOrganizer?.city || 'Kuppam');
  const [venue, setVenue] = useState(`${currentOrganizer?.institutionName || 'Kuppam Engineering College'} Main Complex`);
  const [address, setAddress] = useState('KES Nagar, Kuppam');
  const [pincode, setPincode] = useState('517425');
  const [mode, setMode] = useState<'Offline' | 'Online' | 'Hybrid'>('Offline');
  const [targetLat, setTargetLat] = useState(12.7533);
  const [targetLng, setTargetLng] = useState(78.3496);
  const [allowedRadius, setAllowedRadius] = useState(500);

  // Update dependent districts whenever selected state changes
  useEffect(() => {
    const districts = getDistrictsByStateName(state);
    setAvailableDistricts(districts);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  }, [state]);

  // Step 3: Dates & Requirements
  const [startDate, setStartDate] = useState('2026-05-10T09:00');
  const [endDate, setEndDate] = useState('2026-05-12T17:00');
  const [regOpenDate, setRegOpenDate] = useState('2026-02-01T00:00');
  const [regCloseDate, setRegCloseDate] = useState('2026-04-30T23:59');

  const [eligibility, setEligibility] = useState('Bonafide engineering & science students in recognized Indian universities');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['Computer Science & Engineering', 'Electronics & Communication Engineering (ECE)']);
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(6);
  const [participantLimit, setParticipantLimit] = useState(100);
  const [registrationFee, setRegistrationFee] = useState('Free');

  const [tracks, setTracks] = useState<string[]>(['Smart Agritech', 'Edge AI Vision', 'Healthcare Sensors']);
  const [newTrackInput, setNewTrackInput] = useState('');
  const [rules, setRules] = useState<string[]>([
    'Teams must present original working hardware/software prototypes.',
    'All team members must check in via CampusNet GPS / QR at the nodal venue.',
    'Pre-built commercial black-box units are disqualified.'
  ]);
  const [newRuleInput, setNewRuleInput] = useState('');

  const [prizes, setPrizes] = useState<EventPrize[]>([
    { rank: '1st Prize Champion', amount: '₹1,50,000', description: 'Cash Prize + Incubation Seed Support' },
    { rank: '1st Runner-Up', amount: '₹75,000', description: 'Cash Prize + Prototyping Voucher' },
    { rank: '2nd Runner-Up', amount: '₹35,000', description: 'Cash Prize + Merit Award' }
  ]);

  const [schedule, setSchedule] = useState<EventScheduleItem[]>([
    { time: '09:00 AM', title: 'Registration & Nodal QR Check-In', day: 'Day 1' },
    { time: '11:00 AM', title: 'Inauguration & Problem Statement Release', day: 'Day 1' },
    { time: '02:00 PM', title: 'Hardware Inspection & FMEA Review', day: 'Day 2' },
    { time: '04:00 PM', title: 'Grand Jury Evaluation & Awards Ceremony', day: 'Day 3' }
  ]);

  // Step 4: Mandatory Uploads & Acknowledgement
  const [institutionProof, setInstitutionProof] = useState<EventHostingDocument | null>({
    id: 'doc-proof-seed-01',
    eventId: '',
    type: 'institution_proof',
    title: 'Institution Proof / Affiliation Certificate',
    fileName: 'KEC-Official-AICTE-Affiliation-Proof.pdf',
    fileUrl: 'https://campusnet.network/docs/kec-aicte-affiliation.pdf',
    fileSize: '1.45 MB',
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    verifiedByAdmin: false
  });

  const [formalRequestLetter, setFormalRequestLetter] = useState<EventHostingDocument | null>({
    id: 'doc-letter-seed-02',
    eventId: '',
    type: 'formal_request_letter',
    title: 'Formal Request Letter on Institutional Letterhead',
    fileName: 'KEC-Event-Hosting-Formal-Letter-Principal.pdf',
    fileUrl: 'https://campusnet.network/docs/kec-formal-request-letter.pdf',
    fileSize: '0.82 MB',
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    verifiedByAdmin: false
  });

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddTrack = () => {
    if (newTrackInput.trim()) {
      setTracks([...tracks, sanitizeInput(newTrackInput.trim())]);
      setNewTrackInput('');
    }
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setRules([...rules, sanitizeInput(newRuleInput.trim())]);
      setNewRuleInput('');
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Event title is required';
    if (!coordinatorName.trim()) errors.coordinatorName = 'Coordinator name is required';
    if (!coordinatorEmail.trim() || !coordinatorEmail.includes('@') || !coordinatorEmail.includes('.')) {
      errors.coordinatorEmail = 'Valid official institutional email required';
    }
    if (!coordinatorPhone.trim()) errors.coordinatorPhone = 'Mobile number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!startDate) errors.startDate = 'Start date is required';
    if (!endDate) errors.endDate = 'End date is required';
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      errors.endDate = 'Event end date/time must be strictly after the start date/time.';
    }
    if (regOpenDate && regCloseDate && new Date(regOpenDate) >= new Date(regCloseDate)) {
      errors.regCloseDate = 'Registration deadline must be after registration opening date.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    if (!institutionProof) {
      errors.institutionProof = 'Institution Proof / Affiliation Certificate is mandatory';
    }
    if (!formalRequestLetter) {
      errors.formalRequestLetter = 'Formal Request Letter on letterhead is mandatory';
    }
    if (!isAcknowledged) {
      errors.isAcknowledged = 'Mandatory institutional compliance acknowledgement is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (action: 'draft' | 'review' | 'publish') => {
    if ((action === 'review' || action === 'publish') && !validateStep4()) {
      addToast({
        type: 'error',
        title: 'Documents Required',
        message: 'Please attach both mandatory verification documents and accept acknowledgement.'
      });
      return;
    }

    const uploadedDocs: EventHostingDocument[] = [];
    if (institutionProof) uploadedDocs.push(institutionProof);
    if (formalRequestLetter) uploadedDocs.push(formalRequestLetter);

    const isDirectPublish = action === 'publish' && currentOrganizer?.verificationStatus === 'verified';

    const newEvent = createOrganizerEvent({
      title: sanitizeInput(title) || 'National Technical Innovation Challenge',
      code: sanitizeInput(code),
      eventType,
      category: sanitizeInput(category),
      theme: sanitizeInput(theme),
      bannerUrl,
      description: sanitizeInput(description) || 'Flagship national challenge hosted by ' + (currentOrganizer?.institutionName || 'College'),
      venue: sanitizeInput(venue),
      address: sanitizeInput(address),
      district: sanitizeInput(district),
      state: sanitizeInput(state),
      city: sanitizeInput(city),
      pincode: sanitizeInput(pincode),
      mode,
      language: sanitizeInput(language),
      timezone: sanitizeInput(timezone),
      participationType,
      onlineMeetingUrl: (mode === 'Online' || mode === 'Hybrid') ? onlineMeetingUrl.trim() : undefined,
      onlineJoiningInstructions: (mode === 'Online' || mode === 'Hybrid') ? onlineJoiningInstructions.trim() : undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      registrationOpenDate: new Date(regOpenDate).toISOString(),
      registrationCloseDate: new Date(regCloseDate).toISOString(),
      date: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      deadline: new Date(regCloseDate).toLocaleDateString(),
      eligibility: sanitizeInput(eligibility),
      eligibleDepartments: selectedDepts,
      minTeamSize: participationType === 'individual' ? 1 : minTeamSize,
      maxTeamSize: participationType === 'individual' ? 1 : maxTeamSize,
      participantLimit,
      registrationFee: sanitizeInput(registrationFee),
      tracks,
      rules,
      prizes,
      schedule,
      coordinatorName: sanitizeInput(coordinatorName),
      coordinatorEmail: sanitizeInput(coordinatorEmail),
      coordinatorPhone: sanitizeInput(coordinatorPhone),
      coordinatorDesignation: sanitizeInput(coordinatorDesignation),
      documents: uploadedDocs,
      isAcknowledged,
      submittedAt: new Date().toISOString(),
      attendanceWindow: {
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(),
        targetLat,
        targetLng,
        allowedRadiusMeters: allowedRadius
      },
      submissionRequirements: ['Project Proposal PDF', 'GitHub Repository', 'Hardware Demonstration Video']
    });

    if (isDirectPublish) {
      // If directly publishing
      submitEventForApproval(newEvent.id);
      addToast({
        type: 'success',
        title: 'Event Published Live!',
        message: `"${newEvent.title}" is now published and open for registrations across CampusNet India.`
      });
    } else if (action === 'review') {
      submitEventForApproval(newEvent.id);
      addToast({
        type: 'info',
        title: 'Submitted for Accreditation Review',
        message: 'Your event proposal has entered the Super Admin review queue.'
      });
    } else {
      addToast({
        type: 'success',
        title: 'Event Draft Saved',
        message: `Draft "${newEvent.title}" saved. You can resume editing anytime.`
      });
    }

    setActiveSection('events');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-warm-md space-y-6 text-slate-800">
      
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
              Step {currentStep} of 4
            </span>
            <span className="text-xs text-slate-500 font-medium">Institutional Event Creator & Accreditation Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Host Event & Request Super Admin Accreditation
          </h2>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(step => (
            <button
              key={step}
              onClick={() => {
                if (step === 1 || validateStep1()) {
                  setCurrentStep(step);
                }
              }}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentStep === step
                  ? 'bg-slate-900 text-white font-black scale-110 shadow-warm-xs'
                  : currentStep > step
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Event Information & Coordinator Profile */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            1. Basic Event Profile & Coordinator Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. KEC National AI & Smart Robotics Hackathon 2026"
                className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm text-white outline-none ${
                  formErrors.title ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                }`}
              />
              {formErrors.title && <p className="text-[11px] text-red-400 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Event Code (Unique National ID) *
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. KEC-AI26-HACK"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-mono focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Event Category / Type *
              </label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Technical Symposium">Technical Symposium</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Paper Presentation">Paper Presentation</option>
                <option value="Project Expo">Project Expo</option>
                <option value="Coding Competition">Coding Competition</option>
                <option value="AI/ML Event">AI/ML Event</option>
                <option value="Research Seminar">Research Seminar</option>
                <option value="Webinar">Webinar</option>
                <option value="Cultural Event">Cultural Event</option>
                <option value="Entrepreneurship Event">Entrepreneurship Event</option>
                <option value="Ideathon">Ideathon</option>
                <option value="Government Challenge">Government Challenge</option>
                <option value="Coding Contest">Coding Contest</option>
                <option value="Other Academic Event">Other Academic Event</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Participation Format *
              </label>
              <select
                value={participationType}
                onChange={e => setParticipationType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="team">Team Participation (2 - 6 Members)</option>
                <option value="individual">Individual Participation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Primary Event Language
              </label>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                placeholder="e.g. English, Hindi, Bilingual"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Theme / Core Domain
              </label>
              <input
                type="text"
                value={theme}
                onChange={e => setTheme(e.target.value)}
                placeholder="e.g. Autonomous Robotics, Edge AI, Clean Energy"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Banner Image URL
              </label>
              <input
                type="text"
                value={bannerUrl}
                onChange={e => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Comprehensive Event Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the challenge objectives, problem statement domains, and deliverables expected from collegiate innovators..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Coordinator Section */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              Event Coordinator & Institutional Point of Contact
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Coordinator Name *</label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={e => setCoordinatorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  placeholder="e.g. Dr. Suresh Babu"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Official Institutional Email *</label>
                <input
                  type="email"
                  value={coordinatorEmail}
                  onChange={e => setCoordinatorEmail(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-white outline-none ${
                    formErrors.coordinatorEmail ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                  placeholder="coordinator@institution.ac.in"
                />
                {formErrors.coordinatorEmail && <p className="text-[10px] text-red-400 mt-0.5">{formErrors.coordinatorEmail}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  value={coordinatorPhone}
                  onChange={e => setCoordinatorPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  placeholder="+91 94401 23456"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Academic Designation</label>
                <input
                  type="text"
                  value={coordinatorDesignation}
                  onChange={e => setCoordinatorDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  placeholder="Dean / Head of Dept"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className="campus-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Next: Location & Venue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location, Venue & GPS Geofencing */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            2. Physical Venue, State, District & GPS Geofencing Check-In
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Venue / Auditorium *</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. KEC Central Auditorium & Labs Complex"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Participation Mode *</label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="Offline">Offline (Physical Venue)</option>
                <option value="Hybrid">Hybrid (Nodal Centers + Remote)</option>
                <option value="Online">Online Virtual Arena</option>
              </select>
            </div>

            {/* Normalized 28 States + 8 UTs Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                State / Union Territory *
              </label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                {ALL_STATE_AND_UT_NAMES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* State-Filtered College Quick Auto-Fill */}
            {(() => {
              const stateInsts = institutions.filter(inst => 
                inst.state.toLowerCase() === state.toLowerCase() || 
                state.toLowerCase().includes(inst.state.toLowerCase())
              );
              if (stateInsts.length === 0) return null;
              return (
                <div className="sm:col-span-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Auto-populate from <strong>{stateInsts.length}</strong> colleges in {state}:</span>
                  </div>
                  <select
                    onChange={e => {
                      const selected = institutions.find(i => i.id === e.target.value);
                      if (selected) {
                        setVenue(`${selected.name} Campus`);
                        setCity(selected.city);
                        if (selected.district) setDistrict(selected.district);
                        if (selected.pincode) setPincode(selected.pincode);
                        if (selected.address) setAddress(selected.address);
                        addToast({
                          type: 'info',
                          title: 'Institution Auto-Filled',
                          message: `Loaded venue details for ${selected.name}`
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-300 outline-none max-w-sm truncate"
                    defaultValue=""
                  >
                    <option value="" disabled>-- Select College / University --</option>
                    {stateInsts.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name} ({inst.city})</option>
                    ))}
                  </select>
                </div>
              );
            })()}

            {/* Dependent District Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                District / Administrative Region *
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">City / Town *</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Kuppam"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Physical Address *</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. KES Nagar, Kuppam"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">PIN Code</label>
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="517425"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            {/* GPS Geofence */}
            <div className="sm:col-span-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-400" />
                  Nodal GPS Coordinates & Geofencing Radius
                </span>
                <span className="text-[11px] text-slate-400">Used for anti-proxy mobile attendance check-in</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Target Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={targetLat}
                    onChange={e => setTargetLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Target Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={targetLng}
                    onChange={e => setTargetLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Allowed Radius (Meters)</label>
                  <input
                    type="number"
                    value={allowedRadius}
                    onChange={e => setAllowedRadius(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Online Joining Credentials (Confidential) */}
            {(mode === 'Online' || mode === 'Hybrid') && (
              <div className="sm:col-span-3 p-4 bg-slate-900 rounded-2xl border border-indigo-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    Private Online Meeting / Arena Joining Link
                  </span>
                  <span className="text-[11px] text-slate-400">Kept confidential until student registration confirmation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Meeting / Stream URL (Zoom / Google Meet / Discord)</label>
                    <input
                      type="url"
                      value={onlineMeetingUrl}
                      onChange={e => setOnlineMeetingUrl(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Joining Instructions for Students</label>
                    <input
                      type="text"
                      value={onlineJoiningInstructions}
                      onChange={e => setOnlineJoiningInstructions(e.target.value)}
                      placeholder="e.g. Passcode shared 1h prior. Join via registered college email."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="campus-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Next: Dates & Tracks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Dates, Eligibility, Tracks, Prizes & Schedule */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            3. Schedules, Eligibility, Problem Tracks & Prize Pool
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Event Start Date & Time *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Event End Date & Time *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Registration Open *</label>
              <input
                type="datetime-local"
                value={regOpenDate}
                onChange={e => setRegOpenDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Registration Deadline *</label>
              <input
                type="datetime-local"
                value={regCloseDate}
                onChange={e => setRegCloseDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Eligibility Criteria</label>
              <input
                type="text"
                value={eligibility}
                onChange={e => setEligibility(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Team Size Limits (Min / Max)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minTeamSize}
                  onChange={e => setMinTeamSize(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
                <input
                  type="number"
                  value={maxTeamSize}
                  onChange={e => setMaxTeamSize(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Participant Team Limit & Fee</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={participantLimit}
                  onChange={e => setParticipantLimit(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
                <input
                  type="text"
                  value={registrationFee}
                  onChange={e => setRegistrationFee(e.target.value)}
                  placeholder="Free"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
              </div>
            </div>
          </div>

          {/* Problem Tracks */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-300">Challenge Tracks</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTrackInput}
                onChange={e => setNewTrackInput(e.target.value)}
                placeholder="e.g. Micro-Grid Energy Storage Automation"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTrack}
                className="campus-btn-primary px-3 py-1.5 rounded-xl text-xs"
              >
                + Add Track
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tracks.map((t, idx) => (
                <span key={idx} className="text-xs bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  {t}
                  <button onClick={() => setTracks(tracks.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-400">✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateStep3()) setCurrentStep(4);
              }}
              className="campus-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Next: Mandatory Documents & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Mandatory Document Uploads, Accreditation & Submission */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              4. Mandatory Verification Documents & Institutional Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Per National Accreditation Guidelines, all events hosted on CampusNet require verified institutional credentials.
            </p>
          </div>

          {/* Mandatory Document Upload Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <DocumentUploadField
              label="1. Institution Proof / Affiliation Certificate"
              type="institution_proof"
              required={true}
              helpText="Official letter from Principal / Dean / AICTE Approval Document"
              document={institutionProof}
              onDocumentChange={setInstitutionProof}
            />

            <DocumentUploadField
              label="2. Formal Request Letter"
              type="formal_request_letter"
              required={true}
              helpText="Signed by the event coordinator on institutional letterhead"
              document={formalRequestLetter}
              onDocumentChange={setFormalRequestLetter}
            />
          </div>

          {/* Mandatory Institutional Acknowledgement Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAcknowledged}
                onChange={e => setIsAcknowledged(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-300 block">
                  Mandatory Institutional Compliance Acknowledgement *
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  I hereby confirm that this event complies with all institutional, AICTE, and UGC frameworks. The information, coordinator details, and uploaded verification documents provided herein are bonafide and authentic. I understand that misrepresentation will result in immediate institutional suspension and accreditation revocation.
                </p>
              </div>
            </label>
            {formErrors.isAcknowledged && (
              <p className="text-xs text-red-400 pl-7">{formErrors.isAcknowledged}</p>
            )}
          </div>

          {/* Summary Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Proposal Summary</span>
              <span className="text-amber-400">{code}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px] pt-1">
              <div><strong>Location:</strong> {city}, {state}</div>
              <div><strong>District:</strong> {district}</div>
              <div><strong>Mode:</strong> {mode}</div>
              <div><strong>Dates:</strong> {new Date(startDate).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('review')}
                className="flex-1 sm:flex-initial campus-btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-warm-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit for Accreditation Review</span>
              </button>

              {currentOrganizer?.verificationStatus === 'verified' && (
                <button
                  type="button"
                  onClick={() => handleSubmit('publish')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-warm-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Directly to CampusNet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

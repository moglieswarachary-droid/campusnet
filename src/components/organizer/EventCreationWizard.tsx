import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, MapPin, Award, Users, 
  ShieldCheck, Plus, Trash2, ArrowRight, ArrowLeft, 
  Check, Sparkles, AlertCircle, FileText 
} from 'lucide-react';
import { EventItem, EventPrize, EventScheduleItem } from '../../types';
import { MOCK_INDIAN_STATES, MOCK_INDIAN_CITIES, MOCK_DEPARTMENTS_LIST } from '../../data/mockData';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const EventCreationWizard: React.FC<Props> = ({ setActiveSection }) => {
  const { currentOrganizer, createOrganizerEvent, submitEventForApproval } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`CN-${currentOrganizer?.institutionName.substring(0, 3).toUpperCase() || 'KEC'}-26-${Math.floor(100 + Math.random() * 900)}`);
  const [eventType, setEventType] = useState<EventItem['eventType']>('Hackathon');
  const [category, setCategory] = useState('National College Hackathon');
  const [theme, setTheme] = useState('AI, Drone Robotics & Agritech');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');

  // Venue & GPS
  const [venue, setVenue] = useState(`${currentOrganizer?.institutionName || 'Kuppam Engineering College'} Main Complex`);
  const [address, setAddress] = useState('KES Nagar, Kuppam');
  const [district, setDistrict] = useState('Chittoor');
  const [state, setState] = useState(currentOrganizer?.state || 'Andhra Pradesh');
  const [city, setCity] = useState(currentOrganizer?.city || 'Kuppam');
  const [pincode, setPincode] = useState('517425');
  const [mode, setMode] = useState<'Offline' | 'Online' | 'Hybrid'>('Offline');
  const [targetLat, setTargetLat] = useState(12.7533);
  const [targetLng, setTargetLng] = useState(78.3496);
  const [allowedRadius, setAllowedRadius] = useState(500);

  // Dates
  const [startDate, setStartDate] = useState('2026-05-10T09:00');
  const [endDate, setEndDate] = useState('2026-05-12T17:00');
  const [regOpenDate, setRegOpenDate] = useState('2026-02-01T00:00');
  const [regCloseDate, setRegCloseDate] = useState('2026-04-30T23:59');

  // Eligibility & Teams
  const [eligibility, setEligibility] = useState('Bonafide engineering & science students in recognized universities');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['Computer Science & Engineering', 'Electronics & Communication Engineering (ECE)']);
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(6);
  const [participantLimit, setParticipantLimit] = useState(100);
  const [registrationFee, setRegistrationFee] = useState('Free');

  // Prizes, Tracks, Rules
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

  // Schedule
  const [schedule, setSchedule] = useState<EventScheduleItem[]>([
    { time: '09:00 AM', title: 'Registration & Nodal QR Check-In', day: 'Day 1' },
    { time: '11:00 AM', title: 'Inauguration & Problem Statement Release', day: 'Day 1' },
    { time: '02:00 PM', title: 'Hardware Inspection & FMEA Review', day: 'Day 2' },
    { time: '04:00 PM', title: 'Grand Jury Evaluation & Awards Ceremony', day: 'Day 3' }
  ]);

  const handleAddTrack = () => {
    if (newTrackInput.trim()) {
      setTracks([...tracks, newTrackInput.trim()]);
      setNewTrackInput('');
    }
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setRules([...rules, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleSubmit = (submitForReview: boolean) => {
    const newEvent = createOrganizerEvent({
      title: title || 'National Technical Innovation Challenge',
      code,
      eventType,
      category,
      theme,
      bannerUrl,
      description: description || 'Flagship national student challenge hosted by ' + (currentOrganizer?.institutionName || 'College'),
      venue,
      address,
      district,
      state,
      city,
      pincode,
      mode,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      registrationOpenDate: new Date(regOpenDate).toISOString(),
      registrationCloseDate: new Date(regCloseDate).toISOString(),
      date: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      deadline: new Date(regCloseDate).toLocaleDateString(),
      eligibility,
      eligibleDepartments: selectedDepts,
      minTeamSize,
      maxTeamSize,
      participantLimit,
      registrationFee,
      tracks,
      rules,
      prizes,
      schedule,
      attendanceWindow: {
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(),
        targetLat,
        targetLng,
        allowedRadiusMeters: allowedRadius
      },
      submissionRequirements: ['Project Proposal PDF', 'GitHub Repository', 'Hardware Demonstration Video']
    });

    if (submitForReview) {
      submitEventForApproval(newEvent.id);
    }

    setActiveSection('events');
  };

  return (
    <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              Step {currentStep} of 4
            </span>
            <span className="text-xs text-slate-400">Institutional Event Creator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Create & Host College Event on CampusNet
          </h2>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(step => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                currentStep === step
                  ? 'bg-amber-500 text-slate-950 font-black scale-110'
                  : currentStep > step
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Event Information */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            1. Basic Event Profile & Category
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
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Event Code (Unique ID) *
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
                Event Type *
              </label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Ideathon">Ideathon</option>
                <option value="Government Challenge">Government Challenge</option>
                <option value="Research Symposium">Research Symposium</option>
                <option value="Project Expo">Project Expo</option>
                <option value="Coding Contest">Coding Contest</option>
                <option value="Workshop">Workshop</option>
                <option value="Tech Fest">Tech Fest</option>
              </select>
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
        </div>
      )}

      {/* STEP 2: Location, Venue & GPS Geofencing */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            2. Physical Venue, State, City & GPS Geofencing Check-In
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

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Indian State *</label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-amber-500 outline-none"
              >
                {MOCK_INDIAN_STATES.filter(s => s !== 'All India').map(s => (
                  <option key={s} value={s}>{s}</option>
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
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={targetLat}
                    onChange={e => setTargetLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={targetLng}
                    onChange={e => setTargetLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Allowed Radius (Meters)</label>
                  <input
                    type="number"
                    value={allowedRadius}
                    onChange={e => setAllowedRadius(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Dates, Eligibility & Team Constraints */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            3. Dates, Registration Windows & Team Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Event Start Date & Time *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Event End Date & Time *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Registration Open Date</label>
              <input
                type="datetime-local"
                value={regOpenDate}
                onChange={e => setRegOpenDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Registration Deadline *</label>
              <input
                type="datetime-local"
                value={regCloseDate}
                onChange={e => setRegCloseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Team Size (Min - Max)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minTeamSize}
                  onChange={e => setMinTeamSize(parseInt(e.target.value))}
                  placeholder="Min"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
                <input
                  type="number"
                  value={maxTeamSize}
                  onChange={e => setMaxTeamSize(parseInt(e.target.value))}
                  placeholder="Max"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Registration Fee</label>
              <input
                type="text"
                value={registrationFee}
                onChange={e => setRegistrationFee(e.target.value)}
                placeholder="e.g. Free or ₹250/Team"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Prizes, Tracks, Rules & Final Submission */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            4. Prizes Breakdown, Tracks & Publishing Action
          </h3>

          {/* Tracks Tags */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase text-slate-300">
              Competition Tracks / Problem Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tracks.map((t, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-amber-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span>{t}</span>
                  <button onClick={() => setTracks(tracks.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrackInput}
                onChange={e => setNewTrackInput(e.target.value)}
                placeholder="Add new track (e.g. Subsea Robotics)..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                + Add Track
              </button>
            </div>
          </div>

          {/* Prizes List */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase text-slate-300">
              Prize Pool & Merit Awards
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {prizes.map((pz, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-amber-400">{pz.rank}</div>
                  <div className="text-base font-black text-white">{pz.amount}</div>
                  <div className="text-[11px] text-slate-400">{pz.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase text-slate-300">
              Mandatory Guidelines & Rules
            </label>
            <ul className="space-y-1 text-xs text-slate-300">
              {rules.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="flex-1">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveSection('events')}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
          >
            Cancel
          </button>
        )}

        <div className="flex items-center gap-2">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Submit for Super Admin Approval 🚀</span>
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, GraduationCap, Code2, Sparkles, 
  ArrowRight, ArrowLeft, Check, CheckCircle2, User, 
  BookOpen, Layers, X, ShieldCheck, Globe
} from 'lucide-react';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { sanitizeInput, validateSocialUrl } from '../../utils/validation';

const POPULAR_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 
  'Machine Learning', 'TensorFlow', 'PostgreSQL', 'Docker', 
  'Cloud Architecture', 'Embedded C', 'IoT & Arduino', 'Next.js', 
  'Robotics', 'Figma / UI Design', 'Flutter', 'Data Structures & Algorithms'
];

const POPULAR_DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Electronics & Communication Engineering (ECE)',
  'Information Technology (IT)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering & Robotics',
  'Civil & Environmental Engineering',
  'Biotechnology & Bioinformatics',
  'Applied Sciences & Mathematics'
];

const ACADEMIC_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Pre-Final)',
  '4th Year (Final Year Graduate)',
  'Post Graduate / Master / PhD'
];

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateStudentProfile, addToast, institutions } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Institution & State
  const [state, setState] = useState(currentUser?.city || currentUser?.state || 'Andhra Pradesh');
  const [district, setDistrict] = useState('Chittoor');
  const [institutionName, setInstitutionName] = useState(
    currentUser?.institution && !currentUser.institution.includes('(CampusNet)') 
      ? currentUser.institution 
      : 'Kuppam Engineering College'
  );
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');

  // Step 2: Department & Academic Year
  const [department, setDepartment] = useState(
    currentUser?.department && currentUser.department !== 'Engineering' 
      ? currentUser.department 
      : 'Computer Science & Engineering (CSE)'
  );
  const [course, setCourse] = useState(currentUser?.course || 'B.Tech');
  const [year, setYear] = useState(currentUser?.year || '3rd Year (Pre-Final)');

  // Step 3: Skills & Profiles
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentUser?.skills && currentUser.skills.length > 0 
      ? currentUser.skills 
      : ['React', 'TypeScript', 'Python']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [github, setGithub] = useState(currentUser?.github || currentUser?.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || currentUser?.socialLinks?.linkedin || '');
  const [bio, setBio] = useState(
    currentUser?.bio && currentUser.bio.length > 10 
      ? currentUser.bio 
      : 'Passionate student innovator solving real-world challenges through collegiate hackathons and academic research.'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = getDistrictsByStateName(newState);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length >= 8) {
        addToast({
          type: 'warning',
          title: 'Skill Limit Reached',
          message: 'You can highlight up to 8 core skills on your showcase profile.'
        });
        return;
      }
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (selectedSkills.includes(trimmed)) {
      setCustomSkillInput('');
      return;
    }
    if (selectedSkills.length >= 8) {
      addToast({
        type: 'warning',
        title: 'Skill Limit Reached',
        message: 'You can highlight up to 8 core skills.'
      });
      return;
    }
    setSelectedSkills([...selectedSkills, trimmed]);
    setCustomSkillInput('');
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate social profiles if provided
    const newErrors: Record<string, string> = {};
    if (github) {
      const gv = validateSocialUrl('github', github);
      if (!gv.isValid) newErrors.github = gv.error || 'Invalid GitHub profile URL';
    }
    if (linkedin) {
      const lv = validateSocialUrl('linkedin', linkedin);
      if (!lv.isValid) newErrors.linkedin = lv.error || 'Invalid LinkedIn profile URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedProfilePayload = {
        name: currentUser?.name || 'Student',
        institution: sanitizeInput(institutionName),
        department: sanitizeInput(department),
        course: sanitizeInput(course),
        year: sanitizeInput(year),
        studentId: sanitizeInput(studentId),
        skills: selectedSkills,
        bio: sanitizeInput(bio),
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        socialLinks: {
          github: github.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
        },
        state,
        city: district,
        onboarded: true
      };

      // 1. Update Context and Local Storage
      updateStudentProfile(updatedProfilePayload);

      // 2. Sync to Backend Database (Prisma + Neon PostgreSQL)
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const storedUser = localStorage.getItem('campusnet_user');
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (currentUser?.id) {
        await fetch(`${apiBase}/api/students/${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(updatedProfilePayload)
        }).catch(err => console.warn('Background profile sync notice:', err.message));
      }

      addToast({
        type: 'success',
        title: 'Profile Initialized 🎉',
        message: `Welcome aboard, ${currentUser?.name || 'Student'}! Your student identity is verified with ${institutionName}.`
      });

      onClose();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Error',
        message: err.message || 'Failed to complete profile onboarding.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDistricts = getDistrictsByStateName(state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-400/30">
                Setup Academic Profile
              </span>
              <span className="text-xs text-blue-200 font-medium">Step {step} of 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {step === 1 && 'Select Your Academic Institution'}
              {step === 2 && 'Department & Graduation Year'}
              {step === 3 && 'Showcase Your Core Tech Stack'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Skip for now"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* STEP 1: Institution & State */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-950 leading-relaxed">
                  Connecting your academic institution links you with campus mentors, verified college hackathon rosters, and collegiate team workspaces.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Indian State / Union Territory
                  </label>
                  <select
                    value={state}
                    onChange={e => handleStateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {ALL_STATE_AND_UT_NAMES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    District / Region
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {availableDistricts.map(dst => (
                      <option key={dst} value={dst}>{dst}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  College / University Name
                </label>
                <input
                  type="text"
                  list="popular-institutions"
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  placeholder="e.g. Kuppam Engineering College, IIT Bombay..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                />
                <datalist id="popular-institutions">
                  {(institutions || []).map((inst: any) => (
                    <option key={inst.id || inst.name} value={inst.name || inst.institutionName} />
                  ))}
                  <option value="Kuppam Engineering College" />
                  <option value="Indian Institute of Technology, Bombay" />
                  <option value="Indian Institute of Science, Bengaluru" />
                  <option value="National Institute of Technology, Warangal" />
                  <option value="Anna University, Chennai" />
                </datalist>
                <p className="text-[11px] text-slate-500">
                  Select from registered institutions or type your official college name.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  University Roll Number / Student ID (Optional)
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="e.g. 22CSE-049 / 2026BCS012"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Department & Academic Year */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Branch / Academic Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {POPULAR_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Degree / Program
                  </label>
                  <select
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                    <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="Dual Degree">B.Tech + M.Tech Dual Degree</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {ACADEMIC_YEARS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Short Innovator Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share a sentence about your technical focus or what you like building..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Profiles */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Your Core Technical Stack ({selectedSkills.length}/8)
                  </label>
                  <span className="text-[11px] text-slate-500">Tap to toggle</span>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_SKILLS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill adder */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={e => setCustomSkillInput(e.target.value)}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Add other skill (e.g. ROS, Solidity, Kubernetes)..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl outline-none ${
                      errors.github ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.github && <p className="text-[11px] text-red-600 font-medium">{errors.github}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl outline-none ${
                      errors.linkedin ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {errors.linkedin && <p className="text-[11px] text-red-600 font-medium">{errors.linkedin}</p>}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2 cursor-pointer"
            >
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !institutionName.trim()) {
                  addToast({ type: 'warning', title: 'College Required', message: 'Please enter your college name.' });
                  return;
                }
                setStep(prev => (prev + 1) as any);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleComplete}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Saving Profile...' : 'Complete Profile Setup'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

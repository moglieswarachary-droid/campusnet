import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Check, Sparkles, Building, Briefcase, Award, GraduationCap } from 'lucide-react';
import { MOCK_INSTITUTIONS_LIST } from '../../data/mockData';

export const MentorOnboardingModal: React.FC = () => {
  const { authModalType, setAuthModalType, switchRole, addToast } = useApp();

  const [name, setName] = useState('Dr. Arvind Rao');
  const [title, setTitle] = useState('Professor & Head of Computer Vision Lab');
  const [qualification, setQualification] = useState('Ph.D. in Computer Science (Stanford / IITB)');
  const [institution, setInstitution] = useState('Indian Institute of Technology Bombay (IIT Bombay)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [specialization, setSpecialization] = useState('Computer Vision, Edge AI, Autonomous Robotics');
  const [yearsExperience, setYearsExperience] = useState<number>(14);
  const [academicExp, setAcademicExp] = useState('10+ Years Teaching & Guiding PhD / Master Theses');
  const [industryExp, setIndustryExp] = useState('4 Years Lead AI Scientist at NVIDIA Research');
  const [researchAreas, setResearchAreas] = useState<string>('Edge Computer Vision, Visual Odometry, Multi-Spectral Drone Analytics');
  const [projectsGuided, setProjectsGuided] = useState<number>(38);
  const [certifications, setCertifications] = useState<string>('IEEE Senior Member, ACM Distinguished Scientist, NVIDIA DLI Lead');
  const [mentoringInterests, setMentoringInterests] = useState<string>('Agritech AI, UAV Swarm Vision, Edge Machine Learning, Student Startups');
  const [availability, setAvailability] = useState<'Available' | 'Limited Slots' | 'Busy'>('Available');
  const [email, setEmail] = useState('arvind.rao@iitb.ac.in');
  const [mobile, setMobile] = useState('+91 94432 10987');

  if (authModalType !== 'mentor_onboarding') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('mentor');
    setAuthModalType('none');
    addToast({
      type: 'success',
      title: 'Mentor Profile Verified & Active! 🎓',
      message: `${name} is now onboarded with "Verified Mentor" accreditation.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-warm-xl border border-campus-border relative my-8"
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
            <span className="campus-badge-mentor">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Faculty & Industry Mentor Onboarding
            </span>
          </div>
          <h2 className="text-2xl font-bold text-campus-deep-blue">
            Mentor Credential Application
          </h2>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Mentors guide 6-member student teams, approve project milestones, review research architectures, and evaluate hackathon submissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Full Name & Title
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Academic Designation / Position
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Institution / Organization
              </label>
              <select
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none bg-white"
              >
                {MOCK_INSTITUTIONS_LIST.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Total Experience (Years)
              </label>
              <input
                type="number"
                value={yearsExperience}
                onChange={e => setYearsExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Mentoring Availability
              </label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none bg-white"
              >
                <option value="Available">Available (Accepting Teams)</option>
                <option value="Limited Slots">Limited Slots</option>
                <option value="Busy">Currently Full</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Academic Experience Summary
              </label>
              <input
                type="text"
                value={academicExp}
                onChange={e => setAcademicExp(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Industry Experience Summary
              </label>
              <input
                type="text"
                value={industryExp}
                onChange={e => setIndustryExp(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
              Core Specialization & Research Areas
            </label>
            <input
              type="text"
              value={researchAreas}
              onChange={e => setResearchAreas(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
            />
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Official Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-slate-text mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-campus-border text-sm focus:border-campus-blue outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-campus-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAuthModalType('none')}
              className="campus-btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="campus-btn-red text-sm"
            >
              <Check className="w-4 h-4" />
              Complete Mentor Verification
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

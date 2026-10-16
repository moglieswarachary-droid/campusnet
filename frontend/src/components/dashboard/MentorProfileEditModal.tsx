import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Save, AlertCircle, CheckCircle2, 
  GraduationCap, BookOpen, ExternalLink, User 
} from 'lucide-react';
import { 
  LinkedinIcon, GithubIcon, TwitterIcon, LeetCodeIcon, InstagramIcon 
} from '../common/SocialIcons';
import { Mentor } from '../../types';
import { validateSocialUrl, validateVidwanUrl, sanitizeInput } from '../../utils/validation';

interface MentorProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
}

export const MentorProfileEditModal: React.FC<MentorProfileEditModalProps> = ({ isOpen, onClose, mentor }) => {
  const { updateMentorProfile, addToast } = useApp();

  const [name, setName] = useState(mentor.name || '');
  const [title, setTitle] = useState(mentor.title || '');
  const [department, setDepartment] = useState(mentor.department || '');
  const [specialization, setSpecialization] = useState(mentor.specialization || '');
  const [experience, setExperience] = useState(mentor.experience || mentor.academicExp || '10+ Years (Academic & Industrial R&D)');
  const [qualification, setQualification] = useState(mentor.qualification || '');
  const [bio, setBio] = useState(mentor.bio || '');
  const [researchAreas, setResearchAreas] = useState((mentor.researchAreas || []).join(', '));
  const [vidwanUrl, setVidwanUrl] = useState(mentor.vidwan_profile_url || '');

  // Social Links
  const [linkedin, setLinkedin] = useState(mentor.socialLinks?.linkedin || mentor.linkedin || '');
  const [github, setGithub] = useState(mentor.socialLinks?.github || mentor.github || '');
  const [twitter, setTwitter] = useState(mentor.socialLinks?.twitter || mentor.twitter || '');
  const [leetcode, setLeetcode] = useState(mentor.socialLinks?.leetcode || mentor.leetcode || '');
  const [instagram, setInstagram] = useState(mentor.socialLinks?.instagram || mentor.instagram || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

    // Validate Vidwan URL
    const vidwanVal = validateVidwanUrl(vidwanUrl);
    if (vidwanUrl && !vidwanVal.isValid) {
      newErrors.vidwan = vidwanVal.error || 'Invalid Vidwan profile URL';
    }

    // Validate social links
    const linkedinVal = validateSocialUrl('linkedin', linkedin);
    if (linkedin && !linkedinVal.isValid) {
      newErrors.linkedin = linkedinVal.error || 'Invalid LinkedIn profile URL';
    }

    const githubVal = validateSocialUrl('github', github);
    if (github && !githubVal.isValid) {
      newErrors.github = githubVal.error || 'Invalid GitHub profile URL';
    }

    const twitterVal = validateSocialUrl('twitter', twitter);
    if (twitter && !twitterVal.isValid) {
      newErrors.twitter = twitterVal.error || 'Invalid Twitter / X profile URL';
    }

    const leetcodeVal = validateSocialUrl('leetcode', leetcode);
    if (leetcode && !leetcodeVal.isValid) {
      newErrors.leetcode = leetcodeVal.error || 'Invalid LeetCode profile URL';
    }

    const instagramVal = validateSocialUrl('instagram', instagram);
    if (instagram && !instagramVal.isValid) {
      newErrors.instagram = instagramVal.error || 'Invalid Instagram profile URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please resolve domain URL errors before saving.'
      });
      return;
    }

    const cleanedAreas = researchAreas
      .split(',')
      .map(s => sanitizeInput(s.trim()))
      .filter(Boolean);

    const finalLinkedin = linkedinVal.normalizedUrl || undefined;
    const finalGithub = githubVal.normalizedUrl || undefined;
    const finalTwitter = twitterVal.normalizedUrl || undefined;
    const finalLeetcode = leetcodeVal.normalizedUrl || undefined;
    const finalInstagram = instagramVal.normalizedUrl || undefined;
    const finalVidwan = vidwanVal.normalizedUrl || undefined;

    updateMentorProfile(mentor.id, {
      name: sanitizeInput(name),
      title: sanitizeInput(title),
      department: sanitizeInput(department),
      specialization: sanitizeInput(specialization),
      qualification: sanitizeInput(qualification),
      experience: sanitizeInput(experience),
      bio: sanitizeInput(bio),
      researchAreas: cleanedAreas,
      vidwan_profile_url: finalVidwan,
      linkedin: finalLinkedin,
      github: finalGithub,
      twitter: finalTwitter,
      leetcode: finalLeetcode,
      instagram: finalInstagram,
      socialLinks: {
        linkedin: finalLinkedin,
        github: finalGithub,
        twitter: finalTwitter,
        leetcode: finalLeetcode,
        instagram: finalInstagram
      }
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-warm-2xl border border-campus-border relative my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-campus-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-campus-deep-blue">Edit Faculty & Mentor Profile</h3>
              <p className="text-xs text-campus-muted-text">Update professional advisory credentials, Vidwan ID & domains</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-campus-muted-text hover:text-campus-deep-blue hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Academic Title / Designation
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                placeholder="e.g. Professor & Head of Artificial Intelligence"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                placeholder="e.g. Ph.D. in Embedded Systems (IIT Madras)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Specialization / Domain
              </label>
              <input
                type="text"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                placeholder="e.g. Computer Vision, VLSI, Drone Robotics"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
                Years of Experience / R&D Track
              </label>
              <input
                type="text"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
                placeholder="e.g. 14+ Years (Academic & Industrial R&D)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
              Research & Mentorship Areas (Comma Separated)
            </label>
            <input
              type="text"
              value={researchAreas}
              onChange={e => setResearchAreas(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
              placeholder="e.g. Autonomous Drones, Edge AI, Precision Farming, Sensor Fusion"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
              Professional Bio & Guidance Philosophy
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-xs sm:text-sm focus:border-campus-blue outline-none"
              placeholder="Describe your research publications, guided projects, and mentorship expectations..."
            />
          </div>

          {/* Vidwan Profile URL */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>Vidwan INFLIBNET Profile URL</span>
              </span>
              <span className="text-[10px] text-purple-700 font-normal">Official National Database</span>
            </label>
            <input
              type="url"
              value={vidwanUrl}
              onChange={e => {
                setVidwanUrl(e.target.value);
                if (errors.vidwan) setErrors(prev => ({ ...prev, vidwan: '' }));
              }}
              placeholder="https://vidwan.inflibnet.ac.in/profile/12345"
              className={`w-full px-3.5 py-2 bg-white rounded-xl border text-xs sm:text-sm outline-none ${
                errors.vidwan ? 'border-red-500' : 'border-purple-300 focus:border-purple-600'
              }`}
            />
            {errors.vidwan && <p className="text-[11px] text-red-600">{errors.vidwan}</p>}
          </div>

          {/* Social Links Section */}
          <div className="pt-3 border-t border-campus-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-campus-deep-blue">
                Professional & Social Links
              </h4>
              <span className="text-[11px] text-campus-muted-text">Allowlisted domains enforced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* LinkedIn */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <LinkedinIcon size={14} className="text-blue-600" />
                  <span>LinkedIn</span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => {
                    setLinkedin(e.target.value);
                    if (errors.linkedin) setErrors(prev => ({ ...prev, linkedin: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    errors.linkedin ? 'border-red-500' : 'border-campus-border focus:border-campus-blue'
                  }`}
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin && <p className="text-[11px] text-red-600 mt-0.5">{errors.linkedin}</p>}
              </div>

              {/* GitHub */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <GithubIcon size={14} className="text-slate-800" />
                  <span>GitHub</span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={e => {
                    setGithub(e.target.value);
                    if (errors.github) setErrors(prev => ({ ...prev, github: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    errors.github ? 'border-red-500' : 'border-campus-border focus:border-campus-blue'
                  }`}
                  placeholder="https://github.com/username"
                />
                {errors.github && <p className="text-[11px] text-red-600 mt-0.5">{errors.github}</p>}
              </div>

              {/* Twitter / X */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <TwitterIcon size={14} className="text-sky-500" />
                  <span>Twitter / X</span>
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={e => {
                    setTwitter(e.target.value);
                    if (errors.twitter) setErrors(prev => ({ ...prev, twitter: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    errors.twitter ? 'border-red-500' : 'border-campus-border focus:border-campus-blue'
                  }`}
                  placeholder="https://x.com/username"
                />
                {errors.twitter && <p className="text-[11px] text-red-600 mt-0.5">{errors.twitter}</p>}
              </div>

              {/* LeetCode */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <LeetCodeIcon size={14} className="text-amber-500" />
                  <span>LeetCode (Optional)</span>
                </label>
                <input
                  type="url"
                  value={leetcode}
                  onChange={e => {
                    setLeetcode(e.target.value);
                    if (errors.leetcode) setErrors(prev => ({ ...prev, leetcode: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    errors.leetcode ? 'border-red-500' : 'border-campus-border focus:border-campus-blue'
                  }`}
                  placeholder="https://leetcode.com/u/username"
                />
                {errors.leetcode && <p className="text-[11px] text-red-600 mt-0.5">{errors.leetcode}</p>}
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <InstagramIcon size={14} className="text-pink-600" />
                  <span>Instagram (Optional)</span>
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={e => {
                    setInstagram(e.target.value);
                    if (errors.instagram) setErrors(prev => ({ ...prev, instagram: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    errors.instagram ? 'border-red-500' : 'border-campus-border focus:border-campus-blue'
                  }`}
                  placeholder="https://instagram.com/username"
                />
                {errors.instagram && <p className="text-[11px] text-red-600 mt-0.5">{errors.instagram}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-campus-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-campus-border text-xs font-bold text-campus-slate-text hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="campus-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-warm-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Mentor Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

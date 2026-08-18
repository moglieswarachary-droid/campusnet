import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Save, AlertCircle, CheckCircle2, User, Briefcase, GraduationCap 
} from 'lucide-react';
import { 
  LinkedinIcon, GithubIcon, TwitterIcon, LeetCodeIcon, InstagramIcon 
} from '../common/SocialIcons';
import { validateSocialUrl, sanitizeInput } from '../../utils/validation';

interface StudentProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileEditModal: React.FC<StudentProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateStudentProfile, addToast } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [skills, setSkills] = useState((currentUser.skills || []).join(', '));
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || currentUser.linkedin || '');
  const [github, setGithub] = useState(currentUser.socialLinks?.github || currentUser.github || '');
  const [twitter, setTwitter] = useState(currentUser.socialLinks?.twitter || currentUser.twitter || '');
  const [leetcode, setLeetcode] = useState(currentUser.socialLinks?.leetcode || currentUser.leetcode || '');
  const [instagram, setInstagram] = useState(currentUser.socialLinks?.instagram || currentUser.instagram || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

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

    const cleanedSkills = skills
      .split(',')
      .map(s => sanitizeInput(s.trim()))
      .filter(Boolean);

    const finalLinkedin = linkedinVal.normalizedUrl || undefined;
    const finalGithub = githubVal.normalizedUrl || undefined;
    const finalTwitter = twitterVal.normalizedUrl || undefined;
    const finalLeetcode = leetcodeVal.normalizedUrl || undefined;
    const finalInstagram = instagramVal.normalizedUrl || undefined;

    updateStudentProfile({
      name: sanitizeInput(name),
      bio: sanitizeInput(bio),
      skills: cleanedSkills,
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-warm-2xl border border-campus-border relative my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-campus-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-campus-deep-blue">Edit Student Profile & Socials</h3>
              <p className="text-xs text-campus-muted-text">Update your verified portfolio, bio & profile links</p>
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
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-2 focus:ring-campus-soft-blue outline-none"
              placeholder="e.g. Aarav Sharma"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
              About / Bio
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-2 focus:ring-campus-soft-blue outline-none"
              placeholder="Tell others about your engineering passions, projects and research interests..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-bold text-campus-deep-blue uppercase tracking-wider mb-1">
              Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-campus-border text-sm focus:border-campus-blue focus:ring-2 focus:ring-campus-soft-blue outline-none"
              placeholder="e.g. React, PyTorch, Embedded C, ROS, OpenCV"
            />
          </div>

          {/* Social Links Section */}
          <div className="pt-3 border-t border-campus-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-campus-deep-blue">
                Verified Social & Coding Links
              </h4>
              <span className="text-[11px] text-campus-muted-text">Allowlisted domains enforced</span>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <LinkedinIcon size={14} className="text-blue-600" />
                <span>LinkedIn (linkedin.com/in/...)</span>
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={e => {
                  setLinkedin(e.target.value);
                  if (errors.linkedin) setErrors(prev => ({ ...prev, linkedin: '' }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  errors.linkedin ? 'border-red-500 bg-red-50/50' : 'border-campus-border focus:border-campus-blue'
                }`}
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedin && <p className="text-[11px] text-red-600 mt-0.5">{errors.linkedin}</p>}
            </div>

            {/* GitHub */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <GithubIcon size={14} className="text-slate-800" />
                <span>GitHub (github.com/...)</span>
              </label>
              <input
                type="url"
                value={github}
                onChange={e => {
                  setGithub(e.target.value);
                  if (errors.github) setErrors(prev => ({ ...prev, github: '' }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  errors.github ? 'border-red-500 bg-red-50/50' : 'border-campus-border focus:border-campus-blue'
                }`}
                placeholder="https://github.com/username"
              />
              {errors.github && <p className="text-[11px] text-red-600 mt-0.5">{errors.github}</p>}
            </div>

            {/* Twitter / X */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <TwitterIcon size={14} className="text-sky-500" />
                <span>Twitter / X (x.com/ or twitter.com/...)</span>
              </label>
              <input
                type="url"
                value={twitter}
                onChange={e => {
                  setTwitter(e.target.value);
                  if (errors.twitter) setErrors(prev => ({ ...prev, twitter: '' }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  errors.twitter ? 'border-red-500 bg-red-50/50' : 'border-campus-border focus:border-campus-blue'
                }`}
                placeholder="https://x.com/username"
              />
              {errors.twitter && <p className="text-[11px] text-red-600 mt-0.5">{errors.twitter}</p>}
            </div>

            {/* LeetCode */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <LeetCodeIcon size={14} className="text-amber-500" />
                  <span>LeetCode (leetcode.com/u/...)</span>
                </span>
                <span className="text-[10px] text-campus-muted-text font-normal">Optional</span>
              </label>
              <input
                type="url"
                value={leetcode}
                onChange={e => {
                  setLeetcode(e.target.value);
                  if (errors.leetcode) setErrors(prev => ({ ...prev, leetcode: '' }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  errors.leetcode ? 'border-red-500 bg-red-50/50' : 'border-campus-border focus:border-campus-blue'
                }`}
                placeholder="https://leetcode.com/u/username"
              />
              {errors.leetcode && <p className="text-[11px] text-red-600 mt-0.5">{errors.leetcode}</p>}
            </div>

            {/* Instagram */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <InstagramIcon size={14} className="text-pink-600" />
                  <span>Instagram (instagram.com/...)</span>
                </span>
                <span className="text-[10px] text-campus-muted-text font-normal">Optional</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={e => {
                  setInstagram(e.target.value);
                  if (errors.instagram) setErrors(prev => ({ ...prev, instagram: '' }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  errors.instagram ? 'border-red-500 bg-red-50/50' : 'border-campus-border focus:border-campus-blue'
                }`}
                placeholder="https://instagram.com/username"
              />
              {errors.instagram && <p className="text-[11px] text-red-600 mt-0.5">{errors.instagram}</p>}
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
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Details'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

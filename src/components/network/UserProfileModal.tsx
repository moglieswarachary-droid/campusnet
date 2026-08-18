import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, GraduationCap, ShieldCheck, Sparkles, MapPin, 
  Building2, Award, BookOpen, MessageSquare, UserPlus, 
  ExternalLink, Globe, CheckCircle2, Code2, Briefcase, FileText 
} from 'lucide-react';
import { 
  LinkedinIcon, GithubIcon, TwitterIcon, LeetCodeIcon, InstagramIcon 
} from '../common/SocialIcons';
import { User, Mentor, Researcher } from '../../types';

export const UserProfileModal: React.FC = () => {
  const { 
    selectedUserProfileModal, setSelectedUserProfileModal, 
    setIsDirectMessagingOpen, setActiveMessagingPartner, 
    sendConnectionRequest 
  } = useApp();

  if (!selectedUserProfileModal) return null;

  const user = selectedUserProfileModal;
  const isMentor = 'specialization' in user && 'yearsExperience' in user;
  const isResearcher = 'scholarId' in user && 'publicationsCount' in user;
  const isStudent = !isMentor && !isResearcher;

  const mentor = isMentor ? (user as Mentor) : null;
  const researcher = isResearcher ? (user as Researcher) : null;
  const student = isStudent ? (user as User) : null;

  const socialLinks = {
    linkedin: user.socialLinks?.linkedin || (user as any).linkedin,
    github: user.socialLinks?.github || (user as any).github,
    twitter: user.socialLinks?.twitter || (user as any).twitter,
    leetcode: user.socialLinks?.leetcode || (user as any).leetcode,
    instagram: user.socialLinks?.instagram || (user as any).instagram
  };
  const vidwanUrl = (mentor && mentor.vidwan_profile_url) || (researcher && researcher.vidwan_profile_url) || (user as any).vidwan_profile_url;
  const isDemo = user.isDemoData;

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-warm-xl border border-campus-border overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header Cover */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-campus-deep-blue via-campus-blue to-slate-900 relative">
          <button
            onClick={() => setSelectedUserProfileModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-6 relative -mt-14 sm:-mt-16">
          
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-warm-lg bg-white flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-campus-deep-blue">
                    {user.name}
                  </h2>
                  
                  {isDemo ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                      Demo Data / Seed Profile
                    </span>
                  ) : null}

                  {isMentor && (
                    <span className="campus-badge-mentor text-xs py-0.5 px-2">
                      <GraduationCap className="w-3.5 h-3.5" /> Verified Faculty
                    </span>
                  )}
                  {isResearcher && (
                    <span className="campus-badge-verified text-xs py-0.5 px-2">
                      <BookOpen className="w-3.5 h-3.5" /> Verified PhD Scholar
                    </span>
                  )}
                  {student && (
                    <span className="campus-badge-verified text-xs py-0.5 px-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-campus-blue">
                  {mentor?.title || researcher?.department || student?.department}
                </p>
                <p className="text-xs text-campus-muted-text">
                  {user.institution || (researcher && researcher.university) || (student && student.institution)}
                </p>
              </div>
            </div>

            {/* Direct Connect Action */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  setActiveMessagingPartner(user as any);
                  setIsDirectMessagingOpen(true);
                  setSelectedUserProfileModal(null);
                }}
                className="campus-btn-primary py-2 px-3.5 text-xs rounded-xl flex items-center gap-1.5 shadow-warm-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
              <button
                onClick={() => {
                  sendConnectionRequest(user.id, user.name);
                }}
                className="p-2 rounded-xl border border-campus-border text-campus-slate-text hover:bg-campus-soft-blue hover:text-campus-blue transition-colors"
                title="Send Network Request"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-campus-border">
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors"
              >
                <LinkedinIcon size={14} className="text-blue-700" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            )}

            {socialLinks?.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition-colors"
              >
                <GithubIcon size={14} className="text-slate-800" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            )}

            {socialLinks?.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors"
              >
                <TwitterIcon size={14} className="text-sky-600" />
                <span>Twitter / X</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            )}

            {socialLinks?.leetcode && (
              <a
                href={socialLinks.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors"
              >
                <LeetCodeIcon size={14} className="text-amber-700" />
                <span>LeetCode</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            )}

            {socialLinks?.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 text-xs font-bold transition-colors"
              >
                <InstagramIcon size={14} className="text-pink-700" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            )}

            {/* Vidwan Profile Button */}
            {vidwanUrl && (
              <a
                href={vidwanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-warm-xs text-xs font-extrabold transition-all ml-auto"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                <span>View Vidwan Profile</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-amber-200" />
              </a>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs sm:text-sm text-campus-slate-text leading-relaxed bg-campus-warm-white p-4 rounded-2xl border border-campus-border">
              {user.bio}
            </p>
          )}

          {/* Mentor Specific Details */}
          {mentor && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                {mentor.experience && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{mentor.experience}</div>
                    <div className="text-[10px] text-campus-muted-text">Experience</div>
                  </div>
                )}
                {mentor.projectsGuided !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{mentor.projectsGuided} Teams</div>
                    <div className="text-[10px] text-campus-muted-text">Projects Guided</div>
                  </div>
                )}
                {mentor.availability && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-green-700">{mentor.availability}</div>
                    <div className="text-[10px] text-campus-muted-text">Mentoring Availability</div>
                  </div>
                )}
              </div>

              {mentor.specialization && (
                <div className="p-3.5 bg-campus-soft-blue/40 rounded-xl border border-blue-100 text-xs">
                  <span className="font-bold text-campus-deep-blue">Core Specialization: </span>
                  <span className="text-campus-slate-text">{mentor.specialization}</span>
                </div>
              )}

              {mentor.researchAreas && mentor.researchAreas.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
                    Research & Domain Focus
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.researchAreas.map((area, idx) => (
                      <span key={idx} className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PhD Researcher Details */}
          {researcher && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                  <div className="font-bold text-campus-deep-blue">{researcher.publicationsCount}</div>
                  <div className="text-[10px] text-campus-muted-text">Publications</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                  <div className="font-bold text-campus-deep-blue">{researcher.citationsCount}</div>
                  <div className="text-[10px] text-campus-muted-text">Citations</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                  <div className="font-bold text-campus-deep-blue">h-index {researcher.hIndex}</div>
                  <div className="text-[10px] text-campus-muted-text">Academic Index</div>
                </div>
              </div>

              {researcher.researchArea && (
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 text-xs">
                  <span className="font-bold text-purple-900">Doctoral Research Focus: </span>
                  <span className="text-purple-800">{researcher.researchArea}</span>
                </div>
              )}
            </div>
          )}

          {/* Student Skills */}
          {student && student.skills && student.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map(skill => (
                  <span key={skill} className="text-xs font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

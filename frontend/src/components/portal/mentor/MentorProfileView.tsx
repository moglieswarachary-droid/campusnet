import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck, Award, Users, BookOpen, Edit3, ExternalLink,
  CheckCircle2, Clock, Globe, Mail, Phone, Calendar,
  TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LetterAvatar } from '../../common/LetterAvatar';

interface MentorProfileViewProps {
  onOpenEdit: () => void;
}

export const MentorProfileView: React.FC<MentorProfileViewProps> = ({ onOpenEdit }) => {
  const { currentUser, mentors, teams, mentorshipCertificates, mentorshipRequests } = useApp();

  const currentMentor: any = mentors.find(m =>
    (currentUser?.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && m.id === currentUser.id)
  ) || {
    id: currentUser?.id || 'mnt-current',
    name: currentUser?.name || 'Faculty Mentor',
    email: currentUser?.email || '',
    designation: (currentUser as any)?.designation || 'Academic Faculty Mentor',
    department: currentUser?.department || 'Department of Engineering',
    institution: currentUser?.institution || 'CampusNet Academic Network',
    domain: 'Engineering & Innovation',
    expertise: currentUser?.skills || [],
    researchAreas: currentUser?.skills || [],
    avatar: currentUser?.avatar || '',
    bio: currentUser?.bio || 'Academic mentor empowering student innovators through project reviews and guidance.',
    verified: true,
    verifiedMentor: true,
    rating: 5.0,
    reviewsCount: 0,
    sessionsCount: 0,
    activeMenteesCount: 0,
    acceptingMentees: true,
    badges: ['Verified Mentor'],
    socialLinks: {
      linkedin: currentUser?.linkedin || '',
      github: currentUser?.github || ''
    }
  };

  // Calculate actual profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    const total = 5;
    if (currentMentor?.avatar) score++;
    if (currentMentor?.bio && currentMentor.bio.length > 20) score++;
    if (currentMentor?.expertise && currentMentor.expertise.length > 0) score++;
    if (currentMentor?.institution) score++;
    if (currentMentor?.vidwan_profile_url || currentMentor?.linkedin) score++;
    return Math.round((score / total) * 100);
  };

  const completeness = calculateCompleteness();
  const activeTeamsCount = teams.filter(t => t.mentorId === currentMentor.id || t.mentorName === currentMentor.name).length;
  const maxTeams = currentMentor.maxTeams || 5;

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Compact Faculty Identity Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Subtle accent stripe */}
        <div className="h-24 bg-gradient-to-r from-[#12243A] via-[#1A365D] to-teal-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {currentMentor.verifiedMentor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Faculty Mentor</span>
              </span>
            )}
          </div>
        </div>

        {/* Identity content */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4">
            <LetterAvatar
              name={currentMentor.name || currentUser.name}
              size="2xl"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white shadow-md bg-white shrink-0"
            />
            <div className="mb-0.5">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                {currentMentor.name || currentUser.name}
              </h1>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {currentMentor.designation || currentMentor.title || 'Associate Professor & Research Chair'}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-[#0F9488] border border-teal-200/60">
                  {currentMentor.institution || currentUser.institution || 'IIT Bombay'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {currentMentor.department || 'Computer Science & Engineering'}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                  activeTeamsCount >= maxTeams
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {activeTeamsCount >= maxTeams ? 'Capacity Full' : 'Available for Guidance'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={onOpenEdit}
              className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <Link
              to="/landing"
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
              title="View in Public CampusNet Directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Public View</span>
            </Link>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="px-6 py-3 bg-[#F3F6FA] border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#12243A]">Profile Completeness:</span>
            <span className="text-xs font-black text-[#0F9488]">{completeness}%</span>
          </div>
          <div className="flex-1 max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F9488] rounded-full transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            Complete profiles receive 3x higher student mentorship alignment
          </p>
        </div>
      </div>

      {/* Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Credentials & Capacity */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#12243A]">
              Advisory Capacity
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Mentee Teams:</span>
                <span className="font-bold text-slate-800">{activeTeamsCount} / {maxTeams} Slots</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F9488] rounded-full"
                  style={{ width: `${Math.min(100, (activeTeamsCount / maxTeams) * 100)}%` }}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Certificates Issued:</span>
                  <span className="font-bold text-[#0F9488]">{mentorshipCertificates.length} Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-bold text-slate-800">{currentMentor.yearsExperience || 12} Years Academic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validated Academic Identifiers */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#12243A]">
              Academic Identifiers
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Institutional Email</span>
                <span className="font-mono text-slate-800 font-semibold">{currentMentor.email || currentUser.email}</span>
              </div>

              {currentMentor.vidwan_profile_url ? (
                <div>
                  <span className="text-slate-400 text-[10px] block">Vidwan National ID</span>
                  <a
                    href={currentMentor.vidwan_profile_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#0F9488] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>INFLIBNET #{currentMentor.vidwan_profile_url.split('/').pop() || '99214'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : null}

              {currentMentor.linkedin ? (
                <div>
                  <span className="text-slate-400 text-[10px] block">LinkedIn Profile</span>
                  <a
                    href={currentMentor.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{currentMentor.linkedin}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Col: Biography, Expertise & Guidance Philosophy */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Research Areas & Technical Specializations
              </h3>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {((currentMentor.expertise || currentMentor.researchAreas || ['Edge AI & Robotics', 'Autonomous Systems', 'Embedded Computer Vision', 'ROS 2 Architectures']) as string[]).map((exp: string) => (
                  <span
                    key={exp}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-50 text-[#0F9488] border border-teal-200/60"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Academic Biography
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-2 bg-[#F3F6FA] p-4 rounded-2xl border border-slate-200/60">
                {currentMentor.bio || 'Senior faculty mentor supervising undergraduate capstones, hackathon innovation teams, and deep-tech incubation projects with emphasis on real-time computer vision and embedded systems.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Looking for new student teams this semester?
              </span>
              <button
                onClick={onOpenEdit}
                className="text-xs font-bold text-[#0F9488] hover:underline"
              >
                Update Mentorship Slots & Hours →
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, GraduationCap, ShieldCheck, Sparkles, MapPin, 
  Building2, Award, BookOpen, MessageSquare, UserPlus, 
  ExternalLink, Globe, CheckCircle2 
} from 'lucide-react';
import { User, Mentor, Researcher } from '../../types';

export const UserProfileModal: React.FC = () => {
  const { 
    selectedUserProfileModal, setSelectedUserProfileModal, 
    setIsDirectMessagingOpen, setActiveMessagingPartner, 
    sendConnectionRequest, projects, publications 
  } = useApp();

  if (!selectedUserProfileModal) return null;

  const user = selectedUserProfileModal;
  const isMentor = 'specialization' in user && 'yearsExperience' in user;
  const isResearcher = 'scholarId' in user && 'publicationsCount' in user;
  const isStudent = !isMentor && !isResearcher;

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-warm-xl border border-campus-border overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-campus-deep-blue via-campus-blue to-slate-900 relative">
          <button
            onClick={() => setSelectedUserProfileModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="px-6 pb-6 relative -mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-warm-lg bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-campus-deep-blue">{user.name}</h2>
                  <span className="campus-badge-verified text-[10px] py-0.5 px-2">
                    ✓ Verified on CampusNet
                  </span>
                </div>
                <p className="text-xs text-campus-blue font-bold mt-0.5">
                  {'title' in user ? user.title : 'department' in user ? user.department : 'CampusNet Member'}
                </p>
                <p className="text-xs text-campus-muted-text">
                  {'institution' in user ? user.institution : 'university' in user ? user.university : ''}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveMessagingPartner(user);
                  setSelectedUserProfileModal(null);
                  setIsDirectMessagingOpen(true);
                }}
                className="campus-btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>

              <button
                onClick={() => {
                  sendConnectionRequest(user.id);
                }}
                className="campus-btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </button>
            </div>

          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-campus-slate-text leading-relaxed bg-campus-warm-white p-4 rounded-2xl border border-campus-border">
            {user.bio}
          </p>

          {/* Specific Meta Details */}
          {isMentor && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-campus-deep-blue">{(user as Mentor).yearsExperience} Years</div>
                <div className="text-[10px] text-campus-muted-text">Experience</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-campus-deep-blue">{(user as Mentor).projectsGuided} Teams</div>
                <div className="text-[10px] text-campus-muted-text">Projects Guided</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-green-700">{(user as Mentor).availability}</div>
                <div className="text-[10px] text-campus-muted-text">Status</div>
              </div>
            </div>
          )}

          {isResearcher && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-campus-deep-blue">{(user as Researcher).publicationsCount}</div>
                <div className="text-[10px] text-campus-muted-text">Publications</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-campus-deep-blue">{(user as Researcher).citationsCount}</div>
                <div className="text-[10px] text-campus-muted-text">Citations</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-campus-border">
                <div className="font-bold text-campus-deep-blue">h-index {(user as Researcher).hIndex}</div>
                <div className="text-[10px] text-campus-muted-text">Academic Index</div>
              </div>
            </div>
          )}

          {isStudent && 'skills' in user && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {(user as User).skills.map(skill => (
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

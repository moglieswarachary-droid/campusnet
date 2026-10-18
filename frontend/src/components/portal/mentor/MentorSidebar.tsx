import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck, MessageSquare, Users, FolderKanban, Award,
  Calendar, Video, Bell, Settings, TrendingUp, BookOpen,
  ChevronRight, Sparkles, CheckCircle2, UserCheck
} from 'lucide-react';
import { LetterAvatar } from '../../common/LetterAvatar';

interface MentorSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const MentorSidebar: React.FC<MentorSidebarProps> = ({ onCloseMobile, className = '' }) => {
  const location = useLocation();
  const { currentUser, mentors, mentorshipRequests, setIsAIModalOpen } = useApp();

  const currentMentor = mentors.find(m =>
    (currentUser?.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && m.id === currentUser.id)
  ) || {
    id: currentUser?.id || 'mnt-current',
    name: currentUser?.name || 'Faculty Mentor',
    email: currentUser?.email || '',
    designation: 'Faculty Mentor',
    department: currentUser?.department || 'Engineering',
    institution: currentUser?.institution || 'Academic Network',
    avatar: currentUser?.avatar || '',
    verifiedMentor: true
  };
  const pendingRequestsCount = mentorshipRequests.filter(r =>
    r.status === 'pending' && (r.mentorId === currentMentor.id || (currentMentor.email && (r as any).mentorEmail?.toLowerCase() === currentMentor.email.toLowerCase()))
  ).length;

  const navigationGroups = [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          path: '/mentor/dashboard',
          icon: ShieldCheck,
          badge: null
        }
      ]
    },
    {
      title: 'MENTORING',
      items: [
        {
          label: 'Student Requests',
          path: '/mentor/requests',
          icon: MessageSquare,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
          badgeType: 'attention'
        },
        {
          label: 'My Mentees',
          path: '/mentor/students',
          icon: Users,
          badge: null
        },
        {
          label: 'Guided Teams',
          path: '/mentor/teams',
          icon: UserCheck,
          badge: null
        },
        {
          label: 'Projects',
          path: '/mentor/projects',
          icon: FolderKanban,
          badge: null
        },
        {
          label: 'Milestone Reviews',
          path: '/mentor/reviews',
          icon: Award,
          badge: null
        },
        {
          label: 'Sessions & Calendar',
          path: '/mentor/sessions',
          icon: Calendar,
          badge: null
        },
        {
          label: 'Messages',
          path: '/mentor/messages',
          icon: MessageSquare,
          badge: null
        }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          label: 'Certificates',
          path: '/mentor/certificates',
          icon: Award,
          badge: 'Verified'
        },
        {
          label: 'Mentoring Analytics',
          path: '/mentor/analytics',
          icon: TrendingUp,
          badge: null
        },
        {
          label: 'Public Mentor Profile',
          path: '/mentor/profile',
          icon: BookOpen,
          badge: null
        },
        {
          label: 'Notifications',
          path: '/mentor/notifications',
          icon: Bell,
          badge: null
        },
        {
          label: 'Settings',
          path: '/mentor/settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none overflow-hidden ${className}`}
    >
      {/* Scrollable Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {group.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path === '/mentor/dashboard' && (location.pathname === '/mentor' || location.pathname === '/mentor/'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-teal-50/90 text-[#0F9488] font-bold shadow-2xs border border-teal-200/60'
                        : 'text-slate-600 hover:text-[#12243A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#0F9488]' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md shrink-0 ml-1.5 ${
                          (item as any).badgeType === 'attention'
                            ? 'bg-[#F3A640] text-slate-900'
                            : isActive
                              ? 'bg-teal-200/80 text-teal-950'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* AI Mentor Assistant Callout */}
        <div className="pt-2 px-1">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#12243A] via-[#1A365D] to-teal-950 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F3A640]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200">
                  AI Mentor Copilot
                </span>
              </div>
              <p className="text-[11px] text-teal-100/90 leading-snug">
                Summarize milestone deliverables, draft constructive feedback, or prepare meeting agendas.
              </p>
              <button
                onClick={() => {
                  setIsAIModalOpen(true);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full mt-1 px-3 py-1.5 bg-white text-[#12243A] hover:bg-teal-50 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Launch Assistant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Persistent Mentor Identity Pill at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-[#F3F6FA]">
        <NavLink
          to="/mentor/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white transition-colors group"
        >
          <div className="relative shrink-0">
            <LetterAvatar
              name={currentMentor?.name || currentUser?.name || 'Mentor'}
              size="sm"
              className="w-8 h-8 rounded-lg ring-1 ring-slate-200"
            />
            {currentMentor?.verifiedMentor && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-600 rounded-full ring-2 ring-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#12243A] truncate group-hover:text-[#0F9488] transition-colors">
              {currentMentor?.name || currentUser?.name || 'Faculty Mentor'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentMentor?.institution || currentUser?.institution || 'IIT Bombay'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

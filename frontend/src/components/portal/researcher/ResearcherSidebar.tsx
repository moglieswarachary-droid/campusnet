import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen, FileText, Compass, Users, Sparkles,
  Globe2, Building2, Coins, CheckSquare, MessageSquare,
  TrendingUp, User, Bell, Settings, ChevronRight,
  ShieldCheck, CheckCircle2, BookmarkCheck, Atom
} from 'lucide-react';
import { LetterAvatar } from '../../common/LetterAvatar';

interface ResearcherSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const ResearcherSidebar: React.FC<ResearcherSidebarProps> = ({ onCloseMobile, className = '' }) => {
  const location = useLocation();
  const { currentUser, researchers, setIsAIModalOpen } = useApp();

  const currentScholar = researchers.find(r =>
    (currentUser?.email && r.email === currentUser.email) ||
    (currentUser?.name && r.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''))
  ) || researchers[0];

  const navigationGroups = [
    {
      title: 'RESEARCH',
      items: [
        {
          label: 'Overview',
          path: '/researcher/dashboard',
          icon: BookOpen,
          badge: null
        },
        {
          label: 'Publications & Datasets',
          path: '/researcher/publications',
          icon: FileText,
          badge: `${currentScholar.publicationsCount || 6}`,
          badgeType: 'count'
        },
        {
          label: 'Research Projects',
          path: '/researcher/projects',
          icon: Compass,
          badge: 'Active'
        },
        {
          label: 'Collaborations',
          path: '/researcher/collaborations',
          icon: Users,
          badge: '2 New',
          badgeType: 'attention'
        },
        {
          label: 'Conferences & Calls',
          path: '/researcher/opportunities',
          icon: Sparkles,
          badge: null
        }
      ]
    },
    {
      title: 'DISCOVERY',
      items: [
        {
          label: 'Researcher Directory',
          path: '/researcher/directory',
          icon: Globe2,
          badge: null
        },
        {
          label: 'Labs & Institutions',
          path: '/researcher/institutions',
          icon: Building2,
          badge: null
        },
        {
          label: 'Funding & Grants',
          path: '/researcher/funding',
          icon: Coins,
          badge: null
        }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          label: 'Tasks & Milestones',
          path: '/researcher/milestones',
          icon: CheckSquare,
          badge: '3 Due',
          badgeType: 'attention'
        },
        {
          label: 'Messages',
          path: '/researcher/messages',
          icon: MessageSquare,
          badge: null
        },
        {
          label: 'Research Analytics',
          path: '/researcher/analytics',
          icon: TrendingUp,
          badge: null
        },
        {
          label: 'Scholarly Profile',
          path: '/researcher/profile',
          icon: User,
          badge: null
        },
        {
          label: 'Notifications',
          path: '/researcher/notifications',
          icon: Bell,
          badge: null
        },
        {
          label: 'Settings',
          path: '/researcher/settings',
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
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {group.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/researcher/dashboard' &&
                    (location.pathname === '/researcher' || location.pathname === '/researcher/'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-purple-50 text-[#6954C8] font-bold shadow-2xs border border-purple-200/70'
                        : 'text-slate-600 hover:text-[#182442] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#6954C8]' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md shrink-0 ml-1.5 ${
                          (item as any).badgeType === 'attention'
                            ? 'bg-[#E9A23B] text-slate-900'
                            : isActive
                              ? 'bg-purple-200/80 text-purple-950'
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

        {/* AI Research Copilot Callout */}
        <div className="pt-2 px-1">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#182442] via-[#241C4F] to-[#6954C8] text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-[#E9A23B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                  AI Research Copilot
                </span>
              </div>
              <p className="text-[11px] text-purple-100/90 leading-snug">
                Summarize literature pre-prints, draft conference abstracts, or organize research citations.
              </p>
              <button
                onClick={() => {
                  setIsAIModalOpen(true);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full mt-1 px-3 py-1.5 bg-white text-[#182442] hover:bg-purple-50 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Launch Copilot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Persistent Scholar Identity Pill at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-[#F4F6FA]">
        <NavLink
          to="/researcher/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white transition-colors group"
        >
          <div className="relative shrink-0">
            <LetterAvatar
              name={currentScholar?.name || currentUser?.name || 'Scholar'}
              size="sm"
              className="w-8 h-8 rounded-lg ring-1 ring-slate-200"
            />
            {currentScholar?.verifiedResearcher && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#13877B] rounded-full ring-2 ring-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#182442] truncate group-hover:text-[#6954C8] transition-colors">
              {currentScholar?.name || currentUser?.name || 'PhD Scholar'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentScholar?.university || currentScholar?.institution || 'IISc Bengaluru'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

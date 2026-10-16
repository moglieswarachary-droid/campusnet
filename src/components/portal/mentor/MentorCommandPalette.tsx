import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Search, X, ShieldCheck, Users, FolderKanban, Award,
  Calendar, Video, MessageSquare, Bell, Settings, ArrowRight,
  Plus, Edit3, CheckCircle2, TrendingUp, Sparkles, BookOpen
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Guided Teams' | 'Requests' | 'Quick Actions';
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const MentorCommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenEditProfile,
}) => {
  const navigate = useNavigate();
  const { teams, projects, mentorshipRequests, setIsAIModalOpen, startVideoMeeting } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const baseItems: CommandItem[] = [
    // Navigation items
    {
      id: 'nav-dashboard',
      title: 'Mentor Command Center',
      subtitle: 'Overview, action priorities and guided projects',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => { navigate('/mentor/dashboard'); onClose(); }
    },
    {
      id: 'nav-requests',
      title: 'Student Guidance Requests',
      subtitle: 'Incoming mentorship pitches and team applications',
      category: 'Navigation',
      icon: MessageSquare,
      badge: `${mentorshipRequests.filter(r => r.status === 'pending').length} Pending`,
      action: () => { navigate('/mentor/requests'); onClose(); }
    },
    {
      id: 'nav-students',
      title: 'My Mentees & Students',
      subtitle: 'Active collegiate innovation students under supervision',
      category: 'Navigation',
      icon: Users,
      action: () => { navigate('/mentor/students'); onClose(); }
    },
    {
      id: 'nav-teams',
      title: 'Guided Teams',
      subtitle: 'Collaborative team workspaces and milestones',
      category: 'Navigation',
      icon: Users,
      action: () => { navigate('/mentor/teams'); onClose(); }
    },
    {
      id: 'nav-projects',
      title: 'Guided Projects',
      subtitle: 'Track student deliverables and repo architectures',
      category: 'Navigation',
      icon: FolderKanban,
      action: () => { navigate('/mentor/projects'); onClose(); }
    },
    {
      id: 'nav-reviews',
      title: 'Milestone Reviews & Rubrics',
      subtitle: 'Evaluate deliverables, approve sprints, request revisions',
      category: 'Navigation',
      icon: Award,
      action: () => { navigate('/mentor/reviews'); onClose(); }
    },
    {
      id: 'nav-sessions',
      title: 'Sessions & Office Hours',
      subtitle: 'Calendar, weekly consultation slots, live meeting links',
      category: 'Navigation',
      icon: Calendar,
      action: () => { navigate('/mentor/sessions'); onClose(); }
    },
    {
      id: 'nav-messages',
      title: 'Mentor Messages & Threads',
      subtitle: 'Direct discussions with student leads and co-mentors',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => { navigate('/mentor/messages'); onClose(); }
    },
    {
      id: 'nav-certificates',
      title: 'Mentorship Certificates',
      subtitle: 'Issue and verify official completion credentials',
      category: 'Navigation',
      icon: Award,
      action: () => { navigate('/mentor/certificates'); onClose(); }
    },
    {
      id: 'nav-analytics',
      title: 'Mentoring Analytics',
      subtitle: 'Milestone velocity, engagement metrics, advisory hours',
      category: 'Navigation',
      icon: TrendingUp,
      action: () => { navigate('/mentor/analytics'); onClose(); }
    },
    {
      id: 'nav-profile',
      title: 'Faculty Public Profile',
      subtitle: 'Academic credentials, Vidwan ID, and specializations',
      category: 'Navigation',
      icon: BookOpen,
      action: () => { navigate('/mentor/profile'); onClose(); }
    },
    {
      id: 'nav-notifications',
      title: 'Notifications & Alerts',
      subtitle: 'Milestone submissions and student alerts',
      category: 'Navigation',
      icon: Bell,
      action: () => { navigate('/mentor/notifications'); onClose(); }
    },
    {
      id: 'nav-settings',
      title: 'Capacity & Domain Settings',
      subtitle: 'Student intake limits, email preferences, availability',
      category: 'Navigation',
      icon: Settings,
      action: () => { navigate('/mentor/settings'); onClose(); }
    },

    // Quick Actions
    {
      id: 'act-ai-copilot',
      title: 'AI Mentor Copilot',
      subtitle: 'Summarize team blockers, draft feedback, prepare agendas',
      category: 'Quick Actions',
      icon: Sparkles,
      badge: 'AI Powered',
      action: () => { setIsAIModalOpen(true); onClose(); }
    },
    {
      id: 'act-video-meeting',
      title: 'Launch Office Hours Video Room',
      subtitle: 'Encrypted multi-member consultation room',
      category: 'Quick Actions',
      icon: Video,
      action: () => {
        if (teams.length > 0) {
          startVideoMeeting(teams[0].id);
        } else {
          navigate('/mentor/sessions');
        }
        onClose();
      }
    },
    {
      id: 'act-edit-profile',
      title: 'Edit Faculty Profile',
      subtitle: 'Update bio, Vidwan link, research domains, intake slots',
      category: 'Quick Actions',
      icon: Edit3,
      action: () => { onOpenEditProfile(); onClose(); }
    }
  ];

  // Dynamic items from guided teams
  const teamItems: CommandItem[] = teams.slice(0, 3).map(t => ({
    id: `team-${t.id}`,
    title: t.name,
    subtitle: `${t.projectName} • ${t.domain}`,
    category: 'Guided Teams',
    icon: Users,
    action: () => { navigate('/mentor/teams'); onClose(); }
  }));

  // Dynamic items from requests
  const requestItems: CommandItem[] = mentorshipRequests.slice(0, 3).map(r => ({
    id: `req-${r.id}`,
    title: `${r.teamName}: ${r.projectTitle}`,
    subtitle: `Requested by ${r.requestedBy} • ${r.status.toUpperCase()}`,
    category: 'Requests',
    icon: MessageSquare,
    badge: r.status,
    action: () => { navigate('/mentor/requests'); onClose(); }
  }));

  const allItems = [...baseItems, ...teamItems, ...requestItems];

  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#12243A]/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-[#F3F6FA]">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a mentor command, search teams, requests, or reviews..."
            className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md ml-2 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700">No matching mentor resources found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Requests", "Reviews", "Teams", or "Sessions"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-teal-50 text-[#12243A] border border-teal-200/60'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0F9488] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate text-slate-800">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-[#0F9488] translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F3F6FA] border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-slate-400 font-medium">CampusNet Mentor Search</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Search, X, GraduationCap, BookOpen, Megaphone, FolderKanban,
  Users, Compass, Calendar, Sparkles, Award, CheckCircle2,
  QrCode, MessageSquare, Bell, Settings, ArrowRight, Video,
  Plus, Edit3, ExternalLink
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Projects' | 'Events' | 'Mentors' | 'Quick Actions';
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  badge?: string;
}

export const StudentCommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenEditProfile,
}) => {
  const navigate = useNavigate();
  const { projects, events, mentors, setIsAIModalOpen, startVideoMeeting, teams } = useApp();
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

  // Build searchable items
  const baseItems: CommandItem[] = [
    // Navigation items
    {
      id: 'nav-overview',
      title: 'Dashboard Overview',
      subtitle: 'Main student command center & priorities',
      category: 'Navigation',
      icon: GraduationCap,
      action: () => { navigate('/student/dashboard'); onClose(); }
    },
    {
      id: 'nav-academics',
      title: 'Academics & Timetable',
      subtitle: 'Class schedule, attendance, grades and exams',
      category: 'Navigation',
      icon: BookOpen,
      action: () => { navigate('/student/academics'); onClose(); }
    },
    {
      id: 'nav-announcements',
      title: 'Campus Announcements',
      subtitle: 'Official circulars, exam cell notices, event alerts',
      category: 'Navigation',
      icon: Megaphone,
      action: () => { navigate('/student/announcements'); onClose(); }
    },
    {
      id: 'nav-projects',
      title: 'Explore Projects',
      subtitle: 'Student innovations, open repos and research',
      category: 'Navigation',
      icon: FolderKanban,
      action: () => { navigate('/student/projects'); onClose(); }
    },
    {
      id: 'nav-teams',
      title: 'Team Workspaces',
      subtitle: 'Collaborative projects, sprints, milestones',
      category: 'Navigation',
      icon: Users,
      action: () => { navigate('/student/teams'); onClose(); }
    },
    {
      id: 'nav-mentorship',
      title: 'Mentorship Network',
      subtitle: 'Connect with verified faculty and industry guides',
      category: 'Navigation',
      icon: Compass,
      action: () => { navigate('/student/mentorship'); onClose(); }
    },
    {
      id: 'nav-events',
      title: 'Campus Events & Hackathons',
      subtitle: 'National techfests, hackathons and workshops',
      category: 'Navigation',
      icon: Calendar,
      action: () => { navigate('/student/events'); onClose(); }
    },
    {
      id: 'nav-opportunities',
      title: 'Opportunities & Internships',
      subtitle: 'Research fellowships, industry hiring and internships',
      category: 'Navigation',
      icon: Sparkles,
      action: () => { navigate('/student/opportunities'); onClose(); }
    },
    {
      id: 'nav-portfolio',
      title: 'Digital Portfolio',
      subtitle: 'Verifiable student achievements and bonafide credentials',
      category: 'Navigation',
      icon: Award,
      action: () => { navigate('/student/portfolio'); onClose(); }
    },
    {
      id: 'nav-skills',
      title: 'Skills & Achievements',
      subtitle: 'Competencies, innovation score and verified badges',
      category: 'Navigation',
      icon: CheckCircle2,
      action: () => { navigate('/student/skills'); onClose(); }
    },
    {
      id: 'nav-certificates',
      title: 'Verifiable Certificates',
      subtitle: 'Cryptographic credentials & QR verification',
      category: 'Navigation',
      icon: QrCode,
      action: () => { navigate('/student/certificates'); onClose(); }
    },
    {
      id: 'nav-messages',
      title: 'Messages & Team Chat',
      subtitle: 'Peer discussions and mentor guidance threads',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => { navigate('/student/messages'); onClose(); }
    },
    {
      id: 'nav-notifications',
      title: 'Notifications & Alerts',
      subtitle: 'Deadlines, judging invites, mentor responses',
      category: 'Navigation',
      icon: Bell,
      action: () => { navigate('/student/notifications'); onClose(); }
    },
    {
      id: 'nav-settings',
      title: 'Settings & Privacy',
      subtitle: 'Notification channels and profile visibility',
      category: 'Navigation',
      icon: Settings,
      action: () => { navigate('/student/settings'); onClose(); }
    },

    // Quick Actions
    {
      id: 'act-ai-copilot',
      title: 'Ask CampusNet AI Copilot',
      subtitle: 'Draft project abstracts, find teammates, plan study sprints',
      category: 'Quick Actions',
      icon: Sparkles,
      badge: 'AI Powered',
      action: () => { setIsAIModalOpen(true); onClose(); }
    },
    {
      id: 'act-edit-profile',
      title: 'Edit Student Profile',
      subtitle: 'Update bio, technical skills, socials and roll number',
      category: 'Quick Actions',
      icon: Edit3,
      action: () => { onOpenEditProfile(); onClose(); }
    },
    {
      id: 'act-video-meeting',
      title: 'Launch Team Video Conference',
      subtitle: 'Instant encrypted room for team milestone review',
      category: 'Quick Actions',
      icon: Video,
      action: () => {
        if (teams.length > 0) {
          startVideoMeeting(teams[0].id);
        } else {
          navigate('/student/teams');
        }
        onClose();
      }
    },
    {
      id: 'act-create-project',
      title: 'Create New Project',
      subtitle: 'Publish student innovation or start an open collaborative repo',
      category: 'Quick Actions',
      icon: Plus,
      action: () => { navigate('/student/projects'); onClose(); }
    }
  ];

  // Dynamic items from projects
  const projectItems: CommandItem[] = projects.slice(0, 4).map(p => ({
    id: `proj-${p.id}`,
    title: p.title,
    subtitle: `${p.domain} • ${p.progressPercent}% Completed`,
    category: 'Projects',
    icon: FolderKanban,
    action: () => { navigate('/student/projects'); onClose(); }
  }));

  // Dynamic items from events
  const eventItems: CommandItem[] = events.slice(0, 3).map(e => ({
    id: `event-${e.id}`,
    title: e.title,
    subtitle: `${e.category} • ${e.mode} • ${e.date}`,
    category: 'Events',
    icon: Calendar,
    action: () => { navigate('/student/events'); onClose(); }
  }));

  // Dynamic items from mentors
  const mentorItems: CommandItem[] = mentors.slice(0, 3).map(m => ({
    id: `mentor-${m.id}`,
    title: m.name,
    subtitle: `${m.designation} • ${m.department} • ${m.institution}`,
    category: 'Mentors',
    icon: Compass,
    action: () => { navigate('/student/mentorship'); onClose(); }
  }));

  const allItems = [...baseItems, ...projectItems, ...eventItems, ...mentorItems];

  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Handle keyboard navigation
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
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search routes, projects, events, or mentors..."
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
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md ml-2 shrink-0">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700">No matching commands or resources found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Academics", "Projects", "Hackathon", or "AI"</p>
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
                      ? 'bg-blue-50/80 text-campus-deep-blue border border-blue-200/60'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-campus-blue text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate text-slate-800">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700">
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
                      isSelected ? 'text-campus-blue translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
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
          <span className="text-slate-400 font-medium">CampusNet+ Fast Search</span>
        </div>
      </div>
    </div>
  );
};

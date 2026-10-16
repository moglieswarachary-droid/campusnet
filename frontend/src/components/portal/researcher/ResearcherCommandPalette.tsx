import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Search, X, BookOpen, FileText, Compass, Users, Sparkles,
  Globe2, Building2, Coins, CheckSquare, MessageSquare,
  TrendingUp, User, Bell, Settings, ArrowRight, Plus,
  Atom, ExternalLink
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Publications' | 'Projects' | 'Quick Actions';
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const ResearcherCommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenEditProfile
}) => {
  const navigate = useNavigate();
  const { publications, projects, setIsAIModalOpen, addToast } = useApp();
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
    // Navigation
    {
      id: 'nav-overview',
      title: 'Research Command Center',
      subtitle: 'Overview, grant deadlines and active projects',
      category: 'Navigation',
      icon: BookOpen,
      action: () => { navigate('/researcher/dashboard'); onClose(); }
    },
    {
      id: 'nav-publications',
      title: 'Publications & Datasets',
      subtitle: 'Peer-reviewed papers, open pre-prints and repositories',
      category: 'Navigation',
      icon: FileText,
      action: () => { navigate('/researcher/publications'); onClose(); }
    },
    {
      id: 'nav-projects',
      title: 'Research Projects',
      subtitle: 'Funded laboratory projects and experimental milestones',
      category: 'Navigation',
      icon: Compass,
      action: () => { navigate('/researcher/projects'); onClose(); }
    },
    {
      id: 'nav-collaborations',
      title: 'Academic Collaborations',
      subtitle: 'Joint papers, co-authors and undergraduate RAs',
      category: 'Navigation',
      icon: Users,
      action: () => { navigate('/researcher/collaborations'); onClose(); }
    },
    {
      id: 'nav-opportunities',
      title: 'Conferences & Calls for Papers',
      subtitle: 'Upcoming submission deadlines and symposia',
      category: 'Navigation',
      icon: Sparkles,
      action: () => { navigate('/researcher/opportunities'); onClose(); }
    },
    {
      id: 'nav-directory',
      title: 'Global Researcher Directory',
      subtitle: 'Discover scholars, doctoral fellows and lab chairs',
      category: 'Navigation',
      icon: Globe2,
      action: () => { navigate('/researcher/directory'); onClose(); }
    },
    {
      id: 'nav-institutions',
      title: 'Labs & Research Institutions',
      subtitle: 'High performance computing facilities and partner labs',
      category: 'Navigation',
      icon: Building2,
      action: () => { navigate('/researcher/institutions'); onClose(); }
    },
    {
      id: 'nav-funding',
      title: 'Funding & Grants',
      subtitle: 'DST, SERB, EU Horizon and international fellowships',
      category: 'Navigation',
      icon: Coins,
      action: () => { navigate('/researcher/funding'); onClose(); }
    },
    {
      id: 'nav-milestones',
      title: 'Tasks & Milestones',
      subtitle: 'Thesis deliverables and experiment timelines',
      category: 'Navigation',
      icon: CheckSquare,
      action: () => { navigate('/researcher/milestones'); onClose(); }
    },
    {
      id: 'nav-messages',
      title: 'Direct Messages & Directives',
      subtitle: 'Collaborator communications and discussions',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => { navigate('/researcher/messages'); onClose(); }
    },
    {
      id: 'nav-analytics',
      title: 'Research Analytics',
      subtitle: 'Citation growth, publication impact and milestone SLAs',
      category: 'Navigation',
      icon: TrendingUp,
      action: () => { navigate('/researcher/analytics'); onClose(); }
    },
    {
      id: 'nav-profile',
      title: 'Scholarly Profile',
      subtitle: 'ORCID iD, thesis abstract and affiliations',
      category: 'Navigation',
      icon: User,
      action: () => { navigate('/researcher/profile'); onClose(); }
    },
    {
      id: 'nav-settings',
      title: 'Research Settings',
      subtitle: 'Open-access licensing and citation alerts',
      category: 'Navigation',
      icon: Settings,
      action: () => { navigate('/researcher/settings'); onClose(); }
    },

    // Quick Actions
    {
      id: 'action-copilot',
      title: 'Launch AI Research Copilot',
      subtitle: 'Summarize literature papers, extract methodologies, draft abstracts',
      category: 'Quick Actions',
      icon: Atom,
      action: () => {
        onClose();
        setIsAIModalOpen(true);
      },
      badge: 'AI'
    },
    {
      id: 'action-add-pub',
      title: 'Upload Manuscript Pre-Print',
      subtitle: 'Register new paper with DOI, abstract and open dataset link',
      category: 'Quick Actions',
      icon: Plus,
      action: () => {
        navigate('/researcher/publications');
        onClose();
      }
    },
    {
      id: 'action-edit-profile',
      title: 'Edit Scholar Profile & ORCID',
      subtitle: 'Update thesis abstract, research areas and Vidwan ID',
      category: 'Quick Actions',
      icon: User,
      action: () => {
        onClose();
        onOpenEditProfile();
      }
    }
  ];

  // Dynamic Publications
  const publicationItems: CommandItem[] = publications.map(pub => ({
    id: `pub-${pub.id}`,
    title: pub.title,
    subtitle: `${pub.journal} (${pub.year}) • DOI: ${pub.doi}`,
    category: 'Publications',
    icon: FileText,
    action: () => {
      navigate('/researcher/publications');
      onClose();
    },
    badge: `${pub.citations} Citations`
  }));

  const allItems = [...baseItems, ...publicationItems];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 10)
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
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 p-4 z-50 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-[#F4F6FA]/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a research route, paper title, or quick action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-[#182442] font-semibold focus:outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;

            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-purple-50 text-[#6954C8] shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-purple-100 text-[#6954C8]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#182442] truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                    {item.category}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#6954C8]' : 'text-slate-300'}`} />
                </div>
              </button>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No matching research resources found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching for papers, conferences, or AI actions.</p>
            </div>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-[#F4F6FA] border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-semibold text-purple-700">CampusNet Global Research Hub</span>
        </div>
      </div>
    </div>
  );
};

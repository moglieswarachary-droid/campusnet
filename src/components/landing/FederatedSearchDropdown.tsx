import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Calendar, ShieldCheck, GraduationCap, 
  BookOpen, FolderKanban, Building2, ArrowRight, 
  X, Sparkles, SlidersHorizontal, ChevronDown 
} from 'lucide-react';
import { EventItem, User, Mentor, Researcher, Project, InstitutionInfo } from '../../types';

export type SearchCategoryFilter = 'all' | 'projects' | 'mentors' | 'events' | 'colleges';

interface GroupedResults {
  events: EventItem[];
  mentors: Mentor[];
  students: User[];
  scholars: Researcher[];
  projects: Project[];
  institutions: InstitutionInfo[];
}

export const FederatedSearchDropdown: React.FC = () => {
  const { 
    events, mentors, students, researchers, projects, institutions, 
    setActiveTab, setSelectedEventModal, setSelectedUserProfileModal, 
    setSelectedProjectId 
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategoryFilter>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results: GroupedResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { events: [], mentors: [], students: [], scholars: [], projects: [], institutions: [] };
    }

    const matchedEvents = (selectedCategory === 'all' || selectedCategory === 'events')
      ? events
          .filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live' || e.status === 'completed')
          .filter(e => 
            e.title.toLowerCase().includes(q) || 
            e.organizer.toLowerCase().includes(q) ||
            (e.city && e.city.toLowerCase().includes(q)) ||
            (e.tracks && e.tracks.some(t => t.toLowerCase().includes(q)))
          ).slice(0, 3)
      : [];

    const matchedMentors = (selectedCategory === 'all' || selectedCategory === 'mentors')
      ? mentors.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.specialization.toLowerCase().includes(q) ||
          m.institution.toLowerCase().includes(q) ||
          (m.researchAreas && m.researchAreas.some(r => r.toLowerCase().includes(q)))
        ).slice(0, 3)
      : [];

    const matchedStudents = (selectedCategory === 'all')
      ? students.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.institution.toLowerCase().includes(q) ||
          (s.skills && s.skills.some(sk => sk.toLowerCase().includes(q))) ||
          (s.department && s.department.toLowerCase().includes(q))
        ).slice(0, 3)
      : [];

    const matchedScholars = (selectedCategory === 'all' || selectedCategory === 'mentors')
      ? researchers.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.researchArea.toLowerCase().includes(q) ||
          r.university.toLowerCase().includes(q) ||
          (r.specialization && r.specialization.toLowerCase().includes(q))
        ).slice(0, 3)
      : [];

    const matchedProjects = (selectedCategory === 'all' || selectedCategory === 'projects')
      ? projects.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q))) ||
          p.institution.toLowerCase().includes(q)
        ).slice(0, 3)
      : [];

    const matchedInstitutions = (selectedCategory === 'all' || selectedCategory === 'colleges')
      ? institutions.filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.shortName.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q)
        ).slice(0, 3)
      : [];

    return {
      events: matchedEvents,
      mentors: matchedMentors,
      students: matchedStudents,
      scholars: matchedScholars,
      projects: matchedProjects,
      institutions: matchedInstitutions
    };
  }, [query, selectedCategory, events, mentors, students, researchers, projects, institutions]);

  const totalResultsCount = 
    results.events.length + 
    results.mentors.length + 
    results.students.length + 
    results.scholars.length + 
    results.projects.length + 
    results.institutions.length;

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    const list: { type: string; data: any; label: string; sub: string; action: () => void }[] = [];
    
    results.events.forEach(e => list.push({
      type: 'Event',
      data: e,
      label: e.title,
      sub: `${e.organizer} • ${e.city}, ${e.state}`,
      action: () => { setSelectedEventModal(e); setIsOpen(false); }
    }));

    results.mentors.forEach(m => list.push({
      type: 'Mentor',
      data: m,
      label: m.name,
      sub: `${m.title} • ${m.institution}`,
      action: () => { setSelectedUserProfileModal(m); setIsOpen(false); }
    }));

    results.projects.forEach(p => list.push({
      type: 'Project',
      data: p,
      label: p.title,
      sub: `${p.domain} • ${p.institution}`,
      action: () => { setSelectedProjectId(p.id); setActiveTab('projects'); setIsOpen(false); }
    }));

    results.scholars.forEach(sc => list.push({
      type: 'PhD Scholar',
      data: sc,
      label: sc.name,
      sub: `${sc.researchArea} • ${sc.university}`,
      action: () => { setSelectedUserProfileModal(sc); setIsOpen(false); }
    }));

    results.students.forEach(s => list.push({
      type: 'Student',
      data: s,
      label: s.name,
      sub: `${s.department} • ${s.institution}`,
      action: () => { setSelectedUserProfileModal(s); setIsOpen(false); }
    }));

    results.institutions.forEach(inst => list.push({
      type: 'College',
      data: inst,
      label: inst.name,
      sub: `${inst.type} • ${inst.city}, ${inst.state}`,
      action: () => { setActiveTab('discover'); setIsOpen(false); }
    }));

    return list;
  }, [results, setSelectedEventModal, setSelectedUserProfileModal, setSelectedProjectId, setActiveTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
        flatItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFilterDropdownOpen(false);
    }
  };

  const filterLabels: Record<SearchCategoryFilter, string> = {
    all: 'All Categories',
    projects: 'Projects',
    mentors: 'Mentors',
    events: 'Events',
    colleges: 'Colleges'
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-100 transition-all p-1.5 sm:p-2">
        <div className="pl-3 text-slate-400 flex items-center justify-center">
          <Search className="w-5 h-5 text-slate-400 stroke-[2.2]" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects, mentors, events, colleges..."
          className="w-full pl-3 pr-2 py-2 sm:py-2.5 text-sm sm:text-base bg-transparent outline-none text-slate-900 font-normal placeholder:text-slate-400"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-1 mr-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Compact Filter Control */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsFilterDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Filter by category"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline capitalize">{selectedCategory === 'all' ? 'Filter' : selectedCategory}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 text-xs font-medium animate-in fade-in slide-in-from-top-1">
              {(['all', 'projects', 'mentors', 'events', 'colleges'] as SearchCategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsFilterDropdownOpen(false);
                    if (query) setIsOpen(true);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{filterLabels[cat]}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Federated Results Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 sm:p-4 max-h-[65vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {totalResultsCount === 0 ? (
            <div className="py-7 text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center border border-slate-100">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">No matches found for "{query}"</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Try searching for a project domain (e.g. "AI"), faculty name, or collegiate event.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              
              <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100 text-xs text-slate-400 font-medium">
                <span>Results for "{query}" ({totalResultsCount})</span>
                <span className="text-[11px] hidden sm:inline">Use ↑↓ keys to navigate</span>
              </div>

              {/* 1. Events Section */}
              {results.events.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 px-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Academic Events ({results.events.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {results.events.map(event => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSelectedEventModal(event);
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                            {event.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {event.organizer} • {event.city}, {event.state} • <span className="font-medium text-emerald-600">{event.mode}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Mentors Section */}
              {results.mentors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 px-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Faculty Mentors ({results.mentors.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {results.mentors.map(mentor => (
                      <div
                        key={mentor.id}
                        onClick={() => {
                          setSelectedUserProfileModal(mentor);
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-amber-700 truncate">
                              {mentor.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {mentor.specialization} • {mentor.institution}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Projects Section */}
              {results.projects.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 px-1">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Student Projects ({results.projects.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {results.projects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setActiveTab('projects');
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                            {proj.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {proj.domain} • {proj.institution} • <span className="font-medium text-slate-700">{proj.status}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PhD Scholars */}
              {results.scholars.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-600 px-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Researchers ({results.scholars.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {results.scholars.map(scholar => (
                      <div
                        key={scholar.id}
                        onClick={() => {
                          setSelectedUserProfileModal(scholar);
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <img
                            src={scholar.avatar}
                            alt={scholar.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-purple-600 truncate">
                              {scholar.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              {scholar.researchArea} • {scholar.university}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Colleges */}
              {results.institutions.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 px-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Colleges ({results.institutions.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {results.institutions.map(inst => (
                      <div
                        key={inst.id}
                        onClick={() => {
                          setActiveTab('discover');
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                            {inst.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {inst.type} • {inst.city}, {inst.state}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};

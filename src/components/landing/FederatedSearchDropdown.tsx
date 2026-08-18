import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Calendar, ShieldCheck, GraduationCap, 
  BookOpen, FolderKanban, Building2, ArrowRight, 
  X, Sparkles, MapPin, CheckCircle2 
} from 'lucide-react';
import { EventItem, User, Mentor, Researcher, Project, InstitutionInfo } from '../../types';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
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

    const matchedEvents = events
      .filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live' || e.status === 'completed')
      .filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.organizer.toLowerCase().includes(q) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.tracks && e.tracks.some(t => t.toLowerCase().includes(q)))
      ).slice(0, 3);

    const matchedMentors = mentors.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q) ||
      m.institution.toLowerCase().includes(q) ||
      (m.researchAreas && m.researchAreas.some(r => r.toLowerCase().includes(q)))
    ).slice(0, 3);

    const matchedStudents = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.institution.toLowerCase().includes(q) ||
      (s.skills && s.skills.some(sk => sk.toLowerCase().includes(q))) ||
      (s.department && s.department.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedScholars = researchers.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.researchArea.toLowerCase().includes(q) ||
      r.university.toLowerCase().includes(q) ||
      (r.specialization && r.specialization.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedProjects = projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q))) ||
      p.institution.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedInstitutions = institutions.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.shortName.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q) ||
      i.state.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      events: matchedEvents,
      mentors: matchedMentors,
      students: matchedStudents,
      scholars: matchedScholars,
      projects: matchedProjects,
      institutions: matchedInstitutions
    };
  }, [query, events, mentors, students, researchers, projects, institutions]);

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

    results.students.forEach(s => list.push({
      type: 'Student',
      data: s,
      label: s.name,
      sub: `${s.department} • ${s.institution}`,
      action: () => { setSelectedUserProfileModal(s); setIsOpen(false); }
    }));

    results.scholars.forEach(sc => list.push({
      type: 'PhD Scholar',
      data: sc,
      label: sc.name,
      sub: `${sc.researchArea} • ${sc.university}`,
      action: () => { setSelectedUserProfileModal(sc); setIsOpen(false); }
    }));

    results.projects.forEach(p => list.push({
      type: 'Project',
      data: p,
      label: p.title,
      sub: `${p.domain} • ${p.institution}`,
      action: () => { setSelectedProjectId(p.id); setActiveTab('projects'); setIsOpen(false); }
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
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto z-30">
      
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-campus-border/80 shadow-warm-lg hover:border-campus-blue/60 focus-within:border-campus-blue focus-within:ring-4 focus-within:ring-campus-soft-blue/50 transition-all p-1.5 sm:p-2">
        <div className="pl-3.5 sm:pl-4 text-campus-blue flex items-center justify-center">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-campus-blue stroke-[2.5]" />
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
          placeholder="Search students, mentors, colleges, events, projects..."
          className="w-full pl-3 pr-10 py-2.5 sm:py-3.5 text-sm sm:text-base bg-transparent outline-none text-campus-deep-blue font-medium placeholder:text-campus-muted-text"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-2 rounded-full hover:bg-slate-100 text-campus-muted-text hover:text-campus-slate-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 mr-3 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-campus-muted-text">
            <span>Federated</span>
          </div>
        )}
      </div>

      {/* Federated Results Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full mt-2.5 bg-white rounded-3xl border border-campus-border shadow-warm-xl p-3 sm:p-4 max-h-[70vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {totalResultsCount === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-campus-muted-text mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-campus-deep-blue">No matches found for "{query}"</h4>
              <p className="text-xs text-campus-muted-text max-w-sm mx-auto">
                Try searching with broader terms like a state name, domain (e.g. "AI", "Robotics"), or university.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between px-2 pb-1.5 border-b border-campus-border/60 text-xs text-campus-muted-text">
                <span>Grouped Search Results ({totalResultsCount})</span>
                <span className="text-[11px]">Press ↑↓ to navigate • ↵ to select</span>
              </div>

              {/* 1. Events Section */}
              {results.events.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-campus-blue px-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events & Hackathons ({results.events.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.events.map(event => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSelectedEventModal(event);
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-campus-soft-blue/60 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-campus-blue truncate">
                            {event.title}
                          </h4>
                          <p className="text-[11px] text-campus-muted-text truncate mt-0.5">
                            {event.organizer} • {event.city}, {event.state} • <span className="font-semibold text-green-700">{event.mode}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-campus-blue group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Mentors Section */}
              {results.mentors.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 px-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Faculty & Industry Mentors ({results.mentors.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.mentors.map(mentor => (
                      <div
                        key={mentor.id}
                        onClick={() => {
                          setSelectedUserProfileModal(mentor);
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-amber-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-campus-border flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-amber-700 truncate">
                              {mentor.name}
                            </h4>
                            <p className="text-[11px] text-campus-muted-text truncate">
                              {mentor.specialization} • {mentor.institution}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PhD Scholars Section */}
              {results.scholars.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-700 px-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>PhD Scholars & Research Labs ({results.scholars.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.scholars.map(scholar => (
                      <div
                        key={scholar.id}
                        onClick={() => {
                          setSelectedUserProfileModal(scholar);
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-purple-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <img
                            src={scholar.avatar}
                            alt={scholar.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-campus-border flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-purple-700 truncate">
                                {scholar.name}
                              </h4>
                              {scholar.isDemoData && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                                  Demo Data
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-campus-muted-text truncate">
                              {scholar.researchArea} • {scholar.university}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Projects Section */}
              {results.projects.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 px-2">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Projects & Prototypes ({results.projects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.projects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setActiveTab('projects');
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-campus-blue truncate">
                            {proj.title}
                          </h4>
                          <p className="text-[11px] text-campus-muted-text truncate mt-0.5">
                            {proj.domain} • {proj.institution} • <span className="font-semibold text-campus-blue">{proj.status}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-campus-blue group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Students Section */}
              {results.students.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 px-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Students & Innovators ({results.students.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.students.map(student => (
                      <div
                        key={student.id}
                        onClick={() => {
                          setSelectedUserProfileModal(student);
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-campus-border flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-indigo-700 truncate">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-campus-muted-text truncate">
                              {student.department} • {student.institution}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Colleges Section */}
              {results.institutions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 px-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Institutions & Colleges ({results.institutions.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.institutions.map(inst => (
                      <div
                        key={inst.id}
                        onClick={() => {
                          setActiveTab('discover');
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-bold text-campus-deep-blue group-hover:text-campus-blue truncate">
                            {inst.name}
                          </h4>
                          <p className="text-[11px] text-campus-muted-text truncate mt-0.5">
                            {inst.type} • {inst.city}, {inst.state}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-campus-muted-text group-hover:text-campus-blue group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, Search, Filter, MapPin, Building2, 
  GraduationCap, ShieldCheck, Sparkles, Users, 
  Award, Calendar, ArrowRight, Bookmark, BookmarkCheck, 
  MessageSquare, UserPlus, Eye, CheckCircle2, ChevronRight, 
  ExternalLink, TrendingUp, Flame 
} from 'lucide-react';
import { MOCK_INDIAN_STATES, MOCK_INDIAN_CITIES, MOCK_DEPARTMENTS_LIST } from '../../data/mockData';
import { EventItem, Project, User, Mentor, Researcher } from '../../types';

export const DiscoverEcosystemView: React.FC = () => {
  const { 
    events, projects, students, mentors, researchers, institutions, 
    currentUser, setActiveTab, setSelectedEventModal, 
    setSelectedUserProfileModal, setSelectedProjectId, 
    setIsDirectMessagingOpen, setActiveMessagingPartner, 
    sendConnectionRequest, savedItemIds, toggleSaveItem, 
    addToast 
  } = useApp();

  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState<
    'all' | 'events' | 'students' | 'mentors' | 'scholars' | 'institutions' | 'teams'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedDept, setSelectedDept] = useState('All');
  const [modeFilter, setModeFilter] = useState<'All' | 'Online' | 'Offline' | 'Hybrid'>('All');

  // Filtered Events
  const filteredEvents = events.filter(e => {
    const matchesSearch = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tracks.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesState = selectedState === 'All India' || e.state === selectedState;
    const matchesCity = selectedCity === 'All Cities' || e.city === selectedCity;
    const matchesMode = modeFilter === 'All' || e.mode === modeFilter;
    return matchesSearch && matchesState && matchesCity && matchesMode;
  });

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesState = selectedState === 'All India' || s.state === selectedState;
    const matchesDept = selectedDept === 'All' || s.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesState && matchesDept;
  });

  // Filtered Mentors
  const filteredMentors = mentors.filter(m => {
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.researchAreas.some(ra => ra.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesState = selectedState === 'All India' || m.state === selectedState;
    return matchesSearch && matchesState;
  });

  // Filtered Scholars
  const filteredScholars = researchers.filter(r => {
    const matchesSearch = !searchQuery || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.researchArea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All India' || r.state === selectedState;
    return matchesSearch && matchesState;
  });

  // Filtered Institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = !searchQuery || 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inst.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All India' || inst.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-campus-deep-blue via-campus-blue to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-warm-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
              National Opportunity & Network Discovery Engine
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">Across 1,200+ Indian Institutions</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Discover What's Happening Across India
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Explore national hackathons, connect with cross-college student developers, discover research guides at premier IITs/IISc, and join high-impact teams.
          </p>

          {/* AI Personalized Recommendation Badge */}
          <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-semibold bg-white/10 p-2.5 rounded-xl border border-white/15 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>
              <strong>AI Match Active:</strong> Recommendations prioritized for <em>{currentUser.department}</em> at <em>{currentUser.institution}</em>.
            </span>
          </div>
        </div>
      </div>

      {/* Discovery Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-campus-border">
        {[
          { id: 'all', label: '🔥 All Opportunities', count: null },
          { id: 'events', label: '🏆 Events & Hackathons', count: filteredEvents.length },
          { id: 'students', label: '🎓 Students Talent', count: filteredStudents.length },
          { id: 'mentors', label: '🛡️ Faculty & Mentors', count: filteredMentors.length },
          { id: 'scholars', label: '✨ PhD Scholars & Labs', count: filteredScholars.length },
          { id: 'institutions', label: '🏛️ Colleges & Universities', count: filteredInstitutions.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDiscoveryTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeDiscoveryTab === tab.id
                ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                : 'text-campus-slate-text hover:bg-campus-soft-blue/60 bg-white border border-campus-border'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeDiscoveryTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-campus-slate-text'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Smart Search & Geographic Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-campus-border shadow-warm-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Universal Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, challenge, technology, college..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium"
            >
              {MOCK_INDIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Mode / Category Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={e => setModeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium"
            >
              <option value="All">All Modes (Online + Offline)</option>
              <option value="Offline">Offline On-Campus</option>
              <option value="Online">Online Remote</option>
              <option value="Hybrid">Hybrid Challenge</option>
            </select>
          </div>

        </div>
      </div>

      {/* TAB CONTENT: ALL OPPORTUNITIES FEED */}
      {activeDiscoveryTab === 'all' && (
        <div className="space-y-8">
          
          {/* Trending Hackathons Carousel Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-campus-red" />
                <h2 className="text-lg sm:text-xl font-bold text-campus-deep-blue">
                  National Hackathons & Competitions Open Now
                </h2>
              </div>
              <button 
                onClick={() => setActiveDiscoveryTab('events')}
                className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1"
              >
                View All {events.length} Events <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedEventModal(event)}
                >
                  <div className="h-40 relative overflow-hidden bg-slate-900">
                    <img 
                      src={event.bannerUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-campus-blue text-white px-2 py-0.5 rounded-full">
                        {event.eventType}
                      </span>
                      <span className="text-[10px] font-bold bg-white/90 text-campus-slate-text px-2 py-0.5 rounded-full">
                        {event.mode}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] text-amber-300 font-semibold truncate">{event.organizer}</p>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{event.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-campus-muted-text line-clamp-2">{event.description}</p>
                    
                    <div className="pt-2 border-t border-campus-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-campus-slate-text flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-campus-red" />
                        {event.city}, {event.state}
                      </span>
                      <span className="font-bold text-campus-red bg-red-50 px-2 py-0.5 rounded">
                        {event.prizes[0]?.amount}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventModal(event);
                        }}
                        className="flex-1 campus-btn-primary py-2 text-xs rounded-xl"
                      >
                        View Full Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveItem(event.id);
                        }}
                        className="p-2 rounded-xl border border-campus-border hover:bg-campus-warm-white text-campus-muted-text"
                      >
                        {savedItemIds.includes(event.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-campus-blue" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Mentors Available Spotlight */}
          <div className="space-y-4 pt-4 border-t border-campus-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-campus-blue" />
                <h2 className="text-lg sm:text-xl font-bold text-campus-deep-blue">
                  Verified Faculty & Industry Mentors
                </h2>
              </div>
              <button 
                onClick={() => setActiveDiscoveryTab('mentors')}
                className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1"
              >
                View All {mentors.length} Mentors <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredMentors.slice(0, 4).map(mentor => (
                <div 
                  key={mentor.id}
                  className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={mentor.avatar} 
                        alt={mentor.name} 
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-campus-border" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-campus-deep-blue">{mentor.name}</h4>
                        <p className="text-[10px] text-campus-muted-text truncate max-w-[130px]">{mentor.institution}</p>
                        <span className="campus-badge-verified text-[9px] py-0.5 px-1.5 mt-0.5">
                          ✓ Verified Mentor
                        </span>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-campus-slate-text line-clamp-2">{mentor.specialization}</p>

                    <div className="flex items-center justify-between text-[11px] text-campus-muted-text pt-1">
                      <span>Guided {mentor.projectsGuided} Projects</span>
                      <span className="text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                        {mentor.availability}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-campus-border flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveMessagingPartner(mentor);
                        setIsDirectMessagingOpen(true);
                      }}
                      className="flex-1 campus-btn-secondary py-1.5 text-[11px] rounded-lg"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Message
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserProfileModal(mentor);
                      }}
                      className="campus-btn-primary py-1.5 px-2.5 text-[11px] rounded-lg"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Talent Pool Preview */}
          <div className="space-y-4 pt-4 border-t border-campus-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-campus-blue" />
                <h2 className="text-lg sm:text-xl font-bold text-campus-deep-blue">
                  Connect with Cross-Disciplinary Student Innovators
                </h2>
              </div>
              <button 
                onClick={() => setActiveDiscoveryTab('students')}
                className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1"
              >
                Browse All Students <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.slice(0, 3).map(student => (
                <div 
                  key={student.id}
                  className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-campus-border" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-campus-deep-blue">{student.name}</h4>
                        <p className="text-[10px] text-campus-blue font-semibold">{student.department}</p>
                        <p className="text-[10px] text-campus-muted-text truncate max-w-[150px]">{student.institution}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 3).map(sk => (
                        <span key={sk} className="text-[10px] font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-campus-border flex items-center justify-between">
                    <span className="text-[11px] font-bold text-campus-slate-text">Score: {student.innovationScore}</span>
                    <button
                      onClick={() => sendConnectionRequest(student.id)}
                      className="campus-btn-primary py-1.5 px-3 text-[11px] rounded-lg flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: EVENTS & HACKATHONS */}
      {activeDiscoveryTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              National Hackathons, Ideathons & Symposiums ({filteredEvents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => setSelectedEventModal(event)}
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-campus-blue text-white px-2.5 py-0.5 rounded-full">
                      {event.eventType}
                    </span>
                    <span className="text-[10px] font-bold bg-white/90 text-campus-slate-text px-2 py-0.5 rounded-full">
                      {event.mode}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-amber-300 font-semibold truncate">{event.organizer}</p>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{event.title}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-campus-muted-text line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-campus-border text-xs text-campus-slate-text">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-campus-blue" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-campus-red" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-campus-border flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventModal(event);
                      }}
                      className="flex-1 campus-btn-primary py-2 text-xs rounded-xl"
                    >
                      Open Event Portal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: STUDENTS */}
      {activeDiscoveryTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Verified Student Directory Across Colleges ({filteredStudents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div 
                key={student.id}
                className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-campus-border" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-campus-deep-blue">{student.name}</h3>
                        {student.verifiedStudent && (
                          <span className="campus-badge-verified text-[10px] py-0.5 px-1.5">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-campus-blue mt-0.5">{student.department}</p>
                      <p className="text-[11px] text-campus-muted-text mt-0.5">{student.institution}</p>
                    </div>
                  </div>

                  <p className="text-xs text-campus-slate-text/80 line-clamp-2">{student.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {student.skills.map(sk => (
                      <span key={sk} className="text-[10px] font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-campus-border flex items-center justify-between">
                  <span className="text-xs font-bold text-campus-slate-text">Score: {student.innovationScore}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveMessagingPartner(student);
                        setIsDirectMessagingOpen(true);
                      }}
                      className="campus-btn-secondary text-xs py-1.5 px-2.5 rounded-lg"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => sendConnectionRequest(student.id)}
                      className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MENTORS */}
      {activeDiscoveryTab === 'mentors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Faculty & Industry Mentors ({filteredMentors.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.map(mentor => (
              <div 
                key={mentor.id}
                className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-campus-border" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-campus-deep-blue">{mentor.name}</h3>
                        <span className="campus-badge-verified text-[10px] py-0.5 px-2">
                          ✓ Verified Mentor
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-campus-blue mt-0.5">{mentor.title}</p>
                      <p className="text-xs text-campus-muted-text mt-0.5">{mentor.institution}</p>
                    </div>
                  </div>

                  <p className="text-xs text-campus-slate-text/80 leading-relaxed">{mentor.bio}</p>

                  <div className="pt-2 border-t border-campus-border text-xs space-y-1">
                    <div><strong>Specialization:</strong> {mentor.specialization}</div>
                    <div><strong>Experience:</strong> {mentor.yearsExperience} Years ({mentor.academicExp})</div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-campus-border flex items-center justify-between">
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                    {mentor.availability} ({mentor.mentorshipSlots || 2} slots open)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveMessagingPartner(mentor);
                        setIsDirectMessagingOpen(true);
                      }}
                      className="campus-btn-secondary text-xs py-1.5 px-3 rounded-lg"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </button>
                    <button
                      onClick={() => setSelectedUserProfileModal(mentor)}
                      className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCHOLARS */}
      {activeDiscoveryTab === 'scholars' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              PhD Scholars & Premier Research Labs ({filteredScholars.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScholars.map(scholar => (
              <div 
                key={scholar.id}
                className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img 
                      src={scholar.avatar} 
                      alt={scholar.name} 
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-campus-border" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-campus-deep-blue">{scholar.name}</h3>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          PhD Scholar
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-campus-blue mt-0.5">{scholar.department}</p>
                      <p className="text-xs text-campus-muted-text mt-0.5">{scholar.university}</p>
                    </div>
                  </div>

                  <p className="text-xs text-campus-slate-text/80 leading-relaxed">{scholar.bio}</p>

                  <div className="pt-2 border-t border-campus-border text-xs space-y-1">
                    <div><strong>Research Area:</strong> {scholar.researchArea}</div>
                    <div><strong>Principal Guide:</strong> {scholar.guide}</div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-campus-slate-text pt-1">
                    <span>{scholar.publicationsCount} Publications</span>
                    <span>{scholar.citationsCount} Citations</span>
                    <span>H-Index: {scholar.hIndex}</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-campus-border flex items-center justify-between">
                  <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md">
                    {scholar.openForCollab ? '✓ Open for Student Collaboration' : 'Busy'}
                  </span>
                  <button
                    onClick={() => {
                      setActiveMessagingPartner(scholar);
                      setIsDirectMessagingOpen(true);
                    }}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                  >
                    Request Research Collab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INSTITUTIONS */}
      {activeDiscoveryTab === 'institutions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Partner Indian Universities & Institutes ({filteredInstitutions.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map(inst => (
              <div 
                key={inst.id}
                className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-full">
                      {inst.type}
                    </span>
                    {inst.nirfRank && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        NIRF Rank #{inst.nirfRank}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-campus-deep-blue">{inst.name}</h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-campus-muted-text">
                    <MapPin className="w-3.5 h-3.5 text-campus-red" />
                    <span>{inst.city}, {inst.state}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-campus-border">
                    <div className="bg-campus-warm-white p-2 rounded-xl">
                      <div className="font-bold text-xs text-campus-deep-blue">{inst.studentCount.toLocaleString()}</div>
                      <div className="text-[10px] text-campus-muted-text">Students</div>
                    </div>
                    <div className="bg-campus-warm-white p-2 rounded-xl">
                      <div className="font-bold text-xs text-campus-deep-blue">{inst.projectsCount}</div>
                      <div className="text-[10px] text-campus-muted-text">Projects</div>
                    </div>
                    <div className="bg-campus-warm-white p-2 rounded-xl">
                      <div className="font-bold text-xs text-campus-deep-blue">{inst.eventsCount}</div>
                      <div className="text-[10px] text-campus-muted-text">Events</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-campus-border flex items-center justify-between">
                  <span className="campus-badge-verified text-[10px] py-0.5 px-2">
                    ✓ Verified CampusNet Node
                  </span>
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, MapPin, Users, Award, ShieldCheck, 
  Search, Filter, CheckCircle2, ArrowRight, Camera, 
  FileCheck, Bookmark, BookmarkCheck, ExternalLink,
  Trash2, AlertCircle, Clock, Check
} from 'lucide-react';
import { EventItem, EventRegistrationItem } from '../../types';
import { VerifiedAttendanceModal } from './VerifiedAttendanceModal';
import { OrganizerDashboardView } from './OrganizerDashboardView';
import { EventDetailModal } from './EventDetailModal';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';

export const EventsDirectoryView: React.FC = () => {
  const { 
    events, registerForEvent, currentUser, currentOrganizer, selectedEventModal, 
    setSelectedEventModal, savedItemIds, toggleSaveItem, eventRegistrations,
    cancelStudentRegistration, addToast
  } = useApp();

  const { id } = useParams<{ id?: string }>();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'browse' | 'my_events'>('browse');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedFormat, setSelectedFormat] = useState<'All' | 'Offline' | 'Online' | 'Hybrid'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceEventModal, setAttendanceEventModal] = useState<EventItem | null>(null);

  // Available districts dependent on selectedState
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All India') return [];
    return getDistrictsByStateName(selectedState);
  }, [selectedState]);

  // Handle URL deep link or register action
  useEffect(() => {
    if (id && events.length > 0) {
      const found = events.find(e => e.id.toLowerCase() === id.toLowerCase() || (e.code && e.code.toLowerCase() === id.toLowerCase()));
      if (found) {
        setSelectedEventModal(found);
      }
    }
  }, [id, events, setSelectedEventModal]);

  const eventTypes = [
    'All', 'Hackathon', 'Technical Symposium', 'Workshop', 
    'Conference', 'Paper Presentation', 'Project Expo', 
    'Government Challenge', 'Coding Competition', 'Ideathon'
  ];

  // Only published, live, or registration_open events are discoverable to students.
  // Organizers can see their own draft/review events.
  const isOrganizer = currentUser.role === 'organizer' || Boolean(currentOrganizer);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Visibility rule: must be published or live, or owned by the logged-in organizer
      const isPubliclyVisible = 
        e.status === 'published' || 
        e.status === 'live' || 
        e.status === 'registration_open' ||
        (isOrganizer && (e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName));

      if (!isPubliclyVisible) return false;

      const matchesType = selectedType === 'All' || e.eventType.toLowerCase().includes(selectedType.toLowerCase());
      const matchesState = selectedState === 'All India' || e.state === selectedState;
      const matchesDistrict = selectedDistrict === 'All Districts' || e.district === selectedDistrict;
      const matchesFormat = selectedFormat === 'All' || e.mode === selectedFormat;
      
      const matchesSearch = !searchQuery || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.city && e.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.district && e.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.tracks.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesState && matchesDistrict && matchesFormat && matchesSearch;
    });
  }, [events, selectedType, selectedState, selectedDistrict, selectedFormat, searchQuery, isOrganizer, currentOrganizer]);

  const studentRegistrations = useMemo(() => {
    return eventRegistrations.filter(r => r.participantId === currentUser.id || r.email === currentUser.email);
  }, [eventRegistrations, currentUser]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-govt">
              <Award className="w-3.5 h-3.5" />
              National Academic Event Network
            </span>
            <span className="text-xs text-campus-muted-text">{filteredEvents.length} Verified Challenges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            All-India Academic Events, Hackathons & Symposiums
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Discover accredited collegiate competitions across all 28 states and 8 union territories, mark verified GPS attendance, and earn digital certificates.
          </p>
        </div>

        {/* View Switcher: Explore vs My Events */}
        <div className="flex items-center gap-2 bg-campus-warm-white p-1 rounded-2xl border border-campus-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-campus-deep-blue text-white shadow-warm-xs'
                : 'text-campus-slate-text hover:text-campus-deep-blue'
            }`}
          >
            Explore Events
          </button>
          <button
            onClick={() => setActiveTab('my_events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my_events'
                ? 'bg-campus-deep-blue text-white shadow-warm-xs'
                : 'text-campus-slate-text hover:text-campus-deep-blue'
            }`}
          >
            <span>My Events</span>
            {studentRegistrations.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'my_events' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-campus-blue text-white'
              }`}>
                {studentRegistrations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* If Organizer, Show Organizer Dashboard Shortcut */}
      {isOrganizer && activeTab === 'browse' && (
        <OrganizerDashboardView />
      )}

      {/* TAB 1: BROWSE EVENTS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Comprehensive Filter & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-campus-border shadow-warm-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search input */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search title, institution, track..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
                />
              </div>

              {/* State / UT selector (all 36) */}
              <div>
                <select
                  value={selectedState}
                  onChange={e => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('All Districts');
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium truncate"
                >
                  <option value="All India">All India (28 States + 8 UTs)</option>
                  {ALL_STATE_AND_UT_NAMES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* District Selector (dynamic based on selectedState) */}
              <div>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  disabled={selectedState === 'All India'}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium disabled:opacity-50 truncate"
                >
                  <option value="All Districts">{selectedState === 'All India' ? 'Select State First' : 'All Districts'}</option>
                  {availableDistricts.map(dst => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>

              {/* Format Selector */}
              <div>
                <select
                  value={selectedFormat}
                  onChange={e => setSelectedFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium"
                >
                  <option value="All">All Formats (Offline, Online, Hybrid)</option>
                  <option value="Offline">Offline (Campus Nodal)</option>
                  <option value="Online">Online Virtual Arena</option>
                  <option value="Hybrid">Hybrid Mode</option>
                </select>
              </div>

            </div>

            {/* Event Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                      : 'bg-campus-warm-white text-campus-slate-text hover:bg-campus-soft-blue border border-campus-border'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-campus-border text-center space-y-3 shadow-warm-xs">
              <Calendar className="w-10 h-10 text-campus-muted-text mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-campus-deep-blue">No Events Match Your Selected Filters</h3>
                <p className="text-xs text-campus-muted-text max-w-md mx-auto">
                  Try broadening your state, district, category, or format filters to discover more collegiate hackathons and symposiums across India.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventModal(event)}
                  className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
            {/* Banner */}
            <div className="h-48 relative overflow-hidden bg-campus-deep-blue">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  event.organizerType === 'government'
                    ? 'bg-green-600 text-white'
                    : 'bg-campus-blue text-white'
                }`}>
                  {event.eventType}
                </span>
                <span className="text-[11px] font-bold bg-white/90 text-campus-slate-text px-2 py-0.5 rounded-full">
                  {event.mode}
                </span>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <p className="text-xs text-amber-300 font-semibold truncate">{event.organizer}</p>
                <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs text-campus-slate-text/80 leading-relaxed line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-campus-border text-xs text-campus-slate-text">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-campus-blue flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-campus-red flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-campus-muted-text">
                      <Users className="w-4 h-4 inline mr-1 text-campus-blue" />
                      {event.registeredTeamsCount} Teams
                    </span>
                    <span className="font-bold text-campus-red bg-red-50 px-2 py-0.5 rounded-md">
                      {event.prizes[0]?.amount}
                    </span>
                  </div>
                </div>

                {/* Tracks */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-campus-muted-text mb-1">
                    Featured Tracks:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.tracks.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-campus-warm-white border border-campus-border px-2 py-0.5 rounded font-medium text-campus-slate-text">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-campus-border space-y-2">
                {event.isRegistered ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-green-700 bg-green-50 p-2 rounded-xl border border-green-200">
                      <span>✓ Official Team Registered</span>
                      <span className="text-[10px] uppercase font-mono">ID: SIH-2026-088</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttendanceEventModal(event);
                      }}
                      className="w-full campus-btn-red text-xs py-2.5 rounded-xl shadow-glow-red flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      Mark Verified GPS Attendance
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventModal(event);
                      }}
                      className="flex-1 campus-btn-primary text-xs py-2.5 rounded-xl font-bold"
                    >
                      View Details & Register
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveItem(event.id);
                      }}
                      className="p-2.5 rounded-xl border border-campus-border hover:bg-campus-warm-white text-campus-muted-text"
                    >
                      {savedItemIds.includes(event.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-campus-blue" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* TAB 2: MY EVENTS & REGISTRATIONS */}
      {activeTab === 'my_events' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-campus-border">
            <div>
              <h2 className="text-lg font-bold text-campus-deep-blue">My Registered Challenges & Events</h2>
              <p className="text-xs text-campus-muted-text">Track your confirmed registrations, attendance credentials, and certificate statuses.</p>
            </div>
          </div>

          {studentRegistrations.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-campus-border text-center space-y-3 shadow-warm-xs">
              <Calendar className="w-10 h-10 text-campus-muted-text mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-campus-deep-blue">No Event Registrations Yet</h3>
                <p className="text-xs text-campus-muted-text max-w-md mx-auto">
                  You haven't registered for any national hackathons or symposiums. Explore active challenges and represent your institution!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="campus-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-warm-xs cursor-pointer"
              >
                Browse All-India Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentRegistrations.map(reg => {
                const matchedEvent = events.find(e => e.id === reg.eventId);
                return (
                  <div
                    key={reg.id}
                    className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {reg.registrationStatus.toUpperCase()}
                            </span>
                            <span className="text-[10px] bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded font-mono font-bold">
                              Team: {reg.teamName || 'Team AgriVision'}
                            </span>
                            {matchedEvent?.mode && (
                              <span className="text-[10px] bg-slate-100 text-campus-slate-text px-2 py-0.5 rounded">
                                {matchedEvent.mode}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-campus-deep-blue leading-snug">{reg.eventTitle}</h3>
                          <p className="text-xs text-campus-muted-text mt-0.5">
                            {matchedEvent ? `${matchedEvent.venue}, ${matchedEvent.city} (${matchedEvent.state})` : reg.institution}
                          </p>
                        </div>
                      </div>

                      {/* Registration Metadata */}
                      <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-campus-slate-text">
                          <span className="text-campus-muted-text">Participant:</span>
                          <span className="font-semibold">{reg.participantName} ({reg.department})</span>
                        </div>
                        <div className="flex items-center justify-between text-campus-slate-text">
                          <span className="text-campus-muted-text">Registered Date:</span>
                          <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-campus-slate-text">
                          <span className="text-campus-muted-text">Attendance Status:</span>
                          <span className="font-mono text-campus-blue font-bold">
                            {reg.attendanceStatus === 'checked_in' ? '✓ Checked In (GPS Verified)' : 'Registered (Awaiting Nodal Day Check-In)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-campus-border flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to withdraw from "${reg.eventTitle}"? Your spot will be released.`)) {
                            cancelStudentRegistration(reg.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw Registration</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {matchedEvent && (
                          <button
                            onClick={() => setSelectedEventModal(matchedEvent)}
                            className="px-3.5 py-1.5 rounded-xl bg-campus-warm-white border border-campus-border hover:bg-slate-100 text-xs font-bold text-campus-slate-text cursor-pointer"
                          >
                            View Event
                          </button>
                        )}
                        {matchedEvent && reg.attendanceStatus !== 'checked_in' && (
                          <button
                            onClick={() => setAttendanceEventModal(matchedEvent)}
                            className="campus-btn-red text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 shadow-glow-red cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>GPS Check-In</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEventModal && (
        <EventDetailModal
          event={selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
        />
      )}

      {/* Attendance Modal */}
      {attendanceEventModal && (
        <VerifiedAttendanceModal
          event={attendanceEventModal}
          onClose={() => setAttendanceEventModal(null)}
        />
      )}

    </div>
  );
};

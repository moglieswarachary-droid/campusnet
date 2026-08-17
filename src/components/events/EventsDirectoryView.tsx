import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, MapPin, Users, Award, ShieldCheck, 
  Search, Filter, CheckCircle2, ArrowRight, Camera, FileCheck 
} from 'lucide-react';
import { EventItem } from '../../types';
import { VerifiedAttendanceModal } from './VerifiedAttendanceModal';
import { OrganizerDashboardView } from './OrganizerDashboardView';

export const EventsDirectoryView: React.FC = () => {
  const { events, registerForEvent, currentUser, selectedEventId, setSelectedEventId } = useApp();

  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceEventModal, setAttendanceEventModal] = useState<EventItem | null>(null);

  const eventTypes = ['All', 'Government Challenge', 'Hackathon', 'Ideathon', 'Research Symposium'];

  const filteredEvents = events.filter(e => {
    const matchesType = selectedType === 'All' || e.eventType.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tracks.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const isOrganizer = currentUser.role === 'organizer';

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-govt">
              <Award className="w-3.5 h-3.5" />
              National & University Event Network
            </span>
            <span className="text-xs text-campus-muted-text">{events.length} Active Challenges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Hackathons, Ideathons & Government Challenges
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Participate with verified 6-member teams, mark GPS-verified event attendance, and receive QR-verifiable digital certificates.
          </p>
        </div>

        {isOrganizer && (
          <span className="campus-badge-verified py-1.5 px-3">
            Organizer Portal Active
          </span>
        )}
      </div>

      {/* If Organizer, Show Organizer Dashboard Section */}
      {isOrganizer && (
        <OrganizerDashboardView />
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-campus-border shadow-warm-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by event title, nodal center, or track..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Banner */}
            <div className="h-48 relative overflow-hidden bg-campus-deep-blue">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover opacity-85"
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
                <p className="text-xs text-campus-slate-text/80 leading-relaxed line-clamp-3">
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
                      onClick={() => setAttendanceEventModal(event)}
                      className="w-full campus-btn-red text-xs py-2.5 rounded-xl shadow-glow-red flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      Mark Verified GPS Attendance
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => registerForEvent(event.id)}
                    className="w-full campus-btn-primary text-xs py-2.5 rounded-xl"
                  >
                    Register 6-Member Team
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

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

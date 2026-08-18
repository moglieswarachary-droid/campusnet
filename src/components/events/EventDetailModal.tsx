import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Calendar, MapPin, Award, Users, ShieldCheck, 
  CheckCircle2, Clock, Share2, Bookmark, BookmarkCheck, 
  Download, ExternalLink, Camera, Mail, Phone, Globe, 
  AlertCircle, ChevronRight, Navigation 
} from 'lucide-react';
import { EventItem } from '../../types';
import { VerifiedAttendanceModal } from './VerifiedAttendanceModal';

interface Props {
  event: EventItem;
  onClose: () => void;
}

export const EventDetailModal: React.FC<Props> = ({ event, onClose }) => {
  const { registerForEvent, savedItemIds, toggleSaveItem, addToast } = useApp();
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'success',
      title: 'Event Link Copied',
      message: 'Shareable CampusNet event link copied to clipboard.'
    });
  };

  const handleAddToCalendar = () => {
    addToast({
      type: 'info',
      title: 'Added to Calendar',
      message: `${event.title} saved to your schedule with alert set 24h prior.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-xl border border-campus-border overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner with Badges */}
        <div className="h-56 sm:h-64 relative overflow-hidden bg-slate-900">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
              event.organizerType === 'government' ? 'bg-green-600 text-white' : 'bg-campus-blue text-white'
            }`}>
              {event.eventType}
            </span>
            <span className="text-[11px] font-bold bg-white/90 text-campus-slate-text px-2.5 py-1 rounded-full">
              {event.mode} Mode
            </span>
            {event.deadlineStatus === 'closing_soon' && (
              <span className="text-[11px] font-bold bg-red-600 text-white px-2.5 py-1 rounded-full animate-pulse">
                Closing Soon
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs sm:text-sm text-amber-300 font-bold">{event.organizer}</p>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight mt-0.5">{event.title}</h2>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 border-b border-campus-border bg-slate-50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-4 text-campus-slate-text font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-campus-blue" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-campus-red" />
              {event.city}, {event.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCalendar}
              className="px-3 py-1.5 rounded-lg border border-campus-border bg-white hover:bg-campus-warm-white font-bold text-campus-slate-text"
            >
              + Add to Calendar
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-campus-border bg-white hover:bg-campus-warm-white text-campus-muted-text"
              title="Share Event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveItem(event.id)}
              className="p-1.5 rounded-lg border border-campus-border bg-white hover:bg-campus-warm-white text-campus-muted-text"
              title="Save Event"
            >
              {savedItemIds.includes(event.id) ? (
                <BookmarkCheck className="w-4 h-4 text-campus-blue" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-6">
          
          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-campus-muted-text">About This Challenge</h3>
            <p className="text-xs sm:text-sm text-campus-slate-text leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border">
              <div className="text-[10px] uppercase font-bold text-campus-muted-text">Registration Fee</div>
              <div className="text-xs sm:text-sm font-bold text-campus-deep-blue mt-0.5">{event.registrationFee || 'Free'}</div>
            </div>

            <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border">
              <div className="text-[10px] uppercase font-bold text-campus-muted-text">Team Size</div>
              <div className="text-xs sm:text-sm font-bold text-campus-deep-blue mt-0.5">Up to {event.maxTeamSize} Members</div>
            </div>

            <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border">
              <div className="text-[10px] uppercase font-bold text-campus-muted-text">Deadline</div>
              <div className="text-xs sm:text-sm font-bold text-campus-red mt-0.5">{event.deadline}</div>
            </div>

            <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border">
              <div className="text-[10px] uppercase font-bold text-campus-muted-text">Registered Teams</div>
              <div className="text-xs sm:text-sm font-bold text-campus-blue mt-0.5">{event.registeredTeamsCount} Teams</div>
            </div>
          </div>

          {/* Location & GPS Geofence Map Preview */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-campus-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-campus-deep-blue flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-campus-red" />
                Physical Nodal Venue & GPS Geofencing
              </span>
              <span className="text-[11px] font-mono text-campus-muted-text">
                Radius: {event.attendanceWindow.allowedRadiusMeters}m
              </span>
            </div>
            <p className="text-xs text-campus-slate-text font-medium">{event.venue}</p>
            
            <div className="h-28 bg-gradient-to-r from-blue-900 to-slate-800 rounded-xl relative flex items-center justify-center text-white overflow-hidden">
              <div className="text-center space-y-1">
                <MapPin className="w-6 h-6 text-campus-red mx-auto animate-bounce" />
                <div className="text-xs font-bold">{event.city}, {event.state}</div>
                <div className="text-[10px] text-slate-300 font-mono">
                  Coordinates: {event.attendanceWindow.targetLat}°N, {event.attendanceWindow.targetLng}°E
                </div>
              </div>
            </div>
          </div>

          {/* Prizes Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-campus-muted-text">Prize Pool & Fellowship Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.prizes.map((pz, idx) => (
                <div key={idx} className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl space-y-1">
                  <div className="text-xs font-extrabold text-campus-red">{pz.rank}</div>
                  <div className="text-base font-black text-campus-deep-blue">{pz.amount}</div>
                  <div className="text-[11px] text-campus-slate-text">{pz.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Rules & Eligibility */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-campus-muted-text">Eligibility & Mandatory Rules</h3>
            <ul className="space-y-1.5 text-xs text-campus-slate-text">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-campus-blue flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Schedule Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-campus-muted-text">Event Schedule & Rounds</h3>
              <div className="space-y-2 border-l-2 border-campus-blue/40 ml-2 pl-4">
                {event.schedule.map((sch, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="w-2.5 h-2.5 bg-campus-blue rounded-full absolute -left-[21px] top-1" />
                    <div className="text-xs font-bold text-campus-deep-blue">
                      {sch.day ? `${sch.day} - ` : ''}{sch.time}: {sch.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Helpline */}
          <div className="p-4 bg-campus-soft-blue/40 rounded-2xl border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-campus-deep-blue">Official Organizer Desk</div>
              <div className="text-campus-muted-text">{event.contactEmail || 'events@campusnet.network'}</div>
            </div>
            {event.websiteUrl && (
              <a
                href={event.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="campus-btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 font-bold text-campus-blue"
              >
                Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>

        {/* Footer Registration Bar */}
        <div className="p-5 border-t border-campus-border bg-white flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="campus-btn-secondary text-xs py-2.5 px-4 rounded-xl"
          >
            Close
          </button>

          {event.isRegistered ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-700 bg-green-50 py-2 px-3 rounded-xl border border-green-200">
                ✓ Team Registered (ID: SIH-2026-088)
              </span>
              <button
                onClick={() => setIsAttendanceOpen(true)}
                className="campus-btn-red text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-glow-red"
              >
                <Camera className="w-4 h-4" />
                Mark Verified GPS Attendance
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                registerForEvent(event.id);
              }}
              className="campus-btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-xl font-bold shadow-warm-md flex items-center gap-1.5"
            >
              <span>Register 6-Member Team on CampusNet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Attendance Modal */}
      {isAttendanceOpen && (
        <VerifiedAttendanceModal
          event={event}
          onClose={() => setIsAttendanceOpen(false)}
        />
      )}

    </div>
  );
};

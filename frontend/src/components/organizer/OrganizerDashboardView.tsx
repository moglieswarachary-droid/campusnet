import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, Users, QrCode, FileText, 
  Award, ShieldCheck, Plus, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, BarChart3, Bell, ExternalLink, 
  Sparkles, HelpCircle, ChevronRight, Settings, MapPin
} from 'lucide-react';
import { OrganizerTab } from './OrganizerLayout';
import { EventStatus } from '../../types';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const OrganizerDashboardView: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    currentOrganizer, events, eventRegistrations, 
    qrCheckInRecords, projectSubmissions, certificates 
  } = useApp();

  const [eventCategoryFilter, setEventCategoryFilter] = useState<'all' | 'published' | 'drafts' | 'review' | 'completed'>('all');

  // Live events filtered strictly for the authenticated college organizer
  const orgEvents = events.filter(e => 
    e.organizerId === currentOrganizer?.id || 
    e.organizerId === currentOrganizer?.institutionId ||
    (currentOrganizer?.institutionName && e.organizer && e.organizer.toLowerCase().includes(currentOrganizer.institutionName.toLowerCase()))
  );

  const orgEventIds = new Set(orgEvents.map(e => e.id));

  const draftCount = orgEvents.filter(e => e.status === 'draft').length;
  const reviewCount = orgEvents.filter(e => 
    e.status === 'submitted' || 
    e.status === 'pending_admin_approval' || 
    e.status === 'pending_document_verification' || 
    e.status === 'changes_requested' || 
    e.status === 'review'
  ).length;
  const publishedCount = orgEvents.filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live').length;
  const completedCount = orgEvents.filter(e => e.status === 'completed').length;

  const orgRegistrations = eventRegistrations.filter(r => orgEventIds.has(r.eventId));
  const totalRegistrations = orgRegistrations.length + orgEvents.reduce((acc, curr) => acc + (curr.registeredTeamsCount || 0), 0);
  const totalCheckedIn = orgRegistrations.filter(r => r.attendanceStatus === 'checked_in').length;
  const totalSubmissions = projectSubmissions.filter(s => orgEventIds.has(s.eventId)).length;
  const totalCertsIssued = certificates.filter(
    c => c.organizerInstitutionId === currentOrganizer?.id || c.eventOrganizer === currentOrganizer?.institutionName
  ).length;

  const filteredEvents = orgEvents.filter(e => {
    if (eventCategoryFilter === 'drafts') return e.status === 'draft';
    if (eventCategoryFilter === 'review') {
      return e.status === 'submitted' || e.status === 'pending_admin_approval' || e.status === 'pending_document_verification' || e.status === 'changes_requested' || e.status === 'review';
    }
    if (eventCategoryFilter === 'published') return e.status === 'published' || e.status === 'registration_open' || e.status === 'live';
    if (eventCategoryFilter === 'completed') return e.status === 'completed';
    return true;
  });

  const verificationStatus = currentOrganizer?.verificationStatus || 'submitted';

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Executive Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Institution Admin Workspace
              </span>
              
              {verificationStatus === 'verified' ? (
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified College (AISHE Active)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSection('verify')}
                  className="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-full hover:bg-amber-900/50 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Status: {verificationStatus.replace('_', ' ').toUpperCase()} • View Details</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentOrganizer?.institutionName || 'Academic Institution'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Coordinator: <strong>{currentOrganizer?.coordinatorName}</strong> ({currentOrganizer?.designation}) • {currentOrganizer?.department} • {currentOrganizer?.city}, {currentOrganizer?.state}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('verify')}
              className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verification</span>
            </button>

            <button
              onClick={() => setActiveSection('create_event')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-warm-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Host New Event</span>
            </button>
          </div>

        </div>
      </div>

      {/* Verification Notice Banner if not yet verified */}
      {verificationStatus !== 'verified' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-warm-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Institutional accreditation status: <strong>{verificationStatus.replace('_', ' ').toUpperCase()}</strong>. You can prepare drafts and event rules; public publication opens once verified.
            </span>
          </div>
          <button
            onClick={() => setActiveSection('verify')}
            className="text-amber-800 font-bold hover:underline whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Review Authorization & Upload Letters →
          </button>
        </div>
      )}

      {/* Real Connected KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Events</div>
          <div className="text-2xl font-black text-slate-900">{orgEvents.length}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{publishedCount} Published</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Drafts / Review</div>
          <div className="text-2xl font-black text-amber-600">{draftCount + reviewCount}</div>
          <div className="text-[10px] text-slate-500">{reviewCount} in Moderation</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registrations</div>
          <div className="text-2xl font-black text-blue-600">{totalRegistrations}</div>
          <div className="text-[10px] text-slate-500">Total Enrolled</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Checked In</div>
          <div className="text-2xl font-black text-emerald-600">{totalCheckedIn}</div>
          <div className="text-[10px] text-slate-500">QR Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Submissions</div>
          <div className="text-2xl font-black text-purple-600">{totalSubmissions}</div>
          <div className="text-[10px] text-slate-500">Project Decks</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Certs Issued</div>
          <div className="text-2xl font-black text-amber-600">{totalCertsIssued}</div>
          <div className="text-[10px] text-slate-500">Verifiable QR</div>
        </div>

      </div>

      {/* Quick Launch Operations Bar */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Organizer Quick Launch Operations
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Host Event', icon: Plus, section: 'create_event', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Events List', icon: Calendar, section: 'events', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Participants', icon: Users, section: 'registrations', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { label: 'QR Attendance', icon: QrCode, section: 'attendance', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Submissions', icon: FileText, section: 'submissions', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Certificates', icon: ShieldCheck, section: 'certificates', color: 'bg-rose-50 text-rose-700 border-rose-200' },
          ].map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => setActiveSection(act.section as OrganizerTab)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-warm-sm transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* College Hosted Events Status & Listing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Events Managed by Your College ({orgEvents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Live status tracking across drafts, moderation queue, active registrations, and completed events.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All (${orgEvents.length})` },
              { id: 'published', label: `Published (${publishedCount})` },
              { id: 'review', label: `In Review (${reviewCount})` },
              { id: 'drafts', label: `Drafts (${draftCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEventCategoryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  eventCategoryFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-warm-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {orgEvents.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-4 shadow-warm-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900">
                You haven't created an event yet
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Host your first collegiate hackathon or symposium for {currentOrganizer?.institutionName || 'your college'} to connect with students across India.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('create_event')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-warm-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Event</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-warm-xs hover:shadow-warm-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {event.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      event.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : event.status === 'draft'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      ● {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">{event.title}</h4>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{event.venue}, {event.city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{event.registeredTeamsCount || 0} Teams</span>
                  </div>

                  <button
                    onClick={() => setActiveSection('events')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>Manage Lifecycle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

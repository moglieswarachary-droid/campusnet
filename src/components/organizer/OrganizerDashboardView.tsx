import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, Users, QrCode, FileText, 
  Award, ShieldCheck, Plus, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, BarChart3, Bell, ExternalLink 
} from 'lucide-react';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const OrganizerDashboardView: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    currentOrganizer, events, eventRegistrations, 
    qrCheckInRecords, projectSubmissions, certificates, 
    eventWinners 
  } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const draftCount = orgEvents.filter(e => e.status === 'draft' || e.status === 'review').length;
  const publishedCount = orgEvents.filter(e => e.status === 'published' || e.status === 'registration_open').length;
  const liveCount = orgEvents.filter(e => e.status === 'live').length;
  const completedCount = orgEvents.filter(e => e.status === 'completed').length;

  const totalRegistrations = eventRegistrations.length;
  const totalCheckedIn = eventRegistrations.filter(r => r.attendanceStatus === 'checked_in').length;
  const totalSubmissions = projectSubmissions.length;
  const totalCertsIssued = certificates.filter(c => c.organizerInstitutionId === currentOrganizer?.id || c.eventOrganizer === currentOrganizer?.institutionName).length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/50 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Institution Admin Workspace
              </span>
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Authorized
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {currentOrganizer?.institutionName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Coordinator: <strong>{currentOrganizer?.coordinatorName}</strong> ({currentOrganizer?.designation}) • {currentOrganizer?.department}
            </p>
          </div>

          <button
            onClick={() => setActiveSection('create_event')}
            className="self-start md:self-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>

        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Events</div>
          <div className="text-2xl font-black text-white">{orgEvents.length}</div>
          <div className="text-[10px] text-amber-400">{publishedCount} Published</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Drafts / In Review</div>
          <div className="text-2xl font-black text-amber-400">{draftCount}</div>
          <div className="text-[10px] text-slate-400">Pending Publish</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Registrations</div>
          <div className="text-2xl font-black text-blue-400">{totalRegistrations}</div>
          <div className="text-[10px] text-slate-400">Across 14 Colleges</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Checked In</div>
          <div className="text-2xl font-black text-green-400">{totalCheckedIn}</div>
          <div className="text-[10px] text-slate-400">QR Verified</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Submissions</div>
          <div className="text-2xl font-black text-purple-400">{totalSubmissions}</div>
          <div className="text-[10px] text-slate-400">Project Decks</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Certs Issued</div>
          <div className="text-2xl font-black text-amber-300">{totalCertsIssued}</div>
          <div className="text-[10px] text-slate-400">QR Authenticated</div>
        </div>

      </div>

      {/* Quick Launch Operations Bar */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Organizer Quick Launch Operations
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Create Event', icon: Plus, section: 'create_event', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { label: 'QR Check-In', icon: QrCode, section: 'attendance', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
            { label: 'Participants', icon: Users, section: 'registrations', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { label: 'Submissions', icon: FileText, section: 'submissions', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            { label: 'Certificates', icon: ShieldCheck, section: 'certificates', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
            { label: 'Announcements', icon: Bell, section: 'announcements', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
          ].map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => setActiveSection(act.section as OrganizerTab)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* College Hosted Events Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Active College Events & Competitions ({orgEvents.length})
          </h3>
          <button
            onClick={() => setActiveSection('events')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Manage All Events →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgEvents.map(event => (
            <div
              key={event.id}
              className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      event.status === 'published' ? 'bg-green-950 text-green-300 border border-green-800' :
                      event.status === 'draft' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                      event.status === 'review' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      STATUS: {event.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{event.code || 'CODE-TBD'}</span>
                  </div>

                  <h4 className="font-bold text-base text-white mt-1.5">{event.title}</h4>
                  <p className="text-xs text-slate-400">{event.date} • {event.venue}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
                <div className="p-2 bg-slate-900 rounded-xl">
                  <div className="font-bold text-white">{event.registeredTeamsCount}</div>
                  <div className="text-[10px] text-slate-400">Teams</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <div className="font-bold text-white">{event.mode}</div>
                  <div className="text-[10px] text-slate-400">Mode</div>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <div className="font-bold text-amber-400">{event.prizes[0]?.amount || '₹1,50,000'}</div>
                  <div className="text-[10px] text-slate-400">Prize Pool</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveSection('events')}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Manage Lifecycle →
                </button>
                <button
                  onClick={() => setActiveSection('attendance')}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 text-[11px]"
                >
                  <QrCode className="w-3.5 h-3.5 text-green-400" />
                  Scan Check-In
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

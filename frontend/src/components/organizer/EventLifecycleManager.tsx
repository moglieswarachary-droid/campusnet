import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, Users, QrCode, FileText, 
  Award, ShieldCheck, Plus, Play, CheckCircle2, 
  Clock, AlertCircle, Copy, Edit3, ExternalLink, Filter, 
  Send, RefreshCw, Eye, AlertTriangle, Sparkles, Search,
  ArrowRight, MapPin
} from 'lucide-react';
import { EventStatus, EventItem } from '../../types';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const EventLifecycleManager: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    currentOrganizer, events, eventRegistrations, submitEventForApproval, 
    updateEventStatus, duplicateEvent, resubmitEventWithChanges 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Resubmission Modal
  const [resubmitTargetEvent, setResubmitTargetEvent] = useState<EventItem | null>(null);
  const [revisedTitle, setRevisedTitle] = useState('');
  const [revisedDescription, setRevisedDescription] = useState('');
  const [revisedNotes, setRevisedNotes] = useState('');

  // Live events filtered strictly for the authenticated organizer
  const orgEvents = events.filter(e => 
    e.organizerId === currentOrganizer?.id || 
    e.organizerId === currentOrganizer?.institutionId ||
    (currentOrganizer?.institutionName && e.organizer && e.organizer.toLowerCase().includes(currentOrganizer.institutionName.toLowerCase()))
  );

  const orgEventIds = new Set(orgEvents.map(e => e.id));
  const orgRegistrations = eventRegistrations.filter(r => orgEventIds.has(r.eventId));

  // Live KPI counts
  const publishedEventsCount = orgEvents.filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live').length;
  const draftEventsCount = orgEvents.filter(e => e.status === 'draft').length;
  const inReviewEventsCount = orgEvents.filter(e => 
    e.status === 'submitted' || 
    e.status === 'pending_admin_approval' || 
    e.status === 'pending_document_verification' || 
    e.status === 'changes_requested' || 
    e.status === 'review'
  ).length;

  const totalRegisteredTeams = orgEvents.reduce((acc, curr) => acc + (curr.registeredTeamsCount || 0), 0) + orgRegistrations.length;

  const filteredEvents = orgEvents.filter(e => {
    let matchesStatus = true;
    if (statusFilter === 'draft') matchesStatus = e.status === 'draft';
    else if (statusFilter === 'published') matchesStatus = e.status === 'published' || e.status === 'registration_open' || e.status === 'live';
    else if (statusFilter === 'pending_admin_approval') {
      matchesStatus = e.status === 'submitted' || e.status === 'pending_admin_approval' || e.status === 'pending_document_verification' || e.status === 'changes_requested' || e.status === 'review';
    } else if (statusFilter === 'completed') matchesStatus = e.status === 'completed';

    const matchesSearch = !searchFilter || 
      e.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      (e.code && e.code.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (e.eventType && e.eventType.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleOpenResubmit = (event: EventItem) => {
    setResubmitTargetEvent(event);
    setRevisedTitle(event.title);
    setRevisedDescription(event.description);
    setRevisedNotes('');
  };

  const handleExecuteResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitTargetEvent) return;

    resubmitEventWithChanges(resubmitTargetEvent.id, {
      title: revisedTitle,
      description: revisedDescription,
      adminReviewNotes: `Organizer Revision: ${revisedNotes || 'Updated as per Super Admin review requirements.'}`
    });

    setResubmitTargetEvent(null);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'published':
      case 'registration_open':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'submitted':
      case 'pending_document_verification':
      case 'pending_admin_approval':
      case 'review':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'changes_requested':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'live':
        return 'bg-red-50 text-red-800 border-red-300 animate-pulse';
      case 'completed':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Friendly Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-warm-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Institutional Event Management Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            College Events & Hackathon Lifecycles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your institution's hackathons, track student registrations, review drafts, and run live event operations.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('create_event')}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-lg transition-all cursor-pointer self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Host New Event</span>
        </button>
      </div>

      {/* 4 Connected Live KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{orgEvents.length}</div>
            <div className="text-xs font-semibold text-slate-500">Total Hosted Events</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{publishedEventsCount}</div>
            <div className="text-xs font-semibold text-slate-500">Published & Live</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{inReviewEventsCount + draftEventsCount}</div>
            <div className="text-xs font-semibold text-slate-500">Drafts / In Review</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalRegisteredTeams}</div>
            <div className="text-xs font-semibold text-slate-500">Registered Teams</div>
          </div>
        </div>

      </div>

      {/* Clean Filters & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-warm-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: `All Events (${orgEvents.length})` },
            { id: 'published', label: `Published (${publishedEventsCount})` },
            { id: 'pending_admin_approval', label: `Under Review (${inReviewEventsCount})` },
            { id: 'draft', label: `Drafts (${draftEventsCount})` },
            { id: 'completed', label: 'Completed' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white shadow-warm-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search events by title or code..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Events Lifecycle Cards List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="p-10 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-4 shadow-warm-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                {searchFilter ? 'No events match your search' : 'No events in this category'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Host a new collegiate hackathon or symposium for {currentOrganizer?.institutionName || 'your college'} to connect with students across India.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('create_event')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-warm-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Host Your First Event Now</span>
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-warm-sm hover:shadow-warm-md transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(event.status)}`}>
                      ● {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>

                    <span className="text-xs font-mono text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {event.code}
                    </span>

                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                      {event.eventType} • {event.mode}
                    </span>

                    {event.resubmissionCount && event.resubmissionCount > 0 ? (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        Resubmission #{event.resubmissionCount}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.venue}, {event.city}</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{event.registeredTeamsCount || 0} Registered Teams</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-700">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Prize: {event.prizes[0]?.amount || '₹1,00,000'}</span>
                    </span>
                  </div>

                  {/* Document Proofs Badges */}
                  {event.documents && event.documents.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-semibold">Attached Proofs:</span>
                      {event.documents.map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg"
                        >
                          <FileText className="w-3 h-3 text-amber-600" />
                          <span className="truncate max-w-[150px]">{doc.fileName}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Changes Requested Banner */}
                  {event.status === 'changes_requested' && event.adminReviewNotes && (
                    <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-bold text-orange-800">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span>Review Feedback / Changes Required:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed pl-5 text-orange-950">
                        {event.adminReviewNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
                  
                  {event.status === 'draft' && (
                    <>
                      <button
                        onClick={() => submitEventForApproval(event.id)}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-warm-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Review</span>
                      </button>
                      <button
                        onClick={() => setActiveSection('create_event')}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Edit Draft
                      </button>
                    </>
                  )}

                  {event.status === 'changes_requested' && (
                    <button
                      onClick={() => handleOpenResubmit(event)}
                      className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Edit & Resubmit Proposal</span>
                    </button>
                  )}

                  {(event.status === 'pending_admin_approval' || event.status === 'pending_document_verification' || event.status === 'submitted' || event.status === 'review') && (
                    <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3.5 py-2.5 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>In Review Queue</span>
                    </div>
                  )}

                  {(event.status === 'published' || event.status === 'approved') && (
                    <>
                      <button
                        onClick={() => updateEventStatus(event.id, 'live')}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-warm-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Live Operations</span>
                      </button>

                      <button
                        onClick={() => setActiveSection('registrations')}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View Registrations</span>
                      </button>
                    </>
                  )}

                  {event.status === 'live' && (
                    <>
                      <button
                        onClick={() => setActiveSection('attendance')}
                        className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-warm-xs"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Attendance Scanner</span>
                      </button>

                      <button
                        onClick={() => updateEventStatus(event.id, 'completed')}
                        className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {event.status === 'completed' && (
                    <button
                      onClick={() => setActiveSection('certificates')}
                      className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Issue Certificates</span>
                    </button>
                  )}

                  <button
                    onClick={() => duplicateEvent(event.id)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                    title="Duplicate Event Template"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                </div>

              </div>

              {/* Status Progression Bar */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold overflow-x-auto no-scrollbar gap-2">
                  <span className={event.status === 'draft' ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200' : 'text-slate-400'}>
                    1. Draft
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className={event.status === 'pending_admin_approval' || event.status === 'changes_requested' ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200' : 'text-slate-400'}>
                    2. Document Review
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className={event.status === 'published' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200' : 'text-slate-400'}>
                    3. Published & Live
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className={event.status === 'completed' ? 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200' : 'text-slate-400'}>
                    4. Completed
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Resubmission Modal */}
      {resubmitTargetEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Resubmit Proposal: {resubmitTargetEvent.code}
                </h3>
              </div>
              <button
                onClick={() => setResubmitTargetEvent(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-900">
              <strong>Admin Directive:</strong> {resubmitTargetEvent.adminReviewNotes}
            </div>

            <form onSubmit={handleExecuteResubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={revisedTitle}
                  onChange={e => setRevisedTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Revised Scope & Description</label>
                <textarea
                  rows={3}
                  value={revisedDescription}
                  onChange={e => setRevisedDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Response / Notes for Super Admin</label>
                <input
                  type="text"
                  value={revisedNotes}
                  onChange={e => setRevisedNotes(e.target.value)}
                  placeholder="Explain how review directives were addressed..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResubmitTargetEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-warm-xs"
                >
                  Submit Revisions to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

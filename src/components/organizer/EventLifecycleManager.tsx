import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, Users, QrCode, FileText, 
  Award, ShieldCheck, Plus, Play, CheckCircle2, 
  Clock, AlertCircle, Copy, Edit3, ExternalLink, Filter, 
  Send, RefreshCw, Eye, AlertTriangle 
} from 'lucide-react';
import { EventStatus, EventItem } from '../../types';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const EventLifecycleManager: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    currentOrganizer, events, submitEventForApproval, 
    updateEventStatus, duplicateEvent, resubmitEventWithChanges 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Resubmission Modal
  const [resubmitTargetEvent, setResubmitTargetEvent] = useState<EventItem | null>(null);
  const [revisedTitle, setRevisedTitle] = useState('');
  const [revisedDescription, setRevisedDescription] = useState('');
  const [revisedNotes, setRevisedNotes] = useState('');

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const filteredEvents = orgEvents.filter(e => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch = !searchFilter || e.title.toLowerCase().includes(searchFilter.toLowerCase()) || (e.code && e.code.toLowerCase().includes(searchFilter.toLowerCase()));
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
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'draft':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'submitted':
      case 'pending_document_verification':
      case 'pending_admin_approval':
      case 'review':
        return 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse';
      case 'changes_requested':
        return 'bg-orange-950 text-orange-300 border-orange-700';
      case 'rejected':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'live':
        return 'bg-red-950 text-red-300 border-red-800 animate-pulse';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            College Event Lifecycle & Management
          </h2>
          <p className="text-xs text-slate-400">
            Control the entire end-to-end lifecycle from Draft to Approval, Registration, Live Operations & Certificate Issuance.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('create_event')}
          className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Event Proposal</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'draft', label: 'Draft' },
            { id: 'pending_admin_approval', label: 'Under Review' },
            { id: 'changes_requested', label: 'Changes Requested' },
            { id: 'published', label: 'Published' },
            { id: 'live', label: 'Live' },
            { id: 'completed', label: 'Completed' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Search by event title or code..."
          className="w-full sm:w-64 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
        />
      </div>

      {/* Events Lifecycle List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-600" />
            <p className="font-bold text-white">No events match the selected status filter.</p>
            <p>Create a new competition or clear filters to view all institution events.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(event.status)}`}>
                      ● {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>

                    <span className="text-xs font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {event.code}
                    </span>

                    <span className="text-xs text-slate-400">
                      {event.eventType} • {event.mode}
                    </span>

                    {event.resubmissionCount && event.resubmissionCount > 0 ? (
                      <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                        Resubmission #{event.resubmissionCount}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-lg font-bold text-white">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.venue}, {event.city} ({event.district}, {event.state})</span>
                    <span>👥 {event.registeredTeamsCount} Registered Teams</span>
                    <span>🏆 Prize: {event.prizes[0]?.amount || '₹1,00,000'}</span>
                  </div>

                  {/* Document Badges */}
                  {event.documents && event.documents.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-semibold">Attached Proofs:</span>
                      {event.documents.map((doc, dIdx) => (
                        <a
                          key={dIdx}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span className="truncate max-w-[150px]">{doc.fileName}</span>
                          <Eye className="w-3 h-3 text-slate-500" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Changes Requested Banner */}
                  {event.status === 'changes_requested' && event.adminReviewNotes && (
                    <div className="p-3.5 rounded-2xl bg-orange-950/80 border border-orange-700/80 text-xs text-orange-200 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-bold text-orange-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Super Admin Review Feedback / Changes Required:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed pl-5 text-orange-100">
                        {event.adminReviewNotes}
                      </p>
                    </div>
                  )}

                  {/* Rejected Banner */}
                  {event.status === 'rejected' && event.adminReviewNotes && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700/80 text-xs text-rose-200 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-bold text-rose-300">
                        <AlertCircle className="w-4 h-4" />
                        <span>Proposal Declined:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed pl-5 text-rose-100">
                        {event.adminReviewNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Lifecycle Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
                  
                  {event.status === 'draft' && (
                    <button
                      onClick={() => submitEventForApproval(event.id)}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Approval</span>
                    </button>
                  )}

                  {event.status === 'changes_requested' && (
                    <button
                      onClick={() => handleOpenResubmit(event)}
                      className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Edit & Resubmit Proposal</span>
                    </button>
                  )}

                  {(event.status === 'pending_admin_approval' || event.status === 'pending_document_verification' || event.status === 'submitted' || event.status === 'review') && (
                    <div className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In Accreditation Queue</span>
                    </div>
                  )}

                  {(event.status === 'published' || event.status === 'approved') && (
                    <button
                      onClick={() => updateEventStatus(event.id, 'live')}
                      className="py-2 px-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Live Event</span>
                    </button>
                  )}

                  {event.status === 'live' && (
                    <>
                      <button
                        onClick={() => setActiveSection('attendance')}
                        className="py-2 px-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Attendance QR</span>
                      </button>

                      <button
                        onClick={() => updateEventStatus(event.id, 'completed')}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {event.status === 'completed' && (
                    <button
                      onClick={() => setActiveSection('certificates')}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Issue Certificates</span>
                    </button>
                  )}

                  <button
                    onClick={() => duplicateEvent(event.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                    title="Duplicate Event Template"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                </div>

              </div>

              {/* Status Progression Bar */}
              <div className="pt-3 border-t border-slate-900">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-bold overflow-x-auto no-scrollbar gap-2">
                  <span className={event.status === 'draft' ? 'text-amber-400' : 'text-slate-400'}>1. Draft</span>
                  <span>→</span>
                  <span className={event.status === 'pending_admin_approval' || event.status === 'changes_requested' ? 'text-amber-400' : 'text-slate-400'}>2. Document Verification</span>
                  <span>→</span>
                  <span className={event.status === 'published' ? 'text-green-400' : 'text-slate-400'}>3. Accredited & Published</span>
                  <span>→</span>
                  <span className={event.status === 'live' ? 'text-red-400' : 'text-slate-400'}>4. Live Event</span>
                  <span>→</span>
                  <span className={event.status === 'completed' ? 'text-blue-400' : 'text-slate-400'}>5. Completed</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Resubmission Modal */}
      {resubmitTargetEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Resubmit Proposal: {resubmitTargetEvent.code}
                </h3>
              </div>
              <button
                onClick={() => setResubmitTargetEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-orange-950/60 rounded-xl border border-orange-800 text-xs text-orange-200">
              <strong>Admin Directive:</strong> {resubmitTargetEvent.adminReviewNotes}
            </div>

            <form onSubmit={handleExecuteResubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  value={revisedTitle}
                  onChange={e => setRevisedTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Revised Scope & Description</label>
                <textarea
                  rows={3}
                  value={revisedDescription}
                  onChange={e => setRevisedDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Response / Notes for Super Admin</label>
                <input
                  type="text"
                  value={revisedNotes}
                  onChange={e => setRevisedNotes(e.target.value)}
                  placeholder="Explain how review directives were addressed..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResubmitTargetEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
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

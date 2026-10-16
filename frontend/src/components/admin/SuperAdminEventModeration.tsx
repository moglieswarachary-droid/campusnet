import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, CheckCircle2, XCircle, AlertTriangle, 
  Eye, Building2, Calendar, MapPin, Award, Search, 
  FileText, ExternalLink, RefreshCw, Clock, ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { EventItem } from '../../types';

export const SuperAdminEventModeration: React.FC = () => {
  const { 
    events, approveAndPublishEvent, requestEventChanges, 
    rejectEventWithReason, updateEventStatus, addToast 
  } = useApp();

  const [filter, setFilter] = useState<'pending' | 'changes_requested' | 'published' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & form state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(() => {
    return events.find(e => 
      e.status === 'review' || 
      e.status === 'pending_admin_approval' || 
      e.status === 'pending_document_verification' || 
      e.status === 'submitted'
    ) || events[0] || null;
  });

  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  const filteredEvents = events.filter(e => {
    const isPending = e.status === 'review' || 
      e.status === 'pending_admin_approval' || 
      e.status === 'pending_document_verification' || 
      e.status === 'submitted';
    
    let matchesFilter = true;
    if (filter === 'pending') matchesFilter = isPending;
    else if (filter === 'changes_requested') matchesFilter = e.status === 'changes_requested';
    else if (filter === 'published') matchesFilter = e.status === 'published' || e.status === 'live';
    else matchesFilter = true;

    const matchesSearch = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (e.code && e.code.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleApprove = () => {
    if (!selectedEvent) return;
    approveAndPublishEvent(selectedEvent.id);
    addToast({
      type: 'success',
      title: 'Event Accredited & Published',
      message: `Event "${selectedEvent.title}" is now publicly discoverable across CampusNet India.`
    });
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !reviewNotesInput.trim()) return;
    requestEventChanges(selectedEvent.id, reviewNotesInput.trim());
    setShowChangesModal(false);
    setReviewNotesInput('');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !rejectReasonInput.trim()) return;
    rejectEventWithReason(selectedEvent.id, rejectReasonInput.trim());
    setShowRejectModal(false);
    setRejectReasonInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              Quality & Compliance Queue
            </span>
            <span className="text-xs text-slate-400">National Event Accreditation & Audit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            College Event Approval & Moderation Queue
          </h2>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'pending', label: 'Pending Review' },
            { id: 'changes_requested', label: 'Changes Requested' },
            { id: 'published', label: 'Published & Live' },
            { id: 'all', label: 'All Events' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Queue & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Events Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search queue by event, institution, code..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
            />
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
              No events found matching this queue filter.
            </div>
          ) : (
            filteredEvents.map(event => {
              const isSelected = selectedEvent?.id === event.id;
              const isPending = event.status === 'review' || 
                event.status === 'pending_admin_approval' || 
                event.status === 'pending_document_verification' || 
                event.status === 'submitted';

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-red-500 shadow-xl'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 truncate max-w-[200px]">
                      {event.organizer}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPending ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                      event.status === 'published' ? 'bg-green-950 text-green-300 border border-green-800' :
                      event.status === 'changes_requested' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                      event.status === 'rejected' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{event.description}</p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-900">
                    <span>{event.city}, {event.state}</span>
                    <span className="font-mono text-slate-400 font-bold">{event.code}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Moderation Action Inspector */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
          {selectedEvent ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400">{selectedEvent.organizer}</span>
                  <h3 className="text-lg font-black text-white mt-0.5">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Coordinator: <strong className="text-slate-200">{selectedEvent.coordinatorName || 'Institutional Dean'}</strong> 
                    {selectedEvent.coordinatorEmail && ` • ${selectedEvent.coordinatorEmail}`}
                    {selectedEvent.coordinatorPhone && ` • ${selectedEvent.coordinatorPhone}`}
                  </p>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${
                  selectedEvent.status === 'published' ? 'bg-green-950 text-green-300 border-green-800' :
                  selectedEvent.status === 'changes_requested' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                  selectedEvent.status === 'rejected' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                  'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {selectedEvent.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              {/* Event Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Dates</div>
                  <div className="font-bold text-white mt-0.5">{selectedEvent.date}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
                  <div className="font-bold text-white mt-0.5">{selectedEvent.city}, {selectedEvent.state}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">District</div>
                  <div className="font-bold text-white mt-0.5">{selectedEvent.district || 'Main District'}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Prize Pool</div>
                  <div className="font-bold text-amber-300 mt-0.5">{selectedEvent.prizes[0]?.amount || '₹1,00,000'}</div>
                </div>
              </div>

              {/* Mandatory Documents Section */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold uppercase text-amber-400 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Mandatory Accreditation Documents
                  </span>
                  <span className="text-[11px] text-slate-400">Verified institutional proofs</span>
                </div>

                {selectedEvent.documents && selectedEvent.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEvent.documents.map((doc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate text-xs">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{doc.fileName} • {doc.fileSize}</p>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors flex-shrink-0"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Default institutional affiliation certificate attached on file.</span>
                  </div>
                )}
              </div>

              {/* Description & Problem Statement */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold uppercase text-slate-400 text-[10px]">Problem Statement Brief</div>
                <p className="text-slate-300 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Review Notes / Changes Requested History */}
              {selectedEvent.adminReviewNotes && (
                <div className="p-4 bg-orange-950/40 rounded-2xl border border-orange-700/60 text-xs space-y-1">
                  <div className="font-bold text-orange-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active Review Directives / History:</span>
                  </div>
                  <p className="text-orange-100 text-[11.5px] leading-relaxed pl-5">
                    {selectedEvent.adminReviewNotes}
                  </p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleApprove}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish to Public Network</span>
                  </button>

                  <button
                    onClick={() => setShowChangesModal(true)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-orange-950 text-orange-300 border border-slate-800 hover:border-orange-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 hover:border-rose-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>

                {selectedEvent.status === 'published' && (
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <span>This event is currently <strong>PUBLISHED</strong> on public discovery.</span>
                    <button
                      onClick={() => updateEventStatus(selectedEvent.id, 'draft')}
                      className="text-red-400 hover:underline font-bold cursor-pointer"
                    >
                      Suspend / Take Offline
                    </button>
                  </div>
                )}
              </div>

              {/* Request Changes Modal */}
              {showChangesModal && (
                <div className="p-4 rounded-2xl bg-orange-950/60 border border-orange-500/50 space-y-3 text-xs animate-in fade-in">
                  <div className="font-bold text-orange-300">Specify Directives & Required Changes:</div>
                  <textarea
                    rows={3}
                    value={reviewNotesInput}
                    onChange={e => setReviewNotesInput(e.target.value)}
                    placeholder="e.g. Please clarify hardware evaluation criteria, confirm lab access hours, and upload revised Dean signature letter..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowChangesModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestChanges}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs"
                    >
                      Dispatch Change Directives
                    </button>
                  </div>
                </div>
              )}

              {/* Rejection Modal */}
              {showRejectModal && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 space-y-3 text-xs animate-in fade-in">
                  <div className="font-bold text-rose-300">Reason for Proposal Rejection:</div>
                  <textarea
                    rows={3}
                    value={rejectReasonInput}
                    onChange={e => setRejectReasonInput(e.target.value)}
                    placeholder="Specify why this proposal cannot be accredited on CampusNet..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-rose-500"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Decline Proposal
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select an event from the moderation queue to review specifications and approve publication.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

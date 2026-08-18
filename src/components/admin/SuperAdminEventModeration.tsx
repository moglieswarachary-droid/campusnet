import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, CheckCircle2, XCircle, AlertTriangle, 
  Eye, Building2, Calendar, MapPin, Award, Search 
} from 'lucide-react';
import { EventItem } from '../../types';

export const SuperAdminEventModeration: React.FC = () => {
  const { events, approveEvent, rejectEvent, updateEventStatus } = useApp();

  const [filter, setFilter] = useState<'review' | 'all' | 'published'>('review');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(events.find(e => e.status === 'review') || events[0]);
  const [approvalComments, setApprovalComments] = useState('Approved by National Board for public student registration.');
  const [rejectionComments, setRejectionComments] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredEvents = events.filter(e => {
    if (filter === 'review') return e.status === 'review';
    if (filter === 'published') return e.status === 'published';
    return true;
  });

  const handleApprove = () => {
    if (!selectedEvent) return;
    approveEvent(selectedEvent.id, approvalComments);
  };

  const handleReject = () => {
    if (!selectedEvent || !rejectionComments.trim()) return;
    rejectEvent(selectedEvent.id, rejectionComments);
    setShowRejectModal(false);
    setRejectionComments('');
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
            <span className="text-xs text-slate-400">National Event Accreditation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            College Event Approval & Moderation Queue
          </h2>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'review', label: 'Pending Review' },
            { id: 'published', label: 'Published & Live' },
            { id: 'all', label: 'All National Events' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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
          {filteredEvents.length === 0 ? (
            <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
              No events found in this moderation queue.
            </div>
          ) : (
            filteredEvents.map(event => {
              const isSelected = selectedEvent?.id === event.id;
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
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {event.organizer}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      event.status === 'review' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                      event.status === 'published' ? 'bg-green-950 text-green-300 border border-green-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{event.description}</p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-900">
                    <span>{event.city}, {event.state}</span>
                    <span className="font-mono text-slate-400">{event.code}</span>
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
                  <p className="text-xs text-slate-400">
                    Coordinator: {selectedEvent.coordinatorName || 'Institutional Dean'} ({selectedEvent.coordinatorEmail})
                  </p>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  selectedEvent.status === 'review' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  selectedEvent.status === 'published' ? 'bg-green-950 text-green-300 border-green-800' :
                  'bg-slate-900 text-slate-300 border-slate-800'
                }`}>
                  STATUS: {selectedEvent.status.toUpperCase()}
                </span>
              </div>

              {/* Event Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Dates</div>
                  <div className="font-bold text-white mt-0.5">{selectedEvent.date}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Venue & City</div>
                  <div className="font-bold text-white mt-0.5">{selectedEvent.venue}, {selectedEvent.city}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Top Prize Pool</div>
                  <div className="font-bold text-amber-300 mt-0.5">{selectedEvent.prizes[0]?.amount || '₹1,00,000'}</div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold uppercase text-slate-400 text-[10px]">Problem Statement Brief</div>
                <p className="text-slate-300 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Rules check */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold uppercase text-slate-400 text-[10px]">Guidelines & Fair Play Rules</div>
                <ul className="space-y-1 text-slate-300">
                  {selectedEvent.rules?.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg">
                      <span className="text-red-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                {selectedEvent.status === 'review' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleApprove}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish to CampusNet India</span>
                    </button>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 hover:border-red-800 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Return for Modifications</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>This event is currently <strong>{selectedEvent.status.toUpperCase()}</strong> on public discovery.</span>
                    <button
                      onClick={() => updateEventStatus(selectedEvent.id, 'draft')}
                      className="text-red-400 hover:underline font-bold"
                    >
                      Suspend / Take Offline
                    </button>
                  </div>
                )}
              </div>

              {/* Rejection Modal */}
              {showRejectModal && (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3 text-xs animate-in fade-in">
                  <div className="font-bold text-red-300">Mandatory Correction Notes for Organizer:</div>
                  <textarea
                    rows={3}
                    value={rejectionComments}
                    onChange={e => setRejectionComments(e.target.value)}
                    placeholder="Specify why the event was returned (e.g. clarify prize disbursement terms, add GPS coordinates)..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                    >
                      Dispatch Revision Notice
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

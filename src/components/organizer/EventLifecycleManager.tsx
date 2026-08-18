import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Calendar, Users, QrCode, FileText, 
  Award, ShieldCheck, Plus, Play, CheckCircle2, 
  Clock, AlertCircle, Copy, Edit3, ExternalLink, Filter 
} from 'lucide-react';
import { EventStatus, EventItem } from '../../types';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const EventLifecycleManager: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    currentOrganizer, events, submitEventForApproval, 
    updateEventStatus, duplicateEvent, publishEvent 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const filteredEvents = orgEvents.filter(e => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch = !searchFilter || e.title.toLowerCase().includes(searchFilter.toLowerCase()) || (e.code && e.code.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

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
          className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'draft', 'review', 'published', 'live', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Events' : st}
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
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      event.status === 'published' ? 'bg-green-950 text-green-300 border-green-800' :
                      event.status === 'draft' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                      event.status === 'review' ? 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse' :
                      event.status === 'live' ? 'bg-red-950 text-red-300 border-red-800 animate-pulse' :
                      'bg-blue-950 text-blue-300 border-blue-800'
                    }`}>
                      ● {event.status.toUpperCase()}
                    </span>

                    <span className="text-xs font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {event.code}
                    </span>

                    <span className="text-xs text-slate-400">
                      {event.eventType} • {event.mode}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.venue}, {event.city}</span>
                    <span>👥 {event.registeredTeamsCount} Registered Teams</span>
                    <span>🏆 Prize: {event.prizes[0]?.amount || '₹1,00,000'}</span>
                  </div>
                </div>

                {/* Lifecycle Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
                  
                  {event.status === 'draft' && (
                    <button
                      onClick={() => submitEventForApproval(event.id)}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <span>Submit for Approval</span>
                    </button>
                  )}

                  {event.status === 'review' && (
                    <div className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Super Admin Review</span>
                    </div>
                  )}

                  {event.status === 'published' && (
                    <button
                      onClick={() => updateEventStatus(event.id, 'live')}
                      className="py-2 px-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Live Event</span>
                    </button>
                  )}

                  {event.status === 'live' && (
                    <>
                      <button
                        onClick={() => setActiveSection('attendance')}
                        className="py-2 px-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Attendance QR</span>
                      </button>

                      <button
                        onClick={() => updateEventStatus(event.id, 'completed')}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {event.status === 'completed' && (
                    <button
                      onClick={() => setActiveSection('certificates')}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Issue Certificates</span>
                    </button>
                  )}

                  <button
                    onClick={() => duplicateEvent(event.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    title="Duplicate Event Template"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                </div>

              </div>

              {/* Status Progression Bar */}
              <div className="pt-3 border-t border-slate-900">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-bold">
                  <span className={event.status === 'draft' ? 'text-amber-400' : 'text-slate-400'}>1. Draft</span>
                  <span>→</span>
                  <span className={event.status === 'review' ? 'text-amber-400' : 'text-slate-400'}>2. Admin Review</span>
                  <span>→</span>
                  <span className={event.status === 'published' ? 'text-green-400' : 'text-slate-400'}>3. Published</span>
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

    </div>
  );
};

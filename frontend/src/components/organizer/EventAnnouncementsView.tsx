import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Send, Users, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const EventAnnouncementsView: React.FC = () => {
  const { events, currentOrganizer, eventAnnouncements, createEventAnnouncement } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'teams' | 'mentors' | 'judges'>('all');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const announcements = eventAnnouncements.filter(a => a.eventId === selectedEventId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    createEventAnnouncement({
      eventId: selectedEventId,
      eventTitle: currentEvent.title,
      organizerId: currentOrganizer?.id || 'KEC-DEMO-001',
      title: title.trim(),
      message: message.trim(),
      audience
    });

    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              Real-Time Push Broadcast
            </span>
            <span className="text-xs text-slate-400">Direct Alerts to Student Dashboards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Event Announcements & Broadcaster
          </h2>
        </div>

        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-500 shadow-xl self-start sm:self-auto"
        >
          {orgEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Compose Form */}
        <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Compose Broadcast
          </h3>

          <form onSubmit={handleSend} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                Announcement Subject / Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Schedule Update: Hardware Demonstration at 3:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                Target Audience *
              </label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
              >
                <option value="all">📢 All Registered Participants</option>
                <option value="teams">👥 Team Leaders Only</option>
                <option value="mentors">🎓 Faculty Mentors</option>
                <option value="judges">⚖ Jury Panel</option>
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                Broadcast Content / Instructions *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your official announcement or schedule instructions here..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </form>
        </div>

        {/* Right: Broadcast Feed */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Dispatched Broadcasts ({announcements.length})
          </h3>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No announcements dispatched yet for this event.
              </div>
            ) : (
              announcements.map(anc => (
                <div key={anc.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{anc.title}</span>
                    <span className="text-[10px] text-amber-400 uppercase font-mono">
                      Target: {anc.audience}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{anc.message}</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    Dispatched {new Date(anc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {currentOrganizer?.coordinatorName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

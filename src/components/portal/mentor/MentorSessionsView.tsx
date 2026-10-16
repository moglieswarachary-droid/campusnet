import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calendar, Clock, Video, Users, Plus, CheckCircle2,
  AlertCircle, ExternalLink, MapPin, Trash2, Edit3, X
} from 'lucide-react';

interface MentoringSession {
  id: string;
  title: string;
  teamId: string;
  teamName: string;
  date: string;
  time: string;
  type: 'Video Consultation' | 'Lab Clinic' | 'Milestone Review';
  status: 'upcoming' | 'completed' | 'cancelled';
  attendeesCount: number;
  meetingLinkActive: boolean;
  notes?: string;
}

export const MentorSessionsView: React.FC = () => {
  const { teams, startVideoMeeting, addToast } = useApp();

  const [sessions, setSessions] = useState<MentoringSession[]>([
    {
      id: 'sess-01',
      title: 'KrishiDrone AI — Architecture & ROS 2 Telemetry Review',
      teamId: teams[0]?.id || 'team-01',
      teamName: teams[0]?.name || 'Team AgriVision',
      date: 'Today, April 16, 2026',
      time: '04:30 PM - 05:30 PM IST',
      type: 'Video Consultation',
      status: 'upcoming',
      attendeesCount: 6,
      meetingLinkActive: true,
      notes: 'Review TensorRT sub-millisecond latency benchmarks and motor cut-off watchdog before field trial.'
    },
    {
      id: 'sess-02',
      title: 'Team MedEdge — Wearable ECG Signal Processing Clinic',
      teamId: 'team-02',
      teamName: 'Team MedEdge',
      date: 'Tomorrow, April 17, 2026',
      time: '03:00 PM - 03:45 PM IST',
      type: 'Lab Clinic',
      status: 'upcoming',
      attendeesCount: 4,
      meetingLinkActive: true,
      notes: 'Evaluate STM32 fixed-point FIR filter latency in Hardware Lab 3.'
    },
    {
      id: 'sess-03',
      title: 'Distributed Consensus — Byzantine Fault Tolerance Review',
      teamId: 'team-03',
      teamName: 'Team Consensus',
      date: 'April 12, 2026',
      time: '02:00 PM - 03:00 PM IST',
      type: 'Milestone Review',
      status: 'completed',
      attendeesCount: 5,
      meetingLinkActive: false,
      notes: 'Reviewed leader election timeout adjustments under artificial jitter.'
    }
  ]);

  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTeam, setNewTeam] = useState(teams[0]?.name || 'Team AgriVision');
  const [newDate, setNewDate] = useState('April 23, 2026');
  const [newTime, setNewTime] = useState('04:00 PM - 05:00 PM IST');
  const [newType, setNewType] = useState<'Video Consultation' | 'Lab Clinic' | 'Milestone Review'>('Video Consultation');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: MentoringSession = {
      id: `sess-${Date.now()}`,
      title: newTitle.trim(),
      teamId: teams[0]?.id || 'team-01',
      teamName: newTeam,
      date: newDate,
      time: newTime,
      type: newType,
      status: 'upcoming',
      attendeesCount: 5,
      meetingLinkActive: true
    };

    setSessions(prev => [created, ...prev]);
    setIsAddSlotOpen(false);
    setNewTitle('');
    addToast({
      type: 'success',
      message: `Mentoring session "${created.title}" scheduled and invites dispatched.`
    });
  };

  const handleCancelSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled', meetingLinkActive: false } : s));
    addToast({ type: 'info', message: 'Session cancelled and student leads notified.' });
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Sessions & Office Hours Calendar
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                Real-Time Video Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage student consultation appointments, weekly project office hours, and launch encrypted team meeting rooms
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddSlotOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Add Session Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-[#12243A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12243A]">Schedule Mentoring Session</h3>
                <p className="text-xs text-slate-500">Create an interactive consultation slot for collegiate teams</p>
              </div>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Session Agenda / Topic</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Milestone 3 Architecture Review"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Team</label>
                  <select
                    value={newTeam}
                    onChange={e => setNewTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Session Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Video Consultation">Video Consultation</option>
                    <option value="Lab Clinic">Lab Clinic</option>
                    <option value="Milestone Review">Milestone Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs"
                >
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sessions Directory */}
      <div className="space-y-4">
        {sessions.map(s => {
          const isUpcoming = s.status === 'upcoming';

          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-4 transition-all ${
                isUpcoming ? 'border-teal-200/90' : 'border-slate-200/90 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-[#0F9488] border border-teal-200">
                      {s.type}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      s.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      s.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Team: <strong>{s.teamName}</strong></span>
                  </div>

                  <h3 className="text-base font-bold text-[#12243A] mt-1">
                    {s.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-[#0F9488]" />
                      {s.date} • {s.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {s.attendeesCount} Students Confirmed
                    </span>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-600 bg-[#F3F6FA] p-3 rounded-xl border border-slate-200/70 mt-2">
                      {s.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {isUpcoming && (
                    <>
                      <button
                        onClick={() => handleCancelSession(s.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>

                      {s.meetingLinkActive && (
                        <button
                          onClick={() => startVideoMeeting(s.teamId)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Live Room</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Bell, Award, MessageSquare, Video, CheckCircle2,
  Clock, ShieldAlert, Trash2, ArrowRight, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MentorNotificationsView: React.FC = () => {
  const { notifications, mentorshipRequests, addToast } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Requests' | 'Milestones' | 'Sessions'>('All');

  // Build realistic mentor notifications list
  const [mentorAlerts, setMentorAlerts] = useState([
    {
      id: 'notif-1',
      category: 'Requests',
      title: 'New Student Guidance Request: Team AeroInnovators',
      description: 'Aarav Sharma submitted an edge-AI drone guidance application for SIH 2026.',
      timestamp: '25 mins ago',
      actionUrl: '/mentor/requests',
      actionLabel: 'Review Request',
      read: false,
      icon: MessageSquare,
      color: 'teal'
    },
    {
      id: 'notif-2',
      category: 'Milestones',
      title: 'Milestone 2 Ready for Evaluation: KrishiDrone AI',
      description: 'Submitted code repository link and TensorRT benchmark metrics for Stage 2.',
      timestamp: '2 hours ago',
      actionUrl: '/mentor/reviews',
      actionLabel: 'Evaluate Rubric',
      read: false,
      icon: Award,
      color: 'amber'
    },
    {
      id: 'notif-3',
      category: 'Sessions',
      title: 'Office Hour Sync Confirmed',
      description: 'Team MedEdge booked Wednesday 4:00 PM for Wearable ECG Clinic.',
      timestamp: '5 hours ago',
      actionUrl: '/mentor/sessions',
      actionLabel: 'View Calendar',
      read: true,
      icon: Video,
      color: 'teal'
    },
    {
      id: 'notif-4',
      category: 'Milestones',
      title: 'Certificates Dispatched: Team SmartGrid',
      description: 'Cryptographic mentorship credentials verified and delivered to student credentials wallet.',
      timestamp: 'Yesterday',
      actionUrl: '/mentor/certificates',
      actionLabel: 'View Credential',
      read: true,
      icon: CheckCircle2,
      color: 'emerald'
    }
  ]);

  const handleMarkAllRead = () => {
    setMentorAlerts(prev => prev.map(a => ({ ...a, read: true })));
    addToast({ type: 'success', message: 'All notifications marked as read.' });
  };

  const handleClearAlert = (id: string) => {
    setMentorAlerts(prev => prev.filter(a => a.id !== id));
  };

  const filtered = mentorAlerts.filter(a => {
    if (filterType === 'All') return true;
    return a.category === filterType;
  });

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Faculty Notifications
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                {mentorAlerts.filter(a => !a.read).length} Unread
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct student pitches, milestone submissions, and calendar sync updates
            </p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-slate-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['All', 'Requests', 'Milestones', 'Sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterType === tab
                ? 'bg-[#12243A] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.read
                  ? 'bg-white border-slate-200/80 shadow-2xs'
                  : 'bg-teal-50/30 border-teal-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  alert.color === 'amber' ? 'bg-amber-50 text-[#F3A640] border-amber-200/70' :
                  alert.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' :
                  'bg-teal-50 text-[#0F9488] border-teal-200/70'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-[#12243A]">{alert.title}</h3>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-[#0F9488]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{alert.description}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">{alert.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  to={alert.actionUrl}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                >
                  <span>{alert.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleClearAlert(alert.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">No notifications found</h4>
            <p className="text-xs text-slate-400 mt-1">You are completely up to date with student and team activity.</p>
          </div>
        )}
      </div>

    </div>
  );
};

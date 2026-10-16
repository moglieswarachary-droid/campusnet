import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, CheckCircle2, Clock, ShieldCheck, AlertCircle, 
  Users, Award, Sparkles, Filter, Trash2, ArrowRight
} from 'lucide-react';

interface NotificationEntry {
  id: string;
  type: 'registration' | 'verification' | 'submission' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  linkText?: string;
  linkAction?: string;
}

export const OrganizationNotificationsView: React.FC = () => {
  const { currentOrganizer, addToast } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [notifications, setNotifications] = useState<NotificationEntry[]>([
    {
      id: 'notif-org-1',
      type: 'registration',
      title: 'New Team Registration for AI & Robotics Hackathon',
      description: 'Team "AeroInnovators" from NIT Karnataka (4 members) registered for Round 1 Problem Statement.',
      timestamp: '15 mins ago',
      read: false,
      linkText: 'View Registration',
      linkAction: '/organization/registrations'
    },
    {
      id: 'notif-org-2',
      type: 'verification',
      title: 'Institutional Verification Approved & Audited',
      description: 'AICTE / UGC accreditation audit documents verified by National Review Board. Full event publishing access active.',
      timestamp: '2 hours ago',
      read: false,
      linkText: 'View Audit Status',
      linkAction: '/organization/verification'
    },
    {
      id: 'notif-org-3',
      type: 'submission',
      title: 'Project Submission Ready for Evaluation',
      description: 'Team "TensorNode" uploaded GitHub repo and presentation slides for Stage 2 judging.',
      timestamp: '1 day ago',
      read: true,
      linkText: 'Open Submissions',
      linkAction: '/organization/submissions'
    },
    {
      id: 'notif-org-4',
      type: 'system',
      title: 'QR Attendance Sync Active',
      description: 'Check-in gateway is ready for real-time offline-first QR scanning during student symposium check-in.',
      timestamp: '2 days ago',
      read: true,
      linkText: 'Scanner Portal',
      linkAction: '/organization/attendance'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({ type: 'info', message: 'All institutional notifications marked as read.' });
  };

  const handleClearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
    addToast({ type: 'info', message: 'Cleared read notifications.' });
  };

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Alerts & Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding event registrations, student submissions, and accreditation compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Mark All Read
            </button>
          )}
          <button
            onClick={handleClearRead}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Clear Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'registration', 'verification', 'submission', 'system'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterType === type 
                ? 'bg-amber-500 text-slate-950 shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {type === 'all' ? 'All Alerts' : type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                !n.read 
                  ? 'bg-amber-50/40 border-amber-200/80 shadow-xs' 
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'registration' ? 'bg-blue-100 text-blue-700' :
                  n.type === 'verification' ? 'bg-emerald-100 text-emerald-700' :
                  n.type === 'submission' ? 'bg-purple-100 text-purple-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {n.type === 'registration' && <Users className="w-5 h-5" />}
                  {n.type === 'verification' && <ShieldCheck className="w-5 h-5" />}
                  {n.type === 'submission' && <Award className="w-5 h-5" />}
                  {n.type === 'system' && <Bell className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{n.timestamp}</p>
                </div>
              </div>

              {n.linkAction && (
                <a
                  href={n.linkAction}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0"
                >
                  <span>{n.linkText || 'View Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No notifications found in this category.</p>
            <p className="text-xs text-slate-400">You are all caught up with your institution workspace!</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Bell, BookOpen, Users, Calendar, Award, Trash2, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResearcherNotificationsView: React.FC = () => {
  const { addToast } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Citations' | 'Reviews' | 'Applications'>('All');

  const [alerts, setAlerts] = useState([
    {
      id: 'notif-1',
      category: 'Citations',
      title: 'New Citation Recorded in IEEE Transactions',
      description: 'Your paper "Energy-Efficient Spiking Graph Convolutions" was cited by a Max Planck research group.',
      time: '3 hours ago',
      actionUrl: '/researcher/publications',
      actionLabel: 'View Paper',
      read: false,
      color: 'purple'
    },
    {
      id: 'notif-2',
      category: 'Reviews',
      title: 'Manuscript Reviewer 2 Response Due in 12 Days',
      description: 'IEEE Transactions on Computers requested minor revisions on hardware emulation results.',
      time: '6 hours ago',
      actionUrl: '/researcher/milestones',
      actionLabel: 'View Milestone',
      read: false,
      color: 'amber'
    },
    {
      id: 'notif-3',
      category: 'Applications',
      title: 'Undergraduate RA Candidate Submission',
      description: 'Aarav Sharma (NIT Karnataka) applied for your Edge PyTorch research position.',
      time: '1 day ago',
      actionUrl: '/researcher/collaborations',
      actionLabel: 'Review Candidate',
      read: true,
      color: 'teal'
    }
  ]);

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    addToast({ type: 'success', message: 'All scholarly notifications marked as read.' });
  };

  const handleClearAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const filtered = alerts.filter(a => {
    if (filterType === 'All') return true;
    return a.category === filterType;
  });

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Research & Scholarly Alerts
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {alerts.filter(a => !a.read).length} Unread
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Citation alerts, peer review requests, undergraduate RA applicant submissions, and grant deadlines
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
        {(['All', 'Citations', 'Reviews', 'Applications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterType === tab
                ? 'bg-[#182442] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map(alert => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alert.read ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-purple-50/40 border-purple-200/80 shadow-xs'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9.5px] font-black uppercase px-2 py-0.2 rounded-md bg-white border border-slate-200 text-slate-700">
                  {alert.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#182442]">{alert.title}</h3>
                {!alert.read && <span className="w-2 h-2 rounded-full bg-[#6954C8]" />}
              </div>
              <p className="text-xs text-slate-600">{alert.description}</p>
              <span className="text-[10px] text-slate-400 block pt-0.5">{alert.time}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                to={alert.actionUrl}
                className="px-3.5 py-1.5 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
              >
                <span>{alert.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleClearAlert(alert.id)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Dismiss alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

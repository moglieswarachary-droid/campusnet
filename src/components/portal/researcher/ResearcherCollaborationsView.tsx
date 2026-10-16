import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users, Search, Filter, Plus, Mail, Video, MessageSquare,
  CheckCircle2, Clock, Check, X, ExternalLink, ShieldCheck,
  Send, Sparkles, ArrowRight
} from 'lucide-react';

interface CollaborationRequest {
  id: string;
  partnerName: string;
  institution: string;
  topic: string;
  type: 'Joint Paper' | 'Research Assistant' | 'Grant Co-PI';
  status: 'active' | 'pending' | 'completed';
  progress?: number;
  avatar: string;
  notes: string;
  date: string;
}

export const ResearcherCollaborationsView: React.FC = () => {
  const { addToast, startVideoMeeting } = useApp();
  const [activeTab, setActiveTab] = useState<'Active' | 'Incoming' | 'Undergraduate RAs'>('Active');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite modal form
  const [inviteName, setInviteName] = useState('');
  const [inviteInstitution, setInviteInstitution] = useState('');
  const [inviteTopic, setInviteTopic] = useState('');

  // Collaborations state with local persistence
  const [collabList, setCollabList] = useState<CollaborationRequest[]>([
    {
      id: 'c-1',
      partnerName: 'Dr. Arvind Rao',
      institution: 'IIT Bombay',
      topic: 'Hardware-in-the-Loop Edge Telemetry for Autonomous Agro-UAVs',
      type: 'Joint Paper',
      status: 'active',
      progress: 75,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      notes: 'Target venue: ACM SenSys 2026. Experimental telemetry node benchmarks completed.',
      date: 'Active Sprint'
    },
    {
      id: 'c-2',
      partnerName: 'Prof. Somnath Ghosh',
      institution: 'IISc Computational Sciences',
      topic: 'Sparse Matrix Acceleration on Custom RISC-V Silicon',
      type: 'Grant Co-PI',
      status: 'active',
      progress: 60,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      notes: 'SERB CRG grant co-supervision. Bi-weekly review on Thursdays.',
      date: 'Active Project'
    },
    {
      id: 'c-3',
      partnerName: 'Aarav Sharma (B.Tech AI, NITK)',
      institution: 'NIT Karnataka',
      topic: 'Edge TensorRT & ROS 2 Telemetry Benchmarking',
      type: 'Research Assistant',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      notes: 'Undergraduate RA candidate. PyTorch/Linux expert. Portfolio match score: 96%.',
      date: 'Applied 1 day ago'
    }
  ]);

  const handleApprove = (id: string, name: string) => {
    setCollabList(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    addToast({
      type: 'success',
      message: `Approved ${name} into active research consortium!`
    });
  };

  const handleDecline = (id: string, name: string) => {
    setCollabList(prev => prev.filter(c => c.id !== id));
    addToast({
      type: 'info',
      message: `Declined application from ${name}.`
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteTopic.trim()) {
      addToast({ type: 'error', message: 'Please provide collaborator name and research topic.' });
      return;
    }

    const newCollab: CollaborationRequest = {
      id: `c-${Date.now()}`,
      partnerName: inviteName.trim(),
      institution: inviteInstitution.trim() || 'Partner University',
      topic: inviteTopic.trim(),
      type: 'Joint Paper',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      notes: 'Collaboration proposal dispatched via academic network.',
      date: 'Dispatched today'
    };

    setCollabList([newCollab, ...collabList]);
    addToast({
      type: 'success',
      message: `Academic collaboration invitation sent to ${newCollab.partnerName}!`
    });

    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteInstitution('');
    setInviteTopic('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Collaborations & Co-Authors
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {collabList.filter(c => c.status === 'active').length} Active Partnerships
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cross-institutional research partnerships, co-authored conference drafts, and undergraduate RA supervision
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Co-Author</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['Active', 'Incoming', 'Undergraduate RAs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-[#182442] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Collaborations Cards */}
      <div className="space-y-4">
        {collabList.map(collab => (
          <div
            key={collab.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4 min-w-0">
              <img
                src={collab.avatar}
                alt={collab.partnerName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#182442]">{collab.partnerName}</h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-md bg-purple-50 text-[#6954C8] border border-purple-200/60">
                    {collab.type}
                  </span>
                  <span className="text-[10px] text-slate-400">({collab.institution})</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">{collab.topic}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{collab.notes}</p>
                
                {collab.progress !== undefined && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400">Draft Status:</span>
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#13877B] rounded-full" style={{ width: `${collab.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#13877B]">{collab.progress}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
              {collab.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprove(collab.id, collab.partnerName)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#13877B] hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept RA</span>
                  </button>
                  <button
                    onClick={() => handleDecline(collab.id, collab.partnerName)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    Decline
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startVideoMeeting(collab.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6954C8] text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Launch instant research sync"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Sync</span>
                  </button>
                  <a
                    href="mailto:partner@university.edu"
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Official academic mail"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Co-Author Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-[#182442]">Invite Co-Author / Collaborator</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Scholar / Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Malini Sengupta"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Institution / Research Lab</label>
                <input
                  type="text"
                  placeholder="e.g. IIT Madras / Max Planck Institute"
                  value={inviteInstitution}
                  onChange={(e) => setInviteInstitution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Topic / Scope *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe joint paper target, experimental dataset, or grant synergy..."
                  value={inviteTopic}
                  onChange={(e) => setInviteTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

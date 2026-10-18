import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageSquare, Check, X, HelpCircle, ShieldCheck, Clock,
  Filter, Search, User, ArrowRight, AlertCircle, Send,
  Sparkles, CheckCircle2, ChevronRight, BookOpen
} from 'lucide-react';
import { MentorshipRequest } from '../../../types';

export const MentorRequestsView: React.FC = () => {
  const {
    mentorshipRequests, respondToMentorshipRequest,
    currentUser, mentors, addToast
  } = useApp();

  const currentMentor = mentors.find(m =>
    (currentUser?.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && m.id === currentUser.id)
  ) || {
    id: currentUser?.id || 'mnt-current',
    name: currentUser?.name || 'Faculty Mentor',
    email: currentUser?.email || '',
    designation: 'Faculty Mentor',
    department: currentUser?.department || 'Engineering',
    institution: currentUser?.institution || 'Academic Network',
    avatar: currentUser?.avatar || ''
  };

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'info_requested' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for responding with note or requesting info
  const [activeModalRequest, setActiveModalRequest] = useState<MentorshipRequest | null>(null);
  const [modalAction, setModalAction] = useState<'accept' | 'decline' | 'info'>('accept');
  const [feedbackNote, setFeedbackNote] = useState('');

  // Filter requests strictly for this mentor
  const myRequests = mentorshipRequests.filter(r =>
    r.mentorId === currentMentor.id ||
    (currentMentor.email && (r as any).mentorEmail?.toLowerCase() === currentMentor.email.toLowerCase()) ||
    (Boolean(r.mentorName && currentMentor.name) && r.mentorName.toLowerCase() === currentMentor.name.toLowerCase())
  );

  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const acceptedCount = myRequests.filter(r => r.status === 'accepted').length;
  const maxCapacity = 5;

  const filteredRequests = myRequests.filter(r => {
    const matchesFilter = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = searchQuery.trim() === '' ||
      r.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenActionModal = (req: MentorshipRequest, action: 'accept' | 'decline' | 'info') => {
    setActiveModalRequest(req);
    setModalAction(action);
    setFeedbackNote(
      action === 'accept'
        ? 'Welcome to the advisory cohort. Please prepare your architecture diagram for Thursday office hours.'
        : action === 'info'
          ? 'Could you provide your latest GitHub repository link and hardware sensor schematics before review?'
          : 'Slots for this academic cycle are currently committed. Recommend reapplying in the next sprint.'
    );
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalRequest) return;

    const actionKey = modalAction === 'accept' ? 'accepted' : modalAction === 'decline' ? 'declined' : 'info_requested';
    respondToMentorshipRequest(activeModalRequest.id, actionKey, feedbackNote);

    addToast({
      type: modalAction === 'accept' ? 'success' : 'info',
      message: `Mentorship request from ${activeModalRequest.teamName} updated to ${actionKey.toUpperCase()}`
    });

    setActiveModalRequest(null);
    setFeedbackNote('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Student Mentorship Requests
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingCount} Pending Review
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review collegiate project pitches, evaluate technology fit, and manage student advisory intake
            </p>
          </div>
        </div>

        {/* Capacity Indicator Pill */}
        <div className="flex items-center gap-3 bg-[#F3F6FA] p-3 px-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Advisory Capacity</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-[#12243A]">{acceptedCount}</span>
              <span className="text-xs font-bold text-slate-400">/ {maxCapacity} Teams</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#0F9488] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            {maxCapacity - acceptedCount > 0 ? `${maxCapacity - acceptedCount} Slots Available` : 'At Capacity'}
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: `All (${myRequests.length})` },
            { key: 'pending', label: `Pending (${pendingCount})` },
            { key: 'accepted', label: `Accepted (${acceptedCount})` },
            { key: 'info_requested', label: 'Info Requested' },
            { key: 'declined', label: 'Declined' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === f.key
                  ? 'bg-[#0F9488] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search teams or projects..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488] shadow-2xs"
          />
        </div>
      </div>

      {/* Requests Feed */}
      <div className="space-y-4">
        {filteredRequests.map(req => {
          const isPending = req.status === 'pending';

          return (
            <div
              key={req.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs space-y-4 transition-all ${
                isPending ? 'border-amber-200/90 ring-1 ring-amber-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-[#0F9488] border border-teal-200">
                      {req.domain}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      req.status === 'declined' ? 'bg-red-50 text-red-700 border border-red-200' :
                      req.status === 'info_requested' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-[#F3A640]/20 text-[#12243A] border border-[#F3A640]/40 font-black'
                    }`}>
                      {req.status === 'info_requested' ? 'Info Requested' : req.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Requested by <strong>{req.requestedBy}</strong></span>
                  </div>

                  <h3 className="text-base font-bold text-[#12243A] mt-1">
                    {req.projectTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Team: <strong>{req.teamName}</strong> • Match Fit: <span className="text-[#0F9488] font-bold">{req.matchScore}% Algorithm Match</span>
                  </p>

                  <div className="bg-[#F3F6FA] p-3 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed mt-2">
                    <span className="font-semibold text-slate-500 block mb-0.5">Project Consultation Brief:</span>
                    "{req.message}"
                  </div>

                  {req.mentorFeedbackNote && (
                    <div className="bg-teal-50/50 p-2.5 rounded-xl border border-teal-100 text-xs text-teal-900 mt-2">
                      <span className="font-bold text-teal-800">Your Response Note: </span>
                      {req.mentorFeedbackNote}
                    </div>
                  )}
                </div>

                {/* Match Breakdown & Action Controls */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 self-stretch md:self-auto">
                  <span className="text-xs text-slate-400">
                    Received: {req.createdAt || 'Recent'}
                  </span>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenActionModal(req, 'info')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                        title="Request Additional Details"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Request Info</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(req, 'decline')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold transition-colors flex items-center gap-1"
                        title="Decline Advisory"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(req, 'accept')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Guide</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Decision Recorded
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No mentorship requests match your current filter.
          </div>
        )}
      </div>

      {/* Response / Clarification Modal */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 bg-[#12243A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12243A]">
                  {modalAction === 'accept' ? 'Accept Mentorship Request' :
                   modalAction === 'decline' ? 'Decline Mentorship Request' :
                   'Request Additional Information'}
                </h3>
                <p className="text-xs text-slate-500">
                  Team: <strong>{activeModalRequest.teamName}</strong> ({activeModalRequest.projectTitle})
                </p>
              </div>
              <button
                onClick={() => setActiveModalRequest(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {modalAction === 'accept' ? 'Guidance Onboarding Directive / Next Steps' :
                   modalAction === 'info' ? 'Required Information / Clarification Questions' :
                   'Feedback & Reason for Declining'}
                </label>
                <textarea
                  value={feedbackNote}
                  onChange={e => setFeedbackNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalRequest(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 ${
                    modalAction === 'accept' ? 'bg-[#0F9488] hover:bg-[#0D7E73]' :
                    modalAction === 'decline' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Decision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

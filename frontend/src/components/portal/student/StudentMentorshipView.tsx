import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Compass, Search, Filter, ShieldCheck, Star, Video, MessageSquare,
  Calendar, CheckCircle2, Clock, UserCheck, ArrowRight, BookOpen,
  Award, Send, ExternalLink, Sparkles
} from 'lucide-react';
import { Mentor } from '../../../types';
import { LetterAvatar } from '../../common/LetterAvatar';

export const StudentMentorshipView: React.FC = () => {
  const {
    mentors, currentUser, addToast, startVideoMeeting,
    setIsDirectMessagingOpen, setActiveMessagingPartner,
    setSelectedUserProfileModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'discover' | 'active' | 'guidance'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestDescription, setRequestDescription] = useState('');

  // Active guidance notes from mentors
  const guidanceNotes = [
    {
      id: 'gn-01',
      mentorName: 'Dr. Arvind Rao',
      mentorRole: 'Professor of AI & Robotics • IIT Bombay',
      avatar: '',
      date: 'April 14, 2026',
      project: 'AgriVision: Autonomous Micro-Drones',
      title: 'FMEA Safety Directive & Motor Cut-Off Validation',
      feedback: 'Excellent progress on the TensorRT inference pipeline. For the SIH grand finale demo, make sure to add redundant software watchdog timers for motor cut-off in case of optical flow sensor degradation.',
      tags: ['Safety Critical', 'SIH 2026', 'Hardware In The Loop']
    },
    {
      id: 'gn-02',
      mentorName: 'Prof. Sudhir Sen',
      mentorRole: 'Distinguished Fellow • IISc Bengaluru',
      avatar: '',
      date: 'April 09, 2026',
      project: 'Distributed Byzantine Fault Tolerance Ledger',
      title: 'Raft Latency Benchmark Suggestions',
      feedback: 'Recommended evaluating raft leader election overhead across simulated WAN latencies (>100ms jitter) before submitting your paper to IEEE Trans on Parallel and Distributed Systems.',
      tags: ['Research Paper', 'Distributed Systems']
    }
  ];

  const expertiseOptions = ['All', 'Computer Vision', 'Deep Learning', 'Robotics', 'Embedded IoT', 'Cloud Architecture'];

  const filteredMentors = mentors.filter(m => {
    const matchesExpertise = selectedExpertise === 'All' ||
      (m.expertise && m.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));
    const matchesSearch = searchQuery.trim() === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.expertise && m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesExpertise && matchesSearch;
  });

  const handleOpenRequest = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setRequestTopic('');
    setRequestDescription('');
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim() || !requestDescription.trim()) {
      addToast({ type: 'warning', message: 'Please specify the consultation topic and project context.' });
      return;
    }

    addToast({
      type: 'success',
      message: `Mentorship consultation request dispatched to ${selectedMentor?.name}. They will review your project brief.`
    });
    setIsRequestModalOpen(false);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/70 shadow-2xs">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
                Academic & Industry Mentorship Network
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Faculty Guides
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Connect with professors, research scientists, and technology leaders for capstone projects, SIH guidance, and paper reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('guidance')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-campus-blue" />
            <span>Guidance Notes ({guidanceNotes.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'discover', label: 'Explore Verified Mentors', icon: Search },
          { key: 'active', label: 'My Assigned Mentors', icon: UserCheck },
          { key: 'guidance', label: 'Actionable Guidance Notes', icon: Award }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-campus-blue text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DISCOVER MENTORS */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search & Domain Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {expertiseOptions.map(exp => (
                <button
                  key={exp}
                  onClick={() => setSelectedExpertise(exp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedExpertise === exp
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search mentor or domain..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue shadow-2xs"
              />
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMentors.map(mentor => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-warm-sm hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <LetterAvatar
                      name={mentor.name}
                      size="lg"
                      className="w-12 h-12 rounded-xl ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-campus-deep-blue truncate">{mentor.name}</h3>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{mentor.designation}</p>
                      <p className="text-[10px] text-slate-400 truncate">{mentor.institution}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {mentor.bio || 'Advising collegiate students on hardware prototypes, computer vision benchmarks, and patent drafting.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(mentor.expertise || ['AI/ML', 'Robotics']).slice(0, 3).map(exp => (
                      <span key={exp} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveMessagingPartner(mentor as any);
                      setIsDirectMessagingOpen(true);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenRequest(mentor)}
                    className="flex-1 campus-btn-primary text-xs py-2 rounded-xl text-center"
                  >
                    Request Guidance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE MENTORS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mentors.slice(0, 2).map(mentor => (
              <div key={mentor.id} className="bg-white rounded-2xl border border-blue-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <LetterAvatar
                      name={mentor.name}
                      size="lg"
                      className="w-12 h-12 rounded-xl ring-2 ring-blue-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-campus-deep-blue">{mentor.name}</h4>
                      <p className="text-xs text-slate-500">{mentor.designation} • {mentor.institution}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md">
                        Primary Capstone Advisor
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">Weekly Cadence</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Next Scheduled Office Hour:</span>
                  <p className="text-slate-600">Every Thursday at 04:30 PM IST (Virtual Video Conference)</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => startVideoMeeting(mentor.id)}
                    className="flex-1 campus-btn-primary text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Office Hours Room</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveMessagingPartner(mentor as any);
                      setIsDirectMessagingOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GUIDANCE NOTES */}
      {activeTab === 'guidance' && (
        <div className="space-y-4">
          {guidanceNotes.map(gn => (
            <div key={gn.id} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LetterAvatar
                    name={gn.mentorName}
                    size="md"
                    className="w-10 h-10 rounded-xl ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-campus-deep-blue">{gn.mentorName}</h4>
                    <p className="text-[11px] text-slate-500">{gn.mentorRole}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium">{gn.date}</span>
                  <span className="text-[10px] font-bold text-campus-blue bg-blue-50 px-2 py-0.5 rounded-md block mt-1">
                    {gn.project}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <h5 className="text-sm font-bold text-slate-800">{gn.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                  "{gn.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {gn.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentorship Request Modal */}
      {isRequestModalOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-campus-deep-blue">Request Mentorship Guidance</h3>
                <p className="text-xs text-slate-500">Consultation with {selectedMentor.name}</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Consultation Focus or Topic
                </label>
                <input
                  type="text"
                  value={requestTopic}
                  onChange={e => setRequestTopic(e.target.value)}
                  placeholder="e.g. TensorRT optimization for SIH autonomous drone"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brief Problem Statement & Requested Advice
                </label>
                <textarea
                  value={requestDescription}
                  onChange={e => setRequestDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your current architectural blocker, git repo link, or specific guidance needed..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

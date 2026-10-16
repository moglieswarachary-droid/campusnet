import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Sparkles, Calendar, Filter, Search, Plus, ExternalLink,
  Coins, Award, Globe, Clock, CheckCircle2, Bookmark,
  BookOpen, Users, MapPin, ArrowRight
} from 'lucide-react';
import { ResearchConference } from '../../../types';

interface OpportunityItem {
  id: string;
  title: string;
  type: 'Call for Papers' | 'Grant Program' | 'Fellowship' | 'RA Opening';
  organizer: string;
  deadline: string;
  location: string;
  badge: string;
  amountOrIndex: string;
  description: string;
  link: string;
}

export const ResearcherOpportunitiesView: React.FC = () => {
  const { conferences, addToast } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Calls for Papers' | 'Grant Programs' | 'Fellowships' | 'RA Openings'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Initial opportunities list
  const [opportunityList, setOpportunityList] = useState<OpportunityItem[]>([
    ...conferences.map(c => ({
      id: `conf-${c.id}`,
      title: c.title,
      type: 'Call for Papers' as const,
      organizer: c.organizer,
      deadline: c.submissionDeadline,
      location: `${c.venue}, ${c.city} (${c.mode})`,
      badge: c.indexType,
      amountOrIndex: 'Scopus / CORE A*',
      description: `Tracks: ${c.tracks.join(', ')}. Peer-reviewed proceedings indexed in IEEE Xplore.`,
      link: c.registrationUrl
    })),
    {
      id: 'grant-1',
      title: 'SERB Core Research Grant (CRG) — 2026 Cycle',
      type: 'Grant Program',
      organizer: 'Science & Engineering Research Board',
      deadline: 'Nov 30, 2026',
      location: 'National (India)',
      badge: 'Funding',
      amountOrIndex: 'Up to ₹60,00,000',
      description: 'Supports high-impact research in competitive engineering, edge computing, quantum physics, and renewable energy.',
      link: 'https://serbonline.in'
    },
    {
      id: 'grant-2',
      title: 'DAAD Doctoral Research Short-Term Grants in Germany',
      type: 'Fellowship',
      organizer: 'German Academic Exchange Service',
      deadline: 'Jan 15, 2027',
      location: 'Germany (In-person)',
      badge: 'Fellowship',
      amountOrIndex: '€1,300/month + Travel',
      description: 'Fully funded 3 to 6-month research stays for Indian doctoral candidates at Max Planck and Fraunhofer institutes.',
      link: 'https://www.daad.de'
    },
    {
      id: 'ra-1',
      title: 'Undergraduate Research Assistant: Edge PyTorch & TensorRT',
      type: 'RA Opening',
      organizer: 'Computational Data Sciences Lab (IISc)',
      deadline: 'Oct 31, 2026',
      location: 'IISc Bengaluru (Hybrid)',
      badge: 'RA Opening',
      amountOrIndex: '₹12,000/month Stipend',
      description: 'Looking for 2 undergraduate students with Linux/PyTorch skills to benchmark Jetson Orin Nano neural graph execution.',
      link: '#'
    }
  ]);

  // Post form state
  const [postTitle, setPostTitle] = useState('');
  const [postType, setPostType] = useState<'RA Opening' | 'Call for Papers' | 'Grant Program'>('RA Opening');
  const [postDeadline, setPostDeadline] = useState('');
  const [postStipend, setPostStipend] = useState('₹12,000/month');
  const [postDesc, setPostDesc] = useState('');

  const filtered = opportunityList.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'Calls for Papers') return matchesSearch && item.type === 'Call for Papers';
    if (filterType === 'Grant Programs') return matchesSearch && item.type === 'Grant Program';
    if (filterType === 'Fellowships') return matchesSearch && item.type === 'Fellowship';
    if (filterType === 'RA Openings') return matchesSearch && item.type === 'RA Opening';
    return matchesSearch;
  });

  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      addToast({ type: 'error', message: 'Please provide opportunity title.' });
      return;
    }

    const newItem: OpportunityItem = {
      id: `opp-${Date.now()}`,
      title: postTitle.trim(),
      type: postType as any,
      organizer: 'IISc Computational Sciences Lab',
      deadline: postDeadline.trim() || 'Nov 15, 2026',
      location: 'IISc Bengaluru / Remote',
      badge: postType,
      amountOrIndex: postStipend,
      description: postDesc.trim() || 'Laboratory opening for qualified student researchers.',
      link: '#'
    };

    setOpportunityList([newItem, ...opportunityList]);
    addToast({
      type: 'success',
      message: `Research opportunity "${newItem.title}" posted to national discovery hub!`
    });

    setIsPostModalOpen(false);
    setPostTitle('');
    setPostDesc('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Conferences, Grants & RA Openings
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {opportunityList.length} Verified Calls
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top-tier conference deadlines, international fellowships, SERB/DST research grants, and student research assistantships
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post RA Position</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Calls for Papers', 'Grant Programs', 'Fellowships', 'RA Openings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === tab
                  ? 'bg-[#182442] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search venue, funding agency, or tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6954C8] text-slate-800"
          />
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.type === 'Grant Program' ? 'bg-amber-50 text-[#E9A23B] border border-amber-200' :
                  item.type === 'Fellowship' ? 'bg-teal-50 text-[#13877B] border border-teal-200' :
                  item.type === 'RA Opening' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-purple-50 text-[#6954C8] border border-purple-200'
                }`}>
                  {item.type}
                </span>

                <span className="text-xs font-black text-slate-800 bg-[#F4F6FA] px-2.5 py-1 rounded-xl border border-slate-200/60">
                  {item.amountOrIndex}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#182442] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Organized by: <strong>{item.organizer}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-[#F4F6FA] p-3 rounded-2xl border border-slate-200/60">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[180px]">{item.location}</span>
                </span>
                <span className="font-bold text-[#6954C8] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due {item.deadline}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold">
                Verified Official Source
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
              >
                <span>Apply / Register</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Post RA Position Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-[#182442]">Post Undergraduate RA Position</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handlePostOpportunity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Undergraduate Research Assistant: Edge PyTorch Benchmarks"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Stipend</label>
                  <input
                    type="text"
                    value={postStipend}
                    onChange={(e) => setPostStipend(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 15, 2026"
                    value={postDeadline}
                    onChange={(e) => setPostDeadline(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Required Skills & Responsibilities</label>
                <textarea
                  rows={3}
                  placeholder="Required: PyTorch, Linux C++, Embedded hardware experience..."
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

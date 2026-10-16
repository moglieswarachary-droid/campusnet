import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Sparkles, Search, Filter, Briefcase, Calendar, MapPin,
  Building2, CheckCircle2, Clock, Award, ExternalLink,
  ChevronRight, DollarSign, Bookmark, BookmarkCheck
} from 'lucide-react';

export const StudentOpportunitiesView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'internships' | 'research' | 'hackathons'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'All' | 'Remote' | 'On-Campus' | 'Hybrid'>('All');
  const [appliedIds, setAppliedIds] = useState<string[]>(['opp-01']);

  const opportunities = [
    {
      id: 'opp-01',
      title: 'Summer Research Fellowship in Edge AI & Micro-Robotics',
      organization: 'IISc Bangalore • Centre for Autonomous Systems',
      category: 'research',
      type: 'Research Fellowship',
      mode: 'On-Campus',
      location: 'Bengaluru, Karnataka',
      stipend: '₹35,000 / month',
      duration: '8 Weeks (May - July 2026)',
      deadline: 'April 25, 2026',
      eligibility: 'B.Tech CSE/ECE Year 3 • CGPA >= 8.5',
      skills: ['PyTorch', 'ROS 2', 'Embedded C++', 'TensorRT'],
      description: 'Conduct hands-on experimental research in neuromorphic vision sensors and sub-millisecond edge latency for micro-aerial vehicles. Fully funded with accommodation.',
      status: 'Applied'
    },
    {
      id: 'opp-02',
      title: 'AI Systems Engineering Intern (Distributed Inference)',
      organization: 'Google Research India',
      category: 'internships',
      type: 'Industry Internship',
      mode: 'Hybrid',
      location: 'Bengaluru / Remote',
      stipend: '₹80,000 / month',
      duration: '12 Weeks (Summer 2026)',
      deadline: 'April 30, 2026',
      eligibility: 'Pre-final Year Undergraduate • Strong Systems Background',
      skills: ['CUDA', 'Python', 'FastAPI', 'Distributed Systems'],
      description: 'Collaborate with senior researchers to optimize multi-GPU inference kernels and quantized pipeline parallelization for next-generation generative models.',
      status: 'Open'
    },
    {
      id: 'opp-03',
      title: 'National AI & Smart Robotics Grand Challenge 2026',
      organization: 'IIT Bombay Techfest & Ministry of Electronics and IT',
      category: 'hackathons',
      type: 'National Hackathon',
      mode: 'Hybrid',
      location: 'Mumbai, Maharashtra',
      stipend: '₹5,00,000 Cash Pool',
      duration: '36-Hour Hackathon',
      deadline: 'May 05, 2026',
      eligibility: 'All Indian Collegiate Teams (3-6 members)',
      skills: ['Computer Vision', 'IoT', 'Autonomous Navigation'],
      description: 'Solve real-world disaster management and precision agriculture problem statements. Final round judging at IIT Bombay Powai campus.',
      status: 'Open'
    },
    {
      id: 'opp-04',
      title: 'Undergraduate Research Assistant (Precision Agritech)',
      organization: 'CampusNet AgriVision Lab • Faculty Research Project',
      category: 'research',
      type: 'Lab Assistantship',
      mode: 'On-Campus',
      location: 'Campus Research Park',
      stipend: '₹15,000 / month + Lab Credits',
      duration: 'Ongoing Semester Project',
      deadline: 'May 10, 2026',
      eligibility: 'B.Tech Year 2 or 3 • Minimum 75% Attendance',
      skills: ['Drone Telemetry', 'Spectral Imaging', 'React'],
      description: 'Field data collection and web telemetry visualization for 5-acre autonomous drone pesticide spraying trials. Co-authorship in research publications.',
      status: 'Open'
    }
  ];

  const handleApply = (id: string, title: string) => {
    if (appliedIds.includes(id)) {
      addToast({ type: 'info', message: `You have already applied for ${title}. Application is under review.` });
      return;
    }

    setAppliedIds(prev => [...prev, id]);
    addToast({
      type: 'success',
      message: `Application submitted for ${title}! Verified portfolio and academic profile shared with recruiters.`
    });
  };

  const filtered = opportunities.filter(opp => {
    const matchesTab = activeTab === 'all' || opp.category === activeTab;
    const matchesMode = selectedMode === 'All' || opp.mode === selectedMode;
    const matchesSearch = searchQuery.trim() === '' ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesMode && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
                Opportunities & Fellowships
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Verified Listings
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated summer internships, academic research fellowships, and premier national hackathons for verified students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {appliedIds.length} Active Application{appliedIds.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Opportunities' },
            { key: 'internships', label: 'Internships' },
            { key: 'research', label: 'Research Fellowships' },
            { key: 'hackathons', label: 'Hackathons' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === t.key
                  ? 'bg-campus-blue text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {(['All', 'Remote', 'On-Campus', 'Hybrid'] as const).map(m => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  selectedMode === m ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="relative w-52 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by skill or title..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.map(opp => {
          const isApplied = appliedIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {opp.mode}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {opp.stipend}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-campus-deep-blue mt-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.organization}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: <strong>{opp.deadline}</strong>
                  </span>

                  <button
                    onClick={() => handleApply(opp.id, opp.title)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      isApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'campus-btn-primary'
                    }`}
                  >
                    {isApplied ? 'Application Under Review' : 'Apply with Portfolio'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {opp.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Required Skills:</span>
                  {opp.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Eligibility: <strong>{opp.eligibility}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

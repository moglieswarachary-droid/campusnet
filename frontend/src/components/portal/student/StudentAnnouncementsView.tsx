import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Megaphone, Bell, Calendar, Pin, AlertCircle, FileText,
  Search, Filter, ExternalLink, ShieldAlert, Award, Clock
} from 'lucide-react';

export const StudentAnnouncementsView: React.FC = () => {
  const { currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const announcements = [
    {
      id: 'ann-01',
      title: 'Smart India Hackathon 2026: Institutional Team Shortlist Declared',
      source: 'Innovation & Incubation Cell',
      date: 'April 15, 2026',
      category: 'Hackathons',
      pinned: true,
      priority: 'High',
      content: 'The review panel has evaluated 42 internal student teams. Top 8 hardware and software teams have been officially endorsed for the SIH 2026 national grand finale. Team AgriVision (22CS1048 Lead) is ranked #1 in Agriculture & IoT category.',
      actionUrl: '/student/teams',
      actionLabel: 'Check Team Status'
    },
    {
      id: 'ann-02',
      title: 'End-Term Examination Fee Submission & Hall Ticket Download Schedule',
      source: 'Office of the Controller of Examinations',
      date: 'April 12, 2026',
      category: 'Academics',
      pinned: true,
      priority: 'Urgent',
      content: 'All B.Tech Year 3 students are required to clear outstanding laboratory dues and verify their course registration list by April 28. Digital hall tickets will be issued via the Academic Portal from May 02.',
      actionUrl: '/student/academics',
      actionLabel: 'View Exam Schedule'
    },
    {
      id: 'ann-03',
      title: 'Google DeepMind & IIT Madras AI Research Internship Fellowship 2026',
      source: 'Training & Placement Cell',
      date: 'April 10, 2026',
      category: 'Placements',
      pinned: false,
      priority: 'Normal',
      content: 'Applications are invited from 3rd year undergraduate students for summer research fellowships in Generative AI, Multimodal Foundation Models, and Autonomous Systems. Minimum CGPA criterion is 8.5.',
      actionUrl: '/student/opportunities',
      actionLabel: 'View Opportunity'
    },
    {
      id: 'ann-04',
      title: 'High Performance Computing (HPC) GPU Cluster Maintenance Downtime',
      source: 'Centre for Cloud Computing & Infrastructure',
      date: 'April 08, 2026',
      category: 'Infrastructure',
      pinned: false,
      priority: 'Low',
      content: 'Scheduled firmware upgrades on the NVIDIA DGX A100 server rack will take place on Saturday, April 19 from 11:00 PM to 04:00 AM IST. All student Slurm jobs should checkpoint their model weights.',
      actionUrl: '',
      actionLabel: ''
    },
    {
      id: 'ann-05',
      title: 'Faculty Mentorship Allocation for Final Year B.Tech Capstone Projects',
      source: 'Department of Computer Science & Engineering',
      date: 'April 05, 2026',
      category: 'Academics',
      pinned: false,
      priority: 'Normal',
      content: 'Students must submit their preliminary project abstract and select their preferred primary mentor before the close of academic week 12. Cross-disciplinary projects are actively encouraged.',
      actionUrl: '/student/mentorship',
      actionLabel: 'Find Mentors'
    }
  ];

  const categories = ['All', 'Academics', 'Hackathons', 'Placements', 'Infrastructure'];

  const filteredAnnouncements = announcements.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70 shadow-2xs">
            <Megaphone className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
              Campus Announcements & Notices
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verified institutional circulars from Academic Affairs, Exam Cell, and Placement Office
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-campus-blue text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue shadow-2xs"
          />
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white border shadow-2xs transition-all space-y-3 ${
              item.pinned ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.pinned && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      Pinned Circular
                    </span>
                  )}
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    item.priority === 'Urgent'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">{item.source}</span>
                </div>

                <h3 className="text-base font-bold text-campus-deep-blue mt-1">
                  {item.title}
                </h3>
              </div>

              <span className="text-xs text-slate-400 shrink-0 font-medium">
                {item.date}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.content}
            </p>

            {item.actionLabel && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Institutional Circular Ref #{item.id}</span>
                <a
                  href={item.actionUrl}
                  className="campus-btn-primary text-xs py-1.5 px-3 rounded-xl inline-flex items-center gap-1"
                >
                  <span>{item.actionLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No announcements match your search criteria.
          </div>
        )}
      </div>

    </div>
  );
};

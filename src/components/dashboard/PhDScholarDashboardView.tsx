import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, BookOpen, Award, Users, Search, 
  ExternalLink, Calendar, Plus, FileText, Share2, 
  ArrowRight, CheckCircle2, MessageSquare, UserPlus 
} from 'lucide-react';
import { ResearchPublication, ResearchConference } from '../../types';

export const PhDScholarDashboardView: React.FC = () => {
  const { 
    currentUser, researchers, publications, conferences, 
    students, projects, setIsDirectMessagingOpen, 
    setActiveMessagingPartner, sendConnectionRequest, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'publications' | 'conferences' | 'student_discovery' | 'collab'>('publications');
  const [searchStudentTopic, setSearchStudentTopic] = useState('');

  const currentScholar = researchers.find(r => r.email === currentUser.email || r.name.includes(currentUser.name.split(' ')[0] || '')) || researchers[0];

  // Filter students working on AI/ML/Data relevant topics
  const relevantStudents = students.filter(s => {
    if (!searchStudentTopic) return true;
    return s.skills.some(sk => sk.toLowerCase().includes(searchStudentTopic.toLowerCase())) ||
      s.department.toLowerCase().includes(searchStudentTopic.toLowerCase()) ||
      s.bio.toLowerCase().includes(searchStudentTopic.toLowerCase());
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Scholar Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-campus-deep-blue to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-warm-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/30 shadow-warm-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  PhD Research Scholar
                </span>
                <span className="text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full">
                  ✓ Open for Student Collab
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {currentScholar.department} • {currentUser.institution}
              </p>
              
              <p className="text-[11.5px] text-slate-300 max-w-xl">
                Research Domain: <strong>{currentScholar.researchArea}</strong> (Guide: {currentScholar.guide})
              </p>
            </div>
          </div>

          {/* Research Metrics */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <div className="text-lg sm:text-xl font-extrabold text-amber-300">{currentScholar.publicationsCount}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Papers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <div className="text-lg sm:text-xl font-extrabold text-blue-300">{currentScholar.citationsCount}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Citations</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <div className="text-lg sm:text-xl font-extrabold text-green-400">h-index {currentScholar.hIndex}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Impact</div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-campus-border">
        {[
          { id: 'publications', label: `Published Papers & Datasets (${publications.length})` },
          { id: 'conferences', label: `Conferences & Symposiums (${conferences.length})` },
          { id: 'student_discovery', label: `Student Discovery for Lab Collab (${relevantStudents.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                : 'text-campus-slate-text hover:bg-campus-soft-blue bg-white border border-campus-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: PUBLICATIONS */}
      {activeTab === 'publications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Verified Publications & Open Research Datasets
            </h2>
            <button
              onClick={() => addToast({ type: 'info', title: 'DOI Ingestion', message: 'Enter your arXiv / IEEE DOI to link paper.' })}
              className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Publication
            </button>
          </div>

          <div className="space-y-4">
            {publications.map(pub => (
              <div key={pub.id} className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded">
                      DOI: {pub.doi}
                    </span>
                    <h3 className="text-base font-bold text-campus-deep-blue mt-1">{pub.title}</h3>
                    <p className="text-xs text-campus-muted-text">{pub.authors.join(', ')} • {pub.journal} ({pub.year})</p>
                  </div>

                  <span className="text-xs font-bold text-campus-blue bg-campus-soft-blue px-2.5 py-1 rounded-xl">
                    {pub.citations} Citations
                  </span>
                </div>

                <p className="text-xs text-campus-slate-text/80 leading-relaxed bg-campus-warm-white p-3.5 rounded-2xl border border-campus-border">
                  {pub.abstract}
                </p>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {pub.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-campus-slate-text px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {pub.datasetLink && (
                    <a
                      href={pub.datasetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-campus-blue hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Access Research Dataset
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CONFERENCES & SYMPOSIUMS */}
      {activeTab === 'conferences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              National Research Conferences, Call for Papers & Symposiums
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conferences.map(conf => (
              <div key={conf.id} className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {conf.indexType}
                    </span>
                    <span className="text-[10px] font-bold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-full">
                      {conf.mode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-campus-deep-blue">{conf.title}</h3>
                  <p className="text-xs text-campus-muted-text">{conf.organizer} • {conf.venue}</p>

                  <div className="pt-2 border-t border-campus-border text-xs space-y-1 text-campus-slate-text">
                    <div><strong>Conference Dates:</strong> {conf.dates}</div>
                    <div className="text-campus-red font-bold"><strong>Submission Deadline:</strong> {conf.submissionDeadline}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-campus-border flex items-center justify-between">
                  <span className="text-xs text-campus-muted-text">{conf.city}, {conf.state}</span>
                  <a
                    href={conf.registrationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
                  >
                    Paper Submission Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: STUDENT DISCOVERY */}
      {activeTab === 'student_discovery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-campus-deep-blue">
                Discover Capable Undergraduates for Lab Research & Co-Authorship
              </h2>
              <p className="text-xs text-campus-muted-text">Find students with practical coding, robotics, or data skills to collaborate on research prototypes.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchStudentTopic}
                onChange={e => setSearchStudentTopic(e.target.value)}
                placeholder="Filter by skill (e.g. PyTorch, ROS2)..."
                className="pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-campus-border focus:border-campus-blue outline-none w-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relevantStudents.map(std => (
              <div key={std.id} className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={std.avatar} alt={std.name} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-campus-border" />
                    <div>
                      <h4 className="text-xs font-bold text-campus-deep-blue">{std.name}</h4>
                      <p className="text-[10px] text-campus-blue font-semibold">{std.department}</p>
                      <p className="text-[10px] text-campus-muted-text truncate max-w-[150px]">{std.institution}</p>
                    </div>
                  </div>

                  <p className="text-xs text-campus-slate-text/80 line-clamp-2">{std.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {std.skills.slice(0, 4).map(sk => (
                      <span key={sk} className="text-[10px] font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-campus-border flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveMessagingPartner(std);
                      setIsDirectMessagingOpen(true);
                    }}
                    className="campus-btn-secondary text-xs py-1.5 px-2.5 rounded-lg flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </button>

                  <button
                    onClick={() => sendConnectionRequest(std.id, 'Would love to invite you to collaborate on our lab research project at IISc!')}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    Invite to Lab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

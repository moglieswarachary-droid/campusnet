import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen, FileText, Compass, Users, Sparkles,
  ArrowRight, ExternalLink, Calendar, Plus, Clock,
  CheckCircle2, AlertCircle, TrendingUp, Atom, ShieldCheck,
  Edit3, Share2, Award, Building2, Coins, ChevronRight,
  Globe2, CheckSquare, MessageSquare, AlertTriangle
} from 'lucide-react';
import { PhDScholarProfileEditModal } from '../../dashboard/PhDScholarProfileEditModal';
import { LetterAvatar } from '../../common/LetterAvatar';

export const ResearcherDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser, researchers, publications, conferences,
    projects, students, setIsAIModalOpen, addToast, startVideoMeeting
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Active' | 'Under Review' | 'Completed'>('All');

  const currentScholar = researchers.find(r =>
    (currentUser?.email && r.email === currentUser.email) ||
    (currentUser?.name && r.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''))
  ) || researchers[0];

  // Calculated KPI stats
  const totalPublications = publications.length;
  const totalCitations = publications.reduce((acc, p) => acc + (p.citations || 0), 0) + (currentScholar.citationsCount || 142);
  const hIndex = currentScholar.hIndex || 6;
  const activeProjectsCount = 3;
  const pendingReviewsCount = 2;

  // Prioritized Action Items
  const attentionItems = [
    {
      id: 'att-1',
      title: 'IEEE Transactions on Computers — Revision 1 Due',
      type: 'Manuscript Review',
      deadline: 'Oct 28, 2026 (12 days left)',
      urgency: 'high',
      description: 'Reviewer #2 requested additional benchmarks comparing neuromorphic inference against Jetson Orin Nano.',
      actionLabel: 'Open Review Form',
      actionUrl: '/researcher/publications'
    },
    {
      id: 'att-2',
      title: 'SERB CRG/2025 Mid-Term Grant Progress Report',
      type: 'Funding Deliverable',
      deadline: 'Nov 05, 2026',
      urgency: 'medium',
      description: 'Upload financial utilization certificate and experimental logs for Q3.',
      actionLabel: 'Prepare Report',
      actionUrl: '/researcher/projects'
    },
    {
      id: 'att-3',
      title: 'Undergraduate RA Candidate: Aarav Sharma (NITK)',
      type: 'RA Application',
      deadline: 'Awaiting Decision',
      urgency: 'normal',
      description: 'Applied for Edge TensorRT benchmarking position. 96% skillset match on PyTorch & Embedded Linux.',
      actionLabel: 'Review Candidate',
      actionUrl: '/researcher/collaborations'
    },
    {
      id: 'att-4',
      title: 'ACM SenSys 2026 — Call for Papers Submission Deadline',
      type: 'Conference Deadline',
      deadline: 'Nov 18, 2026 (AoE)',
      urgency: 'normal',
      description: 'Full paper manuscript draft with Dr. Arvind Rao currently at 75% completion.',
      actionLabel: 'View Paper Draft',
      actionUrl: '/researcher/collaborations'
    }
  ];

  // Research Projects
  const researchProjects = [
    {
      id: 'proj-1',
      title: 'Neuromorphic Graph Processing on Ultra-Low-Power RISC-V',
      grantId: 'SERB-CRG-2025-081',
      domain: 'Neuromorphic Edge AI',
      progress: 68,
      status: 'Active',
      deadline: 'March 2027',
      collaborators: ['Dr. Arvind Rao (IIT Bombay)', 'Kavya Ramanathan (IISc)', 'Prof. S. Ghosh (IISc)'],
      description: 'Asynchronous event-based neural spike simulation with optimized sparse graph execution engines.'
    },
    {
      id: 'proj-2',
      title: 'National Agricultural Edge Vision Benchmark (NAEV-26)',
      grantId: 'Open-Science-2026',
      domain: 'Computer Vision & Agriculture',
      progress: 92,
      status: 'Under Review',
      deadline: 'Dec 2026',
      collaborators: ['IISc Computational Sciences', 'ICAR Drone Lab'],
      description: 'Annotated dataset of 50,000 multi-spectral aerial images for crop pest diagnosis in Southern India.'
    },
    {
      id: 'proj-3',
      title: 'Federated Graph Convolutional Architectures for Clinical ECG',
      grantId: 'ICMR-Fellowship-2024',
      domain: 'Bio-inspired Computing',
      progress: 100,
      status: 'Completed',
      deadline: 'Published',
      collaborators: ['AIIMS New Delhi', 'IISc CDS Lab'],
      description: 'Privacy-preserving distributed learning over multi-center clinical telemetry waveforms.'
    }
  ];

  const filteredProjects = researchProjects.filter(p => {
    if (projectFilter === 'All') return true;
    return p.status === projectFilter;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <PhDScholarProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          scholar={currentScholar}
        />
      )}

      {/* Header Profile Identity Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 relative z-10">
          <div className="relative shrink-0">
            <LetterAvatar
              name={currentUser?.name || currentScholar.name}
              size="xl"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-purple-100 shadow-2xs"
            />
            {currentScholar.verifiedResearcher && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#13877B] rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]"
                title="Verified Research Scholar"
              >
                ✓
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442] tracking-tight">
                {currentUser?.name || currentScholar.name}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6954C8] border border-purple-200 flex items-center gap-1">
                <Atom className="w-3 h-3" />
                Doctoral Fellow • CSIR-NET JRF
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ORCID: 0000-0002-1825-0097
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {currentScholar.department || 'Computational and Data Sciences'} • {currentScholar.university || currentScholar.institution || 'Indian Institute of Science (IISc)'}
            </p>

            <p className="text-[11px] text-slate-500 max-w-xl line-clamp-1">
              Thesis Domain: <strong className="text-slate-700">{currentScholar.researchArea || 'Neuromorphic Parallel Graph Architectures'}</strong> {currentScholar.guide ? `• Advisor: ${currentScholar.guide}` : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-end relative z-10">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-[#6954C8] font-bold text-xs border border-purple-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Subtle accent backdrop */}
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-purple-50/60 to-transparent pointer-events-none" />
      </div>

      {/* KPI Row: 5 Research Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Publications */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Publications</span>
            <FileText className="w-4 h-4 text-[#6954C8]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#182442]">{totalPublications}</span>
            <span className="text-[10px] font-bold text-slate-400">Indexed</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate">3 Scopus Q1 journals</p>
        </div>

        {/* Metric 2: Citations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Citations</span>
            <TrendingUp className="w-4 h-4 text-[#13877B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#182442]">{totalCitations}</span>
            <span className="text-[10px] font-bold text-emerald-600">+18 this qtr</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate">h-index: {hIndex} (i10: 4)</p>
        </div>

        {/* Metric 3: Active Grants */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Projects</span>
            <Compass className="w-4 h-4 text-[#6954C8]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#182442]">{activeProjectsCount}</span>
            <span className="text-[10px] font-bold text-slate-400">Grants</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate">₹42L Total Awarded</p>
        </div>

        {/* Metric 4: Reviews & Tasks */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Milestones Due</span>
            <CheckSquare className="w-4 h-4 text-[#E9A23B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#E9A23B]">{pendingReviewsCount}</span>
            <span className="text-[10px] font-bold text-slate-400">Action req.</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate">Next: Oct 28 (IEEE)</p>
        </div>

        {/* Metric 5: Collaborations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Co-Authors</span>
            <Users className="w-4 h-4 text-[#13877B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#182442]">8</span>
            <span className="text-[10px] font-bold text-slate-400">Scholars</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate">2 Undergrad RAs</p>
        </div>

      </div>

      {/* Two Column Grid: Priority Actions & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Needs Your Attention Prioritized Action List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#E9A23B]" />
              <h3 className="text-sm font-black text-[#182442]">Needs Your Attention</h3>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {attentionItems.length} Pending Actions
            </span>
          </div>

          <div className="space-y-3">
            {attentionItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 bg-[#F4F6FA]/70 hover:bg-[#F4F6FA] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.2 rounded-md bg-white border border-slate-200 text-slate-700">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#182442] truncate">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{item.description}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.deadline}</span>
                  </p>
                </div>

                <Link
                  to={item.actionUrl}
                  className="px-3.5 py-1.5 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs shrink-0 self-start sm:self-center flex items-center gap-1"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Upcoming Conference Deadlines & Symposia */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6954C8]" />
                <h3 className="text-sm font-black text-[#182442]">Conference Deadlines</h3>
              </div>
              <Link to="/researcher/opportunities" className="text-xs font-bold text-[#6954C8] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3 pt-3">
              {(conferences.slice(0, 3)).map(conf => (
                <div key={conf.id} className="p-3 rounded-2xl bg-[#F4F6FA]/80 border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#182442] truncate max-w-[170px]">{conf.title}</span>
                    <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-[#6954C8]">
                      {conf.indexType}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Submission: <strong>{conf.submissionDeadline}</strong></p>
                  <p className="text-[10px] text-slate-400 truncate">{conf.venue}, {conf.city}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/researcher/opportunities"
            className="w-full mt-2 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center block transition-colors"
          >
            Explore All 12 Calls for Papers
          </Link>
        </div>

      </div>

      {/* Active Research Projects Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-[#182442]">Active Research Projects & Grants</h3>
            <p className="text-xs text-slate-500 mt-0.5">Laboratory experimental tracks, sponsored research, and open dataset benchmarks</p>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Active', 'Under Review', 'Completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setProjectFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  projectFilter === tab
                    ? 'bg-[#182442] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-[#F4F6FA]/50 hover:bg-white hover:shadow-warm-sm hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#6954C8] bg-purple-50 px-2 py-0.5 rounded">
                    {proj.domain}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    proj.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#182442] leading-snug line-clamp-2">
                  {proj.title}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Progress Deliverables</span>
                    <span className="text-[#6954C8]">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6954C8] rounded-full transition-all"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Grant: {proj.grantId}</span>
                  <Link
                    to="/researcher/projects"
                    className="font-bold text-[#6954C8] hover:underline flex items-center gap-1"
                  >
                    <span>Lab Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

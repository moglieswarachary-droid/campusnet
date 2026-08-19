import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  FolderKanban, Plus, Search, Filter, ShieldCheck, 
  Users, GitBranch, Globe, Sparkles, CheckCircle2, 
  ArrowRight, Award, Building2, MapPin, Layers, 
  Bookmark, BookmarkCheck, FileText, UserPlus, HelpCircle,
  BookOpen
} from 'lucide-react';
import { Project } from '../../types';
import { MOCK_INDIAN_STATES } from '../../data/mockData';
import { ResearchHubView } from '../research/ResearchHubView';

export const ProjectsEcosystemView: React.FC = () => {
  const { 
    projects, researchers, publications, currentUser, createProject, setSelectedProjectId, 
    setActiveTab, savedItemIds, toggleSaveItem, addToast, 
    sendMentorshipRequest, mentors 
  } = useApp();

  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    if (id && projects.length > 0) {
      const found = projects.find(p => p.id.toLowerCase() === id.toLowerCase());
      if (found) {
        setSelectedProjectId(found.id);
      }
    }
  }, [id, projects, setSelectedProjectId]);

  const [primaryTab, setPrimaryTab] = useState<'projects' | 'research'>('projects');

  const [activeProjectsTab, setActiveProjectsTab] = useState<
    'all' | 'my' | 'joined' | 'mentored' | 'open_roles' | 'categories'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMentorFilter, setSelectedMentorFilter] = useState<'All' | 'with_mentor' | 'seeking_mentor'>('All');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestMentorModalOpen, setIsRequestMentorModalOpen] = useState(false);
  const [targetProjectForMentor, setTargetProjectForMentor] = useState<Project | null>(null);

  // New Project Form
  const [pTitle, setPTitle] = useState('');
  const [pProblem, setPProblem] = useState('');
  const [pSolution, setPSolution] = useState('');
  const [pDomain, setPDomain] = useState('Agriculture & IoT');
  const [pTech, setPTech] = useState('');
  const [pSkills, setPSkills] = useState('');
  const [pGithub, setPGithub] = useState('');
  const [pDemo, setPDemo] = useState('');
  const [pDocs, setPDocs] = useState('');
  const [pSeeking, setPSeeking] = useState('');
  const [pObjectives, setPObjectives] = useState('');

  // Filter Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    const matchesState = selectedState === 'All India' || p.state === selectedState;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    
    const matchesMentor = selectedMentorFilter === 'All' || 
      (selectedMentorFilter === 'with_mentor' && !!p.mentor) || 
      (selectedMentorFilter === 'seeking_mentor' && !p.mentor);

    if (activeProjectsTab === 'my') {
      return matchesSearch && matchesDomain && p.institution === currentUser.institution;
    }
    if (activeProjectsTab === 'mentored') {
      return matchesSearch && matchesDomain && (p.mentorStatus === 'accepted' || !!p.mentor);
    }
    if (activeProjectsTab === 'open_roles') {
      return matchesSearch && matchesDomain && (p.seekingRoles && p.seekingRoles.length > 0);
    }

    return matchesSearch && matchesDomain && matchesState && matchesStatus && matchesMentor;
  });

  const domainsList = [
    'All',
    'Agriculture & IoT',
    'Clean Energy & Smart Grid',
    'Healthcare & Biomedical',
    'Defense & Aerospace',
    'AI / NLP & Automation',
    'Cybersecurity & Web3'
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim()) return;

    const newProj = createProject({
      title: pTitle,
      problemStatement: pProblem,
      proposedSolution: pSolution,
      domain: pDomain,
      technologies: pTech ? pTech.split(',').map(t => t.trim()) : ['Python', 'React'],
      requiredSkills: pSkills ? pSkills.split(',').map(s => s.trim()) : ['Full Stack'],
      githubUrl: pGithub,
      demoUrl: pDemo,
      documentationUrl: pDocs,
      objectives: pObjectives ? pObjectives.split('\n').filter(Boolean) : ['Develop MVP architecture'],
      seekingRoles: pSeeking ? pSeeking.split(',').map(r => r.trim()) : ['Hardware / ECE Specialist'],
      state: currentUser.state || 'Karnataka',
      city: currentUser.city || 'Bengaluru',
      institution: currentUser.institution,
      status: 'Idea'
    });

    setIsCreateModalOpen(false);
    setPTitle('');
    setPProblem('');
    setPSolution('');
    setPTech('');
    setPSkills('');
    setSelectedProjectId(newProj.id);
  };

  const handleSendMentorRequest = (mentorId: string, mentorName: string) => {
    if (!targetProjectForMentor) return;
    sendMentorshipRequest({
      teamId: targetProjectForMentor.teamId || 'team-' + Date.now(),
      teamName: targetProjectForMentor.teamName || targetProjectForMentor.title + ' Team',
      projectTitle: targetProjectForMentor.title,
      domain: targetProjectForMentor.domain,
      mentorId,
      mentorName,
      requestedBy: currentUser.name,
      message: `Dear ${mentorName}, our student innovation team working on "${targetProjectForMentor.title}" requests your expert mentorship on CampusNet.`,
      matchScore: 94,
      matchBreakdown: {
        domainScore: 38,
        techScore: 28,
        researchScore: 19,
        availabilityScore: 9
      }
    });
    setIsRequestMentorModalOpen(false);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Top Primary Destination Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-warm-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrimaryTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              primaryTab === 'projects'
                ? 'bg-white text-campus-deep-blue shadow-warm-sm border border-slate-200/80'
                : 'text-campus-muted-text hover:text-campus-deep-blue'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-campus-blue" />
            <span>Student Projects & Prototypes</span>
            <span className="text-[10px] bg-campus-soft-blue text-campus-blue font-bold px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setPrimaryTab('research')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              primaryTab === 'research'
                ? 'bg-white text-campus-deep-blue shadow-warm-sm border border-slate-200/80'
                : 'text-campus-muted-text hover:text-campus-deep-blue'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>PhD Scholars & Research Hub</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
              {researchers.length + publications.length}
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-campus-muted-text pr-2">
          <span>Unified Innovation Pipeline</span>
        </div>
      </div>

      {primaryTab === 'research' ? (
        <ResearchHubView />
      ) : (
        <>
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="campus-badge-verified">
                  <FolderKanban className="w-3.5 h-3.5" />
                  National Project Ecosystem
                </span>
                <span className="text-xs text-campus-muted-text">{projects.length} Active Innovation Initiatives</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
                Student Innovation & Research Projects
              </h1>
              <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
                Browse verified inter-collegiate projects, invite faculty mentors, manage milestones, and collaborate in private 6-member team workspaces.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="campus-btn-red text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-warm-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </button>
          </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-campus-border">
        {[
          { id: 'all', label: 'Browse All Projects' },
          { id: 'my', label: 'My Projects' },
          { id: 'mentored', label: 'Mentored Projects' },
          { id: 'open_roles', label: 'Open Collaborator Slots' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveProjectsTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeProjectsTab === tab.id
                ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                : 'text-campus-slate-text hover:bg-campus-soft-blue bg-white border border-campus-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-campus-border shadow-warm-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by technology, problem statement, college..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium"
            >
              {domainsList.map(dom => (
                <option key={dom} value={dom}>{dom === 'All' ? 'All Domains' : dom}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-medium"
            >
              <option value="All">All Stages</option>
              <option value="Idea">Idea Stage</option>
              <option value="Prototype">Working Prototype</option>
              <option value="Development">Active Development</option>
              <option value="Completed">Completed & Verified</option>
            </select>
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Cover Image / Banner */}
            <div className="h-44 relative overflow-hidden bg-slate-900">
              <img 
                src={project.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-campus-blue text-white px-2 py-0.5 rounded-full">
                  {project.domain}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  project.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-white/90 text-campus-slate-text'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] text-amber-300 font-semibold truncate">{project.institution}</p>
                <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-campus-muted-text">Problem Statement:</span>
                  <p className="text-xs text-campus-slate-text/80 line-clamp-2 leading-relaxed mt-0.5">
                    {project.problemStatement}
                  </p>
                </div>

                {/* Mentor Connection Status */}
                <div className="pt-2 border-t border-campus-border flex items-center justify-between text-xs">
                  {project.mentor ? (
                    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-lg font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[170px]">Guide: {project.mentor}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setTargetProjectForMentor(project);
                        setIsRequestMentorModalOpen(true);
                      }}
                      className="text-xs font-bold text-campus-red hover:underline flex items-center gap-1"
                    >
                      + Request Faculty Guide
                    </button>
                  )}

                  <span className="text-xs font-semibold text-campus-muted-text">
                    {project.teamMembersCount} Members
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-campus-slate-text mb-1">
                    <span>Milestones Progress</span>
                    <span className="text-campus-blue">{project.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-campus-blue to-green-500 rounded-full transition-all" 
                      style={{ width: `${project.progressPercent}%` }} 
                    />
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="text-[10px] font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-campus-border flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('workspace');
                  }}
                  className="flex-1 campus-btn-primary py-2 text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Open Shared Workspace
                </button>
                <button
                  onClick={() => toggleSaveItem(project.id)}
                  className="p-2 rounded-xl border border-campus-border hover:bg-campus-warm-white text-campus-muted-text"
                >
                  {savedItemIds.includes(project.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-campus-blue" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* CREATE PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-warm-xl border border-campus-border space-y-4 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-campus-border">
              <div>
                <h3 className="text-lg font-bold text-campus-deep-blue">Publish New Innovation Project</h3>
                <p className="text-xs text-campus-muted-text">Open your project to peer collaboration, student recruitment, and faculty mentorship.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-campus-muted-text hover:text-campus-slate-text">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              
              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Project Title *</label>
                <input
                  type="text"
                  value={pTitle}
                  onChange={e => setPTitle(e.target.value)}
                  placeholder="e.g. AgriVision AI — Edge Drone Crop Diagnostics"
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Domain *</label>
                  <select
                    value={pDomain}
                    onChange={e => setPDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white font-medium"
                  >
                    {domainsList.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={pTech}
                    onChange={e => setPTech(e.target.value)}
                    placeholder="e.g. PyTorch, TensorRT, ROS2, React"
                    className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Problem Statement *</label>
                <textarea
                  rows={2}
                  value={pProblem}
                  onChange={e => setPProblem(e.target.value)}
                  placeholder="Describe the real-world problem, affected stakeholders, and inefficiencies..."
                  required
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Proposed Solution & Architecture *</label>
                <textarea
                  rows={2}
                  value={pSolution}
                  onChange={e => setPSolution(e.target.value)}
                  placeholder="Explain your technical methodology, hardware/software stack, and prototype plan..."
                  required
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">GitHub / Open Repo Link</label>
                  <input
                    type="url"
                    value={pGithub}
                    onChange={e => setPGithub(e.target.value)}
                    placeholder="https://github.com/org/repo"
                    className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Live Demo / Video Link</label>
                  <input
                    type="url"
                    value={pDemo}
                    onChange={e => setPDemo(e.target.value)}
                    placeholder="https://demo.app or video link"
                    className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Looking for Specific Roles / Skills?</label>
                <input
                  type="text"
                  value={pSeeking}
                  onChange={e => setPSeeking(e.target.value)}
                  placeholder="e.g. Hardware/ECE Specialist, UI/UX Designer, Fluid Dynamics FEA"
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-campus-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs px-4 py-2"
                >
                  Publish Project Workspace
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* REQUEST MENTOR MODAL */}
      {isRequestMentorModalOpen && targetProjectForMentor && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-warm-xl border border-campus-border space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-campus-border">
              <h3 className="text-base font-bold text-campus-deep-blue">
                Pair Faculty Mentor for "{targetProjectForMentor.title}"
              </h3>
              <button onClick={() => setIsRequestMentorModalOpen(false)}>✕</button>
            </div>

            <p className="text-xs text-campus-muted-text">
              Select a verified faculty/industry mentor with matching domain expertise on CampusNet:
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {mentors.map(m => (
                <div 
                  key={m.id}
                  className="p-3 rounded-2xl border border-campus-border hover:border-campus-blue bg-white flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-campus-deep-blue">{m.name}</h4>
                      <p className="text-[11px] text-campus-muted-text truncate max-w-[200px]">{m.institution}</p>
                      <p className="text-[10px] text-campus-blue font-semibold">{m.specialization}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMentorRequest(m.id, m.name)}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                  >
                    Send Request
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
};

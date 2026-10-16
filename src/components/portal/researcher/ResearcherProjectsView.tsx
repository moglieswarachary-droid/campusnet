import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Compass, Search, Filter, Plus, Users, Calendar,
  CheckCircle2, Clock, ShieldAlert, ArrowRight, Eye,
  Lock, Globe, Database, FileText, Check, X, Save
} from 'lucide-react';

interface ResearchProjectItem {
  id: string;
  title: string;
  grantId: string;
  domain: string;
  fundingBody: string;
  budget: string;
  progress: number;
  status: 'Active' | 'Benchmarking' | 'Completed' | 'Under Review';
  visibility: 'Private Lab' | 'Consortium' | 'Open Science';
  leadInvestigator: string;
  collaborators: string[];
  description: string;
  milestones: { title: string; deadline: string; status: 'completed' | 'in_progress' | 'pending' }[];
  datasets: string[];
}

export const ResearcherProjectsView: React.FC = () => {
  const { addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Benchmarking' | 'Completed'>('All');
  const [selectedProject, setSelectedProject] = useState<ResearchProjectItem | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Initial projects list with local persistence
  const [projectsList, setProjectsList] = useState<ResearchProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('campusnet_research_projects_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'proj-1',
        title: 'Neuromorphic Graph Processing on Ultra-Low-Power RISC-V',
        grantId: 'SERB-CRG-2025-081',
        domain: 'Neuromorphic Computing',
        fundingBody: 'Science & Engineering Research Board (SERB)',
        budget: '₹28,50,000',
        progress: 68,
        status: 'Active',
        visibility: 'Consortium',
        leadInvestigator: 'Kavya Ramanathan (PhD Fellow)',
        collaborators: ['Dr. Arvind Rao (IIT Bombay)', 'Prof. S. Ghosh (IISc)', 'Aarav Sharma (RA)'],
        description: 'Investigation into asynchronous event-based neural spike simulation with custom RISC-V coprocessors.',
        milestones: [
          { title: 'ISA Architectural Definition & Spike Simulator', deadline: 'Completed', status: 'completed' },
          { title: 'FPGA Testbed Hardware-in-the-Loop Emulation', deadline: 'Nov 15, 2026', status: 'in_progress' },
          { title: 'Camera-Ready Paper for ACM/IEEE DAC', deadline: 'Feb 2027', status: 'pending' }
        ],
        datasets: ['Zenodo #829104: Event-Camera Neuromorphic Benchmarks', 'GitHub: riscv-spiking-graph-sim']
      },
      {
        id: 'proj-2',
        title: 'National Agricultural Edge Vision Benchmark (NAEV-26)',
        grantId: 'DST-AGRI-2026-119',
        domain: 'Edge Vision',
        fundingBody: 'Department of Science & Technology (DST)',
        budget: '₹14,00,000',
        progress: 92,
        status: 'Benchmarking',
        visibility: 'Open Science',
        leadInvestigator: 'Kavya Ramanathan (PhD Fellow)',
        collaborators: ['ICAR Drone Research Cell', 'Dept of Agronomy'],
        description: 'Large-scale aerial dataset for pest detection with low-latency TensorRT deployment on embedded edge drones.',
        milestones: [
          { title: 'Multi-Spectral Field Drone Flights & Annotation', deadline: 'Completed', status: 'completed' },
          { title: 'Quantized INT8 YOLOv10 Benchmark Suite', deadline: 'Completed', status: 'completed' },
          { title: 'Open-Access HuggingFace Dataset Release', deadline: 'Dec 01, 2026', status: 'in_progress' }
        ],
        datasets: ['HuggingFace Datasets: campusnet/naev-26-drone']
      },
      {
        id: 'proj-3',
        title: 'Federated Graph Convolutional Architectures for Clinical Telemetry',
        grantId: 'ICMR-JRF-2024-42',
        domain: 'Bio-inspired Machine Learning',
        fundingBody: 'Indian Council of Medical Research (ICMR)',
        budget: '₹9,80,000',
        progress: 100,
        status: 'Completed',
        visibility: 'Private Lab',
        leadInvestigator: 'Kavya Ramanathan (PhD Fellow)',
        collaborators: ['AIIMS New Delhi Telemedicine Center', 'IISc CDS'],
        description: 'Privacy-preserving distributed learning over multi-center clinical waveforms with differential privacy guarantees.',
        milestones: [
          { title: 'Mathematical Privacy Proofs & DP Bounds', deadline: 'Completed', status: 'completed' },
          { title: 'Multi-Hospital Federated Simulation Testbed', deadline: 'Completed', status: 'completed' },
          { title: 'IEEE Transactions Publication Final Acceptance', deadline: 'Completed', status: 'completed' }
        ],
        datasets: ['Confidential Medical Cohort #ICMR-2024']
      }
    ];
  });

  // New Project Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDomain, setFormDomain] = useState('Neuromorphic Computing');
  const [formGrantId, setFormGrantId] = useState('');
  const [formFundingBody, setFormFundingBody] = useState('SERB Core Research Grant');
  const [formBudget, setFormBudget] = useState('₹18,00,000');
  const [formDescription, setFormDescription] = useState('');

  const filtered = projectsList.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grantId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast({ type: 'error', message: 'Please provide project title.' });
      return;
    }

    const newProject: ResearchProjectItem = {
      id: `proj-${Date.now()}`,
      title: formTitle.trim(),
      grantId: formGrantId.trim() || `GRANT-${Date.now().toString().slice(-6)}`,
      domain: formDomain,
      fundingBody: formFundingBody,
      budget: formBudget,
      progress: 15,
      status: 'Active',
      visibility: 'Consortium',
      leadInvestigator: 'Kavya Ramanathan (PhD Fellow)',
      collaborators: ['IISc CDS Lab'],
      description: formDescription.trim() || 'Experimental research program investigating novel algorithmic models.',
      milestones: [
        { title: 'Literature Review & Theoretical Formalization', deadline: 'Nov 30, 2026', status: 'in_progress' },
        { title: 'Laboratory Prototype Benchmarking', deadline: 'Jan 2027', status: 'pending' }
      ],
      datasets: ['Lab Local Storage / Git Repository']
    };

    const updated = [newProject, ...projectsList];
    setProjectsList(updated);
    try {
      localStorage.setItem('campusnet_research_projects_list', JSON.stringify(updated));
    } catch {
      // storage unavailable
    }

    addToast({
      type: 'success',
      message: `Research Project "${newProject.title}" registered successfully!`
    });

    setIsNewProjectModalOpen(false);
    setFormTitle('');
    setFormGrantId('');
    setFormDescription('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Research Projects & Laboratories
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {projectsList.length} Active Grants
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Funded academic research, laboratory experimental deliverables, and multi-institutional consortia
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Active', 'Benchmarking', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab
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
            placeholder="Search projects, domains, or grant numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6954C8] text-slate-800"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#6954C8] bg-purple-50 px-2 py-0.5 rounded">
                  {project.domain}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  project.visibility === 'Private Lab' ? 'bg-slate-100 text-slate-700' :
                  project.visibility === 'Open Science' ? 'bg-teal-50 text-teal-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  <Lock className="w-3 h-3" />
                  {project.visibility}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#182442] leading-snug">
                  {project.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Grant ID: {project.grantId}
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {project.description}
              </p>

              {/* Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Deliverables Completed</span>
                  <span className="text-[#6954C8]">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6954C8] rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">{project.budget}</span>
              <button
                onClick={() => setSelectedProject(project)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6954C8] font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Lab</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Inspection Drawer Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#6954C8] bg-purple-50 px-2 py-0.5 rounded">
                  {selectedProject.domain} • {selectedProject.visibility}
                </span>
                <h3 className="text-lg font-black text-[#182442]">{selectedProject.title}</h3>
                <p className="text-xs text-slate-500">
                  Funder: <strong>{selectedProject.fundingBody}</strong> • Grant: <strong>{selectedProject.grantId}</strong> ({selectedProject.budget})
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Research Objective</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-[#F4F6FA] p-3.5 rounded-2xl border border-slate-200/60">
                {selectedProject.description}
              </p>
            </div>

            {/* Milestone Deliverables */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Milestones & Tasks</h4>
                <span className="text-xs font-bold text-[#6954C8]">{selectedProject.progress}% Finished</span>
              </div>
              <div className="space-y-2">
                {selectedProject.milestones.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{m.title}</p>
                      <p className="text-[10px] text-slate-400">Due: {m.deadline}</p>
                    </div>
                    <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborators */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Consortium Investigators & RAs</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.collaborators.map(c => (
                  <span key={c} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close Lab Workspace
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Register Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-[#182442]">Register Research Project</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asynchronous Spiking Graph Architectures on RISC-V"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Domain</label>
                  <input
                    type="text"
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grant Number</label>
                  <input
                    type="text"
                    placeholder="CRG/2026/0014"
                    value={formGrantId}
                    onChange={(e) => setFormGrantId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Scope & Abstract</label>
                <textarea
                  rows={3}
                  placeholder="Describe experimental methodology, testbed equipment, and deliverables..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

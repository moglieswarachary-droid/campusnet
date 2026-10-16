import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { 
  BookOpen, Sparkles, Award, Users, Calendar, 
  Bell, Settings, LogOut, Globe, User, ChevronDown, 
  Search, FileText, Share2, ArrowRight, CheckCircle2,
  Plus, ExternalLink, Compass
} from 'lucide-react';

import { ResearcherAuthView } from './ResearcherAuthView';
import { PhDScholarDashboardView } from '../../dashboard/PhDScholarDashboardView';
import { PhDScholarProfileEditModal } from '../../dashboard/PhDScholarProfileEditModal';
import { ResearchHubView } from '../../research/ResearchHubView';
import { WorkspaceSwitcher } from '../../common/WorkspaceSwitcher';
import { ToastContainer } from '../../common/Toast';

// Dedicated Researcher Portal Navigation
const ResearcherNavbar: React.FC<{ onOpenEditProfile: () => void }> = ({ onOpenEditProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, addToast, logoutPortalSession } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const researcherNavItems = [
    { label: 'Overview', path: '/researcher/dashboard', icon: BookOpen },
    { label: 'Publications', path: '/researcher/publications', icon: FileText },
    { label: 'Research Projects', path: '/researcher/projects', icon: Compass },
    { label: 'Collaborations', path: '/researcher/collaborations', icon: Users },
    { label: 'Open Opportunities', path: '/researcher/opportunities', icon: Sparkles },
    { label: 'Notifications', path: '/researcher/notifications', icon: Bell },
    { label: 'Settings', path: '/researcher/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutPortalSession('scholar');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-4">
            <Link to="/researcher/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  CampusNet<span className="text-purple-700">+</span>
                </span>
                <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Research Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {researcherNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />

            <Link
              to="/landing"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
              title="Explore public campus directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Directory</span>
            </Link>

            {/* Scholar Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white border border-slate-100 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                      PhD Scholar • IISc
                    </span>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Scholar Profile</span>
                    </button>
                    <Link
                      to="/researcher/publications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Publication Pre-prints</span>
                    </Link>
                    <Link
                      to="/researcher/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>ORCID & Lab Preferences</span>
                    </Link>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Research Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sub-View: Publications List
const ResearcherPublicationsView: React.FC = () => {
  const { publications, addToast } = useApp();
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Research Publications & Pre-Prints</h2>
          <p className="text-xs text-slate-500 mt-0.5">Peer-reviewed whitepapers, conference proceedings, and open science pre-prints.</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', message: 'Opening Pre-Print Submission Modal...' })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Whitepaper</span>
        </button>
      </div>

      <div className="space-y-4">
        {publications.map((pub) => (
          <div key={pub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {pub.journal} ({pub.year})
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{pub.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Authors: {pub.authors?.join(', ') || 'Pooja Sundaram et al.'}</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
                Citations: {pub.citations || 18}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {pub.abstract}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-400 font-mono">DOI: {pub.doi || '10.1145/3610548.3618192'}</span>
              <a
                href={pub.datasetLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline"
              >
                <span>Read Full Paper</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-View: Researcher Academic Profile
const ResearcherProfileView: React.FC<{ onOpenEdit: () => void }> = ({ onOpenEdit }) => {
  const { currentUser, researchers } = useApp();
  const currentScholar = researchers.find(r => r.email === currentUser.email) || researchers[0];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-32 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/30">
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Doctoral Fellow • CSIR-NET JRF</span>
          </div>
        </div>
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={currentScholar?.avatar || currentUser?.avatar}
              alt={currentScholar?.name || currentUser?.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
            />
            <div className="mb-1">
              <h1 className="text-xl font-black text-slate-900">{currentScholar?.name || currentUser?.name}</h1>
              <p className="text-xs text-slate-600 font-medium">
                {currentScholar?.department || 'Department of Computational and Data Sciences'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  {currentScholar?.institution || 'Indian Institute of Science (IISc)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ORCID Verified
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onOpenEdit}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors shadow-xs"
          >
            Edit Scholar Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Bibliometric Identifiers</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Institution</span>
              <span className="font-bold text-slate-800">{currentScholar?.institution || 'IISc Bengaluru'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Official Email</span>
              <span className="font-mono text-slate-700">{currentScholar?.email || currentUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ORCID iD</span>
              <span className="font-mono text-purple-700 font-bold">0000-0002-1825-0097</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Citations</span>
              <span className="text-sm font-black text-purple-700">142 Citations (h-index: 6)</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Research Focus & Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {(currentScholar?.domains || currentScholar?.interests || ['Distributed Graph Neural Networks', 'Edge AI', 'Bio-inspired Computing', 'Federated Learning']).map((d: string) => (
              <span key={d} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                {d}
              </span>
            ))}
          </div>

          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pt-2">Doctoral Thesis Abstract</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentScholar?.bio || 'Investigating high-throughput parallel inference on resource-constrained neuromorphic edge processors. Lead author on 3 IEEE/ACM conference papers.'}
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-4">
            <Link to="/researcher/publications" className="text-xs font-bold text-purple-700 hover:underline">
              View All Publications →
            </Link>
            <Link to="/researcher/collaborations" className="text-xs font-bold text-purple-700 hover:underline">
              Active Collaborations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-View: Research Projects
const ResearcherProjectsView: React.FC = () => {
  const { addToast } = useApp();
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Active Research Projects & Grants</h2>
          <p className="text-xs text-slate-500 mt-0.5">Funded academic grants, laboratory experiments, and reproducible dataset repositories.</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', message: 'Project registration modal opening...' })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">SERB Grant CRG/2025</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Neuromorphic Graph Processing on Ultra-Low-Power RISC-V</h4>
              <p className="text-xs text-slate-500 mt-1">Investigation into asynchronous event-based neural spike simulation with IISc & IIT Delhi.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong className="text-emerald-700">Benchmarking Phase</strong></span>
            <span>2 Undergraduate RAs Assigned</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Open Science Initiative</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">National Agricultural Edge Vision Benchmark (NAEV-26)</h4>
              <p className="text-xs text-slate-500 mt-1">Curated 50,000 drone imagery dataset for crop pest detection in peninsular India.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong className="text-blue-700">Open Pre-Print</strong></span>
            <span>HuggingFace / Zenodo DOI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-View: Research Collaborations
const ResearcherCollaborationsView: React.FC = () => {
  const { addToast } = useApp();
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Collaborations & Co-Authors</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cross-institutional research partnerships, joint grant proposals, and mentor connections.</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', message: 'Send collaboration invite modal ready.' })}
          className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
        >
          + Request Collaboration
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">Active Joint Paper</span>
            <h4 className="text-xs font-bold text-slate-900">Dr. Arvind Rao (IIT Bombay) & Kavya Ramanathan (IISc)</h4>
            <p className="text-[11px] text-slate-500">Topic: "Hardware-in-the-Loop Edge Telemetry for Autonomous Agro-UAVs" • Target: ACM SenSys 2026</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg shrink-0">
            Draft in Review (75%)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">Incoming Research RA Application</span>
            <h4 className="text-xs font-bold text-slate-900">Aarav Sharma (NIT Karnataka, B.Tech AI)</h4>
            <p className="text-[11px] text-slate-500">Applied for: "Edge PyTorch Benchmark RA" • Skill match: 96%</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => addToast({ type: 'success', message: 'Accepted Aarav Sharma as Research Assistant!' })}
              className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs"
            >
              Approve RA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-View: Open Opportunities (RA Positions & Calls for Papers)
const ResearcherOpportunitiesView: React.FC = () => {
  const { addToast } = useApp();
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Research Opportunities & RA Openings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Recruit undergraduate innovators, explore national doctoral travel grants, and discover calls for papers.</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', message: 'Publishing undergraduate RA opening...' })}
          className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
        >
          + Post RA Position
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">Open Call for Undergraduate RAs</span>
            <span className="text-xs text-slate-400">Closes in 12 days</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Undergraduate Research Assistant — Edge TensorRT & ROS 2 Telemetry</h4>
          <p className="text-xs text-slate-600">Looking for 2 undergraduate engineers with strong Python/PyTorch and Linux embedded systems skills to run experiments on Nvidia Jetson Orin Nano boards.</p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-purple-700 font-bold">Stipend: ₹12,000/month + Co-authorship credit</span>
            <span className="text-slate-500">14 Applications Received</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-View: Researcher Notifications
const ResearcherNotificationsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Research & Scholarly Alerts</h2>
        <p className="text-xs text-slate-500 mt-0.5">Citation notifications, peer reviews, RA candidate applications, and symposium announcements.</p>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900">New Citation Recorded</h4>
            <p className="text-xs text-slate-600 mt-0.5">Your paper "Energy-Efficient Spiking Graph Convolutions" was cited in IEEE Transactions on Computers.</p>
            <span className="text-[10px] text-slate-400 mt-1 block">5 hours ago</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900">Undergraduate RA Candidate Submission</h4>
            <p className="text-xs text-slate-600 mt-0.5">Student Aarav Sharma (NITK) submitted an RA application with GitHub portfolio.</p>
            <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-View: Researcher Settings
const ResearcherSettingsView: React.FC = () => {
  const { addToast } = useApp();
  const [openAccess, setOpenAccess] = useState(true);
  const [notifyCitations, setNotifyCitations] = useState(true);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Research Workspace Preferences</h2>
        <p className="text-xs text-slate-500 mt-0.5">Configure ORCID syncing, open-access repository defaults, and preprint visibility.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-800">Automatic Pre-Print Open Access (CC-BY 4.0)</p>
              <p className="text-[11px] text-slate-500">Allow automatic open discovery of non-peer-reviewed academic pre-prints across India</p>
            </div>
            <input
              type="checkbox"
              checked={openAccess}
              onChange={(e) => {
                setOpenAccess(e.target.checked);
                addToast({ type: 'info', message: 'Open access preference updated.' });
              }}
              className="w-4 h-4 text-purple-700 rounded"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-800">Citation & Co-Author Alerts</p>
              <p className="text-[11px] text-slate-500">Receive weekly digests when publications receive new indexing citations</p>
            </div>
            <input
              type="checkbox"
              checked={notifyCitations}
              onChange={(e) => {
                setNotifyCitations(e.target.checked);
                addToast({ type: 'info', message: 'Citation alert preferences saved.' });
              }}
              className="w-4 h-4 text-purple-700 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Researcher Portal App
export const ResearcherPortalApp: React.FC = () => {
  const location = useLocation();
  const { researchers, currentUser } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const currentScholar = researchers.find(r => r.email === currentUser.email) || researchers[0];

  const isAuthRoute = 
    location.pathname === '/researcher/login' || 
    location.pathname === '/researcher/register' || 
    location.pathname === '/researcher/forgot-password';

  if (isAuthRoute) {
    const mode = location.pathname.includes('register') 
      ? 'register' 
      : location.pathname.includes('forgot-password') 
        ? 'forgot-password' 
        : 'login';
    return <ResearcherAuthView mode={mode} />;
  }

  // Bare /researcher redirect to /researcher/dashboard
  if (location.pathname === '/researcher' || location.pathname === '/researcher/') {
    return <Navigate to="/researcher/dashboard" replace />;
  }

  // Guard: If not authenticated, redirect to login preserving intended target
  const isAuthenticated = Boolean(currentUser && currentUser.id);
  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/researcher/dashboard' 
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : '';
    return <Navigate to={`/researcher/login${redirectParam}`} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <ResearcherNavbar onOpenEditProfile={() => setIsEditProfileOpen(true)} />

      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/researcher/dashboard" element={<PhDScholarDashboardView />} />
          <Route path="/researcher/profile" element={<ResearcherProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
          <Route path="/researcher/publications" element={<ResearcherPublicationsView />} />
          <Route path="/researcher/projects" element={<ResearcherProjectsView />} />
          <Route path="/researcher/collaborations" element={<ResearcherCollaborationsView />} />
          <Route path="/researcher/opportunities" element={<ResearcherOpportunitiesView />} />
          <Route path="/researcher/notifications" element={<ResearcherNotificationsView />} />
          <Route path="/researcher/settings" element={<ResearcherSettingsView />} />

          {/* Relative path fallbacks */}
          <Route path="dashboard" element={<PhDScholarDashboardView />} />
          <Route path="profile" element={<ResearcherProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
          <Route path="publications" element={<ResearcherPublicationsView />} />
          <Route path="projects" element={<ResearcherProjectsView />} />
          <Route path="collaborations" element={<ResearcherCollaborationsView />} />
          <Route path="opportunities" element={<ResearcherOpportunitiesView />} />
          <Route path="notifications" element={<ResearcherNotificationsView />} />
          <Route path="settings" element={<ResearcherSettingsView />} />

          <Route path="*" element={<Navigate to="/researcher/dashboard" replace />} />
        </Routes>
      </main>

      {/* Edit Scholar Profile Modal */}
      {isEditProfileOpen && (
        <PhDScholarProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          scholar={currentScholar}
        />
      )}

      <ToastContainer />
    </div>
  );
};

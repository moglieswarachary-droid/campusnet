import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, Award, Users, CheckCircle2, Clock,
  MessageSquare, Plus, FileText, Sparkles, Check,
  X, AlertCircle, ArrowRight, Video, Calendar,
  Star, ExternalLink, QrCode, Bookmark, ChevronRight,
  Code2, BookOpen, Edit3, TrendingUp, AlertTriangle,
  GitBranch, HelpCircle
} from 'lucide-react';
import { MentorProfileEditModal } from './MentorProfileEditModal';
import { LetterAvatar } from '../common/LetterAvatar';

export const MentorDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser, mentors, teams, projects, mentorshipRequests,
    mentorshipCertificates, respondToMentorshipRequest,
    startVideoMeeting, setIsAIModalOpen, addToast
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Active' | 'At Risk' | 'Awaiting Review' | 'Completed'>('All');

  // Active mentor data
  const currentMentor = mentors.find(m =>
    (currentUser?.email && m.email === currentUser.email) ||
    (currentUser?.name && m.name === currentUser.name)
  ) || mentors[0];

  // Requests for this mentor
  const myRequests = mentorshipRequests.filter(r =>
    r.mentorId === currentMentor.id ||
    (currentUser?.name && r.mentorName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || ''))
  );
  const pendingRequests = myRequests.filter(r => r.status === 'pending');

  // Guided teams
  const myGuidedTeams = teams.filter(t =>
    t.mentorId === currentMentor.id ||
    t.mentorName === currentMentor.name ||
    t.mentorStatus === 'accepted' ||
    (t.status === 'active' && Boolean(t.mentorId))
  );

  // Calculate actual profile completion
  const calculateProfileCompletion = () => {
    let score = 0;
    const total = 5;
    if (currentMentor?.avatar) score++;
    if (currentMentor?.bio && currentMentor.bio.length > 20) score++;
    if (currentMentor?.expertise && currentMentor.expertise.length > 0) score++;
    if (currentMentor?.institution) score++;
    if (currentMentor?.vidwan_profile_url || currentMentor?.socialLinks?.linkedin) score++;
    return Math.round((score / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Guided Projects Dataset
  const guidedProjects = [
    {
      id: 'gp-01',
      title: 'AgriVision: Autonomous Micro-Drones',
      description: 'Edge computer vision and spectral crop disease detection on Jetson Orin Nano.',
      teamName: 'Team AgriVision (6 Students)',
      progress: 82,
      nextMilestone: 'Milestone 3: Field Spray Flight Test',
      dueDate: 'April 24, 2026',
      status: 'Active' as const,
      teamId: teams[0]?.id || 'team-01'
    },
    {
      id: 'gp-02',
      title: 'Distributed Byzantine Ledger',
      description: 'High-throughput BFT consensus with sub-100ms WAN jitter tolerance.',
      teamName: 'Team Consensus (4 Students)',
      progress: 90,
      nextMilestone: 'Milestone 4: IEEE Trans Paper Submission',
      dueDate: 'April 28, 2026',
      status: 'Awaiting Review' as const,
      teamId: 'team-02'
    },
    {
      id: 'gp-03',
      title: 'MedEdge: Wearable ECG Processing',
      description: 'Embedded FIR DSP filters on STM32 for arrhythmia detection.',
      teamName: 'Team MedEdge (3 Students)',
      progress: 65,
      nextMilestone: 'Milestone 2: Fixed-Point CMSIS Filter',
      dueDate: 'April 20, 2026',
      status: 'At Risk' as const,
      teamId: 'team-03'
    },
    {
      id: 'gp-04',
      title: 'NeuralGrid: Smart Power Microgrid ML',
      description: 'Distributed frequency regulation using reinforcement learning agents.',
      teamName: 'Team NeuralGrid (5 Students)',
      progress: 100,
      nextMilestone: 'Final Completion & Certificate Sign-Off',
      dueDate: 'Completed',
      status: 'Completed' as const,
      teamId: 'team-04'
    }
  ];

  const filteredProjects = guidedProjects.filter(p => {
    if (projectFilter === 'All') return true;
    return p.status === projectFilter;
  });

  // Actionable "Needs Your Attention" items
  const attentionItems = [
    {
      id: 'att-01',
      title: 'Incoming Mentorship Pitch: Team AgriVision (SIH 2026)',
      type: 'Request',
      category: 'Student Request',
      priority: 'Urgent',
      deadline: 'Awaiting Response',
      actionText: 'Review Pitch',
      action: () => navigate('/mentor/requests')
    },
    {
      id: 'att-02',
      title: 'KrishiDrone AI — Milestone 2: INT8 Model Optimization',
      type: 'Review',
      category: 'Milestone Evaluation',
      priority: 'High',
      deadline: 'Submitted 2 Days Ago',
      actionText: 'Grade Rubric',
      action: () => navigate('/mentor/reviews')
    },
    {
      id: 'att-03',
      title: 'Live Consultation: KrishiDrone ROS 2 Architecture',
      type: 'Meeting',
      category: 'Office Hours',
      priority: 'Normal',
      deadline: 'Today @ 04:30 PM IST',
      actionText: 'Join Video Room',
      action: () => startVideoMeeting(teams[0]?.id || 'team-01')
    },
    {
      id: 'att-04',
      title: 'Team MedEdge — Fixed-point FIR filter revision overdue',
      type: 'Alert',
      category: 'Milestone Overdue',
      priority: 'Attention',
      deadline: 'Overdue by 2 Days',
      actionText: 'Send Directive',
      action: () => navigate('/mentor/messages')
    }
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in">
      
      {/* 1. MENTOR IDENTITY & COMPACT COMMAND HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Profile Avatar & Academic Details */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <LetterAvatar
              name={currentMentor?.name || currentUser?.name || 'Mentor'}
              size="xl"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-slate-200/80 shadow-2xs"
            />
            {currentMentor?.verifiedMentor && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0F9488] rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]"
                title="Verified Faculty Mentor"
              >
                ✓
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A] tracking-tight">
                {currentMentor?.name || currentUser?.name || 'Dr. Arvind Rao'}
              </h1>
              {currentMentor?.verifiedMentor && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-[#0F9488] border border-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Faculty Mentor
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {currentMentor?.designation || 'Associate Professor & Head of Robotics'} • {currentMentor?.institution || 'IIT Bombay'}
            </p>

            {/* Specialization Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {(currentMentor?.expertise || ['Autonomous Systems', 'Edge AI', 'Computer Vision']).slice(0, 3).map(e => (
                <span key={e} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F3F6FA] text-slate-700 border border-slate-200/60">
                  {e}
                </span>
              ))}
              {currentMentor?.vidwan_profile_url && (
                <a
                  href={currentMentor.vidwan_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-0.5 hover:underline"
                >
                  <span>Vidwan</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Profile Completeness */}
        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          
          {/* Capacity Meter */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#F3F6FA] border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Intake Bandwidth</span>
              <span className="text-xs font-black text-[#12243A]">
                {myGuidedTeams.length} / 5 Teams Active
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9488]" title="Available for advisory" />
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#0F9488]" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mentor Copilot</span>
          </button>
        </div>
      </div>

      {/* 2. RESPONSIVE KPI ROW (Phase 6: Useful Dashboard Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Active Mentees */}
        <Link
          to="/mentor/students"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0F9488] transition-all flex flex-col justify-between space-y-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Active Mentees
          </span>
          <div>
            <div className="text-2xl font-black text-[#12243A] group-hover:text-[#0F9488] transition-colors">
              {myGuidedTeams.reduce((acc, t) => acc + (t.members?.length || 4), 0)} Students
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Across {myGuidedTeams.length} teams</span>
          </div>
        </Link>

        {/* KPI 2: Pending Requests */}
        <Link
          to="/mentor/requests"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#F3A640] transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F3A640]">
              Pending Requests
            </span>
            {pendingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F3A640] animate-pulse" />
            )}
          </div>
          <div>
            <div className="text-2xl font-black text-[#12243A] group-hover:text-[#F3A640] transition-colors">
              {pendingRequests.length} Pitches
            </div>
            <span className="text-[10px] text-[#F3A640] font-bold block mt-0.5">Requires Evaluation</span>
          </div>
        </Link>

        {/* KPI 3: Reviews Awaiting Action */}
        <Link
          to="/mentor/reviews"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Pending Reviews
          </span>
          <div>
            <div className="text-2xl font-black text-[#12243A] group-hover:text-blue-700 transition-colors">
              1 Deliverable
            </div>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">INT8 Optimization</span>
          </div>
        </Link>

        {/* KPI 4: Upcoming Sessions */}
        <Link
          to="/mentor/sessions"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Office Hours
          </span>
          <div>
            <div className="text-2xl font-black text-[#12243A] group-hover:text-emerald-700 transition-colors">
              Today 4:30 PM
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Video Room Active</span>
          </div>
        </Link>

        {/* KPI 5: Active Guided Projects */}
        <Link
          to="/mentor/projects"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0F9488] transition-all flex flex-col justify-between space-y-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Guided Projects
          </span>
          <div>
            <div className="text-2xl font-black text-[#12243A] group-hover:text-[#0F9488] transition-colors">
              {guidedProjects.length} Projects
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">1 Completed Cycle</span>
          </div>
        </Link>

      </div>

      {/* 3. TWO-COLUMN ACTIONABLE DASHBOARD: Needs Your Attention & Quick Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left: "Needs Your Attention" Action List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F3A640] animate-pulse" />
              <h2 className="text-base font-black text-[#12243A] tracking-tight">
                Needs Your Attention
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {attentionItems.length} Urgent Action Items
            </span>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-teal-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      item.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                      item.priority === 'High' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-teal-50 text-[#0F9488] border border-teal-200'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-500">{item.deadline}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#12243A]">
                    {item.title}
                  </h4>
                </div>

                <div className="self-end sm:self-auto shrink-0">
                  <button
                    onClick={item.action}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      item.type === 'Meeting'
                        ? 'bg-[#0F9488] hover:bg-[#0D7E73] text-white flex items-center gap-1.5'
                        : 'bg-[#12243A] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {item.type === 'Meeting' && <Video className="w-3.5 h-3.5" />}
                    <span>{item.actionText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Advisory Bandwidth & AI Assistant Trigger (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Mentor Assistant Callout */}
          <div className="bg-gradient-to-br from-[#12243A] via-[#1A365D] to-teal-950 text-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F3A640]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-200">
                AI Mentor Copilot
              </h3>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              Accelerate project oversight by generating milestone summaries, drafting rubric feedback, or preparing meeting notes.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center justify-between"
              >
                <span>Summarize AgriVision TensorRT benchmarks</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
              </button>
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center justify-between"
              >
                <span>Draft revision directive for MedEdge</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
              </button>
            </div>
          </div>

          {/* Issued Credentials Quick Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#0F9488]" />
                <h4 className="text-xs font-bold text-[#12243A]">Issued Certificates</h4>
              </div>
              <span className="text-[10px] font-extrabold text-[#0F9488] bg-teal-50 px-2 py-0.5 rounded-md">
                {mentorshipCertificates.length} Validated
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Official academic completion credentials signed with immutable cryptographic verification.
            </p>
            <Link
              to="/mentor/certificates"
              className="w-full text-center py-2 px-3 bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold rounded-xl transition-colors block shadow-2xs"
            >
              Manage & Issue Certificates →
            </Link>
          </div>

        </div>

      </div>

      {/* 4. FULL-WIDTH GUIDED PROJECTS TABLE (Phase 8: Project Management) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-[#12243A]">
              Guided Projects Portfolio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active capstone and hackathon teams under your faculty supervision
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Active', 'At Risk', 'Awaiting Review', 'Completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setProjectFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  projectFilter === tab
                    ? 'bg-[#0F9488] text-white shadow-xs'
                    : 'bg-[#F3F6FA] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Project Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F3F6FA] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Project & Architecture</th>
                <th className="p-3.5">Student Team</th>
                <th className="p-3.5">Sprint Progress</th>
                <th className="p-3.5">Next Milestone & Due</th>
                <th className="p-3.5">Health Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProjects.map(proj => (
                <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-4">
                    <h5 className="font-bold text-[#12243A] text-xs leading-tight">{proj.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proj.description}</p>
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold whitespace-nowrap">
                    {proj.teamName}
                  </td>
                  <td className="p-3.5 w-36">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#0F9488]">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0F9488] rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-[#12243A] block">{proj.nextMilestone}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{proj.dueDate}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      proj.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      proj.status === 'At Risk' ? 'bg-red-50 text-red-700 border border-red-200' :
                      proj.status === 'Awaiting Review' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startVideoMeeting(proj.teamId)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[#0F9488]"
                        title="Live Video Sync"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to="/mentor/reviews"
                        className="px-2.5 py-1 rounded-lg bg-[#0F9488] hover:bg-[#0D7E73] text-white text-[11px] font-bold"
                      >
                        Review
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && currentMentor && (
        <MentorProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mentor={currentMentor}
        />
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FolderKanban, Search, Filter, ArrowRight, ExternalLink,
  CheckCircle2, Clock, AlertTriangle, Users, Calendar,
  Video, Award, GitBranch, MessageSquare, ChevronRight,
  Eye, Check, X, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, Team } from '../../../types';

interface EnrichedProject extends Project {
  team: Team;
  calculatedCategory: 'Active' | 'At Risk' | 'Awaiting Review' | 'Completed';
  nextMilestone: {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'approved' | 'in_progress' | 'rejected';
  };
}

export const MentorProjectsView: React.FC = () => {
  const { projects, teams, startVideoMeeting, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'At Risk' | 'Awaiting Review' | 'Completed'>('All');
  const [selectedProject, setSelectedProject] = useState<EnrichedProject | null>(null);

  // Milestone feedback state inside workspace
  const [feedbackNote, setFeedbackNote] = useState('');

  // Map and enrich projects with guided teams
  const enrichedProjects = projects.map(p => {
    const matchedTeam = teams.find(t => t.id === p.teamId || t.name === p.teamName || t.projectName.toLowerCase().includes(p.title.toLowerCase())) || teams[0];
    
    // Status normalization for filter
    let calculatedCategory: 'Active' | 'At Risk' | 'Awaiting Review' | 'Completed' = 'Active';
    if (p.progressPercent >= 100 || p.status === 'Completed') {
      calculatedCategory = 'Completed';
    } else if (p.progressPercent < 35) {
      calculatedCategory = 'At Risk';
    } else if (p.status === 'Testing' || p.status === 'Prototype') {
      calculatedCategory = 'Awaiting Review';
    }

    const nextMilestone = p.milestones?.find(m => m.status === 'in_progress' || m.status === 'pending') || {
      id: 'm-default',
      title: 'Sprint 2 Deliverable Review',
      dueDate: 'Oct 24, 2026',
      status: 'pending' as const
    };

    return {
      ...p,
      team: matchedTeam,
      calculatedCategory,
      nextMilestone
    };
  });

  const filtered = enrichedProjects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.team && p.team.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || p.calculatedCategory === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendFeedback = () => {
    if (!feedbackNote.trim()) {
      addToast({ type: 'error', message: 'Please write a review comment before submitting.' });
      return;
    }
    addToast({
      type: 'success',
      message: `Feedback recorded and dispatched to ${selectedProject?.title} repository.`
    });
    setFeedbackNote('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Guided Projects Workspace
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                {enrichedProjects.length} Supervised Innovations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time milestone tracking, code artifact repositories, and deliverable review workflows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/mentor/reviews"
            className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Open Rubric Reviews</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Active', 'At Risk', 'Awaiting Review', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-[#12243A] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, technologies, or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F9488] text-slate-800"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-[#F3F6FA] text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Project & Domain</th>
                <th className="py-3.5 px-6">Student Team</th>
                <th className="py-3.5 px-6">Progress</th>
                <th className="py-3.5 px-6">Next Milestone</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map(project => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Title & Domain */}
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-[#0F9488]">
                        {project.domain}
                      </span>
                      <h4 className="font-bold text-[#12243A] group-hover:text-[#0F9488] transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">
                        {project.description || project.problemStatement}
                      </p>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{project.team?.name || 'Innovation Cohort'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {project.team?.members?.length || 4} Students • {project.institution}
                      </p>
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td className="py-4 px-6 min-w-[140px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-extrabold text-slate-700">
                        <span>Milestones</span>
                        <span className="text-[#0F9488]">{project.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            project.progressPercent >= 80 ? 'bg-[#0F9488]' :
                            project.progressPercent >= 50 ? 'bg-teal-500' :
                            'bg-[#F3A640]'
                          }`}
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Next Milestone */}
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]">
                        {project.nextMilestone.title}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due {project.nextMilestone.dueDate}</span>
                      </p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      project.calculatedCategory === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      project.calculatedCategory === 'Awaiting Review' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      project.calculatedCategory === 'At Risk' ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}>
                      {project.calculatedCategory === 'Awaiting Review' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {project.calculatedCategory === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{project.calculatedCategory}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startVideoMeeting(project.team?.id || project.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-teal-50 hover:text-[#0F9488] text-slate-600 transition-colors"
                        title="Launch Team Video Sync"
                      >
                        <Video className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Workspace Inspection Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#0F9488] bg-teal-50 px-2 py-0.5 rounded">
                  {selectedProject.domain}
                </span>
                <h2 className="text-xl font-black text-[#12243A]">{selectedProject.title}</h2>
                <p className="text-xs text-slate-500">
                  Institution: <strong>{selectedProject.institution}</strong> • Team: <strong>{selectedProject.teamName || selectedProject.team?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Problem & Solution */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Problem Statement</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-[#F3F6FA] p-3 rounded-xl border border-slate-200/60">
                  {selectedProject.problemStatement || selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Proposed Solution & Tech Stack</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-[#F3F6FA] p-3 rounded-xl border border-slate-200/60">
                  {selectedProject.proposedSolution || 'Edge AI inference system with low-latency ROS 2 telemetry pipeline.'}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(selectedProject.technologies || ['Python', 'Docker', 'TensorRT', 'FastAPI']).map(tech => (
                    <span key={tech} className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-[#0F9488] border border-teal-200/60 text-[10px] font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones & Deliverables */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Milestones & Verification History</h4>
                <span className="text-xs font-bold text-[#0F9488]">{selectedProject.progressPercent}% Completed</span>
              </div>

              <div className="space-y-2">
                {(selectedProject.milestones || [
                  { id: 'm1', title: 'System Architecture & Mathematical Formulation', status: 'approved', dueDate: 'Completed' },
                  { id: 'm2', title: 'Hardware Testbed & TensorRT Optimization Benchmark', status: 'in_progress', dueDate: 'Oct 24, 2026' },
                  { id: 'm3', title: 'National Hackathon Finale Deployment', status: 'pending', dueDate: 'Nov 12, 2026' }
                ]).map((m, idx) => (
                  <div key={m.id || idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{m.title}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          m.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">Due: {m.dueDate}</span>
                    </div>

                    <Link
                      to="/mentor/reviews"
                      className="text-xs font-bold text-[#0F9488] hover:underline flex items-center gap-1"
                    >
                      <span>Review Rubric</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Revision Request / Feedback Box */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#0F9488]" />
                <span>Mentor Directives & Revision Notes</span>
              </h4>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Leave feedback on code artifacts, hardware testbed findings, or architectural advice..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0F9488] focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400">
                  Transmitted directly to all team members on their student dashboard.
                </p>
                <button
                  onClick={handleSendFeedback}
                  className="px-4 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Send Directives
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Workspace
              </button>

              <button
                onClick={() => {
                  startVideoMeeting(selectedProject.team?.id || selectedProject.id);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#12243A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch Team Sync</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

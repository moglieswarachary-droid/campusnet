import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Video, MessageSquare, CheckSquare, GraduationCap, 
  FileText, Code2, Globe, ShieldCheck, Sparkles, Plus, 
  ArrowRight, ExternalLink, Download, Layers, Calendar
} from 'lucide-react';
import { TeamChat } from '../workspace/TeamChat';
import { KanbanBoard } from '../workspace/KanbanBoard';
import { MentorGuidanceTab } from '../workspace/MentorGuidanceTab';

export const WorkspaceView: React.FC = () => {
  const { teams, projects, startVideoMeeting, currentUser, setActiveTab } = useApp();
  
  const activeTeam = teams[0]; // AgriVision Autonomous AI (6 members)
  const activeProject = projects[0];

  const [activeTab, setActiveTabState] = useState<'overview' | 'tasks' | 'chat' | 'mentor' | 'files'>('overview');

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Workspace Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-campus-border shadow-warm-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="campus-badge-verified">
              <ShieldCheck className="w-3.5 h-3.5" />
              Private 6-Member Team Studio
            </span>
            <span className="text-xs font-bold text-campus-red bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              SIH 2026 Grand Finale Track
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            {activeTeam.name}
          </h1>

          <p className="text-xs sm:text-sm text-campus-muted-text max-w-2xl">
            {activeTeam.projectName} • {activeProject.institution}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => startVideoMeeting(activeTeam.id)}
            className="campus-btn-red text-xs sm:text-sm py-3 px-5 rounded-xl shadow-glow-red flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Launch Authorized Video Meeting
          </button>

          <a
            href={activeProject.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="campus-btn-secondary text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            GitHub Repo
          </a>
        </div>
      </div>

      {/* Progress & Milestone Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-campus-deep-blue">Project Milestone Velocity</h3>
            <p className="text-xs text-campus-muted-text">Verified progress confirmed by assigned mentor.</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-campus-deep-blue">{activeProject.progressPercent}% Completed</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full bg-campus-warm-white border border-campus-border overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-campus-blue via-campus-deep-blue to-campus-red rounded-full transition-all duration-500"
            style={{ width: `${activeProject.progressPercent}%` }}
          />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-green-50 text-green-900 border border-green-200">
            <div className="font-bold">1. Inception ✓</div>
            <div className="text-[10.5px] text-green-800">Approved</div>
          </div>
          <div className="p-2.5 rounded-xl bg-green-50 text-green-900 border border-green-200">
            <div className="font-bold">2. Hardware CAD ✓</div>
            <div className="text-[10.5px] text-green-800">FEA Passed</div>
          </div>
          <div className="p-2.5 rounded-xl bg-green-50 text-green-900 border border-green-200">
            <div className="font-bold">3. TensorRT Edge ✓</div>
            <div className="text-[10.5px] text-green-800">23.8ms Latency</div>
          </div>
          <div className="p-2.5 rounded-xl bg-campus-soft-blue text-campus-blue border border-blue-200 font-bold">
            <div>4. Flight Spray Test</div>
            <div className="text-[10.5px] text-blue-700">In Active Sprint</div>
          </div>
          <div className="p-2.5 rounded-xl bg-campus-warm-white text-campus-muted-text border border-campus-border">
            <div className="font-bold">5. National Finale</div>
            <div className="text-[10.5px]">Due April 18</div>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-campus-border pb-2">
        <button
          onClick={() => setActiveTabState('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-campus-deep-blue text-white shadow-warm-sm'
              : 'bg-white text-campus-slate-text hover:bg-campus-warm-white border border-campus-border'
          }`}
        >
          <Layers className="w-4 h-4" />
          Overview & 6-Member Roster
        </button>

        <button
          onClick={() => setActiveTabState('tasks')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-campus-deep-blue text-white shadow-warm-sm'
              : 'bg-white text-campus-slate-text hover:bg-campus-warm-white border border-campus-border'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Milestone Taskboard
        </button>

        <button
          onClick={() => setActiveTabState('chat')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-campus-deep-blue text-white shadow-warm-sm'
              : 'bg-white text-campus-slate-text hover:bg-campus-warm-white border border-campus-border'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Team Chat & Files
        </button>

        <button
          onClick={() => setActiveTabState('mentor')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mentor'
              ? 'bg-campus-deep-blue text-white shadow-warm-sm'
              : 'bg-white text-campus-slate-text hover:bg-campus-warm-white border border-campus-border'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-300" />
          Mentor Guidance & Reviews
        </button>
      </div>

      {/* Tab 1: Overview & 6-Member Roster */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* 6-Member Multi-Disciplinary Team Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-campus-deep-blue">
                Confirmed 6-Member Inter-Departmental Roster
              </h2>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                All 6 Slots Verified Bonafide
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTeam.members.map((member, idx) => (
                <div
                  key={member.userId}
                  className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex items-start gap-4"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-campus-border flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-campus-red uppercase tracking-wider">
                        Slot #{idx + 1}
                      </span>
                      {member.isLeader && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                          Team Lead
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-campus-deep-blue truncate">{member.name}</h4>
                    <p className="text-xs font-semibold text-campus-blue truncate">{member.role}</p>
                    <p className="text-[11px] text-campus-muted-text truncate mt-0.5">{member.department}</p>
                    <p className="text-[11px] text-campus-muted-text font-medium truncate">{member.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specs & Problem Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-white border border-campus-border shadow-warm-sm space-y-3">
              <h3 className="font-bold text-sm text-campus-deep-blue uppercase tracking-wider">
                Problem Statement & Field Need
              </h3>
              <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed">
                {activeProject.problemStatement}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-campus-border shadow-warm-sm space-y-3">
              <h3 className="font-bold text-sm text-campus-deep-blue uppercase tracking-wider">
                Proposed Interdisciplinary Solution
              </h3>
              <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed">
                {activeProject.proposedSolution}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Kanban Tasks */}
      {activeTab === 'tasks' && (
        <KanbanBoard projectId={activeProject.id} />
      )}

      {/* Tab 3: Team Chat */}
      {activeTab === 'chat' && (
        <TeamChat teamId={activeTeam.id} />
      )}

      {/* Tab 4: Mentor Guidance */}
      {activeTab === 'mentor' && (
        <MentorGuidanceTab teamId={activeTeam.id} projectId={activeProject.id} />
      )}

    </div>
  );
};

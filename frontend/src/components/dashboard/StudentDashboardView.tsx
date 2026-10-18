import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap, Calendar, Users, Award, ShieldCheck,
  FolderKanban, Sparkles, ChevronRight, Activity,
  Clock, Video, AlertCircle, CheckCircle2, ArrowRight,
  Search, BookOpen, Compass, QrCode, Edit3, MessageSquare,
  TrendingUp, Bell, Check, Sparkle, Plus
} from 'lucide-react';
import { StudentProfileEditModal } from './StudentProfileEditModal';
import { LetterAvatar } from '../common/LetterAvatar';

export const StudentDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser, projects, teams, events, mentors,
    certificates, notifications, startVideoMeeting,
    setIsAIModalOpen, addToast
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [completedPriorities, setCompletedPriorities] = useState<string[]>([]);

  const userTeams = teams.filter(t =>
    (currentUser?.email && (t as any).leaderEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && t.leaderId === currentUser.id) ||
    (Boolean(currentUser?.name && t.leaderName) && t.leaderName.toLowerCase() === currentUser.name.toLowerCase()) ||
    (t.members && t.members.some(m => m.userId === currentUser?.id || (currentUser?.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) || (Boolean(currentUser?.name && m.name) && m.name.toLowerCase() === currentUser.name.toLowerCase())))
  );
  const activeTeam = userTeams[0] || null;

  const userProjects = projects.filter(p =>
    (currentUser?.email && (p as any).authorEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && (p as any).authorId === currentUser.id) ||
    (Boolean(activeTeam && p.teamId === activeTeam.id)) ||
    ((p as any).collaborators && (p as any).collaborators.some((c: any) => c.email?.toLowerCase() === currentUser?.email?.toLowerCase() || c.id === currentUser?.id))
  );
  const activeProject = userProjects[0] || null;

  // Calculate actual profile completion percentage from user fields
  const calculateProfileCompletion = () => {
    let score = 0;
    const totalFields = 6;
    if (currentUser?.avatar) score++;
    if (currentUser?.bio && currentUser.bio.length > 20) score++;
    if (currentUser?.skills && currentUser.skills.length > 0) score++;
    if ((currentUser as any)?.rollNumber || currentUser?.studentId) score++;
    if (currentUser?.institution) score++;
    if (currentUser?.socialLinks?.github || currentUser?.socialLinks?.linkedin) score++;
    return Math.round((score / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Dynamic priorities based on real user state
  const priorityItems = [
    ...(profileCompletion < 100 ? [{
      id: 'prio-profile',
      title: 'Complete Your Academic Profile & Verify Bonafide',
      category: 'Profile',
      time: 'Recommended',
      priority: 'High',
      priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Fill in your department, student roll number, skills, and bio to enable mentor matching.',
      actionText: 'Complete Profile',
      actionType: 'profile',
      action: () => setIsEditModalOpen(true)
    }] : []),
    ...(activeTeam ? [{
      id: 'prio-sync',
      title: `Team Sprint Sync: ${activeTeam.name}`,
      category: 'Workspace',
      time: 'Today, Schedule sync',
      priority: 'Medium',
      priorityColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: `Review sprint milestones and task assignments with your ${activeTeam.name} teammates.`,
      actionText: 'Launch Sync',
      actionType: 'meeting',
      action: () => startVideoMeeting(activeTeam.id)
    }] : [{
      id: 'prio-team',
      title: 'Form or Join an Innovation Squad',
      category: 'Team',
      time: 'Get Started',
      priority: 'High',
      priorityColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Find teammates across departments or start your own innovation project team.',
      actionText: 'Find Teammates',
      actionType: 'navigate',
      action: () => navigate('/student/teams')
    }]),
    {
      id: 'prio-events',
      title: 'Explore Live Competitions & Hackathons',
      category: 'Events',
      time: 'Upcoming',
      priority: 'Normal',
      priorityColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Discover nationwide hackathons, register your team, and win verifiable certifications.',
      actionText: 'Browse Events',
      actionType: 'navigate',
      action: () => navigate('/student/events')
    },
    {
      id: 'prio-mentors',
      title: 'Connect with Verified Industry & Faculty Mentors',
      category: 'Mentorship',
      time: 'Open Slots',
      priority: 'Normal',
      priorityColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Request 1-on-1 milestone reviews and guidance from expert researchers and professors.',
      actionText: 'Find a Mentor',
      actionType: 'navigate',
      action: () => navigate('/student/mentorship')
    }
  ];

  const handleTogglePriority = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedPriorities.includes(id)) {
      setCompletedPriorities(prev => prev.filter(i => i !== id));
    } else {
      setCompletedPriorities(prev => [...prev, id]);
      addToast({ type: 'success', message: 'Priority item marked as accomplished!' });
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in">
      
      {/* 1. TOP COMMAND CENTER: Personalized Greeting & Academic Standing */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Student Avatar & Academic Identity */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <LetterAvatar
              name={currentUser?.name || 'Student'}
              size="xl"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-slate-200/80 shadow-2xs"
            />
            {currentUser?.verifiedStudent && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]"
                title="Verified Student Identity"
              >
                ✓
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue tracking-tight">
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              {currentUser?.verifiedStudent && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Student
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {currentUser?.department || 'Engineering & Technology'} • {currentUser?.institution || 'CampusNet Academic Network'}
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-slate-400">
              <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {(currentUser as any)?.rollNumber || currentUser?.studentId ? `Roll No: ${(currentUser as any)?.rollNumber || currentUser?.studentId}` : `ID: ${currentUser?.email?.split('@')[0] || 'Verified'}`}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-600">{currentUser?.year || 'Class of 2026/27'}</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">Status: Active</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Real Profile Completion Ring */}
        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          
          {/* Profile Completion Widget */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-campus-blue"
                  strokeDasharray={`${profileCompletion}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9px] font-black text-slate-700">{profileCompletion}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Profile</span>
              <span className="text-xs font-extrabold text-slate-800">
                {profileCompletion === 100 ? 'Complete' : 'Optimize'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-campus-blue" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="campus-btn-primary text-xs py-2.5 px-4 rounded-xl shadow-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* 2. PRIORITY SNAPSHOT CARDS (Next Action over decorative stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Next Lecture */}
        <Link
          to="/student/academics"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-campus-blue hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">
              Next Lecture
            </span>
            <BookOpen className="w-3.5 h-3.5 text-campus-blue" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-campus-blue transition-colors">
              CS401 Deep Learning
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">09:00 AM • LH-302</span>
          </div>
        </Link>

        {/* Due Submission */}
        <Link
          to="/student/academics"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-600">
              Pending Task
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-amber-700 transition-colors">
              ResNet CUDA Kernel
            </span>
            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Due in 6 Days</span>
          </div>
        </Link>

        {/* Project Progress */}
        <Link
          to="/student/teams"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-campus-blue hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">
              Active Project
            </span>
            <FolderKanban className="w-3.5 h-3.5 text-campus-blue" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-campus-blue transition-colors">
              {activeProject?.title || 'Start New Project'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              {activeProject ? `${activeProject.progressPercent || 0}% Completed` : 'No active projects yet'}
            </span>
          </div>
        </Link>

        {/* Hackathon Countdown */}
        <Link
          to="/student/events"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-600">
              Upcoming Event
            </span>
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-purple-700 transition-colors">
              SIH 2026 Finals
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">April 18 • Bangalore</span>
          </div>
        </Link>

        {/* Mentor Advisory */}
        <Link
          to="/student/mentorship"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
              Mentor Note
            </span>
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-emerald-700 transition-colors">
              Dr. Arvind Rao
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Meeting @ 4:30 PM</span>
          </div>
        </Link>

        {/* Opportunities */}
        <Link
          to="/student/opportunities"
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-600">
              Opportunity
            </span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-campus-deep-blue line-clamp-1 group-hover:text-indigo-700 transition-colors">
              IISc AI Fellowship
            </span>
            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">₹35k/mo • Closes Soon</span>
          </div>
        </Link>

      </div>

      {/* 3. TWO-COLUMN RESPONSIVE COMMAND GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* PRIMARY COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* TODAY'S PRIORITIES ACTION LIST */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-campus-red animate-pulse" />
                <h2 className="text-base font-black text-campus-deep-blue tracking-tight">
                  Today's Action Priorities
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {completedPriorities.length} / {priorityItems.length} Resolved
              </span>
            </div>

            <div className="space-y-2.5">
              {priorityItems.map(item => {
                const isCompleted = completedPriorities.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                        : 'bg-white border-slate-200/90 shadow-2xs hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={e => handleTogglePriority(item.id, e)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-campus-blue bg-white'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark done'}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md ${item.priorityColor}`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-slate-500">{item.time}</span>
                        </div>
                        <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-campus-deep-blue'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto shrink-0">
                      <button
                        onClick={item.action}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          item.actionType === 'meeting'
                            ? 'campus-btn-red'
                            : 'campus-btn-primary'
                        }`}
                      >
                        {item.actionType === 'meeting' && <Video className="w-3.5 h-3.5" />}
                        <span>{item.actionText}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE TEAM WORKSPACE HUB */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Sprint Workspace
                </span>
                <h3 className="text-base font-bold text-campus-deep-blue mt-0.5">
                  {activeTeam ? activeTeam.name : 'Team Workspace'}
                </h3>
              </div>

              <Link
                to="/student/teams"
                className="text-xs font-bold text-campus-blue hover:underline flex items-center gap-1"
              >
                <span>Full Team Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeTeam ? (
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{activeTeam.projectName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{activeTeam.domain}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                {/* Progress bar */}
                {activeProject && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Sprint Deliverables Completed</span>
                      <span className="text-campus-blue">{activeProject.progressPercent || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-campus-blue rounded-full" style={{ width: `${activeProject.progressPercent || 0}%` }} />
                    </div>
                  </div>
                )}

                {/* Roster & Quick Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Core Leads:</span>
                    <div className="flex -space-x-2">
                      {(activeTeam.members || []).map(m => (
                        <LetterAvatar
                          key={m.userId}
                          name={m.name}
                          size="xs"
                          className="w-7 h-7 rounded-full ring-2 ring-white"
                          title={`${m.name} (${m.role})`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startVideoMeeting(activeTeam.id)}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-xl flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Sync</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No Active Team Workspace</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Form a new project squad with college peers or request to join existing hackathon teams.
                  </p>
                </div>
                <Link
                  to="/student/teams"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-campus-blue text-white px-3.5 py-2 rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create or Join Team</span>
                </Link>
              </div>
            )}
          </div>

          {/* ACADEMICS TIMETABLE PREVIEW */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-campus-blue" />
                <h3 className="text-base font-bold text-campus-deep-blue">
                  Today's Academic Schedule
                </h3>
              </div>

              <Link
                to="/student/academics"
                className="text-xs font-bold text-campus-blue hover:underline"
              >
                View Full Timetable →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold text-campus-blue">09:00 - 10:00 AM • Lecture</span>
                <h5 className="text-xs font-bold text-slate-800">CS401: Deep Learning</h5>
                <p className="text-[11px] text-slate-500">Hall: LH-302 • Dr. Arvind Rao</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold text-purple-700">11:30 - 01:00 PM • Lab Session</span>
                <h5 className="text-xs font-bold text-slate-800">CS408L: Robotics Practical</h5>
                <p className="text-[11px] text-slate-500">Venue: Robotics Lab 2 • Dr. Radhika Sen</p>
              </div>
            </div>
          </div>

        </div>

        {/* SUPPORTING COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          
          {/* Academic Standing Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Verified Academic Index
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CGPA</span>
                <span className="text-2xl font-black text-campus-deep-blue block mt-0.5">8.72</span>
                <span className="text-[9.5px] text-emerald-600 font-bold">Top Quartile</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance</span>
                <span className="text-2xl font-black text-emerald-700 block mt-0.5">88%</span>
                <span className="text-[9.5px] text-slate-500 font-medium">Safe (&gt;75%)</span>
              </div>
            </div>

            <Link
              to="/student/academics"
              className="w-full text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors block"
            >
              Academic Success Center →
            </Link>
          </div>

          {/* AI Copilot Quick Assist */}
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-200">
                AI Student Copilot
              </h3>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              Instant assistance for drafting project abstracts, summarizing milestone blockers, or finding teammates.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center justify-between"
              >
                <span>Draft project abstract for SIH</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center justify-between"
              >
                <span>Find co-founders with ROS 2 skills</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
            </div>
          </div>

          {/* Mentor Advisory Note */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Latest Advisor Note
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <LetterAvatar
                name="Dr. Arvind Rao"
                size="sm"
                className="w-8 h-8 rounded-lg ring-1 ring-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-campus-deep-blue">Dr. Arvind Rao</h4>
                <p className="text-[10px] text-slate-400">IIT Bombay AI Faculty</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              "Keep the watchdog motor cut-off documentation ready for SIH final round evaluation."
            </p>

            <Link
              to="/student/mentorship"
              className="text-xs font-bold text-campus-blue hover:underline block pt-1"
            >
              Mentorship Network ({mentors.length} Verified Mentors) →
            </Link>
          </div>

          {/* Cryptographic Credential Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-campus-blue" />
                <h4 className="text-xs font-bold text-campus-deep-blue">Verifiable Credentials</h4>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400">
                {certificates.length} Active
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Every hackathon certificate carries an immutable SHA-256 digital signature.
            </p>

            <Link
              to="/student/certificates"
              className="campus-btn-primary text-xs py-2 px-3 rounded-xl text-center block w-full"
            >
              Inspect Certificates & QR →
            </Link>
          </div>

        </div>

      </div>

      {/* Edit Student Profile Modal */}
      {isEditModalOpen && (
        <StudentProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

    </div>
  );
};

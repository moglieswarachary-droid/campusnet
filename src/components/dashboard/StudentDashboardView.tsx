import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, Clock, AlertCircle, ArrowRight, Video, 
  GraduationCap, Calendar, Users, Award, ShieldCheck, 
  FolderKanban, Sparkles, ChevronRight, Activity, 
  Compass, Plus, UserPlus, QrCode, Search 
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const { 
    currentUser, projects, teams, events, mentors, 
    certificates, setActiveTab, startVideoMeeting, 
    setSelectedProjectId, setSelectedEventModal 
  } = useApp();

  const activeProject = projects[0];
  const activeTeam = teams[0];

  const quickActions = [
    { label: 'Discover Events', icon: Calendar, tab: 'events', color: 'bg-blue-50 text-campus-blue' },
    { label: 'Discover Projects', icon: FolderKanban, tab: 'projects', color: 'bg-amber-50 text-amber-600' },
    { label: 'Find Mentors', icon: ShieldCheck, tab: 'mentors', color: 'bg-green-50 text-green-700' },
    { label: 'Find Students', icon: Users, tab: 'discover', color: 'bg-purple-50 text-purple-700' },
    { label: 'Create Project', icon: Plus, tab: 'projects', color: 'bg-red-50 text-campus-red' },
    { label: 'Team Workspace', icon: Users, tab: 'workspace', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Verifiable Certs', icon: QrCode, tab: 'certificates', color: 'bg-slate-100 text-campus-slate-text' },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Personalized Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-campus-border shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-campus-border"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-campus-deep-blue">
                Good Morning, {currentUser.name} 👋
              </h1>
              {currentUser.verifiedStudent && (
                <span className="campus-badge-verified text-[10px] py-0.5 px-2">
                  Verified Student
                </span>
              )}
            </div>
            <p className="text-xs text-campus-muted-text mt-0.5">
              {currentUser.department} • {currentUser.institution}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-2xl bg-campus-warm-white border border-campus-border text-center">
            <span className="text-[10px] uppercase font-bold text-campus-muted-text block">Innovation Score</span>
            <span className="text-lg font-extrabold text-campus-deep-blue">{currentUser.innovationScore}</span>
          </div>

          <div className="p-3 px-4 rounded-2xl bg-campus-soft-blue border border-blue-200 text-center">
            <span className="text-[10px] uppercase font-bold text-campus-blue block">Verified Badges</span>
            <span className="text-lg font-extrabold text-campus-blue">{currentUser.badges.length}</span>
          </div>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="campus-btn-primary text-xs py-3 px-4 rounded-xl shadow-warm-sm"
          >
            View Portfolio
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS DOCK */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
          Quick Launch Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => setActiveTab(act.tab as any)}
                className="p-3.5 rounded-2xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md hover:border-campus-blue transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-campus-slate-text leading-tight">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODAY'S PRIORITIES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-campus-bright-red pulse-live"></span>
            <h2 className="text-base sm:text-lg font-extrabold text-campus-deep-blue uppercase tracking-wider">
              Today's Priorities & Active Deadlines
            </h2>
          </div>
          <span className="text-xs font-semibold text-campus-muted-text">
            Actionable Next Steps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Priority 1: Video Meeting */}
          <div className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-campus-red font-bold">
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  Team Review Meeting
                </span>
                <span>Today, 4:30 PM</span>
              </div>
              <h4 className="font-bold text-sm text-campus-deep-blue mt-2">
                Milestone #3 Review with Dr. Arvind Rao
              </h4>
              <p className="text-[11.5px] text-campus-muted-text mt-1">
                6-Member team video conference to review TensorRT latency metrics on CampusNet.
              </p>
            </div>

            <button
              onClick={() => startVideoMeeting(activeTeam.id)}
              className="w-full campus-btn-red text-xs py-2 rounded-xl"
            >
              Enter Meeting Room
            </button>
          </div>

          {/* Priority 2: Mentor Feedback */}
          <div className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-campus-blue font-bold">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Mentor Feedback
                </span>
                <span className="text-green-700 bg-green-50 px-1.5 py-0.2 rounded">New</span>
              </div>
              <h4 className="font-bold text-sm text-campus-deep-blue mt-2">
                FMEA Safety Directive Posted
              </h4>
              <p className="text-[11.5px] text-campus-muted-text mt-1">
                Prepare fail-safe motor cut-off documentation for SIH grand finale.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('workspace')}
              className="w-full campus-btn-primary text-xs py-2 rounded-xl"
            >
              Read Guidance Note
            </button>
          </div>

          {/* Priority 3: Milestone Due */}
          <div className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Project Milestone
                </span>
                <span>Due in 8 Days</span>
              </div>
              <h4 className="font-bold text-sm text-campus-deep-blue mt-2">
                Autonomous Spray Flight Test
              </h4>
              <p className="text-[11.5px] text-campus-muted-text mt-1">
                Field trial over 5-acre test plot with nozzle micro-dosing.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('workspace')}
              className="w-full campus-btn-secondary text-xs py-2 rounded-xl"
            >
              Update Tasks (4/5 Done)
            </button>
          </div>

          {/* Priority 4: Event Registration */}
          <div className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-green-700 font-bold">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  SIH 2026 Nodal Venue
                </span>
                <span>April 18</span>
              </div>
              <h4 className="font-bold text-sm text-campus-deep-blue mt-2">
                Bangalore Nodal Center
              </h4>
              <p className="text-[11.5px] text-campus-muted-text mt-1">
                GPS & camera attendance check-in window opens 08:00 AM.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('events')}
              className="w-full campus-btn-secondary text-xs py-2 rounded-xl"
            >
              Check Nodal Details
            </button>
          </div>

        </div>
      </div>

      {/* Main Dashboard Hubs: Active Teams & Transparency Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Team Workspace Hub (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-campus-deep-blue">My Active Team Workspace</h3>
            <button onClick={() => setActiveTab('workspace')} className="text-xs font-bold text-campus-blue hover:underline">
              Enter Workspace →
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-campus-border shadow-warm-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10.5px] font-bold uppercase text-campus-blue bg-campus-soft-blue px-2 py-0.5 rounded">
                  {activeTeam.domain}
                </span>
                <h4 className="font-bold text-lg text-campus-deep-blue mt-1.5">{activeTeam.name}</h4>
                <p className="text-xs text-campus-muted-text">{activeTeam.projectName}</p>
              </div>

              <span className="text-xs font-extrabold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                Active 6/6
              </span>
            </div>

            {/* Team Progress Meter */}
            <div className="space-y-1.5 pt-2 border-t border-campus-border">
              <div className="flex justify-between text-xs font-bold text-campus-slate-text">
                <span>Milestone Completion</span>
                <span className="text-campus-blue">{activeProject.progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-campus-warm-white rounded-full overflow-hidden border border-campus-border">
                <div className="h-full bg-campus-blue rounded-full" style={{ width: `${activeProject.progressPercent}%` }} />
              </div>
            </div>

            {/* Mini Roster */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex -space-x-2 overflow-hidden">
                {activeTeam.members.map(m => (
                  <img
                    key={m.userId}
                    src={m.avatar}
                    alt={m.name}
                    title={`${m.name} (${m.role})`}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>

              <div className="text-campus-muted-text text-[11px]">
                <strong>Mentor:</strong> {activeTeam.mentorName}
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Center: My Activity & Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-campus-red" />
            <h3 className="font-bold text-base text-campus-deep-blue">National Portal Transparency Center</h3>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-md space-y-3.5 text-xs">
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-campus-warm-white border border-campus-border">
              <div>
                <div className="font-bold text-campus-slate-text">Smart India Hackathon 2026</div>
                <div className="text-[11px] text-campus-muted-text">Event Registration Status</div>
              </div>
              <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full text-[10.5px]">
                Confirmed ✓
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-campus-warm-white border border-campus-border">
              <div>
                <div className="font-bold text-campus-slate-text">Dr. Arvind Rao (IIT Bombay)</div>
                <div className="text-[11px] text-campus-muted-text">Faculty Mentorship Assignment</div>
              </div>
              <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full text-[10.5px]">
                Accepted & Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-campus-warm-white border border-campus-border">
              <div>
                <div className="font-bold text-campus-slate-text">GPS Attendance Window</div>
                <div className="text-[11px] text-campus-muted-text">Bangalore Nodal Center</div>
              </div>
              <span className="text-campus-blue font-bold bg-blue-100 px-2 py-0.5 rounded-full text-[10.5px]">
                Scheduled April 18
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-campus-warm-white border border-campus-border">
              <div>
                <div className="font-bold text-campus-slate-text">Smart India Ideathon 2025</div>
                <div className="text-[11px] text-campus-muted-text">Verifiable QR Certificate</div>
              </div>
              <button 
                onClick={() => setActiveTab('certificates')}
                className="text-campus-red font-bold hover:underline text-[11px]"
              >
                View QR Cert →
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

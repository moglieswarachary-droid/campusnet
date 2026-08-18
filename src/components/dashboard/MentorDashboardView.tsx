import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Award, Users, CheckCircle2, Clock, 
  MessageSquare, Plus, FileText, Sparkles, Check, 
  X, AlertCircle, ArrowRight, Video, Calendar, 
  Star, ExternalLink, QrCode, Bookmark, ChevronRight 
} from 'lucide-react';
import { MentorshipRequest, Project, MentorshipCertificate } from '../../types';

export const MentorDashboardView: React.FC = () => {
  const { 
    currentUser, mentors, teams, projects, mentorshipRequests, 
    mentorshipCertificates, respondToMentorshipRequest, 
    completeMentorshipAndIssueCertificate, updateProjectMilestone, 
    addProjectTask, setSelectedProjectId, setActiveTab, 
    startVideoMeeting, addToast 
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'overview' | 'requests' | 'active_teams' | 'completed_certs'>('overview');
  
  // Mentorship Completion Modal
  const [completionModalTeamId, setCompletionModalTeamId] = useState<string | null>(null);
  const [mentorContributionText, setMentorContributionText] = useState('');
  const [projectOutcomeText, setProjectOutcomeText] = useState('');
  
  // Task Assignment State
  const [selectedProjectIdForTask, setSelectedProjectIdForTask] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Active mentor data
  const currentMentorData = mentors.find(m => m.email === currentUser.email || m.name === currentUser.name) || mentors[0];
  
  // Mentorship requests for this mentor
  const myRequests = mentorshipRequests.filter(r => r.mentorId === currentMentorData.id || r.mentorName.includes(currentUser.name.split(' ')[1] || ''));
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  
  // Active teams guided
  const myGuidedTeams = teams.filter(t => t.mentorId === currentMentorData.id || t.mentorName === currentMentorData.name || t.mentorStatus === 'accepted');

  const handleCompleteMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionModalTeamId) return;

    completeMentorshipAndIssueCertificate(
      completionModalTeamId,
      mentorContributionText || 'Guided student team through hardware optimization, ROS2 navigation architecture, and safety protocols.',
      projectOutcomeText || 'Successfully built and validated working edge prototype ready for national demonstration.'
    );

    setCompletionModalTeamId(null);
    setMentorContributionText('');
    setProjectOutcomeText('');
    setActiveTabLocal('completed_certs');
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectIdForTask || !taskTitle.trim()) return;

    addProjectTask(selectedProjectIdForTask, {
      title: taskTitle,
      assignee: taskAssignee || 'Team Member',
      status: 'todo',
      priority: taskPriority
    });

    setSelectedProjectIdForTask(null);
    setTaskTitle('');
    setTaskAssignee('');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Mentor Header Profile Card */}
      <div className="bg-gradient-to-r from-campus-deep-blue via-campus-blue to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-warm-lg">
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
                <span className="campus-badge-verified text-[10px] py-0.5 px-2">
                  ✓ Verified Faculty Guide
                </span>
                <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" /> {currentMentorData.rating} ({currentMentorData.reviewsCount} reviews)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {currentMentorData.title} • {currentUser.institution}
              </p>
              
              <p className="text-[11.5px] text-slate-300 max-w-xl line-clamp-1">
                Specialization: {currentMentorData.specialization}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[100px]">
              <div className="text-lg sm:text-xl font-extrabold text-amber-300">{myGuidedTeams.length}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Active Teams</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[100px]">
              <div className="text-lg sm:text-xl font-extrabold text-green-400">{currentMentorData.completedMentorshipsCount || 19}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Completed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center min-w-[100px]">
              <div className="text-lg sm:text-xl font-extrabold text-blue-300">{currentMentorData.mentorshipSlots || 2}</div>
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Slots Open</div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-campus-border">
        {[
          { id: 'overview', label: 'Mentor Dashboard Overview' },
          { id: 'requests', label: `Incoming Requests (${pendingRequests.length})`, alert: pendingRequests.length > 0 },
          { id: 'active_teams', label: `Guided Teams & Milestones (${myGuidedTeams.length})` },
          { id: 'completed_certs', label: `Issued Certificates (${mentorshipCertificates.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                : 'text-campus-slate-text hover:bg-campus-soft-blue bg-white border border-campus-border'
            }`}
          >
            <span>{tab.label}</span>
            {tab.alert && (
              <span className="w-2 h-2 rounded-full bg-campus-bright-red animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Quick Action Alerts */}
          {pendingRequests.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-warm-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-900">
                    {pendingRequests.length} Student Team Mentorship Requests Awaiting Your Review
                  </h4>
                  <p className="text-xs text-amber-700">
                    Teams from NITK, VJTI, and Anna University have submitted project problem statements matching your expertise.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTabLocal('requests')}
                className="campus-btn-red text-xs px-3 py-2 whitespace-nowrap"
              >
                Review Requests →
              </button>
            </div>
          )}

          {/* Active Mentorships Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-campus-deep-blue">
                Active Guided Student Teams on CampusNet
              </h2>
              <button 
                onClick={() => setActiveTabLocal('active_teams')}
                className="text-xs font-bold text-campus-blue hover:underline"
              >
                Manage All Teams →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myGuidedTeams.map(team => {
                const proj = projects.find(p => p.teamId === team.id || p.id === team.projectId) || projects[0];
                return (
                  <div 
                    key={team.id}
                    className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-full">
                          {team.domain}
                        </span>
                        <h3 className="text-base font-bold text-campus-deep-blue mt-1.5">{team.name}</h3>
                        <p className="text-xs text-campus-muted-text">{proj.title}</p>
                      </div>

                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-xl">
                        {team.members.length} / {team.maxMembers} Students
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-campus-slate-text">
                        <span>Project Progress</span>
                        <span className="text-campus-blue">{proj.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-campus-blue to-green-500 rounded-full" style={{ width: `${proj.progressPercent}%` }} />
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="pt-2 border-t border-campus-border">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-campus-muted-text mb-2">
                        Student Team Roster:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {team.members.map(m => (
                          <div key={m.userId} className="flex items-center gap-1.5 bg-campus-warm-white border border-campus-border px-2 py-1 rounded-lg text-xs">
                            <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                            <span className="font-semibold text-campus-slate-text">{m.name}</span>
                            <span className="text-[10px] text-campus-muted-text">({m.department})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-campus-border flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setActiveTab('workspace');
                        }}
                        className="campus-btn-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Open Workspace
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startVideoMeeting(team.id)}
                          className="p-2 rounded-xl bg-blue-50 text-campus-blue hover:bg-blue-100 transition-colors"
                          title="Start Video Mentoring Session"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => setCompletionModalTeamId(team.id)}
                          className="campus-btn-red text-xs py-2 px-3 rounded-xl flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          Complete & Issue Certificate
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB: INCOMING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Incoming Student Team Mentorship Requests ({myRequests.length})
            </h2>
          </div>

          <div className="space-y-4">
            {myRequests.map(req => (
              <div 
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-full">
                        {req.domain}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        req.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {req.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-campus-deep-blue mt-1">{req.teamName}</h3>
                    <p className="text-xs text-campus-muted-text">Project: {req.projectTitle}</p>
                    <p className="text-xs text-campus-slate-text">Requested By: <strong>{req.requestedBy}</strong></p>
                  </div>

                  {/* Match Score Badge */}
                  <div className="bg-campus-soft-blue p-3 rounded-2xl border border-blue-200 text-right">
                    <div className="text-xl font-black text-campus-blue">{req.matchScore}%</div>
                    <div className="text-[10px] font-bold uppercase text-campus-muted-text">AI Compatibility Score</div>
                  </div>
                </div>

                <div className="p-4 bg-campus-warm-white rounded-2xl border border-campus-border text-xs text-campus-slate-text leading-relaxed">
                  <strong>Student Team Message:</strong> "{req.message}"
                </div>

                {/* Match Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{req.matchBreakdown.domainScore}/40</div>
                    <div className="text-[10px] text-campus-muted-text">Domain Fit</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{req.matchBreakdown.techScore}/30</div>
                    <div className="text-[10px] text-campus-muted-text">Tech Match</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{req.matchBreakdown.researchScore}/20</div>
                    <div className="text-[10px] text-campus-muted-text">Research Alignment</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-campus-border">
                    <div className="font-bold text-campus-deep-blue">{req.matchBreakdown.availabilityScore}/10</div>
                    <div className="text-[10px] text-campus-muted-text">Slot Availability</div>
                  </div>
                </div>

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="pt-3 border-t border-campus-border flex items-center justify-end gap-2">
                    <button
                      onClick={() => respondToMentorshipRequest(req.id, 'declined', 'Mentoring slots currently full.')}
                      className="campus-btn-secondary text-xs py-2 px-4 rounded-xl text-campus-red hover:bg-red-50"
                    >
                      Decline Request
                    </button>
                    <button
                      onClick={() => respondToMentorshipRequest(req.id, 'accepted', 'Welcome team! Looking forward to guiding you on CampusNet.')}
                      className="campus-btn-primary text-xs py-2 px-5 rounded-xl shadow-warm-md flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Accept & Activate Workspace
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ACTIVE TEAMS & MILESTONES REVIEW */}
      {activeTab === 'active_teams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Milestone Review & Task Management ({myGuidedTeams.length} Teams)
            </h2>
          </div>

          <div className="space-y-6">
            {myGuidedTeams.map(team => {
              const proj = projects.find(p => p.teamId === team.id || p.id === team.projectId) || projects[0];
              return (
                <div key={team.id} className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md space-y-5">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-campus-border">
                    <div>
                      <h3 className="text-base font-bold text-campus-deep-blue">{team.name}</h3>
                      <p className="text-xs text-campus-muted-text">{proj.title}</p>
                    </div>

                    <button
                      onClick={() => setSelectedProjectIdForTask(proj.id)}
                      className="campus-btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Assign Task
                    </button>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
                      Project Milestones for Evaluation:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {proj.milestones.map(m => (
                        <div 
                          key={m.id}
                          className="p-4 rounded-2xl border border-campus-border bg-campus-warm-white space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-xs text-campus-deep-blue">{m.title}</h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              m.status === 'approved' ? 'bg-green-100 text-green-800' :
                              m.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {m.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-campus-muted-text line-clamp-2">{m.description}</p>
                          
                          {m.mentorFeedback && (
                            <p className="text-[11px] text-green-800 bg-green-50 p-2 rounded-lg font-medium">
                              <strong>Your Feedback:</strong> {m.mentorFeedback}
                            </p>
                          )}

                          {m.status !== 'approved' && (
                            <div className="pt-2 flex items-center justify-end gap-2">
                              <button
                                onClick={() => updateProjectMilestone(proj.id, m.id, 'approved', 'Hardware and code metrics verified successfully on CampusNet.')}
                                className="campus-btn-primary text-xs py-1 px-3 rounded-lg"
                              >
                                Approve Milestone ✓
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: COMPLETED MENTORSHIP CERTIFICATES */}
      {activeTab === 'completed_certs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Issued Digital Verifiable Mentorship Certificates ({mentorshipCertificates.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorshipCertificates.map(cert => (
              <div 
                key={cert.id}
                className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-warm-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-campus-blue bg-campus-soft-blue px-2 py-0.5 rounded">
                        ID: {cert.certificateNumber}
                      </span>
                      <h3 className="text-base font-bold text-campus-deep-blue mt-1">{cert.projectTitle}</h3>
                      <p className="text-xs text-campus-muted-text">Team: {cert.teamName}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-campus-warm-white rounded-2xl border border-campus-border text-xs space-y-1.5 text-campus-slate-text">
                  <div><strong>Guided Students:</strong> {cert.studentNames.join(', ')}</div>
                  <div><strong>Participating Colleges:</strong> {cert.studentInstitutions.join(', ')}</div>
                  <div><strong>Completed Date:</strong> {cert.completionDate} ({cert.durationWeeks} Weeks)</div>
                  <div><strong>Contribution:</strong> {cert.mentorContribution}</div>
                </div>

                <div className="pt-2 border-t border-campus-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cryptographically Verified</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('certificates');
                    }}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Verify & Download
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENTORSHIP COMPLETION MODAL */}
      {completionModalTeamId && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-warm-xl border border-campus-border space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-campus-border">
              <h3 className="text-base font-bold text-campus-deep-blue">
                Mark Mentorship Completed & Issue Certificate
              </h3>
              <button onClick={() => setCompletionModalTeamId(null)}>✕</button>
            </div>

            <p className="text-xs text-campus-muted-text">
              Finalize this project's mentorship. CampusNet will generate a tamper-proof digital Mentorship Certificate with a verifiable QR code.
            </p>

            <form onSubmit={handleCompleteMentorship} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">
                  Mentor Contribution Summary *
                </label>
                <textarea
                  rows={3}
                  value={mentorContributionText}
                  onChange={e => setMentorContributionText(e.target.value)}
                  placeholder="e.g. Guided the team through hardware integration, review milestones, and clinical validation..."
                  required
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">
                  Final Project Outcome *
                </label>
                <input
                  type="text"
                  value={projectOutcomeText}
                  onChange={e => setProjectOutcomeText(e.target.value)}
                  placeholder="e.g. Working clinical prototype with 94% accuracy ready for SIH Grand Finale."
                  required
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-campus-border">
                <button
                  type="button"
                  onClick={() => setCompletionModalTeamId(null)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs px-4 py-2"
                >
                  Issue Digital Certificate 📜
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {selectedProjectIdForTask && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-warm-xl border border-campus-border space-y-4">
            <h3 className="text-base font-bold text-campus-deep-blue">Assign Task to Student Team</h3>
            
            <form onSubmit={handleAssignTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Task Title *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Perform thermal FEA on motor mount"
                  required
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-campus-slate-text mb-1">Assignee</label>
                <input
                  type="text"
                  value={taskAssignee}
                  onChange={e => setTaskAssignee(e.target.value)}
                  placeholder="e.g. Pooja Iyer (Hardware Lead)"
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectIdForTask(null)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary text-xs"
                >
                  Assign to Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, CheckCircle2, XCircle, AlertCircle, 
  MessageSquare, Plus, FileText, Calendar, Video, Clock 
} from 'lucide-react';

export const MentorGuidanceTab: React.FC<{ teamId: string; projectId: string }> = ({ teamId, projectId }) => {
  const { 
    mentorGuidance, addMentorGuidance, projects, 
    updateProjectMilestone, currentUser, startVideoMeeting 
  } = useApp();

  const [isPostingGuidance, setIsPostingGuidance] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [guidanceType, setGuidanceType] = useState<'feedback' | 'task' | 'resource' | 'approval'>('feedback');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('m4');
  const [reviewNote, setReviewNote] = useState('');

  const project = projects.find(p => p.id === projectId) || projects[0];
  const teamGuidance = mentorGuidance.filter(g => g.teamId === teamId);

  const isMentor = currentUser.role === 'mentor';

  const handlePostGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMentorGuidance({
      teamId,
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      type: guidanceType,
      title: newTitle,
      content: newContent,
      actionRequired: guidanceType === 'task'
    });
    setNewTitle('');
    setNewContent('');
    setIsPostingGuidance(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Mentor Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-campus-deep-blue to-campus-blue text-white shadow-warm-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <GraduationCap className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">
                {project.mentor || 'Dr. Arvind Rao'}
              </h3>
              <span className="text-[10px] font-bold bg-amber-400 text-campus-deep-blue px-2 py-0.5 rounded-full">
                Verified Faculty Mentor
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">{project.mentorTitle || 'Professor & Head of Computer Vision Lab, IIT Bombay'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startVideoMeeting(teamId)}
            className="campus-btn-red text-xs py-2.5 px-4 rounded-xl shadow-glow-red"
          >
            <Video className="w-4 h-4" />
            Launch Private Mentor Meeting
          </button>

          {isMentor && (
            <button
              onClick={() => setIsPostingGuidance(true)}
              className="px-4 py-2.5 bg-white text-campus-deep-blue rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Post Feedback
            </button>
          )}
        </div>
      </div>

      {/* Mentor Milestone Review & Approval Section */}
      <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-campus-deep-blue">
              Official Project Milestones & Verification
            </h3>
            <p className="text-xs text-campus-muted-text">
              Approved milestones unlock event submission eligibility and digital certificate validation.
            </p>
          </div>
          <span className="text-xs font-bold text-campus-blue bg-campus-soft-blue px-3 py-1 rounded-full">
            {project.progressPercent}% Verified Progress
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {project.milestones.map((m, idx) => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all ${
                m.status === 'approved'
                  ? 'bg-green-50/50 border-green-200'
                  : m.status === 'in_progress'
                  ? 'bg-campus-soft-blue/40 border-blue-200'
                  : 'bg-campus-warm-white border-campus-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-campus-deep-blue">
                      Milestone #{idx + 1}: {m.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'approved'
                        ? 'bg-green-600 text-white'
                        : m.status === 'in_progress'
                        ? 'bg-campus-blue text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {m.status === 'approved' ? '✓ Approved by Mentor' : m.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-campus-slate-text/80">{m.description}</p>
                  {m.mentorFeedback && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white border border-campus-border text-xs text-campus-slate-text">
                      <strong className="text-campus-red">Mentor Feedback:</strong> {m.mentorFeedback}
                    </div>
                  )}
                </div>

                {/* Mentor Approval Actions */}
                {isMentor && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateProjectMilestone(projectId, m.id, 'approved', 'Verified architecture and telemetry logs.')}
                      className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateProjectMilestone(projectId, m.id, 'rejected', 'Requires additional validation on sensor noise.')}
                      className="px-3 py-1.5 rounded-xl bg-campus-red hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Request Revision
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Guidance Posts & Tasks Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-campus-deep-blue">
            Mentor Guidance & Resources Log ({teamGuidance.length})
          </h3>
          <button
            onClick={() => setIsPostingGuidance(true)}
            className="text-xs font-bold text-campus-blue hover:underline"
          >
            + Post Guidance Note
          </button>
        </div>

        {/* New Guidance Modal/Form */}
        {isPostingGuidance && (
          <form onSubmit={handlePostGuidance} className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-lg space-y-4">
            <h4 className="font-bold text-sm text-campus-deep-blue">Post Feedback or Technical Directive</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Optical flow camera noise reduction directive"
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Guidance Type</label>
                <select
                  value={guidanceType}
                  onChange={e => setGuidanceType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl bg-white outline-none"
                >
                  <option value="feedback">Milestone Feedback</option>
                  <option value="task">Actionable Task Directive</option>
                  <option value="resource">Technical Resource / Paper</option>
                  <option value="approval">Formal Verification Approval</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Feedback Content</label>
              <textarea
                rows={3}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Provide detailed instructions for the student team..."
                className="w-full px-3.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsPostingGuidance(false)} className="campus-btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="campus-btn-red text-xs">
                Publish Guidance Note
              </button>
            </div>
          </form>
        )}

        {/* Guidance Items */}
        <div className="space-y-4">
          {teamGuidance.map(item => (
            <div key={item.id} className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-campus-red flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-campus-deep-blue">{item.title}</h4>
                    <p className="text-[11px] text-campus-muted-text">{item.mentorName} • {item.timestamp}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.type === 'approval' ? 'bg-green-100 text-green-800' : item.type === 'task' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.type.toUpperCase()}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed">
                {item.content}
              </p>

              {item.links && item.links.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {item.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-campus-blue bg-campus-soft-blue px-3 py-1 rounded-xl font-bold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Attached Resource
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

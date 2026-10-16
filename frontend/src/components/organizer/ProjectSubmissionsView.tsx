import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, ExternalLink, Code2, Video, Award, 
  CheckCircle2, Clock, Search, Filter, Sparkles 
} from 'lucide-react';
import { EventProjectSubmission } from '../../types';

export const ProjectSubmissionsView: React.FC = () => {
  const { projectSubmissions, events, currentOrganizer } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<EventProjectSubmission | null>(projectSubmissions[0] || null);

  const filteredSubmissions = projectSubmissions.filter(
    s => selectedEventId === 'all' || s.eventId === selectedEventId
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Hackathon Project Submissions ({filteredSubmissions.length})
          </h2>
          <p className="text-xs text-slate-400">
            Review technical whitepapers, GitHub source repositories, working prototypes, and demonstration videos submitted by student teams.
          </p>
        </div>

        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 shadow-lg self-start sm:self-auto"
        >
          <option value="all">All Hosted Events</option>
          {orgEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Main Grid: Submissions List & Detailed Review Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Submissions List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredSubmissions.map(sub => {
            const isSelected = selectedSubmission?.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-amber-500 shadow-xl'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                    {sub.teamName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sub.status === 'winner' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    sub.status === 'evaluated' ? 'bg-green-950 text-green-300 border border-green-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white line-clamp-1">{sub.projectTitle}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{sub.description}</p>

                {sub.finalScore !== undefined && (
                  <div className="mt-2 text-xs font-bold text-green-400 flex items-center justify-between border-t border-slate-900 pt-1.5">
                    <span>Jury Score:</span>
                    <span>{sub.finalScore.toFixed(1)} / 100</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Submission Inspector */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
          {selectedSubmission ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400">{selectedSubmission.teamName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Submitted {new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedSubmission.projectTitle}</h3>
                </div>

                {selectedSubmission.finalScore && (
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <div className="text-[10px] font-bold text-amber-300 uppercase">Jury Score</div>
                    <div className="text-xl font-black text-white">{selectedSubmission.finalScore}/100</div>
                  </div>
                )}
              </div>

              {/* Problem & Solution */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="font-bold uppercase text-slate-400 text-[10px]">Problem Statement</div>
                  <p className="text-slate-300 leading-relaxed">{selectedSubmission.problemStatement}</p>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="font-bold uppercase text-slate-400 text-[10px]">Proposed Solution & Architecture</div>
                  <p className="text-slate-300 leading-relaxed">{selectedSubmission.solution || selectedSubmission.description}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tech Stack & Tools</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubmission.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-amber-300 text-xs font-mono rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Artifact Deliverable Links */}
              <div className="pt-2 space-y-2 border-t border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Deliverable Verification Links</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSubmission.githubUrl && (
                    <a
                      href={selectedSubmission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-bold flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <span>Source Repository</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}

                  {selectedSubmission.demoUrl && (
                    <a
                      href={selectedSubmission.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-bold flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Live Prototype Demo</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a project submission from the left queue to inspect code repositories and demo deliverables.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

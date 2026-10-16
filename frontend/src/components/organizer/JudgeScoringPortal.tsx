import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gavel, CheckCircle2, Award, FileText, 
  ExternalLink, Code2, Sparkles, Scale, Send 
} from 'lucide-react';
import { EvaluationCriterion, EventProjectSubmission } from '../../types';

export const JudgeScoringPortal: React.FC = () => {
  const { 
    judges, projectSubmissions, evaluationCriteria, 
    submitJudgeScore, evaluationScores, events 
  } = useApp();

  const [selectedJudgeId, setSelectedJudgeId] = useState<string>(judges[0]?.id || 'jdg-001');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(projectSubmissions[0]?.id || 'sub-001');

  const activeJudge = judges.find(j => j.id === selectedJudgeId) || judges[0];
  const activeEvent = events.find(e => e.id === activeJudge?.assignedEventId) || events[0];
  const criteria = evaluationCriteria.filter(c => c.eventId === activeJudge?.assignedEventId);

  // Scores state: Map criterionId -> number
  const [scores, setScores] = useState<{ [key: string]: number }>({
    'crit-001': 28,
    'crit-002': 29,
    'crit-003': 19,
    'crit-004': 19
  });
  const [comments, setComments] = useState('Excellent edge inference optimization and stable hardware demonstration.');
  const [recommendation, setRecommendation] = useState<'strong_accept' | 'accept' | 'borderline' | 'reject'>('strong_accept');

  const activeSubmission = projectSubmissions.find(s => s.id === selectedSubmissionId) || projectSubmissions[0];

  // Calculate weighted total
  const totalWeightedScore = criteria.reduce((acc, crit) => {
    const rawScore = scores[crit.id] || (crit.maxScore * 0.8);
    const criterionWeight = crit.weightagePercent;
    const normalized = (rawScore / crit.maxScore) * criterionWeight;
    return acc + normalized;
  }, 0);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJudge || !activeSubmission) return;

    submitJudgeScore({
      eventId: activeEvent.id,
      submissionId: activeSubmission.id,
      judgeId: activeJudge.id,
      judgeName: activeJudge.name,
      criteriaScores: criteria.map(crit => ({
        criterionId: crit.id,
        criterionName: crit.name,
        score: scores[crit.id] || 25,
        maxScore: crit.maxScore
      })),
      totalWeightedScore: Math.round(totalWeightedScore * 10) / 10,
      comments,
      recommendation
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Judge Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              Jury Evaluation Terminal
            </span>
            <span className="text-xs text-slate-400">Authenticated Judge Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {activeEvent.title}
          </h2>
        </div>

        {/* Switch Judge Selector (Dev/Demo Mode) */}
        <div className="text-right">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Active Judge Account</label>
          <select
            value={selectedJudgeId}
            onChange={e => setSelectedJudgeId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-300 font-bold outline-none"
          >
            {judges.map(j => (
              <option key={j.id} value={j.id}>{j.name} ({j.institution})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Assigned Project Selector & Deliverables */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Submissions for Evaluation
            </h3>

            <div className="space-y-2">
              {projectSubmissions.map(sub => {
                const isSelected = sub.id === activeSubmission.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-amber-400">{sub.teamName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {sub.id}</span>
                    </div>
                    <div className="text-xs text-white font-bold line-clamp-1">{sub.projectTitle}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Deliverables Box */}
          {activeSubmission && (
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl text-xs">
              <h4 className="font-bold text-white uppercase text-[11px]">Deliverable Links</h4>
              
              <div className="space-y-2">
                {activeSubmission.githubUrl && (
                  <a
                    href={activeSubmission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" />
                      <span>Verify GitHub Repository</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {activeSubmission.demoUrl && (
                  <a
                    href={activeSubmission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Live Prototype Video / URL</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Rubric Scoring Form */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Scoring Rubric</span>
              <h3 className="text-base font-bold text-white">{activeSubmission?.projectTitle}</h3>
            </div>

            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-2xl text-center">
              <div className="text-[9px] uppercase font-bold text-amber-300">Weighted Total</div>
              <div className="text-2xl font-black text-white">{totalWeightedScore.toFixed(1)} <span className="text-xs text-slate-400">/ 100</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmitScore} className="space-y-5">
            {/* Dynamic criteria sliders */}
            <div className="space-y-4">
              {criteria.map(crit => {
                const val = scores[crit.id] !== undefined ? scores[crit.id] : Math.round(crit.maxScore * 0.85);
                return (
                  <div key={crit.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{crit.name}</div>
                        <div className="text-[10.5px] text-slate-400">{crit.description}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-amber-400">{val}</span>
                        <span className="text-xs text-slate-500"> / {crit.maxScore}</span>
                        <div className="text-[9px] text-slate-400">Weight: {crit.weightagePercent}%</div>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={crit.maxScore}
                      step={1}
                      value={val}
                      onChange={e => setScores({ ...scores, [crit.id]: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Comments & recommendation */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                  Jury Evaluation Comments & Technical Critique *
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Note edge throughput, telemetry stability, presentation clarity..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                  Jury Recommendation *
                </label>
                <select
                  value={recommendation}
                  onChange={e => setRecommendation(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                >
                  <option value="strong_accept">🌟 Strong Accept (Award Contender)</option>
                  <option value="accept">✓ Accept (Solid Prototype)</option>
                  <option value="borderline">⚖ Borderline</option>
                  <option value="reject">✕ Reject (Incomplete / Plagiarized)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Official Evaluation Score</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

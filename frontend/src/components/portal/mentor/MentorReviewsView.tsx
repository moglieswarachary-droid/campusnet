import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Award, CheckCircle2, Clock, FileText, ArrowRight, Check,
  X, AlertTriangle, MessageSquare, ExternalLink, Star, ShieldCheck,
  Send, HelpCircle, Download, GitBranch
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MilestoneSubmission {
  id: string;
  projectTitle: string;
  teamName: string;
  milestoneTitle: string;
  stage: string;
  submittedBy: string;
  submittedAt: string;
  dueDate: string;
  githubUrl: string;
  deliverablesSummary: string;
  status: 'pending' | 'approved' | 'revision_requested';
  grade?: string;
  feedback?: string;
}

export const MentorReviewsView: React.FC = () => {
  const { addToast, mentorshipCertificates } = useApp();

  const [submissions, setSubmissions] = useState<MilestoneSubmission[]>([
    {
      id: 'sub-01',
      projectTitle: 'AgriVision: Autonomous Micro-Drones',
      teamName: 'Team AgriVision',
      milestoneTitle: 'Milestone 2: Sub-Millisecond TensorRT Model Optimization',
      stage: 'Phase 2 Architecture',
      submittedBy: 'Aarav Sharma (Team Lead)',
      submittedAt: 'April 14, 2026',
      dueDate: 'April 18, 2026',
      githubUrl: 'https://github.com/campusnet/agrivision-core',
      deliverablesSummary: 'Implemented INT8 quantization for YOLOv8 model on NVIDIA Jetson Orin Nano with CUDA streams. Achieved 14.2ms inference latency with 91.4% mAP.',
      status: 'pending'
    },
    {
      id: 'sub-02',
      projectTitle: 'Distributed Byzantine Ledger',
      teamName: 'Team Consensus',
      milestoneTitle: 'Milestone 3: Raft WAN Jitter Benchmarks',
      stage: 'Phase 3 Verification',
      submittedBy: 'Karthik Raja',
      submittedAt: 'April 11, 2026',
      dueDate: 'April 16, 2026',
      githubUrl: 'https://github.com/campusnet/raft-consensus-sim',
      deliverablesSummary: 'Benchmarked leader election recovery times under 120ms artificial packet delay across 5 geo-distributed nodes.',
      status: 'approved',
      grade: 'Grade A+ (Distinction)',
      feedback: 'Excellent rigor in fault injection harness. Ready for IEEE submission.'
    },
    {
      id: 'sub-03',
      projectTitle: 'MedEdge: ECG Signal Processing',
      teamName: 'Team MedEdge',
      milestoneTitle: 'Milestone 1: DSP FIR Filter Firmware',
      stage: 'Phase 1 Hardware',
      submittedBy: 'Sneha Patel',
      submittedAt: 'April 08, 2026',
      dueDate: 'April 12, 2026',
      githubUrl: 'https://github.com/campusnet/mededge-firmware',
      deliverablesSummary: 'Embedded C++ implementation of 50Hz notch filter on STM32 microcontroller.',
      status: 'revision_requested',
      grade: 'Revisions Pending',
      feedback: 'Please address floating point cycle count overhead by utilizing CMSIS-DSP fixed point Q15 format.'
    }
  ]);

  // Review Modal State
  const [activeReviewSub, setActiveReviewSub] = useState<MilestoneSubmission | null>(null);
  const [reviewGrade, setReviewGrade] = useState('Grade A+ (Distinction)');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'revise'>('approve');

  // Evaluation criteria scores
  const [scores, setScores] = useState({
    technicalRigor: 9,
    innovation: 9,
    feasibility: 8,
    documentation: 9
  });

  const handleOpenReview = (sub: MilestoneSubmission, action: 'approve' | 'revise') => {
    setActiveReviewSub(sub);
    setReviewAction(action);
    setReviewFeedback(
      action === 'approve'
        ? 'Well engineered pipeline with verifiable latency metrics and clean documentation. Approved for the next sprint.'
        : 'Deliverables require revision on edge memory constraints and fail-safe watchdog timer routines.'
    );
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewSub) return;

    setSubmissions(prev => prev.map(s => {
      if (s.id === activeReviewSub.id) {
        return {
          ...s,
          status: reviewAction === 'approve' ? 'approved' : 'revision_requested',
          grade: reviewAction === 'approve' ? reviewGrade : 'Revisions Pending',
          feedback: reviewFeedback
        };
      }
      return s;
    }));

    addToast({
      type: reviewAction === 'approve' ? 'success' : 'info',
      message: `Evaluation submitted for ${activeReviewSub.milestoneTitle}!`
    });

    setActiveReviewSub(null);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#F3A640] flex items-center justify-center shrink-0 border border-amber-200/70 shadow-2xs">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Milestone Reviews & Evaluations
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-[#0F9488] border border-teal-200">
                Rubric Assessment
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluate student project deliverables, test code repositories, submit feedback, and sign off on sprint milestones
            </p>
          </div>
        </div>

        <Link
          to="/mentor/certificates"
          className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
        >
          <span>Mentorship Certificates ({mentorshipCertificates.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map(sub => {
          const isPending = sub.status === 'pending';

          return (
            <div
              key={sub.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-4 transition-all ${
                isPending ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {sub.stage}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      sub.status === 'revision_requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {sub.status === 'revision_requested' ? 'Revisions Requested' : sub.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Submitted by <strong>{sub.submittedBy}</strong></span>
                  </div>

                  <h3 className="text-base font-bold text-[#12243A] mt-1">
                    {sub.milestoneTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Project: <strong className="text-slate-800">{sub.projectTitle}</strong> ({sub.teamName})
                  </p>

                  <div className="bg-[#F3F6FA] p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed mt-2">
                    <span className="font-semibold text-slate-500 block mb-0.5">Submitted Deliverables Summary:</span>
                    {sub.deliverablesSummary}
                  </div>

                  {sub.feedback && (
                    <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-xs text-teal-900 mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-teal-800">Faculty Review Feedback:</span>
                        {sub.grade && (
                          <span className="font-black text-[#0F9488] bg-white px-2 py-0.5 rounded border border-teal-200">
                            {sub.grade}
                          </span>
                        )}
                      </div>
                      <p>{sub.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Right Action Bar */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 self-stretch lg:self-auto">
                  <div className="text-right text-xs text-slate-400">
                    <span>Submitted: {sub.submittedAt}</span>
                    <span className="block text-[11px] font-semibold text-slate-500">Due: {sub.dueDate}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                      <span>Inspect Code</span>
                    </a>

                    {isPending && (
                      <>
                        <button
                          onClick={() => handleOpenReview(sub, 'revise')}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-amber-50 text-amber-700 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>

                        <button
                          onClick={() => handleOpenReview(sub, 'approve')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Evaluate & Approve</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structured Rubric Evaluation Modal */}
      {activeReviewSub && (
        <div className="fixed inset-0 z-50 bg-[#12243A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12243A]">
                  {reviewAction === 'approve' ? 'Evaluate & Approve Milestone' : 'Request Milestone Revision'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeReviewSub.milestoneTitle} ({activeReviewSub.teamName})
                </p>
              </div>
              <button
                onClick={() => setActiveReviewSub(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-4">
              {reviewAction === 'approve' && (
                <>
                  <div className="grid grid-cols-2 gap-3 bg-[#F3F6FA] p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Technical Rigor (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={scores.technicalRigor}
                        onChange={e => setScores({ ...scores, technicalRigor: Number(e.target.value) })}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Architecture & Design (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={scores.innovation}
                        onChange={e => setScores({ ...scores, innovation: Number(e.target.value) })}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Awarded Standing / Grade
                    </label>
                    <select
                      value={reviewGrade}
                      onChange={e => setReviewGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#12243A]"
                    >
                      <option value="Grade A+ (Distinction)">Grade A+ (Distinction — Exemplary Work)</option>
                      <option value="Grade A (Excellent)">Grade A (Excellent — Ready for Production)</option>
                      <option value="Grade B+ (Good Standing)">Grade B+ (Good Standing — Meets Criteria)</option>
                      <option value="Grade B (Satisfactory)">Grade B (Satisfactory — Acceptable)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Structured Review Comments & Actionable Feedback
                </label>
                <textarea
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 ${
                    reviewAction === 'approve' ? 'bg-[#0F9488] hover:bg-[#0D7E73]' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{reviewAction === 'approve' ? 'Finalize Approval' : 'Submit Revision Directive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

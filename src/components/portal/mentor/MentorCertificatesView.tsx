import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Award, QrCode, ShieldCheck, Download, ExternalLink,
  Printer, CheckCircle2, Search, Filter, Plus, User,
  FileCheck, Clock
} from 'lucide-react';
import { MentorshipCertificate } from '../../../types';
import { Link } from 'react-router-dom';

export const MentorCertificatesView: React.FC = () => {
  const {
    mentorshipCertificates, teams, projects, mentors,
    currentUser, completeMentorshipAndIssueCertificate, addToast
  } = useApp();

  const currentMentor = mentors.find(m => m.email === currentUser?.email) || mentors[0];
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  // Issue Certificate Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [mentorContribution, setMentorContribution] = useState(
    'Guided the team through embedded computer vision pipeline optimization, INT8 TensorRT quantization, and fail-safe motor telemetry.'
  );
  const [projectOutcome, setProjectOutcome] = useState(
    'Field-proven prototype ready for Smart India Hackathon grand finale, demonstrating sub-15ms edge inference.'
  );

  const selectedCert = mentorshipCertificates.find(c => c.id === selectedCertId) || mentorshipCertificates[0];

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    // Duplicate check
    const existingCert = mentorshipCertificates.find(c => c.teamId === selectedTeamId);
    if (existingCert) {
      addToast({
        type: 'warning',
        message: `A certificate has already been issued for this team (Ref: ${existingCert.certificateNumber}). Duplicate issuance is restricted.`
      });
      return;
    }

    const newCert = completeMentorshipAndIssueCertificate(
      selectedTeamId,
      mentorContribution,
      projectOutcome
    );

    if (newCert) {
      setSelectedCertId(newCert.id);
      setIsIssueModalOpen(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Verifiable Mentorship Credentials
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Digitally Endorsed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issue tamper-proof academic mentorship completion certificates carrying cryptographic validation and institutional registry verification
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue Mentorship Credential</span>
        </button>
      </div>

      {/* Main Grid: Certificate Ledger & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Certificate Ledger List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Issued Credential Records ({mentorshipCertificates.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Immutable Registry</span>
          </div>

          <div className="space-y-2.5">
            {mentorshipCertificates.map(cert => {
              const isSelected = selectedCert?.id === cert.id;

              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCertId(cert.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-teal-50/80 border-[#0F9488] shadow-xs ring-1 ring-[#0F9488]'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#12243A] leading-tight line-clamp-1">
                    {cert.projectTitle}
                  </h4>

                  <div className="text-[11px] text-slate-500">
                    Team: <strong>{cert.teamName}</strong> • {cert.studentNames?.length || 1} Mentees
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                    <span>Duration: {cert.durationWeeks || 24} Weeks</span>
                    <span className="font-semibold text-[#0F9488]">Inspect Credential →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Detailed Preview (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCert ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-warm-lg space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#12243A] via-[#0F9488] to-[#F3A640]" />

              <div className="flex items-start justify-between gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-[#0F9488]">
                    CAMPUSNET+ VERIFIED MENTORSHIP ENDORSEMENT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#12243A] mt-0.5">
                    Certificate of Mentorship & Research Guidance
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1 text-xs font-bold no-print"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print / PDF</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  This certifies that faculty mentor <strong>{selectedCert.mentorName}</strong> ({selectedCert.mentorDesignation}, {selectedCert.mentorInstitution}) has successfully supervised and verified the research and project development for team <strong>{selectedCert.teamName}</strong> on the capstone innovation:
                </p>

                <div className="p-4 rounded-2xl bg-[#F3F6FA] border border-slate-200 text-center space-y-1">
                  <h4 className="text-sm font-bold text-[#12243A]">{selectedCert.projectTitle}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Domain: {selectedCert.projectDomain}</p>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-600 block">Student Mentees:</span>
                    <p className="text-slate-800 font-medium">{selectedCert.studentNames?.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">Mentor Advisory Statement:</span>
                    <p className="italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">"{selectedCert.mentorContribution}"</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">Project Outcome:</span>
                    <p className="font-medium text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      {selectedCert.projectOutcome}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
                  <div>
                    <span className="font-mono font-bold text-slate-700 block">ID: {selectedCert.certificateNumber}</span>
                    <span>Issued: {selectedCert.issuedAt?.split('T')[0] || '2026-04-16'}</span>
                  </div>

                  <Link
                    to={`/verify-certificate/${selectedCert.certificateNumber}`}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Public Verification Link</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No certificate selected.
            </div>
          )}
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#12243A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#12243A]">Issue Mentorship Completion Credential</h3>
                <p className="text-xs text-slate-500">Official endorsement by {currentMentor.name}</p>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Student Team</label>
                <select
                  value={selectedTeamId}
                  onChange={e => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.projectName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Faculty Advisory Contribution Statement
                </label>
                <textarea
                  value={mentorContribution}
                  onChange={e => setMentorContribution(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Validated Project Outcome
                </label>
                <textarea
                  value={projectOutcome}
                  onChange={e => setProjectOutcome(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs"
                >
                  Generate & Sign Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

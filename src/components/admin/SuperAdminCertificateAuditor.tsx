import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, ShieldCheck, Award, Search, 
  Trash2, ExternalLink, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export const SuperAdminCertificateAuditor: React.FC = () => {
  const { certificates, mentorshipCertificates, revokeCertificate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [revokeTargetNumber, setRevokeTargetNumber] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const allCerts = [
    ...certificates.map(c => ({
      id: c.id,
      number: c.certificateNumber,
      recipient: c.recipientName,
      role: c.recipientRole,
      title: c.eventTitle,
      organizer: c.eventOrganizer,
      institution: c.institution || 'College',
      date: c.issueDate,
      status: c.status,
      type: 'Event / Hackathon',
      qr: c.qrCodeData
    })),
    ...mentorshipCertificates.map(m => ({
      id: m.id,
      number: m.certificateNumber,
      recipient: m.studentNames.join(', '),
      role: 'Mentorship Guided',
      title: m.projectTitle,
      organizer: `${m.mentorName} (${m.mentorInstitution})`,
      institution: m.studentInstitutions.join(', '),
      date: m.completionDate,
      status: m.status,
      type: 'Faculty Mentorship',
      qr: m.qrCodeData
    }))
  ];

  const filteredCerts = allCerts.filter(c =>
    c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRevokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeTargetNumber || !revokeReason.trim()) return;

    revokeCertificate(revokeTargetNumber, revokeReason.trim());
    setShowRevokeModal(false);
    setRevokeTargetNumber('');
    setRevokeReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              National Credential Registry
            </span>
            <span className="text-xs text-slate-400">Verifiable Academic Audit System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            National Certificate Registry & Fraud Audit ({allCerts.length})
          </h2>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Certificate ID, Student, Event..."
          className="w-full sm:w-80 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
        />
      </div>

      {/* Revocation Modal */}
      {showRevokeModal && (
        <div className="bg-red-950/40 p-6 rounded-3xl border border-red-500/40 space-y-4 text-xs animate-in fade-in max-w-xl">
          <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Revoke Verifiable Credential from National Registry</span>
          </div>

          <form onSubmit={handleRevokeSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Certificate Number to Invalidate *
              </label>
              <input
                type="text"
                value={revokeTargetNumber}
                onChange={e => setRevokeTargetNumber(e.target.value)}
                placeholder="e.g. CN-KEC-AI26-WIN-000001"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Mandatory National Audit Reason *
              </label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                placeholder="Reason for revocation..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRevokeModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Confirm National Revocation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registry Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Certificate ID</th>
                <th className="px-4 py-3">Recipient(s)</th>
                <th className="px-4 py-3">Credential Type</th>
                <th className="px-4 py-3">Event / Project</th>
                <th className="px-4 py-3">Issued By</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredCerts.map(cert => (
                <tr key={cert.id} className="hover:bg-slate-900/50">
                  
                  <td className="px-4 py-3 font-bold text-amber-300">{cert.number}</td>

                  <td className="px-4 py-3 font-sans font-bold text-white max-w-xs truncate">
                    {cert.recipient}
                  </td>

                  <td className="px-4 py-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                      {cert.type} ({cert.role})
                    </span>
                  </td>

                  <td className="px-4 py-3 font-sans text-slate-300 max-w-xs truncate">
                    {cert.title}
                  </td>

                  <td className="px-4 py-3 font-sans text-slate-400 max-w-xs truncate">
                    {cert.organizer}
                  </td>

                  <td className="px-4 py-3 font-sans">
                    {cert.status === 'revoked' ? (
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold text-[10px]">
                        REVOKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-green-950 text-green-300 border border-green-800 font-bold text-[10px]">
                        VALID
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-sans">
                    {cert.status !== 'revoked' ? (
                      <button
                        onClick={() => {
                          setRevokeTargetNumber(cert.number);
                          setShowRevokeModal(true);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 font-bold text-xs"
                      >
                        Revoke Credential
                      </button>
                    ) : (
                      <span className="text-red-400 text-xs font-bold">Invalidated</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Award, QrCode, Plus, Download, 
  Trash2, AlertTriangle, CheckCircle2, Search, ExternalLink, RefreshCw 
} from 'lucide-react';
import { Certificate, CertificateTemplate } from '../../types';

export const CertificateManagementCenter: React.FC = () => {
  const { 
    currentOrganizer, events, eventRegistrations, 
    certificates, certificateTemplates, createCertificateTemplate, 
    generateEventCertificateSingle, generateEventCertificatesBulk, 
    revokeCertificate 
  } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'registry' | 'revoke'>('generate');

  // Single cert modal state
  const [selectedRegId, setSelectedRegId] = useState<string>(eventRegistrations[0]?.id || '');
  const [selectedRole, setSelectedRole] = useState<Certificate['recipientRole']>('Participant');
  const [achievementInput, setAchievementInput] = useState('');

  // Revoke state
  const [revokeCertNumber, setRevokeCertNumber] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  // Template state
  const [tplTitle, setTplTitle] = useState('KEC Hackathon Participation Certificate');
  const [tplCategory, setTplCategory] = useState<'Participation' | 'Winner' | 'Runner-Up' | 'Mentor' | 'Judge'>('Participation');
  const [tplAccent, setTplAccent] = useState('#123B7A');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const eligibleRegs = eventRegistrations.filter(r => r.eventId === selectedEventId);
  const checkedInRegs = eligibleRegs.filter(r => r.attendanceStatus === 'checked_in');

  const orgCertificates = certificates.filter(
    c => c.organizerInstitutionId === currentOrganizer?.id || c.eventOrganizer === currentOrganizer?.institutionName
  );

  const handleSingleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegId) return;
    generateEventCertificateSingle(selectedRegId, selectedRole, achievementInput);
  };

  const handleBulkGenerate = () => {
    generateEventCertificatesBulk(selectedEventId, 'Participant');
  };

  const handleRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeCertNumber || !revokeReason) return;
    const success = revokeCertificate(revokeCertNumber.trim(), revokeReason.trim());
    if (success) {
      setRevokeCertNumber('');
      setRevokeReason('');
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    createCertificateTemplate({
      institutionId: currentOrganizer?.institutionId || 'inst-kec-001',
      eventId: selectedEventId,
      title: tplTitle,
      category: tplCategory,
      accentColor: tplAccent,
      bannerTitle: currentOrganizer?.institutionName.toUpperCase() || 'KUPPAM ENGINEERING COLLEGE',
      subTitle: `Certificate of ${tplCategory}`,
      bodyTemplate: 'This is to certify that {recipientName} from {institution} has actively participated in {eventTitle}.',
      authorizedSignatories: [
        { name: 'Dr. S. K. Reddy', title: 'Principal', organization: currentOrganizer?.institutionName || 'College' },
        { name: currentOrganizer?.coordinatorName || 'Coordinator', title: 'Convener', organization: 'Innovation Council' }
      ],
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              Institutional Credential Center
            </span>
            <span className="text-xs text-green-400 font-semibold">QR Tamper-Proof Cryptography</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Verifiable Certificate Generation & Management Center
          </h2>
        </div>

        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-500 shadow-xl self-start sm:self-auto"
        >
          {orgEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'generate', label: '1. Issue Certificates' },
          { id: 'registry', label: `2. Issued Registry (${orgCertificates.length})` },
          { id: 'templates', label: '3. Certificate Templates' },
          { id: 'revoke', label: '4. Revocation Center' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERATE (SINGLE & BULK) */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          
          {/* Bulk Generation Card */}
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Bulk Generate for All Checked-In Attendees
                </h3>
                <span className="text-[10px] font-bold bg-green-950 text-green-300 px-2 py-0.5 rounded border border-green-800">
                  {checkedInRegs.length} Eligible Attendees
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Automatically mint individual verifiable certificates for all students with verified QR / GPS attendance check-in records for <strong>{currentEvent.title}</strong>.
              </p>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Registrations:</span>
                  <span className="font-bold text-white">{eligibleRegs.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Attendance Verified:</span>
                  <span className="font-bold text-green-400">{checkedInRegs.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>ID Format:</span>
                  <span className="font-mono text-amber-300">CN-KEC-AI26-PART-000XXX</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBulkGenerate}
              disabled={checkedInRegs.length === 0}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Bulk Mint {checkedInRegs.length} Certificates</span>
            </button>
          </div>

          {/* Single Custom Certificate Issuance Card */}
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Single Certificate Issuance
            </h3>

            <form onSubmit={handleSingleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
                  Select Participant *
                </label>
                <select
                  value={selectedRegId}
                  onChange={e => setSelectedRegId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                >
                  {eligibleRegs.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.participantName} ({r.institution}) - {r.attendanceStatus === 'checked_in' ? '✓ Checked In' : 'Registered'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">Role / Tier</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="Participant">Participant</option>
                    <option value="Winner">Winner</option>
                    <option value="Runner-Up">Runner-Up</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Judge">Judge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">Achievement Text</label>
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={e => setAchievementInput(e.target.value)}
                    placeholder="e.g. 1st Place Grand Champion"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg mt-2"
              >
                Generate Single Certificate
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 2: ISSUED CERTIFICATES REGISTRY */}
      {activeTab === 'registry' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Issued Credentials Database ({orgCertificates.length})</h3>
            <span className="text-xs text-slate-400">Publicly Verifiable on campusnet.in</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Certificate ID</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {orgCertificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-amber-300 font-bold">{cert.certificateNumber}</td>
                    <td className="px-4 py-3 font-sans font-bold text-white">{cert.recipientName}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                        {cert.recipientRole}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-300 line-clamp-1">{cert.eventTitle}</td>
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
                      <a
                        href={cert.qrCodeData}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-bold text-xs inline-flex items-center gap-1"
                      >
                        <span>Verify QR</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATES BUILDER */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Create / Customize Institutional Template
            </h3>

            <form onSubmit={handleCreateTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Template Title</label>
                <input
                  type="text"
                  value={tplTitle}
                  onChange={e => setTplTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
                  <select
                    value={tplCategory}
                    onChange={e => setTplCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Participation">Participation</option>
                    <option value="Winner">Winner</option>
                    <option value="Runner-Up">Runner-Up</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Judge">Judge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Accent Border Color</label>
                  <input
                    type="color"
                    value={tplAccent}
                    onChange={e => setTplAccent(e.target.value)}
                    className="w-full h-9 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                Save Certificate Template
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Active Templates</h3>
            {certificateTemplates.map(tpl => (
              <div key={tpl.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-white">{tpl.title}</div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{tpl.category}</span>
                </div>
                <div className="text-[11px] text-slate-400">{tpl.subTitle}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVOCATION CENTER */}
      {activeTab === 'revoke' && (
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 max-w-xl mx-auto shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Certificate Revocation & Audit Registry</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Revoking a certificate updates its status to <strong>REVOKED</strong> across the national verification endpoint immediately. A full audit log is retained.
          </p>

          <form onSubmit={handleRevoke} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Certificate Number to Revoke *
              </label>
              <input
                type="text"
                value={revokeCertNumber}
                onChange={e => setRevokeCertNumber(e.target.value)}
                placeholder="e.g. CN-KEC-AI26-PART-000101"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Mandatory Reason for Revocation *
              </label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                placeholder="e.g. Disqualified for code plagiarism post-event audit..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Permanently Mark Certificate as Revoked</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

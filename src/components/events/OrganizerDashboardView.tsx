import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, ShieldCheck, Users, CheckCircle2, 
  MapPin, Camera, Star, FileText, Send, Sparkles, QrCode 
} from 'lucide-react';

export const OrganizerDashboardView: React.FC = () => {
  const { attendanceRecords, generateCertificateForEvent, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'judging' | 'certificates'>('attendance');
  const [recipientName, setRecipientName] = useState('Aarav Sharma');
  const [certRole, setCertRole] = useState<'Winner' | 'Participant' | 'Mentor'>('Winner');
  const [rankTitle, setRankTitle] = useState('1st Place — National Champion (AgriTech Track)');

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) return;
    generateCertificateForEvent(
      recipientName,
      certRole,
      'Smart India Hackathon 2026',
      'Ministry of Education & AICTE',
      rankTitle
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-campus-border shadow-warm-lg space-y-6">
      
      {/* Organizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="campus-badge-govt">
              <Award className="w-3.5 h-3.5" />
              Nodal Center Administration Portal
            </span>
            <span className="text-xs text-campus-muted-text">SIH 2026 Bangalore Nodal Center</span>
          </div>
          <h2 className="text-xl font-bold text-campus-deep-blue mt-1">
            Event Organizer & Judging Operations
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-campus-warm-white p-1 rounded-2xl border border-campus-border">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attendance' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-white'
            }`}
          >
            GPS Attendance Logs ({attendanceRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('judging')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'judging' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-white'
            }`}
          >
            Judging & Rubric
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'certificates' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-white'
            }`}
          >
            Issue Digital Certs
          </button>
        </div>
      </div>

      {/* Tab 1: Attendance Logs */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-campus-deep-blue">On-Ground Verified Student Check-ins</span>
            <span className="text-campus-muted-text">Real-time GPS validation logs</span>
          </div>

          <div className="divide-y divide-campus-border border border-campus-border rounded-2xl overflow-hidden">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map(rec => (
                <div key={rec.id} className="p-4 bg-white flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-campus-deep-blue">{rec.studentName}</h4>
                      <p className="text-campus-muted-text font-mono text-[10.5px]">ID: {rec.studentId} • {rec.photoHash}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full text-[10.5px]">
                      GPS Verified ({Math.round(rec.distanceMeters)}m)
                    </span>
                    <p className="text-[10px] text-campus-muted-text mt-0.5">{new Date(rec.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-campus-muted-text italic">
                Awaiting student check-ins. (Click "Mark Verified GPS Attendance" on SIH 2026 card above to simulate check-in)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Judging Rubric */}
      {activeTab === 'judging' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-campus-deep-blue">Grand Finale Project Scoring Rubric</h3>
          
          <div className="p-4 rounded-2xl bg-campus-warm-white border border-campus-border space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-campus-deep-blue">
              <span>AgriVision Autonomous AI (Team #SIH-088)</span>
              <span className="text-campus-red font-extrabold text-sm">Total Score: 94 / 100</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-campus-slate-text">
              <div className="p-3 bg-white rounded-xl border border-campus-border">
                <span className="text-campus-muted-text block text-[10px]">Technical Depth</span>
                <span className="font-bold text-campus-blue">28 / 30</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-campus-border">
                <span className="text-campus-muted-text block text-[10px]">Working Hardware Test</span>
                <span className="font-bold text-campus-blue">29 / 30</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-campus-border">
                <span className="text-campus-muted-text block text-[10px]">Societal Impact</span>
                <span className="font-bold text-campus-blue">19 / 20</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-campus-border">
                <span className="text-campus-muted-text block text-[10px]">FMEA Safety Protocols</span>
                <span className="font-bold text-campus-blue">18 / 20</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Digital Certificate Generation */}
      {activeTab === 'certificates' && (
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <h3 className="font-bold text-sm text-campus-deep-blue">Issue Cryptographically Verifiable Digital Certificate</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Recognition Role</label>
              <select
                value={certRole}
                onChange={e => setCertRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl bg-white outline-none"
              >
                <option value="Winner">Winner (Merit Certificate)</option>
                <option value="Participant">Participant</option>
                <option value="Mentor">Mentor Recognition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">Rank / Track Distinction</label>
              <input
                type="text"
                value={rankTitle}
                onChange={e => setRankTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="campus-btn-red text-xs py-2.5 px-5 rounded-xl shadow-warm-md">
              <QrCode className="w-4 h-4" />
              Generate Verifiable Certificate & QR
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

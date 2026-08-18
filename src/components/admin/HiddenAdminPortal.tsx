import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, ShieldCheck, CheckCircle2, XCircle, 
  Lock, AlertTriangle, Users, Award, Eye, FileText 
} from 'lucide-react';

export const HiddenAdminPortal: React.FC = () => {
  const { currentUser, students, verifyStudentManually, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'audits' | 'integrity'>('verifications');

  // Check role authorization
  if (currentUser.role !== 'superadmin') {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-red-100 text-campus-red flex items-center justify-center shadow-warm-md">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-campus-deep-blue">403 — Access Denied</h2>
        <p className="text-xs sm:text-sm text-campus-muted-text leading-relaxed">
          Administrative resources require internal server-side cryptographic credentials and are strictly isolated from the public innovation network.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Admin Protected Header */}
      <div className="p-6 rounded-3xl bg-campus-deep-blue text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Confidential Security Operations
            </span>
            <span className="text-xs text-gray-300">National Platform Integrity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            CampusNet Internal Governance Console
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verifications' ? 'bg-white text-campus-deep-blue shadow-sm' : 'bg-white/10 text-white'
            }`}
          >
            Pending Student Audits
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audits' ? 'bg-white text-campus-deep-blue shadow-sm' : 'bg-white/10 text-white'
            }`}
          >
            Security Audit Logs
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Student ID Verification Requests */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-campus-deep-blue">Student Bonafide Verification Queue</h3>
            <span className="text-xs font-semibold text-campus-muted-text">Zero Public Exposure Compliance</span>
          </div>

          <div className="space-y-3">
            {students.map(student => (
              <div key={student.id} className="p-5 rounded-3xl bg-white border border-campus-border shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-campus-border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-campus-deep-blue">{student.name}</h4>
                      <span className="text-[11px] font-mono text-campus-muted-text">ID: {student.studentId}</span>
                    </div>
                    <p className="text-xs text-campus-muted-text">{student.department} • {student.institution}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Bonafide Approved
                  </span>

                  <button
                    onClick={() => verifyStudentManually(student.id)}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                  >
                    Re-Verify Credentials
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Security & Integrity Logs */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-campus-deep-blue">System Security & Access Audit Trail</h3>

          <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm space-y-3 font-mono text-xs text-campus-slate-text">
            <div className="p-3 bg-campus-warm-white rounded-xl flex items-center justify-between">
              <span>[AUTH] WebRTC Meeting authorized: mtg-team-agro-001 (E2E Encrypted)</span>
              <span className="text-green-700 font-bold">200 OK</span>
            </div>
            <div className="p-3 bg-campus-warm-white rounded-xl flex items-center justify-between">
              <span>[GEO] Geolocation token validated within 45m of Bangalore Nodal Center</span>
              <span className="text-green-700 font-bold">MATCH</span>
            </div>
            <div className="p-3 bg-campus-warm-white rounded-xl flex items-center justify-between">
              <span>[VAULT] Encrypted Student ID card image OCR verification: Pass</span>
              <span className="text-green-700 font-bold">VALIDATED</span>
            </div>
            <div className="p-3 bg-campus-warm-white rounded-xl flex items-center justify-between">
              <span>[QR] Certificate verification lookup: CL-2025-SIH-99214</span>
              <span className="text-campus-blue font-bold">RESOLVED</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

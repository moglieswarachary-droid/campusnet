import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  QrCode, Award, ShieldCheck, Download, ExternalLink,
  Printer, CheckCircle2, Search, Filter, ShieldAlert
} from 'lucide-react';
import { CertificateCard } from '../../certificates/CertificateGenerator';
import { Link } from 'react-router-dom';

export const StudentCertificatesView: React.FC = () => {
  const { certificates, currentUser, addToast } = useApp();
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);

  const selectedCert = certificates.find(c => c.id === selectedCertificateId) || certificates[0];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/70 shadow-2xs">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
                Cryptographic Credentials & Certificates
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Immutable Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Digitally signed certificates issued for national hackathon wins, collegiate competitions, and academic milestones
            </p>
          </div>
        </div>

        <Link
          to={`/verify-certificate/${selectedCert?.id || 'cert-001'}`}
          className="campus-btn-primary text-xs py-2 px-3.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
        >
          <span>Public Verification Gateway</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Grid: Selector List (Left 4 cols) + Certificate Viewer (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Certificate List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Earned Credentials ({certificates.length})
          </h3>

          <div className="space-y-2.5">
            {certificates.map(cert => {
              const isSelected = selectedCert?.id === cert.id;

              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCertificateId(cert.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-campus-blue shadow-xs ring-1 ring-campus-blue'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700">
                      {cert.recipientRole}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-campus-deep-blue leading-tight line-clamp-2">
                    {cert.eventTitle}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Issued: {cert.issueDate}</span>
                    <span className="font-semibold text-campus-blue">View Credential →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCert ? (
            <CertificateCard certificate={selectedCert} />
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Select a certificate from the left ledger to inspect cryptographic credentials.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

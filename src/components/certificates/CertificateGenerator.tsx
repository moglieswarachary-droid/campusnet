import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Certificate, MentorshipCertificate } from '../../types';
import { ShieldCheck, Download, Award, CheckCircle2, QrCode, Printer } from 'lucide-react';

export const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, certificate.qrCodeData, {
        width: 84,
        margin: 1,
        color: {
          dark: '#0B2550',
          light: '#FFFFFF'
        }
      });
    }
  }, [certificate.qrCodeData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-campus-border shadow-warm-lg space-y-6 relative overflow-hidden">
      
      {/* Decorative Gold & Royal Borders */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-campus-blue via-campus-deep-blue to-campus-red" />

      {/* Top Seals Header */}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-campus-red">
            CAMPUSNET+ NATIONAL VERIFIED CREDENTIAL
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-campus-deep-blue mt-0.5">
            Certificate of {certificate.recipientRole === 'Winner' ? 'Merit & Excellence' : 'Recognition'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-campus-border hover:bg-campus-warm-white text-campus-muted-text flex items-center gap-1 text-xs font-bold"
            title="Print Certificate"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
          <div className="w-12 h-12 rounded-2xl bg-campus-soft-blue flex items-center justify-center text-campus-blue border border-blue-200 shadow-warm-sm">
            <Award className="w-6 h-6 text-campus-red" />
          </div>
        </div>
      </div>

      {/* Body Presentation */}
      <div className="space-y-4 py-2 text-center sm:text-left">
        <p className="text-xs text-campus-muted-text uppercase tracking-wider">
          This is to certify that
        </p>
        
        <div className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue font-serif">
          {certificate.recipientName}
        </div>

        <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed max-w-xl">
          has successfully demonstrated outstanding innovation as <strong className="text-campus-red">{certificate.recipientRole}</strong> in the{' '}
          <strong>{certificate.eventTitle}</strong> organized by {certificate.eventOrganizer}.
        </p>

        {certificate.rank && (
          <div className="inline-block p-2 px-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            ★ {certificate.rank}
          </div>
        )}
      </div>

      {/* Footer Credentials & QR Code */}
      <div className="pt-4 border-t border-campus-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-campus-deep-blue font-bold">
            <ShieldCheck className="w-4 h-4 text-campus-green" />
            <span>Cryptographically Verified on CampusNet Registry</span>
          </div>
          <p className="text-campus-muted-text font-mono text-[11px]">
            Certificate ID: <strong className="text-campus-slate-text">{certificate.certificateNumber}</strong>
          </p>
          <p className="text-campus-muted-text text-[10.5px]">
            Issued: {certificate.issueDate} • {certificate.institution}
          </p>
        </div>

        {/* Verifiable QR Code Canvas */}
        <div className="flex items-center gap-3 p-2 bg-campus-warm-white rounded-2xl border border-campus-border">
          <canvas ref={qrCanvasRef} className="rounded-lg shadow-sm" />
          <div className="text-[10px] text-campus-muted-text space-y-0.5 max-w-[100px]">
            <span className="font-bold text-campus-deep-blue block">Scan to Verify</span>
            <span>Public instant authentication</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export const MentorshipCertificateCard: React.FC<{ cert: MentorshipCertificate }> = ({ cert }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, cert.qrCodeData, {
        width: 84,
        margin: 1,
        color: {
          dark: '#0B2550',
          light: '#FFFFFF'
        }
      });
    }
  }, [cert.qrCodeData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-warm-lg space-y-6 relative overflow-hidden">
      
      {/* Decorative Gold & Royal Borders */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-campus-deep-blue to-amber-600" />

      {/* Top Seals Header */}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">
            CAMPUSNET+ NATIONAL FACULTY MENTORSHIP REGISTRY
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-campus-deep-blue mt-0.5">
            Certificate of Project Mentorship Excellence
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-campus-border hover:bg-campus-warm-white text-campus-muted-text flex items-center gap-1 text-xs font-bold"
            title="Print Certificate"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 shadow-warm-sm">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Body Presentation */}
      <div className="space-y-4 py-2 text-center sm:text-left">
        <p className="text-xs text-campus-muted-text uppercase tracking-wider">
          This digital credential is proudly conferred upon
        </p>
        
        <div className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue font-serif">
          {cert.mentorName}
        </div>
        <p className="text-xs font-bold text-campus-blue">
          {cert.mentorDesignation} • {cert.mentorInstitution}
        </p>

        <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed max-w-2xl">
          for outstanding mentorship and technical guidance of student innovation team <strong className="text-campus-deep-blue">{cert.teamName}</strong> on the project entitled <strong className="text-campus-red">"{cert.projectTitle}"</strong> in the domain of {cert.projectDomain}.
        </p>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-1.5 text-amber-950">
          <div><strong>Guided Students:</strong> {cert.studentNames.join(', ')} ({cert.studentInstitutions.join(', ')})</div>
          <div><strong>Duration:</strong> {cert.startDate} to {cert.completionDate} ({cert.durationWeeks} Weeks)</div>
          <div><strong>Work Summary:</strong> {cert.mentorContribution}</div>
          <div><strong>Project Outcome:</strong> {cert.projectOutcome}</div>
        </div>
      </div>

      {/* Signatures & QR Code */}
      <div className="pt-4 border-t border-campus-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-green-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified by CampusNet National Academic Registry</span>
          </div>
          <p className="text-campus-muted-text font-mono text-[11px]">
            Certificate ID: <strong className="text-campus-slate-text">{cert.certificateNumber}</strong>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-campus-muted-text pt-1">
            {cert.authorizedSignatures.map((sig, idx) => (
              <span key={idx}><strong>{sig.name}</strong> ({sig.title}, {sig.organization})</span>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex items-center gap-3 p-2 bg-campus-warm-white rounded-2xl border border-campus-border">
          <canvas ref={qrCanvasRef} className="rounded-lg shadow-sm" />
          <div className="text-[10px] text-campus-muted-text space-y-0.5 max-w-[100px]">
            <span className="font-bold text-campus-deep-blue block">Scan to Verify</span>
            <span>Tamper-proof public authentication</span>
          </div>
        </div>
      </div>

    </div>
  );
};

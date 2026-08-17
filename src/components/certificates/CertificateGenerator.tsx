import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Certificate } from '../../types';
import { ShieldCheck, Download, Award, CheckCircle2, QrCode } from 'lucide-react';

export const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, certificate.qrCodeData, {
        width: 90,
        margin: 1,
        color: {
          dark: '#0B2550',
          light: '#FFFFFF'
        }
      });
    }
  }, [certificate.qrCodeData]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-campus-border shadow-warm-lg space-y-6 relative overflow-hidden">
      
      {/* Decorative Gold & Royal Borders */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-campus-blue via-campus-deep-blue to-campus-red" />

      {/* Top Seals Header */}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-campus-red">
            CAMPUSLINK NATIONAL VERIFIED CREDENTIAL
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-campus-deep-blue mt-0.5">
            Certificate of {certificate.recipientRole === 'Winner' ? 'Merit & Excellence' : 'Recognition'}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-campus-soft-blue flex items-center justify-center text-campus-blue border border-blue-200 shadow-warm-sm">
          <Award className="w-6 h-6 text-campus-red" />
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
            <span>Cryptographically Verified Bonafide</span>
          </div>
          <p className="text-campus-muted-text font-mono text-[11px]">
            Certificate No: <strong className="text-campus-slate-text">{certificate.certificateNumber}</strong>
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

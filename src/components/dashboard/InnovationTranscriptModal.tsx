import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { User, Certificate, Project, ResearchPublication } from '../../types';
import { 
  X, Printer, ShieldCheck, Award, BookOpen, FolderKanban, 
  CheckCircle2, Download, ExternalLink, GraduationCap, Building2,
  Calendar, Code2, MapPin
} from 'lucide-react';

interface InnovationTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  certificates: Certificate[];
  projects: Project[];
  publications: ResearchPublication[];
}

export const InnovationTranscriptModal: React.FC<InnovationTranscriptModalProps> = ({
  isOpen,
  onClose,
  user,
  certificates,
  projects,
  publications
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/portfolio`
    : 'https://campusnet.in/portfolio';

  useEffect(() => {
    if (isOpen && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, verificationUrl, {
        width: 80,
        margin: 1,
        color: {
          dark: '#0B2550',
          light: '#FFFFFF'
        }
      });
    }
  }, [isOpen, verificationUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-campus-deep-blue/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-campus-border shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-4">
        
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="no-print bg-campus-deep-blue text-white px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Verified Academic & Innovation Transcript</h3>
              <p className="text-xs text-blue-200">Official 1-Page National Competency & Hackathon Profile</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-campus-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-warm-sm border border-blue-400/40"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white space-y-6 text-campus-slate-text certificate-printable">
          
          {/* Document Header & Authority Seal */}
          <div className="border-b-2 border-campus-deep-blue pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-campus-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  NATIONAL INNOVATION COUNCIL • CAMPUSNET+ INDIA
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-campus-deep-blue">
                Verified Student Innovation Transcript
              </h1>
              <p className="text-xs text-campus-muted-text">
                Authenticated Record of Hackathon Achievements, Preprints, & Verified Project Milestones
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <canvas ref={qrCanvasRef} className="rounded-lg border border-campus-border" />
              <div className="text-[10px] text-campus-muted-text space-y-0.5">
                <span className="font-bold text-campus-deep-blue block">Instant Verification</span>
                <span className="font-mono text-[9.5px]">ID: {user.studentId}</span>
              </div>
            </div>
          </div>

          {/* Student Profile Overview Banner */}
          <div className="bg-campus-warm-white/70 p-5 rounded-2xl border border-campus-border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-campus-muted-text uppercase text-[10px] font-bold">Candidate Name</span>
              <div className="text-base font-extrabold text-campus-deep-blue">{user.name}</div>
              <div className="text-campus-blue font-semibold">{user.department} ({user.year})</div>
            </div>

            <div className="space-y-1">
              <span className="text-campus-muted-text uppercase text-[10px] font-bold">Institution & Registry</span>
              <div className="font-bold text-campus-slate-text">{user.institution}</div>
              <div className="font-mono text-campus-muted-text text-[11px]">Enrollment: {user.studentId}</div>
            </div>

            <div className="space-y-1">
              <span className="text-campus-muted-text uppercase text-[10px] font-bold">Innovation Metrics</span>
              <div className="text-base font-black text-campus-red">Index: {user.innovationScore} / 1000</div>
              <div className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Student Bonafide
              </div>
            </div>
          </div>

          {/* Core Technical Competencies */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-campus-deep-blue flex items-center gap-1.5 border-b border-campus-border pb-1">
              <Code2 className="w-3.5 h-3.5 text-campus-red" />
              Verified Competencies & Badges
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.skills.map(skill => (
                <span key={skill} className="text-xs font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-1 rounded-lg border border-blue-200">
                  {skill}
                </span>
              ))}
              {user.badges.map(b => (
                <span key={b} className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                  ★ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Hackathon & Competition Awards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-campus-deep-blue flex items-center gap-1.5 border-b border-campus-border pb-1">
              <Award className="w-3.5 h-3.5 text-campus-red" />
              Official Hackathon Awards & Certifications ({certificates.length})
            </h3>
            <div className="space-y-2">
              {certificates.map(cert => (
                <div key={cert.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-campus-deep-blue flex items-center gap-2">
                      <span>{cert.eventTitle}</span>
                      {cert.rank && (
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {cert.rank}
                        </span>
                      )}
                    </div>
                    <p className="text-campus-muted-text text-[11px]">
                      Organized by {cert.eventOrganizer} • Role: <strong>{cert.recipientRole}</strong>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono text-[10.5px] text-campus-muted-text">
                    <div>Cert #: <strong className="text-campus-slate-text">{cert.certificateNumber}</strong></div>
                    <div>Issued: {cert.issueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capstone Projects & Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Projects */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-campus-deep-blue flex items-center gap-1.5 border-b border-campus-border pb-1">
                <FolderKanban className="w-3.5 h-3.5 text-campus-blue" />
                Featured Innovation Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 2).map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-campus-deep-blue">{p.title}</div>
                    <p className="text-[11px] text-campus-muted-text line-clamp-2">{p.problemStatement}</p>
                    <div className="text-[10.5px] text-campus-blue font-semibold">
                      Tech: {p.technologies.slice(0, 4).join(', ')} • Mentor: {p.mentor}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-campus-deep-blue flex items-center gap-1.5 border-b border-campus-border pb-1">
                <BookOpen className="w-3.5 h-3.5 text-campus-blue" />
                Research Preprints & Papers
              </h3>
              <div className="space-y-2">
                {publications.map(pub => (
                  <div key={pub.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-campus-deep-blue leading-snug">{pub.title}</div>
                    <p className="text-[11px] text-campus-muted-text">{pub.journal} • {pub.citations} Citations</p>
                    <p className="text-[10px] font-mono text-campus-muted-text">DOI: {pub.doi}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Official Verification Footer */}
          <div className="pt-4 border-t-2 border-campus-deep-blue flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-campus-muted-text">
            <div className="flex items-center gap-2 text-green-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Digitally Authenticated by CampusNet+ Higher Education Registry</span>
            </div>
            <div className="text-right">
              Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Tamper-proof
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InnovationTranscriptModal;

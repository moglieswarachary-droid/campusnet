import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, AlertCircle, Clock, CheckCircle2, 
  XCircle, FileText, ArrowRight, Upload, Building2, 
  RefreshCw, HelpCircle, Mail, MapPin 
} from 'lucide-react';
import { DocumentUploadField } from './DocumentUploadField';
import { EventHostingDocument, OrganizationVerificationStatus } from '../../types';

interface Props {
  onProceedToDashboard?: () => void;
}

export const OrganizationVerificationStatusView: React.FC<Props> = ({ onProceedToDashboard }) => {
  const { currentOrganizer, submitOrganizerVerification } = useApp();
  const navigate = useNavigate();

  const [supplementaryDoc, setSupplementaryDoc] = useState<EventHostingDocument | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentOrganizer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Session Expired</h2>
          <p className="text-xs text-slate-500">Please sign in to view your institutional verification status.</p>
          <button
            onClick={() => navigate('/organization/login')}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Go to Organizer Login
          </button>
        </div>
      </div>
    );
  }

  const status = currentOrganizer.verificationStatus || 'submitted';

  const handleUploadEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementaryDoc) return;
    setIsSubmitting(true);
    submitOrganizerVerification({
      documents: [supplementaryDoc],
      notes: submissionNotes
    });
    setSupplementaryDoc(null);
    setSubmissionNotes('');
    setIsSubmitting(false);
  };

  const getStatusConfig = (st: OrganizationVerificationStatus) => {
    switch (st) {
      case 'verified':
        return {
          title: 'Institution Identity Verified',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          bgHeader: 'from-emerald-50 via-white to-white',
          desc: 'Your college is fully accredited on CampusNet+. You have full permissions to host, publish, and manage collegiate events with GPS/QR check-in and certificate issuance.'
        };
      case 'under_review':
        return {
          title: 'Verification Under Active Review',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
          bgHeader: 'from-amber-50 via-white to-white',
          desc: 'Your institutional documents are currently being evaluated by the CampusNet Platform Verification Council. Typical turnaround is 24–48 business hours.'
        };
      case 'additional_info_required':
        return {
          title: 'Additional Documentation Requested',
          badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          bgHeader: 'from-orange-50 via-white to-white',
          desc: 'The reviewer has requested clarification or supplementary proof of institutional authorization before approving full hosting privileges.'
        };
      case 'rejected':
        return {
          title: 'Application Not Approved',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
          iconColor: 'text-rose-600',
          bgHeader: 'from-rose-50 via-white to-white',
          desc: 'The submitted application could not be verified. You may resubmit with revised institutional credentials or an official authorization letter.'
        };
      case 'draft':
      case 'submitted':
      default:
        return {
          title: 'Application Submitted',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
          iconColor: 'text-blue-600',
          bgHeader: 'from-blue-50 via-white to-white',
          desc: 'Your registration has been recorded in the National Academic Registry. Verification checks will begin shortly.'
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${config.bgHeader} border border-slate-200 shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center ${config.iconColor} flex-shrink-0`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeClass}`}>
                  Status: {status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {currentOrganizer.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                {config.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onProceedToDashboard) onProceedToDashboard();
              else navigate('/organization/events');
            }}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reviewer Feedback / Status Notes */}
      {currentOrganizer.verificationNotes && (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Platform Reviewer Comments & Guidance</span>
          </div>
          <p className="text-slate-700 leading-relaxed pl-6">
            {currentOrganizer.verificationNotes}
          </p>
        </div>
      )}

      {/* Institutional Profile Summary */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Registered Institution Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Institution Name</span>
            <p className="font-bold text-slate-900">{currentOrganizer.institutionName}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
            <p className="font-bold text-slate-900">
              {currentOrganizer.city}, {currentOrganizer.district ? `${currentOrganizer.district}, ` : ''}{currentOrganizer.state}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Authorized Coordinator</span>
            <p className="font-bold text-slate-900">{currentOrganizer.coordinatorName} ({currentOrganizer.designation})</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Official Email</span>
            <p className="font-bold text-slate-900 truncate">{currentOrganizer.officialEmail}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Institution Type & Category</span>
            <p className="font-bold text-slate-900">
              {currentOrganizer.institutionType || 'Recognized'} • {currentOrganizer.institutionCategory || 'Academic'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">University Affiliation</span>
            <p className="font-bold text-slate-900">{currentOrganizer.affiliationUniversity || 'Direct Recognition'}</p>
          </div>
        </div>
      </div>

      {/* Supplementary Evidence Upload (if pending or changes requested) */}
      {status !== 'verified' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Submit Institutional Evidence or Authorization Letter
            </h2>
            <p className="text-xs text-slate-500">
              If requested by reviewer, or to expedite verification, upload a signed letter from your Principal/Dean on institutional letterhead, or affiliation approval copy.
            </p>
          </div>

          <form onSubmit={handleUploadEvidence} className="space-y-4">
            <DocumentUploadField
              label="Institutional Authorization Document (PDF, max 10MB)"
              type="formal_request_letter"
              required={true}
              helpText="Upload a scanned copy of letterhead authorization or university affiliation certificate"
              document={supplementaryDoc}
              onDocumentChange={setSupplementaryDoc}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Accompanying Notes or Clarification (Optional)
              </label>
              <textarea
                value={submissionNotes}
                onChange={e => setSubmissionNotes(e.target.value)}
                rows={3}
                placeholder="Enter any additional context, AISHE code, or direct contact numbers for the verification officer..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!supplementaryDoc || isSubmitting}
              className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                supplementaryDoc && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading Evidence...' : 'Submit Verification Evidence'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Helpful FAQ Footer */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-600">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>CampusNet National Institutional Verification Policy</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-500 leading-relaxed">
          <li>Every eligible college in all 28 States and 8 Union Territories can apply to host academic competitions.</li>
          <li>Accreditation (NAAC/NBA/NIRF) is <strong>not</strong> mandatory to register.</li>
          <li>While verification is in review, organizers may draft and preview events.</li>
          <li>Public discovery and participant registration go live immediately once institutional authorization is validated.</li>
        </ul>
      </div>

    </div>
  );
};

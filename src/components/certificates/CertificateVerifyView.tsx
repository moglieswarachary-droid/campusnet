import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Search, Award, CheckCircle2, 
  XCircle, QrCode, ArrowRight, Building2, Calendar, User, Sparkles 
} from 'lucide-react';
import { CertificateCard, MentorshipCertificateCard } from './CertificateGenerator';

export const CertificateVerifyView: React.FC = () => {
  const { certificates, mentorshipCertificates } = useApp();
  
  const [lookupId, setLookupId] = useState('CN-2026-MNT-8F2A-3914');
  const [searchedEventCert, setSearchedEventCert] = useState<any>(null);
  const [searchedMentorCert, setSearchedMentorCert] = useState<any>(mentorshipCertificates[0] || null);
  const [hasSearched, setHasSearched] = useState(true);

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    const trimmed = lookupId.trim().toLowerCase();
    
    // Check Event Certs
    const foundEvent = certificates.find(c => c.certificateNumber.toLowerCase() === trimmed);
    // Check Mentor Certs
    const foundMentor = mentorshipCertificates.find(m => m.certificateNumber.toLowerCase() === trimmed);

    if (foundEvent) {
      setSearchedEventCert(foundEvent);
      setSearchedMentorCert(null);
    } else if (foundMentor) {
      setSearchedMentorCert(foundMentor);
      setSearchedEventCert(null);
    } else {
      setSearchedEventCert(null);
      setSearchedMentorCert(null);
    }

    setHasSearched(true);
  };

  const isFound = searchedEventCert || searchedMentorCert;

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-campus-red" />
          CampusNet Public Credential Verification Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
          Verify CampusNet Digital Certificate
        </h1>
        <p className="text-xs sm:text-sm text-campus-muted-text">
          Enter the unique Certificate ID or scan the QR code to authenticate student innovation awards, hackathon rankings, and faculty project mentorship credentials across India.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-campus-border shadow-warm-md max-w-2xl mx-auto space-y-3">
        <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupId}
              onChange={e => setLookupId(e.target.value)}
              placeholder="e.g. CN-2026-MNT-8F2A-3914"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="campus-btn-red text-xs sm:text-sm py-3 px-6 rounded-xl shadow-warm-md w-full sm:w-auto"
          >
            Verify Credential
          </button>
        </form>

        <div className="pt-2 text-[11px] text-campus-muted-text flex items-center justify-between flex-wrap gap-2">
          <span>Sample test IDs:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setLookupId('CN-2026-MNT-8F2A-3914');
                setSearchedMentorCert(mentorshipCertificates[0]);
                setSearchedEventCert(null);
                setHasSearched(true);
              }}
              className="font-mono text-campus-blue hover:underline bg-campus-soft-blue px-2 py-0.5 rounded font-bold"
            >
              CN-2026-MNT-8F2A-3914 (Mentorship)
            </button>
            <button
              onClick={() => {
                setLookupId('CN-2025-WIN-7841-9021');
                setSearchedEventCert(certificates[0]);
                setSearchedMentorCert(null);
                setHasSearched(true);
              }}
              className="font-mono text-campus-blue hover:underline bg-campus-soft-blue px-2 py-0.5 rounded font-bold"
            >
              CN-2025-WIN-7841-9021 (Winner)
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && isFound ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-green-950">Valid & Authenticated Digital Credential</h4>
                <p className="text-xs text-green-800">Verified by CampusNet National Academic & Innovation Registry</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-green-900 bg-white px-2.5 py-1 rounded-lg border border-green-200">
              STATUS: BONAFIDE & TAMPER-PROOF
            </span>
          </div>

          {searchedEventCert && <CertificateCard certificate={searchedEventCert} />}
          {searchedMentorCert && <MentorshipCertificateCard cert={searchedMentorCert} />}
        </div>
      ) : hasSearched && !isFound ? (
        <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center space-y-3 max-w-lg mx-auto">
          <XCircle className="w-10 h-10 text-campus-red mx-auto" />
          <h3 className="font-bold text-base text-red-950">Certificate Not Found</h3>
          <p className="text-xs text-red-800 leading-relaxed">
            No matching credential found on CampusNet for ID "{lookupId}". Please check the ID or scan the original QR code.
          </p>
        </div>
      ) : null}

    </div>
  );
};

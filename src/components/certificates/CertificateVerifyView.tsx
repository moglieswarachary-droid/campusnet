import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Search, Award, CheckCircle2, 
  XCircle, QrCode, ArrowRight, Building2, Calendar, User 
} from 'lucide-react';
import { CertificateCard } from './CertificateGenerator';

export const CertificateVerifyView: React.FC = () => {
  const { certificates } = useApp();
  
  const [lookupId, setLookupId] = useState('CL-2025-SIH-99214');
  const [searchedCert, setSearchedCert] = useState(certificates[0]);
  const [hasSearched, setHasSearched] = useState(true);

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const found = certificates.find(c => c.certificateNumber.toLowerCase() === lookupId.trim().toLowerCase());
    setSearchedCert(found || null as any);
    setHasSearched(true);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-campus-red" />
          Public Credential Verification Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
          Verify CampusLink Digital Certificate
        </h1>
        <p className="text-xs sm:text-sm text-campus-muted-text">
          Enter the unique Certificate ID or scan the QR code to authenticate student merit awards, hackathon rankings, and faculty mentorship credentials without exposing private records.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-campus-border shadow-warm-md max-w-2xl mx-auto">
        <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupId}
              onChange={e => setLookupId(e.target.value)}
              placeholder="e.g. CL-2025-SIH-99214"
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

        <div className="pt-3 text-[11px] text-campus-muted-text flex items-center justify-between">
          <span>Sample test IDs: <strong>CL-2025-SIH-99214</strong>, <strong>CL-2025-IITB-04122</strong></span>
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && searchedCert ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-green-950">Valid & Authenticated Credential</h4>
                <p className="text-xs text-green-800">Issued by CampusLink National Academic Registry</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-green-900 bg-white px-2.5 py-1 rounded-lg border border-green-200">
              STATUS: BONAFIDE
            </span>
          </div>

          <CertificateCard certificate={searchedCert} />
        </div>
      ) : hasSearched && !searchedCert ? (
        <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center space-y-3 max-w-lg mx-auto">
          <XCircle className="w-10 h-10 text-campus-red mx-auto" />
          <h3 className="font-bold text-base text-red-950">Certificate Not Found</h3>
          <p className="text-xs text-red-800 leading-relaxed">
            No matching credential found for ID "{lookupId}". Please check the spelling or scan the original QR code.
          </p>
        </div>
      ) : null}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, Save, Mail, Globe, 
  MapPin, Bell, Key, CheckCircle2, Lock, FileText
} from 'lucide-react';

export const OrganizationSettingsView: React.FC = () => {
  const { currentOrganizer, updateOrganizerProfile, addToast } = useApp();

  const [institutionName, setInstitutionName] = useState(currentOrganizer?.institutionName || 'Kuppam Engineering College');
  const [coordinatorName, setCoordinatorName] = useState(currentOrganizer?.coordinatorName || 'Dr. Anand Kumar');
  const [designation, setDesignation] = useState(currentOrganizer?.designation || 'Dean of Innovation & Hackathons');
  const [officialEmail, setOfficialEmail] = useState(currentOrganizer?.officialEmail || 'organizer.demo@campusnet-demo.in');
  const [phone, setPhone] = useState(currentOrganizer?.phone || currentOrganizer?.mobile || '+91 94432 10987');
  const [website, setWebsite] = useState(currentOrganizer?.website || 'https://www.kec.ac.in');
  const [aisheCode, setAisheCode] = useState(currentOrganizer?.aisheCode || 'C-26882');

  // Preferences toggles
  const [allowExternalStudents, setAllowExternalStudents] = useState(true);
  const [autoIssueCertificates, setAutoIssueCertificates] = useState(true);
  const [requireQRScan, setRequireQRScan] = useState(true);
  const [emailAlertsOnRegistration, setEmailAlertsOnRegistration] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganizerProfile({
      institutionName,
      coordinatorName,
      designation,
      officialEmail,
      mobile: phone,
      phone,
      website,
      aisheCode
    });
    addToast({ type: 'success', message: 'Organization workspace preferences updated successfully.' });
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Organization Settings & Hosting Policies
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure institutional contact credentials, AISHE verification mappings, and event hosting rules.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Institutional Profile & AISHE Mapping */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Institutional Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                AISHE / UGC Accreditation Code *
              </label>
              <input
                type="text"
                required
                value={aisheCode}
                onChange={(e) => setAisheCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State & Geographic Zone
              </label>
              <input
                type="text"
                disabled
                value={`${currentOrganizer?.state || 'Andhra Pradesh'} • All India Directory`}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Primary Coordinator Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Primary Coordinator Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Coordinator Full Name *
              </label>
              <input
                type="text"
                required
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation / Office
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Institutional Email *
              </label>
              <input
                type="email"
                required
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Event Operations & Security Policies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Event Hosting & Attendance Policies
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Nationwide Student Discoverability</p>
                <p className="text-[11px] text-slate-500">Allow students from all 28 states & 8 UTs to discover and register for your events</p>
              </div>
              <input
                type="checkbox"
                checked={allowExternalStudents}
                onChange={(e) => setAllowExternalStudents(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Automated QR Verifiable Certificates</p>
                <p className="text-[11px] text-slate-500">Automatically generate tamper-proof certificates upon verified event attendance</p>
              </div>
              <input
                type="checkbox"
                checked={autoIssueCertificates}
                onChange={(e) => setAutoIssueCertificates(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Mandatory QR Attendance Check-In</p>
                <p className="text-[11px] text-slate-500">Require on-site physical QR scanner verification before round submissions</p>
              </div>
              <input
                type="checkbox"
                checked={requireQRScan}
                onChange={(e) => setRequireQRScan(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Alerts on Team Registrations</p>
                <p className="text-[11px] text-slate-500">Receive instant email summary whenever a collegiate innovation team registers</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlertsOnRegistration}
                onChange={(e) => setEmailAlertsOnRegistration(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

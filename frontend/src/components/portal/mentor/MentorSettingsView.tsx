import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Settings, Users, Globe, Bell, Video, ShieldCheck,
  Save, Check, Lock, Sparkles, BookOpen
} from 'lucide-react';

export const MentorSettingsView: React.FC = () => {
  const { addToast } = useApp();
  const [maxCapacity, setMaxCapacity] = useState('5');
  const [allowExternal, setAllowExternal] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSlaAlerts, setAutoSlaAlerts] = useState(true);
  const [meetingProvider, setMeetingProvider] = useState<'campusnet' | 'meet' | 'zoom'>('campusnet');
  const [publicDirectoryListing, setPublicDirectoryListing] = useState(true);

  const handleSave = () => {
    addToast({
      type: 'success',
      message: 'Mentorship preferences and advisory capacity updated successfully.'
    });
  };

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
              Mentorship Settings & Capacity
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure student intake limits, national advisory directory listing, and video consult defaults
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6 divide-y divide-slate-100">
        
        {/* Advisory Capacity */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F9488]" />
            <h3 className="text-sm font-bold text-[#12243A]">Advisory Bandwidth & Capacity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F3F6FA] border border-slate-200/70 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Maximum Concurrent Guided Teams
              </label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Protects faculty bandwidth. Automatically hides your profile from student guidance search when reached.
              </p>
              <select
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0F9488]"
              >
                <option value="3">3 Teams (Focused advisory)</option>
                <option value="5">5 Teams (Standard faculty quota)</option>
                <option value="8">8 Teams (High bandwidth)</option>
                <option value="10">10 Teams (Departmental chair quota)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3F6FA] border border-slate-200/70 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Default Video Consultation Room
              </label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Provider utilized when launching 1-on-1 consultations or team office hours.
              </p>
              <select
                value={meetingProvider}
                onChange={(e) => setMeetingProvider(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0F9488]"
              >
                <option value="campusnet">CampusNet Encrypted WebRTC (Built-in)</option>
                <option value="meet">Google Meet (Institutional OAuth)</option>
                <option value="zoom">Zoom Faculty Room</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visibility & Student Requests */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0F9488]" />
            <h3 className="text-sm font-bold text-[#12243A]">Discoverability & National Intake</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Allow Cross-Institutional Guidance Requests</p>
                <p className="text-[11px] text-slate-500">Allow verified student teams from accredited colleges across India to submit mentorship pitches</p>
              </div>
              <input
                type="checkbox"
                checked={allowExternal}
                onChange={(e) => setAllowExternal(e.target.checked)}
                className="w-4 h-4 text-[#0F9488] rounded focus:ring-[#0F9488]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Public Mentor Directory Indexing</p>
                <p className="text-[11px] text-slate-500">Feature your faculty profile in the national CampusNet research directory</p>
              </div>
              <input
                type="checkbox"
                checked={publicDirectoryListing}
                onChange={(e) => setPublicDirectoryListing(e.target.checked)}
                className="w-4 h-4 text-[#0F9488] rounded focus:ring-[#0F9488]"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Review SLAs */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0F9488]" />
            <h3 className="text-sm font-bold text-[#12243A]">Notification SLAs</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Instant Email Alert on New Student Pitch</p>
                <p className="text-[11px] text-slate-500">Dispatches notification to institutional faculty email when new teams request supervision</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0F9488] rounded focus:ring-[#0F9488]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Milestone Review SLA Reminders (48-hour)</p>
                <p className="text-[11px] text-slate-500">Reminds you when student deliverable code reviews are approaching evaluation deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={autoSlaAlerts}
                onChange={(e) => setAutoSlaAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0F9488] rounded focus:ring-[#0F9488]"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

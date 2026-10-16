import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Settings, Save, Globe, Bell, ShieldCheck, Atom } from 'lucide-react';

export const ResearcherSettingsView: React.FC = () => {
  const { addToast } = useApp();
  const [openAccess, setOpenAccess] = useState(true);
  const [notifyCitations, setNotifyCitations] = useState(true);
  const [allowExternalRAs, setAllowExternalRAs] = useState(true);
  const [orcidAutoSync, setOrcidAutoSync] = useState(true);

  const handleSave = () => {
    addToast({
      type: 'success',
      message: 'Research workspace settings and ORCID sync preferences updated.'
    });
  };

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
              Research Workspace Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure open-access licensing defaults, ORCID synchronization, and citation notification digests
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6 divide-y divide-slate-100">
        
        {/* Open Science */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#6954C8]" />
            <h3 className="text-sm font-bold text-[#182442]">Open Science & Licensing Defaults</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Default to Open-Access (Creative Commons CC-BY 4.0)</p>
                <p className="text-[11px] text-slate-500">Enable automatic open discovery of non-peer-reviewed academic pre-prints and reproducible benchmarks</p>
              </div>
              <input
                type="checkbox"
                checked={openAccess}
                onChange={(e) => setOpenAccess(e.target.checked)}
                className="w-4 h-4 text-[#6954C8] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Bi-directional ORCID Synchronization</p>
                <p className="text-[11px] text-slate-500">Automatically push verified publication DOIs and grant awards to official ORCID registry</p>
              </div>
              <input
                type="checkbox"
                checked={orcidAutoSync}
                onChange={(e) => setOrcidAutoSync(e.target.checked)}
                className="w-4 h-4 text-[#6954C8] rounded"
              />
            </div>
          </div>
        </div>

        {/* Collaborations & RA Recruiting */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#13877B]" />
            <h3 className="text-sm font-bold text-[#182442]">Student RA Applications</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Allow Cross-Institutional RA Applications</p>
                <p className="text-[11px] text-slate-500">Permit qualified undergraduate and master's students nationwide to apply for research assistantships</p>
              </div>
              <input
                type="checkbox"
                checked={allowExternalRAs}
                onChange={(e) => setAllowExternalRAs(e.target.checked)}
                className="w-4 h-4 text-[#13877B] rounded"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#E9A23B]" />
            <h3 className="text-sm font-bold text-[#182442]">Bibliometric Alerts</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Citation & Co-Author Mentions Alert</p>
                <p className="text-[11px] text-slate-500">Receive weekly digests when publications receive new indexing citations in IEEE/ACM journals</p>
              </div>
              <input
                type="checkbox"
                checked={notifyCitations}
                onChange={(e) => setNotifyCitations(e.target.checked)}
                className="w-4 h-4 text-[#E9A23B] rounded"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

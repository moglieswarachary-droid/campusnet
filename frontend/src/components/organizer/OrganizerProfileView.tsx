import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Save } from 'lucide-react';

export const OrganizerProfileView: React.FC = () => {
  const { currentOrganizer, updateOrganizerProfile } = useApp();

  const [coordinatorName, setCoordinatorName] = useState(currentOrganizer?.coordinatorName || '');
  const [designation, setDesignation] = useState(currentOrganizer?.designation || '');
  const [mobile, setMobile] = useState(currentOrganizer?.mobile || '');
  const [department, setDepartment] = useState(currentOrganizer?.department || '');
  const [city, setCity] = useState(currentOrganizer?.city || '');
  const [state, setState] = useState(currentOrganizer?.state || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganizerProfile({
      coordinatorName,
      designation,
      mobile,
      department,
      city,
      state
    });
  };

  return (
    <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-3xl mx-auto space-y-6">
      
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            Institution Profile
          </span>
          <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            AISHE Bonafide Verified
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          {currentOrganizer?.institutionName}
        </h2>
        <p className="text-xs text-slate-400">
          Official Institutional ID: <strong className="text-amber-300 font-mono">{currentOrganizer?.id}</strong>
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              Coordinator Full Name *
            </label>
            <input
              type="text"
              value={coordinatorName}
              onChange={e => setCoordinatorName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              Designation *
            </label>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              disabled
              value={currentOrganizer?.officialEmail || ''}
              className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-800/80 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              Mobile Contact *
            </label>
            <input
              type="text"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              Academic Department / Cell
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              City / Campus Location
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase text-slate-400 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>

      </form>

    </div>
  );
};

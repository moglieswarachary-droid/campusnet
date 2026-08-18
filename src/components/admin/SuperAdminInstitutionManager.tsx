import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, AlertTriangle, Search, 
  ExternalLink, CheckCircle2, XCircle, Plus, MapPin 
} from 'lucide-react';
import { InstitutionInfo } from '../../types';

export const SuperAdminInstitutionManager: React.FC = () => {
  const { institutions, verifyInstitution, suspendInstitution, organizers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              AISHE Institutional Registry
            </span>
            <span className="text-xs text-slate-400">Accreditation & Event Authorization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            College & University Management ({institutions.length})
          </h2>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by college name, city, state..."
          className="w-full sm:w-72 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
        />
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInstitutions.map(inst => (
          <div
            key={inst.id}
            className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inst.verified ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {inst.verified ? '✓ VERIFIED ACCREDITED' : '⚠ PENDING VERIFICATION'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {inst.id}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-1.5">{inst.name}</h3>
                <p className="text-xs text-slate-400">{inst.city}, {inst.state} {inst.district ? `(${inst.district} Dist)` : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
              <div className="p-2 bg-slate-900 rounded-xl">
                <div className="font-bold text-white">{inst.studentCount || 0}</div>
                <div className="text-[10px] text-slate-400">Students</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl">
                <div className="font-bold text-white">{inst.mentorCount || 0}</div>
                <div className="text-[10px] text-slate-400">Faculty</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl">
                <div className="font-bold text-amber-400">{inst.eventsCount || 0}</div>
                <div className="text-[10px] text-slate-400">Events Hosted</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
              {inst.website && (
                <a
                  href={inst.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-2">
                {!inst.verified ? (
                  <button
                    onClick={() => verifyInstitution(inst.id)}
                    className="py-1.5 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Bonafide</span>
                  </button>
                ) : (
                  <button
                    onClick={() => suspendInstitution(inst.id)}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 font-bold text-xs flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Suspend Authorization</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

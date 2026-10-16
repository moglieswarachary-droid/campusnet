import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, Users, Building2, Calendar, 
  Award, FileText, CheckCircle2, Clock, 
  ArrowRight, ShieldCheck, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { SuperAdminTab } from './SuperAdminLayout';

interface Props {
  setActiveSection: (section: SuperAdminTab) => void;
}

export const SuperAdminDashboardView: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    students, mentors, researchers, institutions, 
    events, certificates, auditLogs 
  } = useApp();

  const pendingEvents = events.filter(e => e.status === 'review');
  const verifiedColleges = institutions.filter(i => i.verified).length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                Central Oversight Authority
              </span>
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                National Registry Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              CampusNet National Governance Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring and compliance auditing across all Indian technical universities, student innovators, mentors, and collegiate hackathons.
            </p>
          </div>

          {pendingEvents.length > 0 && (
            <button
              onClick={() => setActiveSection('events_moderation')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 animate-bounce self-start md:self-auto"
            >
              <Clock className="w-4 h-4" />
              <span>{pendingEvents.length} Events Awaiting Approval</span>
            </button>
          )}
        </div>
      </div>

      {/* National KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Students</div>
          <div className="text-2xl font-black text-blue-400">{students.length}</div>
          <div className="text-[10px] text-slate-400">Across 28 States</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Faculty Mentors</div>
          <div className="text-2xl font-black text-green-400">{mentors.length}</div>
          <div className="text-[10px] text-slate-400">IIT / NIT Guides</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">PhD Scholars</div>
          <div className="text-2xl font-black text-purple-400">{researchers.length}</div>
          <div className="text-[10px] text-slate-400">Research Network</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Institutions</div>
          <div className="text-2xl font-black text-amber-300">{institutions.length}</div>
          <div className="text-[10px] text-slate-400">{verifiedColleges} AISHE Verified</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">National Events</div>
          <div className="text-2xl font-black text-white">{events.length}</div>
          <div className="text-[10px] text-slate-400">{pendingEvents.length} Pending Review</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Issued Certs</div>
          <div className="text-2xl font-black text-red-400">{certificates.length}</div>
          <div className="text-[10px] text-slate-400">Verifiable QR</div>
        </div>

      </div>

      {/* Moderation Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pending Event Approvals */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Event Approval Queue ({pendingEvents.length})
            </h3>
            <button
              onClick={() => setActiveSection('events_moderation')}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              View Full Queue →
            </button>
          </div>

          <div className="space-y-3">
            {pendingEvents.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                All submitted collegiate hackathons have been reviewed.
              </div>
            ) : (
              pendingEvents.map(event => (
                <div key={event.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">{event.organizer}</span>
                    <span className="text-[10px] font-mono text-slate-400">{event.code}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{event.title}</h4>
                  <div className="text-[11px] text-slate-400">
                    Venue: {event.venue}, {event.city} • Mode: {event.mode}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security & Audit Summary */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Recent Administrative Audit Events
            </h3>
            <button
              onClick={() => setActiveSection('audit_logs')}
              className="text-xs font-bold text-red-400 hover:underline"
            >
              Full Audit Trail →
            </button>
          </div>

          <div className="space-y-2">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{log.action}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-400 text-[10.5px] truncate">{log.details}</div>
                <div className="text-[10px] text-slate-500">By: {log.actorName} ({log.actorRole})</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

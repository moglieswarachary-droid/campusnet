import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, Download, FileText, PieChart, 
  TrendingUp, Users, CheckCircle2, Award, Printer 
} from 'lucide-react';

export const EventReportsView: React.FC = () => {
  const { events, currentOrganizer, eventRegistrations, projectSubmissions, certificates } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const regs = eventRegistrations.filter(r => r.eventId === selectedEventId);
  const checkedIn = regs.filter(r => r.attendanceStatus === 'checked_in');
  const submissions = projectSubmissions.filter(s => s.eventId === selectedEventId);
  const certs = certificates.filter(c => c.eventId === selectedEventId);

  // College distribution calculation
  const collegeMap: { [key: string]: number } = {};
  regs.forEach(r => {
    collegeMap[r.institution] = (collegeMap[r.institution] || 0) + 1;
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Institutional Analytics & Accreditation Reports
          </h2>
          <p className="text-xs text-slate-400">
            Export official NAAC / NIRF verifiable event reports with participant metrics and audit statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none"
          >
            {orgEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>

          <button
            onClick={handlePrintReport}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Card */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              CAMPUSNET ACCREDITATION AUDIT REPORT
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">{currentEvent.title}</h3>
            <p className="text-xs text-slate-400">
              Host: {currentOrganizer?.institutionName} ({currentOrganizer?.city}, {currentOrganizer?.state})
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono text-slate-400">Event Code: {currentEvent.code}</div>
            <div className="text-[10.5px] text-slate-500">Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Registered</div>
            <div className="text-2xl font-black text-white">{regs.length}</div>
            <div className="text-[10px] text-slate-400">Students</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Nodal Attendance</div>
            <div className="text-2xl font-black text-green-400">{checkedIn.length}</div>
            <div className="text-[10px] text-slate-400">Verified QR Rate ({regs.length > 0 ? Math.round((checkedIn.length / regs.length) * 100) : 0}%)</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Prototypes Evaluated</div>
            <div className="text-2xl font-black text-purple-400">{submissions.length}</div>
            <div className="text-[10px] text-slate-400">Submissions</div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Certificates Minted</div>
            <div className="text-2xl font-black text-amber-300">{certs.length}</div>
            <div className="text-[10px] text-slate-400">Verifiable QR</div>
          </div>
        </div>

        {/* Participating Colleges Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Participating Colleges & Universities ({Object.keys(collegeMap).length} Institutions)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(collegeMap).map(([coll, count]) => (
              <div key={coll} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 truncate max-w-xs">{coll}</span>
                <span className="font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {count} Participants
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Search, ShieldCheck, Download } from 'lucide-react';

export const SuperAdminAuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportAuditLogs = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Target Type', 'Target Name', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.actorName,
      l.actorRole,
      l.action,
      l.targetType,
      `"${l.targetName}"`,
      l.ipAddress || 'Internal',
      `"${l.details}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusnet-security-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              Compliance & Security
            </span>
            <span className="text-xs text-green-400 font-semibold">Immutable Append-Only Records</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            System-Wide Administrative Audit Logs ({filteredLogs.length})
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by action, actor, details..."
            className="w-full sm:w-64 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
          />

          <button
            onClick={exportAuditLogs}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3 text-right">IP / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-bold uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <div className="font-bold text-white">{log.actorName}</div>
                    <div className="text-[9.5px] text-slate-500">{log.actorRole}</div>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-300 max-w-xs truncate">
                    {log.targetName} ({log.targetType})
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-400 max-w-sm truncate">
                    {log.details}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {log.ipAddress || 'Internal TLS'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

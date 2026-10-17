import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import { 
  FileText, Search, ShieldCheck, Download, RefreshCw, 
  ShieldAlert, User, Clock, Filter, Activity, Lock,
  CheckCircle2, AlertTriangle, Eye, ArrowUpRight
} from 'lucide-react';

export const SuperAdminAuditLogsView: React.FC = () => {
  const { auditLogs: contextAuditLogs } = useApp();
  const [logs, setLogs] = useState<AuditLogEntry[]>(contextAuditLogs || []);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Live Audit Log Fetcher from Backend Engine
  const fetchLiveAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('campusnet_token') || localStorage.getItem('campusnet_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
          setLogs(data.auditLogs);
          setLastRefreshed(new Date());
        }
      }
    } catch (err) {
      console.warn('[AuditLogs] Live fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh timer (every 6 seconds)
  useEffect(() => {
    fetchLiveAuditLogs();
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveAuditLogs();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchLiveAuditLogs, autoRefresh]);

  // Sync if context updates
  useEffect(() => {
    if (contextAuditLogs && contextAuditLogs.length > 0) {
      setLogs(prev => {
        const existingIds = new Set(prev.map(l => l.id));
        const newFromContext = contextAuditLogs.filter(l => !existingIds.has(l.id));
        if (newFromContext.length > 0) {
          return [...newFromContext, ...prev];
        }
        return prev;
      });
    }
  }, [contextAuditLogs]);

  // Category Filtering Logic
  const getCategoryForAction = (action: string): string => {
    const act = (action || '').toUpperCase();
    if (act.includes('UNAUTHORIZED') || act.includes('SECURITY') || act.includes('SUSPENDED') || act.includes('DENIED') || act.includes('ATTEMPT')) {
      return 'SECURITY';
    }
    if (act.includes('LOGIN') || act.includes('OTP') || act.includes('AUTH') || act.includes('PASSWORD') || act.includes('REGISTRATION')) {
      return 'AUTH';
    }
    if (act.includes('PROJECT') || act.includes('TEAM') || act.includes('MILESTONE')) {
      return 'PROJECTS';
    }
    if (act.includes('EVENT') || act.includes('HACKATHON') || act.includes('REGISTRATION') || act.includes('CHECKIN')) {
      return 'EVENTS';
    }
    if (act.includes('MENTOR') || act.includes('RESEARCH') || act.includes('COLLAB')) {
      return 'RESEARCH_MENTOR';
    }
    if (act.includes('CERTIFICATE') || act.includes('VERIF') || act.includes('REVOKE')) {
      return 'CERTIFICATES';
    }
    return 'SYSTEM';
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        const cat = getCategoryForAction(log.action);
        if (cat !== selectedCategory) return false;
      }

      // Role filter
      if (selectedRole !== 'ALL') {
        const role = (log.actorRole || '').toUpperCase();
        if (selectedRole === 'STUDENT' && !role.includes('STUDENT')) return false;
        if (selectedRole === 'MENTOR' && !role.includes('MENTOR')) return false;
        if (selectedRole === 'RESEARCHER' && !role.includes('RESEARCH') && !role.includes('PHD')) return false;
        if (selectedRole === 'ORGANIZATION' && !role.includes('ORGANIZATION') && !role.includes('OWNER')) return false;
        if (selectedRole === 'REVIEWER' && !role.includes('REVIEWER')) return false;
        if (selectedRole === 'ADMIN' && !role.includes('ADMIN')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = (log.action || '').toLowerCase().includes(q);
        const matchesActor = (log.actorName || '').toLowerCase().includes(q);
        const matchesRole = (log.actorRole || '').toLowerCase().includes(q);
        const matchesDetails = (log.details || '').toLowerCase().includes(q);
        const matchesTarget = (log.targetName || '').toLowerCase().includes(q);
        const matchesIp = (log.ipAddress || '').toLowerCase().includes(q);
        return matchesAction || matchesActor || matchesRole || matchesDetails || matchesTarget || matchesIp;
      }

      return true;
    });
  }, [logs, selectedCategory, selectedRole, searchQuery]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = logs.length;
    const securityAlerts = logs.filter(l => getCategoryForAction(l.action) === 'SECURITY').length;
    const authLogins = logs.filter(l => (l.action || '').includes('LOGIN')).length;
    const projectActions = logs.filter(l => (l.action || '').includes('PROJECT')).length;
    return { total, securityAlerts, authLogins, projectActions };
  }, [logs]);

  // CSV Export
  const exportAuditLogs = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Target Type', 'Target Name', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.actorName || 'System'}"`,
      l.actorRole,
      l.action,
      l.targetType,
      `"${l.targetName || 'Platform'}"`,
      l.ipAddress || 'Internal TLS',
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusnet-audit-trail-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badge Style Helper
  const getActionBadge = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act.includes('UNAUTHORIZED') || act.includes('SECURITY') || act.includes('SUSPENDED')) {
      return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    }
    if (act.includes('LOGIN')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
    if (act.includes('PROJECT')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    if (act.includes('EVENT')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
    if (act.includes('CERTIFICATE')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
    if (act.includes('MENTOR') || act.includes('RESEARCH')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Real-Time Sync Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              Statutory Governance & Compliance
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Immutable Audit Feed
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Universal Platform Activity Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time, zero-trust audit trail tracking every single event performed across CampusNet by students, faculty mentors, researchers, institutions, and administrative accounts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 flex-wrap">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              autoRefresh 
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle automatic real-time feed updates"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{autoRefresh ? 'Live Feed: ON' : 'Live Feed: Paused'}</span>
          </button>

          <button
            onClick={fetchLiveAuditLogs}
            disabled={loading}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Force refresh audit records from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-campus-blue' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportAuditLogs}
            className="py-2 px-3.5 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-200 font-bold text-xs flex items-center gap-2 border border-red-500/30 transition-all cursor-pointer shadow-xs"
            title="Download verified audit logs in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Activities Logged</div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[10px] text-slate-500">Cross-platform operations</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Security Alerts Blocked</div>
          <div className="text-2xl font-black text-red-400 flex items-center gap-1.5">
            <span>{stats.securityAlerts}</span>
            {stats.securityAlerts > 0 && <AlertTriangle className="w-4 h-4 text-red-400" />}
          </div>
          <div className="text-[10px] text-red-300/80">Privilege & login defenses</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">User Authentications</div>
          <div className="text-2xl font-black text-blue-400">{stats.authLogins}</div>
          <div className="text-[10px] text-slate-500">OTP & verified sessions</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Project Operations</div>
          <div className="text-2xl font-black text-emerald-400">{stats.projectActions}</div>
          <div className="text-[10px] text-slate-500">Creations & team updates</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {[
            { id: 'ALL', label: 'All Activities' },
            { id: 'SECURITY', label: '🚨 Security Defenses' },
            { id: 'AUTH', label: '🔐 Auth & Logins' },
            { id: 'PROJECTS', label: '🚀 Projects & Teams' },
            { id: 'EVENTS', label: '🎯 Hackathons & Conclaves' },
            { id: 'RESEARCH_MENTOR', label: '🔬 Research & Mentorship' },
            { id: 'CERTIFICATES', label: '📜 Certificates & Audits' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Role Filter & Text Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Role:
            </span>
            {[
              { id: 'ALL', label: 'All Roles' },
              { id: 'STUDENT', label: 'Students' },
              { id: 'MENTOR', label: 'Mentors' },
              { id: 'RESEARCHER', label: 'Researchers' },
              { id: 'ORGANIZATION', label: 'Institutions' },
              { id: 'REVIEWER', label: 'Reviewers' },
              { id: 'ADMIN', label: 'Super Admins' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRole === r.id
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search actor, action, target, IP..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Logs Table Card */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Showing {filteredLogs.length} of {logs.length} logged platform activities</span>
          </div>
          <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action Event</th>
                <th className="px-4 py-3.5">Actor Identity</th>
                <th className="px-4 py-3.5">Target Entity</th>
                <th className="px-4 py-3.5">Event Details & Scope</th>
                <th className="px-4 py-3.5 text-right">Origin / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-sans">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-400">No platform activity logs matched your filter.</p>
                      <p className="text-xs text-slate-500">Try adjusting your category or search term.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isSecurityAlert = log.action.includes('UNAUTHORIZED') || log.action.includes('SECURITY') || log.action.includes('SUSPENDED');

                  return (
                    <tr 
                      key={log.id} 
                      className={`transition-colors ${
                        isSecurityAlert 
                          ? 'bg-red-950/20 hover:bg-red-950/30' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[10.5px]">
                        {new Date(log.timestamp).toLocaleString([], { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit' 
                        })}
                      </td>

                      {/* Action Event with color-coded badge */}
                      <td className="px-4 py-3 font-sans whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3 font-sans whitespace-nowrap">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{log.actorName || 'System'}</span>
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono">
                          {log.actorRole || 'PUBLIC'}
                        </div>
                      </td>

                      {/* Target */}
                      <td className="px-4 py-3 font-sans max-w-xs truncate">
                        <span className="font-semibold text-slate-200">{log.targetName || 'Platform'}</span>
                        <span className="text-[10px] text-slate-500 ml-1">({log.targetType || 'global'})</span>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3 font-sans text-slate-300 max-w-md">
                        <p className="line-clamp-2 leading-relaxed text-[11px]">
                          {log.details || 'System operation executed.'}
                        </p>
                      </td>

                      {/* IP / Origin */}
                      <td className="px-4 py-3 text-right font-mono text-[10.5px] text-slate-400 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                          {log.ipAddress || 'Internal TLS'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

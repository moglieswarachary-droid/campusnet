import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Search, Download, Filter, CheckCircle2, 
  Clock, XCircle, ShieldCheck, Mail, Phone, Building2 
} from 'lucide-react';
import { EventRegistrationItem } from '../../types';

export const ParticipantManagementView: React.FC = () => {
  const { eventRegistrations, events, updateRegistrationStatus, currentOrganizer } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRegistrations = eventRegistrations.filter(r => {
    const matchesEvent = selectedEventId === 'all' || r.eventId === selectedEventId;
    const matchesStatus = statusFilter === 'all' || r.registrationStatus === statusFilter;
    const matchesSearch = !searchQuery || 
      r.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.studentId && r.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.teamName && r.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Registration ID', 'Event', 'Participant Name', 'Student ID', 'Institution', 'Department', 'Email', 'Phone', 'Team Name', 'Reg Status', 'Attendance', 'Certificate ID'];
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.eventTitle,
      r.participantName,
      r.studentId,
      `"${r.institution}"`,
      r.department,
      r.email,
      r.phone,
      r.teamName || 'Individual',
      r.registrationStatus,
      r.attendanceStatus,
      r.certificateId || 'Pending'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusnet-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Participants & Team Rosters ({filteredRegistrations.length})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time verified student registrations across engineering colleges and universities in India.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-green-400" />
          <span>Export Registered CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Event selector */}
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
          >
            <option value="all">All Hosted Events</option>
            {orgEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student, college, ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Registrations Data Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Participant Details</th>
                <th className="px-4 py-3">College & ID</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Registration</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Certificate</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No participant registrations found for the selected query.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{reg.participantName}</div>
                      <div className="text-[10px] text-slate-400">{reg.email}</div>
                      <div className="text-[10px] text-slate-500">{reg.phone}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{reg.institution}</div>
                      <div className="text-[10.5px] font-mono text-amber-300">ID: {reg.studentId}</div>
                      <div className="text-[10px] text-slate-400">{reg.department}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                        {reg.teamName || 'Individual'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        reg.registrationStatus === 'confirmed' ? 'bg-green-950 text-green-300 border border-green-800' :
                        reg.registrationStatus === 'waitlisted' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {reg.registrationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {reg.attendanceStatus === 'checked_in' ? (
                        <div className="text-green-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Checked In</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-semibold">Registered</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {reg.certificateStatus === 'generated' ? (
                        <div className="text-amber-300 font-mono text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                          {reg.certificateId}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10.5px]">Pending</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {reg.registrationStatus !== 'confirmed' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'confirmed')}
                            className="p-1.5 rounded-lg bg-green-950 hover:bg-green-900 text-green-300 border border-green-800"
                            title="Confirm Registration"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {reg.registrationStatus !== 'waitlisted' && (
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'waitlisted')}
                            className="p-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800"
                            title="Move to Waitlist"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

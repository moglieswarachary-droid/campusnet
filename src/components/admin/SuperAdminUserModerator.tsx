import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Search, ShieldCheck, AlertTriangle, 
  CheckCircle2, XCircle, Mail, Building2, UserX 
} from 'lucide-react';

export const SuperAdminUserModerator: React.FC = () => {
  const { 
    students, mentors, researchers, 
    suspendUser, reactivateUser, verifyUser 
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'mentor' | 'researcher'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allUsers: { id: string; name: string; email: string; institution: string; role: string; verified: boolean; status: string }[] = [
    ...students.map(s => ({ id: s.id, name: s.name, email: s.email, institution: s.institution || 'Recognized Institute', role: 'Student', verified: !!s.verifiedStudent, status: s.status || 'active' })),
    ...mentors.map(m => ({ id: m.id, name: m.name, email: m.email, institution: m.institution || 'Recognized College', role: 'Faculty Mentor', verified: !!m.verifiedMentor, status: m.status || 'active' })),
    ...researchers.map(r => ({ id: r.id, name: r.name, email: r.email, institution: r.university || r.institution || 'Recognized University', role: 'PhD Scholar', verified: !!r.verifiedResearcher, status: r.status || 'active' }))
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase().includes(roleFilter);
    const matchesSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              National User Registry
            </span>
            <span className="text-xs text-slate-400">Account Moderation & Bonafide Status</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Student, Mentor & Scholar Moderation ({filteredUsers.length})
          </h2>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, college..."
          className="w-full sm:w-72 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
        />
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {[
          { id: 'all', label: 'All Users' },
          { id: 'student', label: 'Students' },
          { id: 'mentor', label: 'Mentors' },
          { id: 'researcher', label: 'PhD Scholars' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              roleFilter === tab.id
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">User Profile</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                  
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                    <div className="text-[9.5px] font-mono text-slate-500">ID: {user.id}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-300 font-semibold max-w-xs truncate">
                    {user.institution}
                  </td>

                  <td className="px-4 py-3">
                    {user.verified ? (
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Bonafide</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyUser(user.id)}
                        className="py-1 px-2 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[10px] font-bold"
                      >
                        Verify Bonafide
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'active' ? 'bg-green-950 text-green-300 border border-green-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => suspendUser(user.id)}
                        className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 font-bold text-xs"
                      >
                        Suspend Access
                      </button>
                    ) : (
                      <button
                        onClick={() => reactivateUser(user.id)}
                        className="py-1 px-2.5 rounded-lg bg-green-950 hover:bg-green-900 text-green-300 border border-green-800 font-bold text-xs"
                      >
                        Restore Access
                      </button>
                    )}
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

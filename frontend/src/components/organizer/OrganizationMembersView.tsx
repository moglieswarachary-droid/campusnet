import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, UserPlus, Shield, Mail, Phone, Trash2, CheckCircle2, 
  Clock, AlertCircle, Search, ShieldCheck, Award, Building2
} from 'lucide-react';

interface MemberItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'COORDINATOR' | 'EVENT_MANAGER' | 'FACULTY_LEAD' | 'JUDGE' | 'VOLUNTEER';
  department: string;
  assignedEventCount: number;
  status: 'active' | 'invited' | 'inactive';
  joinedDate: string;
}

export const OrganizationMembersView: React.FC = () => {
  const { currentOrganizer, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // New Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberItem['role']>('EVENT_MANAGER');
  const [inviteDepartment, setInviteDepartment] = useState('Computer Science & Engineering');

  // Demo initial members belonging to this institution
  const [members, setMembers] = useState<MemberItem[]>([
    {
      id: 'mem-001',
      name: currentOrganizer?.coordinatorName || 'Dr. Anand Kumar',
      email: currentOrganizer?.officialEmail || 'organizer.demo@campusnet-demo.in',
      phone: '+91 94432 10987',
      role: 'COORDINATOR',
      department: 'Dean - Innovation & Symposia',
      assignedEventCount: 2,
      status: 'active',
      joinedDate: 'Jan 2024'
    },
    {
      id: 'mem-002',
      name: 'Prof. Suresh Babu',
      email: 'suresh.babu@kec.ac.in',
      phone: '+91 98840 21455',
      role: 'EVENT_MANAGER',
      department: 'Computer Science & Engineering',
      assignedEventCount: 2,
      status: 'active',
      joinedDate: 'Mar 2024'
    },
    {
      id: 'mem-003',
      name: 'Dr. Radhika Nair',
      email: 'radhika.nair@kec.ac.in',
      phone: '+91 97712 34567',
      role: 'JUDGE',
      department: 'Electronics & Communication',
      assignedEventCount: 1,
      status: 'active',
      joinedDate: 'Aug 2024'
    },
    {
      id: 'mem-004',
      name: 'Karthik Raja',
      email: 'karthik.raja@campusnet.in',
      phone: '+91 91234 56789',
      role: 'VOLUNTEER',
      department: 'B.Tech CS (Student Volunteer Lead)',
      assignedEventCount: 1,
      status: 'active',
      joinedDate: 'Sep 2024'
    }
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      addToast({ type: 'error', message: 'Please provide both member name and institutional email.' });
      return;
    }

    const newMember: MemberItem = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: '+91 90000 00000',
      role: inviteRole,
      department: inviteDepartment,
      assignedEventCount: 0,
      status: 'invited',
      joinedDate: 'Just now'
    };

    setMembers(prev => [newMember, ...prev]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    addToast({ 
      type: 'success', 
      message: `Invitation dispatched to ${newMember.email} with role ${newMember.role}.` 
    });
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (members.find(m => m.id === id)?.role === 'COORDINATOR') {
      addToast({ type: 'error', message: 'Cannot remove primary institutional coordinator.' });
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast({ type: 'info', message: `Revoked organization access for ${name}.` });
  };

  const filteredMembers = members.filter(m => {
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: MemberItem['role']) => {
    switch (role) {
      case 'COORDINATOR':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'EVENT_MANAGER':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      case 'FACULTY_LEAD':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold';
      case 'JUDGE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
      case 'VOLUNTEER':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Authorized Institution Members & Leads
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage authorized faculty event conveners, judging panels, and student volunteers for {currentOrganizer?.institutionName || 'your college'}.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-amber-500"
          >
            <option value="all">All Roles</option>
            <option value="COORDINATOR">Coordinator (Owner)</option>
            <option value="EVENT_MANAGER">Event Manager</option>
            <option value="FACULTY_LEAD">Faculty Lead</option>
            <option value="JUDGE">Judge / Evaluator</option>
            <option value="VOLUNTEER">Student Volunteer</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Institutional Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Events</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{member.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {member.email}</span>
                      <span>•</span>
                      <span>{member.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full border ${getRoleBadge(member.role)}`}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {member.department}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-bold">
                    {member.assignedEventCount} Events
                  </td>
                  <td className="py-3.5 px-4">
                    {member.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Invited
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {member.role !== 'COORDINATOR' && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove member from institution workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Invite Organization Member</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College / Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="faculty@college.edu.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="EVENT_MANAGER">Event Manager (Full Event Operations)</option>
                  <option value="FACULTY_LEAD">Faculty Lead (Academic Review & Guidance)</option>
                  <option value="JUDGE">Judge / Evaluator (Scoring Portal Access)</option>
                  <option value="VOLUNTEER">Student Volunteer (QR Attendance Scanner Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={inviteDepartment}
                  onChange={(e) => setInviteDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

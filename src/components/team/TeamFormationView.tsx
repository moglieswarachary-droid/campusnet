import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Search, Filter, ShieldCheck, Plus, 
  ArrowRight, UserCheck, Check, Sparkles, Building2, BookOpen, UserPlus
} from 'lucide-react';
import { MOCK_DEPARTMENTS_LIST, MOCK_INSTITUTIONS_LIST } from '../../data/mockData';
import { User } from '../../types';

export const TeamFormationView: React.FC = () => {
  const { students, teams, currentUser, joinTeamRole, setActiveTab, createTeam, addToast } = useApp();
  
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newDomain, setNewDomain] = useState('Agriculture & IoT');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesDept = selectedDeptFilter === 'All' || s.department.toLowerCase().includes(selectedDeptFilter.toLowerCase());
    const matchesCollege = selectedCollegeFilter === 'All' || s.institution.toLowerCase().includes(selectedCollegeFilter.toLowerCase());
    const matchesSkill = !skillSearch || s.skills.some(sk => sk.toLowerCase().includes(skillSearch.toLowerCase())) || s.name.toLowerCase().includes(skillSearch.toLowerCase());
    return matchesDept && matchesCollege && matchesSkill;
  });

  const handleCreateNewTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createTeam({
      name: newTeamName,
      projectName: newProjectName || newTeamName + ' Initiative',
      domain: newDomain
    });
    setIsCreateTeamModalOpen(false);
    setNewTeamName('');
    setNewProjectName('');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-verified">
              <Users className="w-3.5 h-3.5" />
              Department-to-Department Matcher
            </span>
            <span className="text-xs text-campus-muted-text">Find Teammates Across Colleges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Find Your Multi-Disciplinary Team
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Need an ECE student for sensors, a Mechanical student for CAD, or a UI/UX designer? Recruit bonafide verified peers here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="campus-btn-red text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-warm-md"
          >
            <Plus className="w-4 h-4" />
            Create 6-Member Team
          </button>
        </div>
      </div>

      {/* Active Formed Teams Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-campus-deep-blue flex items-center gap-2">
            <span>Active Formed Teams on CampusNet</span>
            <span className="text-xs font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-full">
              {teams.length}
            </span>
          </h2>
          <button
            onClick={() => setActiveTab('workspace')}
            className="text-xs font-bold text-campus-blue hover:underline"
          >
            Enter My Team Workspace →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <div 
              key={team.id}
              className="p-6 rounded-3xl bg-white border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-md border border-blue-200">
                      {team.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {team.status === 'active' ? 'Active Team Workspace' : 'Forming Slots'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-campus-deep-blue mt-1">{team.name}</h3>
                  <p className="text-xs text-campus-muted-text">{team.projectName}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-campus-blue bg-campus-soft-blue px-2.5 py-1 rounded-xl">
                    {team.members.length} / {team.maxMembers} Members
                  </span>
                </div>
              </div>

              {/* Required Slots Grid */}
              <div className="space-y-2 pt-2 border-t border-campus-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-campus-muted-text">
                  6-Member Role Slot Distribution:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {team.requiredRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-xs border flex flex-col justify-between ${
                        role.filled 
                          ? 'bg-campus-warm-white border-campus-border text-campus-slate-text' 
                          : 'bg-red-50/50 border-dashed border-red-200 text-campus-red'
                      }`}
                    >
                      <div className="font-bold truncate text-[11.5px]">{role.role}</div>
                      <div className="text-[10px] text-campus-muted-text truncate mt-0.5">
                        {role.filled ? `✓ ${role.filledBy}` : `Seeking ${role.departmentHint}`}
                      </div>
                      {!role.filled && (
                        <button
                          onClick={() => joinTeamRole(team.id, idx, currentUser)}
                          className="mt-1.5 text-[10.5px] font-bold text-white bg-campus-red hover:bg-red-700 py-1 rounded-lg transition-colors"
                        >
                          Join Slot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-campus-border text-xs">
                <div className="text-campus-muted-text">
                  <strong>Mentor:</strong> {team.mentorName || 'Matching in progress...'}
                </div>

                <button
                  onClick={() => setActiveTab('workspace')}
                  className="font-bold text-campus-blue hover:text-campus-deep-blue flex items-center gap-1"
                >
                  Open Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Cross-Disciplinary Student Talent Directory */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-campus-deep-blue">
              Discover Bonafide Verified Students
            </h2>
            <p className="text-xs text-campus-muted-text">Filter across institutions and departments to recruit for open project slots.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-campus-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                placeholder="Search skills (e.g. PyTorch, PCB)..."
                className="pl-9 pr-3.5 py-1.5 text-xs bg-white rounded-xl border border-campus-border focus:border-campus-blue outline-none w-52 sm:w-64"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={e => setSelectedDeptFilter(e.target.value)}
              className="text-xs bg-white rounded-xl border border-campus-border px-3 py-1.5 focus:border-campus-blue outline-none max-w-xs"
            >
              <option value="All">All Departments</option>
              {MOCK_DEPARTMENTS_LIST.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div 
              key={student.id}
              className="bg-white rounded-3xl p-5 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-campus-border"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-campus-deep-blue">{student.name}</h3>
                      {student.verifiedStudent && (
                        <span className="campus-badge-verified text-[10px] py-0.5 px-1.5">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-campus-blue mt-0.5">{student.department}</p>
                    <p className="text-[11px] text-campus-muted-text mt-0.5">{student.institution.split('(')[0]}</p>
                  </div>
                </div>

                <p className="text-xs text-campus-slate-text/80 leading-relaxed line-clamp-2">
                  {student.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {student.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="text-[10.5px] font-semibold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-campus-border flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-campus-slate-text">Score: {student.innovationScore}</span>
                </div>

                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Team Invitation Dispatched',
                      message: `Invited ${student.name} to join your project workspace.`
                    });
                  }}
                  className="campus-btn-primary text-xs py-1.5 px-3 rounded-lg"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite to Team
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-warm-xl border border-campus-border space-y-4">
            <h3 className="text-lg font-bold text-campus-deep-blue">Create 6-Member Innovation Team</h3>
            <p className="text-xs text-campus-muted-text">
              Form a multi-disciplinary team ready for national hackathons and research mentor pairing.
            </p>

            <form onSubmit={handleCreateNewTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. AeroSwarm Robotics"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Project / Challenge Title
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="e.g. Autonomous Micro-UAV Forest Fire Early Warning"
                  className="w-full px-3.5 py-2 text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Domain
                </label>
                <select
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-campus-border rounded-xl focus:border-campus-blue outline-none bg-white"
                >
                  <option value="Agriculture & IoT">Agriculture & IoT</option>
                  <option value="Healthcare & Biomedical">Healthcare & Biomedical</option>
                  <option value="Clean Energy & Smart Grid">Clean Energy & Smart Grid</option>
                  <option value="Defense & Aerospace">Defense & Aerospace</option>
                  <option value="AI / NLP & Automation">AI / NLP & Automation</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs"
                >
                  Form Team & Open Slots
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

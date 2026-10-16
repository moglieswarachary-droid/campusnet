import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users, Search, Filter, ShieldCheck, Mail, BookOpen,
  Calendar, Video, MessageSquare, Award, CheckCircle2,
  Lock, Edit3, Save, ChevronRight, Star, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface MenteeNote {
  [studentId: string]: string;
}

export const MentorStudentsView: React.FC = () => {
  const navigate = useNavigate();
  const { teams, students, startVideoMeeting, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  // Private mentor notes stored locally
  const [privateNotes, setPrivateNotes] = useState<MenteeNote>(() => {
    try {
      const saved = localStorage.getItem('campusnet_mentor_private_notes');
      return saved ? JSON.parse(saved) : {
        'std-1': 'Strong in algorithm design. Needs encouragement on edge deployment benchmarking before SIH grand finale.',
        'std-2': 'Review ROS 2 telemetry nodes by Thursday. Suggested exploring Jetson Nano TensorRT engine.'
      };
    } catch {
      return {};
    }
  });

  const [currentNoteText, setCurrentNoteText] = useState('');

  // Extract all students belonging to guided teams
  const allMentees = teams.flatMap(team =>
    team.members.map(member => {
      const studentProfile = students.find(s => s.id === member.userId || s.name === member.name);
      return {
        id: member.userId || `std-${member.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: member.name,
        role: member.role,
        college: member.college || studentProfile?.institution || 'IIT Bombay',
        department: member.department || studentProfile?.department || 'Computer Science & Engineering',
        avatar: member.avatar || studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        teamName: team.name,
        teamId: team.id,
        domain: team.domain,
        projectName: team.projectName,
        verified: member.verified || studentProfile?.verifiedStudent || true,
        skills: studentProfile?.skills || ['Python', 'TensorFlow', 'Embedded C++'],
        innovationScore: studentProfile?.innovationScore || 785,
        email: member.email || studentProfile?.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`
      };
    })
  );

  // Deduplicate mentees by ID/Name
  const uniqueMentees = Array.from(
    new Map(allMentees.map(m => [m.name, m])).values()
  );

  const filteredMentees = uniqueMentees.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'All' || m.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(uniqueMentees.map(m => m.department)))];

  const handleOpenNotes = (studentId: string) => {
    setActiveStudentId(studentId);
    setCurrentNoteText(privateNotes[studentId] || '');
  };

  const handleSaveNote = (studentId: string) => {
    const updated = { ...privateNotes, [studentId]: currentNoteText };
    setPrivateNotes(updated);
    try {
      localStorage.setItem('campusnet_mentor_private_notes', JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
    addToast({
      type: 'success',
      message: 'Private mentorship notes saved securely. Visible only to you.'
    });
    setActiveStudentId(null);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                My Mentees
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                {uniqueMentees.length} Enrolled Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct student innovators under your academic mentorship, developmental tracking, and supervision
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/mentor/requests"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#12243A] text-xs font-bold transition-colors"
          >
            Review New Requests
          </Link>
          <Link
            to="/mentor/reviews"
            className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Milestone Reviews
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mentee by name, project, role, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F9488] text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Department:</span>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F9488]"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mentees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentees.map(mentee => (
          <div
            key={mentee.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-warm-sm hover:border-teal-200 transition-all flex flex-col justify-between space-y-4"
          >
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={mentee.avatar}
                      alt={mentee.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    {mentee.verified && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0F9488] rounded-full ring-2 ring-white flex items-center justify-center text-[7px] text-white font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#12243A] leading-snug">{mentee.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{mentee.role}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{mentee.college}</p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-[#0F9488] border border-teal-200/60">
                  Score {mentee.innovationScore}
                </span>
              </div>

              {/* Team affiliation badge */}
              <div className="p-2.5 rounded-xl bg-[#F3F6FA] border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#12243A]">{mentee.teamName}</span>
                  <span className="text-[9.5px] font-bold text-[#0F9488] bg-white px-2 py-0.5 rounded-md border border-teal-100">
                    {mentee.domain}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{mentee.projectName}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {mentee.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-[9.5px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Private Notes Preview */}
              {privateNotes[mentee.id] && (
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-2 italic text-[10.5px]">
                    "{privateNotes[mentee.id]}"
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenNotes(mentee.id)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Private mentor notes (not visible to student)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Notes</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startVideoMeeting(mentee.teamId)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[#0F9488] text-slate-600 transition-colors"
                  title="Launch instant 1-on-1 meeting"
                >
                  <Video className="w-4 h-4" />
                </button>
                <Link
                  to="/mentor/messages"
                  className="px-3 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMentees.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">No mentees match your criteria</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter selection.</p>
        </div>
      )}

      {/* Private Mentor Notes Modal */}
      {activeStudentId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#12243A]">Private Mentoring Notes</h3>
                  <p className="text-[10px] text-slate-400">Strictly confidential to faculty mentor</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Evaluation & Development Goals
              </label>
              <textarea
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Record strengths, weak areas, recommended research papers, or upcoming deadlines..."
                rows={5}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0F9488] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">
                These notes are never shared with students, teams, or external reviewers.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveStudentId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNote(activeStudentId)}
                className="px-4 py-2 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Private Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

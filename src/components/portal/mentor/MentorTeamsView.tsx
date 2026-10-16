import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users, Video, ArrowRight, ShieldCheck, CheckCircle2,
  Calendar, Award, MessageSquare, ExternalLink, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MentorTeamsView: React.FC = () => {
  const { teams, projects, startVideoMeeting } = useApp();

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Guided Innovation Teams
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                {teams.length} Active Cohorts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Collegiate teams under your academic guidance for national hackathons, capstones, and publications
            </p>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map(team => {
          const project = projects.find(p => p.teamId === team.id || p.title.toLowerCase().includes(team.projectName.toLowerCase())) || projects[0];

          return (
            <div
              key={team.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-teal-200 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#0F9488] bg-teal-50 px-2 py-0.5 rounded">
                    {team.domain}
                  </span>
                  <h3 className="text-base font-bold text-[#12243A] mt-1.5">{team.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{team.projectName}</p>
                </div>

                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Active Guidance
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Sprint Deliverables</span>
                  <span className="text-[#0F9488]">{project?.progressPercent || 82}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F9488] rounded-full"
                    style={{ width: `${project?.progressPercent || 82}%` }}
                  />
                </div>
              </div>

              {/* Student Roster */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Team Roster:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {team.members.map(m => (
                    <div key={m.userId} className="flex items-center gap-2 p-1.5 bg-[#F3F6FA] rounded-xl border border-slate-200/60">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-[11px] truncate">{m.name}</p>
                        <p className="text-[9.5px] text-slate-400 truncate">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to="/mentor/reviews"
                  className="text-xs font-bold text-[#0F9488] hover:underline flex items-center gap-1"
                >
                  <span>Review Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => startVideoMeeting(team.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Sync</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

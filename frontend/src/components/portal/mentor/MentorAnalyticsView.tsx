import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp, Award, Users, CheckCircle2, Clock, ShieldCheck,
  Calendar, Star, Activity, ArrowUpRight
} from 'lucide-react';

export const MentorAnalyticsView: React.FC = () => {
  const { teams, projects, mentorshipRequests, mentorshipCertificates } = useApp();

  const totalStudentsGuided = teams.reduce((acc, t) => acc + (t.members?.length || 4), 0);
  const pendingRequests = mentorshipRequests.filter(r => r.status === 'pending').length;
  const acceptedRequests = mentorshipRequests.filter(r => r.status === 'accepted').length;

  const kpis = [
    { label: 'Active Guided Teams', value: teams.length, change: '+2 this term', positive: true },
    { label: 'Total Collegiate Mentees', value: totalStudentsGuided, change: '100% attendance', positive: true },
    { label: 'Certificates Endorsed', value: mentorshipCertificates.length, change: 'Verified bonafide', positive: true },
    { label: 'Avg Review Turnaround', value: '2.4 Days', change: 'Top 5% Faculty Response', positive: true },
  ];

  const domainBreakdown = [
    { domain: 'Autonomous Systems & Robotics', count: 3, percentage: 45 },
    { domain: 'Edge AI & Computer Vision', count: 2, percentage: 30 },
    { domain: 'Distributed Cloud Systems', count: 1, percentage: 15 },
    { domain: 'Wearable Health IoT', count: 1, percentage: 10 },
  ];

  const milestoneVelocity = [
    { stage: 'Phase 1: Problem Definition & Architecture', completion: 100, status: 'Completed' },
    { stage: 'Phase 2: Hardware Prototype & Quantization', completion: 82, status: 'In Progress' },
    { stage: 'Phase 3: Real-Time Field Telemetry Validation', completion: 45, status: 'Underway' },
    { stage: 'Phase 4: Patent / Publication & Finale Demo', completion: 20, status: 'Upcoming' },
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#12243A]">
                Mentorship Analytics & Advisory Impact
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-[#0F9488]">
                Spring 2026 Reporting Cycle
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time audit of student milestone progress, faculty turnaround velocity, and collegiate project completions
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {kpi.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#12243A]">
              {kpi.value}
            </div>
            <span className="text-[10px] font-bold text-[#0F9488] block">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Analytics Grid: Domain Distribution & Milestone Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Domain Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Technology Spectrum
            </span>
            <h3 className="text-base font-bold text-[#12243A] mt-0.5">Mentored Domains & Focus Areas</h3>
          </div>

          <div className="space-y-4">
            {domainBreakdown.map(d => (
              <div key={d.domain} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{d.domain}</span>
                  <span className="font-bold text-[#12243A]">{d.percentage}% ({d.count} Teams)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F9488] rounded-full" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Velocity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Sprint Deliverable Velocity
              </span>
              <h3 className="text-base font-bold text-[#12243A] mt-0.5">Capstone Lifecycle Completion</h3>
            </div>
            <span className="text-xs font-bold text-[#0F9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              On Schedule
            </span>
          </div>

          <div className="space-y-4">
            {milestoneVelocity.map(m => (
              <div key={m.stage} className="p-3.5 rounded-xl border border-slate-100 bg-[#F3F6FA] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#12243A]">{m.stage}</span>
                  <span className="font-extrabold text-[#0F9488]">{m.completion}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F9488] rounded-full" style={{ width: `${m.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

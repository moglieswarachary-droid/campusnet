import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, TrendingUp, Users, Building2, 
  MapPin, Award, PieChart, ShieldCheck 
} from 'lucide-react';
import { MOCK_INDIAN_STATES } from '../../data/mockData';

export const SuperAdminAnalyticsView: React.FC = () => {
  const { students, mentors, researchers, institutions, events, certificates } = useApp();

  const stateData = [
    { state: 'Karnataka', students: 48, mentors: 14, events: 4 },
    { state: 'Maharashtra', students: 42, mentors: 12, events: 3 },
    { state: 'Andhra Pradesh', students: 38, mentors: 9, events: 3 },
    { state: 'Tamil Nadu', students: 34, mentors: 8, events: 2 },
    { state: 'Delhi-NCR', students: 29, mentors: 7, events: 2 },
    { state: 'Telangana', students: 26, mentors: 6, events: 2 },
    { state: 'Gujarat', students: 22, mentors: 5, events: 1 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
            National Innovation Intelligence
          </span>
          <span className="text-xs text-slate-400">All India Engineering & Research Growth</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          National Ecosystem Analytics & Regional Metrics
        </h2>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold">
            <span>Inter-College Cross Collaborations</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-black text-white">74.2%</div>
          <p className="text-[11px] text-slate-400">
            Of teams feature students from 2+ distinct institutions.
          </p>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold">
            <span>Faculty Mentorship Conversion</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">91.8%</div>
          <p className="text-[11px] text-slate-400">
            Teams receive authenticated guidance from verified professors.
          </p>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold">
            <span>Verifiable Credential Trust</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">100%</div>
          <p className="text-[11px] text-slate-400">
            Zero counterfeit certificates with tamper-proof QR blockchain validation.
          </p>
        </div>
      </div>

      {/* Regional State-wise Distribution Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          State-Wise Innovation & Event Activity Heatmap
        </h3>

        <div className="space-y-3">
          {stateData.map(st => (
            <div key={st.state} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{st.state}</span>
                <div className="flex items-center gap-4 text-slate-400 font-semibold">
                  <span>{st.students} Active Students</span>
                  <span>{st.mentors} Mentors</span>
                  <span className="text-amber-300 font-bold">{st.events} Hackathons</span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${(st.students / 50) * 60}%` }} />
                <div className="bg-green-500 h-full" style={{ width: `${(st.mentors / 15) * 20}%` }} />
                <div className="bg-amber-500 h-full" style={{ width: `${(st.events / 5) * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

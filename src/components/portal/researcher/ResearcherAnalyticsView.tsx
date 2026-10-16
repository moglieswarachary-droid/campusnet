import React from 'react';
import { useApp } from '../../../context/AppContext';
import { TrendingUp, FileText, Award, Users, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

export const ResearcherAnalyticsView: React.FC = () => {
  const { publications, researchers, currentUser } = useApp();
  const currentScholar = researchers.find(r => r.email === currentUser?.email) || researchers[0];

  const totalCitations = publications.reduce((acc, p) => acc + (p.citations || 0), 0) + (currentScholar.citationsCount || 142);

  const domainDistribution = [
    { domain: 'Neuromorphic Graph Computing', percentage: 45, papers: 3 },
    { domain: 'Edge Vision & TensorRT Optimization', percentage: 30, papers: 2 },
    { domain: 'Federated Clinical Signal Learning', percentage: 25, papers: 1 }
  ];

  const citationTimeline = [
    { year: '2023', citations: 24 },
    { year: '2024', citations: 48 },
    { year: '2025', citations: 86 },
    { year: '2026 (YTD)', citations: totalCitations }
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
              Research Analytics & Bibliometrics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Citation growth trends, publication domain velocity, grant milestone SLAs, and international collaboration index
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Scholarly Impact</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#182442]">{totalCitations}</span>
            <span className="text-xs font-bold text-emerald-600">+22% YoY</span>
          </div>
          <p className="text-xs text-slate-500">h-index: {currentScholar.hIndex || 6} • i10-index: 4</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Milestone SLA Velocity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#13877B]">94.2%</span>
            <span className="text-xs font-bold text-slate-400">On-time</span>
          </div>
          <p className="text-xs text-slate-500">Avg. journal revision turnaround: 18 days</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Open-Access Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#6954C8]">83%</span>
            <span className="text-xs font-bold text-purple-700">CC-BY 4.0</span>
          </div>
          <p className="text-xs text-slate-500">5 papers accompanied by Zenodo open datasets</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Domain Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-[#182442]">Research Domain Distribution</h3>
          <div className="space-y-3">
            {domainDistribution.map(item => (
              <div key={item.domain} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{item.domain}</span>
                  <span className="text-[#6954C8]">{item.percentage}% ({item.papers} papers)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6954C8] rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citation Progression */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-[#182442]">Citation Growth Progression</h3>
          <div className="space-y-3">
            {citationTimeline.map(item => (
              <div key={item.year} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{item.year}</span>
                  <span className="text-[#13877B]">{item.citations} Citations</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#13877B] rounded-full" style={{ width: `${Math.min(100, (item.citations / totalCitations) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

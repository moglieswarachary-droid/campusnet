import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderKanban, Users, Cpu, ArrowRight, GitFork, Heart, Sparkles } from 'lucide-react';

export const ProjectsExplorerSection: React.FC = () => {
  const { projects, setActiveTab, setSelectedProjectId } = useApp();
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domains = ['All', 'Agriculture & IoT', 'Healthcare & Biomedical', 'Clean Energy & Smart Grid', 'Defense & Aerospace'];

  const filteredProjects = selectedDomain === 'All' 
    ? projects 
    : projects.filter(p => p.domain.toLowerCase().includes(selectedDomain.toLowerCase()));

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200 mb-2">
              <FolderKanban className="w-3.5 h-3.5" />
              Interdisciplinary Innovation Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-campus-deep-blue">
              Explore Active Student Projects
            </h2>
            <p className="text-sm text-campus-muted-text mt-1">
              Follow open projects from Idea to Published hardware/software solutions across top universities.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-campus-blue hover:underline"
          >
            Explore All Projects
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDomain === d
                  ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                  : 'bg-campus-warm-white text-campus-slate-text hover:bg-campus-soft-blue border border-campus-border'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map(p => (
            <div 
              key={p.id}
              className="p-6 rounded-3xl bg-campus-warm-white/70 border border-campus-border hover:border-campus-blue shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-2.5 py-1 rounded-lg border border-blue-200">
                    {p.domain}
                  </span>
                  
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    p.status === 'Completed' || p.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : p.status === 'Testing' || p.status === 'Prototype'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {p.status} ({p.progressPercent}%)
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-campus-deep-blue">
                  {p.title}
                </h3>

                <p className="text-xs text-campus-slate-text/80 leading-relaxed line-clamp-3">
                  {p.problemStatement}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="text-[11px] bg-white border border-campus-border px-2 py-0.5 rounded-md font-medium text-campus-muted-text">
                      {tech}
                    </span>
                  ))}
                  {p.technologies.length > 4 && (
                    <span className="text-[11px] text-campus-muted-text self-center">
                      +{p.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-campus-border/80 flex items-center justify-between text-xs">
                <div className="text-campus-muted-text">
                  <span className="font-semibold text-campus-slate-text">{p.teamMembersCount} Members</span> • {p.institution.split('(')[0]}
                </div>

                <button
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setActiveTab('projects');
                  }}
                  className="font-bold text-campus-blue hover:text-campus-deep-blue flex items-center gap-1"
                >
                  View Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

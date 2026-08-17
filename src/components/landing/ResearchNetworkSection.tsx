import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Sparkles, FileText, ArrowRight, ShieldCheck, Database, GraduationCap } from 'lucide-react';

export const ResearchNetworkSection: React.FC = () => {
  const { researchers, publications, setActiveTab } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-campus-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              PhD Scholars & Academic Publications
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              The CampusLink Research Hub
            </h2>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Connecting doctoral candidates, research labs, and undergraduate engineering innovators for co-authoring papers, open datasets, and translational research.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('research')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 hover:text-white transition-colors"
          >
            Explore Research Hub
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid: Featured Publications & PhD Researchers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Publications column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Recent Peer-Reviewed Preprints & Papers
            </h3>

            {publications.map(pub => (
              <div 
                key={pub.id}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="text-amber-300 font-semibold">{pub.journal} ({pub.year})</span>
                  <span>DOI: {pub.doi}</span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">
                  {pub.title}
                </h4>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {pub.abstract}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <div className="text-gray-300">
                    <strong>Authors:</strong> {pub.authors.join(', ')}
                  </div>
                  <span className="text-green-400 font-bold bg-green-950/60 border border-green-800/40 px-2 py-0.5 rounded-full">
                    {pub.citations} Citations
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PhD Scholars column (1 col) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Active PhD Scholars Open for Collab
            </h3>

            {researchers.map(res => (
              <div 
                key={res.id}
                className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={res.avatar}
                    alt={res.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-white">{res.name}</h4>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                        PhD
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{res.university.split('(')[0]}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 font-semibold block text-[11px]">Research Area:</span>
                  {res.researchArea}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400">{res.publicationsCount} Publications • h-index: {res.hIndex}</span>
                  <button
                    onClick={() => setActiveTab('research')}
                    className="text-xs font-bold text-amber-300 hover:underline"
                  >
                    Request Collab →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

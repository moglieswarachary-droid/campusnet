import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, Sparkles, FileText, Database, ShieldCheck, 
  Search, Plus, ArrowRight, ExternalLink, MessageSquare 
} from 'lucide-react';
import { Researcher, ResearchPublication } from '../../types';

export const ResearchHubView: React.FC = () => {
  const { researchers, publications, currentUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'scholars' | 'publications' | 'datasets'>('scholars');
  const [searchQuery, setSearchQuery] = useState('');
  const [collabModalScholar, setCollabModalScholar] = useState<Researcher | null>(null);
  const [collabMessage, setCollabMessage] = useState('');

  const filteredScholars = researchers.filter(r => 
    !searchQuery || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.researchArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublications = publications.filter(p => 
    !searchQuery || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendCollabRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabModalScholar) return;
    addToast({
      type: 'success',
      title: 'Collaboration Request Dispatched',
      message: `Sent research collaboration inquiry to ${collabModalScholar.name} (${collabModalScholar.university.split('(')[0]}).`
    });
    setCollabModalScholar(null);
    setCollabMessage('');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-verified">
              <BookOpen className="w-3.5 h-3.5" />
              Doctoral & Translational Research Network
            </span>
            <span className="text-xs text-campus-muted-text">PhD Scholars & Labs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Academic Research & Open Publications Hub
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Connect with PhD scholars, explore peer-reviewed preprints, access open benchmark datasets, and initiate joint research papers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Add Research Preprint',
                message: 'Preprint publication submission form opened.'
              });
            }}
            className="campus-btn-primary text-xs sm:text-sm py-2.5 px-4 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Publish Preprint / Dataset
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-campus-border shadow-warm-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scholars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scholars' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-campus-warm-white'
            }`}
          >
            PhD Scholars ({researchers.length})
          </button>
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'publications' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-campus-warm-white'
            }`}
          >
            Research Papers ({publications.length})
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'datasets' ? 'bg-campus-deep-blue text-white shadow-warm-sm' : 'text-campus-slate-text hover:bg-campus-warm-white'
            }`}
          >
            Open Datasets (3)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search research areas, scholars, DOIs..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
          />
        </div>
      </div>

      {/* Tab 1: PhD Scholars Directory */}
      {activeTab === 'scholars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholars.map(scholar => (
            <div 
              key={scholar.id}
              className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <img
                    src={scholar.avatar}
                    alt={scholar.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-1 ring-campus-border flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-campus-deep-blue">{scholar.name}</h3>
                      <span className="campus-badge-verified text-[10px] py-0.5 px-1.5">
                        Verified PhD
                      </span>
                    </div>
                    <p className="text-xs text-campus-muted-text mt-0.5">{scholar.department}</p>
                    <p className="text-xs font-semibold text-campus-blue mt-0.5">{scholar.university}</p>
                    <p className="text-[11px] text-campus-muted-text font-mono mt-1">Scholar ID: {scholar.scholarId}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-campus-warm-white border border-campus-border text-xs space-y-1">
                  <div><strong>Research Guide:</strong> {scholar.guide}</div>
                  <div><strong>Focus Area:</strong> {scholar.researchArea}</div>
                </div>

                <p className="text-xs text-campus-slate-text/80 leading-relaxed">
                  {scholar.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scholar.interests.map((int, i) => (
                    <span key={i} className="text-[10.5px] font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-md">
                      {int}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-campus-border flex items-center justify-between text-xs">
                <div className="space-x-3 text-campus-muted-text font-semibold">
                  <span>{scholar.publicationsCount} Papers</span>
                  <span>•</span>
                  <span>{scholar.citationsCount} Citations</span>
                  <span>•</span>
                  <span>h-index: {scholar.hIndex}</span>
                </div>

                <button
                  onClick={() => setCollabModalScholar(scholar)}
                  className="campus-btn-red text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Request Collaboration
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Publications */}
      {activeTab === 'publications' && (
        <div className="space-y-4">
          {filteredPublications.map(pub => (
            <div 
              key={pub.id}
              className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-campus-red">{pub.journal} • {pub.year}</span>
                <span className="font-mono text-campus-muted-text">DOI: {pub.doi}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-campus-deep-blue">
                {pub.title}
              </h3>

              <p className="text-xs sm:text-sm text-campus-slate-text/80 leading-relaxed">
                {pub.abstract}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-campus-border text-xs">
                <div className="text-campus-muted-text">
                  <strong>Authors:</strong> {pub.authors.join(', ')}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {pub.citations} Citations
                  </span>
                  {pub.datasetLink && (
                    <a
                      href={pub.datasetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-campus-blue hover:underline flex items-center gap-1"
                    >
                      <Database className="w-3.5 h-3.5" />
                      View Dataset
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Open Datasets */}
      {activeTab === 'datasets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-campus-border shadow-warm-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-campus-deep-blue">IndianAgri-Pest-10K Dataset</h3>
            <p className="text-xs text-campus-muted-text leading-relaxed">
              10,480 annotated hyperspectral drone imagery samples of pest foliar damage across Karnataka sugarcane crops.
            </p>
            <div className="pt-2 text-xs font-bold text-campus-blue">
              Downloads: 1,420 • CC-BY-4.0
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-campus-border shadow-warm-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-campus-deep-blue">OpenMIMI-Federated-ECG</h3>
            <p className="text-xs text-campus-muted-text leading-relaxed">
              Multi-site clinical electrocardiogram telemetry vectors with synthetic differential privacy noise.
            </p>
            <div className="pt-2 text-xs font-bold text-campus-blue">
              Downloads: 890 • Open Academic
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-campus-border shadow-warm-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-campus-soft-blue text-campus-blue flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-campus-deep-blue">ThermalCycler-EV-NMC-2025</h3>
            <p className="text-xs text-campus-muted-text leading-relaxed">
              High-temperature lithium cell thermal degradation curves under 48°C Indian ambient conditions.
            </p>
            <div className="pt-2 text-xs font-bold text-campus-blue">
              Downloads: 620 • IIT Delhi Lab
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Request Modal */}
      {collabModalScholar && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-warm-xl border border-campus-border space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-campus-deep-blue">
              Research Collaboration with {collabModalScholar.name}
            </h3>
            <p className="text-xs text-campus-muted-text">
              Propose co-authoring a paper, sharing a testbed dataset, or cross-institutional validation.
            </p>

            <form onSubmit={handleSendCollabRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Proposed Research Topic / Collaboration Scope
                </label>
                <textarea
                  rows={4}
                  value={collabMessage}
                  onChange={e => setCollabMessage(e.target.value)}
                  placeholder="Explain your research methodology, existing prototype, or dataset access request..."
                  className="w-full p-3 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollabModalScholar(null)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs"
                >
                  Dispatch Collaboration Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

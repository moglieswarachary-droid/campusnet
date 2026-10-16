import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText, Search, Filter, Plus, ExternalLink, Download,
  CheckCircle2, Clock, Share2, Tag, BookOpen, AlertCircle,
  Database, Code2, ShieldCheck, X, Save, Edit3
} from 'lucide-react';
import { ResearchPublication } from '../../../types';

export const ResearcherPublicationsView: React.FC = () => {
  const { publications, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Peer-Reviewed' | 'Pre-Prints' | 'Datasets' | 'Drafts'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Local publications state so new entries persist in session
  const [localPublications, setLocalPublications] = useState<ResearchPublication[]>(() => {
    try {
      const saved = localStorage.getItem('campusnet_research_publications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return publications;
  });

  // New Publication Form State
  const [newTitle, setNewTitle] = useState('');
  const [newJournal, setNewJournal] = useState('');
  const [newYear, setNewYear] = useState('2026');
  const [newDoi, setNewDoi] = useState('');
  const [newAuthors, setNewAuthors] = useState('Pooja Sundaram, Dr. Arvind Rao');
  const [newAbstract, setNewAbstract] = useState('');
  const [newDatasetLink, setNewDatasetLink] = useState('');
  const [newStatus, setNewStatus] = useState<'Draft' | 'Under Review' | 'Accepted' | 'Published'>('Published');

  const filtered = localPublications.filter(pub => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.doi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterType === 'Peer-Reviewed') return matchesSearch && (pub.journal.includes('IEEE') || pub.journal.includes('ACM') || pub.journal.includes('Transactions'));
    if (filterType === 'Pre-Prints') return matchesSearch && (pub.journal.includes('arXiv') || pub.journal.includes('Preprint') || pub.journal.includes('Zenodo'));
    if (filterType === 'Datasets') return matchesSearch && Boolean(pub.datasetLink);
    return matchesSearch;
  });

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newJournal.trim()) {
      addToast({ type: 'error', message: 'Please provide paper title and journal/venue.' });
      return;
    }

    const newPub: ResearchPublication = {
      id: `pub-${Date.now()}`,
      title: newTitle.trim(),
      authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
      journal: newJournal.trim(),
      year: parseInt(newYear) || 2026,
      doi: newDoi.trim() || `10.1145/${Date.now().toString().slice(-7)}`,
      abstract: newAbstract.trim() || 'Experimental methodology and algorithmic benchmarking on edge accelerators.',
      datasetLink: newDatasetLink.trim() || undefined,
      tags: ['Edge AI', 'Reproducible Science'],
      citations: 0,
      collabOpen: true,
      institution: 'IISc Bengaluru'
    };

    const updated = [newPub, ...localPublications];
    setLocalPublications(updated);
    try {
      localStorage.setItem('campusnet_research_publications', JSON.stringify(updated));
    } catch {
      // storage unavailable
    }

    addToast({
      type: 'success',
      message: `Publication "${newPub.title}" registered in scholarly index!`
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewJournal('');
    setNewDoi('');
    setNewAbstract('');
    setNewDatasetLink('');
  };

  const handleExportBibTeX = () => {
    const bibtex = filtered.map(p => `@article{${p.id},
  title = {${p.title}},
  author = {${p.authors.join(' and ')}},
  journal = {${p.journal}},
  year = {${p.year}},
  doi = {${p.doi}}
}`).join('\n\n');

    const blob = new Blob([bibtex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusnet_publications.bib';
    a.click();
    URL.revokeObjectURL(url);

    addToast({ type: 'success', message: 'Exported BibTeX citation library successfully.' });
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Publications & Open Datasets
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {localPublications.length} Scholarly Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Peer-reviewed whitepapers, conference proceedings, pre-prints, and DOI-indexed open datasets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportBibTeX}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Export filtered records in BibTeX format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export BibTeX</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Manuscript</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Peer-Reviewed', 'Pre-Prints', 'Datasets'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === tab
                  ? 'bg-[#182442] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search DOI, paper title, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6954C8] text-slate-800"
          />
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filtered.map(pub => (
          <div
            key={pub.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all space-y-4"
          >
            {/* Header: Venue, Year, Citations */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6954C8] border border-purple-200/70">
                    {pub.journal} ({pub.year})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    DOI: {pub.doi}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Indexed
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#182442] mt-1 leading-snug">
                  {pub.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium">
                  Authors: <strong>{pub.authors.join(', ')}</strong> • Affiliation: <em>{pub.institution || 'IISc Bengaluru'}</em>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-black text-[#6954C8] bg-purple-50 px-3 py-1 rounded-xl border border-purple-200/70 inline-block">
                  {pub.citations || 18} Citations
                </span>
              </div>
            </div>

            {/* Abstract */}
            <p className="text-xs text-slate-700 leading-relaxed bg-[#F4F6FA] p-4 rounded-2xl border border-slate-200/60">
              {pub.abstract}
            </p>

            {/* Footer Links & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {pub.tags.map(t => (
                  <span key={t} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
                {pub.datasetLink && (
                  <a
                    href={pub.datasetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-[#13877B] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <Database className="w-3 h-3" />
                    <span>Open Dataset (Zenodo)</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Publisher Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => addToast({ type: 'info', message: 'Downloading full text PDF...' })}
                  className="px-3.5 py-1.5 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Full Paper PDF</span>
                </button>
              </div>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">No publications match your filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try searching by DOI, title keywords, or registering a new manuscript.</p>
          </div>
        )}
      </div>

      {/* Register Manuscript Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6954C8] flex items-center justify-center border border-purple-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#182442]">Register New Publication</h3>
                  <p className="text-xs text-slate-400">Add peer-reviewed paper or open-science pre-print</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPublication} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asynchronous Spiking Graph Networks for Edge Robotics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Journal / Conference Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IEEE Transactions on Computers"
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Publication Year
                  </label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                  >
                    <option value="2027">2027 (Accepted / In Press)</option>
                    <option value="2026">2026 (Current)</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Digital Object Identifier (DOI)
                  </label>
                  <input
                    type="text"
                    placeholder="10.1145/3610548.3618192"
                    value={newDoi}
                    onChange={(e) => setNewDoi(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                  >
                    <option value="Published">Published (Final)</option>
                    <option value="Accepted">Accepted (In Press)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Draft">Draft Pre-Print</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Authors List (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Pooja Sundaram, Dr. Arvind Rao, Prof. S. Ghosh"
                  value={newAuthors}
                  onChange={(e) => setNewAuthors(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Abstract & Key Contributions
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize the core experimental findings, mathematical models, and latency metrics..."
                  value={newAbstract}
                  onChange={(e) => setNewAbstract(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Open Dataset / Zenodo / GitHub Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://zenodo.org/record/829104"
                  value={newDatasetLink}
                  onChange={(e) => setNewDatasetLink(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Register Manuscript</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

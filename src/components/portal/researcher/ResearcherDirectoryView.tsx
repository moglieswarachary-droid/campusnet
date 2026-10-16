import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Globe2, Search, Filter, Mail, Video, Users,
  BookOpen, ExternalLink, CheckCircle2, Award, Building2
} from 'lucide-react';

export const ResearcherDirectoryView: React.FC = () => {
  const { researchers, addToast, startVideoMeeting } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');

  // Augmented directory list
  const directoryList = [
    ...researchers,
    {
      id: 'r-ext-1',
      name: 'Dr. Priya Balasubramanian',
      email: 'priya.b@iitm.ac.in',
      scholarId: 'IITM-EE-2022',
      university: 'IIT Madras',
      institution: 'IIT Madras',
      department: 'Electrical Engineering & Quantum Computing',
      researchArea: 'Superconducting Qubits & Cryogenic Control',
      interests: ['Quantum Error Correction', 'Cryogenic CMOS', 'RF Microwave'],
      guide: 'Prof. R. David',
      publicationsCount: 14,
      citationsCount: 320,
      hIndex: 9,
      datasets: ['Zenodo #91024'],
      verifiedResearcher: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      openForCollab: true,
      bio: 'Leading experimental investigations into silicon spin qubits with international consortia.'
    },
    {
      id: 'r-ext-2',
      name: 'Vikramaditya Rathore',
      email: 'vikram.r@tifr.res.in',
      scholarId: 'TIFR-PHYS-2023',
      university: 'Tata Institute of Fundamental Research (TIFR)',
      institution: 'TIFR Mumbai',
      department: 'Department of High Energy Physics',
      researchArea: 'LHC Particle Jet Reconstruction & GNNs',
      interests: ['High Energy Physics', 'Graph Neural Networks', 'CERN ROOT'],
      guide: 'Dr. A. K. Banerjee',
      publicationsCount: 8,
      citationsCount: 185,
      hIndex: 7,
      datasets: ['CERN Open Data'],
      verifiedResearcher: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      openForCollab: true,
      bio: 'Doctoral fellow at CMS Experiment CERN, Geneva. Focus on low-latency trigger GNNs on FPGA.'
    }
  ];

  const filtered = directoryList.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.researchArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'All' || r.researchArea.includes(domainFilter);
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Globe2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Global Researcher Directory
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6954C8]">
                {directoryList.length} Verified Scholars
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Connect with doctoral fellows, faculty research chairs, and lab directors across premier international universities
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholar by name, institution, research field, or methodology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8] text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Specialization:</span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-[#6954C8]"
          >
            <option value="All">All Domains</option>
            <option value="Neuromorphic">Neuromorphic</option>
            <option value="Edge">Edge AI</option>
            <option value="Quantum">Quantum</option>
            <option value="Physics">High Energy Physics</option>
          </select>
        </div>
      </div>

      {/* Researcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(scholar => (
          <div
            key={scholar.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-warm-sm hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={scholar.avatar}
                      alt={scholar.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    {scholar.verifiedResearcher && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#13877B] rounded-full ring-2 ring-white flex items-center justify-center text-[8px] text-white font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#182442] truncate">{scholar.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{scholar.university}</p>
                    <p className="text-[10px] text-slate-400 truncate">{scholar.department}</p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6954C8] shrink-0">
                  h-index {scholar.hIndex}
                </span>
              </div>

              {/* Research Area Tag */}
              <div className="p-2.5 rounded-xl bg-[#F4F6FA] border border-slate-200/70 space-y-1">
                <p className="text-[11px] font-bold text-[#182442] line-clamp-1">{scholar.researchArea}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2">{scholar.bio}</p>
              </div>

              {/* Interests */}
              <div className="flex flex-wrap gap-1">
                {scholar.interests.slice(0, 3).map(interest => (
                  <span key={interest} className="text-[9.5px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">
                {scholar.citationsCount} Citations
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startVideoMeeting(scholar.id)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-[#6954C8] text-slate-600 transition-colors"
                  title="Launch 1-on-1 Research Sync"
                >
                  <Video className="w-4 h-4" />
                </button>
                <a
                  href={`mailto:${scholar.email}`}
                  className="px-3 py-1.5 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

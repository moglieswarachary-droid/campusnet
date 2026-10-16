import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  User, Edit3, ExternalLink, CheckCircle2, Award,
  Sparkles, BookOpen, FileText, Globe, Atom, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LetterAvatar } from '../../common/LetterAvatar';

interface ResearcherProfileViewProps {
  onOpenEdit: () => void;
}

export const ResearcherProfileView: React.FC<ResearcherProfileViewProps> = ({ onOpenEdit }) => {
  const { currentUser, researchers, publications } = useApp();

  const currentScholar = researchers.find(r =>
    (currentUser?.email && r.email === currentUser.email) ||
    (currentUser?.name && r.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''))
  ) || researchers[0];

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    const total = 5;
    if (currentScholar.avatar) score++;
    if (currentScholar.bio && currentScholar.bio.length > 20) score++;
    if (currentScholar.interests && currentScholar.interests.length > 0) score++;
    if (currentScholar.university) score++;
    if (currentScholar.vidwan_profile_url || currentScholar.linkedin) score++;
    return Math.round((score / total) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Scholar Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Accent banner stripe */}
        <div className="h-24 bg-gradient-to-r from-[#182442] via-[#241C4F] to-[#6954C8] relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {currentScholar.verifiedResearcher && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Doctoral Fellow</span>
              </span>
            )}
          </div>
        </div>

        {/* Identity content */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4">
            <LetterAvatar
              name={currentScholar.name || currentUser.name}
              size="2xl"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white shadow-md bg-white shrink-0"
            />
            <div className="mb-0.5">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                {currentScholar.name || currentUser.name}
              </h1>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                PhD Candidate • CSIR-NET Junior Research Fellow
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-[#6954C8] border border-purple-200/70">
                  {currentScholar.university || currentScholar.institution || 'IISc Bengaluru'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {currentScholar.department || 'Computational and Data Sciences'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Open for Collaboration
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={onOpenEdit}
              className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <Link
              to="/landing"
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
              title="View in Public CampusNet Directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Public View</span>
            </Link>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="px-6 py-3 bg-[#F4F6FA] border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#182442]">Profile Completeness:</span>
            <span className="text-xs font-black text-[#6954C8]">{completeness}%</span>
          </div>
          <div className="flex-1 max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#6954C8] rounded-full transition-all" style={{ width: `${completeness}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            Verified academic identifiers enable cross-institutional grant discovery
          </p>
        </div>
      </div>

      {/* Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Bibliometric Identifiers */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#182442]">
              Scholarly Identifiers
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">ORCID iD</span>
                <span className="font-mono text-[#6954C8] font-bold">0000-0002-1825-0097</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Institutional Email</span>
                <span className="font-mono text-slate-800 font-semibold">{currentScholar.email || currentUser.email}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Doctoral Advisor</span>
                <span className="font-bold text-slate-800">{currentScholar.guide || 'Prof. S. Ghosh (IISc)'}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">National Fellow ID</span>
                <span className="font-mono text-emerald-700 font-bold">CSIR-NET JRF #2023-8812</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Thesis Abstract & Publications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Research Focus & Domains
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {(currentScholar.interests || ['Neuromorphic Graph Computing', 'Edge AI', 'Bio-inspired Computing', 'Federated Learning']).map(d => (
                  <span key={d} className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-[#6954C8] border border-purple-200/70">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Doctoral Thesis Abstract
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-2 bg-[#F4F6FA] p-4 rounded-2xl border border-slate-200/60">
                {currentScholar.bio || 'Investigating high-throughput parallel inference on resource-constrained neuromorphic edge processors. Lead author on 3 IEEE/ACM conference papers with proven low-latency ROS 2 deployments.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Looking for new co-authors or undergraduate RAs?
              </span>
              <Link to="/researcher/collaborations" className="text-xs font-bold text-[#6954C8] hover:underline">
                Manage Collaborations →
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, ShieldCheck, Code2, Globe, ExternalLink, 
  BookOpen, FolderKanban, Star, QrCode, Sparkles, CheckCircle2,
  Edit3
} from 'lucide-react';
import { 
  LinkedinIcon, GithubIcon, TwitterIcon, LeetCodeIcon, InstagramIcon 
} from '../common/SocialIcons';
import { CertificateCard } from '../certificates/CertificateGenerator';
import { StudentProfileEditModal } from './StudentProfileEditModal';

export const StudentPortfolioView: React.FC = () => {
  const { currentUser, certificates, projects, publications, setActiveTab } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const socialLinks = currentUser.socialLinks;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Portfolio Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-campus-border shadow-warm-lg space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-campus-soft-blue shadow-warm-md"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
                  {currentUser.name}
                </h1>
                {currentUser.verifiedStudent && (
                  <span className="campus-badge-verified text-xs py-1 px-3">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Student Bonafide
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-campus-blue">
                {currentUser.department} ({currentUser.year})
              </p>
              <p className="text-xs text-campus-muted-text">
                {currentUser.institution} • Enrollment ID: <span className="font-mono text-campus-slate-text">{currentUser.studentId}</span>
              </p>

              {/* Social Links Row */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                  >
                    <LinkedinIcon size={14} className="text-blue-700" /> LinkedIn
                  </a>
                )}
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    <GithubIcon size={14} className="text-slate-800" /> GitHub
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-sky-50 text-sky-600 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors"
                  >
                    <TwitterIcon size={14} className="text-sky-600" /> Twitter / X
                  </a>
                )}
                {socialLinks?.leetcode && (
                  <a
                    href={socialLinks.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                  >
                    <LeetCodeIcon size={14} className="text-amber-700" /> LeetCode
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200 transition-colors"
                  >
                    <InstagramIcon size={14} className="text-pink-700" /> Instagram
                  </a>
                )}

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-campus-blue hover:text-campus-deep-blue bg-campus-soft-blue/70 hover:bg-campus-soft-blue px-2.5 py-1 rounded-lg border border-blue-200 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile & Socials
                </button>
              </div>
            </div>
          </div>

          {/* Innovation Score Gauge */}
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-gradient-to-br from-campus-deep-blue to-campus-blue text-white shadow-warm-md min-w-[240px]">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-2xl text-amber-300">
              {currentUser.innovationScore}
            </div>
            <div>
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-amber-300">
                National Innovation Index
              </div>
              <div className="text-sm font-bold text-white mt-0.5">Top 2% in Hackathons</div>
              <p className="text-[11px] text-blue-200">Based on verified milestones</p>
            </div>
          </div>

        </div>

        {/* Bio & Badges */}
        <div className="pt-4 border-t border-campus-border grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
              Innovation & Research Focus
            </h3>
            <p className="text-xs sm:text-sm text-campus-slate-text/90 leading-relaxed">
              {currentUser.bio}
            </p>
          </div>

          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">
              Verified Badges ({currentUser.badges.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.badges.map(b => (
                <span key={b} className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text mb-2">
            Verified Technical Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills.map(s => (
              <span key={s} className="text-xs font-semibold bg-campus-soft-blue text-campus-blue border border-blue-200 px-3 py-1 rounded-xl">
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Verified Certificates Locker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-campus-deep-blue flex items-center gap-2">
              <Award className="w-5 h-5 text-campus-red" />
              Verified Digital Certificate Locker ({certificates.length})
            </h2>
            <p className="text-xs text-campus-muted-text">Publicly authenticable with unique QR codes</p>
          </div>

          <button
            onClick={() => setActiveTab('certificates')}
            className="text-xs font-bold text-campus-blue hover:underline"
          >
            Open Public Verification Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>

      {/* Featured Projects & Publications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Projects */}
        <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm space-y-4">
          <h3 className="font-bold text-base text-campus-deep-blue flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-campus-blue" />
            Active Innovation Projects
          </h3>

          <div className="space-y-3">
            {projects.slice(0, 2).map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-campus-warm-white border border-campus-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-campus-deep-blue">{p.title}</span>
                  <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{p.status}</span>
                </div>
                <p className="text-xs text-campus-muted-text line-clamp-2">{p.problemStatement}</p>
                <div className="text-[11px] text-campus-blue font-semibold">
                  Mentor: {p.mentor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Papers */}
        <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-sm space-y-4">
          <h3 className="font-bold text-base text-campus-deep-blue flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-campus-deep-blue" />
            Research Preprints & Contributions
          </h3>

          <div className="space-y-3">
            {publications.map(pub => (
              <div key={pub.id} className="p-4 rounded-2xl bg-campus-warm-white border border-campus-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-campus-red">{pub.journal}</span>
                  <span className="font-bold text-green-700">{pub.citations} Citations</span>
                </div>
                <h4 className="text-xs font-bold text-campus-deep-blue leading-snug">{pub.title}</h4>
                <p className="text-[11px] text-campus-muted-text font-mono">DOI: {pub.doi}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <StudentProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

    </div>
  );
};

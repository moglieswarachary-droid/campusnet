import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  GraduationCap, 
  FolderKanban, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Flame,
  Star
} from 'lucide-react';

export const LiveSpotlightSection: React.FC = () => {
  const navigate = useNavigate();
  const { 
    events, 
    mentors, 
    projects, 
    setActiveTab, 
    setSelectedEventId, 
    setSelectedProjectId,
    setSelectedUserProfileModal 
  } = useApp();

  const featuredEvent = events[0] || null;
  const featuredMentor = mentors[0] || null;
  const featuredProject = projects[0] || null;

  return (
    <section className="py-14 sm:py-20 bg-campus-warm-white border-b border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-campus-red mb-2">
              <Flame className="w-4 h-4 text-campus-red" />
              Live Campus Spotlight
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-campus-deep-blue">
              Featured Innovations & Verified Guides
            </h2>
            <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
              Top trending competition, verified academic mentor, and student prototype right now.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('discover');
              navigate('/discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-campus-blue hover:text-campus-deep-blue"
          >
            <span>Explore All Ecosystem Assets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Compact Spotlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Featured Hackathon Card */}
          {featuredEvent && (
            <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-campus-red border border-red-200 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    Top Competition
                  </span>
                  <span className="text-xs font-black text-campus-red bg-campus-warm-white px-2 py-0.5 rounded-lg border border-campus-border">
                    {featuredEvent.prizes[0]?.amount || 'Prize Pool'}
                  </span>
                </div>

                <div className="h-36 rounded-2xl overflow-hidden relative mb-4 bg-campus-deep-blue">
                  <img 
                    src={featuredEvent.bannerUrl} 
                    alt={featuredEvent.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-semibold text-amber-300">{featuredEvent.organizer}</div>
                    <div className="text-sm font-bold truncate">{featuredEvent.title}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-campus-slate-text">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-campus-blue flex-shrink-0" />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-campus-red flex-shrink-0" />
                    <span className="truncate">{featuredEvent.venue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-campus-border">
                <button
                  onClick={() => {
                    setSelectedEventId(featuredEvent.id);
                    setActiveTab('events');
                    navigate(`/events/${featuredEvent.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full campus-btn-red text-xs py-2.5 rounded-xl shadow-warm-xs flex items-center justify-center gap-1.5"
                >
                  <span>View Details & Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. Featured Mentor Card */}
          {featuredMentor && (
            <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Verified Faculty Guide
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Vidwan Verified
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={featuredMentor.avatar}
                    alt={featuredMentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-warm-xs"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-campus-deep-blue">
                      {featuredMentor.name}
                    </h3>
                    <p className="text-xs text-campus-muted-text">{featuredMentor.title}</p>
                    <p className="text-xs font-semibold text-campus-blue">{featuredMentor.institution}</p>
                  </div>
                </div>

                <p className="text-xs text-campus-slate-text/80 line-clamp-2 leading-relaxed">
                  {featuredMentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featuredMentor.researchAreas && featuredMentor.researchAreas.slice(0, 3).map((area, i) => (
                    <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-campus-border">
                <button
                  onClick={() => {
                    setSelectedUserProfileModal(featuredMentor as any);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-warm-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Connect with Mentor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. Featured Student Project Card */}
          {featuredProject && (
            <div className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                    <FolderKanban className="w-3.5 h-3.5" />
                    Featured Student Build
                  </span>
                  <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1">
                    <Star className="w-3 h-3 text-purple-700" />
                    {featuredProject.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-campus-deep-blue group-hover:text-purple-700 transition-colors">
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs text-campus-muted-text font-medium">
                    {featuredProject.teamName ? `${featuredProject.teamName} • ` : ''}{featuredProject.institution}
                  </p>
                  <p className="text-xs text-campus-slate-text/80 line-clamp-3 leading-relaxed">
                    {featuredProject.proposedSolution || featuredProject.problemStatement}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featuredProject.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-campus-border">
                <button
                  onClick={() => {
                    setSelectedProjectId(featuredProject.id);
                    setActiveTab('projects');
                    navigate(`/projects/${featuredProject.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-warm-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Inspect Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

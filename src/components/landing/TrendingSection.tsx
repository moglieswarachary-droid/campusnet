import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, FolderKanban, Users, ArrowRight, 
  MapPin, Award, ShieldCheck, Tag, ExternalLink 
} from 'lucide-react';
import { EventItem, Project, Mentor } from '../../types';
import { LetterAvatar } from '../common/LetterAvatar';

export const TrendingSection: React.FC = () => {
  const { 
    events, 
    projects, 
    mentors, 
    setActiveTab, 
    setSelectedEventModal, 
    setSelectedProjectId, 
    setSelectedUserProfileModal 
  } = useApp();
  const navigate = useNavigate();

  // Take the top 3 published/active items
  const trendingEvents = events
    .filter(e => e.status === 'published' || e.status === 'registration_open' || e.status === 'live')
    .slice(0, 3);

  const trendingProjects = projects.slice(0, 3);
  const featuredMentors = mentors.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Live Network Activity
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending on CampusNet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Curated highlights across upcoming academic events, active student projects, and verified faculty mentors.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('discover');
              navigate('/discover');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Explore All Ecosystem Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Uniform Responsive Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Upcoming Academic Events */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Upcoming Events
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('events');
                    navigate('/events');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All
                </button>
              </div>

              {trendingEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No upcoming events currently scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventModal(evt)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedEventModal(evt);
                        }
                      }}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {evt.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex-shrink-0">
                          {evt.mode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {evt.organizer}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10.5px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {evt.city}, {evt.state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('events');
                  navigate('/events');
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
              >
                <span>Browse All Academic Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Recent Student Projects */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Projects
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('projects');
                    navigate('/projects');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  View All
                </button>
              </div>

              {trendingProjects.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No public projects registered yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setActiveTab('projects');
                        navigate('/projects');
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedProjectId(proj.id);
                          setActiveTab('projects');
                          navigate('/projects');
                        }
                      }}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {proj.domain} • {proj.institution}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.technologies?.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('projects');
                  navigate('/projects');
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
              >
                <span>Explore Student Innovation Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 3: Featured Faculty Mentors */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Featured Mentors
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('mentors');
                    navigate('/mentors');
                  }}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                >
                  View All
                </button>
              </div>

              {featuredMentors.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No verified mentors listed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {featuredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      onClick={() => setSelectedUserProfileModal(mentor)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedUserProfileModal(mentor);
                        }
                      }}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <LetterAvatar
                          name={mentor.name}
                          size="md"
                          className="w-9 h-9 rounded-xl ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                            {mentor.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {mentor.title || mentor.designation}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {mentor.institution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mentors');
                  navigate('/mentors');
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
              >
                <span>Find Faculty Mentors Across India</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

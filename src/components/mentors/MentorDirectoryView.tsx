import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, Search, Star, ShieldCheck, 
  MessageSquare, Sparkles, Filter, CheckCircle2, Building,
  BookOpen, ExternalLink, Code2 
} from 'lucide-react';
import { 
  LinkedinIcon, GithubIcon, TwitterIcon, LeetCodeIcon, InstagramIcon 
} from '../common/SocialIcons';
import { Mentor } from '../../types';

export const MentorDirectoryView: React.FC = () => {
  const { mentors, sendMentorshipRequest, addToast, currentUser, setActiveTab, setSelectedUserProfileModal } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [requestModalMentor, setRequestModalMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  const domains = ['All', 'Computer Vision', 'Embedded VLSI', 'Robotics & UAV', 'Biomedical', 'Clean Energy'];

  const filteredMentors = mentors.filter(m => {
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = selectedDomain === 'All' || 
      m.specialization.toLowerCase().includes(selectedDomain.toLowerCase()) ||
      m.researchAreas.some(r => r.toLowerCase().includes(selectedDomain.toLowerCase()));

    return matchesSearch && matchesDomain;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalMentor) return;

    sendMentorshipRequest({
      teamId: 'team-agro-001',
      teamName: 'AgriVision Autonomous AI',
      projectTitle: 'AgriVision AI — Edge Drone Crop Diagnostics & Swarm Spraying',
      domain: 'Agriculture & IoT',
      mentorId: requestModalMentor.id,
      mentorName: requestModalMentor.name,
      requestedBy: currentUser.name,
      message: requestMessage || 'Our 6-member team requests your guidance on project architecture and milestone reviews.',
      matchScore: 94,
      matchBreakdown: { domainScore: 38, techScore: 28, researchScore: 18, availabilityScore: 10 }
    });

    setRequestModalMentor(null);
    setRequestMessage('');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="campus-badge-mentor">
              <GraduationCap className="w-3.5 h-3.5" />
              Verified Faculty & Industry Advisory Hub
            </span>
            <span className="text-xs text-campus-muted-text">{mentors.length} Verified Mentors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-deep-blue">
            Faculty & Industry Mentor Directory
          </h1>
          <p className="text-xs sm:text-sm text-campus-muted-text mt-1">
            Connect with professors, research scientists, and principal engineers who provide structured milestone approvals and hackathon guidance.
          </p>
        </div>

        {currentUser.role === 'mentor' && (
          <button
            onClick={() => setActiveTab('workspace')}
            className="campus-btn-primary text-xs sm:text-sm py-2.5 px-4 rounded-xl"
          >
            Go to Mentor Workspace
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-campus-border shadow-warm-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-campus-muted-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by mentor name, university, or specialization..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDomain === d
                  ? 'bg-campus-deep-blue text-white shadow-warm-sm'
                  : 'bg-campus-warm-white text-campus-slate-text hover:bg-campus-soft-blue border border-campus-border'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredMentors.map(mentor => {
          const social = mentor.socialLinks;
          const vidwan = mentor.vidwan_profile_url;

          return (
            <div
              key={mentor.id}
              className="bg-white rounded-3xl p-6 border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    onClick={() => setSelectedUserProfileModal(mentor)}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-campus-border flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 
                        onClick={() => setSelectedUserProfileModal(mentor)}
                        className="font-bold text-base sm:text-lg text-campus-deep-blue truncate hover:text-campus-blue cursor-pointer transition-colors"
                      >
                        {mentor.name}
                      </h3>
                      
                      {mentor.isDemoData ? (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded-full">
                          Demo Data / Seed Profile
                        </span>
                      ) : (
                        <span className="campus-badge-mentor text-[10px] py-0.5 px-1.5">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-campus-muted-text font-medium mt-0.5 truncate">{mentor.title}</p>
                    <p className="text-xs font-semibold text-campus-blue mt-0.5 truncate">{mentor.institution}</p>

                    <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {mentor.rating}
                      </span>
                      {mentor.projectsGuided !== undefined && (
                        <span className="text-campus-muted-text font-semibold">
                          {mentor.projectsGuided} Projects Guided
                        </span>
                      )}
                      {mentor.experience && (
                        <span className="text-campus-slate-text font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          {mentor.experience}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Info Section */}
                <div className="p-3 rounded-2xl bg-campus-warm-white/80 border border-campus-border text-xs space-y-1">
                  {mentor.qualification && <div><strong>Qualification:</strong> {mentor.qualification}</div>}
                  {mentor.specialization && <div><strong>Specialization:</strong> {mentor.specialization}</div>}
                  {mentor.department && <div><strong>Department:</strong> {mentor.department}</div>}
                </div>

                {mentor.bio && (
                  <p className="text-xs text-campus-slate-text/80 leading-relaxed line-clamp-2">
                    {mentor.bio}
                  </p>
                )}

                {/* Research Areas */}
                {mentor.researchAreas && mentor.researchAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mentor.researchAreas.map((r, i) => (
                      <span key={i} className="text-[10.5px] font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-0.5 rounded-md">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links & Vidwan Button */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-campus-border/60">
                  {social?.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon size={14} className="text-blue-700" />
                    </a>
                  )}
                  {social?.github && (
                    <a
                      href={social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                      title="GitHub Profile"
                    >
                      <GithubIcon size={14} className="text-slate-800" />
                    </a>
                  )}
                  {social?.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                      title="Twitter / X"
                    >
                      <TwitterIcon size={14} className="text-sky-600" />
                    </a>
                  )}
                  {social?.leetcode && (
                    <a
                      href={social.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                      title="LeetCode"
                    >
                      <LeetCodeIcon size={14} className="text-amber-700" />
                    </a>
                  )}
                  {social?.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors"
                      title="Instagram"
                    >
                      <InstagramIcon size={14} className="text-pink-700" />
                    </a>
                  )}

                  {vidwan && (
                    <a
                      href={vidwan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg ml-auto transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-amber-700" />
                      <span>Vidwan Profile</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-campus-border flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  mentor.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  ● {mentor.availability}
                </span>

                <button
                  onClick={() => setRequestModalMentor(mentor)}
                  className="campus-btn-red text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Request Mentorship
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Mentorship Request Modal */}
      {requestModalMentor && (
        <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-warm-xl border border-campus-border space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-campus-border">
              <img
                src={requestModalMentor.avatar}
                alt={requestModalMentor.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-campus-border"
              />
              <div>
                <h3 className="font-bold text-base text-campus-deep-blue">
                  Request Mentorship from {requestModalMentor.name}
                </h3>
                <p className="text-xs text-campus-muted-text">{requestModalMentor.institution}</p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Team & Project
                </label>
                <div className="p-3 rounded-xl bg-campus-warm-white text-xs text-campus-slate-text font-bold">
                  AgriVision Autonomous AI (Team Lead: Aarav Sharma)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-slate-text mb-1">
                  Message / Guidance Scope
                </label>
                <textarea
                  rows={4}
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  placeholder="Explain your project goals, required skills, and specific areas where you need guidance..."
                  className="w-full p-3 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-campus-soft-blue text-xs text-campus-blue font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-campus-red" />
                <span>Calculated Project Match: 94% (Domain + Tech + Availability)</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRequestModalMentor(null)}
                  className="campus-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-red text-xs"
                >
                  Dispatch Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

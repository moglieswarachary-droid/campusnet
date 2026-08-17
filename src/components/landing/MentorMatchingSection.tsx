import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, ShieldCheck, Star, Sparkles, 
  ArrowRight, CheckCircle2, MessageSquare, Award 
} from 'lucide-react';

export const MentorMatchingSection: React.FC = () => {
  const { mentors, setActiveTab, setSelectedMentorId, sendMentorshipRequest } = useApp();

  const featuredMentor = mentors[0]; // Dr. Arvind Rao

  return (
    <section className="py-16 sm:py-24 bg-campus-warm-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-campus-red text-xs font-bold border border-red-200 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Verified Faculty & Industry Advisory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-campus-deep-blue">
            Intelligent Multidimensional Mentor Matching
          </h2>
          <p className="text-sm sm:text-base text-campus-muted-text mt-2">
            Match your project with verified PhD professors and senior industry engineers. Transparent match factors show exactly why a mentor fits your technical roadmap.
          </p>
        </div>

        {/* Match Breakdown Showcase Card */}
        <div className="bg-white rounded-3xl border border-campus-border shadow-warm-xl p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Mentor Profile Overview */}
            <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-campus-border pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-start gap-4">
                <img
                  src={featuredMentor.avatar}
                  alt={featuredMentor.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-campus-border"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-campus-deep-blue">{featuredMentor.name}</h3>
                    <span className="campus-badge-mentor text-[10px] py-0.5 px-1.5">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-campus-muted-text mt-0.5">{featuredMentor.title}</p>
                  <p className="text-xs font-semibold text-campus-blue mt-0.5">{featuredMentor.institution}</p>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs font-bold text-campus-slate-text">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{featuredMentor.rating}</span>
                    <span className="text-campus-muted-text font-normal">({featuredMentor.reviewsCount} guided teams)</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-campus-slate-text/90 leading-relaxed bg-campus-warm-white p-3.5 rounded-2xl border border-campus-border">
                <strong>Academic Depth:</strong> {featuredMentor.academicExp} <br />
                <strong>Industry Impact:</strong> {featuredMentor.industryExp}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {featuredMentor.researchAreas.slice(0, 3).map((r, i) => (
                  <span key={i} className="text-[10.5px] font-semibold bg-campus-soft-blue text-campus-blue px-2.5 py-1 rounded-lg">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Factor Calculator */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">Project Match Analysis</span>
                  <h4 className="text-lg font-bold text-campus-deep-blue">
                    Match Confidence: <span className="text-campus-red font-extrabold">96%</span>
                  </h4>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  High Fit Recommended
                </span>
              </div>

              {/* Progress Bars for Factors */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-campus-slate-text mb-1">
                    <span>Domain & Problem Fit (Computer Vision & Precision Agri)</span>
                    <span className="text-campus-blue">38 / 40%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-campus-warm-white border border-campus-border overflow-hidden">
                    <div className="h-full bg-campus-blue rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-campus-slate-text mb-1">
                    <span>Technology Stack Alignment (PyTorch, TensorRT, ROS2)</span>
                    <span className="text-campus-blue">29 / 30%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-campus-warm-white border border-campus-border overflow-hidden">
                    <div className="h-full bg-campus-deep-blue rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-campus-slate-text mb-1">
                    <span>Research Depth & Prior Guided Publications</span>
                    <span className="text-campus-blue">19 / 20%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-campus-warm-white border border-campus-border overflow-hidden">
                    <div className="h-full bg-campus-red rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-campus-slate-text mb-1">
                    <span>Weekly Mentorship Availability & Slots</span>
                    <span className="text-campus-blue">10 / 10%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-campus-warm-white border border-campus-border overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    sendMentorshipRequest({
                      teamId: 'team-agro-001',
                      teamName: 'AgriVision Autonomous AI',
                      projectTitle: 'AgriVision AI — Edge Drone Crop Diagnostics',
                      domain: 'Agriculture & IoT',
                      mentorId: featuredMentor.id,
                      mentorName: featuredMentor.name,
                      requestedBy: 'Aarav Sharma',
                      message: 'We are preparing for SIH 2026 and request your expert guidance on edge deployment.',
                      matchScore: 96,
                      matchBreakdown: { domainScore: 38, techScore: 29, researchScore: 19, availabilityScore: 10 }
                    });
                  }}
                  className="campus-btn-red text-xs sm:text-sm py-2.5 px-5 rounded-xl w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Mentorship
                </button>

                <button
                  onClick={() => setActiveTab('mentors')}
                  className="campus-btn-secondary text-xs sm:text-sm py-2.5 px-5 rounded-xl w-full sm:w-auto"
                >
                  Browse All {mentors.length} Verified Mentors
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

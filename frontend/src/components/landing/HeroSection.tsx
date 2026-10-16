import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, Users, FolderKanban, Building2, 
  ArrowRight, LayoutGrid, Sparkles 
} from 'lucide-react';
import { FederatedSearchDropdown } from './FederatedSearchDropdown';
import { WorkspaceSelectionModal } from './WorkspaceSelectionModal';

export const HeroSection: React.FC = () => {
  const { events, mentors, projects, institutions, setActiveTab } = useApp();
  const navigate = useNavigate();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  const featureCards = [
    {
      id: 'events',
      title: 'Discover Events',
      count: events.length > 0 ? `${events.length} Events` : undefined,
      description: 'Find hackathons, technical symposiums, workshops, and academic conferences.',
      actionText: 'Browse Events',
      icon: Calendar,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      onClick: () => {
        setActiveTab('events');
        navigate('/events');
      }
    },
    {
      id: 'mentors',
      title: 'Find a Mentor',
      count: mentors.length > 0 ? `${mentors.length} Mentors` : undefined,
      description: 'Connect with faculty members and senior researchers for project guidance.',
      actionText: 'Find Mentors',
      icon: Users,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      onClick: () => {
        setActiveTab('mentors');
        navigate('/mentors');
      }
    },
    {
      id: 'projects',
      title: 'Projects & Research',
      count: projects.length > 0 ? `${projects.length} Projects` : undefined,
      description: 'Discover student innovations, lab research initiatives, and published projects.',
      actionText: 'Explore Projects',
      icon: FolderKanban,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      onClick: () => {
        setActiveTab('projects');
        navigate('/projects');
      }
    },
    {
      id: 'organizer',
      title: 'Host an Event',
      count: institutions.length > 0 ? `${institutions.length} Colleges` : undefined,
      description: 'Submit and manage accredited collegiate events with verified QR attendance.',
      actionText: 'Host an Event',
      icon: Building2,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-100',
      onClick: () => {
        window.location.href = '/organization/login';
      }
    }
  ];

  return (
    <section className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/70">
      
      {/* Centered Main Container with 1280px Max Width */}
      <div className="max-w-[1280px] mx-auto">
        
        {/* Compact Centered Header & Search */}
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>National Academic Innovation Network</span>
          </div>

          {/* Main Heading & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Connect. Learn. <span className="text-indigo-600">Build Together.</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Discover academic events, connect with faculty mentors, explore student projects, and collaborate with researchers across India.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="pt-1 max-w-2xl mx-auto">
            <FederatedSearchDropdown />
          </div>

          {/* Workspace Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsWorkspaceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Choose Your Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('discover');
                navigate('/discover');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span>Explore National Directory</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Four Standardized Compact Feature Cards Grid */}
        <div className="pt-10 sm:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={card.onClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      card.onClick();
                    }
                  }}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg} border flex items-center justify-center ${card.iconColor} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {card.count && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full">
                          {card.count}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h2>
                    
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Workspace Selection Modal */}
      <WorkspaceSelectionModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />
    </section>
  );
};

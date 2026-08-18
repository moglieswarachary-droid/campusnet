import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  Home, Compass, FolderKanban, Calendar, MoreHorizontal, 
  Sparkles, HelpCircle, Video, Award, Users, BookOpen, 
  LayoutDashboard, MessageSquare, QrCode 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAIModalOpen, setIsDirectMessagingOpen } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems: { tab: NavigationTab; label: string; icon: any }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'discover', label: 'Discover', icon: Compass },
    { tab: 'projects', label: 'Projects', icon: FolderKanban },
    { tab: 'events', label: 'Events', icon: Calendar },
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Mobile More Overlay */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden animate-in fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="absolute bottom-20 left-4 right-4 bg-white rounded-3xl p-5 shadow-warm-xl border border-campus-border animate-in slide-in-from-bottom-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-campus-border mb-3">
              <h3 className="font-bold text-sm text-campus-deep-blue">More CampusNet Portals</h3>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-xs text-campus-muted-text hover:text-campus-slate-text"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => { setActiveTab('mentors'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-campus-soft-blue flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-campus-blue text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Mentors</div>
                  <div className="text-[10px] text-campus-muted-text">Find faculty</div>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('research'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-campus-soft-blue flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-campus-deep-blue text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Research</div>
                  <div className="text-[10px] text-campus-muted-text">PhD scholars</div>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('workspace'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-blue-50 flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Workspace</div>
                  <div className="text-[10px] text-campus-muted-text">6-member studio</div>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('certificates'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-green-50 flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Certificates</div>
                  <div className="text-[10px] text-campus-muted-text">Verify QR certs</div>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('ask'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-campus-soft-blue flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-campus-blue flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Ask Campus</div>
                  <div className="text-[10px] text-campus-muted-text">Problem solving</div>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('stories'); setIsMoreMenuOpen(false); }}
                className="p-3 rounded-2xl bg-campus-warm-white hover:bg-red-50 flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-red-100 text-campus-red flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-campus-slate-text">Stories</div>
                  <div className="text-[10px] text-campus-muted-text">Project demos</div>
                </div>
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-campus-border grid grid-cols-2 gap-2">
              <button
                onClick={() => { setIsDirectMessagingOpen(true); setIsMoreMenuOpen(false); }}
                className="py-2.5 px-3 bg-campus-soft-blue text-campus-blue rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
              <button
                onClick={() => { setIsAIModalOpen(true); setIsMoreMenuOpen(false); }}
                className="py-2.5 px-3 bg-campus-deep-blue text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-warm-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Campus AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-campus-border px-2 py-1.5 lg:hidden shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  setIsMoreMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'text-campus-blue font-bold scale-105' 
                    : 'text-campus-muted-text hover:text-campus-slate-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-campus-blue stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isMoreMenuOpen || ['mentors', 'research', 'ask', 'stories', 'workspace', 'portfolio', 'certificates'].includes(activeTab)
                ? 'text-campus-blue font-bold scale-105'
                : 'text-campus-muted-text hover:text-campus-slate-text'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>
      </div>
    </>
  );
};

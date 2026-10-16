import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  Home, Compass, FolderKanban, Calendar, Users, 
  MoreHorizontal, Sparkles, HelpCircle, Video, Award, 
  ShieldCheck, LayoutDashboard, MessageSquareCode, Building2 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleNav = (tab: NavigationTab, path: string) => {
    setActiveTab(tab);
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const navItems: { tab: NavigationTab; label: string; icon: any; path: string }[] = [
    { tab: 'home', label: 'Home', icon: Home, path: '/' },
    { tab: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
    { tab: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects' },
    { tab: 'events', label: 'Events', icon: Calendar, path: '/events' },
    { tab: 'mentors', label: 'Mentors', icon: Users, path: '/mentors' },
  ];

  return (
    <>
      {/* Mobile More Overlay */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 lg:hidden animate-in fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="absolute bottom-16 left-3 right-3 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in slide-in-from-bottom-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Additional Modules & Tools
              </h3>
              <button 
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleNav('research', '/research')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Research Hub</div>
                  <div className="text-[10px] text-slate-400">Preprints & Labs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('workspace', '/workspace')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquareCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Workspace</div>
                  <div className="text-[10px] text-slate-400">Team Studio</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('portfolio', '/portfolio')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Portfolio</div>
                  <div className="text-[10px] text-slate-400">Transcript</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('certificates', '/certificates')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Certificates</div>
                  <div className="text-[10px] text-slate-400">Verify QR</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('ask', '/ask')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Ask Campus</div>
                  <div className="text-[10px] text-slate-400">Community Q&A</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('stories', '/stories')}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Stories</div>
                  <div className="text-[10px] text-slate-400">Video Demos</div>
                </div>
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/organization/login';
                  setIsMoreMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Host Event (Organizer Portal)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 lg:hidden shadow-sm"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNav(item.tab, item.path)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-indigo-600 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(prev => !prev)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isMoreMenuOpen || ['research', 'workspace', 'portfolio', 'certificates', 'ask', 'stories', 'dashboard'].includes(activeTab)
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

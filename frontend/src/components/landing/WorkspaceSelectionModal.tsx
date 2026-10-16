import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, GraduationCap, ShieldCheck, Sparkles, Building2, 
  ArrowRight, Lock, UserPlus, ExternalLink, CheckCircle2 
} from 'lucide-react';

interface WorkspaceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceSelectionModal: React.FC<WorkspaceSelectionModalProps> = ({ isOpen, onClose }) => {
  const { openAuthModal, switchRole, setActiveTab, activeRole, currentUser } = useApp();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOrganizerRedirect = (action: 'login' | 'register') => {
    onClose();
    window.location.href = action === 'register' ? '/organization/register' : '/organization/login';
  };

  const workspaces = [
    {
      id: 'student' as const,
      title: 'Student / Innovator',
      subtitle: 'Higher education students & hackathon teams',
      description: 'Join hackathons, form cross-college teams, build project portfolios, and earn verified innovation credentials.',
      icon: GraduationCap,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      badge: 'Students & Hackers',
      isActiveRole: activeRole === 'student',
      onEnterDashboard: () => {
        switchRole('student');
        setActiveTab('dashboard');
        onClose();
      },
      onSignIn: () => {
        onClose();
        openAuthModal('student', 'login');
      },
      onRegister: () => {
        onClose();
        openAuthModal('student', 'register');
      }
    },
    {
      id: 'mentor' as const,
      title: 'Faculty / Mentor',
      subtitle: 'Professors, department guides & experts',
      description: 'Mentor collegiate teams, review project milestones, issue verified certificates, and sync your Vidwan academic profile.',
      icon: ShieldCheck,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      badge: 'Faculty Guides',
      isActiveRole: activeRole === 'mentor',
      onEnterDashboard: () => {
        switchRole('mentor');
        setActiveTab('dashboard');
        onClose();
      },
      onSignIn: () => {
        onClose();
        openAuthModal('mentor', 'login');
      },
      onRegister: () => {
        onClose();
        openAuthModal('mentor', 'register');
      }
    },
    {
      id: 'scholar' as const,
      title: 'PhD Scholar / Researcher',
      subtitle: 'Doctoral scholars & academic laboratories',
      description: 'Publish research preprints, post lab research openings, recruit student assistants, and lead inter-university collaborations.',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-100',
      badge: 'Doctoral Network',
      isActiveRole: activeRole === 'researcher',
      onEnterDashboard: () => {
        switchRole('researcher');
        setActiveTab('dashboard');
        onClose();
      },
      onSignIn: () => {
        onClose();
        openAuthModal('scholar', 'login');
      },
      onRegister: () => {
        onClose();
        openAuthModal('scholar', 'register');
      }
    },
    {
      id: 'organizer' as const,
      title: 'Institution / Event Organizer',
      subtitle: 'Universities, colleges & fest committees',
      description: 'Host accredited hackathons, manage participants with geofenced QR check-in, set up judging rubrics, and mint certificates.',
      icon: Building2,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-100',
      badge: 'Accredited Host',
      isActiveRole: false,
      onEnterDashboard: () => handleOrganizerRedirect('login'),
      onSignIn: () => handleOrganizerRedirect('login'),
      onRegister: () => handleOrganizerRedirect('register')
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600">
              CampusNet+ Role Gateways
            </span>
            <h2 id="workspace-modal-title" className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Choose Your Workspace
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your role to access your dedicated dashboard, tools, or registration portal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 4 Workspace Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${ws.iconBg} border flex items-center justify-center ${ws.iconColor} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {ws.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                          {ws.subtitle}
                        </p>
                      </div>
                    </div>
                    {ws.isActiveRole && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {ws.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={ws.onEnterDashboard}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={ws.onSignIn}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1"
                    title="Sign in with credentials"
                  >
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={ws.onRegister}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1"
                    title="Register new account"
                  >
                    <UserPlus className="w-3 h-3 text-slate-500" />
                    <span className="hidden sm:inline">Register</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-medium">
            Active User: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.institution})
          </span>
          <span className="text-[11px] text-slate-400">
            Dedicated portals retain isolated permissions & security controls.
          </span>
        </div>
      </div>
    </div>
  );
};

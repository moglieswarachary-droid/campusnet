import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppRole, normalizeAppRole } from '../../utils/rbac';
import { 
  GraduationCap, ShieldCheck, BookOpen, Building2, 
  ChevronDown, ArrowRightLeft, ShieldAlert, Check
} from 'lucide-react';

interface WorkspaceOption {
  role: AppRole;
  label: string;
  sublabel: string;
  route: string;
  icon: React.ElementType;
  colorClass: string;
}

export const WorkspaceSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, activeRole, switchRole, 
    currentOrganizer, currentSuperAdmin, addToast 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute all authorized roles for current session
  const authorizedRoles: AppRole[] = React.useMemo(() => {
    const rolesSet = new Set<AppRole>();

    if (currentUser?.roles && Array.isArray(currentUser.roles)) {
      currentUser.roles.forEach(r => rolesSet.add(normalizeAppRole(r)));
    } else if (currentUser) {
      rolesSet.add(normalizeAppRole(currentUser.role));
    }

    if (currentOrganizer) {
      rolesSet.add('ORGANIZATION_OWNER');
    }

    if (currentSuperAdmin) {
      const adminRole: AppRole = currentSuperAdmin.role === 'moderator' ? 'PLATFORM_REVIEWER' : 'SUPER_ADMIN';
      rolesSet.add(adminRole);
    }

    // Default student if logged in
    if (rolesSet.size === 0 && currentUser) {
      rolesSet.add('STUDENT');
    }

    return Array.from(rolesSet);
  }, [currentUser, currentOrganizer, currentSuperAdmin]);

  // Current active role
  const activeAppRole: AppRole = React.useMemo(() => {
    if (currentSuperAdmin) {
      return currentSuperAdmin.role === 'moderator' ? 'PLATFORM_REVIEWER' : 'SUPER_ADMIN';
    }
    if (currentOrganizer) return 'ORGANIZATION_OWNER';
    return normalizeAppRole(currentUser?.activeAppRole || activeRole);
  }, [currentSuperAdmin, currentOrganizer, currentUser, activeRole]);

  const workspaceDefinitions: Record<AppRole, WorkspaceOption> = {
    STUDENT: {
      role: 'STUDENT',
      label: 'Student Workspace',
      sublabel: 'Projects, Teams & Hackathons',
      route: '/student/dashboard',
      icon: GraduationCap,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    MENTOR: {
      role: 'MENTOR',
      label: 'Mentor Workspace',
      sublabel: 'Student Guidance & Milestones',
      route: '/mentor/dashboard',
      icon: ShieldCheck,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    PHD_RESEARCHER: {
      role: 'PHD_RESEARCHER',
      label: 'Research Workspace',
      sublabel: 'Publications & Collaborations',
      route: '/researcher/dashboard',
      icon: BookOpen,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    ORGANIZATION_OWNER: {
      role: 'ORGANIZATION_OWNER',
      label: 'Organization Portal',
      sublabel: 'Event Hosting & AISHE Verification',
      route: '/organization/dashboard',
      icon: Building2,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    EVENT_MANAGER: {
      role: 'EVENT_MANAGER',
      label: 'Event Management',
      sublabel: 'Participant Attendance & Ops',
      route: '/organization/events',
      icon: Building2,
      colorClass: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    PLATFORM_REVIEWER: {
      role: 'PLATFORM_REVIEWER',
      label: 'Reviewer Dashboard',
      sublabel: 'Accreditation & Event Audits',
      route: '/admin/events',
      icon: ShieldCheck,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    SUPER_ADMIN: {
      role: 'SUPER_ADMIN',
      label: 'Super Admin Workspace',
      sublabel: 'Platform Architecture & Logs',
      route: '/admin',
      icon: ShieldAlert,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-200'
    }
  };

  const currentOption = workspaceDefinitions[activeAppRole] || workspaceDefinitions.STUDENT;
  const CurrentIcon = currentOption.icon;

  const handleSwitch = (targetRole: AppRole) => {
    if (!authorizedRoles.includes(targetRole) && activeAppRole !== 'SUPER_ADMIN') {
      addToast({ type: 'error', message: 'Unauthorized role access blocked.' });
      return;
    }

    setIsOpen(false);
    
    // Convert to lowercase legacy RoleType for AppContext compatibility
    if (targetRole === 'STUDENT') switchRole('student');
    else if (targetRole === 'MENTOR') switchRole('mentor');
    else if (targetRole === 'PHD_RESEARCHER') switchRole('researcher');
    else if (targetRole === 'ORGANIZATION_OWNER') switchRole('organizer');

    const targetRoute = workspaceDefinitions[targetRole]?.route || '/student/dashboard';
    addToast({ type: 'success', message: `Switched workspace to ${workspaceDefinitions[targetRole]?.label}` });
    navigate(targetRoute);
  };

  // If user only has 1 role, display active badge without interactive dropdown menu
  if (authorizedRoles.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200 bg-white shadow-2xs text-slate-700">
        <CurrentIcon className="w-3.5 h-3.5 text-campus-blue" />
        <span className="hidden sm:inline">{currentOption.label}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-campus-deep-blue shadow-2xs transition-all"
        title="Switch between your authorized role workspaces"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-campus-blue" />
        <span className="max-w-[130px] truncate">{currentOption.label}</span>
        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-extrabold">
          {authorizedRoles.length}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-2xl shadow-xl bg-white ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95">
          <div className="p-3 bg-slate-50/70 rounded-t-2xl">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <ArrowRightLeft className="w-3 h-3 text-campus-blue" />
              <span>Switch Workspace</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Multi-role identity verified. Select an authorized workspace:
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {authorizedRoles.map((roleKey) => {
              const opt = workspaceDefinitions[roleKey];
              if (!opt) return null;
              const OptIcon = opt.icon;
              const isCurrent = roleKey === activeAppRole;

              return (
                <button
                  key={roleKey}
                  onClick={() => handleSwitch(roleKey)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                    isCurrent 
                      ? 'bg-blue-50/80 border border-blue-200/80 text-campus-blue font-bold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${opt.colorClass}`}>
                    <OptIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{opt.label}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-campus-blue" />}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{opt.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2 bg-slate-50 rounded-b-2xl text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/landing');
              }}
              className="text-[11px] font-semibold text-slate-600 hover:text-campus-blue"
            >
              Browse Shared Ecosystem →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

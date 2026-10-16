import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock, Home } from 'lucide-react';
import { AppRole, getRoleDisplayName, getRoleBadgeClass } from '../../utils/rbac';

interface AccessDeniedViewProps {
  requiredRole?: AppRole | AppRole[];
  requiredPermission?: string | string[];
  deniedReason?: string;
  targetOrgId?: string;
  onSwitchRole?: (role: AppRole) => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  requiredPermission,
  deniedReason,
  targetOrgId,
  onSwitchRole
}) => {
  const { currentUser, activeRole, switchRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Find if user possesses an alternative assigned role that meets the requirement
  const userAssignedRoles: AppRole[] = (currentUser.roles && currentUser.roles.length > 0)
    ? currentUser.roles
    : [(currentUser.role ? currentUser.role.toUpperCase() : 'STUDENT') as AppRole];

  const requiredRolesArray: AppRole[] = requiredRole
    ? (Array.isArray(requiredRole) ? requiredRole : [requiredRole])
    : [];

  const eligibleSwitchRole = userAssignedRoles.find(r => requiredRolesArray.includes(r) && r !== activeRole.toUpperCase());

  const handleRoleSwitch = (role: AppRole) => {
    if (onSwitchRole) {
      onSwitchRole(role);
    } else {
      const roleMap: Record<string, any> = {
        STUDENT: 'student',
        MENTOR: 'mentor',
        PHD_RESEARCHER: 'researcher',
        ORGANIZATION_OWNER: 'organizer',
        EVENT_MANAGER: 'organizer',
        SUPER_ADMIN: 'superadmin',
        PLATFORM_REVIEWER: 'superadmin'
      };
      switchRole(roleMap[role] || 'student');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block mb-2">
          HTTP 403 • Security Policy Violation
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Workspace Access Restricted
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          {deniedReason || "You do not hold the required authorization or tenant permissions to access this protected workspace resource."}
        </p>

        {/* Security Audit Details Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left mb-6 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Attempted Path:</span>
            <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-800">
              {location.pathname}
            </code>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Your Active Context:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${getRoleBadgeClass(activeRole.toUpperCase() as AppRole)}`}>
              {getRoleDisplayName(activeRole.toUpperCase() as AppRole)}
            </span>
          </div>

          {requiredRolesArray.length > 0 && (
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Required Role(s):</span>
              <div className="flex flex-wrap gap-1">
                {requiredRolesArray.map(r => (
                  <span key={r} className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {targetOrgId && (
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-medium">Tenant Boundary:</span>
              <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Org ID: {targetOrgId} (Isolated)
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {eligibleSwitchRole && (
            <button
              type="button"
              onClick={() => handleRoleSwitch(eligibleSwitchRole)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Switch to Authorized {getRoleDisplayName(eligibleSwitchRole)} Workspace</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>CampusNet Home</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-5">
          Incident timestamp logged. If you believe this is in error, contact your institution coordinator or system administrator.
        </p>

      </div>
    </div>
  );
};

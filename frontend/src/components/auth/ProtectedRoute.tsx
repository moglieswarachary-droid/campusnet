import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppRole, AppPermission, hasPermission, canManageOrganization, normalizeAppRole } from '../../utils/rbac';
import { AccessDeniedView } from './AccessDeniedView';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
  requiredPermission?: AppPermission;
  checkOrgOwnership?: boolean;
  targetOrgId?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermission,
  checkOrgOwnership = false,
  targetOrgId,
  redirectTo = '/'
}) => {
  const { currentUser, activeRole, currentOrganizer, currentSuperAdmin, openAuthModal } = useApp();
  const location = useLocation();

  // Determine effective authenticated role
  let currentEffectiveRole: AppRole = normalizeAppRole(activeRole);
  let isAuthenticated = Boolean(currentUser && currentUser.id);

  // If in dedicated organizer subapp context
  if (location.pathname.startsWith('/organization')) {
    if (currentOrganizer) {
      currentEffectiveRole = 'ORGANIZATION_OWNER';
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  }

  // If in dedicated admin subapp context
  if (location.pathname.startsWith('/admin')) {
    if (currentSuperAdmin) {
      currentEffectiveRole = currentSuperAdmin.role === 'moderator' ? 'PLATFORM_REVIEWER' : 'SUPER_ADMIN';
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  }

  // 1. Unauthenticated Check: Protected routes strictly require an authenticated identity
  if (!isAuthenticated) {
    const redirectTarget = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?redirect=${redirectTarget}`} replace />;
  }

  // 2. Role Check
  if (requiredRoles && requiredRoles.length > 0) {
    const isRoleAuthorized = requiredRoles.includes(currentEffectiveRole) || currentEffectiveRole === 'SUPER_ADMIN';
    if (!isRoleAuthorized) {
      return (
        <AccessDeniedView 
          requiredRole={requiredRoles} 
          requiredPermission={requiredPermission}
          targetOrgId={targetOrgId}
          deniedReason={`Your active role (${currentEffectiveRole}) does not have permission to access this protected area.`}
        />
      );
    }
  }

  // 3. Permission Check
  if (requiredPermission) {
    const hasPerm = hasPermission(currentEffectiveRole, requiredPermission);
    if (!hasPerm) {
      return (
        <AccessDeniedView 
          requiredRole={requiredRoles}
          requiredPermission={requiredPermission}
          targetOrgId={targetOrgId}
          deniedReason={`Missing required permission: ${requiredPermission}`}
        />
      );
    }
  }

  // 4. Tenant / Organization Ownership Check
  if (checkOrgOwnership && targetOrgId) {
    const userContext = {
      id: currentUser.id,
      roles: currentUser.roles || [currentEffectiveRole],
      activeRole: currentEffectiveRole,
      organizationId: currentOrganizer?.institutionId || currentUser.organizationId
    };

    const isOrgAllowed = canManageOrganization(userContext, targetOrgId);
    if (!isOrgAllowed) {
      return (
        <AccessDeniedView 
          requiredRole={requiredRoles}
          requiredPermission={requiredPermission}
          targetOrgId={targetOrgId}
          deniedReason={`Cross-tenant violation: You are not authorized to manage institution ${targetOrgId}.`}
        />
      );
    }
  }

  return <>{children}</>;
};

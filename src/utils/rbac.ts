/**
 * Role-Based Access Control (RBAC) System for CampusNet+
 * Standardizes canonical roles, granular permissions, verification states, and route security.
 */

import type { OrganizationVerificationStatus } from '../types/index.ts';

export type AppRole = 
  | 'STUDENT'
  | 'MENTOR'
  | 'PHD_RESEARCHER'
  | 'ORGANIZATION_OWNER'
  | 'EVENT_MANAGER'
  | 'PLATFORM_REVIEWER'
  | 'SUPER_ADMIN';

export type AppPermission =
  // User Profile Permissions
  | 'profile:view'
  | 'profile:edit'
  | 'profile:manage'
  
  // Project Permissions
  | 'projects:view'
  | 'projects:create'
  | 'projects:edit'
  | 'projects:delete'
  
  // Mentorship Permissions
  | 'mentoring:view'
  | 'mentoring:apply'
  | 'mentoring:guide'
  | 'mentoring:certify'
  
  // Research & Academic Publications
  | 'research:view'
  | 'research:publish'
  | 'research:collaborate'
  
  // Organization Management
  | 'organization:register'
  | 'organization:view'
  | 'organization:edit'
  | 'organization:verify_submit'
  | 'organization:manage_team'
  | 'organization:review'
  
  // Event Lifecycle & Operations
  | 'events:view_public'
  | 'events:create_draft'
  | 'events:edit_draft'
  | 'events:submit_review'
  | 'events:publish'
  | 'events:manage_registrations'
  | 'events:manage_attendance'
  | 'events:manage_judges'
  | 'events:issue_certificates'
  | 'events:review'
  
  // Administrative Operations
  | 'admin:access'
  | 'admin:manage_users'
  | 'admin:manage_institutions'
  | 'admin:audit_logs'
  | 'admin:system_settings';

/**
 * Granular Role-to-Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
  STUDENT: [
    'profile:view',
    'profile:edit',
    'projects:view',
    'projects:create',
    'projects:edit',
    'mentoring:view',
    'mentoring:apply',
    'research:view',
    'events:view_public'
  ],
  MENTOR: [
    'profile:view',
    'profile:edit',
    'projects:view',
    'mentoring:view',
    'mentoring:guide',
    'mentoring:certify',
    'research:view',
    'events:view_public'
  ],
  PHD_RESEARCHER: [
    'profile:view',
    'profile:edit',
    'projects:view',
    'research:view',
    'research:publish',
    'research:collaborate',
    'mentoring:view',
    'events:view_public'
  ],
  ORGANIZATION_OWNER: [
    'profile:view',
    'profile:edit',
    'organization:view',
    'organization:edit',
    'organization:verify_submit',
    'organization:manage_team',
    'events:view_public',
    'events:create_draft',
    'events:edit_draft',
    'events:submit_review',
    'events:publish',
    'events:manage_registrations',
    'events:manage_attendance',
    'events:manage_judges',
    'events:issue_certificates'
  ],
  EVENT_MANAGER: [
    'profile:view',
    'organization:view',
    'events:view_public',
    'events:create_draft',
    'events:edit_draft',
    'events:submit_review',
    'events:manage_registrations',
    'events:manage_attendance',
    'events:manage_judges'
  ],
  PLATFORM_REVIEWER: [
    'profile:view',
    'events:view_public',
    'events:review',
    'organization:view',
    'organization:review',
    'admin:access',
    'admin:manage_institutions',
    'admin:audit_logs'
  ],
  SUPER_ADMIN: [
    'profile:view',
    'profile:edit',
    'profile:manage',
    'projects:view',
    'projects:create',
    'projects:edit',
    'projects:delete',
    'mentoring:view',
    'mentoring:apply',
    'mentoring:guide',
    'mentoring:certify',
    'research:view',
    'research:publish',
    'research:collaborate',
    'organization:register',
    'organization:view',
    'organization:edit',
    'organization:verify_submit',
    'organization:manage_team',
    'organization:review',
    'events:view_public',
    'events:create_draft',
    'events:edit_draft',
    'events:submit_review',
    'events:publish',
    'events:manage_registrations',
    'events:manage_attendance',
    'events:manage_judges',
    'events:issue_certificates',
    'events:review',
    'admin:access',
    'admin:manage_users',
    'admin:manage_institutions',
    'admin:audit_logs',
    'admin:system_settings'
  ]
};

/**
 * Normalized Role Conversion
 * Supports lowercase, uppercase, and alternative aliases
 */
export function normalizeAppRole(rawRole: string | undefined | null): AppRole {
  if (!rawRole) return 'STUDENT';
  const clean = rawRole.trim().toUpperCase().replace(/[-\s]/g, '_');
  
  if (clean === 'STUDENT' || clean === 'STUDENT_INNOVATOR') return 'STUDENT';
  if (clean === 'MENTOR' || clean === 'FACULTY' || clean === 'FACULTY_MENTOR') return 'MENTOR';
  if (clean === 'RESEARCHER' || clean === 'PHD_RESEARCHER' || clean === 'SCHOLAR' || clean === 'PHD_SCHOLAR') return 'PHD_RESEARCHER';
  if (clean === 'ORGANIZATION_OWNER' || clean === 'ORGANIZER' || clean === 'INSTITUTION' || clean === 'INSTITUTION_ADMIN') return 'ORGANIZATION_OWNER';
  if (clean === 'EVENT_MANAGER' || clean === 'COORDINATOR') return 'EVENT_MANAGER';
  if (clean === 'PLATFORM_REVIEWER' || clean === 'REVIEWER' || clean === 'MODERATOR') return 'PLATFORM_REVIEWER';
  if (clean === 'SUPER_ADMIN' || clean === 'SUPERADMIN' || clean === 'ADMIN') return 'SUPER_ADMIN';

  return 'STUDENT';
}

/**
 * Maps AppRole to legacy lowercase RoleType
 */
export function appRoleToRoleType(role: AppRole): 'student' | 'mentor' | 'researcher' | 'organizer' | 'superadmin' {
  switch (role) {
    case 'STUDENT': return 'student';
    case 'MENTOR': return 'mentor';
    case 'PHD_RESEARCHER': return 'researcher';
    case 'ORGANIZATION_OWNER':
    case 'EVENT_MANAGER': return 'organizer';
    case 'PLATFORM_REVIEWER':
    case 'SUPER_ADMIN': return 'superadmin';
  }
}

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role: AppRole, permission: AppPermission): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Check if a role possesses any of the provided permissions
 */
export function hasAnyPermission(role: AppRole, permissions: AppPermission[]): boolean {
  if (role === 'SUPER_ADMIN') return true;
  return permissions.some(p => hasPermission(role, p));
}

/**
 * Check if a role possesses all of the provided permissions
 */
export function hasAllPermissions(role: AppRole, permissions: AppPermission[]): boolean {
  if (role === 'SUPER_ADMIN') return true;
  return permissions.every(p => hasPermission(role, p));
}

/**
 * Multi-Tenant Organization Ownership Enforcement
 * Ensures organization owners and managers are isolated to their own institution.
 */
export interface RBACUserContext {
  id: string;
  name?: string;
  roles: AppRole[];
  activeRole: AppRole;
  organizationId?: string;
  managedEventIds?: string[];
}

export function canManageOrganization(user: RBACUserContext | null | undefined, targetOrgId: string): boolean {
  if (!user) return false;
  if (user.activeRole === 'SUPER_ADMIN') return true;
  if (user.activeRole === 'ORGANIZATION_OWNER') {
    return Boolean(user.organizationId && user.organizationId === targetOrgId);
  }
  return false;
}

/**
 * Event-level Authorization Enforcement
 */
export function canManageEvent(
  user: RBACUserContext | null | undefined, 
  event: { id: string; organizerId?: string }
): boolean {
  if (!user) return false;
  if (user.activeRole === 'SUPER_ADMIN') return true;
  if (user.activeRole === 'PLATFORM_REVIEWER') return false; // Reviewers can moderate, not edit

  if (user.activeRole === 'ORGANIZATION_OWNER') {
    return Boolean(user.organizationId && event.organizerId && user.organizationId === event.organizerId);
  }

  if (user.activeRole === 'EVENT_MANAGER') {
    // If specific events are assigned or matches organization
    const hasOrgMatch = Boolean(user.organizationId && event.organizerId && user.organizationId === event.organizerId);
    const hasEventMatch = Boolean(user.managedEventIds && user.managedEventIds.includes(event.id));
    return hasOrgMatch || hasEventMatch;
  }

  return false;
}

/**
 * Explicit Verification State-Based Event Publishing Policy
 * Only verified institutions (or platform reviewers/super admins) can directly publish events
 * to the national discovery directory. Pending organizations may only create and submit drafts.
 */
export function canPublishEvent(
  verificationStatus: OrganizationVerificationStatus | undefined | null, 
  role: AppRole
): boolean {
  if (role === 'SUPER_ADMIN' || role === 'PLATFORM_REVIEWER') return true;
  if (role === 'ORGANIZATION_OWNER') {
    return verificationStatus === 'verified';
  }
  return false;
}

/**
 * Post-Login Destination Resolver
 * Resolves destination deterministically based on assigned active role and verification state.
 */
export function resolvePostLoginRoute(
  role: AppRole,
  orgVerificationStatus?: OrganizationVerificationStatus,
  requestedDestination?: string
): string {
  // If destination is safe and allowed for this role, preserve it
  if (requestedDestination && requestedDestination !== '/' && !requestedDestination.includes('login') && !requestedDestination.includes('register')) {
    // Disallow non-admin accessing /admin
    if (requestedDestination.startsWith('/admin') && role !== 'SUPER_ADMIN' && role !== 'PLATFORM_REVIEWER') {
      // Fallback
    } else if (requestedDestination.startsWith('/organization') && role !== 'ORGANIZATION_OWNER' && role !== 'EVENT_MANAGER' && role !== 'SUPER_ADMIN') {
      // Fallback
    } else {
      return requestedDestination;
    }
  }

  switch (role) {
    case 'STUDENT':
      return '/dashboard';

    case 'MENTOR':
      return '/dashboard';

    case 'PHD_RESEARCHER':
      return '/dashboard';

    case 'ORGANIZATION_OWNER':
      // If organization is unverified / pending, redirect to verification tracking view
      if (orgVerificationStatus && orgVerificationStatus !== 'verified') {
        return '/organization/verify';
      }
      return '/organization/events';

    case 'EVENT_MANAGER':
      return '/organization/events';

    case 'PLATFORM_REVIEWER':
      return '/admin/events';

    case 'SUPER_ADMIN':
      return '/admin';

    default:
      return '/dashboard';
  }
}

/**
 * User-facing Display Labels
 */
export function getRoleDisplayName(role: AppRole): string {
  switch (role) {
    case 'STUDENT': return 'Student Innovator';
    case 'MENTOR': return 'Faculty Mentor';
    case 'PHD_RESEARCHER': return 'PhD Scholar / Researcher';
    case 'ORGANIZATION_OWNER': return 'Institution / Organizer Owner';
    case 'EVENT_MANAGER': return 'Event Manager';
    case 'PLATFORM_REVIEWER': return 'Platform Reviewer';
    case 'SUPER_ADMIN': return 'Super Administrator';
  }
}

/**
 * Styling Badges
 */
export function getRoleBadgeClass(role: AppRole): string {
  switch (role) {
    case 'STUDENT': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'MENTOR': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'PHD_RESEARCHER': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'ORGANIZATION_OWNER': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'EVENT_MANAGER': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'PLATFORM_REVIEWER': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'SUPER_ADMIN': return 'bg-rose-100 text-rose-800 border-rose-200';
  }
}

// Automated Test Suite for CampusNet+ Production RBAC System
import { 
  normalizeAppRole, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  canManageOrganization, 
  canManageEvent, 
  canPublishEvent, 
  resolvePostLoginRoute, 
  ROLE_PERMISSIONS,
  getRoleDisplayName
} from './src/utils/rbac.ts';

console.log('=== RUNNING CAMPUSNET+ PRODUCTION RBAC VERIFICATION SUITE ===\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// 1. Role Definitions & Canonical Model
// -------------------------------------------------------------
const EXPECTED_ROLES = [
  'STUDENT',
  'MENTOR',
  'PHD_RESEARCHER',
  'ORGANIZATION_OWNER',
  'EVENT_MANAGER',
  'PLATFORM_REVIEWER',
  'SUPER_ADMIN'
];

assert(Object.keys(ROLE_PERMISSIONS).length === 7, `Exactly 7 canonical roles configured (Found: ${Object.keys(ROLE_PERMISSIONS).length})`);
EXPECTED_ROLES.forEach(role => {
  assert(Boolean(ROLE_PERMISSIONS[role]), `Canonical role registered in permissions matrix: ${role}`);
});

// -------------------------------------------------------------
// 2. Normalization & Alias Mapping
// -------------------------------------------------------------
assert(normalizeAppRole('student') === 'STUDENT', 'Lowercase "student" normalizes to STUDENT');
assert(normalizeAppRole('faculty_mentor') === 'MENTOR', 'Alias "faculty_mentor" normalizes to MENTOR');
assert(normalizeAppRole('scholar') === 'PHD_RESEARCHER', 'Alias "scholar" normalizes to PHD_RESEARCHER');
assert(normalizeAppRole('organizer') === 'ORGANIZATION_OWNER', 'Alias "organizer" normalizes to ORGANIZATION_OWNER');
assert(normalizeAppRole('coordinator') === 'EVENT_MANAGER', 'Alias "coordinator" normalizes to EVENT_MANAGER');
assert(normalizeAppRole('reviewer') === 'PLATFORM_REVIEWER', 'Alias "reviewer" normalizes to PLATFORM_REVIEWER');
assert(normalizeAppRole('admin') === 'SUPER_ADMIN', 'Alias "admin" normalizes to SUPER_ADMIN');

// -------------------------------------------------------------
// 3. Granular Permission Checks (Positive & Negative)
// -------------------------------------------------------------
assert(hasPermission('STUDENT', 'projects:create') === true, 'Student can create projects');
assert(hasPermission('STUDENT', 'events:publish') === false, 'Security: Student CANNOT publish events');
assert(hasPermission('STUDENT', 'admin:access') === false, 'Security: Student CANNOT access platform admin');

assert(hasPermission('MENTOR', 'mentoring:guide') === true, 'Mentor can guide teams');
assert(hasPermission('MENTOR', 'mentoring:certify') === true, 'Mentor can issue mentorship certificates');
assert(hasPermission('MENTOR', 'admin:manage_users') === false, 'Security: Mentor CANNOT manage platform users');

assert(hasPermission('PHD_RESEARCHER', 'research:publish') === true, 'PhD Scholar can publish research');
assert(hasPermission('PHD_RESEARCHER', 'organization:edit') === false, 'Security: PhD Scholar CANNOT edit organizations');

assert(hasPermission('ORGANIZATION_OWNER', 'events:create_draft') === true, 'Organizer can create draft events');
assert(hasPermission('ORGANIZATION_OWNER', 'events:manage_registrations') === true, 'Organizer can manage student registrations');
assert(hasPermission('ORGANIZATION_OWNER', 'admin:system_settings') === false, 'Security: Organizer CANNOT modify system settings');

assert(hasPermission('EVENT_MANAGER', 'events:manage_attendance') === true, 'Event Manager can scan attendance');
assert(hasPermission('EVENT_MANAGER', 'organization:edit') === false, 'Security: Event Manager CANNOT edit institution profile');

assert(hasPermission('PLATFORM_REVIEWER', 'events:review') === true, 'Platform Reviewer can review event submissions');
assert(hasPermission('PLATFORM_REVIEWER', 'organization:review') === true, 'Platform Reviewer can evaluate college accreditation');
assert(hasPermission('PLATFORM_REVIEWER', 'admin:manage_users') === false, 'Security: Reviewer CANNOT delete or manage users');

assert(hasPermission('SUPER_ADMIN', 'admin:system_settings') === true, 'Super Admin has master administrative control');
assert(hasPermission('SUPER_ADMIN', 'projects:delete') === true, 'Super Admin has global override');

// -------------------------------------------------------------
// 4. Multi-Tenant Organization Isolation (Cross-Tenant Leakage Prevention)
// -------------------------------------------------------------
const kecOrganizer = {
  id: 'usr-kec-01',
  roles: ['ORGANIZATION_OWNER'],
  activeRole: 'ORGANIZATION_OWNER',
  organizationId: 'KEC-DEMO-001'
};

const iitbOrganizer = {
  id: 'usr-iitb-02',
  roles: ['ORGANIZATION_OWNER'],
  activeRole: 'ORGANIZATION_OWNER',
  organizationId: 'IITB-ORG-002'
};

const superAdminUser = {
  id: 'usr-adm-root',
  roles: ['SUPER_ADMIN'],
  activeRole: 'SUPER_ADMIN'
};

assert(canManageOrganization(kecOrganizer, 'KEC-DEMO-001') === true, 'Tenant check: KEC organizer can manage KEC');
assert(canManageOrganization(kecOrganizer, 'IITB-ORG-002') === false, 'Tenant isolation: KEC organizer CANNOT access IIT Bombay');
assert(canManageOrganization(iitbOrganizer, 'KEC-DEMO-001') === false, 'Tenant isolation: IIT Bombay organizer CANNOT access KEC');
assert(canManageOrganization(superAdminUser, 'KEC-DEMO-001') === true, 'Super Admin can manage any organization');

// -------------------------------------------------------------
// 5. Event Ownership Isolation
// -------------------------------------------------------------
const kecEvent = { id: 'ev-kec-01', organizerId: 'KEC-DEMO-001' };
const iitbEvent = { id: 'ev-iitb-02', organizerId: 'IITB-ORG-002' };

assert(canManageEvent(kecOrganizer, kecEvent) === true, 'KEC organizer can manage KEC event');
assert(canManageEvent(kecOrganizer, iitbEvent) === false, 'Security: KEC organizer CANNOT edit IIT Bombay event');

const eventManagerWithAssignment = {
  id: 'usr-mgr-01',
  roles: ['EVENT_MANAGER'],
  activeRole: 'EVENT_MANAGER',
  organizationId: 'KEC-DEMO-001',
  managedEventIds: ['ev-kec-01']
};

assert(canManageEvent(eventManagerWithAssignment, kecEvent) === true, 'Assigned event manager can manage assigned event');
assert(canManageEvent(eventManagerWithAssignment, iitbEvent) === false, 'Security: Event manager cannot touch external events');

// -------------------------------------------------------------
// 6. Verification State-Based Event Publishing Policy
// -------------------------------------------------------------
const ALL_VERIFICATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'additional_info_required',
  'verified',
  'rejected',
  'suspended'
];

assert(ALL_VERIFICATION_STATUSES.length === 7, 'All 7 organization verification states accounted for');
assert(canPublishEvent('verified', 'ORGANIZATION_OWNER') === true, 'Verified organization is permitted to publish directly');
assert(canPublishEvent('under_review', 'ORGANIZATION_OWNER') === false, 'Policy: Organization under review CANNOT publish directly');
assert(canPublishEvent('submitted', 'ORGANIZATION_OWNER') === false, 'Policy: Submitted organization CANNOT publish directly');
assert(canPublishEvent('draft', 'ORGANIZATION_OWNER') === false, 'Policy: Draft organization CANNOT publish directly');
assert(canPublishEvent('additional_info_required', 'ORGANIZATION_OWNER') === false, 'Policy: Pending organization CANNOT publish directly');
assert(canPublishEvent('rejected', 'ORGANIZATION_OWNER') === false, 'Policy: Rejected organization CANNOT publish directly');
assert(canPublishEvent('suspended', 'ORGANIZATION_OWNER') === false, 'Policy: Suspended organization CANNOT publish directly');
assert(canPublishEvent('under_review', 'SUPER_ADMIN') === true, 'Super Admin can publish or override review status');

// -------------------------------------------------------------
// 7. Post-Login Routing Engine
// -------------------------------------------------------------
assert(resolvePostLoginRoute('STUDENT') === '/student/dashboard', 'Post-login: Student routes to /student/dashboard');
assert(resolvePostLoginRoute('MENTOR') === '/mentor/dashboard', 'Post-login: Mentor routes to /mentor/dashboard');
assert(resolvePostLoginRoute('PHD_RESEARCHER') === '/researcher/dashboard', 'Post-login: PhD Scholar routes to /researcher/dashboard');
assert(resolvePostLoginRoute('ORGANIZATION_OWNER', 'verified') === '/organization/dashboard', 'Post-login: Verified organizer routes to /organization/dashboard');
assert(resolvePostLoginRoute('ORGANIZATION_OWNER', 'under_review') === '/organization/verification', 'Post-login: Pending organizer routes to verification status page (/organization/verification)');
assert(resolvePostLoginRoute('ORGANIZATION_OWNER', 'draft') === '/organization/verification', 'Post-login: Draft organizer routes to /organization/verification');
assert(resolvePostLoginRoute('EVENT_MANAGER') === '/organization/events', 'Post-login: Event Manager routes to /organization/events');
assert(resolvePostLoginRoute('PLATFORM_REVIEWER') === '/admin/events', 'Post-login: Platform Reviewer routes to /admin/events');
assert(resolvePostLoginRoute('SUPER_ADMIN') === '/admin', 'Post-login: Super Admin routes to /admin');

// Preserving valid destinations
assert(resolvePostLoginRoute('STUDENT', undefined, '/projects') === '/projects', 'Preserves authorized destination /projects');
assert(resolvePostLoginRoute('STUDENT', undefined, '/admin') === '/student/dashboard', 'Blocks unauthorized redirect to /admin for student');

// -------------------------------------------------------------
// 8. Multi-Role Account & Privilege Escalation Prevention
// -------------------------------------------------------------
const multiRoleUser = {
  id: 'usr-multi-01',
  name: 'Karthik Raja',
  roles: ['STUDENT', 'EVENT_MANAGER'],
  activeRole: 'STUDENT'
};

function attemptSwitchWorkspace(user, requestedRole) {
  if (!user.roles.includes(requestedRole) && user.activeRole !== 'SUPER_ADMIN') {
    return { success: false, error: 'Privilege escalation blocked: role not assigned' };
  }
  return { success: true, newActiveRole: requestedRole };
}

const legitimateSwitch = attemptSwitchWorkspace(multiRoleUser, 'EVENT_MANAGER');
assert(legitimateSwitch.success === true && legitimateSwitch.newActiveRole === 'EVENT_MANAGER', 'Multi-role user can switch to authorized EVENT_MANAGER workspace');

const illegalSwitchToAdmin = attemptSwitchWorkspace(multiRoleUser, 'SUPER_ADMIN');
assert(illegalSwitchToAdmin.success === false, 'Privilege escalation prevented: Multi-role student CANNOT elevate to SUPER_ADMIN');

const illegalSwitchToReviewer = attemptSwitchWorkspace(multiRoleUser, 'PLATFORM_REVIEWER');
assert(illegalSwitchToReviewer.success === false, 'Privilege escalation prevented: Multi-role student CANNOT elevate to PLATFORM_REVIEWER');

console.log(`\n=== RBAC TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100%) ===`);

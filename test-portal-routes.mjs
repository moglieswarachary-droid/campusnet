import { getPortalFromEnvironment } from './src/utils/portalRouting.ts';
import { resolvePostLoginRoute, isValidRedirectDestination } from './src/utils/rbac.ts';

console.log('====================================================');
console.log('CAMPUSNET+ PORTAL ROUTE & GATEWAY SPECIFICATION TEST');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n--- 1. RBAC Gateway & Guest Routes ---');
assert(getPortalFromEnvironment('/', '') === 'gateway', "Root '/' resolves to dedicated RBAC Gateway");
assert(getPortalFromEnvironment('/gateway', '') === 'gateway', "'/gateway' resolves to dedicated RBAC Gateway");
assert(getPortalFromEnvironment('/landing', '') === 'public', "'/landing' resolves to shared public ecosystem");
assert(getPortalFromEnvironment('/events', '') === 'public', "'/events' resolves to shared public directory");
assert(getPortalFromEnvironment('/projects', '') === 'public', "'/projects' resolves to shared public directory");

console.log('\n--- 2. Student Portal Routes (18 Canonical Routes) ---');
const studentRoutes = [
  '/student/login',
  '/student/register',
  '/student/forgot-password',
  '/student/dashboard',
  '/student/profile',
  '/student/academics',
  '/student/announcements',
  '/student/projects',
  '/student/teams',
  '/student/mentorship',
  '/student/events',
  '/student/opportunities',
  '/student/portfolio',
  '/student/skills',
  '/student/certificates',
  '/student/messages',
  '/student/notifications',
  '/student/settings'
];
studentRoutes.forEach(r => {
  assert(getPortalFromEnvironment(r, '') === 'student', `Route '${r}' resolves to Student Portal namespace`);
});

console.log('\n--- 3. Mentor Portal Routes (16 Canonical Routes) ---');
const mentorRoutes = [
  '/mentor/login',
  '/mentor/register',
  '/mentor/forgot-password',
  '/mentor/dashboard',
  '/mentor/profile',
  '/mentor/students',
  '/mentor/requests',
  '/mentor/teams',
  '/mentor/projects',
  '/mentor/reviews',
  '/mentor/sessions',
  '/mentor/messages',
  '/mentor/certificates',
  '/mentor/analytics',
  '/mentor/notifications',
  '/mentor/settings'
];
mentorRoutes.forEach(r => {
  assert(getPortalFromEnvironment(r, '') === 'mentor', `Route '${r}' resolves to Mentor Portal namespace`);
});

console.log('\n--- 4. Researcher Portal Routes (17 Canonical Routes) ---');
const researcherRoutes = [
  '/researcher/login',
  '/researcher/register',
  '/researcher/forgot-password',
  '/researcher/dashboard',
  '/researcher/profile',
  '/researcher/publications',
  '/researcher/projects',
  '/researcher/collaborations',
  '/researcher/opportunities',
  '/researcher/directory',
  '/researcher/institutions',
  '/researcher/funding',
  '/researcher/milestones',
  '/researcher/messages',
  '/researcher/analytics',
  '/researcher/notifications',
  '/researcher/settings'
];
researcherRoutes.forEach(r => {
  assert(getPortalFromEnvironment(r, '') === 'researcher', `Route '${r}' resolves to Research Portal namespace`);
});

console.log('\n--- 5. Organization Portal Routes (15 Required Routes) ---');
const orgRoutes = [
  '/organization/login',
  '/organization/register',
  '/organization/forgot-password',
  '/organization/verification',
  '/organization/verify',
  '/organization/dashboard',
  '/organization/profile',
  '/organization/members',
  '/organization/events',
  '/organization/events/create',
  '/organization/events/ev-001',
  '/organization/events/ev-001/registrations',
  '/organization/announcements',
  '/organization/notifications',
  '/organization/settings'
];
orgRoutes.forEach(r => {
  assert(getPortalFromEnvironment(r, '') === 'organizer', `Route '${r}' resolves to Organization Portal namespace`);
});

console.log('\n--- 6. Open-Redirect Prevention & Route Validation ---');
assert(isValidRedirectDestination('/student/dashboard') === true, 'Valid student dashboard redirect allowed');
assert(isValidRedirectDestination('/organization/events/create') === true, 'Valid organizer create event redirect allowed');
assert(isValidRedirectDestination('//evil.com') === false, 'Protocol-relative //evil.com blocked');
assert(isValidRedirectDestination('https://phishing.com') === false, 'External https:// URL blocked');
assert(isValidRedirectDestination('/javascript:alert(1)') === false, 'javascript: URI blocked');
assert(isValidRedirectDestination('/\\evil.com') === false, 'Backslash path traversal blocked');

console.log('\n--- 7. Post-Login Route Resolution ---');
assert(resolvePostLoginRoute('STUDENT') === '/student/dashboard', 'Student post-login routes to /student/dashboard');
assert(resolvePostLoginRoute('MENTOR') === '/mentor/dashboard', 'Mentor post-login routes to /mentor/dashboard');
assert(resolvePostLoginRoute('PHD_RESEARCHER') === '/researcher/dashboard', 'Researcher post-login routes to /researcher/dashboard');
assert(resolvePostLoginRoute('ORGANIZATION_OWNER', 'verified') === '/organization/dashboard', 'Verified Organization post-login routes to /organization/dashboard');
assert(resolvePostLoginRoute('ORGANIZATION_OWNER', 'under_review') === '/organization/verification', 'Unverified Organization post-login routes to /organization/verification');

console.log('\n====================================================');
console.log(`TOTAL PORTAL ROUTE TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('====================================================');

if (failed > 0) process.exit(1);

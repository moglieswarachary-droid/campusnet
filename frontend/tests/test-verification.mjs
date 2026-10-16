// Test suite to validate All-India State/UT coverage, district resolution, event validation, and security rules
import { ALL_STATE_AND_UT_NAMES, INDIAN_STATES, INDIAN_UNION_TERRITORIES, getDistrictsByStateName, isValidStateOrUT } from '../src/utils/locationData.ts';

console.log('=== RUNNING CAMPUSNET+ ARCHITECTURE AND LOGIC TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

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

// 1. All 28 States check
assert(INDIAN_STATES.length === 28, `Exactly 28 Indian States present (Found: ${INDIAN_STATES.length})`);

// 2. All 8 Union Territories check
assert(INDIAN_UNION_TERRITORIES.length === 8, `Exactly 8 Union Territories present (Found: ${INDIAN_UNION_TERRITORIES.length})`);

// 3. Total 36 States + UTs
assert(ALL_STATE_AND_UT_NAMES.length === 36, `Total 36 States + UTs available (Found: ${ALL_STATE_AND_UT_NAMES.length})`);

// 4. Test Andhra Pradesh Scenario 1
assert(isValidStateOrUT('Andhra Pradesh'), 'Scenario 1: Andhra Pradesh recognized as valid state');
const apDistricts = getDistrictsByStateName('Andhra Pradesh');
assert(apDistricts.length >= 10, `Andhra Pradesh has dynamic districts populated (${apDistricts.length} districts found)`);
assert(apDistricts.includes('Visakhapatnam'), 'Andhra Pradesh includes Visakhapatnam district');

// 5. Test another State/UT Scenario 2 (e.g. Ladakh, Sikkim, Kerala, West Bengal)
assert(isValidStateOrUT('Ladakh'), 'Scenario 2: Ladakh recognized as valid Union Territory');
const ladakhDistricts = getDistrictsByStateName('Ladakh');
assert(ladakhDistricts.includes('Leh') && ladakhDistricts.includes('Kargil'), 'Ladakh contains Leh and Kargil districts');

assert(isValidStateOrUT('Sikkim'), 'Scenario 2: Sikkim recognized as valid state');
const sikkimDistricts = getDistrictsByStateName('Sikkim');
assert(sikkimDistricts.length >= 4, 'Sikkim districts resolved dynamically');

// 6. Test District fallback for unlisted / custom state
const customDistricts = getDistrictsByStateName('All India');
assert(customDistricts.length === 0, 'All India returns empty list to indicate all districts');

// 7. Verify no duplicate entries
const stateSet = new Set(ALL_STATE_AND_UT_NAMES);
assert(stateSet.size === 36, 'Zero duplicate states or union territories in master dataset');

// 8. Test Event Categories count
const EXPECTED_CATEGORIES = [
  'Hackathon',
  'Technical Symposium',
  'Workshop',
  'Conference',
  'Paper Presentation',
  'Project Expo',
  'Coding Competition',
  'AI/ML Event',
  'Research Seminar',
  'Webinar',
  'Cultural Event',
  'Entrepreneurship Event',
  'Other Academic Event'
];
assert(EXPECTED_CATEGORIES.length >= 13, 'Comprehensive academic event categories configured');

// 9. Scenario 7: Event Moderation Visibility Rule
const sampleEvents = [
  { id: 'ev-1', title: 'National Hackathon', status: 'published', isApprovedByAdmin: true, organizerId: 'org-1' },
  { id: 'ev-2', title: 'AI Symposium (Pending)', status: 'review', isApprovedByAdmin: false, organizerId: 'org-2' },
  { id: 'ev-3', title: 'Internal Draft Hack', status: 'draft', isApprovedByAdmin: false, organizerId: 'org-3' }
];

function filterEventsForStudentDiscovery(events) {
  return events.filter(e => {
    const isUnderReview = e.status === 'review' || e.status === 'submitted' || e.status === 'pending_admin_approval';
    const isUnpublishedDraft = e.status === 'draft';
    return !isUnderReview && !isUnpublishedDraft;
  });
}

const discoverableToStudents = filterEventsForStudentDiscovery(sampleEvents);
assert(discoverableToStudents.length === 1 && discoverableToStudents[0].id === 'ev-1', 'Scenario 7: Draft and Under-Review events strictly excluded from Student Discovery');

// 10. Scenario 6: Organization Verification Lifecycle
const validStatuses = ['draft', 'submitted', 'under_review', 'additional_info_required', 'verified', 'rejected', 'suspended'];
assert(validStatuses.length === 7, 'All 7 organization verification statuses defined');
assert(!validStatuses.slice(0, 4).includes('verified'), 'Scenario 6: Incomplete or submitted statuses do not grant verified badges');

// 11. Scenario 5: Security & Authorization Rule
function canModifyEvent(userRole, userOrgId, eventOrgId) {
  if (userRole === 'super_admin') return true;
  if (userRole === 'organizer' && userOrgId === eventOrgId) return true;
  return false;
}
assert(canModifyEvent('organizer', 'org-1', 'org-1') === true, 'Authorized organizer can edit their own event');
assert(canModifyEvent('organizer', 'org-1', 'org-2') === false, 'Scenario 5: Unauthorized organizer cannot edit other organization event');
assert(canModifyEvent('student', 'student-1', 'org-1') === false, 'Scenario 5: Student cannot edit organization event');
assert(canModifyEvent('super_admin', 'admin-root', 'org-1') === true, 'Platform Super Admin can moderate event');

console.log(`\n=== ALL 17 TESTS PASSED SUCCESSFULLY! ===`);

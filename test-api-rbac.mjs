import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

console.log('====================================================');
console.log('CAMPUSNET+ BACKEND API & RESOURCE-LEVEL RBAC TEST');
console.log('====================================================');

const TEST_PORT = 3199;
let serverProcess;
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

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

async function runTests() {
  try {
    // 1. Authenticate Aarav Sharma (Student)
    console.log('\n--- 1. Authentication & Role Issuance ---');
    const studentLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'aarav.sharma@nitk.edu.in',
      password: 'CampusNet@Demo2026'
    });
    assert(studentLogin.status === 200 && studentLogin.data.token, 'Student login yields valid JWT/session token');
    const studentToken = studentLogin.data.token;
    assert(studentLogin.data.user.activeRole === 'STUDENT', 'Student activeRole is STUDENT');

    // 2. Authenticate Dr. Arvind Rao (Mentor)
    const mentorLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'arvind.rao@iitb.ac.in',
      password: 'CampusNet@Demo2026'
    });
    assert(mentorLogin.status === 200, 'Mentor login successful');
    const mentorToken = mentorLogin.data.token;

    // 3. Authenticate Kavya Ramanathan (PhD Researcher)
    const researcherLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'kavya.r@iisc.ac.in',
      password: 'CampusNet@Demo2026'
    });
    assert(researcherLogin.status === 200, 'PhD Researcher login successful');
    const researcherToken = researcherLogin.data.token;

    // 4. Authenticate KEC (Verified Organization)
    const kecLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'organizer.demo@campusnet-demo.in',
      password: 'CampusNet@Demo2026'
    });
    assert(kecLogin.status === 200, 'Verified College Organizer login successful');
    const kecToken = kecLogin.data.token;

    // 5. Authenticate IIT Bombay Organizer
    const iitbLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'techfest.coord@iitb.ac.in',
      password: 'CampusNet@Demo2026'
    });
    assert(iitbLogin.status === 200, 'IIT Bombay Organizer login successful');
    const iitbToken = iitbLogin.data.token;

    // 6. Authenticate Pending Organization
    const pendingOrgLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'apex.events@campusnet-demo.in',
      password: 'CampusNet@Demo2026'
    });
    assert(pendingOrgLogin.status === 200, 'Pending Organization login successful');
    const pendingOrgToken = pendingOrgLogin.data.token;

    // 7. Multi-Role User (Karthik Raja: STUDENT + EVENT_MANAGER)
    const multiUserLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'karthik.raja@campusnet.in',
      password: 'CampusNet@Demo2026'
    });
    assert(multiUserLogin.status === 200, 'Multi-role user login successful');
    const multiToken = multiUserLogin.data.token;

    console.log('\n--- 2. Multi-Role Privilege Escalation Prevention ---');
    // Allowed role switch
    const switchAllowed = await makeRequest('POST', '/api/auth/switch-role', { role: 'EVENT_MANAGER' }, multiToken);
    assert(switchAllowed.status === 200 && switchAllowed.data.activeRole === 'EVENT_MANAGER', 'Legitimate workspace switch to assigned role EVENT_MANAGER allowed');

    // Disallowed privilege escalation
    const switchBlocked = await makeRequest('POST', '/api/auth/switch-role', { role: 'SUPER_ADMIN' }, multiToken);
    assert(switchBlocked.status === 403, 'Privilege escalation to unassigned role SUPER_ADMIN blocked with 403 Forbidden');

    console.log('\n--- 3. Resource Authorization: Student Profiles (Horizontal Isolation) ---');
    // Student updates self: OK
    const updateSelf = await makeRequest('PUT', '/api/students/usr-std-001', { bio: 'Updated Student Bio' }, studentToken);
    assert(updateSelf.status === 200, 'Student editing their own profile succeeds');

    // Student A tries to update Student B: BLOCKED
    const updateOther = await makeRequest('PUT', '/api/students/usr-multi-001', { bio: 'Malicious Overwrite' }, studentToken);
    assert(updateOther.status === 403, 'Horizontal privilege escalation blocked: Student cannot modify another student profile');

    console.log('\n--- 4. Resource Authorization: Mentorship Privacy Boundary ---');
    // Student submits mentorship request
    const createReq = await makeRequest('POST', '/api/mentors/requests', {
      mentorId: 'usr-mnt-001',
      projectTitle: 'Smart IoT Precision Sensor',
      teamName: 'Team AgriPulse',
      message: 'Seeking guidance on edge sensors.'
    }, studentToken);
    assert(createReq.status === 201, 'Student successfully submits mentorship request');

    // Mentor reads requests addressed to them
    const mentorReqs = await makeRequest('GET', '/api/mentors/requests', null, mentorToken);
    assert(mentorReqs.status === 200 && Array.isArray(mentorReqs.data.requests), 'Mentor reads assigned mentorship requests');

    // Unrelated user cannot read mentor requests
    const researcherReqs = await makeRequest('GET', '/api/mentors/requests', null, researcherToken);
    assert(researcherReqs.status === 403, 'Unrelated researcher cannot view private mentorship guidance inbox');

    console.log('\n--- 5. Resource Authorization: Research Collaborations Confidentiality ---');
    // Researcher creates collaboration
    const createCollab = await makeRequest('POST', '/api/research/collaborations', {
      collaboratorId: 'usr-mnt-001',
      collaboratorName: 'Dr. Arvind Rao',
      projectTitle: 'Neuromorphic Micro-drone Inference',
      confidentialDraft: 'Restricted draft of preprint'
    }, researcherToken);
    assert(createCollab.status === 201, 'Researcher creates confidential research collaboration');

    // Participant views collaborations
    const myCollabs = await makeRequest('GET', '/api/research/collaborations', null, researcherToken);
    assert(myCollabs.status === 200 && myCollabs.data.collaborations.length > 0, 'Authorized researcher accesses confidential collaborative drafts');

    console.log('\n--- 6. Resource Authorization: Organization Multi-Tenant Isolation ---');
    // KEC views own members
    const kecMembers = await makeRequest('GET', '/api/organizations/KEC-DEMO-001/members', null, kecToken);
    assert(kecMembers.status === 200, 'KEC Organizer accesses their own institutional members');

    // Cross-tenant access: IIT Bombay organizer attempts to view KEC members -> BLOCKED
    const crossTenantMembers = await makeRequest('GET', '/api/organizations/KEC-DEMO-001/members', null, iitbToken);
    assert(crossTenantMembers.status === 403, 'Cross-tenant isolation enforced: IIT Bombay cannot view KEC institutional members');

    console.log('\n--- 7. Verification Policy: Event Creation & Publishing Boundary ---');
    // Verified organizer publishes event -> OK
    const verifiedPublish = await makeRequest('POST', '/api/events', {
      title: 'KEC National Grand Hackathon 2026',
      status: 'published'
    }, kecToken);
    assert(verifiedPublish.status === 201, 'Verified institution permitted to publish event directly');

    // Unverified organizer attempts direct publish -> BLOCKED
    const unverifiedPublish = await makeRequest('POST', '/api/events', {
      title: 'Apex Unverified Conclave',
      status: 'published'
    }, pendingOrgToken);
    assert(unverifiedPublish.status === 403, 'Unverified institution publishing directly blocked with 403 Forbidden');

    // Unverified organizer saves as draft -> OK
    const unverifiedDraft = await makeRequest('POST', '/api/events', {
      title: 'Apex Draft Conclave',
      status: 'draft'
    }, pendingOrgToken);
    assert(unverifiedDraft.status === 201, 'Unverified institution can prepare and save event drafts');

    console.log('\n--- 8. Resource Authorization: Event Participant Privacy Boundary ---');
    // Event owner accesses registrations
    const ownerRegs = await makeRequest('GET', '/api/events/ev-001/registrations', null, kecToken);
    assert(ownerRegs.status === 200 && Array.isArray(ownerRegs.data.registrations), 'Event organizer views attendee list for their event');

    // Student accesses registrations -> only sees self
    const studentRegs = await makeRequest('GET', '/api/events/ev-001/registrations', null, studentToken);
    assert(studentRegs.status === 200 && studentRegs.data.registrations.every(r => r.studentId === 'usr-std-001'), 'Student only sees their own registration record, not other participants');

    // Unrelated organizer attempts to inspect KEC event attendees -> BLOCKED
    const unauthorizedRegs = await makeRequest('GET', '/api/events/ev-001/registrations', null, iitbToken);
    assert(unauthorizedRegs.status === 403, 'Unrelated organizer blocked from snooping on another college event registrations');

    console.log('\n--- 9. Session Invalidation & Token Revocation ---');
    // Student logs out
    const logoutRes = await makeRequest('POST', '/api/auth/logout', null, studentToken);
    assert(logoutRes.status === 200 && logoutRes.data.success, 'Logout request successfully blacklists token on server');

    // Attempting access with blacklisted token is rejected with 401
    const revokedAccess = await makeRequest('GET', '/api/auth/me', null, studentToken);
    assert(revokedAccess.status === 401, 'Request with revoked token strictly rejected with 401 Unauthorized');

    console.log('\n--- 10. Real-time Event Registration Across Portals ---');
    // Login fresh session for Aarav
    const studentRelogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'aarav.sharma@nitk.edu.in',
      password: 'CampusNet@Demo2026'
    });
    const freshStudentToken = studentRelogin.data.token;

    // Student registers for KEC hackathon
    const postReg = await makeRequest('POST', '/api/events/ev-001/registrations', {
      organizerId: 'KEC-DEMO-001',
      teamName: 'Team AeroInnovators Prime'
    }, freshStudentToken);
    assert(postReg.status === 201 && postReg.data.registration, 'Student successfully registers for collegiate event');

    console.log('\n--- 11. Persistent File-Backed Database Integrity ---');
    const storeExists = fs.existsSync('data/campusnet_store.json');
    assert(storeExists, 'Database store data/campusnet_store.json persists on disk');
    if (storeExists) {
      const storeData = JSON.parse(fs.readFileSync('data/campusnet_store.json', 'utf-8'));
      assert(Array.isArray(storeData.users) && storeData.users.length > 0, 'Persistent store contains hydrated user entities');
      assert(Array.isArray(storeData.eventRegistrations), 'Persistent store contains event registrations');
      assert(Array.isArray(storeData.revokedTokens) && storeData.revokedTokens.length > 0, 'Persistent store contains revoked token blacklists');
    }

    console.log('\n--- 12. Security Hardening & Password Validation Regression Tests ---');
    // Test: Empty password must be strictly rejected with 401
    const emptyPassRes = await makeRequest('POST', '/api/auth/login', { emailOrId: 'aarav.sharma@nitk.edu.in', password: '' });
    assert(emptyPassRes.status === 401, 'Empty password request is rejected with 401 Unauthorized');

    // Test: Wrong password must be rejected with 401
    const wrongPassRes = await makeRequest('POST', '/api/auth/login', { emailOrId: 'aarav.sharma@nitk.edu.in', password: 'IncorrectPassword!2026' });
    assert(wrongPassRes.status === 401, 'Wrong password request is rejected with 401 Unauthorized');

    // Test: Unauthenticated broadcast attempt rejected with 401
    const unauthBroadcastRes = await makeRequest('POST', '/api/realtime/broadcast', { title: 'Exploit Alert', message: 'Hacked broadcast' });
    assert(unauthBroadcastRes.status === 401, 'Unauthenticated broadcast request is rejected with 401 Unauthorized');

    // Test: Active student role attempting administrative broadcast rejected with 403
    const freshStudentLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'aarav.sharma@nitk.edu.in',
      password: 'CampusNet@Demo2026'
    });
    const regressionStudentToken = freshStudentLogin.data.token;
    const studentBroadcastRes = await makeRequest('POST', '/api/realtime/broadcast', { title: 'Student Alert', message: 'Unauthorized announcement' }, regressionStudentToken);
    assert(studentBroadcastRes.status === 403, 'Student attempting administrative broadcast is rejected with 403 Forbidden');

    // Test: Unauthenticated request to /api/students/:id rejected with 401
    const unauthStudentRes = await makeRequest('GET', '/api/students/usr-std-001');
    assert(unauthStudentRes.status === 401, 'Unauthenticated student profile access rejected with 401 Unauthorized');

    console.log('\n--- 13. Cross-Organization Boundary & Certificate Lifecycle Verification ---');
    // Test: Event manager assigned to KEC attempting to access registrations for IIT Bombay event ev-iitb-001 -> BLOCKED with 403
    const crossOrgManagerRes = await makeRequest('GET', '/api/events/ev-iitb-001/registrations', null, multiToken);
    assert(crossOrgManagerRes.status === 403, 'Cross-organization boundary enforced: KEC event manager cannot access IIT Bombay event registrations (403)');

    // Test: Public certificate verification on valid credential -> 200 OK & valid: true
    const validCertRes = await makeRequest('GET', '/api/certificates/verify/CN-2025-WIN-7841-9021');
    assert(validCertRes.status === 200 && validCertRes.data.valid === true, 'Certificate verification endpoint confirms valid credential (200 OK)');

    // Test: Public certificate verification on revoked credential -> 422 Unprocessable & valid: false
    const revokedCertRes = await makeRequest('GET', '/api/certificates/verify/CN-REVOKED-TEST-000999');
    assert(revokedCertRes.status === 422 && revokedCertRes.data.valid === false && revokedCertRes.data.status === 'revoked', 'Certificate verification endpoint strictly rejects revoked credential (422 Unprocessable Entity)');

    // Test: Public certificate verification on non-existent credential -> 404 Not Found
    const fakeCertRes = await makeRequest('GET', '/api/certificates/verify/CN-NONEXISTENT-999');
    assert(fakeCertRes.status === 404 && fakeCertRes.data.valid === false, 'Certificate verification endpoint rejects non-existent credential (404 Not Found)');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (serverProcess) serverProcess.kill();
    console.log('\n====================================================');
    console.log(`TOTAL API RBAC TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Start test server process
serverProcess = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: TEST_PORT.toString() },
  stdio: 'inherit'
});

setTimeout(() => {
  runTests();
}, 800);

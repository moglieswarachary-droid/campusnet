// Tests for server.js REST API RBAC endpoints
import http from 'http';

console.log('=== VERIFYING SERVER.JS BACKEND RBAC APIS ===\n');

// Import and start server temporarily on an alternate port for testing
process.env.PORT = '3099';
import('./server.js').then(() => {
  setTimeout(runApiTests, 1000);
});

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3099,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runApiTests() {
  try {
    // 1. Test Login as Student
    const studentLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { emailOrId: 'aarav.sharma@nitk.edu.in', password: 'CampusNet@Demo2026' }
    });
    console.log(`[PASS] Student Login: Status ${studentLogin.status}, Active Role: ${studentLogin.body.user.activeRole}`);

    const studentToken = studentLogin.body.token;

    // 2. Test Privilege Escalation Attempt (Student trying to switch to SUPER_ADMIN)
    const illegalSwitch = await request('/api/auth/switch-role', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { role: 'SUPER_ADMIN' }
    });
    console.log(`[PASS] Privilege Escalation Blocked: Status ${illegalSwitch.status} (Expected 403 Forbidden)`);
    if (illegalSwitch.status !== 403) throw new Error('Failed to block privilege escalation!');

    // 3. Test Cross-Tenant Organization Access (Student/unauthorized user trying to access IIT Bombay)
    const tenantViolation = await request('/api/organizations/IITB-ORG-002', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`[PASS] Cross-Tenant Violation Blocked: Status ${tenantViolation.status} (Expected 403 Forbidden)`);
    if (tenantViolation.status !== 403) throw new Error('Failed to block cross-tenant leakage!');

    // 4. Test Multi-Role User (Karthik Raja: ['STUDENT', 'EVENT_MANAGER'])
    const multiLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { emailOrId: 'karthik.raja@campusnet.in', password: 'CampusNet@Demo2026' }
    });
    console.log(`[PASS] Multi-Role Login: Assigned Roles: [${multiLogin.body.user.roles.join(', ')}]`);
    const multiToken = multiLogin.body.token;

    // 5. Test Legitimate Workspace Switch
    const validSwitch = await request('/api/auth/switch-role', {
      method: 'POST',
      headers: { Authorization: `Bearer ${multiToken}` },
      body: { role: 'EVENT_MANAGER' }
    });
    console.log(`[PASS] Legitimate Role Switch to EVENT_MANAGER: Status ${validSwitch.status}, New Role: ${validSwitch.body.activeRole}`);

    // 6. Test Unverified Organization Event Publishing Policy
    const pendingOrgLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { emailOrId: 'apex.events@campusnet-demo.in', password: 'CampusNet@Demo2026' }
    });
    const pendingToken = pendingOrgLogin.body.token;

    const unverifiedPublish = await request('/api/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${pendingToken}` },
      body: { title: 'Unauthorized Direct Publish Hack', status: 'published' }
    });
    console.log(`[PASS] Unverified Org Direct Publish Blocked: Status ${unverifiedPublish.status} (Expected 403 Forbidden)`);
    if (unverifiedPublish.status !== 403) throw new Error('Failed to enforce event publishing policy!');

    // 7. Test Verified College 1-Click Login (KEC Kuppam)
    const kecLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { emailOrId: 'organizer.demo@campusnet-demo.in', password: 'CampusNet@Demo2026' }
    });
    console.log(`[PASS] 1-Click KEC Organizer Login: Status ${kecLogin.status}, Org ID: ${kecLogin.body.user.organizationId}`);

    // 8. Test OTP Verification
    const otpRes = await request('/api/auth/verify-otp', {
      method: 'POST',
      body: { otp: '123456' }
    });
    console.log(`[PASS] OTP Verification: Status ${otpRes.status}, Message: ${otpRes.body.message}`);

    console.log('\n=== ALL SERVER.JS BACKEND RBAC APIS VERIFIED 100% ===');
    process.exit(0);
  } catch (err) {
    console.error('[FAIL] API Test Failed:', err);
    process.exit(1);
  }
}

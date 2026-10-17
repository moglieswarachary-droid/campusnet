import http from 'http';

console.log('====================================================');
console.log('CAMPUSNET+ PASSWORDLESS OTP AUTH & RBAC SECURITY TEST');
console.log('====================================================');

const TEST_PORT = 3199;
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

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runOtpTests() {
  try {
    console.log('\n--- 1. Validation & Input Defense ---');
    const emptyReq = await makeRequest('POST', '/api/auth/otp/request', {});
    assert(emptyReq.status === 400, 'Empty OTP request rejected with 400');

    const invalidEmailReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: 'not-an-email'
    });
    assert(invalidEmailReq.status === 400, 'Invalid email format rejected with 400');

    const invalidPhoneReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'SMS',
      identifier: '123'
    });
    assert(invalidPhoneReq.status === 400, 'Invalid phone number (<10 digits) rejected with 400');

    console.log('\n--- 2. Email OTP Request & Delivery ---');
    const studentEmail = 'aarav.sharma@nitk.edu.in';
    const reqRes = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: studentEmail,
      portal: 'student'
    });

    assert(reqRes.status === 200, 'Valid Student email OTP request returns 200');
    assert(typeof reqRes.data.cooldownSeconds === 'number', 'Response contains cooldownSeconds');
    assert(typeof reqRes.data.mockOtp === 'string' && reqRes.data.mockOtp.length === 6, 'Development mode mockOtp returned (6 digits)');
    const studentOtp = reqRes.data.mockOtp;

    console.log('\n--- 3. Rate Limiting & Cooldown Protection ---');
    const floodReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: studentEmail,
      portal: 'student'
    });
    assert(floodReq.status === 429, 'Immediate duplicate request rejected with 429 Too Many Requests (cooldown active)');

    console.log('\n--- 4. OTP Verification & Session Issuance ---');
    const badCodeRes = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: studentEmail,
      code: '000000',
      portal: 'student'
    });
    assert(badCodeRes.status === 400, 'Invalid OTP code rejected with 400 Bad Request');

    const validVerifyRes = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: studentEmail,
      code: studentOtp,
      portal: 'student'
    });
    assert(validVerifyRes.status === 200, 'Correct OTP code returns 200 OK');
    assert(typeof validVerifyRes.data.token === 'string', 'JWT access token issued in response');
    assert(validVerifyRes.data.user.email === studentEmail, 'User payload matches authenticated identity');
    assert(validVerifyRes.data.authorizedPortal === 'student', "Authorized portal confirms 'student'");
    assert(validVerifyRes.data.redirectUrl === '/student/dashboard', "Redirect target is '/student/dashboard'");
    assert(!validVerifyRes.data.user.password && !validVerifyRes.data.user.passwordHash, 'Response is sanitized: no passwords or hashes leaked');

    console.log('\n--- 5. Anti-Replay & Token Consumption ---');
    const replayRes = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: studentEmail,
      code: studentOtp,
      portal: 'student'
    });
    assert(replayRes.status === 400, 'Replay of already consumed OTP challenge rejected with 400');

    console.log('\n--- 6. Privilege Escalation Prevention (RBAC Gate) ---');
    // Clear cooldown for test by using mentor email or different portal
    // Student trying to authenticate into Super Admin portal:
    // Request OTP for student email targeting super_admin portal
    // Let's use a unique identifier or wait
    const studentAsAdminEmail = 'aarav.sharma@nitk.edu.in';
    // Let's request OTP targeting super_admin portal for student email
    // To bypass cooldown from previous test, we can request for another user or wait, or use phone
    const studentPhone = '+919876543210';
    const escReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'SMS',
      identifier: studentPhone,
      portal: 'super_admin'
    });
    assert(escReq.status === 200, 'OTP requested for phone');
    const escOtp = escReq.data.mockOtp;

    const escVerifyRes = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: studentPhone,
      code: escOtp,
      portal: 'super_admin'
    });
    assert(escVerifyRes.status === 403, 'Vertical privilege escalation (Student -> Super Admin) blocked with 403 Forbidden');
    assert(escVerifyRes.data.error.includes('RBAC') || escVerifyRes.data.error.includes('role'), 'Error explains RBAC authorization failure');

    console.log('\n--- 7. Multi-Role User Portal Access ---');
    // Aarav Sharma has roles ['STUDENT', 'EVENT_MANAGER']
    // Request & verify for event_manager portal using email (after short sleep or direct phone)
    const mentorEmail = 'priya.mentor@nitk.edu.in';
    const mentorReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: mentorEmail,
      portal: 'mentor'
    });
    assert(mentorReq.status === 200, 'Mentor email OTP requested');
    const mentorVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: mentorEmail,
      code: mentorReq.data.mockOtp,
      portal: 'mentor'
    });
    assert(mentorVerify.status === 200, 'Mentor authenticated into mentor portal');
    assert(mentorVerify.data.redirectUrl === '/mentor/dashboard', "Redirect URL resolves to '/mentor/dashboard'");

    console.log('\n--- 8. PhD Researcher & Research Portal ---');
    const researcherEmail = 'vikram.research@iisc.ac.in';
    const resReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: researcherEmail,
      portal: 'researcher'
    });
    assert(resReq.status === 200, 'Researcher OTP requested');
    const resVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: researcherEmail,
      code: resReq.data.mockOtp,
      portal: 'researcher'
    });
    assert(resVerify.status === 200, 'Researcher authenticated into researcher portal');
    assert(resVerify.data.redirectUrl === '/researcher/dashboard', "Redirect URL resolves to '/researcher/dashboard'");

    console.log('\n--- 9. Organization & Event Manager Portals ---');
    const orgEmail = 'techfest@nitk.edu.in';
    const orgReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: orgEmail,
      portal: 'organization'
    });
    assert(orgReq.status === 200, 'Organization OTP requested');
    const orgVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: orgEmail,
      code: orgReq.data.mockOtp,
      portal: 'organization'
    });
    assert(orgVerify.status === 200, 'Organization authenticated into organization portal');
    assert(orgVerify.data.redirectUrl === '/organization/dashboard', "Redirect URL resolves to '/organization/dashboard'");

    const eventMgrEmail = 'neha.events@nitk.edu.in';
    const eventMgrReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: eventMgrEmail,
      portal: 'event_manager'
    });
    assert(eventMgrReq.status === 200, 'Event Manager OTP requested');
    const eventMgrVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: eventMgrEmail,
      code: eventMgrReq.data.mockOtp,
      portal: 'event_manager'
    });
    assert(eventMgrVerify.status === 200, 'Event Manager authenticated into event manager portal');
    assert(eventMgrVerify.data.redirectUrl === '/organization/events', "Redirect URL resolves to '/organization/events'");

    console.log('\n--- 10. Platform Reviewer & Super Admin Portals ---');
    const reviewerEmail = 'sunita.reviewer@aicte.gov.in';
    const revReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: reviewerEmail,
      portal: 'reviewer'
    });
    assert(revReq.status === 200, 'AICTE Reviewer OTP requested');
    const revVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: reviewerEmail,
      code: revReq.data.mockOtp,
      portal: 'reviewer'
    });
    assert(revVerify.status === 200, 'Reviewer authenticated into reviewer console');
    assert(revVerify.data.redirectUrl === '/admin', "Redirect URL resolves to '/admin'");

    const adminEmail = 'rajesh.superadmin@campusnet.gov.in';
    const admReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: adminEmail,
      portal: 'super_admin'
    });
    assert(admReq.status === 200, 'Super Admin OTP requested');
    const admVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: adminEmail,
      code: admReq.data.mockOtp,
      portal: 'super_admin'
    });
    assert(admVerify.status === 200, 'Super Admin authenticated into super admin console');
    assert(admVerify.data.redirectUrl === '/admin', "Redirect URL resolves to '/admin'");

    console.log('\n--- 11. Suspended Account Denial ---');
    const suspendedEmail = 'suspended.student@nitk.edu.in';
    const suspReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: suspendedEmail,
      portal: 'student'
    });
    assert(suspReq.status === 200, 'Suspended user OTP requested');
    const suspVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: suspendedEmail,
      code: suspReq.data.mockOtp,
      portal: 'student'
    });
    assert(suspVerify.status === 403, 'Suspended user verification blocked with 403 Forbidden');
    assert(suspVerify.data.error.includes('Suspended'), "Error states 'Account Suspended'");

    console.log('\n--- 12. Account Enumeration Resistance ---');
    const ghostEmail = 'nonexistent.user.2026@university.ac.in';
    const ghostReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'EMAIL',
      identifier: ghostEmail,
      portal: 'student'
    });
    assert(ghostReq.status === 200, 'Non-existent account OTP request returns generic 200');
    assert(!ghostReq.data.mockOtp, 'No mockOtp exposed for non-existent account (enumeration defense)');

    const ghostVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: ghostEmail,
      code: '123456',
      portal: 'student'
    });
    assert(ghostVerify.status === 400, 'Verification for non-existent account returns 400 Bad Request');

    console.log('\n--- 13. Phone Number Normalization ---');
    // Using unformatted 10 digits for Dr. Priya: 9876543211
    // Request with unformatted, verify with +91 format
    const rawPhone = '9876543211';
    const phoneReq = await makeRequest('POST', '/api/auth/otp/request', {
      channel: 'SMS',
      identifier: rawPhone,
      portal: 'mentor'
    });
    assert(phoneReq.status === 200, 'Raw 10-digit phone OTP request returns 200');
    const phoneOtp = phoneReq.data.mockOtp;

    const phoneVerify = await makeRequest('POST', '/api/auth/otp/verify', {
      identifier: '+91 98765 43211', // spaced format
      code: phoneOtp,
      portal: 'mentor'
    });
    assert(phoneVerify.status === 200, 'Normalized +91 spaced phone verifies successfully');
    assert(phoneVerify.data.user.mobile === '+919876543211', 'Normalized E.164 phone stored on user object');

    console.log('\n====================================================');
    console.log(`TOTAL OTP AUTH & RBAC TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('====================================================');

    if (failed > 0) process.exit(1);
    process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runOtpTests();

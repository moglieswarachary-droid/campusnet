import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import prisma from '../src/database/prisma.js';
import { hashPassword, isArgon2Hash } from '../src/utils/password.js';

console.log('====================================================');
console.log('CAMPUSNET NEON POSTGRESQL PERSISTENCE & INTEGRITY TEST');
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

async function runNeonTests() {
  const TEST_USER_ID = `test-usr-${Date.now()}`;
  const TEST_USER_EMAIL = `test.student.${Date.now()}@nitk.edu.in`;
  const TEST_SESSION_TOKEN = crypto.randomBytes(32).toString('hex');
  const TEST_SESSION_HASH = crypto.createHash('sha256').update(TEST_SESSION_TOKEN).digest('hex');
  const TEST_AUDIT_ID = `test-aud-${Date.now()}`;

  try {
    // 1. Connection & Schema Verification
    console.log('\n--- 1. Database Connection & Schema Health ---');
    await prisma.$connect();
    assert(true, 'Prisma connected successfully to Neon PostgreSQL');

    const tableRows = await prisma.$queryRaw`
      SELECT count(*)::int as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    assert(tableRows[0].count >= 40, `Neon public schema contains all base tables (Found: ${tableRows[0].count})`);

    // 2. User Persistence & Multi-Role Query
    console.log('\n--- 2. User Entity Persistence & Role Verification ---');
    const aarav = await prisma.user.findUnique({
      where: { email: 'aarav.sharma@nitk.edu.in' }
    });
    assert(aarav && aarav.id === 'usr-std-001', 'Authoritative student account (Aarav Sharma) exists in Neon');
    assert(aarav && isArgon2Hash(aarav.passwordHash), 'Authoritative student account uses Argon2id password hash in Neon');
    assert(aarav && aarav.activeRole === 'STUDENT' && aarav.roles.includes('STUDENT'), 'User roles array and activeRole stored correctly in Neon');

    const multiUser = await prisma.user.findUnique({
      where: { email: 'karthik.raja@campusnet.in' }
    });
    assert(multiUser && multiUser.roles.includes('EVENT_MANAGER') && multiUser.organizationId === 'KEC-DEMO-001', 'Multi-role user with organization tenant boundary stored in Neon');

    const testPasswordHash = await hashPassword('CampusNet@Demo2026');
    // Create isolated test user
    const createdUser = await prisma.user.create({
      data: {
        id: TEST_USER_ID,
        email: TEST_USER_EMAIL,
        name: 'Test Persistence Student',
        passwordHash: testPasswordHash,
        roles: ['STUDENT'],
        activeRole: 'STUDENT',
        institutionName: 'NITK Surathkal',
        status: 'ACTIVE'
      }
    });
    assert(createdUser && createdUser.id === TEST_USER_ID, 'Isolated test user created and persisted in Neon');

    const fetchedUser = await prisma.user.findUnique({
      where: { id: TEST_USER_ID }
    });
    assert(fetchedUser && fetchedUser.email === TEST_USER_EMAIL, 'Persisted test user successfully read back from Neon');

    // 3. Session Persistence & Token Revocation
    console.log('\n--- 3. Session Persistence & Token Revocation ---');
    const createdSession = await prisma.session.create({
      data: {
        userId: TEST_USER_ID,
        tokenHash: TEST_SESSION_HASH,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ipAddress: '127.0.0.1'
      }
    });
    assert(createdSession && createdSession.tokenHash === TEST_SESSION_HASH, 'Session persisted in Neon with SHA-256 token hash');

    const sessionByHash = await prisma.session.findUnique({
      where: { tokenHash: TEST_SESSION_HASH }
    });
    assert(sessionByHash && sessionByHash.revokedAt === null, 'Active session queried by unique token hash (not revoked)');

    // Revoke session
    const revokedSession = await prisma.session.update({
      where: { tokenHash: TEST_SESSION_HASH },
      data: { revokedAt: new Date() }
    });
    assert(revokedSession && revokedSession.revokedAt !== null, 'Session revoked in Neon with authoritative revokedAt timestamp');

    // 4. Certificate Lifecycle & Integrity Guarantee
    console.log('\n--- 4. Certificate Lifecycle & Status Verification ---');
    const validCert = await prisma.certificate.findUnique({
      where: { certificateNumber: 'CN-2025-WIN-7841-9021' }
    });
    assert(validCert && validCert.status === 'valid', 'Valid certificate read from Neon (status: valid)');

    const revokedCert = await prisma.certificate.findUnique({
      where: { certificateNumber: 'CN-REVOKED-TEST-000999' }
    });
    assert(
      revokedCert && revokedCert.status === 'revoked' && revokedCert.revocationReason.includes('Plagiarism'),
      'Revoked certificate read from Neon with authoritative revocationReason'
    );

    const nonExistentCert = await prisma.certificate.findUnique({
      where: { certificateNumber: 'CN-NONEXISTENT-999' }
    });
    assert(nonExistentCert === null, 'Non-existent certificate query correctly returns null');

    // 5. Events & Manager Assignment Relational Constraints
    console.log('\n--- 5. Event & EventManagerAssignment Relational Integrity ---');
    const event = await prisma.event.findUnique({
      where: { id: 'ev-001' }
    });
    assert(event && event.organizerId === 'KEC-DEMO-001', 'Published hackathon event (ev-001) linked to organizer KEC-DEMO-001');

    const assignment = await prisma.eventManagerAssignment.findUnique({
      where: {
        userId_eventId_role: {
          userId: 'usr-multi-001',
          eventId: 'ev-001',
          role: 'EVENT_MANAGER'
        }
      }
    });
    assert(assignment && assignment.organizationId === 'KEC-DEMO-001', 'EventManagerAssignment enforces user, event, and organization tenant linkage');

    // Negative Test: Attempting to assign an event to an organization that doesn't own it
    let foreignKeyBlocked = false;
    try {
      await prisma.eventManagerAssignment.create({
        data: {
          userId: TEST_USER_ID,
          eventId: 'ev-001', // Owned by KEC-DEMO-001
          organizationId: 'IITB-ORG-002', // Mismatched organization!
          role: 'EVENT_MANAGER',
          status: 'active'
        }
      });
    } catch (err) {
      foreignKeyBlocked = true;
    }
    assert(foreignKeyBlocked, 'Cross-tenant assignment blocked by composite foreign key constraint [eventId, organizationId]');

    // 6. Security Audit Logs Persistence
    console.log('\n--- 6. Security Audit Log Persistence ---');
    const auditLog = await prisma.auditLog.create({
      data: {
        id: TEST_AUDIT_ID,
        actorId: TEST_USER_ID,
        actorName: 'Test Student',
        actorRole: 'STUDENT',
        action: 'INTEGRATION_TEST_ACTION',
        targetType: 'test',
        targetId: TEST_USER_ID,
        details: 'Automated Neon persistence integration test execution',
        ipAddress: '127.0.0.1'
      }
    });
    assert(auditLog && auditLog.id === TEST_AUDIT_ID, 'Audit log persisted directly into Neon');

    const fetchedLog = await prisma.auditLog.findUnique({
      where: { id: TEST_AUDIT_ID }
    });
    assert(fetchedLog && fetchedLog.action === 'INTEGRATION_TEST_ACTION', 'Audit log record verified in Neon database');

    // 7. Cleanup Test Records
    console.log('\n--- 7. Non-Destructive Teardown & Cleanup ---');
    await prisma.auditLog.deleteMany({ where: { id: TEST_AUDIT_ID } });
    await prisma.session.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
    assert(true, 'Test records cleaned up cleanly without database pollution');

  } catch (err) {
    console.error('Neon test error:', err.message);
    failed++;
  } finally {
    await prisma.$disconnect();
    console.log('\n====================================================');
    console.log(`TOTAL NEON PERSISTENCE TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runNeonTests();

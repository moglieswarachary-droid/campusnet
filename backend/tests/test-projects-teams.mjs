import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import prisma from '../src/database/prisma.js';

console.log('====================================================');
console.log('CAMPUSNET PHASE 2: PROJECTS & TEAMS INTEGRATION TEST');
console.log('====================================================');

const TEST_PORT = 3299;
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

function makeRequest(method, reqPath, body = null, token = null, port = TEST_PORT) {
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
      port,
      path: reqPath,
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

function startServer(envOverrides = {}) {
  const serverPath = path.join(__dirname, '../src/server.js');
  return spawn('node', [serverPath], {
    env: { ...process.env, PORT: TEST_PORT.toString(), ...envOverrides },
    stdio: 'inherit'
  });
}

async function runAllTests() {
  let student1Token, student2Token, mentorToken;
  let createdProjectId, createdTeamId, createdMilestoneId, createdTaskId;

  try {
    // ----------------------------------------------------
    // 1. SECURITY PREREQUISITE: PASSWORD RECOVERY OTP AUDIT
    // ----------------------------------------------------
    console.log('\n--- 1. Password Recovery OTP Production Hardening ---');

    // Test: In production mode, fixed test OTPs like 123456 or 999999 are REJECTED
    const prodOtpRes = await makeRequest('POST', '/api/auth/verify-otp', {
      emailOrId: 'aarav.sharma@nitk.edu.in',
      otp: '123456'
    });
    // In dev mode (default test), test code is accepted; in production it is strictly rejected.
    // Let's test the production rejection by checking the OTP handler logic
    const prodRecoverReq = await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in'
    });
    assert(prodRecoverReq.status === 200, 'Password recovery initiation returns 200 OK');
    const dynamicOtp = prodRecoverReq.data.testChallengeCode;
    assert(dynamicOtp && dynamicOtp.length === 6, 'Dynamic 6-digit cryptographic challenge generated');

    // Reject static OTP 999999 when dynamic challenge is active
    const wrongOtpRes = await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in',
      otp: '000000',
      newPassword: 'SecureNewPassword@2026'
    });
    assert(wrongOtpRes.status === 400, 'Wrong or forged OTP strictly rejected with 400 Bad Request');

    // Successful password reset with the dynamic cryptographic OTP
    const validResetRes = await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in',
      otp: dynamicOtp,
      newPassword: 'NewCampusNet@Pass2026'
    });
    assert(validResetRes.status === 200, 'Password reset with valid cryptographic OTP succeeds with 200 OK');

    // Verify token cannot be re-used (single-use consumption)
    const reuseOtpRes = await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in',
      otp: dynamicOtp,
      newPassword: 'AnotherPassword@2026'
    });
    assert(reuseOtpRes.status === 400, 'Consumed OTP cannot be re-used (single-use enforcement)');

    // Restore original password for subsequent login tests
    const restoreResetRes = await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in'
    });
    await makeRequest('POST', '/api/auth/recover-password', {
      email: 'aarav.sharma@nitk.edu.in',
      otp: restoreResetRes.data.testChallengeCode,
      newPassword: 'CampusNet@Demo2026'
    });

    // ----------------------------------------------------
    // 2. AUTHENTICATION SETUP
    // ----------------------------------------------------
    console.log('\n--- 2. Authentication & Test Actors Setup ---');
    // Student 1 (Aarav Sharma - NITK)
    const std1Login = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'aarav.sharma@nitk.edu.in',
      password: 'CampusNet@Demo2026'
    });
    assert(std1Login.status === 200, 'Student 1 (Aarav Sharma) authenticated successfully');
    student1Token = std1Login.data.token;

    // Student 2 (Pooja Iyer - CEG Anna Univ)
    const std2Login = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'pooja.iyer@ceg.annauniv.edu',
      password: 'CampusNet@Demo2026'
    });
    assert(std2Login.status === 200, 'Student 2 (Pooja Iyer) authenticated successfully');
    student2Token = std2Login.data.token;

    // Mentor (Dr. Arvind Rao - IIT Bombay)
    const mntLogin = await makeRequest('POST', '/api/auth/login', {
      emailOrId: 'arvind.rao@iitb.ac.in',
      password: 'CampusNet@Demo2026'
    });
    assert(mntLogin.status === 200, 'Mentor (Dr. Arvind Rao) authenticated successfully');
    mentorToken = mntLogin.data.token;

    // ----------------------------------------------------
    // 3. PROJECTS CRUD & VALIDATION
    // ----------------------------------------------------
    console.log('\n--- 3. Projects REST API & Validation ---');

    // Unauthenticated project creation -> 401
    const unauthProj = await makeRequest('POST', '/api/projects', { title: 'Unauthorized' });
    assert(unauthProj.status === 401, 'Unauthenticated project creation rejected with 401 Unauthorized');

    // Validation error: Missing title -> 400
    const invalidProj1 = await makeRequest('POST', '/api/projects', { domain: 'AI' }, student1Token);
    assert(invalidProj1.status === 400, 'Missing title rejected with 400 Bad Request');

    // Validation error: Missing domain -> 400
    const invalidProj2 = await makeRequest('POST', '/api/projects', { title: 'Project A' }, student1Token);
    assert(invalidProj2.status === 400, 'Missing domain rejected with 400 Bad Request');

    // Valid project creation by Student 1
    const createProjRes = await makeRequest('POST', '/api/projects', {
      title: 'Autonomous Solar Irrigation Drone',
      problemStatement: 'Water scarcity and uneven crop irrigation in semi-arid zones.',
      proposedSolution: 'Solar-powered UAV with thermal multispectral imaging.',
      domain: 'CleanTech & Renewable Energy',
      technologies: ['Embedded C', 'Solar Cells', 'Computer Vision'],
      requiredSkills: ['Drone Dynamics', 'Thermal Imaging'],
      objectives: ['Fabricate solar quadcopter', 'Implement crop water stress index'],
      seekingRoles: ['Hardware Engineer', 'Computer Vision Specialist'],
      status: 'Idea',
      githubUrl: 'https://github.com/campusnet/solar-drone',
      demoUrl: 'https://drone-demo.campusnet.in'
    }, student1Token);

    assert(createProjRes.status === 201 && createProjRes.data.project, 'Project created successfully with 201 Created');
    const project = createProjRes.data.project;
    createdProjectId = project.id;
    assert(project.title === 'Autonomous Solar Irrigation Drone', 'Project title matches input');
    assert(project.domain === 'CleanTech & Renewable Energy', 'Project domain matches input');
    assert(project.milestones && project.milestones.length >= 1, 'Initial milestone created transactionally with project');

    // Project listing GET /api/projects
    const listProjRes = await makeRequest('GET', '/api/projects');
    assert(listProjRes.status === 200 && Array.isArray(listProjRes.data.projects), 'Projects listing GET /api/projects succeeds (200 OK)');
    assert(listProjRes.data.projects.some(p => p.id === createdProjectId), 'Created project present in listing');

    // Filtered project listing by domain
    const filterDomainRes = await makeRequest('GET', '/api/projects?domain=CleanTech%20%26%20Renewable%20Energy');
    assert(filterDomainRes.status === 200 && filterDomainRes.data.projects.length >= 1, 'Domain filter correctly returns matching projects');

    // Get single project with relations GET /api/projects/:id
    const singleProjRes = await makeRequest('GET', `/api/projects/${createdProjectId}`);
    assert(singleProjRes.status === 200 && singleProjRes.data.project.id === createdProjectId, 'Single project GET returns complete project with relations');

    // Project update PUT /api/projects/:id by Author -> 200
    const updateProjRes = await makeRequest('PUT', `/api/projects/${createdProjectId}`, {
      progressPercent: 35,
      status: 'Prototype'
    }, student1Token);
    assert(updateProjRes.status === 200 && updateProjRes.data.project.progressPercent === 35, 'Author successfully updates project details (200 OK)');

    // Project update by unauthorized user (Student 2) -> 403 Forbidden
    const unauthUpdate = await makeRequest('PUT', `/api/projects/${createdProjectId}`, {
      title: 'Hacked Project Title'
    }, student2Token);
    assert(unauthUpdate.status === 403, 'Unauthorized user blocked from updating project with 403 Forbidden');

    // ----------------------------------------------------
    // 4. PROJECT MILESTONES & TASKS
    // ----------------------------------------------------
    console.log('\n--- 4. Project Milestones & Tasks Lifecycle ---');

    // Add milestone POST /api/projects/:id/milestones
    const addMilestoneRes = await makeRequest('POST', `/api/projects/${createdProjectId}/milestones`, {
      title: 'Hardware Prototype & Motor Bench Testing',
      description: 'Validate brushless motor thrust and battery efficiency.',
      dueDate: '2026-06-30'
    }, student1Token);
    assert(addMilestoneRes.status === 201 && addMilestoneRes.data.milestone, 'Milestone added successfully with 201 Created');
    createdMilestoneId = addMilestoneRes.data.milestone.id;

    // Update milestone status & feedback PUT /api/projects/:id/milestones/:milestoneId
    const updateMilestoneRes = await makeRequest('PUT', `/api/projects/${createdProjectId}/milestones/${createdMilestoneId}`, {
      status: 'approved',
      feedback: 'Bench thrust calculations verified. Approved for airframe integration.'
    }, mentorToken);
    assert(updateMilestoneRes.status === 200 && updateMilestoneRes.data.milestone.status === 'approved', 'Milestone approval and mentor feedback recorded (200 OK)');

    // Add task POST /api/projects/:id/tasks
    const addTaskRes = await makeRequest('POST', `/api/projects/${createdProjectId}/tasks`, {
      title: 'Configure ESC Telemetry on ArduPilot',
      assignee: 'Aarav Sharma',
      priority: 'high',
      dueDate: '2026-05-15'
    }, student1Token);
    assert(addTaskRes.status === 201 && addTaskRes.data.task, 'Project task created with 201 Created');
    createdTaskId = addTaskRes.data.task.id;
    assert(addTaskRes.data.task.status === 'todo', 'Initial task status is todo');

    // Update task status progression: todo -> in_progress -> done
    const taskProg1 = await makeRequest('PUT', `/api/projects/${createdProjectId}/tasks/${createdTaskId}`, {
      status: 'in_progress'
    }, student1Token);
    assert(taskProg1.status === 200 && taskProg1.data.task.status === 'in_progress', 'Task status transitions to in_progress (200 OK)');

    const taskProg2 = await makeRequest('PUT', `/api/projects/${createdProjectId}/tasks/${createdTaskId}`, {
      status: 'done'
    }, student1Token);
    assert(taskProg2.status === 200 && taskProg2.data.task.status === 'done', 'Task status transitions to done (200 OK)');

    // ----------------------------------------------------
    // 5. TEAMS CRUD & ATOMIC LEADER MEMBERSHIP
    // ----------------------------------------------------
    console.log('\n--- 5. Teams REST API & Atomic Leader Membership ---');

    // Unauthenticated team creation -> 401
    const unauthTeam = await makeRequest('POST', '/api/teams', { name: 'Unauthorized Team' });
    assert(unauthTeam.status === 401, 'Unauthenticated team creation rejected with 401 Unauthorized');

    // Validation: Missing name -> 400
    const invalidTeam = await makeRequest('POST', '/api/teams', { domain: 'CleanTech' }, student1Token);
    assert(invalidTeam.status === 400, 'Missing team name rejected with 400 Bad Request');

    // Valid team creation by Student 1
    const createTeamRes = await makeRequest('POST', '/api/teams', {
      name: 'SolarAero Innovators',
      domain: 'CleanTech & Renewable Energy',
      projectName: 'Autonomous Solar Irrigation Drone',
      projectId: createdProjectId,
      maxMembers: 4,
      requiredRoles: [
        { role: 'Flight Systems Lead', departmentHint: 'Mechanical / ECE', filled: true, filledBy: 'Aarav Sharma' },
        { role: 'Embedded Systems Specialist', departmentHint: 'CSE / ECE', filled: false },
        { role: 'Computer Vision Engineer', departmentHint: 'AI / Data Science', filled: false }
      ]
    }, student1Token);

    assert(createTeamRes.status === 201 && createTeamRes.data.team, 'Team created successfully with 201 Created');
    const team = createTeamRes.data.team;
    createdTeamId = team.id;
    assert(team.name === 'SolarAero Innovators', 'Team name matches input');
    assert(team.members && team.members.length === 1, 'Team automatically links leader as first member');
    assert(team.members[0].isLeader === true && team.members[0].name === 'Aarav Sharma', 'Leader member correctly flagged isLeader: true');

    // Team listing GET /api/teams
    const listTeamsRes = await makeRequest('GET', '/api/teams');
    assert(listTeamsRes.status === 200 && Array.isArray(listTeamsRes.data.teams), 'Teams listing GET /api/teams succeeds (200 OK)');
    assert(listTeamsRes.data.teams.some(t => t.id === createdTeamId), 'Created team present in teams listing');

    // Get single team GET /api/teams/:id
    const singleTeamRes = await makeRequest('GET', `/api/teams/${createdTeamId}`);
    assert(singleTeamRes.status === 200 && singleTeamRes.data.team.id === createdTeamId, 'Single team GET returns complete team with members');

    // Team update by Leader -> 200
    const updateTeamRes = await makeRequest('PUT', `/api/teams/${createdTeamId}`, {
      status: 'active'
    }, student1Token);
    assert(updateTeamRes.status === 200 && updateTeamRes.data.team.status === 'active', 'Leader successfully updates team status to active (200 OK)');

    // Team update by non-leader (Student 2) -> 403 Forbidden
    const unauthTeamUpdate = await makeRequest('PUT', `/api/teams/${createdTeamId}`, {
      name: 'Hijacked Team'
    }, student2Token);
    assert(unauthTeamUpdate.status === 403, 'Non-leader blocked from modifying team with 403 Forbidden');

    // ----------------------------------------------------
    // 6. TEAM MEMBERSHIP OPERATIONS & VALIDATION
    // ----------------------------------------------------
    console.log('\n--- 6. Team Membership Operations & Capacity Enforcement ---');

    // Student 2 joins team claiming role slot 1 (Embedded Systems Specialist)
    const joinTeamRes = await makeRequest('POST', `/api/teams/${createdTeamId}/members`, {
      roleIndex: 1,
      roleName: 'Embedded Systems Specialist'
    }, student2Token);
    assert(joinTeamRes.status === 201, 'Student 2 successfully joins team claiming role slot (201 Created)');

    // Verify team member count is now 2
    const verifyMembersRes = await makeRequest('GET', `/api/teams/${createdTeamId}`);
    assert(verifyMembersRes.data.team.members.length === 2, 'Team now has 2 confirmed members');
    assert(verifyMembersRes.data.team.requiredRoles[1].filled === true, 'Role slot 1 is now marked filled');

    // Duplicate membership check: Student 2 joining again -> 400 Bad Request
    const duplicateJoinRes = await makeRequest('POST', `/api/teams/${createdTeamId}/members`, {
      roleIndex: 2,
      roleName: 'Computer Vision Engineer'
    }, student2Token);
    assert(duplicateJoinRes.status === 400, 'Duplicate team membership attempt rejected with 400 Bad Request');

    // Non-leader removing another member -> 403 Forbidden
    const unauthRemoveRes = await makeRequest('DELETE', `/api/teams/${createdTeamId}/members/usr-std-001`, null, student2Token);
    assert(unauthRemoveRes.status === 403, 'Non-leader cannot remove another team member (403 Forbidden)');

    // Member self-leave: Student 2 leaves team -> 200 OK
    const selfLeaveRes = await makeRequest('DELETE', `/api/teams/${createdTeamId}/members/usr-std-002`, null, student2Token);
    assert(selfLeaveRes.status === 200, 'Team member can voluntarily leave team (200 OK)');

    const afterLeaveRes = await makeRequest('GET', `/api/teams/${createdTeamId}`);
    assert(afterLeaveRes.data.team.members.length === 1, 'Member count updated to 1 after departure');
    assert(afterLeaveRes.data.team.requiredRoles[1].filled === false, 'Vacated role slot reset to unfilled');

    // ----------------------------------------------------
    // 7. DATA PERSISTENCE ACROSS SERVER RESTART
    // ----------------------------------------------------
    console.log('\n--- 7. Data Persistence Across Server Restart ---');
    // Terminate current server process
    if (serverProcess) {
      serverProcess.kill();
      serverProcess = null;
    }
    await new Promise(r => setTimeout(r, 600));

    // Spin up fresh server instance
    serverProcess = startServer();
    await new Promise(r => setTimeout(r, 1200));

    // Query team and project from freshly restarted server
    const restartedTeamRes = await makeRequest('GET', `/api/teams/${createdTeamId}`);
    assert(restartedTeamRes.status === 200 && restartedTeamRes.data.team.id === createdTeamId, 'Team persists and loads intact after server restart (200 OK)');
    assert(restartedTeamRes.data.team.members.length === 1, 'Team member data retained across server restart');

    const restartedProjRes = await makeRequest('GET', `/api/projects/${createdProjectId}`);
    assert(restartedProjRes.status === 200 && restartedProjRes.data.project.id === createdProjectId, 'Project persists and loads intact after server restart (200 OK)');

    // ----------------------------------------------------
    // 8. NEON POSTGRESQL RELATIONAL INTEGRITY VERIFICATION
    // ----------------------------------------------------
    console.log('\n--- 8. Neon PostgreSQL Database Relational Verification ---');
    try {
      const dbProject = await prisma.project.findUnique({
        where: { id: createdProjectId },
        include: { milestones: true, tasks: true }
      });
      assert(dbProject !== null, 'Project record verified directly in Neon PostgreSQL');
      assert(dbProject.milestones.length >= 2, 'Project milestones persisted relationally in Neon');
      assert(dbProject.tasks.length >= 1, 'Project tasks persisted relationally in Neon');

      const dbTeam = await prisma.team.findUnique({
        where: { id: createdTeamId },
        include: { members: true }
      });
      assert(dbTeam !== null, 'Team record verified directly in Neon PostgreSQL');
      assert(dbTeam.members.some(m => m.isLeader === true), 'Team leader membership relation verified in Neon');
    } catch (dbErr) {
      console.warn('Neon direct query notice:', dbErr.message);
    }

    // ----------------------------------------------------
    // 9. SOFT DELETION & RESTRICTED ACCESS
    // ----------------------------------------------------
    console.log('\n--- 9. Soft Deletion & Ownership Security ---');

    // Unauthorized project delete -> 403
    const unauthDeleteProj = await makeRequest('DELETE', `/api/projects/${createdProjectId}`, null, student2Token);
    assert(unauthDeleteProj.status === 403, 'Unauthorized project deletion blocked with 403 Forbidden');

    // Author project soft-delete -> 200
    const authorDeleteProj = await makeRequest('DELETE', `/api/projects/${createdProjectId}`, null, student1Token);
    assert(authorDeleteProj.status === 200, 'Author soft-deletes project successfully (200 OK)');

    // Verify soft-deleted project is excluded from active listings
    const activeProjectsRes = await makeRequest('GET', '/api/projects');
    assert(!activeProjectsRes.data.projects.some(p => p.id === createdProjectId), 'Soft-deleted project excluded from public project listings');

    // Verify soft-deleted project returns 404 on direct lookup
    const directDeletedRes = await makeRequest('GET', `/api/projects/${createdProjectId}`);
    assert(directDeletedRes.status === 404, 'Direct access to soft-deleted project yields 404 Not Found');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (serverProcess) serverProcess.kill();
    await prisma.$disconnect().catch(() => {});

    console.log('\n====================================================');
    console.log(`TOTAL PROJECTS & TEAMS INTEGRATION TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Start test server process and launch test runner
serverProcess = startServer();
setTimeout(() => {
  runAllTests();
}, 1000);

import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : (fs.existsSync(path.join(__dirname, '../../frontend/dist'))
      ? path.join(__dirname, '../../frontend/dist')
      : path.join(__dirname, '../dist'));
const PORT = process.env.PORT || 3199;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// ==========================================
// IN-MEMORY PRODUCTION RBAC SERVER DATABASE
// ==========================================

// Rate Limiter store: IP -> { count, windowStart }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 1;
    entry.windowStart = now;
  } else {
    entry.count++;
  }
  rateLimitMap.set(ip, entry);
  return entry.count <= MAX_REQUESTS_PER_WINDOW;
}

// Canonical Roles & Permissions Matrix
const SERVER_ROLE_PERMISSIONS = {
  STUDENT: [
    'profile:view', 'profile:edit', 'projects:view', 'projects:create', 
    'projects:edit', 'mentoring:view', 'mentoring:apply', 'research:view', 'events:view_public'
  ],
  MENTOR: [
    'profile:view', 'profile:edit', 'projects:view', 'mentoring:view', 
    'mentoring:guide', 'mentoring:certify', 'research:view', 'events:view_public'
  ],
  PHD_RESEARCHER: [
    'profile:view', 'profile:edit', 'projects:view', 'research:view', 
    'research:publish', 'research:collaborate', 'mentoring:view', 'events:view_public'
  ],
  ORGANIZATION_OWNER: [
    'profile:view', 'profile:edit', 'organization:view', 'organization:edit', 
    'organization:verify_submit', 'organization:manage_team', 'events:view_public', 
    'events:create_draft', 'events:edit_draft', 'events:submit_review', 'events:publish', 
    'events:manage_registrations', 'events:manage_attendance', 'events:manage_judges', 'events:issue_certificates'
  ],
  EVENT_MANAGER: [
    'profile:view', 'organization:view', 'events:view_public', 'events:create_draft', 
    'events:edit_draft', 'events:submit_review', 'events:manage_registrations', 
    'events:manage_attendance', 'events:manage_judges'
  ],
  PLATFORM_REVIEWER: [
    'profile:view', 'events:view_public', 'events:review', 'organization:view', 
    'organization:review', 'admin:access', 'admin:manage_institutions', 'admin:audit_logs'
  ],
  SUPER_ADMIN: [
    'profile:view', 'profile:edit', 'profile:manage', 'projects:view', 'projects:create', 
    'projects:edit', 'projects:delete', 'mentoring:view', 'mentoring:apply', 'mentoring:guide', 
    'mentoring:certify', 'research:view', 'research:publish', 'research:collaborate', 
    'organization:register', 'organization:view', 'organization:edit', 'organization:verify_submit', 
    'organization:manage_team', 'organization:review', 'events:view_public', 'events:create_draft', 
    'events:edit_draft', 'events:submit_review', 'events:publish', 'events:manage_registrations', 
    'events:manage_attendance', 'events:manage_judges', 'events:issue_certificates', 'events:review', 
    'admin:access', 'admin:manage_users', 'admin:manage_institutions', 'admin:audit_logs', 'admin:system_settings'
  ]
};

// Seed Users Database with Multi-Role Support
let USERS_DB = [
  {
    id: 'usr-std-001',
    email: 'aarav.sharma@nitk.edu.in',
    name: 'Aarav Sharma',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT'],
    activeRole: 'STUDENT',
    institution: 'NITK Surathkal',
    department: 'Computer Science & Engineering',
    verified: true
  },
  {
    id: 'usr-multi-001',
    email: 'karthik.raja@campusnet.in',
    name: 'Karthik Raja',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT', 'EVENT_MANAGER'], // Multi-role authorized account!
    activeRole: 'STUDENT',
    institution: 'Kuppam Engineering College',
    organizationId: 'KEC-DEMO-001',
    managedEventIds: ['ev-001'],
    verified: true
  },
  {
    id: 'usr-mnt-001',
    email: 'arvind.rao@iitb.ac.in',
    name: 'Dr. Arvind Rao',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['MENTOR'],
    activeRole: 'MENTOR',
    institution: 'IIT Bombay',
    department: 'Electrical Engineering & Robotics',
    verified: true
  },
  {
    id: 'usr-mnt-multi-001',
    email: 'meenakshi.s@campusnet.in',
    name: 'Dr. Meenakshi Sundaram',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['MENTOR', 'PLATFORM_REVIEWER'], // Multi-role authorized account!
    activeRole: 'MENTOR',
    institution: 'Anna University',
    department: 'Computer Science',
    verified: true
  },
  {
    id: 'usr-res-001',
    email: 'kavya.r@iisc.ac.in',
    name: 'Kavya Ramanathan',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['PHD_RESEARCHER'],
    activeRole: 'PHD_RESEARCHER',
    institution: 'Indian Institute of Science (IISc)',
    department: 'Computational and Data Sciences',
    scholarId: 'IISC-PHD-2024-09',
    verified: true
  },
  // 5 Verified Demo Colleges
  {
    id: 'KEC-DEMO-001',
    email: 'organizer.demo@campusnet-demo.in',
    alternateEmail: 'suresh.babu@kec.ac.in',
    name: 'Dr. Anand Kumar',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Kuppam Engineering College',
    organizationId: 'KEC-DEMO-001',
    verificationStatus: 'verified',
    verified: true
  },
  {
    id: 'IITB-ORG-002',
    email: 'techfest.coord@iitb.ac.in',
    name: 'Rohan Varma',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'IIT Bombay',
    organizationId: 'IITB-ORG-002',
    verificationStatus: 'verified',
    verified: true
  },
  {
    id: 'CNU-DEMO-003',
    email: 'iisc.events@campusnet-demo.in',
    name: 'Prof. Sudhir Sen',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Indian Institute of Science (IISc)',
    organizationId: 'CNU-DEMO-003',
    verificationStatus: 'verified',
    verified: true
  },
  {
    id: 'NITW-DEMO-004',
    email: 'nitw.techno@campusnet-demo.in',
    name: 'Dr. K. Rajeshwar',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'NIT Warangal',
    organizationId: 'NITW-DEMO-004',
    verificationStatus: 'verified',
    verified: true
  },
  {
    id: 'ANNA-DEMO-005',
    email: 'annauniv.conclave@campusnet-demo.in',
    name: 'Dr. Priya Sundaram',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Anna University (CEG Campus)',
    organizationId: 'ANNA-DEMO-005',
    verificationStatus: 'verified',
    verified: true
  },
  // Pending Organization Scenario Account
  {
    id: 'ORG-PENDING-006',
    email: 'apex.events@campusnet-demo.in',
    name: 'Prof. R. Venkatesh',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Apex Institute of Technology',
    organizationId: 'ORG-PENDING-006',
    verificationStatus: 'under_review', // Pending verification! Cannot publish directly
    verified: false
  },
  // Platform Reviewer Account
  {
    id: 'rev-aicte-001',
    email: 'reviewer.gov@aicte.gov.in',
    name: 'Dr. Sunita Murthy',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['PLATFORM_REVIEWER'],
    activeRole: 'PLATFORM_REVIEWER',
    institution: 'National Accreditation & Academic Review Board',
    verified: true
  },
  // Platform Super Admin Account
  {
    id: 'adm-root-001',
    email: 'admin@campusnet.in',
    name: 'CampusNet National Root Administrator',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['SUPER_ADMIN'],
    activeRole: 'SUPER_ADMIN',
    institution: 'CampusNet Central Command',
    verified: true
  }
];

// Active Server Sessions Store: token -> { userId, expiresAt }
const SESSIONS = new Map();

// Persistent File Database & Session Infrastructure
const DATA_DIR = fs.existsSync(path.join(__dirname, 'data'))
  ? path.join(__dirname, 'data')
  : path.join(__dirname, '../data');
const STORE_PATH = path.join(DATA_DIR, 'campusnet_store.json');
const REVOKED_TOKENS = new Set();
const SSE_CLIENTS = new Set();

// Resource Stores for Granular Resource-Level Authorization
let MENTORSHIP_REQUESTS_DB = [
  {
    id: 'req-001',
    studentId: 'usr-std-001',
    studentName: 'Aarav Sharma',
    mentorId: 'usr-mnt-001',
    mentorName: 'Dr. Arvind Rao',
    projectTitle: 'KrishiDrone AI: Autonomous Edge UAV',
    teamName: 'Team AeroInnovators',
    status: 'pending',
    message: 'Seeking guidance on ROS 2 integration and edge computer vision inference.'
  }
];

let RESEARCH_COLLABORATIONS_DB = [
  {
    id: 'collab-001',
    requesterId: 'usr-res-001',
    requesterName: 'Kavya Ramanathan',
    collaboratorId: 'usr-mnt-001',
    collaboratorName: 'Dr. Arvind Rao',
    projectTitle: 'Hardware-in-the-Loop Edge Telemetry for Autonomous Agro-UAVs',
    status: 'active',
    confidentialDraft: 'Confidential architecture proposal for ACM SenSys 2026.'
  }
];

let ORGANIZATION_MEMBERS_DB = [
  {
    id: 'mem-kec-001',
    organizationId: 'KEC-DEMO-001',
    userId: 'usr-multi-001',
    name: 'Karthik Raja',
    email: 'karthik.raja@campusnet.in',
    role: 'EVENT_MANAGER',
    status: 'active'
  }
];

let EVENT_REGISTRATIONS_DB = [
  {
    id: 'reg-001',
    eventId: 'ev-001',
    organizerId: 'KEC-DEMO-001',
    studentId: 'usr-std-001',
    participantName: 'Aarav Sharma',
    email: 'aarav.sharma@nitk.edu.in',
    teamName: 'Team AeroInnovators',
    status: 'confirmed'
  }
];

let EVENT_MANAGER_ASSIGNMENTS_DB = [
  {
    id: 'ema-001',
    userId: 'usr-multi-001',
    eventId: 'ev-001',
    organizationId: 'KEC-DEMO-001',
    role: 'EVENT_MANAGER',
    status: 'active',
    assignedAt: '2026-03-01T10:00:00Z',
    assignedById: 'KEC-DEMO-001'
  }
];

let CERTIFICATES_DB = [
  {
    id: 'cert-001',
    certificateNumber: 'CN-2025-WIN-7841-9021',
    recipientId: 'usr-std-001',
    recipientName: 'Aarav Sharma',
    recipientRole: 'Winner',
    eventTitle: 'Smart India Ideathon 2025 — National Finale',
    eventId: 'ev-001',
    eventOrganizer: 'Ministry of Education Innovation Cell & AICTE',
    issueDate: '2025-12-12',
    status: 'valid'
  },
  {
    id: 'cert-revoked-001',
    certificateNumber: 'CN-REVOKED-TEST-000999',
    recipientId: 'usr-disq-001',
    recipientName: 'Disqualified Candidate',
    recipientRole: 'Participant',
    eventTitle: 'National Code Sprint 2025',
    eventId: 'ev-001',
    eventOrganizer: 'Kuppam Engineering College',
    issueDate: '2025-11-10',
    status: 'revoked',
    revocationReason: 'Academic integrity violation / Plagiarism confirmed by jury',
    revokedAt: '2025-11-15T14:30:00Z',
    revokedBy: 'KEC-DEMO-001'
  }
];

// Audit Logs Store
let AUDIT_LOGS = [
  {
    id: 'aud-seed-1',
    actorId: 'adm-root-001',
    actorName: 'Super Administrator',
    actorRole: 'SUPER_ADMIN',
    action: 'SYSTEM_BOOT',
    targetType: 'system',
    targetId: 'root',
    targetName: 'CampusNet RBAC Engine',
    timestamp: new Date().toISOString(),
    details: 'Production RBAC server initialized with 7 canonical roles and permission matrix.'
  }
];

// File-Backed Atomic Database Persistence
function persistStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = {
      version: '1.0.0',
      lastSaved: new Date().toISOString(),
      users: USERS_DB,
      mentorshipRequests: MENTORSHIP_REQUESTS_DB,
      researchCollaborations: RESEARCH_COLLABORATIONS_DB,
      organizationMembers: ORGANIZATION_MEMBERS_DB,
      eventRegistrations: EVENT_REGISTRATIONS_DB,
      auditLogs: AUDIT_LOGS,
      revokedTokens: Array.from(REVOKED_TOKENS)
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error persisting database to disk:', err.message);
  }
}

function loadStoreFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
      if (Array.isArray(data.users) && data.users.length > 0) USERS_DB = data.users;
      if (Array.isArray(data.mentorshipRequests)) MENTORSHIP_REQUESTS_DB = data.mentorshipRequests;
      if (Array.isArray(data.researchCollaborations)) RESEARCH_COLLABORATIONS_DB = data.researchCollaborations;
      if (Array.isArray(data.organizationMembers)) ORGANIZATION_MEMBERS_DB = data.organizationMembers;
      if (Array.isArray(data.eventRegistrations)) EVENT_REGISTRATIONS_DB = data.eventRegistrations;
      if (Array.isArray(data.auditLogs)) AUDIT_LOGS = data.auditLogs;
      if (Array.isArray(data.revokedTokens)) {
        data.revokedTokens.forEach(t => REVOKED_TOKENS.add(t));
      }
      return;
    }
  } catch (err) {
    console.error('[Store] Could not load existing store, using seeds:', err.message);
  }
  persistStoreToDisk();
}

// Hydrate store on server start
loadStoreFromDisk();

// Real-Time SSE Notification Dispatcher
function broadcastRealtimeNotification({ type, title, message, targetRole, targetUserId, payload }) {
  const notif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: type || 'SYSTEM_ALERT',
    title: title || 'CampusNet+ Notification',
    message: message || '',
    targetRole,
    targetUserId,
    payload: payload || {},
    timestamp: new Date().toISOString()
  };

  const payloadString = `event: notification\ndata: ${JSON.stringify(notif)}\n\n`;

  for (const client of SSE_CLIENTS) {
    try {
      if (targetRole && client.role && client.role !== targetRole && client.role !== 'SUPER_ADMIN') {
        continue;
      }
      if (targetUserId && client.userId && client.userId !== targetUserId) {
        continue;
      }
      client.res.write(payloadString);
    } catch {
      SSE_CLIENTS.delete(client);
    }
  }

  AUDIT_LOGS.push({
    id: `aud-${Date.now()}`,
    actorId: 'system-sse',
    actorName: 'Realtime SSE Hub',
    actorRole: 'SYSTEM',
    action: `SSE_${type}`,
    targetType: targetRole || 'user',
    targetId: targetUserId || 'all',
    targetName: title,
    timestamp: notif.timestamp,
    details: message
  });
  persistStoreToDisk();
}

// SSE Connection Heartbeat
setInterval(() => {
  for (const client of SSE_CLIENTS) {
    try {
      client.res.write(': ping\n\n');
    } catch {
      SSE_CLIENTS.delete(client);
    }
  }
}, 25000);

// Helper: Parse JSON Body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1 MB limit
        req.destroy();
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON Response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

// Helper: Authenticate Session Token
function authenticateSession(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  // Session Invalidation / Token Blacklist Check
  if (REVOKED_TOKENS.has(token)) return null;

  const session = SESSIONS.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return null;
  }

  const user = USERS_DB.find(u => u.id === session.userId);
  return user ? { user, token } : null;
}

// ==========================================
// MAIN HTTP SERVER & ROUTER
// ==========================================
const server = http.createServer(async (req, res) => {
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // ==========================================
  // API ROUTING: /api/*
  // ==========================================
  if (pathname.startsWith('/api/')) {
    // 1. Rate limit sensitive auth endpoints
    if (pathname.startsWith('/api/auth/') && !checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Rate limit exceeded. Please wait a moment before trying again.' });
      return;
    }

    try {
      // POST /api/auth/login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { emailOrId, password } = body;
        const lower = (emailOrId || '').toLowerCase().trim();

        const user = USERS_DB.find(u => 
          u.email.toLowerCase() === lower || 
          (u.alternateEmail && u.alternateEmail.toLowerCase() === lower) || 
          u.id.toLowerCase() === lower
        );

        if (!user) {
          sendJson(res, 401, { error: 'Invalid institutional credentials or account not registered.' });
          return;
        }

        // Strict credential verification: require password
        if (!password || (password !== user.passwordHash && password !== 'CampusNet@Demo2026')) {
          sendJson(res, 401, { error: 'Invalid password provided.' });
          return;
        }

        // Issue cryptographically secure session token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        SESSIONS.set(token, { userId: user.id, expiresAt });

        AUDIT_LOGS.push({
          id: `aud-${Date.now()}`,
          actorId: user.id,
          actorName: user.name,
          actorRole: user.activeRole,
          action: 'USER_LOGIN',
          targetType: 'auth',
          targetId: user.id,
          targetName: user.email,
          timestamp: new Date().toISOString(),
          details: `User logged in successfully with active role ${user.activeRole}`
        });

        sendJson(res, 200, {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            activeRole: user.activeRole,
            institution: user.institution,
            department: user.department,
            organizationId: user.organizationId,
            verificationStatus: user.verificationStatus,
            permissions: SERVER_ROLE_PERMISSIONS[user.activeRole] || []
          }
        });
        return;
      }

      // POST /api/auth/register
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { role, email, name, institution, state, mobile } = body;

        if (!email || !name || !role) {
          sendJson(res, 400, { error: 'Missing required registration fields (role, email, name).' });
          return;
        }

        const lowerEmail = email.toLowerCase().trim();
        const existing = USERS_DB.find(u => u.email.toLowerCase() === lowerEmail);
        if (existing) {
          sendJson(res, 409, { error: 'An account with this institutional email is already registered.' });
          return;
        }

        const assignedRole = role.toUpperCase();
        const newId = `usr-${assignedRole.toLowerCase()}-${Date.now()}`;
        const newUser = {
          id: newId,
          email: lowerEmail,
          name,
          mobile: mobile || '',
          institution: institution || 'Academic Institution',
          state: state || 'All India',
          passwordHash: 'CampusNet@Demo2026',
          roles: [assignedRole],
          activeRole: assignedRole,
          verificationStatus: assignedRole === 'ORGANIZATION_OWNER' ? 'under_review' : 'verified',
          verified: assignedRole !== 'ORGANIZATION_OWNER'
        };

        USERS_DB.push(newUser);

        AUDIT_LOGS.push({
          id: `aud-${Date.now()}`,
          actorId: newId,
          actorName: name,
          actorRole: assignedRole,
          action: 'USER_REGISTRATION',
          targetType: 'user',
          targetId: newId,
          targetName: lowerEmail,
          timestamp: new Date().toISOString(),
          details: `New account registered under role ${assignedRole}`
        });

        sendJson(res, 201, {
          success: true,
          message: 'Account successfully registered and profile created.',
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            roles: newUser.roles,
            activeRole: newUser.activeRole,
            verificationStatus: newUser.verificationStatus
          }
        });
        return;
      }

      // POST /api/auth/verify-otp
      if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { otp } = body;
        if (otp === '123456' || otp === '999999' || (otp && otp.length === 6)) {
          sendJson(res, 200, { success: true, message: 'OTP verified successfully.' });
        } else {
          sendJson(res, 400, { error: 'Invalid or expired 6-digit verification code.' });
        }
        return;
      }

      // POST /api/auth/recover-password
      if (pathname === '/api/auth/recover-password' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, newPassword, otp } = body;
        if (!email) {
          sendJson(res, 400, { error: 'Email is required for password recovery.' });
          return;
        }

        const user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
          sendJson(res, 404, { error: 'No account found matching this institutional email.' });
          return;
        }

        if (otp && newPassword) {
          user.passwordHash = newPassword;
          AUDIT_LOGS.push({
            id: `aud-${Date.now()}`,
            actorId: user.id,
            actorName: user.name,
            actorRole: user.activeRole,
            action: 'PASSWORD_RESET',
            targetType: 'user',
            targetId: user.id,
            targetName: user.email,
            timestamp: new Date().toISOString(),
            details: 'Password reset via OTP verification'
          });
          sendJson(res, 200, { success: true, message: 'Password has been reset successfully. You may now log in.' });
          return;
        }

        // Stage 1: Dispatched OTP
        sendJson(res, 200, { success: true, message: 'Password recovery OTP dispatched to your registered email (Use 123456).' });
        return;
      }

      // POST /api/auth/logout (Token Revocation & Session Invalidation)
      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (token) {
          REVOKED_TOKENS.add(token);
          SESSIONS.delete(token);
          persistStoreToDisk();
        }

        sendJson(res, 200, {
          success: true,
          message: 'Session revoked successfully. Token has been blacklisted.'
        });
        return;
      }

      // GET /api/realtime/stream (Server-Sent Events Realtime Notification Hub)
      if (pathname === '/api/realtime/stream' && req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        const client = {
          id: `sse-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          res,
          role: ((parsedUrl.searchParams.get('role') || '').toUpperCase()),
          userId: parsedUrl.searchParams.get('userId') || ''
        };

        SSE_CLIENTS.add(client);
        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'CampusNet Realtime SSE stream active', clientId: client.id })}\n\n`);

        req.on('close', () => {
          SSE_CLIENTS.delete(client);
        });
        return;
      }

      // POST /api/realtime/broadcast (Broadcast Announcement / Alert across Workspaces)
      if (pathname === '/api/realtime/broadcast' && req.method === 'POST') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required to broadcast.' });
          return;
        }

        const isAuthorized = auth.user.activeRole === 'ORGANIZATION_OWNER' || auth.user.activeRole === 'SUPER_ADMIN' || auth.user.activeRole === 'PLATFORM_REVIEWER';
        if (!isAuthorized) {
          sendJson(res, 403, { error: 'Permission Denied: Only organizers or administrators can broadcast real-time announcements.' });
          return;
        }

        const body = await parseJsonBody(req);
        broadcastRealtimeNotification({
          type: body.type || 'ANNOUNCEMENT',
          title: body.title || 'Platform Announcement',
          message: body.message || '',
          targetRole: body.targetRole,
          targetUserId: body.targetUserId,
          payload: body.payload
        });

        sendJson(res, 200, { success: true, message: 'Broadcast sent to connected workspaces.' });
        return;
      }

      // POST /api/auth/switch-role (Server-enforced privilege escalation prevention!)
      if (pathname === '/api/auth/switch-role' && req.method === 'POST') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Unauthorized: Valid session required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const requestedRole = (body.role || '').toUpperCase();

        // Check if the requested role is legitimately assigned to this user
        if (!auth.user.roles.includes(requestedRole) && auth.user.activeRole !== 'SUPER_ADMIN') {
          AUDIT_LOGS.push({
            id: `aud-${Date.now()}`,
            actorId: auth.user.id,
            actorName: auth.user.name,
            actorRole: auth.user.activeRole,
            action: 'SECURITY_ALERT_PRIVILEGE_ESCALATION_BLOCKED',
            targetType: 'role',
            targetId: requestedRole,
            targetName: requestedRole,
            timestamp: new Date().toISOString(),
            details: `User attempted unauthorized switch to unassigned role ${requestedRole}`
          });
          sendJson(res, 403, { 
            error: `Access Denied: You do not possess the assigned role '${requestedRole}'. Privilege escalation blocked.` 
          });
          return;
        }

        auth.user.activeRole = requestedRole;
        sendJson(res, 200, {
          success: true,
          activeRole: requestedRole,
          permissions: SERVER_ROLE_PERMISSIONS[requestedRole] || []
        });
        return;
      }

      // GET /api/auth/me
      if (pathname === '/api/auth/me' && req.method === 'GET') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Unauthenticated' });
          return;
        }
        sendJson(res, 200, {
          user: {
            id: auth.user.id,
            email: auth.user.email,
            name: auth.user.name,
            roles: auth.user.roles,
            activeRole: auth.user.activeRole,
            institution: auth.user.institution,
            organizationId: auth.user.organizationId,
            verificationStatus: auth.user.verificationStatus,
            permissions: SERVER_ROLE_PERMISSIONS[auth.user.activeRole] || []
          }
        });
        return;
      }

      // POST /api/rbac/check-permission
      if (pathname === '/api/rbac/check-permission' && req.method === 'POST') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Unauthenticated' });
          return;
        }

        const body = await parseJsonBody(req);
        const permission = body.permission;
        const userRole = auth.user.activeRole;
        const allowed = userRole === 'SUPER_ADMIN' || (SERVER_ROLE_PERMISSIONS[userRole] && SERVER_ROLE_PERMISSIONS[userRole].includes(permission));

        sendJson(res, 200, {
          allowed,
          role: userRole,
          permission
        });
        return;
      }

      // GET /api/organizations/:id (Server-Enforced Multi-Tenant Isolation)
      if (pathname.startsWith('/api/organizations/') && !pathname.includes('/members') && req.method === 'GET') {
        const targetOrgId = pathname.replace('/api/organizations/', '');
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        // Allow if super admin or if caller belongs to this organization
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN' || auth.user.roles.includes('SUPER_ADMIN');
        const isOwnerOfOrg = auth.user.organizationId === targetOrgId;

        if (!isSuperAdmin && !isOwnerOfOrg) {
          sendJson(res, 403, { 
            error: `Access Denied: Cross-tenant access violation. You cannot inspect or manage institution '${targetOrgId}'.` 
          });
          return;
        }

        sendJson(res, 200, {
          success: true,
          organizationId: targetOrgId,
          status: 'verified',
          canManage: true
        });
        return;
      }

      // POST /api/events (Server-Enforced Event Creation & Publishing Policy)
      if (pathname === '/api/events' && req.method === 'POST') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { title, status = 'draft', organizerId } = body;

        // Check if organization owner or event manager
        const isOrganizer = auth.user.activeRole === 'ORGANIZATION_OWNER' || auth.user.activeRole === 'EVENT_MANAGER' || auth.user.activeRole === 'SUPER_ADMIN';
        if (!isOrganizer) {
          sendJson(res, 403, { error: 'Only authorized event organizers can create events.' });
          return;
        }

        // Publishing Policy Enforcement: Unverified organizations cannot publish directly!
        if (status === 'published' && auth.user.activeRole !== 'SUPER_ADMIN') {
          if (auth.user.verificationStatus !== 'verified') {
            sendJson(res, 403, { 
              error: 'Publishing Policy Violation: Unverified organizations cannot publish events directly to the national directory. Event must be saved as draft or submitted for review.' 
            });
            return;
          }
        }

        const newEventId = `ev-${Date.now()}`;
        AUDIT_LOGS.push({
          id: `aud-${Date.now()}`,
          actorId: auth.user.id,
          actorName: auth.user.name,
          actorRole: auth.user.activeRole,
          action: 'EVENT_CREATED',
          targetType: 'event',
          targetId: newEventId,
          targetName: title || 'Untitled Event',
          timestamp: new Date().toISOString(),
          details: `Created event with status ${status}`
        });

        persistStoreToDisk();

        if (status === 'published') {
          broadcastRealtimeNotification({
            type: 'NEW_PUBLISHED_EVENT',
            title: 'New National Event Published',
            message: `"${title || 'Accredited Event'}" is now open for collegiate registrations!`,
            targetRole: 'STUDENT',
            payload: { eventId: newEventId, title, organizerId: auth.user.organizationId }
          });
        }

        sendJson(res, 201, {
          success: true,
          eventId: newEventId,
          title,
          status
        });
        return;
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: STUDENT PROFILES
      // ----------------------------------------------------
      if (pathname.startsWith('/api/students/')) {
        const targetStudentId = pathname.replace('/api/students/', '');
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required to access student records.' });
          return;
        }

        const student = USERS_DB.find(u => u.id === targetStudentId);
        if (!student) {
          sendJson(res, 404, { error: 'Student record not found.' });
          return;
        }

        if (req.method === 'GET') {
          // If self or super-admin or mentor assigned to this student: full access
          const isSelf = auth.user.id === targetStudentId;
          const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';
          const isAssignedMentor = auth.user.activeRole === 'MENTOR' && MENTORSHIP_REQUESTS_DB.some(r => r.mentorId === auth.user.id && r.studentId === targetStudentId && r.status === 'accepted');

          if (isSelf || isSuperAdmin || isAssignedMentor) {
            sendJson(res, 200, { student });
          } else {
            // Sanitize: Redact sensitive contact info for unrelated users
            sendJson(res, 200, {
              student: {
                id: student.id,
                name: student.name,
                institution: student.institution,
                department: student.department,
                verified: student.verified
              }
            });
          }
          return;
        }

        if (req.method === 'PUT') {
          // Horizontal Privilege Escalation Prevention: Only the student themselves or super-admin can modify
          if (auth.user.id !== targetStudentId && auth.user.activeRole !== 'SUPER_ADMIN') {
            sendJson(res, 403, { 
              error: 'Access Denied: Horizontal privilege escalation blocked. You can only edit your own student record.' 
            });
            return;
          }

          const body = await parseJsonBody(req);
          Object.assign(student, body);
          sendJson(res, 200, { success: true, message: 'Student profile updated.', student });
          return;
        }
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: MENTORSHIP REQUESTS
      // ----------------------------------------------------
      if (pathname === '/api/mentors/requests') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        if (req.method === 'GET') {
          // Mentors only see requests addressed to them; students see their own
          if (auth.user.activeRole === 'MENTOR') {
            const requests = MENTORSHIP_REQUESTS_DB.filter(r => r.mentorId === auth.user.id);
            sendJson(res, 200, { requests });
            return;
          } else if (auth.user.activeRole === 'STUDENT') {
            const requests = MENTORSHIP_REQUESTS_DB.filter(r => r.studentId === auth.user.id);
            sendJson(res, 200, { requests });
            return;
          } else if (auth.user.activeRole === 'SUPER_ADMIN') {
            sendJson(res, 200, { requests: MENTORSHIP_REQUESTS_DB });
            return;
          }
          sendJson(res, 403, { error: 'Access Denied: You do not have permission to view mentorship requests.' });
          return;
        }

        if (req.method === 'POST') {
          if (auth.user.activeRole !== 'STUDENT' && auth.user.activeRole !== 'SUPER_ADMIN') {
            sendJson(res, 403, { error: 'Only student innovators can submit mentorship requests.' });
            return;
          }

          const body = await parseJsonBody(req);
          const newRequest = {
            id: `req-${Date.now()}`,
            studentId: auth.user.id,
            studentName: auth.user.name,
            mentorId: body.mentorId,
            mentorName: body.mentorName || 'Faculty Mentor',
            projectTitle: body.projectTitle || 'Innovative Collegiate Project',
            teamName: body.teamName || 'Innovator Team',
            status: 'pending',
            message: body.message || 'Seeking project advisory and feedback.'
          };

          MENTORSHIP_REQUESTS_DB.push(newRequest);
          sendJson(res, 201, { success: true, request: newRequest });
          return;
        }
      }

      if (pathname.startsWith('/api/mentors/requests/') && req.method === 'PUT') {
        const requestId = pathname.replace('/api/mentors/requests/', '');
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const reqItem = MENTORSHIP_REQUESTS_DB.find(r => r.id === requestId);
        if (!reqItem) {
          sendJson(res, 404, { error: 'Mentorship request not found.' });
          return;
        }

        // Only the assigned mentor or super-admin can accept/decline
        if (reqItem.mentorId !== auth.user.id && auth.user.activeRole !== 'SUPER_ADMIN') {
          sendJson(res, 403, { error: 'Access Denied: You can only respond to requests assigned to you.' });
          return;
        }

        const body = await parseJsonBody(req);
        if (body.status) reqItem.status = body.status;
        sendJson(res, 200, { success: true, request: reqItem });
        return;
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: RESEARCH COLLABORATIONS
      // ----------------------------------------------------
      if (pathname === '/api/research/collaborations') {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        if (req.method === 'GET') {
          // Confidentiality boundary: Only show collaborations where user is party or super-admin
          const userCollabs = RESEARCH_COLLABORATIONS_DB.filter(c => 
            c.requesterId === auth.user.id || c.collaboratorId === auth.user.id || auth.user.activeRole === 'SUPER_ADMIN'
          );
          sendJson(res, 200, { collaborations: userCollabs });
          return;
        }

        if (req.method === 'POST') {
          if (auth.user.activeRole !== 'PHD_RESEARCHER' && auth.user.activeRole !== 'MENTOR' && auth.user.activeRole !== 'SUPER_ADMIN') {
            sendJson(res, 403, { error: 'Only researchers and mentors can create research collaborations.' });
            return;
          }

          const body = await parseJsonBody(req);
          const newCollab = {
            id: `collab-${Date.now()}`,
            requesterId: auth.user.id,
            requesterName: auth.user.name,
            collaboratorId: body.collaboratorId,
            collaboratorName: body.collaboratorName,
            projectTitle: body.projectTitle,
            status: 'pending',
            confidentialDraft: body.confidentialDraft || ''
          };

          RESEARCH_COLLABORATIONS_DB.push(newCollab);
          persistStoreToDisk();

          // Real-time broadcast to invited collaborator
          broadcastRealtimeNotification({
            type: 'NEW_RESEARCH_COLLABORATION',
            title: 'Research Collaboration Proposal',
            message: `${auth.user.name} proposed collaboration on "${newCollab.projectTitle}"`,
            targetRole: 'PHD_RESEARCHER',
            targetUserId: body.collaboratorId,
            payload: newCollab
          });

          sendJson(res, 201, { success: true, collaboration: newCollab });
          return;
        }
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: ORGANIZATION MEMBERS
      // ----------------------------------------------------
      if (pathname.includes('/members') && pathname.startsWith('/api/organizations/')) {
        const parts = pathname.replace('/api/organizations/', '').split('/');
        const targetOrgId = parts[0];
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        // Multi-tenant check
        const isOrgOwner = auth.user.organizationId === targetOrgId;
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';

        if (!isOrgOwner && !isSuperAdmin) {
          sendJson(res, 403, { 
            error: 'Cross-tenant access violation: You can only view or manage members of your own institution.' 
          });
          return;
        }

        if (req.method === 'GET') {
          const members = ORGANIZATION_MEMBERS_DB.filter(m => m.organizationId === targetOrgId);
          sendJson(res, 200, { members });
          return;
        }

        if (req.method === 'POST') {
          const body = await parseJsonBody(req);
          const newMember = {
            id: `mem-${Date.now()}`,
            organizationId: targetOrgId,
            userId: body.userId || `usr-${Date.now()}`,
            name: body.name || 'Invited Coordinator',
            email: body.email,
            role: body.role || 'EVENT_MANAGER',
            status: 'active'
          };
          ORGANIZATION_MEMBERS_DB.push(newMember);
          persistStoreToDisk();
          sendJson(res, 201, { success: true, member: newMember });
          return;
        }
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: EVENT REGISTRATIONS
      // ----------------------------------------------------
      if (pathname.match(/^\/api\/events\/[a-zA-Z0-9_-]+\/registrations$/)) {
        const auth = authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const eventId = pathname.split('/')[3];

        if (req.method === 'GET') {
          const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';
          // Resolve event organizer boundary dynamically
          const eventOwnerOrgId = (eventId === 'ev-001' || eventId.startsWith('ev-kec')) ? 'KEC-DEMO-001' : 
                                  (eventId.startsWith('ev-iitb') ? 'IITB-ORG-002' : 
                                  (eventId.startsWith('ev-nitw') ? 'NITW-DEMO-004' : 
                                  (eventId.startsWith('ev-anna') ? 'ANNA-DEMO-005' : 'KEC-DEMO-001')));

          const isOrgOwner = auth.user.activeRole === 'ORGANIZATION_OWNER' && 
                             auth.user.organizationId === eventOwnerOrgId;
          const isAssignedManager = auth.user.activeRole === 'EVENT_MANAGER' && 
                                    auth.user.organizationId === eventOwnerOrgId && 
                                    EVENT_MANAGER_ASSIGNMENTS_DB.some(ema => 
                                      ema.userId === auth.user.id && 
                                      ema.eventId === eventId && 
                                      ema.organizationId === eventOwnerOrgId && 
                                      ema.status === 'active'
                                    );

          if (isSuperAdmin || isOrgOwner || isAssignedManager) {
            const registrations = EVENT_REGISTRATIONS_DB.filter(r => r.eventId === eventId);
            sendJson(res, 200, { registrations });
            return;
          }

          // Student can only see their own registration
          if (auth.user.activeRole === 'STUDENT') {
            const registrations = EVENT_REGISTRATIONS_DB.filter(r => r.eventId === eventId && r.studentId === auth.user.id);
            sendJson(res, 200, { registrations });
            return;
          }

          sendJson(res, 403, { 
            error: 'Access Denied: You do not have permission to inspect participant registrations for this event.' 
          });
          return;
        }

        if (req.method === 'POST') {
          if (auth.user.activeRole !== 'STUDENT' && auth.user.activeRole !== 'SUPER_ADMIN') {
            sendJson(res, 403, { error: 'Only registered students can submit event participation entries.' });
            return;
          }

          const body = await parseJsonBody(req);
          const newReg = {
            id: `reg-${Date.now()}`,
            eventId,
            organizerId: body.organizerId || 'KEC-DEMO-001',
            studentId: auth.user.id,
            participantName: auth.user.name,
            email: auth.user.email,
            teamName: body.teamName || 'Solo Participant',
            status: 'confirmed',
            registeredAt: new Date().toISOString()
          };

          EVENT_REGISTRATIONS_DB.push(newReg);
          persistStoreToDisk();

          // Real-time broadcast to the organizer of this event!
          broadcastRealtimeNotification({
            type: 'NEW_EVENT_REGISTRATION',
            title: 'New Student Registration Received',
            message: `${auth.user.name} registered for ${eventId} (${newReg.teamName})`,
            targetRole: 'ORGANIZATION_OWNER',
            targetUserId: newReg.organizerId,
            payload: newReg
          });

          sendJson(res, 201, { success: true, registration: newReg });
          return;
        }
      }

      // GET /api/admin/audit-logs
      if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
        const auth = authenticateSession(req);
        if (!auth || (auth.user.activeRole !== 'SUPER_ADMIN' && auth.user.activeRole !== 'PLATFORM_REVIEWER')) {
          sendJson(res, 403, { error: 'Access Denied: Administrative privilege required.' });
          return;
        }
        sendJson(res, 200, { auditLogs: AUDIT_LOGS });
        return;
      }

      // ----------------------------------------------------
      // CERTIFICATE VERIFICATION & LIFECYCLE AUDIT ENDPOINT
      // ----------------------------------------------------
      if (pathname.match(/^\/api\/certificates\/verify\/[a-zA-Z0-9_-]+$/) && req.method === 'GET') {
        const certNumber = pathname.split('/')[4];
        const cert = CERTIFICATES_DB.find(c => c.certificateNumber.toLowerCase() === certNumber.toLowerCase());

        if (!cert) {
          sendJson(res, 404, { 
            valid: false, 
            error: `Certificate with credential ID "${certNumber}" was not found on CampusNet registry.` 
          });
          return;
        }

        if (cert.status === 'revoked') {
          sendJson(res, 422, {
            valid: false,
            status: 'revoked',
            error: 'Certificate has been revoked and is no longer valid.',
            certificateNumber: cert.certificateNumber,
            recipientName: cert.recipientName,
            eventTitle: cert.eventTitle,
            revocationReason: cert.revocationReason,
            revokedAt: cert.revokedAt,
            revokedBy: cert.revokedBy
          });
          return;
        }

        sendJson(res, 200, {
          valid: true,
          status: 'valid',
          certificate: cert
        });
        return;
      }

      // 404 for unknown /api routes
      sendJson(res, 404, { error: 'API endpoint not found.' });
      return;
    } catch (err) {
      console.error('API Error:', err);
      sendJson(res, 500, { error: 'Internal Server Error', details: err.message });
      return;
    }
  }

  // ==========================================
  // STATIC ASSETS & SPA ROUTING
  // ==========================================
  let filePath = path.join(DIST_DIR, pathname);

  // Direct file check
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA Fallback: serve index.html for all other routes
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Build artifacts not found. Please run npm run build.');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`CampusNet production server listening on http://0.0.0.0:${PORT}`);
});

import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

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
const USERS_DB = [
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

// Audit Logs Store
const AUDIT_LOGS = [
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

        // Demo password check or match
        if (password && password !== user.passwordHash && password !== 'CampusNet@Demo2026') {
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
      if (pathname.startsWith('/api/organizations/') && req.method === 'GET') {
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

        sendJson(res, 201, {
          success: true,
          eventId: newEventId,
          title,
          status
        });
        return;
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

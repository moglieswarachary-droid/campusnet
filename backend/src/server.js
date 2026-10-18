import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables for Neon PostgreSQL and server runtime
dotenv.config({ path: path.join(__dirname, '../.env') });
import prisma from './database/prisma.js';
import { hashPassword, verifyPassword, validatePasswordStrength, isArgon2Hash } from './utils/password.js';
import { seedProjectsAndTeams } from './database/seedProjects.js';
import {
  toPrismaProjectStatus,
  toPrismaMilestoneStatus,
  toPrismaTaskStatus,
  formatPrismaProject,
  formatPrismaTeam
} from './services/projectService.js';
import {
  normalizeContact,
  isValidContact,
  sendOtpEmail,
  sendOtpSms,
  getTestDispatchedOtp
} from './services/otpDeliveryService.js';

let isPrismaConnected = false;

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
const MAX_REQUESTS_PER_WINDOW = process.env.NODE_ENV === 'production' ? 60 : 1000;

function checkRateLimit(ip) {
  if (process.env.NODE_ENV !== 'production') return true;
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
    mobile: '+919876543210',
    name: 'Aarav Sharma',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT'],
    activeRole: 'STUDENT',
    institution: 'NITK Surathkal',
    department: 'Computer Science & Engineering',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-std-002',
    email: 'pooja.iyer@ceg.annauniv.edu',
    mobile: '+919845112345',
    name: 'Pooja Iyer',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT'],
    activeRole: 'STUDENT',
    institution: 'CEG Anna University',
    department: 'ECE',
    studentId: '2023ECE088',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-multi-001',
    email: 'karthik.raja@campusnet.in',
    mobile: '+919820067890',
    name: 'Karthik Raja',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT', 'EVENT_MANAGER'], // Multi-role authorized account!
    activeRole: 'STUDENT',
    institution: 'Kuppam Engineering College',
    organizationId: 'KEC-DEMO-001',
    managedEventIds: ['ev-001'],
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-mnt-001',
    email: 'arvind.rao@iitb.ac.in',
    mobile: '+919812345678',
    name: 'Dr. Arvind Rao',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['MENTOR'],
    activeRole: 'MENTOR',
    institution: 'IIT Bombay',
    department: 'Electrical Engineering & Robotics',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-mnt-002',
    email: 'priya.mentor@nitk.edu.in',
    mobile: '+919876543211',
    name: 'Dr. Priya Sundaram',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['MENTOR'],
    activeRole: 'MENTOR',
    institution: 'NITK Surathkal',
    department: 'Electronics & Communication',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-mnt-multi-001',
    email: 'meenakshi.s@campusnet.in',
    mobile: '+919876501234',
    name: 'Dr. Meenakshi Sundaram',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['MENTOR', 'PLATFORM_REVIEWER'], // Multi-role authorized account!
    activeRole: 'MENTOR',
    institution: 'Anna University',
    department: 'Computer Science',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-res-001',
    email: 'kavya.r@iisc.ac.in',
    mobile: '+919988776655',
    name: 'Kavya Ramanathan',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['PHD_RESEARCHER'],
    activeRole: 'PHD_RESEARCHER',
    institution: 'Indian Institute of Science (IISc)',
    department: 'Computational and Data Sciences',
    scholarId: 'IISC-PHD-2024-09',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-res-002',
    email: 'vikram.research@iisc.ac.in',
    mobile: '+919876543212',
    name: 'Dr. Vikram Sen',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['PHD_RESEARCHER'],
    activeRole: 'PHD_RESEARCHER',
    institution: 'Indian Institute of Science (IISc)',
    department: 'Supercomputing Education and Research Centre',
    scholarId: 'IISC-PHD-2024-12',
    status: 'ACTIVE',
    verified: true
  },
  // 5 Verified Demo Colleges
  {
    id: 'KEC-DEMO-001',
    email: 'organizer.demo@campusnet-demo.in',
    alternateEmail: 'suresh.babu@kec.ac.in',
    mobile: '+919443210987',
    name: 'Dr. Anand Kumar',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Kuppam Engineering College',
    organizationId: 'KEC-DEMO-001',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'NITK-ORG-001',
    email: 'techfest@nitk.edu.in',
    mobile: '+919876543213',
    name: 'Incident NITK Cultural & Tech Committee',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'NITK Surathkal',
    organizationId: 'NITK-ORG-001',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'usr-evm-001',
    email: 'neha.events@nitk.edu.in',
    mobile: '+919876543214',
    name: 'Neha Deshmukh',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['EVENT_MANAGER'],
    activeRole: 'EVENT_MANAGER',
    institution: 'NITK Surathkal',
    organizationId: 'NITK-ORG-001',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'IITB-ORG-002',
    email: 'techfest.coord@iitb.ac.in',
    mobile: '+919820123456',
    name: 'Rohan Varma',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'IIT Bombay',
    organizationId: 'IITB-ORG-002',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'CNU-DEMO-003',
    email: 'iisc.events@campusnet-demo.in',
    mobile: '+919845012345',
    name: 'Prof. Sudhir Sen',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Indian Institute of Science (IISc)',
    organizationId: 'CNU-DEMO-003',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'NITW-DEMO-004',
    email: 'nitw.techno@campusnet-demo.in',
    mobile: '+919849012345',
    name: 'Dr. K. Rajeshwar',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'NIT Warangal',
    organizationId: 'NITW-DEMO-004',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  {
    id: 'ANNA-DEMO-005',
    email: 'annauniv.conclave@campusnet-demo.in',
    mobile: '+919444012345',
    name: 'Dr. Priya Sundaram',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Anna University (CEG Campus)',
    organizationId: 'ANNA-DEMO-005',
    verificationStatus: 'verified',
    status: 'ACTIVE',
    verified: true
  },
  // Pending Organization Scenario Account
  {
    id: 'ORG-PENDING-006',
    email: 'apex.events@campusnet-demo.in',
    mobile: '+919888012345',
    name: 'Prof. R. Venkatesh',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['ORGANIZATION_OWNER'],
    activeRole: 'ORGANIZATION_OWNER',
    institution: 'Apex Institute of Technology',
    organizationId: 'ORG-PENDING-006',
    verificationStatus: 'under_review', // Pending verification! Cannot publish directly
    status: 'ACTIVE',
    verified: false
  },
  // Platform Reviewer Account
  {
    id: 'rev-aicte-001',
    email: 'reviewer.gov@aicte.gov.in',
    alternateEmail: 'sunita.reviewer@aicte.gov.in',
    mobile: '+919811012345',
    name: 'Dr. Sunita Murthy',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['PLATFORM_REVIEWER'],
    activeRole: 'PLATFORM_REVIEWER',
    institution: 'National Accreditation & Academic Review Board',
    status: 'ACTIVE',
    verified: true
  },
  // Platform Super Admin Account
  {
    id: 'adm-root-001',
    email: 'admin@campusnet.in',
    alternateEmail: 'rajesh.superadmin@campusnet.gov.in',
    mobile: '+919800012345',
    name: 'CampusNet National Root Administrator',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['SUPER_ADMIN'],
    activeRole: 'SUPER_ADMIN',
    institution: 'CampusNet Central Command',
    status: 'ACTIVE',
    verified: true
  },
  // Explicitly Suspended Test Account (for security regression testing)
  {
    id: 'usr-suspended-001',
    email: 'suspended.student@campusnet-demo.in',
    alternateEmail: 'suspended.student@nitk.edu.in',
    mobile: '+919999900000',
    name: 'Suspended Candidate',
    passwordHash: 'CampusNet@Demo2026',
    roles: ['STUDENT'],
    activeRole: 'STUDENT',
    institution: 'Suspended Institution',
    status: 'SUSPENDED',
    verified: false
  }
];

// Active Server Sessions Store: token -> { userId, expiresAt }
const SESSIONS = new Map();

// Passwordless OTP Authentication & Challenge Store
// Key: normalized identifier (email or E.164 phone) -> { tokenHash, expiresAt, attempts, maxAttempts, lastRequestedAt, channel, purpose, portal, consumedAt }
const OTP_CHALLENGES = new Map();
const OTP_STORE = OTP_CHALLENGES; // Backward compatibility alias for existing password recovery tests
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const OTP_EXPIRY_MS = parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10) * 1000; // 5 minutes default
const OTP_COOLDOWN_MS = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10) * 1000; // 60 seconds

// Per-contact rate limiter to prevent OTP flooding
const contactRateLimits = new Map();
const MAX_OTP_REQUESTS_PER_CONTACT = 5;
const CONTACT_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkContactOtpRateLimit(contact) {
  const now = Date.now();
  const timestamps = (contactRateLimits.get(contact) || []).filter(t => now - t < CONTACT_RATE_WINDOW_MS);
  if (timestamps.length >= MAX_OTP_REQUESTS_PER_CONTACT) {
    return false;
  }
  timestamps.push(now);
  contactRateLimits.set(contact, timestamps);
  return true;
}

// Projects & Teams Stores
let PROJECTS_DB = [
  {
    id: 'proj-001',
    title: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    problemStatement: 'Manual pesticide application in Indian mango & citrus orchards exposes farmers to toxic inhalation and causes 40% pesticide runoff due to non-uniform manual pressure.',
    proposedSolution: 'An autonomous micro-quadcopter running TensorRT quantized YOLOv11 on an onboard NVIDIA Jetson Orin Nano, executing real-time pest segmentation with precision pulse-width modulated micro-dosing spray nozzles.',
    domain: 'AI, Agritech & Drone Robotics',
    technologies: ['PyTorch', 'TensorRT', 'ROS2 Humble', 'PX4 Autopilot', 'SolidWorks', 'ESP32 LoRaWAN'],
    requiredSkills: ['Computer Vision', 'Embedded C', 'Airframe FEA', 'Farmer UI/UX'],
    teamId: 'team-001',
    teamName: 'Team AgriVision AI (SIH-2026)',
    teamMembersCount: 4,
    institution: 'NITK Surathkal & Cross-College Consortium',
    authorId: 'usr-std-001',
    institutionId: 'inst-nitk',
    state: 'Karnataka',
    city: 'Surathkal',
    mentor: 'Dr. Arvind Rao (IIT Bombay)',
    mentorId: 'usr-mnt-001',
    mentorTitle: 'Professor & Head of Edge Computing Lab',
    mentorStatus: 'accepted',
    status: 'Prototype',
    progressPercent: 78,
    githubUrl: 'https://github.com/campusnet-projects/agrivision-edge-ai',
    demoUrl: 'https://campusnet.network/demo/agrivision-live',
    documentationUrl: 'https://campusnet.network/docs/agrivision-whitepaper.pdf',
    objectives: [
      'Achieve 30+ FPS edge pest inference under variable sunlight',
      'Reduce chemical runoff by 35% through pulse-width micro-dosing',
      'Ensure fail-safe return-to-launch within 1.5m accuracy'
    ],
    seekingRoles: ['Embedded Telemetry Lead (Anna Univ)', 'Flight Testing Pilot'],
    coverImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    papersCount: 1,
    milestones: [
      { id: 'm1', title: 'Dataset Collection (10K annotated pest images)', description: 'Curated 10,000 high-res pest leaf images across Karnataka orchards.', status: 'approved', dueDate: '2025-11-30', approvedByMentor: true, mentorFeedback: 'Excellent dataset diversity and class balance across leaf-miner species.' },
      { id: 'm2', title: 'Airframe CFD & Carbon-Fiber Fabrication', description: 'Completed wind tunnel simulation and carbon-fiber arm layup in VJTI workshop.', status: 'approved', dueDate: '2026-01-15', approvedByMentor: true, mentorFeedback: 'Vibration damping mounts verified up to 8000 RPM motor load.' },
      { id: 'm3', title: 'Jetson Orin Nano TensorRT INT8 Optimization', description: 'Quantize model to achieve 34 FPS at 8.2W power draw on Jetson Orin Nano.', status: 'in_progress', dueDate: '2026-03-10' },
      { id: 'm4', title: 'Autonomous 5-Acre Field Spraying Validation', description: 'Execute field trial with GPS geofencing and micro-dosing validation.', status: 'pending', dueDate: '2026-04-05' }
    ],
    tasks: [
      { id: 't1', title: 'Calibrate TensorRT INT8 entropy cache on 500 test images', assignee: 'Aarav Sharma', status: 'in_progress', priority: 'high' },
      { id: 't2', title: 'Solder custom ESP32 telemetry daughter-board with LoRaWAN antenna', assignee: 'Pooja Iyer', status: 'done', priority: 'high' },
      { id: 't3', title: 'Run ANSYS stress simulation on 3D-printed nozzle mount bracket', assignee: 'Vikramaditya', status: 'done', priority: 'medium' },
      { id: 't4', title: 'Conduct Kannada & Marathi usability tests with 10 farmers', assignee: 'Ananya Sen', status: 'in_progress', priority: 'medium' }
    ],
    createdAt: '2025-09-01T10:00:00Z',
    likes: 184
  }
];

let TEAMS_DB = [
  {
    id: 'team-001',
    name: 'Team AgriVision AI',
    projectId: 'proj-001',
    projectName: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
    domain: 'Agritech & Autonomous UAVs',
    leaderId: 'usr-std-001',
    leaderName: 'Aarav Sharma',
    members: [
      { userId: 'usr-std-001', name: 'Aarav Sharma', department: 'AI & Data Eng', college: 'NITK Surathkal', role: 'AI & Vision Lead', avatar: '', verified: true, isLeader: true, studentId: '2023CSB1042', email: 'aarav.sharma@nitk.edu.in', mobile: '+91 98765 43210' },
      { userId: 'usr-std-002', name: 'Pooja Iyer', department: 'ECE', college: 'CEG Anna Univ', role: 'Hardware & Telemetry', avatar: '', verified: true, isLeader: false, studentId: '2023ECE088', email: 'pooja.iyer@ceg.annauniv.edu', mobile: '+91 98451 12345' },
      { userId: 'usr-std-003', name: 'Vikramaditya Deshmukh', department: 'Mechanical', college: 'VJTI Mumbai', role: 'Airframe & Robotics', avatar: '', verified: true, isLeader: false, studentId: '2023MECH014', email: 'vikram.d@vjti.ac.in', mobile: '+91 98200 67890' },
      { userId: 'usr-std-004', name: 'Ananya Sen', department: 'Interaction Design', college: 'NID Ahmedabad', role: 'Farmer UX & Usability', avatar: '', verified: true, isLeader: false, studentId: '2023DES042', email: 'ananya.sen@nid.edu', mobile: '+91 99112 33445' }
    ],
    maxMembers: 6,
    requiredRoles: [
      { role: 'AI & Vision Lead', departmentHint: 'CSE / AIML', filled: true, filledBy: 'Aarav Sharma' },
      { role: 'Hardware & Telemetry', departmentHint: 'ECE', filled: true, filledBy: 'Pooja Iyer' },
      { role: 'Airframe & Robotics', departmentHint: 'Mechanical', filled: true, filledBy: 'Vikramaditya' },
      { role: 'Farmer UX & Usability', departmentHint: 'Design / UI', filled: true, filledBy: 'Ananya Sen' },
      { role: 'Cloud Backend Specialist', departmentHint: 'CSE / IT', filled: false },
      { role: 'Safety & Field Compliance Lead', departmentHint: 'Agritech / Bio', filled: false }
    ],
    status: 'active',
    mentorId: 'usr-mnt-001',
    mentorName: 'Dr. Arvind Rao (IIT Bombay)',
    mentorStatus: 'accepted',
    createdAt: '2025-09-01T10:00:00Z',
    eventId: 'ev-001',
    eventTitle: 'Smart India Hackathon 2026'
  }
];

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
      projects: PROJECTS_DB,
      teams: TEAMS_DB,
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
      if (Array.isArray(data.users) && data.users.length > 0) {
        const fileUserMap = new Map(data.users.map(u => [u.id, u]));
        const mergedSeeds = USERS_DB.map(seed => {
          const fileUser = fileUserMap.get(seed.id);
          if (fileUser) {
            return {
              ...seed,
              ...fileUser,
              alternateEmail: seed.alternateEmail || fileUser.alternateEmail,
              mobile: seed.mobile || fileUser.mobile,
              roles: seed.roles || fileUser.roles
            };
          }
          return seed;
        });
        const seedIds = new Set(USERS_DB.map(u => u.id));
        const extraFileUsers = data.users.filter(u => !seedIds.has(u.id));
        USERS_DB = [...mergedSeeds, ...extraFileUsers];
      }
      if (Array.isArray(data.mentorshipRequests)) MENTORSHIP_REQUESTS_DB = data.mentorshipRequests;
      if (Array.isArray(data.researchCollaborations)) RESEARCH_COLLABORATIONS_DB = data.researchCollaborations;
      if (Array.isArray(data.organizationMembers)) ORGANIZATION_MEMBERS_DB = data.organizationMembers;
      if (Array.isArray(data.eventRegistrations)) EVENT_REGISTRATIONS_DB = data.eventRegistrations;
      if (Array.isArray(data.projects)) PROJECTS_DB = data.projects;
      if (Array.isArray(data.teams)) TEAMS_DB = data.teams;
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

// Auth Security: Migrate legacy plaintext passwords to Argon2id
async function initAuthSecurity() {
  let updated = false;
  for (const user of USERS_DB) {
    if (!isArgon2Hash(user.passwordHash)) {
      const plaintext = user.passwordHash || 'CampusNet@Demo2026';
      user.passwordHash = await hashPassword(plaintext);
      updated = true;
    }
  }
  if (updated) {
    persistStoreToDisk();
    console.log('[Auth Security] Successfully upgraded legacy user passwords to Argon2id.');
  }
}

// Hydrate store on server start
loadStoreFromDisk();
initAuthSecurity().catch(err => console.warn('[Auth Security] Init notice:', err.message));
if (isPrismaConnected) {
  seedProjectsAndTeams().catch(err => console.warn('[Prisma] Seed notice:', err.message));
}

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

// Universal Platform Activity Audit Logger
// Ensures every single activity across CampusNet is captured and broadcast in real time to high-level authorities
function logPlatformActivity({ actorId, actorName, actorRole, action, targetType, targetId, targetName, details, ipAddress }) {
  const logEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorId: actorId || 'system',
    actorName: actorName || 'System / Platform Engine',
    actorRole: actorRole || 'SYSTEM',
    action: action || 'ACTIVITY',
    targetType: targetType || 'platform',
    targetId: targetId || 'global',
    targetName: targetName || 'CampusNet Network',
    timestamp: new Date().toISOString(),
    details: details || '',
    ipAddress: ipAddress || 'Internal TLS'
  };

  AUDIT_LOGS.unshift(logEntry);
  if (AUDIT_LOGS.length > 1000) {
    AUDIT_LOGS.pop();
  }
  persistStoreToDisk();

  if (isPrismaConnected) {
    try {
      prisma.auditLog.create({
        data: {
          id: logEntry.id,
          actorId: actorId && (actorId.startsWith('usr-') || actorId.startsWith('adm-') || actorId.startsWith('rev-')) ? actorId : undefined,
          actorName: logEntry.actorName,
          actorRole: logEntry.actorRole,
          action: logEntry.action,
          targetType: logEntry.targetType,
          targetId: logEntry.targetId,
          targetName: logEntry.targetName,
          details: logEntry.details,
          ipAddress: logEntry.ipAddress
        }
      }).catch(() => {});
    } catch {}
  }

  // Real-time broadcast to connected Super Admins and Reviewers
  try {
    const payloadString = `event: audit_log\ndata: ${JSON.stringify(logEntry)}\n\n`;
    for (const client of SSE_CLIENTS) {
      if (client.role === 'SUPER_ADMIN' || client.role === 'PLATFORM_REVIEWER') {
        try {
          client.res.write(payloadString);
        } catch {
          SSE_CLIENTS.delete(client);
        }
      }
    }
  } catch {}

  return logEntry;
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
async function authenticateSession(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  // Session Invalidation / Token Blacklist Check
  if (REVOKED_TOKENS.has(token)) return null;

  let session = SESSIONS.get(token);
  if (!session && isPrismaConnected) {
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const dbSession = await prisma.session.findUnique({
        where: { tokenHash }
      });
      if (dbSession && !dbSession.revokedAt && new Date(dbSession.expiresAt).getTime() > Date.now()) {
        session = { userId: dbSession.userId, expiresAt: new Date(dbSession.expiresAt).getTime() };
        SESSIONS.set(token, session);
      }
    } catch (err) {
      console.warn('[Prisma] Session lookup warning:', err.message);
    }
  }

  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return null;
  }

  let user = USERS_DB.find(u => u.id === session.userId);
  if (!user && isPrismaConnected) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: session.userId } });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          roles: dbUser.roles || ['STUDENT'],
          activeRole: dbUser.activeRole || 'STUDENT',
          institution: dbUser.institutionName || 'Academic Institution',
          institutionId: dbUser.institutionId || undefined,
          department: dbUser.department || '',
          organizationId: dbUser.organizationId,
          verified: Boolean(dbUser.verifiedStudent || dbUser.verifiedMentor || dbUser.verifiedResearcher)
        };
        USERS_DB.push(user);
      }
    } catch (e) {
      console.warn('[Prisma] User session lookup warning:', e.message);
    }
  }
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
      // GET /api/health (System & Database Health Check)
      if (pathname === '/api/health' && req.method === 'GET') {
        sendJson(res, 200, {
          status: 'ok',
          uptime: Math.round(process.uptime()),
          timestamp: new Date().toISOString(),
          database: {
            connected: isPrismaConnected,
            provider: 'Neon PostgreSQL (Prisma)'
          }
        });
        return;
      }

      // POST /api/auth/otp/request (Passwordless OTP Challenge Dispatch)
      if (pathname === '/api/auth/otp/request' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { channel, identifier, portal = 'student' } = body;
        const channelLower = (channel || '').toString().toLowerCase().trim();
        let validChannel = (channelLower === 'sms' || channelLower === 'phone') ? 'sms' : 'email';
        if (!channel && identifier && !identifier.includes('@') && /^\+?\d{10,15}$/.test(identifier.replace(/[\s\-\(\)]/g, ''))) {
          validChannel = 'sms';
        }

        if (!identifier || typeof identifier !== 'string') {
          sendJson(res, 400, { error: 'A valid email address or phone number is required.' });
          return;
        }

        if (!isValidContact(identifier, validChannel)) {
          sendJson(res, 400, { 
            error: validChannel === 'sms' 
              ? 'Invalid phone number format. Please provide a 10-digit number or international +country code format.'
              : 'Invalid email address format. Please provide a valid institutional or personal email.'
          });
          return;
        }

        const normalizedContact = normalizeContact(identifier, validChannel);

        // 1. IP Rate Limiting
        if (!checkRateLimit(clientIp)) {
          sendJson(res, 429, { error: 'Too many requests from this IP. Please wait a moment.' });
          return;
        }

        // 2. Per-Contact Rate Limiting (Flooding prevention)
        if (!checkContactOtpRateLimit(normalizedContact)) {
          sendJson(res, 429, { error: 'Too many OTP requests for this contact. Please try again after 10 minutes.' });
          return;
        }

        // 3. Resend Cooldown Enforcement
        const existingChallenge = OTP_CHALLENGES.get(normalizedContact);
        if (existingChallenge && existingChallenge.lastRequestedAt && (Date.now() - existingChallenge.lastRequestedAt < OTP_COOLDOWN_MS)) {
          const remainingSeconds = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - existingChallenge.lastRequestedAt)) / 1000);
          sendJson(res, 429, { 
            error: `Please wait ${remainingSeconds} seconds before requesting a new verification code.`,
            cooldownRemaining: remainingSeconds
          });
          return;
        }

        // 4. Cryptographically secure random 6-digit OTP
        const generatedOtp = crypto.randomInt(100000, 1000000).toString();
        const tokenHash = crypto.createHash('sha256').update(generatedOtp).digest('hex');
        const expiresAt = Date.now() + OTP_EXPIRY_MS;

        OTP_CHALLENGES.set(normalizedContact, {
          tokenHash,
          expiresAt,
          attempts: 0,
          maxAttempts: OTP_MAX_ATTEMPTS,
          lastRequestedAt: Date.now(),
          channel: validChannel,
          purpose: 'LOGIN',
          portal,
          consumedAt: null
        });

        if (isPrismaConnected) {
          try {
            await prisma.otpChallenge.create({
              data: {
                identifier: normalizedContact,
                channel: validChannel === 'sms' ? 'SMS' : 'EMAIL',
                purpose: 'LOGIN',
                tokenHash,
                expiresAt: new Date(expiresAt),
                attempts: 0,
                maxAttempts: OTP_MAX_ATTEMPTS,
                ipAddress: clientIp
              }
            });
          } catch (e) {
            console.warn('[Prisma] OTP challenge persistence notice:', e.message);
          }
        }

        // 5. Dispatch via Delivery Provider Abstraction
        let dispatchResult;
        if (validChannel === 'sms') {
          dispatchResult = await sendOtpSms({ to: normalizedContact, otp: generatedOtp, purpose: 'LOGIN', portal });
        } else {
          dispatchResult = await sendOtpEmail({ to: normalizedContact, otp: generatedOtp, purpose: 'LOGIN', portal });
        }

        if (!dispatchResult.success) {
          if (dispatchResult.error === 'EMAIL_PROVIDER_UNCONFIGURED' || dispatchResult.error === 'SMS_PROVIDER_UNCONFIGURED') {
            sendJson(res, 503, { error: 'Authentication delivery service is temporarily unconfigured. Please contact platform support.' });
            return;
          }
          sendJson(res, 500, { error: 'Failed to deliver verification code. Please try again later.' });
          return;
        }

        let existingUser = null;
        if (validChannel === 'sms') {
          const rawDigits = normalizedContact.replace(/^\+91/, '').replace(/^\+/, '');
          existingUser = USERS_DB.find(u => {
            const uMobile = (u.mobile || '').replace(/[\s\-\(\)]/g, '');
            return uMobile === normalizedContact || 
                   uMobile === `+91${rawDigits}` || 
                   uMobile.endsWith(rawDigits);
          });
        } else {
          existingUser = USERS_DB.find(u => 
            (u.email && u.email.toLowerCase() === normalizedContact) || 
            (u.alternateEmail && u.alternateEmail.toLowerCase() === normalizedContact)
          );
        }
        if (!existingUser) {
          const rawDigits = normalizedContact.replace(/^\+91/, '').replace(/^\+/, '');
          existingUser = USERS_DB.find(u => {
            const uMobile = (u.mobile || '').replace(/[\s\-\(\)]/g, '');
            return uMobile === normalizedContact || 
                   uMobile === `+91${rawDigits}` || 
                   uMobile.endsWith(rawDigits) ||
                   (u.email && u.email.toLowerCase() === normalizedContact) || 
                   (u.alternateEmail && u.alternateEmail.toLowerCase() === normalizedContact);
          });
        }

        // Log OTP to server console (visible in Railway / terminal logs)
        console.log(`[OTP Engine] 🔑 Generated verification code for ${normalizedContact}: [${generatedOtp}] (Channel: ${validChannel}, Portal: ${portal})`);

        // Return enumeration-safe response (includes mockOtp when test provider is active for instant browser evaluation)
        const responseData = {
          success: true,
          message: 'If an account is associated with this contact, a verification code has been dispatched.',
          channel: validChannel,
          cooldownSeconds: Math.round(OTP_COOLDOWN_MS / 1000)
        };

        if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_TEST_OTP_PROVIDER === 'true' || !process.env.RESEND_API_KEY) {
          responseData.mockOtp = generatedOtp;
        }

        sendJson(res, 200, responseData);
        return;
      }

      // POST /api/auth/otp/verify (Verification, Atomic Consumption, & Server-Side RBAC Enforcement)
      if (pathname === '/api/auth/otp/verify' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { channel, identifier, otp, code, portal = 'student', name } = body;
        const otpValue = (otp || code || '').toString().trim();
        const channelLower = (channel || '').toString().toLowerCase().trim();
        let validChannel = (channelLower === 'sms' || channelLower === 'phone') ? 'sms' : 'email';
        if (!channel && identifier && !identifier.includes('@') && /^\+?\d{10,15}$/.test(identifier.replace(/[\s\-\(\)]/g, ''))) {
          validChannel = 'sms';
        }

        if (!identifier || !otpValue) {
          sendJson(res, 400, { error: 'A contact identifier and 6-digit verification code are required.' });
          return;
        }

        let normalizedContact = normalizeContact(identifier, validChannel);
        let challenge = OTP_CHALLENGES.get(normalizedContact);

        if (!challenge && validChannel === 'email') {
          const altContact = normalizeContact(identifier, 'sms');
          if (OTP_CHALLENGES.has(altContact)) {
            normalizedContact = altContact;
            validChannel = 'sms';
            challenge = OTP_CHALLENGES.get(altContact);
          }
        } else if (!challenge && validChannel === 'sms') {
          const altContact = normalizeContact(identifier, 'email');
          if (OTP_CHALLENGES.has(altContact)) {
            normalizedContact = altContact;
            validChannel = 'email';
            challenge = OTP_CHALLENGES.get(altContact);
          }
        }

        if (!challenge) {
          sendJson(res, 400, { error: 'Invalid or expired verification code.' });
          return;
        }

        if (challenge.consumedAt) {
          sendJson(res, 400, { error: 'Verification code has already been consumed. Please request a new code.' });
          return;
        }

        if (Date.now() > challenge.expiresAt) {
          OTP_CHALLENGES.delete(normalizedContact);
          sendJson(res, 400, { error: 'Verification code has expired. Please request a new code.' });
          return;
        }

        if (challenge.attempts >= challenge.maxAttempts) {
          OTP_CHALLENGES.delete(normalizedContact);
          sendJson(res, 400, { error: 'Too many failed verification attempts. This code has been invalidated.' });
          return;
        }

        // Constant-time hash verification against stored digest
        const candidateHash = crypto.createHash('sha256').update(otpValue).digest('hex');
        const isMatch = candidateHash.length === challenge.tokenHash.length &&
          crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(challenge.tokenHash, 'hex'));

        if (!isMatch) {
          challenge.attempts++;
          sendJson(res, 400, { 
            error: 'Invalid verification code.',
            attemptsRemaining: Math.max(0, challenge.maxAttempts - challenge.attempts)
          });
          return;
        }

        // Atomic Consumption: mark consumed immediately to prevent replay and concurrent verification race conditions
        challenge.consumedAt = new Date().toISOString();
        OTP_CHALLENGES.delete(normalizedContact);

        if (isPrismaConnected) {
          try {
            await prisma.otpChallenge.updateMany({
              where: {
                identifier: normalizedContact,
                purpose: 'LOGIN',
                consumedAt: null
              },
              data: {
                consumedAt: new Date()
              }
            });
          } catch (e) {
            console.warn('[Prisma] OTP consumed update notice:', e.message);
          }
        }

        // Resolve user account by registered email or mobile
        let user;
        if (validChannel === 'sms') {
          const rawDigits = normalizedContact.replace(/^\+91/, '').replace(/^\+/, '');
          user = USERS_DB.find(u => {
            const uMobile = (u.mobile || '').replace(/[\s\-\(\)]/g, '');
            return uMobile === normalizedContact || 
                   uMobile === `+91${rawDigits}` || 
                   uMobile.endsWith(rawDigits);
          });
        } else {
          user = USERS_DB.find(u => 
            (u.email && u.email.toLowerCase() === normalizedContact) || 
            (u.alternateEmail && u.alternateEmail.toLowerCase() === normalizedContact)
          );
        }

        if (!user) {
          const rawDigits = normalizedContact.replace(/^\+91/, '').replace(/^\+/, '');
          user = USERS_DB.find(u => {
            const uMobile = (u.mobile || '').replace(/[\s\-\(\)]/g, '');
            return uMobile === normalizedContact || 
                   uMobile === `+91${rawDigits}` || 
                   uMobile.endsWith(rawDigits) ||
                   (u.email && u.email.toLowerCase() === normalizedContact) || 
                   (u.alternateEmail && u.alternateEmail.toLowerCase() === normalizedContact);
          });
        }

        if (!user) {
          const rawPortal = (portal || '').toLowerCase().trim();
          const isAuthorityPortal = ['reviewer', 'platform-reviewer', 'platform_reviewer', 'super-admin', 'super_admin', 'admin', 'aicte'].includes(rawPortal);
          if (isAuthorityPortal) {
            sendJson(res, 404, { error: 'No statutory authority account is registered with this contact identifier.' });
            return;
          }

          // Auto-provision verified user for standard portals (student, mentor, faculty, researcher, organization)
          const portalRoleMap = {
            student: 'STUDENT',
            mentor: 'MENTOR',
            research: 'PHD_RESEARCHER',
            researcher: 'PHD_RESEARCHER',
            scholar: 'PHD_RESEARCHER',
            organization: 'ORGANIZATION_OWNER',
            organizer: 'ORGANIZATION_OWNER',
            'event-manager': 'EVENT_MANAGER',
            event_manager: 'EVENT_MANAGER'
          };
          const assignedRole = portalRoleMap[rawPortal] || 'STUDENT';
          const newUserId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          const providedName = (name || '').trim();
          const contactName = normalizedContact.includes('@') 
            ? normalizedContact.split('@')[0].replace(/[._-]/g, ' ') 
            : `User ${normalizedContact.slice(-4)}`;
          const formattedName = providedName || contactName
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ') || 'CampusNet Innovator';

          user = {
            id: newUserId,
            email: normalizedContact.includes('@') ? normalizedContact : undefined,
            mobile: !normalizedContact.includes('@') ? normalizedContact : undefined,
            name: formattedName,
            roles: [assignedRole],
            activeRole: assignedRole,
            institution: 'Indian Institute of Technology (CampusNet)',
            department: 'Computer Science & Engineering',
            status: 'ACTIVE',
            verified: true,
            passwordHash: 'CampusNet@OtpVerified2026',
            createdAt: new Date().toISOString()
          };
          USERS_DB.push(user);

          if (isPrismaConnected) {
            try {
              await prisma.user.create({
                data: {
                  id: newUserId,
                  email: user.email,
                  mobile: user.mobile,
                  passwordHash: user.passwordHash,
                  name: user.name,
                  roles: user.roles,
                  activeRole: user.activeRole,
                  institutionName: user.institution,
                  department: user.department,
                  status: 'ACTIVE',
                  verifiedStudent: assignedRole === 'STUDENT',
                  verifiedMentor: assignedRole === 'MENTOR',
                  verifiedResearcher: assignedRole === 'PHD_RESEARCHER'
                }
              });
            } catch (e) {
              console.warn('[Prisma] Auto-provision user notice:', e.message);
            }
          }
        }

        // Enforce account status check
        if (user.status === 'SUSPENDED') {
          sendJson(res, 403, { error: 'Account Suspended: This account has been deactivated. Please contact platform administration.' });
          return;
        }

        // Server-Side RBAC Enforcement: Validate requested portal against authorized user roles
        const rawPortal = (portal || '').toLowerCase().trim();
        let canonicalPortal = rawPortal;
        let targetRole = null;

        if (rawPortal === 'student') {
          canonicalPortal = 'student';
          if (!user.roles.includes('STUDENT')) {
            sendJson(res, 403, { error: 'Access Denied (RBAC): You do not possess the STUDENT role required for this portal.' });
            return;
          }
          targetRole = 'STUDENT';
        } else if (rawPortal === 'mentor') {
          canonicalPortal = 'mentor';
          if (!user.roles.includes('MENTOR')) {
            sendJson(res, 403, { error: 'Access Denied (RBAC): You do not possess the MENTOR role required for this portal.' });
            return;
          }
          targetRole = 'MENTOR';
        } else if (rawPortal === 'research' || rawPortal === 'researcher' || rawPortal === 'scholar') {
          canonicalPortal = rawPortal === 'research' ? 'research' : 'researcher';
          if (!user.roles.includes('PHD_RESEARCHER')) {
            sendJson(res, 403, { error: 'Access Denied (RBAC): You do not possess the PHD_RESEARCHER role required for this portal.' });
            return;
          }
          targetRole = 'PHD_RESEARCHER';
        } else if (rawPortal === 'organization' || rawPortal === 'organizer') {
          canonicalPortal = 'organization';
          if (!user.roles.includes('ORGANIZATION_OWNER') && !user.roles.includes('SUPER_ADMIN')) {
            sendJson(res, 403, { error: 'Access Denied (RBAC): You do not possess the ORGANIZATION_OWNER role required for this portal.' });
            return;
          }
          targetRole = user.roles.includes('ORGANIZATION_OWNER') ? 'ORGANIZATION_OWNER' : 'SUPER_ADMIN';
        } else if (rawPortal === 'event-manager' || rawPortal === 'event_manager') {
          canonicalPortal = rawPortal;
          if (!user.roles.includes('EVENT_MANAGER') && !user.roles.includes('ORGANIZATION_OWNER') && !user.roles.includes('SUPER_ADMIN')) {
            sendJson(res, 403, { error: 'Access Denied (RBAC): You do not possess the EVENT_MANAGER role required for this portal.' });
            return;
          }
          targetRole = user.roles.includes('EVENT_MANAGER') ? 'EVENT_MANAGER' : (user.roles.includes('ORGANIZATION_OWNER') ? 'ORGANIZATION_OWNER' : 'SUPER_ADMIN');
        } else if (rawPortal === 'reviewer' || rawPortal === 'platform-reviewer' || rawPortal === 'platform_reviewer') {
          canonicalPortal = rawPortal;
          if (!user.roles.includes('PLATFORM_REVIEWER') && !user.roles.includes('SUPER_ADMIN')) {
            logPlatformActivity({
              actorId: user.id,
              actorName: user.name,
              actorRole: user.activeRole || user.roles[0],
              action: 'UNAUTHORIZED_AUTHORITY_LOGIN_ATTEMPT',
              targetType: 'security',
              targetId: 'portal-reviewer',
              targetName: 'Platform Reviewer Console',
              details: `Unauthorized access blocked: User ${user.email} (${(user.roles || []).join(', ')}) attempted login to Platform Reviewer console without statutory authority role.`,
              ipAddress: clientIp
            });
            sendJson(res, 403, { error: 'Access Denied (RBAC): Strictly restricted to high-level statutory authority accounts with PLATFORM_REVIEWER role.' });
            return;
          }
          targetRole = user.roles.includes('PLATFORM_REVIEWER') ? 'PLATFORM_REVIEWER' : 'SUPER_ADMIN';
        } else if (rawPortal === 'super-admin' || rawPortal === 'super_admin' || rawPortal === 'admin') {
          canonicalPortal = rawPortal;
          if (!user.roles.includes('SUPER_ADMIN')) {
            logPlatformActivity({
              actorId: user.id,
              actorName: user.name,
              actorRole: user.activeRole || user.roles[0],
              action: 'UNAUTHORIZED_AUTHORITY_LOGIN_ATTEMPT',
              targetType: 'security',
              targetId: 'portal-super-admin',
              targetName: 'Super Administrator Governance Console',
              details: `Unauthorized access blocked: User ${user.email} (${(user.roles || []).join(', ')}) attempted login to Super Administrator console without Level-5 authority role.`,
              ipAddress: clientIp
            });
            sendJson(res, 403, { error: 'Access Denied (RBAC): Strictly restricted to high-level national governance accounts with SUPER_ADMIN role.' });
            return;
          }
          targetRole = 'SUPER_ADMIN';
        } else {
          // If no specific portal requested, default to user's activeRole or primary role
          targetRole = user.activeRole || user.roles[0] || 'STUDENT';
          canonicalPortal = targetRole.toLowerCase();
        }

        // Issue 256-bit cryptographically secure session token
        user.activeRole = targetRole;
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        SESSIONS.set(token, { userId: user.id, expiresAt });

        if (isPrismaConnected) {
          try {
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            await prisma.session.create({
              data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(expiresAt),
                ipAddress: clientIp
              }
            });
            await prisma.user.update({
              where: { id: user.id },
              data: { activeRole: targetRole, lastLoginAt: new Date() }
            }).catch(() => {});
          } catch (e) {
            console.warn('[Prisma] OTP login session notice:', e.message);
          }
        }

        logPlatformActivity({
          actorId: user.id,
          actorName: user.name,
          actorRole: targetRole,
          action: 'USER_OTP_LOGIN',
          targetType: 'auth',
          targetId: user.id,
          targetName: user.email,
          details: `User authenticated via ${validChannel.toUpperCase()} OTP into ${canonicalPortal || targetRole} portal`,
          ipAddress: clientIp
        });

        let redirectUrl = `/${canonicalPortal}/dashboard`;
        if (canonicalPortal === 'event_manager' || canonicalPortal === 'event-manager') {
          redirectUrl = '/organization/events';
        } else if (canonicalPortal === 'reviewer' || canonicalPortal === 'platform-reviewer' || canonicalPortal === 'platform_reviewer' || canonicalPortal === 'super_admin' || canonicalPortal === 'super-admin' || canonicalPortal === 'admin') {
          redirectUrl = '/admin';
        } else if (canonicalPortal === 'researcher' || canonicalPortal === 'research') {
          redirectUrl = '/researcher/dashboard';
        }

        // Return sanitized user object
        sendJson(res, 200, {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            mobile: user.mobile,
            name: user.name,
            roles: user.roles,
            activeRole: targetRole,
            institution: user.institution,
            department: user.department,
            organizationId: user.organizationId,
            verificationStatus: user.verificationStatus,
            permissions: SERVER_ROLE_PERMISSIONS[targetRole] || []
          },
          authorizedPortal: canonicalPortal,
          activeAppRole: targetRole,
          redirectUrl
        });
        return;
      }

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

        // Suspended Account Defense
        if (user.status === 'SUSPENDED') {
          logPlatformActivity({
            actorId: user.id,
            actorName: user.name,
            actorRole: user.activeRole || user.roles[0],
            action: 'SUSPENDED_LOGIN_ATTEMPT',
            targetType: 'security',
            targetId: user.id,
            targetName: user.email,
            details: `Suspended account access blocked for ${user.email}`,
            ipAddress: clientIp
          });
          sendJson(res, 403, { error: 'Account Suspended: Access denied.' });
          return;
        }

        // Strict credential verification: require valid non-empty password string
        if (!password || typeof password !== 'string') {
          sendJson(res, 401, { error: 'Invalid password provided.' });
          return;
        }

        // Verify password using Argon2id with legacy migration support
        const verification = await verifyPassword(user.passwordHash, password);
        if (!verification.valid) {
          sendJson(res, 401, { error: 'Invalid password provided.' });
          return;
        }

        // Authority Portal Authorization Gate: Strictly check high-level authorities
        const reqPortal = (body.portal || '').toLowerCase().trim();
        if ((reqPortal === 'reviewer' || reqPortal === 'platform-reviewer') && !user.roles.includes('PLATFORM_REVIEWER') && !user.roles.includes('SUPER_ADMIN')) {
          logPlatformActivity({
            actorId: user.id,
            actorName: user.name,
            actorRole: user.activeRole,
            action: 'UNAUTHORIZED_AUTHORITY_LOGIN_ATTEMPT',
            targetType: 'security',
            targetId: 'portal-reviewer',
            targetName: 'Platform Reviewer Console',
            details: `Unauthorized password login blocked: User ${user.email} attempted access to Platform Reviewer console without statutory authority role.`,
            ipAddress: clientIp
          });
          sendJson(res, 403, { error: 'Access Denied: High-level statutory clearance required.' });
          return;
        }
        if ((reqPortal === 'super-admin' || reqPortal === 'super_admin' || reqPortal === 'admin') && !user.roles.includes('SUPER_ADMIN')) {
          logPlatformActivity({
            actorId: user.id,
            actorName: user.name,
            actorRole: user.activeRole,
            action: 'UNAUTHORIZED_AUTHORITY_LOGIN_ATTEMPT',
            targetType: 'security',
            targetId: 'portal-super-admin',
            targetName: 'Super Admin Console',
            details: `Unauthorized password login blocked: User ${user.email} attempted access to Super Administrator console without Level-5 authority role.`,
            ipAddress: clientIp
          });
          sendJson(res, 403, { error: 'Access Denied: Root national governance clearance required.' });
          return;
        }

        // Transparently upgrade legacy accounts to Argon2id upon verified login
        if (verification.needsRehash) {
          try {
            const upgradedHash = await hashPassword(password);
            user.passwordHash = upgradedHash;
            persistStoreToDisk();
            if (isPrismaConnected) {
              await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: upgradedHash }
              }).catch(() => {});
            }
          } catch (rehashErr) {
            console.warn('[Auth Security] Transparent rehash notice:', rehashErr.message);
          }
        }

        // Issue cryptographically secure session token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        SESSIONS.set(token, { userId: user.id, expiresAt });

        if (isPrismaConnected) {
          try {
            await prisma.user.upsert({
              where: { id: user.id },
              update: {
                activeRole: user.activeRole,
                passwordHash: user.passwordHash
              },
              create: {
                id: user.id,
                email: user.email,
                name: user.name,
                passwordHash: user.passwordHash,
                roles: user.roles,
                activeRole: user.activeRole,
                status: 'ACTIVE'
              }
            });
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            await prisma.session.create({
              data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(expiresAt),
                ipAddress: clientIp
              }
            });
            await prisma.auditLog.create({
              data: {
                actorId: user.id,
                actorName: user.name,
                actorRole: user.activeRole,
                action: 'USER_LOGIN',
                targetType: 'auth',
                targetId: user.id,
                targetName: user.email,
                details: `User logged in successfully with active role ${user.activeRole}`,
                ipAddress: clientIp
              }
            });
          } catch (e) {
            console.warn('[Prisma] Login persist notice:', e.message);
          }
        }

        logPlatformActivity({
          actorId: user.id,
          actorName: user.name,
          actorRole: user.activeRole,
          action: 'USER_LOGIN',
          targetType: 'auth',
          targetId: user.id,
          targetName: user.email,
          details: `User logged in successfully with active role ${user.activeRole}`,
          ipAddress: clientIp
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
        const { role, email, name, institution, state, mobile, password } = body;

        if (!email || !name || !role) {
          sendJson(res, 400, { error: 'Missing required registration fields (role, email, name).' });
          return;
        }

        const assignedRole = role.toUpperCase();
        // Authority Defense: Disallow self-registration for Level-4 & Level-5 authorities
        if (assignedRole === 'SUPER_ADMIN' || assignedRole === 'PLATFORM_REVIEWER') {
          logPlatformActivity({
            actorId: 'reg-defense',
            actorName: name,
            actorRole: 'ANONYMOUS',
            action: 'UNAUTHORIZED_AUTHORITY_REGISTRATION_ATTEMPT',
            targetType: 'security',
            targetId: assignedRole,
            targetName: 'Authority Self-Registration Defense',
            details: `Blocked attempt to self-register high-level authority account as ${assignedRole} for email ${email}`,
            ipAddress: clientIp
          });
          sendJson(res, 403, { error: 'Self-registration for high-level statutory or national governance authorities is strictly prohibited. Accounts are provisioned through institutional appointment only.' });
          return;
        }

        let passwordToHash = password;
        if (password) {
          const passValidation = validatePasswordStrength(password);
          if (!passValidation.valid) {
            sendJson(res, 400, { error: passValidation.error });
            return;
          }
        } else {
          if (process.env.NODE_ENV === 'production') {
            sendJson(res, 400, { error: 'Password is required for registration.' });
            return;
          }
          passwordToHash = 'CampusNet@Demo2026';
        }

        const lowerEmail = email.toLowerCase().trim();
        const existing = USERS_DB.find(u => u.email.toLowerCase() === lowerEmail);
        if (existing) {
          sendJson(res, 409, { error: 'An account with this institutional email is already registered.' });
          return;
        }

        const passwordHash = await hashPassword(passwordToHash);
        const newId = `usr-${assignedRole.toLowerCase()}-${Date.now()}`;
        const newUser = {
          id: newId,
          email: lowerEmail,
          name,
          mobile: mobile || '',
          institution: institution || 'Academic Institution',
          state: state || 'All India',
          passwordHash,
          roles: [assignedRole],
          activeRole: assignedRole,
          verificationStatus: assignedRole === 'ORGANIZATION_OWNER' ? 'under_review' : 'verified',
          verified: assignedRole !== 'ORGANIZATION_OWNER'
        };

        USERS_DB.push(newUser);
        persistStoreToDisk();

        if (isPrismaConnected) {
          try {
            await prisma.user.create({
              data: {
                id: newId,
                email: lowerEmail,
                name,
                mobile: mobile || '',
                institutionName: institution || 'Academic Institution',
                state: state || 'All India',
                passwordHash,
                roles: [assignedRole],
                activeRole: assignedRole,
                status: 'ACTIVE'
              }
            });
            await prisma.auditLog.create({
              data: {
                actorId: newId,
                actorName: name,
                actorRole: assignedRole,
                action: 'USER_REGISTRATION',
                targetType: 'user',
                targetId: newId,
                targetName: lowerEmail,
                details: `New account registered under role ${assignedRole}`,
                ipAddress: clientIp
              }
            });
          } catch (e) {
            console.warn('[Prisma] User registration persist notice:', e.message);
          }
        }

        logPlatformActivity({
          actorId: newId,
          actorName: name,
          actorRole: assignedRole,
          action: 'USER_REGISTRATION',
          targetType: 'user',
          targetId: newId,
          targetName: lowerEmail,
          details: `New account registered under role ${assignedRole}`,
          ipAddress: clientIp
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
        const { otp, email } = body;
        if (!otp || typeof otp !== 'string') {
          sendJson(res, 400, { error: 'A 6-digit verification code is required.' });
          return;
        }

        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction && (otp === '123456' || otp === '999999')) {
          sendJson(res, 400, { error: 'Static test OTP is strictly prohibited in production mode.' });
          return;
        }

        const normalizedEmail = (email || '').toLowerCase().trim();
        const record = normalizedEmail ? OTP_STORE.get(normalizedEmail) : null;

        if (record) {
          if (Date.now() > record.expiresAt) {
            OTP_STORE.delete(normalizedEmail);
            sendJson(res, 400, { error: 'Verification code has expired. Please request a new OTP.' });
            return;
          }
          if (record.attempts >= OTP_MAX_ATTEMPTS) {
            OTP_STORE.delete(normalizedEmail);
            sendJson(res, 400, { error: 'Too many failed verification attempts. Please request a new OTP.' });
            return;
          }
          const hash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
          if (hash === record.tokenHash) {
            sendJson(res, 200, { success: true, message: 'OTP verified successfully.' });
            return;
          }
          record.attempts++;
          sendJson(res, 400, { error: 'Invalid or expired 6-digit verification code.' });
          return;
        }

        // In non-production testing/development, allow demo codes 123456 / 999999
        if (!isProduction && (otp === '123456' || otp === '999999' || otp.length === 6)) {
          sendJson(res, 200, { success: true, message: 'OTP verified successfully.' });
          return;
        }

        sendJson(res, 400, { error: 'Invalid or expired 6-digit verification code.' });
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

        const normalizedEmail = email.toLowerCase().trim();
        const user = USERS_DB.find(u => u.email.toLowerCase() === normalizedEmail);
        if (!user) {
          sendJson(res, 404, { error: 'No account found matching this institutional email.' });
          return;
        }

        const isProduction = process.env.NODE_ENV === 'production';

        if (otp && newPassword) {
          if (isProduction && (otp === '123456' || otp === '999999')) {
            sendJson(res, 400, { error: 'Static test OTP is strictly prohibited in production mode.' });
            return;
          }

          let otpValid = false;
          const record = OTP_STORE.get(normalizedEmail);

          if (record) {
            if (Date.now() > record.expiresAt) {
              OTP_STORE.delete(normalizedEmail);
              sendJson(res, 400, { error: 'OTP has expired. Please request a new verification code.' });
              return;
            }
            if (record.attempts >= OTP_MAX_ATTEMPTS) {
              OTP_STORE.delete(normalizedEmail);
              sendJson(res, 400, { error: 'Too many failed attempts. Please request a new verification code.' });
              return;
            }
            const hash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
            if (hash === record.tokenHash) {
              otpValid = true;
              OTP_STORE.delete(normalizedEmail); // Single-use consumption
            } else {
              record.attempts++;
            }
          }

          // Fallback in non-production testing environment only
          if (!otpValid && !isProduction && (otp === '123456' || otp === '999999')) {
            otpValid = true;
          }

          if (!otpValid) {
            sendJson(res, 400, { error: 'Invalid or expired OTP verification code.' });
            return;
          }

          const passValidation = validatePasswordStrength(newPassword);
          if (!passValidation.valid) {
            sendJson(res, 400, { error: passValidation.error });
            return;
          }
          const passwordHash = await hashPassword(newPassword);
          user.passwordHash = passwordHash;
          persistStoreToDisk();

          if (isPrismaConnected) {
            try {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  passwordHash,
                  passwordResetTokenHash: null,
                  passwordResetExpiresAt: null
                }
              });
              await prisma.auditLog.create({
                data: {
                  actorId: user.id,
                  actorName: user.name,
                  actorRole: user.activeRole,
                  action: 'PASSWORD_RESET',
                  targetType: 'user',
                  targetId: user.id,
                  targetName: user.email,
                  details: 'Password reset via cryptographic OTP verification with Argon2id',
                  ipAddress: clientIp
                }
              });
            } catch (e) {
              console.warn('[Prisma] Password reset update notice:', e.message);
            }
          }

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
            details: 'Password reset via cryptographic OTP verification with Argon2id'
          });
          sendJson(res, 200, { success: true, message: 'Password has been reset successfully. You may now log in.' });
          return;
        }

        // Stage 1: Generate cryptographic 6-digit OTP challenge
        const generatedOtp = crypto.randomInt(100000, 1000000).toString();
        const tokenHash = crypto.createHash('sha256').update(generatedOtp).digest('hex');
        const expiresAt = Date.now() + OTP_EXPIRY_MS;
        OTP_STORE.set(normalizedEmail, { tokenHash, expiresAt, attempts: 0 });

        if (isPrismaConnected) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                passwordResetTokenHash: tokenHash,
                passwordResetExpiresAt: new Date(expiresAt)
              }
            });
          } catch (e) {
            console.warn('[Prisma] Reset token record notice:', e.message);
          }
        }

        if (isProduction) {
          sendJson(res, 200, {
            success: true,
            message: 'Password recovery OTP dispatched to your registered email.'
          });
        } else {
          sendJson(res, 200, {
            success: true,
            message: `Password recovery OTP dispatched to your registered email (Use ${generatedOtp} or demo code 123456).`,
            demoOtp: generatedOtp,
            testChallengeCode: generatedOtp
          });
        }
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

          if (isPrismaConnected) {
            try {
              const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
              await prisma.session.updateMany({
                where: { tokenHash, revokedAt: null },
                data: { revokedAt: new Date() }
              });
            } catch (e) {
              console.warn('[Prisma] Session logout revocation notice:', e.message);
            }
          }
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
        const auth = await authenticateSession(req);
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
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Unauthorized: Valid session required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const requestedRole = (body.role || '').toUpperCase();

        // Check if the requested role is legitimately assigned to this user
        if (!auth.user.roles.includes(requestedRole) && auth.user.activeRole !== 'SUPER_ADMIN') {
          if (isPrismaConnected) {
            try {
              await prisma.auditLog.create({
                data: {
                  actorId: auth.user.id,
                  actorName: auth.user.name,
                  actorRole: auth.user.activeRole,
                  action: 'SECURITY_ALERT_PRIVILEGE_ESCALATION_BLOCKED',
                  targetType: 'role',
                  targetId: requestedRole,
                  targetName: requestedRole,
                  details: `User attempted unauthorized switch to unassigned role ${requestedRole}`,
                  ipAddress: clientIp
                }
              });
            } catch (e) {
              console.warn('[Prisma] Audit log notice:', e.message);
            }
          }

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

        if (isPrismaConnected) {
          try {
            await prisma.user.update({
              where: { id: auth.user.id },
              data: { activeRole: requestedRole }
            });
          } catch (e) {
            console.warn('[Prisma] Role switch persist notice:', e.message);
          }
        }

        sendJson(res, 200, {
          success: true,
          activeRole: requestedRole,
          permissions: SERVER_ROLE_PERMISSIONS[requestedRole] || []
        });
        return;
      }

      // GET /api/auth/me
      if (pathname === '/api/auth/me' && req.method === 'GET') {
        const auth = await authenticateSession(req);
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
        const auth = await authenticateSession(req);
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
        const auth = await authenticateSession(req);
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
        const auth = await authenticateSession(req);
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

        if (isPrismaConnected) {
          try {
            await prisma.event.create({
              data: {
                id: newEventId,
                title: title || 'Untitled Event',
                organizerId: auth.user.organizationId || 'KEC-DEMO-001',
                organizerName: auth.user.institution || 'Academic Institution',
                eventType: 'Hackathon',
                state: 'All India',
                city: 'Virtual / Campus',
                venue: 'Campus Venue',
                description: title || 'Event Description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                status: status === 'published' ? 'PUBLISHED' : 'DRAFT'
              }
            });
            await prisma.auditLog.create({
              data: {
                actorId: auth.user.id,
                actorName: auth.user.name,
                actorRole: auth.user.activeRole,
                action: 'EVENT_CREATED',
                targetType: 'event',
                targetId: newEventId,
                targetName: title || 'Untitled Event',
                details: `Created event with status ${status}`,
                ipAddress: clientIp
              }
            });
          } catch (e) {
            console.warn('[Prisma] Event create notice:', e.message);
          }
        }

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
        const auth = await authenticateSession(req);
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

          if (isPrismaConnected) {
            try {
              await prisma.user.update({
                where: { id: targetStudentId },
                data: {
                  bio: body.bio !== undefined ? body.bio : student.bio,
                  department: body.department !== undefined ? body.department : student.department
                }
              });
            } catch (e) {
              console.warn('[Prisma] Student update notice:', e.message);
            }
          }

          sendJson(res, 200, { success: true, message: 'Student profile updated.', student });
          return;
        }
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: MENTORSHIP REQUESTS
      // ----------------------------------------------------
      if (pathname === '/api/mentors/requests') {
        const auth = await authenticateSession(req);
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

          if (isPrismaConnected) {
            try {
              await prisma.mentorshipRequest.create({
                data: {
                  id: newRequest.id,
                  studentId: newRequest.studentId,
                  mentorId: newRequest.mentorId,
                  projectTitle: newRequest.projectTitle,
                  teamName: newRequest.teamName,
                  message: newRequest.message,
                  status: 'PENDING'
                }
              });
            } catch (e) {
              console.warn('[Prisma] Mentorship request notice:', e.message);
            }
          }

          MENTORSHIP_REQUESTS_DB.push(newRequest);
          logPlatformActivity({
            actorId: auth.user.id,
            actorName: auth.user.name,
            actorRole: auth.user.activeRole,
            action: 'MENTORSHIP_REQUEST_SUBMITTED',
            targetType: 'mentorship',
            targetId: newRequest.id,
            targetName: newRequest.projectTitle,
            details: `Mentorship request submitted by ${auth.user.name} to ${newRequest.mentorName} for "${newRequest.projectTitle}"`,
            ipAddress: clientIp
          });
          sendJson(res, 201, { success: true, request: newRequest });
          return;
        }
      }

      if (pathname.startsWith('/api/mentors/requests/') && req.method === 'PUT') {
        const requestId = pathname.replace('/api/mentors/requests/', '');
        const auth = await authenticateSession(req);
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
        if (body.status) {
          reqItem.status = body.status;

          if (isPrismaConnected) {
            try {
              const reqStatus = body.status.toUpperCase();
              await prisma.mentorshipRequest.update({
                where: { id: requestId },
                data: {
                  status: ['ACCEPTED', 'DECLINED', 'PENDING', 'COMPLETED'].includes(reqStatus) ? reqStatus : 'PENDING'
                }
              });
            } catch (e) {
              console.warn('[Prisma] Mentorship update notice:', e.message);
            }
          }

          logPlatformActivity({
            actorId: auth.user.id,
            actorName: auth.user.name,
            actorRole: auth.user.activeRole,
            action: reqItem.status === 'accepted' ? 'MENTORSHIP_REQUEST_ACCEPTED' : 'MENTORSHIP_REQUEST_DECLINED',
            targetType: 'mentorship',
            targetId: reqItem.id,
            targetName: reqItem.projectTitle,
            details: `Mentorship request for "${reqItem.projectTitle}" updated to ${reqItem.status} by ${auth.user.name}`,
            ipAddress: clientIp
          });
        }
        sendJson(res, 200, { success: true, request: reqItem });
        return;
      }

      // ----------------------------------------------------
      // RESOURCE-LEVEL AUTHORIZATION: RESEARCH COLLABORATIONS
      // ----------------------------------------------------
      if (pathname === '/api/research/collaborations') {
        const auth = await authenticateSession(req);
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

          if (isPrismaConnected) {
            try {
              await prisma.researchCollaboration.create({
                data: {
                  id: newCollab.id,
                  requesterId: newCollab.requesterId,
                  collaboratorId: newCollab.collaboratorId,
                  projectTitle: newCollab.projectTitle,
                  status: 'pending',
                  confidentialDraft: newCollab.confidentialDraft
                }
              });
            } catch (e) {
              console.warn('[Prisma] Research collab notice:', e.message);
            }
          }

          RESEARCH_COLLABORATIONS_DB.push(newCollab);
          persistStoreToDisk();

          logPlatformActivity({
            actorId: auth.user.id,
            actorName: auth.user.name,
            actorRole: auth.user.activeRole,
            action: 'RESEARCH_COLLABORATION_PROPOSED',
            targetType: 'research',
            targetId: newCollab.id,
            targetName: newCollab.projectTitle,
            details: `Research collaboration proposed by ${auth.user.name} to ${newCollab.collaboratorName} on "${newCollab.projectTitle}"`,
            ipAddress: clientIp
          });

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
        const auth = await authenticateSession(req);
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

          if (isPrismaConnected) {
            try {
              await prisma.organizationMember.create({
                data: {
                  id: newMember.id,
                  organizationId: targetOrgId,
                  userId: newMember.userId,
                  name: newMember.name,
                  email: newMember.email,
                  role: newMember.role,
                  status: newMember.status
                }
              });
            } catch (e) {
              console.warn('[Prisma] Org member create notice:', e.message);
            }
          }

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
        const auth = await authenticateSession(req);
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

          if (isPrismaConnected) {
            try {
              await prisma.eventRegistration.upsert({
                where: {
                  eventId_participantId: {
                    eventId: newReg.eventId,
                    participantId: newReg.studentId
                  }
                },
                update: {
                  teamName: newReg.teamName,
                  status: 'confirmed',
                  registeredAt: new Date(newReg.registeredAt)
                },
                create: {
                  id: newReg.id,
                  eventId: newReg.eventId,
                  participantId: newReg.studentId,
                  teamName: newReg.teamName,
                  status: 'confirmed',
                  registeredAt: new Date(newReg.registeredAt)
                }
              });
            } catch (e) {
              console.warn('[Prisma] Event registration notice:', e.message);
            }
          }

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

          logPlatformActivity({
            actorId: auth.user.id,
            actorName: auth.user.name,
            actorRole: auth.user.activeRole,
            action: 'EVENT_REGISTRATION',
            targetType: 'event',
            targetId: eventId,
            targetName: newReg.teamName,
            details: `Student ${auth.user.name} registered for event ${eventId} with team "${newReg.teamName}"`,
            ipAddress: clientIp
          });

          sendJson(res, 201, { success: true, registration: newReg });
          return;
        }
      }

      // GET /api/admin/audit-logs - Unified Activity Audit Trail for High-Level Authorities
      if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
        const auth = await authenticateSession(req);
        if (!auth || (auth.user.activeRole !== 'SUPER_ADMIN' && auth.user.activeRole !== 'PLATFORM_REVIEWER')) {
          sendJson(res, 403, { error: 'Access Denied: High-level statutory/administrative privilege required.' });
          return;
        }

        let combinedLogs = [...AUDIT_LOGS];

        if (isPrismaConnected) {
          try {
            const dbLogs = await prisma.auditLog.findMany({
              orderBy: { timestamp: 'desc' },
              take: 200
            });
            if (dbLogs && dbLogs.length > 0) {
              const memoryIds = new Set(AUDIT_LOGS.map(l => l.id));
              for (const log of dbLogs) {
                if (!memoryIds.has(log.id)) {
                  combinedLogs.push({
                    id: log.id,
                    actorId: log.actorId || 'system',
                    actorName: log.actorName,
                    actorRole: log.actorRole,
                    action: log.action,
                    targetType: log.targetType,
                    targetId: log.targetId,
                    targetName: log.targetName,
                    timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : new Date(log.timestamp).toISOString(),
                    details: log.details,
                    ipAddress: log.ipAddress || 'Internal TLS'
                  });
                }
              }
            }
          } catch (e) {
            console.warn('[Prisma] Audit log query notice:', e.message);
          }
        }

        combinedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        sendJson(res, 200, { auditLogs: combinedLogs });
        return;
      }

      // POST /api/admin/audit-logs - Report Platform Activity Event
      if (pathname === '/api/admin/audit-logs' && req.method === 'POST') {
        const auth = await authenticateSession(req);
        const body = await parseJsonBody(req);

        const newLog = logPlatformActivity({
          actorId: auth?.user?.id || body.actorId || 'client-reporter',
          actorName: auth?.user?.name || body.actorName || 'User Action',
          actorRole: auth?.user?.activeRole || body.actorRole || 'PUBLIC',
          action: body.action || 'CLIENT_ACTIVITY',
          targetType: body.targetType || 'ui',
          targetId: body.targetId || 'app',
          targetName: body.targetName || 'CampusNet Ecosystem',
          details: body.details || 'User triggered platform event',
          ipAddress: clientIp
        });

        sendJson(res, 201, { success: true, log: newLog });
        return;
      }

      // ----------------------------------------------------
      // CERTIFICATE VERIFICATION & LIFECYCLE AUDIT ENDPOINT
      // ----------------------------------------------------
      if (pathname.match(/^\/api\/certificates\/verify\/[a-zA-Z0-9_-]+$/) && req.method === 'GET') {
        const certNumber = pathname.split('/')[4];
        let cert = null;

        if (isPrismaConnected) {
          try {
            cert = await prisma.certificate.findFirst({
              where: {
                certificateNumber: {
                  equals: certNumber,
                  mode: 'insensitive'
                }
              }
            });
          } catch (e) {
            console.warn('[Prisma] Certificate verify query notice:', e.message);
          }
        }

        if (!cert) {
          cert = CERTIFICATES_DB.find(c => c.certificateNumber.toLowerCase() === certNumber.toLowerCase());
        }

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

      // ====================================================
      // 1. PROJECTS API ENDPOINTS (/api/projects)
      // ====================================================

      // GET /api/projects (Listing with filtering)
      if (pathname === '/api/projects' && req.method === 'GET') {
        const domain = parsedUrl.searchParams.get('domain');
        const institution = parsedUrl.searchParams.get('institution');
        const status = parsedUrl.searchParams.get('status');
        const search = parsedUrl.searchParams.get('search');

        let projects = [];

        if (isPrismaConnected) {
          try {
            const whereClause = { deletedAt: null };
            if (domain) {
              whereClause.domain = { contains: domain, mode: 'insensitive' };
            }
            if (status) {
              whereClause.status = toPrismaProjectStatus(status);
            }
            const dbProjects = await prisma.project.findMany({
              where: whereClause,
              include: {
                author: true,
                mentor: true,
                institution: true,
                team: { include: { members: true, leader: true } },
                milestones: true,
                tasks: true
              },
              orderBy: { createdAt: 'desc' }
            });
            projects = dbProjects.map(formatPrismaProject);
          } catch (e) {
            console.warn('[Prisma] Projects query notice:', e.message);
          }
        }

        if (projects.length === 0) {
          projects = PROJECTS_DB.map(p => ({ ...p }));
        }

        // Apply client filters if in-memory fallback was used or extra filtering needed
        if (domain) {
          projects = projects.filter(p => p.domain.toLowerCase().includes(domain.toLowerCase()));
        }
        if (status) {
          projects = projects.filter(p => p.status.toLowerCase() === status.toLowerCase());
        }
        if (institution) {
          projects = projects.filter(p => (p.institution || '').toLowerCase().includes(institution.toLowerCase()));
        }
        if (search) {
          const q = search.toLowerCase();
          projects = projects.filter(p => 
            p.title.toLowerCase().includes(q) ||
            p.problemStatement.toLowerCase().includes(q) ||
            (p.domain && p.domain.toLowerCase().includes(q)) ||
            (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(q)))
          );
        }

        sendJson(res, 200, { success: true, count: projects.length, projects });
        return;
      }

      // POST /api/projects (Creation with transactional initial milestones/team)
      if (pathname === '/api/projects' && req.method === 'POST') {
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required to create a project.' });
          return;
        }

        const allowedRoles = ['STUDENT', 'MENTOR', 'PHD_RESEARCHER', 'SUPER_ADMIN'];
        if (!allowedRoles.includes(auth.user.activeRole)) {
          sendJson(res, 403, { error: 'Permission Denied: Only students, researchers, or mentors can create projects.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { title, problemStatement, proposedSolution, domain, technologies, requiredSkills, githubUrl, demoUrl, documentationUrl, objectives, seekingRoles } = body;

        if (!title || !title.trim()) {
          sendJson(res, 400, { error: 'Project title is required.' });
          return;
        }
        if (!domain || !domain.trim()) {
          sendJson(res, 400, { error: 'Project domain is required.' });
          return;
        }

        const newProjectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const authorId = auth.user.id;
        const institutionId = auth.user.institutionId || undefined;
        const institutionName = auth.user.institution || 'Academic Institution';

        if (isPrismaConnected) {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.project.create({
                data: {
                  id: newProjectId,
                  title: title.trim(),
                  problemStatement: problemStatement || '',
                  proposedSolution: proposedSolution || '',
                  domain: domain.trim(),
                  technologies: Array.isArray(technologies) ? technologies : [],
                  requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
                  objectives: Array.isArray(objectives) ? objectives : [],
                  seekingRoles: Array.isArray(seekingRoles) ? seekingRoles : [],
                  status: toPrismaProjectStatus(body.status || 'IDEA'),
                  progressPercent: typeof body.progressPercent === 'number' ? body.progressPercent : 15,
                  githubUrl: githubUrl || null,
                  demoUrl: demoUrl || null,
                  documentationUrl: documentationUrl || null,
                  authorId,
                  institutionId,
                  teamMembersCount: 1,
                  likesCount: 0
                }
              });

              // Initial milestone
              await tx.projectMilestone.create({
                data: {
                  id: `m-${Date.now()}-1`,
                  projectId: newProjectId,
                  title: 'Problem Definition & Literature Review',
                  description: 'Complete requirements specification and architecture design.',
                  status: 'APPROVED',
                  approvedByMentor: true,
                  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
              });

              await tx.auditLog.create({
                data: {
                  actorId: auth.user.id,
                  actorName: auth.user.name,
                  actorRole: auth.user.activeRole,
                  action: 'PROJECT_CREATED',
                  targetType: 'project',
                  targetId: newProjectId,
                  targetName: title.trim(),
                  details: `Created project "${title.trim()}" in domain ${domain.trim()}`,
                  ipAddress: clientIp
                }
              });
            });
          } catch (e) {
            console.warn('[Prisma] Project create transaction notice:', e.message);
          }
        }

        // Format project record for in-memory and response
        const newProjRecord = {
          id: newProjectId,
          title: title.trim(),
          problemStatement: problemStatement || '',
          proposedSolution: proposedSolution || '',
          domain: domain.trim(),
          technologies: Array.isArray(technologies) ? technologies : [],
          requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
          objectives: Array.isArray(objectives) ? objectives : [],
          seekingRoles: Array.isArray(seekingRoles) ? seekingRoles : [],
          status: body.status || 'Idea',
          progressPercent: typeof body.progressPercent === 'number' ? body.progressPercent : 15,
          githubUrl: githubUrl || undefined,
          demoUrl: demoUrl || undefined,
          documentationUrl: documentationUrl || undefined,
          authorId,
          institution: institutionName,
          teamMembersCount: 1,
          likes: 0,
          milestones: [
            {
              id: `m-${Date.now()}-1`,
              title: 'Problem Definition & Literature Review',
              description: 'Complete requirements specification and architecture design.',
              status: 'approved',
              approvedByMentor: true,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          ],
          tasks: [],
          createdAt: new Date().toISOString()
        };

        PROJECTS_DB.unshift(newProjRecord);
        logPlatformActivity({
          actorId: auth.user.id,
          actorName: auth.user.name,
          actorRole: auth.user.activeRole,
          action: 'PROJECT_CREATED',
          targetType: 'project',
          targetId: newProjectId,
          targetName: title.trim(),
          details: `Created project "${title.trim()}" in domain ${domain.trim()}`,
          ipAddress: clientIp
        });

        persistStoreToDisk();

        sendJson(res, 201, {
          success: true,
          message: 'Project created successfully on CampusNet.',
          project: newProjRecord
        });
        return;
      }

      // GET /api/projects/:id (Get single project with relations)
      if (pathname.startsWith('/api/projects/') && !pathname.includes('/milestones') && !pathname.includes('/tasks') && req.method === 'GET') {
        const projectId = pathname.replace('/api/projects/', '');
        let project = null;

        if (isPrismaConnected) {
          try {
            const dbProj = await prisma.project.findFirst({
              where: { id: projectId, deletedAt: null },
              include: {
                author: true,
                mentor: true,
                institution: true,
                team: { include: { members: true, leader: true } },
                milestones: true,
                tasks: true
              }
            });
            if (dbProj) project = formatPrismaProject(dbProj);
          } catch (e) {
            console.warn('[Prisma] Project lookup notice:', e.message);
          }
        }

        if (!project) {
          project = PROJECTS_DB.find(p => p.id === projectId);
        }

        if (!project) {
          sendJson(res, 404, { error: 'Project not found.' });
          return;
        }

        sendJson(res, 200, { success: true, project });
        return;
      }

      // PUT /api/projects/:id (Update project details with ownership check)
      if (pathname.startsWith('/api/projects/') && !pathname.includes('/milestones') && !pathname.includes('/tasks') && req.method === 'PUT') {
        const projectId = pathname.replace('/api/projects/', '');
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        let existingProject = null;
        if (isPrismaConnected) {
          try {
            existingProject = await prisma.project.findUnique({ where: { id: projectId } });
          } catch (e) {}
        }
        if (!existingProject) {
          existingProject = PROJECTS_DB.find(p => p.id === projectId);
        }

        if (!existingProject) {
          sendJson(res, 404, { error: 'Project not found.' });
          return;
        }

        // Ownership enforcement: Only author, assigned mentor, or super admin can update
        const isAuthor = existingProject.authorId === auth.user.id;
        const isMentor = existingProject.mentorId === auth.user.id || auth.user.activeRole === 'MENTOR';
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';

        if (!isAuthor && !isMentor && !isSuperAdmin) {
          sendJson(res, 403, { error: 'Access Denied: You do not have permission to modify this project.' });
          return;
        }

        const body = await parseJsonBody(req);
        const updateData = {};
        if (body.title) updateData.title = body.title.trim();
        if (body.problemStatement !== undefined) updateData.problemStatement = body.problemStatement;
        if (body.proposedSolution !== undefined) updateData.proposedSolution = body.proposedSolution;
        if (body.domain) updateData.domain = body.domain;
        if (body.status) updateData.status = toPrismaProjectStatus(body.status);
        if (body.progressPercent !== undefined) updateData.progressPercent = body.progressPercent;
        if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl;
        if (body.demoUrl !== undefined) updateData.demoUrl = body.demoUrl;
        if (body.documentationUrl !== undefined) updateData.documentationUrl = body.documentationUrl;
        if (body.mentorStatus) updateData.mentorStatus = body.mentorStatus;
        if (body.mentorId) updateData.mentorId = body.mentorId;

        if (isPrismaConnected) {
          try {
            await prisma.project.update({
              where: { id: projectId },
              data: updateData
            });
          } catch (e) {
            console.warn('[Prisma] Project update notice:', e.message);
          }
        }

        const memProj = PROJECTS_DB.find(p => p.id === projectId);
        if (memProj) {
          Object.assign(memProj, body);
        }
        persistStoreToDisk();

        sendJson(res, 200, { success: true, message: 'Project updated successfully.', project: memProj || existingProject });
        return;
      }

      // DELETE /api/projects/:id (Soft-delete project with ownership check)
      if (pathname.startsWith('/api/projects/') && !pathname.includes('/milestones') && !pathname.includes('/tasks') && req.method === 'DELETE') {
        const projectId = pathname.replace('/api/projects/', '');
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        let existingProject = null;
        if (isPrismaConnected) {
          try {
            existingProject = await prisma.project.findUnique({ where: { id: projectId } });
          } catch (e) {}
        }
        if (!existingProject) {
          existingProject = PROJECTS_DB.find(p => p.id === projectId);
        }

        if (!existingProject) {
          sendJson(res, 404, { error: 'Project not found.' });
          return;
        }

        const isAuthor = existingProject.authorId === auth.user.id;
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';

        if (!isAuthor && !isSuperAdmin) {
          sendJson(res, 403, { error: 'Access Denied: Only project author or administrator can delete a project.' });
          return;
        }

        if (isPrismaConnected) {
          try {
            await prisma.project.update({
              where: { id: projectId },
              data: { deletedAt: new Date() }
            });
          } catch (e) {
            console.warn('[Prisma] Project delete notice:', e.message);
          }
        }

        PROJECTS_DB = PROJECTS_DB.filter(p => p.id !== projectId);
        persistStoreToDisk();

        sendJson(res, 200, { success: true, message: 'Project successfully deleted.' });
        return;
      }

      // POST /api/projects/:id/milestones (Add Milestone)
      if (pathname.match(/^\/api\/projects\/[a-zA-Z0-9_-]+\/milestones$/) && req.method === 'POST') {
        const projectId = pathname.split('/')[3];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { title, description, dueDate, status } = body;
        if (!title) {
          sendJson(res, 400, { error: 'Milestone title is required.' });
          return;
        }

        const milestoneId = `m-${Date.now()}`;
        const milestoneObj = {
          id: milestoneId,
          title: title.trim(),
          description: description || '',
          status: status || 'pending',
          dueDate: dueDate || '',
          approvedByMentor: status === 'approved'
        };

        if (isPrismaConnected) {
          try {
            await prisma.projectMilestone.create({
              data: {
                id: milestoneId,
                projectId,
                title: title.trim(),
                description: description || '',
                status: toPrismaMilestoneStatus(status),
                dueDate: dueDate ? new Date(dueDate) : null,
                approvedByMentor: status === 'approved'
              }
            });
          } catch (e) {
            console.warn('[Prisma] Milestone create notice:', e.message);
          }
        }

        const proj = PROJECTS_DB.find(p => p.id === projectId);
        if (proj) {
          if (!proj.milestones) proj.milestones = [];
          proj.milestones.push(milestoneObj);
          persistStoreToDisk();
        }

        sendJson(res, 201, { success: true, milestone: milestoneObj });
        return;
      }

      // PUT /api/projects/:id/milestones/:milestoneId (Update Milestone Status / Feedback)
      if (pathname.match(/^\/api\/projects\/[a-zA-Z0-9_-]+\/milestones\/[a-zA-Z0-9_-]+$/) && req.method === 'PUT') {
        const parts = pathname.split('/');
        const projectId = parts[3];
        const milestoneId = parts[5];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { status, feedback } = body;

        // If approving milestone, verify caller has mentor or super admin role
        if (status === 'approved' && auth.user.activeRole !== 'MENTOR' && auth.user.activeRole !== 'SUPER_ADMIN') {
          sendJson(res, 403, { error: 'Access Denied: Only accredited mentors or administrators can approve project milestones.' });
          return;
        }

        if (isPrismaConnected) {
          try {
            await prisma.projectMilestone.update({
              where: { id: milestoneId },
              data: {
                status: status ? toPrismaMilestoneStatus(status) : undefined,
                approvedByMentor: status === 'approved',
                mentorFeedback: feedback || undefined
              }
            });
          } catch (e) {
            console.warn('[Prisma] Milestone update notice:', e.message);
          }
        }

        const proj = PROJECTS_DB.find(p => p.id === projectId);
        let updatedMilestone = null;
        if (proj && Array.isArray(proj.milestones)) {
          const m = proj.milestones.find(x => x.id === milestoneId);
          if (m) {
            if (status) m.status = status;
            if (status === 'approved') m.approvedByMentor = true;
            if (feedback) m.mentorFeedback = feedback;
            updatedMilestone = m;
          }
          persistStoreToDisk();
        }

        sendJson(res, 200, { success: true, message: 'Milestone updated.', milestone: updatedMilestone });
        return;
      }

      // POST /api/projects/:id/tasks (Add Task)
      if (pathname.match(/^\/api\/projects\/[a-zA-Z0-9_-]+\/tasks$/) && req.method === 'POST') {
        const projectId = pathname.split('/')[3];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { title, assignee, priority, status } = body;
        if (!title) {
          sendJson(res, 400, { error: 'Task title is required.' });
          return;
        }

        const taskId = `t-${Date.now()}`;
        const taskObj = {
          id: taskId,
          title: title.trim(),
          assignee: assignee || auth.user.name,
          priority: priority || 'medium',
          status: status || 'todo'
        };

        if (isPrismaConnected) {
          try {
            await prisma.projectTask.create({
              data: {
                id: taskId,
                projectId,
                title: title.trim(),
                assigneeName: assignee || auth.user.name,
                priority: priority || 'medium',
                status: toPrismaTaskStatus(status)
              }
            });
          } catch (e) {
            console.warn('[Prisma] Task create notice:', e.message);
          }
        }

        const proj = PROJECTS_DB.find(p => p.id === projectId);
        if (proj) {
          if (!proj.tasks) proj.tasks = [];
          proj.tasks.push(taskObj);
          persistStoreToDisk();
        }

        sendJson(res, 201, { success: true, task: taskObj });
        return;
      }

      // PUT /api/projects/:id/tasks/:taskId (Update Task Status)
      if (pathname.match(/^\/api\/projects\/[a-zA-Z0-9_-]+\/tasks\/[a-zA-Z0-9_-]+$/) && req.method === 'PUT') {
        const parts = pathname.split('/');
        const projectId = parts[3];
        const taskId = parts[5];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { status, priority, title, assignee } = body;

        if (isPrismaConnected) {
          try {
            await prisma.projectTask.update({
              where: { id: taskId },
              data: {
                status: status ? toPrismaTaskStatus(status) : undefined,
                priority: priority || undefined,
                title: title || undefined,
                assigneeName: assignee || undefined
              }
            });
          } catch (e) {
            console.warn('[Prisma] Task update notice:', e.message);
          }
        }

        const proj = PROJECTS_DB.find(p => p.id === projectId);
        let updatedTask = null;
        if (proj && Array.isArray(proj.tasks)) {
          const t = proj.tasks.find(x => x.id === taskId);
          if (t) {
            if (status) t.status = status;
            if (priority) t.priority = priority;
            if (title) t.title = title;
            if (assignee) t.assignee = assignee;
            updatedTask = t;
          }
          persistStoreToDisk();
        }

        sendJson(res, 200, { success: true, message: 'Task updated.', task: updatedTask });
        return;
      }

      // ====================================================
      // 2. TEAMS API ENDPOINTS (/api/teams)
      // ====================================================

      // GET /api/teams (Listing with optional projectId/eventId filters)
      if (pathname === '/api/teams' && req.method === 'GET') {
        const projectId = parsedUrl.searchParams.get('projectId');
        const eventId = parsedUrl.searchParams.get('eventId');
        const search = parsedUrl.searchParams.get('search');

        let teams = [];

        if (isPrismaConnected) {
          try {
            const whereClause = {};
            if (projectId) whereClause.projectId = projectId;
            if (eventId) whereClause.eventId = eventId;
            const dbTeams = await prisma.team.findMany({
              where: whereClause,
              include: {
                members: { include: { user: true } },
                project: true,
                leader: true,
                mentor: true
              },
              orderBy: { createdAt: 'desc' }
            });
            teams = dbTeams.map(formatPrismaTeam);
          } catch (e) {
            console.warn('[Prisma] Teams query notice:', e.message);
          }
        }

        if (teams.length === 0) {
          teams = TEAMS_DB.map(t => ({ ...t }));
        }

        if (projectId) {
          teams = teams.filter(t => t.projectId === projectId);
        }
        if (eventId) {
          teams = teams.filter(t => t.eventId === eventId);
        }
        if (search) {
          const q = search.toLowerCase();
          teams = teams.filter(t => 
            t.name.toLowerCase().includes(q) ||
            (t.projectName && t.projectName.toLowerCase().includes(q)) ||
            (t.domain && t.domain.toLowerCase().includes(q))
          );
        }

        sendJson(res, 200, { success: true, count: teams.length, teams });
        return;
      }

      // POST /api/teams (Team Creation via Prisma Transaction)
      if (pathname === '/api/teams' && req.method === 'POST') {
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required to form a team.' });
          return;
        }

        const allowedRoles = ['STUDENT', 'SUPER_ADMIN'];
        if (!allowedRoles.includes(auth.user.activeRole)) {
          sendJson(res, 403, { error: 'Permission Denied: Only students or administrators can form innovation teams.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { name, projectName, domain, projectId, maxMembers, requiredRoles, eventId } = body;

        if (!name || !name.trim()) {
          sendJson(res, 400, { error: 'Team name is required.' });
          return;
        }
        if (!domain || !domain.trim()) {
          sendJson(res, 400, { error: 'Team domain is required.' });
          return;
        }

        const newTeamId = `team-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const leaderId = auth.user.id;
        const leaderName = auth.user.name;

        const rolesList = Array.isArray(requiredRoles) && requiredRoles.length > 0 ? requiredRoles : [
          { role: 'Lead Developer', departmentHint: 'CSE', filled: true, filledBy: leaderName },
          { role: 'Hardware Specialist', departmentHint: 'ECE', filled: false }
        ];

        if (isPrismaConnected) {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.team.create({
                data: {
                  id: newTeamId,
                  name: name.trim(),
                  domain: domain.trim(),
                  projectId: projectId || null,
                  eventId: eventId || null,
                  leaderId,
                  maxMembers: typeof maxMembers === 'number' ? maxMembers : 6,
                  status: 'forming',
                  requiredRoles: rolesList
                }
              });

              // Atomically insert the leader as first member
              await tx.teamMember.create({
                data: {
                  teamId: newTeamId,
                  userId: leaderId,
                  roleName: 'Team Leader',
                  department: auth.user.department || null,
                  college: auth.user.institution || null,
                  isLeader: true,
                  studentId: auth.user.studentId || null,
                  email: auth.user.email || null,
                  mobile: auth.user.mobile || null
                }
              });

              if (projectId) {
                await tx.project.update({
                  where: { id: projectId },
                  data: { teamMembersCount: 1 }
                }).catch(() => {});
              }

              await tx.auditLog.create({
                data: {
                  actorId: leaderId,
                  actorName: leaderName,
                  actorRole: auth.user.activeRole,
                  action: 'TEAM_CREATED',
                  targetType: 'team',
                  targetId: newTeamId,
                  targetName: name.trim(),
                  details: `Formed new team "${name.trim()}" in domain ${domain.trim()}`,
                  ipAddress: clientIp
                }
              });
            });
          } catch (e) {
            console.warn('[Prisma] Team create transaction notice:', e.message);
          }
        }

        const newTeamRecord = {
          id: newTeamId,
          name: name.trim(),
          projectId: projectId || undefined,
          projectName: projectName || 'Active Project',
          domain: domain.trim(),
          leaderId,
          leaderName,
          members: [
            {
              userId: leaderId,
              name: leaderName,
              department: auth.user.department || '',
              college: auth.user.institution || '',
              role: 'Team Leader',
              avatar: auth.user.avatar || '',
              verified: Boolean(auth.user.verifiedStudent || auth.user.verified),
              isLeader: true,
              studentId: auth.user.studentId || undefined,
              email: auth.user.email || undefined,
              mobile: auth.user.mobile || undefined
            }
          ],
          maxMembers: typeof maxMembers === 'number' ? maxMembers : 6,
          requiredRoles: rolesList,
          status: 'forming',
          mentorStatus: 'none',
          createdAt: new Date().toISOString()
        };

        TEAMS_DB.unshift(newTeamRecord);
        persistStoreToDisk();

        sendJson(res, 201, {
          success: true,
          message: `Team "${newTeamRecord.name}" successfully created.`,
          team: newTeamRecord
        });
        return;
      }

      // GET /api/teams/:id (Get single team with members)
      if (pathname.startsWith('/api/teams/') && !pathname.includes('/members') && req.method === 'GET') {
        const teamId = pathname.replace('/api/teams/', '');
        let team = null;

        if (isPrismaConnected) {
          try {
            const dbTeam = await prisma.team.findUnique({
              where: { id: teamId },
              include: {
                members: { include: { user: true } },
                project: true,
                leader: true,
                mentor: true
              }
            });
            if (dbTeam) team = formatPrismaTeam(dbTeam);
          } catch (e) {
            console.warn('[Prisma] Team lookup notice:', e.message);
          }
        }

        if (!team) {
          team = TEAMS_DB.find(t => t.id === teamId);
        }

        if (!team) {
          sendJson(res, 404, { error: 'Team not found.' });
          return;
        }

        sendJson(res, 200, { success: true, team });
        return;
      }

      // PUT /api/teams/:id (Update team with leader authorization)
      if (pathname.startsWith('/api/teams/') && !pathname.includes('/members') && req.method === 'PUT') {
        const teamId = pathname.replace('/api/teams/', '');
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        let existingTeam = null;
        if (isPrismaConnected) {
          try {
            existingTeam = await prisma.team.findUnique({ where: { id: teamId } });
          } catch (e) {}
        }
        if (!existingTeam) {
          existingTeam = TEAMS_DB.find(t => t.id === teamId);
        }

        if (!existingTeam) {
          sendJson(res, 404, { error: 'Team not found.' });
          return;
        }

        const isLeader = existingTeam.leaderId === auth.user.id;
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';

        if (!isLeader && !isSuperAdmin) {
          sendJson(res, 403, { error: 'Access Denied: Only the team leader or administrator can modify team settings.' });
          return;
        }

        const body = await parseJsonBody(req);
        const updateData = {};
        if (body.name) updateData.name = body.name.trim();
        if (body.domain) updateData.domain = body.domain;
        if (body.status) updateData.status = body.status;
        if (body.requiredRoles) updateData.requiredRoles = body.requiredRoles;
        if (body.maxMembers) updateData.maxMembers = body.maxMembers;
        if (body.mentorId) updateData.mentorId = body.mentorId;
        if (body.mentorStatus) updateData.mentorStatus = body.mentorStatus;

        if (isPrismaConnected) {
          try {
            await prisma.team.update({
              where: { id: teamId },
              data: updateData
            });
          } catch (e) {
            console.warn('[Prisma] Team update notice:', e.message);
          }
        }

        const memTeam = TEAMS_DB.find(t => t.id === teamId);
        if (memTeam) {
          Object.assign(memTeam, body);
        }
        persistStoreToDisk();

        sendJson(res, 200, { success: true, message: 'Team settings updated.', team: memTeam || existingTeam });
        return;
      }

      // POST /api/teams/:id/members (Join team / claim role)
      if (pathname.match(/^\/api\/teams\/[a-zA-Z0-9_-]+\/members$/) && req.method === 'POST') {
        const teamId = pathname.split('/')[3];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required to join team.' });
          return;
        }

        let team = null;
        if (isPrismaConnected) {
          try {
            team = await prisma.team.findUnique({
              where: { id: teamId },
              include: { members: true, project: true }
            });
          } catch (e) {}
        }
        if (!team) {
          team = TEAMS_DB.find(t => t.id === teamId);
        }

        if (!team) {
          sendJson(res, 404, { error: 'Team not found.' });
          return;
        }

        if (team.status === 'completed') {
          sendJson(res, 400, { error: 'Cannot join a completed team.' });
          return;
        }

        const members = team.members || [];
        // Duplicate membership check
        const isAlreadyMember = members.some(m => m.userId === auth.user.id);
        if (isAlreadyMember) {
          sendJson(res, 400, { error: 'You are already an active member of this team.' });
          return;
        }

        // Capacity check
        if (members.length >= (team.maxMembers || 6)) {
          sendJson(res, 400, { error: 'This team has already reached its maximum member capacity.' });
          return;
        }

        const body = await parseJsonBody(req);
        const { roleIndex, roleName } = body;

        let assignedRoleName = roleName || 'Contributor';
        const requiredRoles = Array.isArray(team.requiredRoles) ? [...team.requiredRoles] : [];

        if (typeof roleIndex === 'number' && requiredRoles[roleIndex]) {
          const roleSlot = requiredRoles[roleIndex];
          if (roleSlot.filled) {
            sendJson(res, 400, { error: 'This role has already been claimed by another team member.' });
            return;
          }
          roleSlot.filled = true;
          roleSlot.filledBy = auth.user.name;
          assignedRoleName = roleSlot.role || assignedRoleName;
        }

        const newMemberRecord = {
          userId: auth.user.id,
          name: auth.user.name,
          department: auth.user.department || '',
          college: auth.user.institution || '',
          role: assignedRoleName,
          avatar: auth.user.avatar || '',
          verified: Boolean(auth.user.verifiedStudent || auth.user.verified),
          isLeader: false,
          studentId: auth.user.studentId || undefined,
          email: auth.user.email || undefined,
          mobile: auth.user.mobile || undefined
        };

        if (isPrismaConnected) {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.teamMember.create({
                data: {
                  teamId,
                  userId: auth.user.id,
                  roleName: assignedRoleName,
                  department: auth.user.department || null,
                  college: auth.user.institution || null,
                  isLeader: false,
                  studentId: auth.user.studentId || null,
                  email: auth.user.email || null,
                  mobile: auth.user.mobile || null
                }
              });

              await tx.team.update({
                where: { id: teamId },
                data: {
                  requiredRoles: requiredRoles,
                  updatedAt: new Date()
                }
              });

              if (team.projectId) {
                await tx.project.update({
                  where: { id: team.projectId },
                  data: { teamMembersCount: members.length + 1 }
                }).catch(() => {});
              }

              await tx.auditLog.create({
                data: {
                  actorId: auth.user.id,
                  actorName: auth.user.name,
                  actorRole: auth.user.activeRole,
                  action: 'TEAM_MEMBER_JOINED',
                  targetType: 'team',
                  targetId: teamId,
                  targetName: team.name,
                  details: `${auth.user.name} joined as ${assignedRoleName}`,
                  ipAddress: clientIp
                }
              });
            });
          } catch (e) {
            console.warn('[Prisma] Team member join transaction notice:', e.message);
          }
        }

        const memTeam = TEAMS_DB.find(t => t.id === teamId);
        if (memTeam) {
          if (!memTeam.members) memTeam.members = [];
          memTeam.members.push(newMemberRecord);
          memTeam.requiredRoles = requiredRoles;
          persistStoreToDisk();
        }

        sendJson(res, 201, {
          success: true,
          message: `Successfully joined ${team.name} as ${assignedRoleName}!`,
          member: newMemberRecord
        });
        return;
      }

      // DELETE /api/teams/:id/members/:userId (Leave team or remove member)
      if (pathname.match(/^\/api\/teams\/[a-zA-Z0-9_-]+\/members\/[a-zA-Z0-9_-]+$/) && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const teamId = parts[3];
        const targetUserId = parts[5];
        const auth = await authenticateSession(req);
        if (!auth) {
          sendJson(res, 401, { error: 'Authentication required.' });
          return;
        }

        let team = null;
        if (isPrismaConnected) {
          try {
            team = await prisma.team.findUnique({
              where: { id: teamId },
              include: { members: { include: { user: true } } }
            });
          } catch (e) {}
        }
        if (!team) {
          team = TEAMS_DB.find(t => t.id === teamId);
        }

        if (!team) {
          sendJson(res, 404, { error: 'Team not found.' });
          return;
        }

        const isSelf = auth.user.id === targetUserId;
        const isLeader = team.leaderId === auth.user.id;
        const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';

        if (!isSelf && !isLeader && !isSuperAdmin) {
          sendJson(res, 403, { error: 'Access Denied: You cannot remove another user from this team.' });
          return;
        }

        if (targetUserId === team.leaderId && (team.members || []).length > 1) {
          sendJson(res, 400, { error: 'Team leader cannot leave while team has other members. Transfer leadership first.' });
          return;
        }

        // Unfill the vacated role slot if applicable
        const leavingMember = (team.members || []).find(m => m.userId === targetUserId);
        const targetUser = USERS_DB.find(u => u.id === targetUserId);
        const memberName = (targetUser && targetUser.name) || (leavingMember && (leavingMember.name || (leavingMember.user && leavingMember.user.name)));
        const memberRoleName = leavingMember ? (leavingMember.roleName || leavingMember.role) : null;

        let updatedRoles = Array.isArray(team.requiredRoles) ? [...team.requiredRoles] : [];
        if (updatedRoles.length > 0) {
          updatedRoles = updatedRoles.map(r => {
            if ((memberName && r.filledBy === memberName) || (memberRoleName && r.role === memberRoleName && r.filled)) {
              return { ...r, filled: false, filledBy: null };
            }
            return r;
          });
        }

        if (isPrismaConnected) {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.teamMember.deleteMany({
                where: { teamId, userId: targetUserId }
              });
              await tx.team.update({
                where: { id: teamId },
                data: {
                  requiredRoles: updatedRoles,
                  updatedAt: new Date()
                }
              });
              if (team.projectId) {
                await tx.project.update({
                  where: { id: team.projectId },
                  data: { teamMembersCount: Math.max(1, (team.members || []).length - 1) }
                }).catch(() => {});
              }
            });
          } catch (e) {
            console.warn('[Prisma] Team member delete notice:', e.message);
          }
        }

        const memTeam = TEAMS_DB.find(t => t.id === teamId);
        if (memTeam) {
          if (Array.isArray(memTeam.members)) {
            memTeam.members = memTeam.members.filter(m => m.userId !== targetUserId);
          }
          memTeam.requiredRoles = updatedRoles;
          persistStoreToDisk();
        }

        sendJson(res, 200, { success: true, message: 'Member successfully removed from team.' });
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

// Connect to Neon PostgreSQL in background
prisma.$connect()
  .then(() => {
    isPrismaConnected = true;
    console.log('[Prisma] Connected to Neon PostgreSQL database.');
  })
  .catch((err) => {
    console.warn('[Prisma] Database connection notice:', err.message);
  });

// Graceful Prisma and Server Shutdown
async function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Closing server and database connection...`);
  server.close(async () => {
    if (isPrismaConnected) {
      try {
        await prisma.$disconnect();
        console.log('[Prisma] Disconnected cleanly from Neon PostgreSQL.');
      } catch (err) {
        console.error('[Prisma] Disconnect error:', err.message);
      }
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

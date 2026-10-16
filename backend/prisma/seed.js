import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING CAMPUSNET CANONICAL PRODUCTION DATABASE IN NEON ---');
  const DEMO_PASSWORD_HASH = await hashPassword('CampusNet@Demo2026');

  // 1. INSTITUTIONS
  const institutions = [
    { id: 'inst-kec', name: 'Kuppam Engineering College', shortName: 'KEC Kuppam', type: 'Engineering College', state: 'Andhra Pradesh', city: 'Kuppam', verified: true },
    { id: 'inst-iitb', name: 'IIT Bombay', shortName: 'IIT Bombay', type: 'IIT', state: 'Maharashtra', city: 'Mumbai', verified: true },
    { id: 'inst-iisc', name: 'Indian Institute of Science (IISc)', shortName: 'IISc Bengaluru', type: 'University', state: 'Karnataka', city: 'Bengaluru', verified: true },
    { id: 'inst-nitw', name: 'NIT Warangal', shortName: 'NIT Warangal', type: 'NIT', state: 'Telangana', city: 'Warangal', verified: true },
    { id: 'inst-anna', name: 'Anna University (CEG Campus)', shortName: 'Anna Univ Chennai', type: 'University', state: 'Tamil Nadu', city: 'Chennai', verified: true },
    { id: 'inst-nitk', name: 'NITK Surathkal', shortName: 'NITK Surathkal', type: 'NIT', state: 'Karnataka', city: 'Surathkal', verified: true },
    { id: 'inst-apex', name: 'Apex Institute of Technology', shortName: 'Apex Tech', type: 'Engineering College', state: 'Delhi', city: 'New Delhi', verified: false },
    { id: 'inst-aicte', name: 'National Accreditation & Academic Review Board', shortName: 'AICTE Review Board', type: 'Regulatory Board', state: 'Delhi', city: 'New Delhi', verified: true },
    { id: 'inst-root', name: 'CampusNet Central Command', shortName: 'CampusNet HQ', type: 'National Platform', state: 'Delhi', city: 'New Delhi', verified: true }
  ];

  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { id: inst.id },
      update: inst,
      create: inst
    });
  }
  console.log(`✅ Seeded ${institutions.length} Institutions`);

  // 2. ORGANIZATION ACCOUNTS
  const organizations = [
    {
      id: 'KEC-DEMO-001',
      institutionId: 'inst-kec',
      officialEmail: 'organizer.demo@campusnet-demo.in',
      coordinatorName: 'Dr. Anand Kumar',
      designation: 'Dean of Innovation & Hackathons',
      mobile: '+91 98765 43210',
      state: 'Andhra Pradesh',
      city: 'Kuppam',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'IITB-ORG-002',
      institutionId: 'inst-iitb',
      officialEmail: 'techfest.coord@iitb.ac.in',
      coordinatorName: 'Rohan Varma',
      designation: 'Convener - National Techfest',
      mobile: '+91 98765 43211',
      state: 'Maharashtra',
      city: 'Mumbai',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'CNU-DEMO-003',
      institutionId: 'inst-iisc',
      officialEmail: 'iisc.events@campusnet-demo.in',
      coordinatorName: 'Prof. Sudhir Sen',
      designation: 'Convener National Technical Conclave',
      mobile: '+91 98765 43212',
      state: 'Karnataka',
      city: 'Bengaluru',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'NITW-DEMO-004',
      institutionId: 'inst-nitw',
      officialEmail: 'nitw.techno@campusnet-demo.in',
      coordinatorName: 'Dr. K. Rajeshwar',
      designation: 'Dean of Student Affairs & Symposia',
      mobile: '+91 98765 43213',
      state: 'Telangana',
      city: 'Warangal',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'ANNA-DEMO-005',
      institutionId: 'inst-anna',
      officialEmail: 'annauniv.conclave@campusnet-demo.in',
      coordinatorName: 'Dr. Priya Sundaram',
      designation: 'Director of Inter-Collegiate Events',
      mobile: '+91 98765 43214',
      state: 'Tamil Nadu',
      city: 'Chennai',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'ORG-PENDING-006',
      institutionId: 'inst-apex',
      officialEmail: 'apex.events@campusnet-demo.in',
      coordinatorName: 'Prof. R. Venkatesh',
      designation: 'Event In-Charge',
      mobile: '+91 98765 43215',
      state: 'Delhi',
      city: 'New Delhi',
      verificationStatus: 'UNDER_REVIEW'
    }
  ];

  for (const org of organizations) {
    await prisma.organizationAccount.upsert({
      where: { id: org.id },
      update: org,
      create: org
    });
  }
  console.log(`✅ Seeded ${organizations.length} Organization Accounts`);

  // 3. USERS (Multi-Role Identity)
  const users = [
    {
      id: 'usr-std-001',
      email: 'aarav.sharma@nitk.edu.in',
      name: 'Aarav Sharma',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['STUDENT'],
      activeRole: 'STUDENT',
      institutionId: 'inst-nitk',
      institutionName: 'NITK Surathkal',
      department: 'Computer Science & Engineering',
      verifiedStudent: true,
      status: 'ACTIVE'
    },
    {
      id: 'usr-multi-001',
      email: 'karthik.raja@campusnet.in',
      name: 'Karthik Raja',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['STUDENT', 'EVENT_MANAGER'],
      activeRole: 'STUDENT',
      institutionId: 'inst-kec',
      institutionName: 'Kuppam Engineering College',
      organizationId: 'KEC-DEMO-001',
      managedEventIds: ['ev-001'],
      verifiedStudent: true,
      status: 'ACTIVE'
    },
    {
      id: 'usr-mnt-001',
      email: 'arvind.rao@iitb.ac.in',
      name: 'Dr. Arvind Rao',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['MENTOR'],
      activeRole: 'MENTOR',
      institutionId: 'inst-iitb',
      institutionName: 'IIT Bombay',
      department: 'Electrical Engineering & Robotics',
      verifiedMentor: true,
      status: 'ACTIVE'
    },
    {
      id: 'usr-mnt-multi-001',
      email: 'meenakshi.s@campusnet.in',
      name: 'Dr. Meenakshi Sundaram',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['MENTOR', 'PLATFORM_REVIEWER'],
      activeRole: 'MENTOR',
      institutionId: 'inst-anna',
      institutionName: 'Anna University',
      department: 'Computer Science',
      verifiedMentor: true,
      status: 'ACTIVE'
    },
    {
      id: 'usr-res-001',
      email: 'kavya.r@iisc.ac.in',
      name: 'Kavya Ramanathan',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['PHD_RESEARCHER'],
      activeRole: 'PHD_RESEARCHER',
      institutionId: 'inst-iisc',
      institutionName: 'Indian Institute of Science (IISc)',
      department: 'Computational and Data Sciences',
      studentId: 'IISC-PHD-2024-09',
      verifiedResearcher: true,
      status: 'ACTIVE'
    },
    // 5 College Organizer Accounts
    {
      id: 'KEC-DEMO-001',
      email: 'organizer.demo@campusnet-demo.in',
      alternateEmail: 'suresh.babu@kec.ac.in',
      name: 'Dr. Anand Kumar',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-kec',
      institutionName: 'Kuppam Engineering College',
      organizationId: 'KEC-DEMO-001',
      status: 'ACTIVE'
    },
    {
      id: 'IITB-ORG-002',
      email: 'techfest.coord@iitb.ac.in',
      name: 'Rohan Varma',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-iitb',
      institutionName: 'IIT Bombay',
      organizationId: 'IITB-ORG-002',
      status: 'ACTIVE'
    },
    {
      id: 'CNU-DEMO-003',
      email: 'iisc.events@campusnet-demo.in',
      name: 'Prof. Sudhir Sen',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-iisc',
      institutionName: 'Indian Institute of Science (IISc)',
      organizationId: 'CNU-DEMO-003',
      status: 'ACTIVE'
    },
    {
      id: 'NITW-DEMO-004',
      email: 'nitw.techno@campusnet-demo.in',
      name: 'Dr. K. Rajeshwar',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-nitw',
      institutionName: 'NIT Warangal',
      organizationId: 'NITW-DEMO-004',
      status: 'ACTIVE'
    },
    {
      id: 'ANNA-DEMO-005',
      email: 'annauniv.conclave@campusnet-demo.in',
      name: 'Dr. Priya Sundaram',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-anna',
      institutionName: 'Anna University (CEG Campus)',
      organizationId: 'ANNA-DEMO-005',
      status: 'ACTIVE'
    },
    // Pending Organization Scenario Account
    {
      id: 'ORG-PENDING-006',
      email: 'apex.events@campusnet-demo.in',
      name: 'Prof. R. Venkatesh',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['ORGANIZATION_OWNER'],
      activeRole: 'ORGANIZATION_OWNER',
      institutionId: 'inst-apex',
      institutionName: 'Apex Institute of Technology',
      organizationId: 'ORG-PENDING-006',
      status: 'PENDING_VERIFICATION'
    },
    // Platform Reviewer Account
    {
      id: 'rev-aicte-001',
      email: 'reviewer.gov@aicte.gov.in',
      name: 'Dr. Sunita Murthy',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['PLATFORM_REVIEWER'],
      activeRole: 'PLATFORM_REVIEWER',
      institutionId: 'inst-aicte',
      institutionName: 'National Accreditation & Academic Review Board',
      status: 'ACTIVE'
    },
    // Platform Super Admin Account
    {
      id: 'adm-root-001',
      email: 'admin@campusnet.in',
      name: 'CampusNet National Root Administrator',
      passwordHash: DEMO_PASSWORD_HASH,
      roles: ['SUPER_ADMIN'],
      activeRole: 'SUPER_ADMIN',
      institutionId: 'inst-root',
      institutionName: 'CampusNet Central Command',
      status: 'ACTIVE'
    }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: u,
      create: u
    });
  }
  console.log(`✅ Seeded ${users.length} Users with Multi-Role Identity`);

  // Link Organization coordinator user back
  for (const org of organizations) {
    await prisma.organizationAccount.update({
      where: { id: org.id },
      data: { userId: org.id }
    });
  }

  // 4. ORGANIZATION MEMBERS
  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: 'KEC-DEMO-001',
        userId: 'usr-multi-001'
      }
    },
    update: {
      name: 'Karthik Raja',
      email: 'karthik.raja@campusnet.in',
      role: 'EVENT_MANAGER',
      status: 'active'
    },
    create: {
      id: 'mem-kec-001',
      organizationId: 'KEC-DEMO-001',
      userId: 'usr-multi-001',
      name: 'Karthik Raja',
      email: 'karthik.raja@campusnet.in',
      role: 'EVENT_MANAGER',
      status: 'active'
    }
  });
  console.log('✅ Seeded Organization Member');

  // 5. EVENTS
  const events = [
    {
      id: 'ev-001',
      code: 'KEC-AI26-01',
      title: 'KEC National AI & Smart Robotics Hackathon 2026',
      organizerId: 'KEC-DEMO-001',
      organizerName: 'Kuppam Engineering College',
      institutionId: 'inst-kec',
      eventType: 'Hackathon',
      state: 'Andhra Pradesh',
      city: 'Kuppam',
      venue: 'Main Auditorium & Innovation Lab, KEC Campus',
      description: 'National 36-hour hackathon bringing together engineering innovators across India.',
      startDate: new Date('2026-04-10T09:00:00Z'),
      endDate: new Date('2026-04-12T18:00:00Z'),
      deadline: new Date('2026-04-05T23:59:59Z'),
      status: 'PUBLISHED'
    },
    {
      id: 'ev-iitb-001',
      code: 'IITB-TF26-01',
      title: 'IIT Bombay Techfest: National Generative AI & Robotics Grand Challenge',
      organizerId: 'IITB-ORG-002',
      organizerName: 'IIT Bombay',
      institutionId: 'inst-iitb',
      eventType: 'Hackathon',
      state: 'Maharashtra',
      city: 'Mumbai',
      venue: 'Convocation Hall, IIT Bombay',
      description: 'Premier collegiate robotics and generative AI engineering symposium.',
      startDate: new Date('2026-05-15T09:00:00Z'),
      endDate: new Date('2026-05-17T18:00:00Z'),
      deadline: new Date('2026-05-10T23:59:59Z'),
      status: 'PUBLISHED'
    }
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: ev,
      create: ev
    });
  }
  console.log(`✅ Seeded ${events.length} Events`);

  // 6. EVENT MANAGER ASSIGNMENT
  await prisma.eventManagerAssignment.upsert({
    where: {
      userId_eventId_role: {
        userId: 'usr-multi-001',
        eventId: 'ev-001',
        role: 'EVENT_MANAGER'
      }
    },
    update: {
      organizationId: 'KEC-DEMO-001',
      status: 'active'
    },
    create: {
      id: 'ema-001',
      userId: 'usr-multi-001',
      eventId: 'ev-001',
      organizationId: 'KEC-DEMO-001',
      role: 'EVENT_MANAGER',
      status: 'active',
      assignedById: 'KEC-DEMO-001'
    }
  });
  console.log('✅ Seeded Event Manager Assignment');

  // 7. EVENT REGISTRATIONS
  await prisma.eventRegistration.upsert({
    where: {
      eventId_participantId: {
        eventId: 'ev-001',
        participantId: 'usr-std-001'
      }
    },
    update: {
      teamName: 'Team AeroInnovators',
      status: 'confirmed'
    },
    create: {
      id: 'reg-001',
      eventId: 'ev-001',
      participantId: 'usr-std-001',
      teamName: 'Team AeroInnovators',
      status: 'confirmed'
    }
  });
  console.log('✅ Seeded Event Registration');

  // 8. MENTORSHIP REQUESTS
  await prisma.mentorshipRequest.upsert({
    where: { id: 'req-001' },
    update: {
      studentId: 'usr-std-001',
      mentorId: 'usr-mnt-001',
      projectTitle: 'KrishiDrone AI: Autonomous Edge UAV',
      teamName: 'Team AeroInnovators',
      message: 'Seeking guidance on ROS 2 integration and edge computer vision inference.',
      status: 'PENDING'
    },
    create: {
      id: 'req-001',
      studentId: 'usr-std-001',
      mentorId: 'usr-mnt-001',
      projectTitle: 'KrishiDrone AI: Autonomous Edge UAV',
      teamName: 'Team AeroInnovators',
      message: 'Seeking guidance on ROS 2 integration and edge computer vision inference.',
      status: 'PENDING'
    }
  });
  console.log('✅ Seeded Mentorship Request');

  // 9. RESEARCH COLLABORATIONS
  await prisma.researchCollaboration.upsert({
    where: { id: 'collab-001' },
    update: {
      requesterId: 'usr-res-001',
      collaboratorId: 'usr-mnt-001',
      projectTitle: 'Hardware-in-the-Loop Edge Telemetry for Autonomous Agro-UAVs',
      status: 'active',
      confidentialDraft: 'Confidential architecture proposal for ACM SenSys 2026.'
    },
    create: {
      id: 'collab-001',
      requesterId: 'usr-res-001',
      collaboratorId: 'usr-mnt-001',
      projectTitle: 'Hardware-in-the-Loop Edge Telemetry for Autonomous Agro-UAVs',
      status: 'active',
      confidentialDraft: 'Confidential architecture proposal for ACM SenSys 2026.'
    }
  });
  console.log('✅ Seeded Research Collaboration');

  // 10. CERTIFICATES
  const certificates = [
    {
      id: 'cert-001',
      certificateNumber: 'CN-2025-WIN-7841-9021',
      recipientId: 'usr-std-001',
      recipientName: 'Aarav Sharma',
      recipientRole: 'Winner',
      eventTitle: 'Smart India Ideathon 2025 — National Finale',
      eventId: 'ev-001',
      eventOrganizer: 'Ministry of Education Innovation Cell & AICTE',
      institutionId: 'inst-aicte',
      qrCodeData: 'https://campusnet.in/verify/CN-2025-WIN-7841-9021',
      status: 'valid',
      issueDate: new Date('2025-12-12')
    },
    {
      id: 'cert-revoked-001',
      certificateNumber: 'CN-REVOKED-TEST-000999',
      recipientName: 'Disqualified Candidate',
      recipientRole: 'Participant',
      eventTitle: 'National Code Sprint 2025',
      eventId: 'ev-001',
      eventOrganizer: 'Kuppam Engineering College',
      institutionId: 'inst-kec',
      qrCodeData: 'https://campusnet.in/verify/CN-REVOKED-TEST-000999',
      status: 'revoked',
      revocationReason: 'Academic integrity violation / Plagiarism confirmed by jury',
      revokedAt: new Date('2025-11-15T14:30:00Z'),
      revokedBy: 'KEC-DEMO-001',
      issueDate: new Date('2025-11-10')
    }
  ];

  for (const cert of certificates) {
    await prisma.certificate.upsert({
      where: { certificateNumber: cert.certificateNumber },
      update: cert,
      create: cert
    });
  }
  console.log(`✅ Seeded ${certificates.length} Certificates (Valid + Revoked)`);

  // 11. AUDIT LOGS
  await prisma.auditLog.upsert({
    where: { id: 'aud-seed-1' },
    update: {
      actorId: 'adm-root-001',
      actorName: 'Super Administrator',
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOT',
      targetType: 'system',
      targetId: 'root',
      targetName: 'CampusNet RBAC Engine',
      details: 'Production RBAC server initialized with 7 canonical roles and permission matrix.'
    },
    create: {
      id: 'aud-seed-1',
      actorId: 'adm-root-001',
      actorName: 'Super Administrator',
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOT',
      targetType: 'system',
      targetId: 'root',
      targetName: 'CampusNet RBAC Engine',
      details: 'Production RBAC server initialized with 7 canonical roles and permission matrix.'
    }
  });
  console.log('✅ Seeded Initial Audit Log');

  console.log('--- NEON POSTGRESQL CANONICAL SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

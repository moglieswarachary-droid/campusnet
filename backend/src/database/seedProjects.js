import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prisma from './prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export async function seedProjectsAndTeams() {
  try {
    // 1. Ensure team member users exist
    const membersToEnsure = [
      { id: 'usr-std-002', name: 'Pooja Iyer', email: 'pooja.iyer@ceg.annauniv.edu', department: 'ECE', activeRole: 'STUDENT' },
      { id: 'usr-std-003', name: 'Vikramaditya Deshmukh', email: 'vikram.d@vjti.ac.in', department: 'Mechanical Engineering', activeRole: 'STUDENT' },
      { id: 'usr-std-004', name: 'Ananya Sen', email: 'ananya.sen@nid.edu', department: 'Interaction Design', activeRole: 'STUDENT' }
    ];

    for (const m of membersToEnsure) {
      await prisma.user.upsert({
        where: { id: m.id },
        update: {},
        create: {
          id: m.id,
          email: m.email,
          name: m.name,
          department: m.department,
          passwordHash: '$argon2id$v=19$m=65536,p=1,t=3$9zrSWtJCrAzZQG0wFOqDIQ$vYGjXcNYt3S5ioHHaQITb6lkzBo6JWMWMLfwZGEggwc',
          roles: ['STUDENT'],
          activeRole: 'STUDENT',
          status: 'ACTIVE'
        }
      });
    }

    // 2. Check if proj-001 already exists
    const existing = await prisma.project.findUnique({
      where: { id: 'proj-001' }
    });

    if (!existing) {
      await prisma.$transaction(async (tx) => {
        await tx.project.create({
          data: {
            id: 'proj-001',
            title: 'AgriVision AI — Edge Micro-Drone for Autonomous Orchard Spraying',
            problemStatement: 'Manual pesticide application in Indian mango & citrus orchards exposes farmers to toxic inhalation and causes 40% pesticide runoff due to non-uniform manual pressure.',
            proposedSolution: 'An autonomous micro-quadcopter running TensorRT quantized YOLOv11 on an onboard NVIDIA Jetson Orin Nano, executing real-time pest segmentation with precision pulse-width modulated micro-dosing spray nozzles.',
            domain: 'AI, Agritech & Drone Robotics',
            technologies: ['PyTorch', 'TensorRT', 'ROS2 Humble', 'PX4 Autopilot', 'SolidWorks', 'ESP32 LoRaWAN'],
            requiredSkills: ['Computer Vision', 'Embedded C', 'Airframe FEA', 'Farmer UI/UX'],
            status: 'PROTOTYPE',
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
            coverImageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
            authorId: 'usr-std-001',
            mentorId: 'usr-mnt-001',
            institutionId: 'inst-nitk',
            mentorStatus: 'accepted',
            teamMembersCount: 4,
            likesCount: 184
          }
        });

        await tx.projectMilestone.createMany({
          data: [
            { id: 'm1', projectId: 'proj-001', title: 'Dataset Collection (10K annotated pest images)', description: 'Curated 10,000 high-res pest leaf images across Karnataka orchards.', status: 'APPROVED', dueDate: new Date('2025-11-30'), approvedByMentor: true, mentorFeedback: 'Excellent dataset diversity and class balance across leaf-miner species.' },
            { id: 'm2', projectId: 'proj-001', title: 'Airframe CFD & Carbon-Fiber Fabrication', description: 'Completed wind tunnel simulation and carbon-fiber arm layup in VJTI workshop.', status: 'APPROVED', dueDate: new Date('2026-01-15'), approvedByMentor: true, mentorFeedback: 'Vibration damping mounts verified up to 8000 RPM motor load.' },
            { id: 'm3', projectId: 'proj-001', title: 'Jetson Orin Nano TensorRT INT8 Optimization', description: 'Quantize model to achieve 34 FPS at 8.2W power draw on Jetson Orin Nano.', status: 'IN_PROGRESS', dueDate: new Date('2026-03-10') },
            { id: 'm4', projectId: 'proj-001', title: 'Autonomous 5-Acre Field Spraying Validation', description: 'Execute field trial with GPS geofencing and micro-dosing validation.', status: 'PENDING', dueDate: new Date('2026-04-05') }
          ]
        });

        await tx.projectTask.createMany({
          data: [
            { id: 't1', projectId: 'proj-001', title: 'Calibrate TensorRT INT8 entropy cache on 500 test images', assigneeName: 'Aarav Sharma', status: 'IN_PROGRESS', priority: 'high' },
            { id: 't2', projectId: 'proj-001', title: 'Solder custom ESP32 telemetry daughter-board with LoRaWAN antenna', assigneeName: 'Pooja Iyer', status: 'DONE', priority: 'high' },
            { id: 't3', projectId: 'proj-001', title: 'Run ANSYS stress simulation on 3D-printed nozzle mount bracket', assigneeName: 'Vikramaditya', status: 'DONE', priority: 'medium' },
            { id: 't4', projectId: 'proj-001', title: 'Conduct Kannada & Marathi usability tests with 10 farmers', assigneeName: 'Ananya Sen', status: 'IN_PROGRESS', priority: 'medium' }
          ]
        });

        await tx.team.create({
          data: {
            id: 'team-001',
            name: 'Team AgriVision AI',
            projectId: 'proj-001',
            leaderId: 'usr-std-001',
            mentorId: 'usr-mnt-001',
            mentorStatus: 'accepted',
            domain: 'Agritech & Autonomous UAVs',
            maxMembers: 6,
            status: 'active',
            requiredRoles: [
              { role: 'AI & Vision Lead', departmentHint: 'CSE / AIML', filled: true, filledBy: 'Aarav Sharma' },
              { role: 'Hardware & Telemetry', departmentHint: 'ECE', filled: true, filledBy: 'Pooja Iyer' },
              { role: 'Airframe & Robotics', departmentHint: 'Mechanical', filled: true, filledBy: 'Vikramaditya' },
              { role: 'Farmer UX & Usability', departmentHint: 'Design / UI', filled: true, filledBy: 'Ananya Sen' },
              { role: 'Cloud Backend Specialist', departmentHint: 'CSE / IT', filled: false },
              { role: 'Safety & Field Compliance Lead', departmentHint: 'Agritech / Bio', filled: false }
            ]
          }
        });

        await tx.teamMember.createMany({
          data: [
            { teamId: 'team-001', userId: 'usr-std-001', roleName: 'AI & Vision Lead', department: 'AI & Data Eng', college: 'NITK Surathkal', isLeader: true },
            { teamId: 'team-001', userId: 'usr-std-002', roleName: 'Hardware & Telemetry', department: 'ECE', college: 'CEG Anna Univ', isLeader: false },
            { teamId: 'team-001', userId: 'usr-std-003', roleName: 'Airframe & Robotics', department: 'Mechanical', college: 'VJTI Mumbai', isLeader: false },
            { teamId: 'team-001', userId: 'usr-std-004', roleName: 'Farmer UX & Usability', department: 'Interaction Design', college: 'NID Ahmedabad', isLeader: false }
          ]
        });

        console.log('[Prisma] Seeded initial project proj-001 and team team-001 in database.');
      });
    }
  } catch (err) {
    console.warn('[Prisma] Project/Team seed notice:', err.message);
  }
}

export default seedProjectsAndTeams;

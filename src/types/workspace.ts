import { RoleType } from './user';

export interface TeamMember {
  userId: string;
  name: string;
  department: string;
  college: string;
  role: string;
  avatar: string;
  verified: boolean;
  isLeader?: boolean;
  studentId?: string;
  email?: string;
  mobile?: string;
}

export interface Team {
  id: string;
  name: string;
  projectId?: string;
  projectName: string;
  domain: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  maxMembers: number;
  requiredRoles: { role: string; departmentHint: string; filled: boolean; filledBy?: string }[];
  status: 'forming' | 'active' | 'in_event' | 'completed';
  mentorId?: string;
  mentorName?: string;
  mentorStatus: 'none' | 'pending' | 'accepted' | 'completed';
  createdAt: string;
  eventId?: string;
  eventTitle?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'approved' | 'in_progress' | 'pending' | 'rejected';
  dueDate: string;
  approvedByMentor?: boolean;
  mentorFeedback?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Project {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  domain: string;
  technologies: string[];
  requiredSkills: string[];
  teamId?: string;
  teamName?: string;
  teamMembersCount: number;
  institution: string;
  state?: string;
  city?: string;
  mentor?: string;
  mentorId?: string;
  mentorTitle?: string;
  mentorStatus?: 'none' | 'pending' | 'accepted' | 'completed';
  status: 'Idea' | 'Planning' | 'Development' | 'Prototype' | 'Testing' | 'Completed' | 'Published';
  progressPercent: number;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  objectives?: string[];
  seekingRoles?: string[];
  coverImage?: string;
  papersCount: number;
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  createdAt: string;
  likes: number;
}

export interface TeamChatMessage {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'student' | 'mentor' | 'researcher';
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: RoleType;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: RoleType;
  senderInstitution: string;
  senderDepartment: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  note?: string;
  timestamp: string;
}

export interface MentorGuidanceItem {
  id: string;
  teamId: string;
  mentorId: string;
  mentorName: string;
  type: 'feedback' | 'task' | 'resource' | 'approval';
  title: string;
  content: string;
  timestamp: string;
  links?: string[];
  actionRequired?: boolean;
}

export interface MentorshipRequest {
  id: string;
  teamId: string;
  teamName: string;
  projectTitle: string;
  domain: string;
  mentorId: string;
  mentorName: string;
  requestedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'info_requested' | 'completed';
  message: string;
  matchScore: number;
  matchBreakdown: {
    domainScore: number;
    techScore: number;
    researchScore: number;
    availabilityScore: number;
  };
  createdAt: string;
  mentorFeedbackNote?: string;
}

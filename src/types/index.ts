export type RoleType = 'student' | 'mentor' | 'researcher' | 'organizer' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  studentId?: string;
  institution: string;
  university: string;
  department: string;
  course: string;
  year: string;
  verifiedStudent: boolean;
  avatar: string;
  innovationScore: number;
  skills: string[];
  badges: string[];
  bio: string;
  interests: string[];
  github?: string;
  linkedin?: string;
  idCardVerifiedAt?: string;
  role: RoleType;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  title: string;
  qualification: string;
  institution: string;
  department: string;
  specialization: string;
  yearsExperience: number;
  academicExp: string;
  industryExp: string;
  researchAreas: string[];
  projectsGuided: number;
  certifications: string[];
  mentoringInterests: string[];
  availability: 'Available' | 'Limited Slots' | 'Busy';
  verifiedMentor: boolean;
  avatar: string;
  rating: number;
  reviewsCount: number;
  bio: string;
}

export interface Researcher {
  id: string;
  name: string;
  email: string;
  scholarId: string;
  university: string;
  department: string;
  researchArea: string;
  interests: string[];
  guide: string;
  publicationsCount: number;
  citationsCount: number;
  hIndex: number;
  datasets: string[];
  verifiedResearcher: boolean;
  avatar: string;
  openForCollab: boolean;
  bio: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  department: string;
  college: string;
  role: string;
  avatar: string;
  verified: boolean;
  isLeader?: boolean;
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
  mentorStatus: 'none' | 'pending' | 'accepted';
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
  mentor?: string;
  mentorTitle?: string;
  status: 'Idea' | 'Planning' | 'Development' | 'Prototype' | 'Testing' | 'Completed' | 'Published';
  progressPercent: number;
  githubUrl?: string;
  demoUrl?: string;
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

export interface EventItem {
  id: string;
  title: string;
  organizer: string;
  organizerType: 'government' | 'university' | 'college' | 'research';
  eventType: 'Hackathon' | 'Ideathon' | 'Government Challenge' | 'Research Symposium' | 'Coding Contest';
  date: string;
  venue: string;
  mode: 'Offline' | 'Online' | 'Hybrid';
  description: string;
  rules: string[];
  tracks: string[];
  prizes: { rank: string; amount: string; description: string }[];
  bannerUrl?: string;
  registeredTeamsCount: number;
  maxTeamSize: number;
  deadline: string;
  attendanceWindow: {
    start: string;
    end: string;
    targetLat: number;
    targetLng: number;
    allowedRadiusMeters: number;
  };
  submissionRequirements: string[];
  isRegistered?: boolean;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  photoHash: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  distanceMeters: number;
  status: 'verified_gps' | 'manual_review_pending' | 'approved';
  notes?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientRole: 'Participant' | 'Winner' | 'Mentor' | 'Judge' | 'Organizer';
  eventTitle: string;
  eventOrganizer: string;
  issueDate: string;
  qrCodeData: string;
  rank?: string;
  verified: boolean;
  institution: string;
}

export interface ResearchPublication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  datasetLink?: string;
  tags: string[];
  citations: number;
  collabOpen: boolean;
}

export interface CampusStory {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  creatorDept: string;
  creatorCollege: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'Project' | 'Hackathon' | 'Research' | 'Event' | 'Achievement';
  likesCount: number;
  commentsCount: number;
  duration: string;
  isLiked?: boolean;
  isSaved?: boolean;
  tags: string[];
}

export interface AskAnswer {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorBadge: string;
  body: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
  isUpvoted?: boolean;
}

export interface AskQuestion {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorCollege: string;
  tags: string[];
  upvotes: number;
  answersCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  isUpvoted?: boolean;
  answers: AskAnswer[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'mentor' | 'team' | 'event' | 'attendance' | 'certificate' | 'meeting' | 'system';
  timestamp: string;
  read: boolean;
  linkAction?: string;
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
  status: 'pending' | 'accepted' | 'declined' | 'info_requested';
  message: string;
  matchScore: number;
  matchBreakdown: {
    domainScore: number;
    techScore: number;
    researchScore: number;
    availabilityScore: number;
  };
  createdAt: string;
}

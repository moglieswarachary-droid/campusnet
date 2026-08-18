export type RoleType = 'student' | 'mentor' | 'researcher' | 'organizer' | 'superadmin';

export type OrganizerPermissionRole = 
  | 'institution_admin' 
  | 'coordinator' 
  | 'certificate_manager' 
  | 'judge_manager' 
  | 'attendance_manager' 
  | 'viewer';

export type EventStatus = 
  | 'draft' 
  | 'review' 
  | 'approved' 
  | 'published' 
  | 'registration_open' 
  | 'registration_closed' 
  | 'live' 
  | 'completed' 
  | 'archived';

export interface UserPrivacySettings {
  emailPublic: boolean;
  phonePublic: boolean;
  showProjectsToPublic: boolean;
}

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
  state?: string;
  city?: string;
  verifiedStudent: boolean;
  avatar: string;
  innovationScore: number;
  skills: string[];
  badges: string[];
  bio: string;
  interests: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  idCardVerifiedAt?: string;
  role: RoleType;
  connectionsCount?: number;
  connectedUserIds?: string[];
  savedItemIds?: string[];
  privacy?: UserPrivacySettings;
  status?: 'active' | 'suspended' | 'pending_verification';
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  title: string;
  designation?: string;
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
  preferredDomains?: string[];
  availability: 'Available' | 'Limited Slots' | 'Busy';
  maxTeams?: number;
  activeTeamsCount?: number;
  mentorshipSlots?: number;
  completedMentorshipsCount?: number;
  verifiedMentor: boolean;
  avatar: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  state?: string;
  city?: string;
  linkedin?: string;
  status?: 'active' | 'suspended' | 'pending_verification';
}

export interface Researcher {
  id: string;
  name: string;
  email: string;
  scholarId: string;
  university: string;
  institution?: string;
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
  state?: string;
  city?: string;
  specialization?: string;
  researchTopics?: string[];
  status?: 'active' | 'suspended' | 'pending_verification';
}

export interface InstitutionInfo {
  id: string;
  name: string;
  shortName: string;
  type: 'IIT' | 'NIT' | 'IIIT' | 'Central University' | 'State University' | 'Research Institute' | 'Deemed / Private' | 'Engineering College';
  state: string;
  city: string;
  district?: string;
  logo: string;
  studentCount: number;
  mentorCount: number;
  projectsCount: number;
  eventsCount: number;
  nirfRank?: number;
  verified: boolean;
  website?: string;
  officialDomain?: string;
  aisheCode?: string;
  address?: string;
  pincode?: string;
}

export interface OrganizerAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  officialEmail: string;
  coordinatorName: string;
  designation: string;
  mobile: string;
  department: string;
  state: string;
  city: string;
  role: OrganizerPermissionRole;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'suspended';
  isDevelopmentDemo?: boolean;
  avatar: string;
  lastLoginAt?: string;
  eventsCreatedCount: number;
}

export interface SuperAdminAccount {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'super_admin' | 'security_auditor' | 'moderator';
  avatar: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  isDevelopmentDemo?: boolean;
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

export interface EventScheduleItem {
  id?: string;
  time: string;
  title: string;
  speakerOrDesc?: string;
  venue?: string;
  day?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export interface EventPrize {
  rank: string;
  amount: string;
  description: string;
}

export interface EventItem {
  id: string;
  code?: string; // e.g. KEC-AI26-01
  title: string;
  organizer: string;
  organizerId?: string;
  organizerType: 'government' | 'university' | 'college' | 'research' | 'institution';
  eventType: 'Hackathon' | 'Ideathon' | 'Government Challenge' | 'Research Symposium' | 'Coding Contest' | 'Workshop' | 'Tech Fest' | 'Project Expo';
  category?: string;
  theme?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  venue: string;
  address?: string;
  district?: string;
  state: string;
  city: string;
  pincode?: string;
  country?: string;
  mode: 'Offline' | 'Online' | 'Hybrid';
  description: string;
  rules: string[];
  tracks: string[];
  prizes: EventPrize[];
  bannerUrl?: string;
  registeredTeamsCount: number;
  participantLimit?: number;
  maxTeamSize: number;
  minTeamSize?: number;
  deadline: string;
  deadlineStatus?: 'upcoming' | 'closing_soon' | 'live' | 'completed';
  status: EventStatus;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  approvalComments?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  eligibility?: string;
  eligibleDepartments?: string[];
  eligibleYears?: string[];
  registrationFee?: string;
  schedule?: EventScheduleItem[];
  requiredSkills?: string[];
  sponsors?: { name: string; tier: string; logo?: string }[];
  judges?: { name: string; title: string; institution: string }[];
  speakers?: { name: string; topic: string }[];
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  attendanceWindow: {
    start: string;
    end: string;
    targetLat: number;
    targetLng: number;
    allowedRadiusMeters: number;
  };
  submissionRequirements: string[];
  isRegistered?: boolean;
  isSaved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRegistrationItem {
  id: string;
  eventId: string;
  eventTitle: string;
  participantId: string;
  participantName: string;
  studentId?: string;
  institution: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  teamId?: string;
  teamName?: string;
  registrationStatus: 'confirmed' | 'waitlisted' | 'cancelled';
  paymentStatus: 'free' | 'paid' | 'waived';
  attendanceStatus: 'checked_in' | 'absent' | 'registered';
  checkInTimestamp?: string;
  checkInMethod?: 'qr_scanner' | 'manual_override';
  checkedInBy?: string;
  submissionStatus: 'submitted' | 'pending' | 'reviewed';
  certificateStatus: 'generated' | 'pending' | 'not_eligible';
  certificateId?: string;
  registeredAt: string;
}

export interface QRCheckInRecord {
  id: string;
  eventId: string;
  registrationId: string;
  participantId: string;
  participantName: string;
  institution: string;
  timestamp: string;
  organizerId: string;
  organizerName: string;
  method: 'qr_scan' | 'manual_override';
  deviceInfo?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
}

export interface EventProjectSubmission {
  id: string;
  eventId: string;
  teamId: string;
  teamName: string;
  projectTitle: string;
  description: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  videoUrl?: string;
  screenshots?: string[];
  submittedAt: string;
  status: 'submitted' | 'under_evaluation' | 'evaluated' | 'shortlisted' | 'winner';
  finalScore?: number;
  rank?: string;
}

export interface EvaluationCriterion {
  id: string;
  eventId: string;
  name: string;
  description: string;
  maxScore: number;
  weightagePercent: number;
}

export interface JudgeAccount {
  id: string;
  name: string;
  email: string;
  institution: string;
  designation: string;
  assignedEventId: string;
  assignedSubmissionIds: string[];
  accessKey: string;
}

export interface JudgeAssignment {
  id: string;
  eventId: string;
  judgeId: string;
  judgeName: string;
  submissionId: string;
  teamName: string;
  status: 'pending' | 'completed';
}

export interface EvaluationScore {
  id: string;
  eventId: string;
  submissionId: string;
  judgeId: string;
  judgeName: string;
  criteriaScores: { criterionId: string; criterionName: string; score: number; maxScore: number }[];
  totalWeightedScore: number;
  comments: string;
  recommendation: 'strong_accept' | 'accept' | 'borderline' | 'reject';
  submittedAt: string;
}

export interface EventWinnerRecord {
  id: string;
  eventId: string;
  submissionId: string;
  teamId: string;
  teamName: string;
  projectTitle: string;
  members: { name: string; college: string; role: string }[];
  category: 'Winner' | 'Runner-Up' | 'Second Runner-Up' | 'Special Recognition' | 'Best Innovation' | 'Best Design';
  prizeAmount?: string;
  certificateGenerated: boolean;
  certificateId?: string;
  finalRank: number;
  score: number;
}

export interface CertificateTemplate {
  id: string;
  institutionId: string;
  eventId?: string;
  title: string;
  category: 'Participation' | 'Winner' | 'Runner-Up' | 'Mentor' | 'Judge' | 'Speaker' | 'Volunteer' | 'Coordinator';
  accentColor: string;
  bannerTitle: string;
  subTitle: string;
  bodyTemplate: string;
  authorizedSignatories: { name: string; title: string; organization: string }[];
  isActive: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. CN-KEC-AI26-PART-000123
  recipientName: string;
  recipientRole: 'Participant' | 'Winner' | 'Runner-Up' | 'Second Runner-Up' | 'Mentor' | 'Judge' | 'Speaker' | 'Volunteer' | 'Organizer' | 'Project Completion';
  eventTitle: string;
  eventId?: string;
  eventOrganizer: string;
  organizerInstitutionId?: string;
  issueDate: string;
  qrCodeData: string;
  rank?: string;
  achievement?: string;
  verified: boolean;
  institution: string;
  type?: 'event' | 'mentorship' | 'project' | 'research';
  status: 'valid' | 'revoked';
  revocationReason?: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface MentorshipCertificate {
  id: string;
  certificateNumber: string;
  mentorId: string;
  mentorName: string;
  mentorDesignation: string;
  mentorInstitution: string;
  teamId: string;
  teamName: string;
  studentNames: string[];
  studentInstitutions: string[];
  projectTitle: string;
  projectDomain: string;
  startDate: string;
  completionDate: string;
  durationWeeks: number;
  mentorContribution: string;
  milestonesGuided: number;
  skillsCovered: string[];
  projectOutcome: string;
  qrCodeData: string;
  verified: boolean;
  issuedAt: string;
  status: 'valid' | 'revoked';
  authorizedSignatures: { name: string; title: string; organization: string }[];
}

export interface EventAnnouncement {
  id: string;
  eventId: string;
  eventTitle: string;
  organizerId: string;
  title: string;
  message: string;
  audience: 'all' | 'teams' | 'mentors' | 'judges';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: 'event' | 'certificate' | 'institution' | 'user' | 'submission' | 'attendance' | 'security';
  targetId: string;
  targetName: string;
  timestamp: string;
  ipAddress?: string;
  details: string;
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
  institution?: string;
}

export interface ResearchConference {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  city: string;
  state: string;
  dates: string;
  submissionDeadline: string;
  tracks: string[];
  mode: 'Offline' | 'Online' | 'Hybrid';
  indexType: string;
  registrationUrl: string;
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
  type: 'mentor' | 'team' | 'event' | 'attendance' | 'certificate' | 'meeting' | 'system' | 'message' | 'connection';
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

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  institution?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  accuracy?: number;
  verified?: boolean;
  photoUrl?: string;
  photoHash?: string;
  distanceMeters?: number;
  status?: string;
  notes?: string;
}

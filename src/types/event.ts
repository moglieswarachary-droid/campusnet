export type EventStatus = 
  | 'draft' 
  | 'submitted'
  | 'pending_document_verification'
  | 'pending_admin_approval'
  | 'changes_requested'
  | 'approved'
  | 'rejected'
  | 'published' 
  | 'registration_open' 
  | 'registration_closed' 
  | 'live' 
  | 'completed' 
  | 'archived'
  | 'review';

export interface EventHostingDocument {
  id: string;
  eventId: string;
  type: 'institution_proof' | 'formal_request_letter' | 'other';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  uploadedAt: string;
  verifiedByAdmin?: boolean;
  verificationNotes?: string;
}

export interface StateUTMaster {
  code: string;
  name: string;
  type: 'state' | 'ut';
  districts: string[];
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
  coordinatorDesignation?: string;
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
  documents?: EventHostingDocument[];
  adminReviewNotes?: string;
  submittedAt?: string;
  resubmissionCount?: number;
  isAcknowledged?: boolean;
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

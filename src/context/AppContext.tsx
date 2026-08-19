import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mentor, Researcher, Team, Project, EventItem, 
  AttendanceRecord, Certificate, ResearchPublication, CampusStory, 
  AskQuestion, NotificationItem, MentorshipRequest, TeamChatMessage, 
  MentorGuidanceItem, RoleType, ProjectTask, ProjectMilestone, 
  MentorshipCertificate, DirectMessage, ConnectionRequest, InstitutionInfo, 
  ResearchConference, OrganizerAccount, SuperAdminAccount, EventRegistrationItem, 
  QRCheckInRecord, EventProjectSubmission, EvaluationCriterion, JudgeAccount, 
  JudgeAssignment, EvaluationScore, EventWinnerRecord, CertificateTemplate, 
  EventAnnouncement, AuditLogEntry, EventStatus, EventHostingDocument 
} from '../types';
import { 
  INITIAL_CURRENT_USER, MOCK_STUDENTS, MOCK_MENTORS, 
  MOCK_RESEARCHERS, MOCK_TEAMS, MOCK_PROJECTS, MOCK_EVENTS, 
  MOCK_CERTIFICATES, MOCK_MENTORSHIP_CERTIFICATES, MOCK_PUBLICATIONS, 
  MOCK_STORIES, MOCK_QUESTIONS, MOCK_NOTIFICATIONS, 
  MOCK_DIRECT_MESSAGES, MOCK_INSTITUTIONS_DATA, MOCK_RESEARCH_CONFERENCES,
  MOCK_ORGANIZER_ACCOUNTS, MOCK_SUPER_ADMIN_ACCOUNT, MOCK_EVENT_REGISTRATIONS,
  MOCK_QR_CHECKINS, MOCK_PROJECT_SUBMISSIONS, MOCK_EVALUATION_CRITERIA,
  MOCK_JUDGES, MOCK_EVALUATION_SCORES, MOCK_EVENT_WINNERS,
  MOCK_CERTIFICATE_TEMPLATES, MOCK_EVENT_ANNOUNCEMENTS, MOCK_AUDIT_LOGS
} from '../data/mockData';

export type NavigationTab = 
  | 'home' 
  | 'discover' 
  | 'projects' 
  | 'events' 
  | 'mentors' 
  | 'research' 
  | 'community' 
  | 'workspace' 
  | 'portfolio' 
  | 'dashboard' 
  | 'admin'
  | 'ask'
  | 'stories'
  | 'certificates';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

export interface VideoMeetingState {
  isActive: boolean;
  meetingId: string;
  teamId: string;
  teamName: string;
  isCamOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor';
  participants: { id: string; name: string; role: string; avatar: string; isSpeaking?: boolean; isMuted?: boolean }[];
}

interface AppContextType {
  // Public user state
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  activeRole: RoleType;
  switchRole: (role: RoleType) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedMentorId: string | null;
  setSelectedMentorId: (id: string | null) => void;
  
  // Public Entities
  students: User[];
  mentors: Mentor[];
  researchers: Researcher[];
  teams: Team[];
  projects: Project[];
  events: EventItem[];
  certificates: Certificate[];
  mentorshipCertificates: MentorshipCertificate[];
  publications: ResearchPublication[];
  conferences: ResearchConference[];
  institutions: InstitutionInfo[];
  stories: CampusStory[];
  askQuestions: AskQuestion[];
  notifications: NotificationItem[];
  mentorshipRequests: MentorshipRequest[];
  attendanceRecords: AttendanceRecord[];
  directMessages: DirectMessage[];
  connectionRequests: ConnectionRequest[];
  
  // Public Profile Management
  updateStudentProfile: (data: Partial<User>) => void;
  updateMentorProfile: (mentorId: string, data: Partial<Mentor>) => void;
  updateResearcherProfile: (scholarId: string, data: Partial<Researcher>) => void;

  // Organizer Portal State & Methods
  currentOrganizer: OrganizerAccount | null;
  organizers: OrganizerAccount[];
  organizerLogin: (emailOrId: string, password?: string) => boolean;
  organizerLogout: () => void;
  updateOrganizerProfile: (data: Partial<OrganizerAccount>) => void;
  
  // Super Admin Portal State & Methods
  currentSuperAdmin: SuperAdminAccount | null;
  superAdminLogin: (usernameOrEmail: string, password?: string) => boolean;
  superAdminLogout: () => void;
  
  // Event Lifecycle & Management
  createOrganizerEvent: (data: Partial<EventItem>) => EventItem;
  updateOrganizerEvent: (eventId: string, data: Partial<EventItem>) => void;
  submitEventForApproval: (eventId: string) => void;
  approveEvent: (eventId: string, comments?: string) => void;
  rejectEvent: (eventId: string, comments: string) => void;
  publishEvent: (eventId: string) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  duplicateEvent: (eventId: string) => EventItem;
  requestEventChanges: (eventId: string, notes: string) => void;
  resubmitEventWithChanges: (eventId: string, updatedData: Partial<EventItem>) => void;
  rejectEventWithReason: (eventId: string, reason: string) => void;
  approveAndPublishEvent: (eventId: string, comments?: string) => void;
  uploadEventDocument: (eventId: string, doc: Omit<EventHostingDocument, 'id' | 'uploadedAt'>) => void;

  // Institution Master Management
  addInstitution: (inst: Omit<InstitutionInfo, 'id'>) => InstitutionInfo;
  updateInstitution: (instId: string, data: Partial<InstitutionInfo>) => void;
  deleteInstitution: (instId: string) => void;
  importInstitutionsBatch: (batch: InstitutionInfo[]) => void;
  
  // Participant & Registration Management
  eventRegistrations: EventRegistrationItem[];
  updateRegistrationStatus: (regId: string, status: 'confirmed' | 'waitlisted' | 'cancelled') => void;
  markAttendanceQR: (eventId: string, registrationId: string, method?: 'qr_scan' | 'manual_override') => boolean;
  manualAttendanceOverride: (eventId: string, registrationId: string, notes?: string) => boolean;
  qrCheckInRecords: QRCheckInRecord[];
  
  // Submissions, Criteria & Judging
  projectSubmissions: EventProjectSubmission[];
  submitProjectSubmission: (submission: Partial<EventProjectSubmission>) => void;
  evaluationCriteria: EvaluationCriterion[];
  addEvaluationCriterion: (criterion: Omit<EvaluationCriterion, 'id'>) => void;
  deleteEvaluationCriterion: (criterionId: string) => void;
  judges: JudgeAccount[];
  addJudgeAccount: (judge: Omit<JudgeAccount, 'id' | 'accessKey'> & { accessKey?: string }) => JudgeAccount;
  assignJudgeToSubmission: (judgeId: string, submissionId: string) => void;
  evaluationScores: EvaluationScore[];
  submitJudgeScore: (scoreData: Omit<EvaluationScore, 'id' | 'submittedAt'>) => void;
  eventWinners: EventWinnerRecord[];
  finalizeEventWinners: (eventId: string, winners: Omit<EventWinnerRecord, 'id' | 'certificateGenerated'>[]) => void;
  
  // Certificate Management Center
  certificateTemplates: CertificateTemplate[];
  createCertificateTemplate: (template: Omit<CertificateTemplate, 'id'>) => CertificateTemplate;
  updateCertificateTemplate: (templateId: string, data: Partial<CertificateTemplate>) => void;
  generateEventCertificateSingle: (regId: string, role: Certificate['recipientRole'], achievement?: string) => Certificate;
  generateEventCertificatesBulk: (eventId: string, category: Certificate['recipientRole']) => Certificate[];
  revokeCertificate: (certificateNumber: string, reason: string) => boolean;
  
  // Announcements & Reports
  eventAnnouncements: EventAnnouncement[];
  createEventAnnouncement: (announcement: Omit<EventAnnouncement, 'id' | 'createdAt'>) => void;
  
  // Super Admin Moderation & Audit Logs
  auditLogs: AuditLogEntry[];
  logAuditAction: (action: string, targetType: AuditLogEntry['targetType'], targetId: string, targetName: string, details: string) => void;
  verifyInstitution: (instId: string) => void;
  suspendInstitution: (instId: string) => void;
  suspendUser: (userId: string) => void;
  reactivateUser: (userId: string) => void;
  verifyUser: (userId: string) => void;

  // Modals & Active Selections
  selectedEventModal: EventItem | null;
  setSelectedEventModal: (event: EventItem | null) => void;
  selectedUserProfileModal: User | Mentor | Researcher | null;
  setSelectedUserProfileModal: (user: User | Mentor | Researcher | null) => void;
  isDirectMessagingOpen: boolean;
  setIsDirectMessagingOpen: (open: boolean) => void;
  activeMessagingPartner: User | Mentor | Researcher | null;
  setActiveMessagingPartner: (partner: User | Mentor | Researcher | null) => void;
  
  // Saved / Bookmarked Items
  savedItemIds: string[];
  toggleSaveItem: (id: string) => void;
  
  // Global India Location Filters
  filterState: string;
  setFilterState: (state: string) => void;
  filterCity: string;
  setFilterCity: (city: string) => void;
  
  // Team chat & guidance
  chatMessages: TeamChatMessage[];
  sendChatMessage: (teamId: string, text: string, fileAttachment?: { name: string; size: string; type: string }) => void;
  mentorGuidance: MentorGuidanceItem[];
  addMentorGuidance: (item: Omit<MentorGuidanceItem, 'id' | 'timestamp'>) => void;
  
  // Direct Messaging
  sendDirectMessage: (receiverId: string, receiverName: string, text: string) => void;
  sendConnectionRequest: (receiverId: string, note?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  
  // Project & Team Actions
  createProject: (projectData: Partial<Project>) => Project;
  updateProjectMilestone: (projectId: string, milestoneId: string, status: 'approved' | 'rejected' | 'in_progress', feedback?: string) => void;
  addProjectTask: (projectId: string, task: Omit<ProjectTask, 'id'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: 'todo' | 'in_progress' | 'done') => void;
  createTeam: (teamData: Partial<Team>) => Team;
  joinTeamRole: (teamId: string, roleIndex: number, user: User) => void;
  
  // Mentor Actions
  sendMentorshipRequest: (req: Omit<MentorshipRequest, 'id' | 'createdAt' | 'status'>) => void;
  respondToMentorshipRequest: (requestId: string, action: 'accepted' | 'declined' | 'info_requested', message?: string) => void;
  completeMentorshipAndIssueCertificate: (teamId: string, mentorContribution: string, projectOutcome: string) => MentorshipCertificate | null;
  
  // Event & Attendance Actions
  registerForEvent: (eventId: string, teamId?: string) => void;
  submitAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => Promise<boolean>;
  generateCertificateForEvent: (studentName: string, role: Certificate['recipientRole'], eventTitle: string, organizer: string, rank?: string) => Certificate;
  
  // Community Actions
  addAskQuestion: (title: string, body: string, tags: string[]) => void;
  upvoteQuestion: (questionId: string) => void;
  addAnswerToQuestion: (questionId: string, body: string) => void;
  markBestAnswer: (questionId: string, answerId: string) => void;
  toggleLikeStory: (storyId: string) => void;
  addCommentToStory: (storyId: string) => void;
  
  // Video Meeting
  videoMeeting: VideoMeetingState;
  startVideoMeeting: (teamId: string) => void;
  toggleMeetingCam: () => void;
  toggleMeetingMic: () => void;
  toggleMeetingScreenShare: () => void;
  endVideoMeeting: () => void;
  
  // UI Controls
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  authModalType: 'none' | 'login' | 'student_register' | 'mentor_onboarding' | 'scholar_register' | 'organizer_login' | 'organizer_register';
  setAuthModalType: (type: 'none' | 'login' | 'student_register' | 'mentor_onboarding' | 'scholar_register' | 'organizer_login' | 'organizer_register') => void;
  authTargetRole: 'student' | 'mentor' | 'scholar' | 'organizer';
  setAuthTargetRole: (role: 'student' | 'mentor' | 'scholar' | 'organizer') => void;
  authTargetMode: 'login' | 'register';
  setAuthTargetMode: (mode: 'login' | 'register') => void;
  openAuthModal: (role?: 'student' | 'mentor' | 'scholar' | 'organizer', mode?: 'login' | 'register') => void;
  
  // Universal Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Admin & Verification Actions
  verifyStudentManually: (studentId: string) => void;
  verifyMentorManually: (mentorId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Public User
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('campusnet_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });
  
  const [activeRole, setActiveRole] = useState<RoleType>('student');
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-001');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    const routeMap: Record<NavigationTab, string> = {
      home: '/',
      discover: '/discover',
      projects: '/projects',
      events: '/events',
      mentors: '/mentors',
      research: '/research',
      workspace: '/workspace',
      dashboard: '/dashboard',
      portfolio: '/portfolio',
      certificates: '/certificates',
      ask: '/ask',
      stories: '/stories',
      community: '/discover',
      admin: '/admin'
    };
    const target = routeMap[tab] || '/';
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== target && !currentPath.startsWith(target + '/')) {
        navigate(target);
      }
    }
  }, [navigate]);
  
  // Core Entities with LocalStorage Persistence
  const [students, setStudents] = useState<User[]>(() => {
    const saved = localStorage.getItem('campusnet_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });
  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem('campusnet_mentors');
    return saved ? JSON.parse(saved) : MOCK_MENTORS;
  });
  const [researchers, setResearchers] = useState<Researcher[]>(() => {
    const saved = localStorage.getItem('campusnet_researchers');
    return saved ? JSON.parse(saved) : MOCK_RESEARCHERS;
  });
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('campusnet_teams');
    return saved ? JSON.parse(saved) : MOCK_TEAMS;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('campusnet_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('campusnet_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('campusnet_certificates');
    return saved ? JSON.parse(saved) : MOCK_CERTIFICATES;
  });
  const [mentorshipCertificates, setMentorshipCertificates] = useState<MentorshipCertificate[]>(() => {
    const saved = localStorage.getItem('campusnet_mentorship_certificates');
    return saved ? JSON.parse(saved) : MOCK_MENTORSHIP_CERTIFICATES;
  });
  const [publications] = useState<ResearchPublication[]>(MOCK_PUBLICATIONS);
  const [conferences] = useState<ResearchConference[]>(MOCK_RESEARCH_CONFERENCES);
  const [institutions, setInstitutions] = useState<InstitutionInfo[]>(() => {
    const saved = localStorage.getItem('campusnet_institutions');
    return saved ? JSON.parse(saved) : MOCK_INSTITUTIONS_DATA;
  });
  const [stories, setStories] = useState<CampusStory[]>(() => {
    const saved = localStorage.getItem('campusnet_stories');
    return saved ? JSON.parse(saved) : MOCK_STORIES;
  });
  const [askQuestions, setAskQuestions] = useState<AskQuestion[]>(() => {
    const saved = localStorage.getItem('campusnet_questions');
    return saved ? JSON.parse(saved) : MOCK_QUESTIONS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('campusnet_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('campusnet_direct_messages');
    return saved ? JSON.parse(saved) : MOCK_DIRECT_MESSAGES;
  });
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(() => {
    const saved = localStorage.getItem('campusnet_mentorship_requests');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Organizer Portal State
  const [organizers, setOrganizers] = useState<OrganizerAccount[]>(() => {
    const saved = localStorage.getItem('campusnet_organizers');
    return saved ? JSON.parse(saved) : MOCK_ORGANIZER_ACCOUNTS;
  });
  const [currentOrganizer, setCurrentOrganizer] = useState<OrganizerAccount | null>(() => {
    const saved = localStorage.getItem('campusnet_organizer_session');
    return saved ? JSON.parse(saved) : MOCK_ORGANIZER_ACCOUNTS[0]; // Seeded default KEC
  });
  
  // Super Admin Portal State
  const [currentSuperAdmin, setCurrentSuperAdmin] = useState<SuperAdminAccount | null>(() => {
    const saved = localStorage.getItem('campusnet_admin_session');
    return saved ? JSON.parse(saved) : MOCK_SUPER_ADMIN_ACCOUNT;
  });
  
  // Event Operations & Lifecycle State
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationItem[]>(() => {
    const saved = localStorage.getItem('campusnet_event_registrations');
    return saved ? JSON.parse(saved) : MOCK_EVENT_REGISTRATIONS;
  });
  const [qrCheckInRecords, setQrCheckInRecords] = useState<QRCheckInRecord[]>(() => {
    const saved = localStorage.getItem('campusnet_qr_checkins');
    return saved ? JSON.parse(saved) : MOCK_QR_CHECKINS;
  });
  const [projectSubmissions, setProjectSubmissions] = useState<EventProjectSubmission[]>(() => {
    const saved = localStorage.getItem('campusnet_project_submissions');
    return saved ? JSON.parse(saved) : MOCK_PROJECT_SUBMISSIONS;
  });
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriterion[]>(() => {
    const saved = localStorage.getItem('campusnet_evaluation_criteria');
    return saved ? JSON.parse(saved) : MOCK_EVALUATION_CRITERIA;
  });
  const [judges, setJudges] = useState<JudgeAccount[]>(() => {
    const saved = localStorage.getItem('campusnet_judges');
    return saved ? JSON.parse(saved) : MOCK_JUDGES;
  });
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScore[]>(() => {
    const saved = localStorage.getItem('campusnet_evaluation_scores');
    return saved ? JSON.parse(saved) : MOCK_EVALUATION_SCORES;
  });
  const [eventWinners, setEventWinners] = useState<EventWinnerRecord[]>(() => {
    const saved = localStorage.getItem('campusnet_event_winners');
    return saved ? JSON.parse(saved) : MOCK_EVENT_WINNERS;
  });
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>(() => {
    const saved = localStorage.getItem('campusnet_certificate_templates');
    return saved ? JSON.parse(saved) : MOCK_CERTIFICATE_TEMPLATES;
  });
  const [eventAnnouncements, setEventAnnouncements] = useState<EventAnnouncement[]>(() => {
    const saved = localStorage.getItem('campusnet_event_announcements');
    return saved ? JSON.parse(saved) : MOCK_EVENT_ANNOUNCEMENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('campusnet_audit_logs');
    return saved ? JSON.parse(saved) : MOCK_AUDIT_LOGS;
  });

  // Automated LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('campusnet_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('campusnet_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('campusnet_researchers', JSON.stringify(researchers));
  }, [researchers]);

  useEffect(() => {
    localStorage.setItem('campusnet_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('campusnet_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('campusnet_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('campusnet_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('campusnet_mentorship_certificates', JSON.stringify(mentorshipCertificates));
  }, [mentorshipCertificates]);

  useEffect(() => {
    localStorage.setItem('campusnet_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('campusnet_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('campusnet_questions', JSON.stringify(askQuestions));
  }, [askQuestions]);

  useEffect(() => {
    localStorage.setItem('campusnet_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem('campusnet_mentorship_requests', JSON.stringify(mentorshipRequests));
  }, [mentorshipRequests]);

  useEffect(() => {
    localStorage.setItem('campusnet_organizers', JSON.stringify(organizers));
  }, [organizers]);

  useEffect(() => {
    localStorage.setItem('campusnet_event_registrations', JSON.stringify(eventRegistrations));
  }, [eventRegistrations]);

  useEffect(() => {
    localStorage.setItem('campusnet_qr_checkins', JSON.stringify(qrCheckInRecords));
  }, [qrCheckInRecords]);

  useEffect(() => {
    localStorage.setItem('campusnet_project_submissions', JSON.stringify(projectSubmissions));
  }, [projectSubmissions]);

  useEffect(() => {
    localStorage.setItem('campusnet_evaluation_criteria', JSON.stringify(evaluationCriteria));
  }, [evaluationCriteria]);

  useEffect(() => {
    localStorage.setItem('campusnet_judges', JSON.stringify(judges));
  }, [judges]);

  useEffect(() => {
    localStorage.setItem('campusnet_evaluation_scores', JSON.stringify(evaluationScores));
  }, [evaluationScores]);

  useEffect(() => {
    localStorage.setItem('campusnet_event_winners', JSON.stringify(eventWinners));
  }, [eventWinners]);

  useEffect(() => {
    localStorage.setItem('campusnet_certificate_templates', JSON.stringify(certificateTemplates));
  }, [certificateTemplates]);

  useEffect(() => {
    localStorage.setItem('campusnet_event_announcements', JSON.stringify(eventAnnouncements));
  }, [eventAnnouncements]);

  useEffect(() => {
    localStorage.setItem('campusnet_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('campusnet_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: 'conn-req-1',
      senderId: 'usr-std-005',
      senderName: 'Rohan Sen',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderInstitution: 'IIT Bombay',
      senderDepartment: 'Computer Science',
      receiverId: 'usr-std-001',
      status: 'pending',
      note: 'Hey Aarav! Working on decentralized edge clusters at IITB. Would love to connect and share telemetry pipeline ideas.',
      timestamp: '1 day ago'
    }
  ]);
  
  // Modals & Overlays
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [selectedUserProfileModal, setSelectedUserProfileModal] = useState<User | Mentor | Researcher | null>(null);
  const [isDirectMessagingOpen, setIsDirectMessagingOpen] = useState<boolean>(false);
  const [activeMessagingPartner, setActiveMessagingPartner] = useState<User | Mentor | Researcher | null>(null);
  
  // Saved Items & Filters
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['ev-001', 'proj-001']);
  const [filterState, setFilterState] = useState<string>('All India');
  const [filterCity, setFilterCity] = useState<string>('All Cities');
  
  // Chat & Guidance
  const [chatMessages, setChatMessages] = useState<TeamChatMessage[]>([
    {
      id: 'msg-1',
      teamId: 'team-001',
      senderId: 'mnt-001',
      senderName: 'Dr. Arvind Rao',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'mentor',
      text: 'Good job on the YOLOv11 TensorRT layer quantization. Please remember to attach the FMEA motor cut-off safety schematic before the hardware inspection round.',
      timestamp: '10:45 AM'
    }
  ]);

  const [mentorGuidance, setMentorGuidance] = useState<MentorGuidanceItem[]>([
    {
      id: 'gd-1',
      teamId: 'team-001',
      mentorId: 'mnt-001',
      mentorName: 'Dr. Arvind Rao (IIT Bombay)',
      type: 'feedback',
      title: 'FMEA Safety Directive for Autonomous Orchard Spraying',
      content: 'Ensure your custom ESP32 LoRa telemetry board includes a hardware watchdog timer and secondary mechanical emergency stop switch before live orchard deployment.',
      timestamp: '2 days ago',
      links: ['https://campusnet.network/docs/fmea-uav-standard.pdf'],
      actionRequired: true
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // UI state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'none' | 'login' | 'student_register' | 'mentor_onboarding' | 'scholar_register' | 'organizer_login' | 'organizer_register'>('none');
  const [authTargetRole, setAuthTargetRole] = useState<'student' | 'mentor' | 'scholar' | 'organizer'>('student');
  const [authTargetMode, setAuthTargetMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (
    role: 'student' | 'mentor' | 'scholar' | 'organizer' = 'student', 
    mode: 'login' | 'register' = 'login'
  ) => {
    setAuthTargetRole(role);
    setAuthTargetMode(mode);
    if (role === 'organizer') {
      const url = new URL(window.location.href);
      url.searchParams.set('portal', 'organizer');
      if (mode === 'register') {
        url.searchParams.set('action', 'register');
      }
      window.location.href = url.toString();
      return;
    }

    if (mode === 'login') {
      setAuthModalType('login');
    } else {
      if (role === 'student') setAuthModalType('student_register');
      else if (role === 'mentor') setAuthModalType('mentor_onboarding');
      else if (role === 'scholar') setAuthModalType('scholar_register');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Video Meeting
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    isActive: false,
    meetingId: '',
    teamId: '',
    teamName: '',
    isCamOn: true,
    isMicOn: true,
    isScreenSharing: false,
    connectionQuality: 'excellent',
    participants: []
  });

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAuditAction = (
    action: string, 
    targetType: AuditLogEntry['targetType'], 
    targetId: string, 
    targetName: string, 
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      actorId: currentSuperAdmin?.id || currentOrganizer?.id || currentUser.id,
      actorName: currentSuperAdmin?.name || currentOrganizer?.coordinatorName || currentUser.name,
      actorRole: currentSuperAdmin ? 'super_admin' : currentOrganizer ? 'institution_admin' : currentUser.role,
      action,
      targetType,
      targetId,
      targetName,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    if (role === 'student') {
      setCurrentUser(MOCK_STUDENTS[0]);
    } else if (role === 'mentor') {
      setCurrentUser({
        ...MOCK_STUDENTS[0],
        id: MOCK_MENTORS[0].id,
        name: MOCK_MENTORS[0].name,
        email: MOCK_MENTORS[0].email,
        institution: MOCK_MENTORS[0].institution,
        role: 'mentor',
        avatar: MOCK_MENTORS[0].avatar
      });
    } else if (role === 'researcher') {
      setCurrentUser({
        ...MOCK_STUDENTS[0],
        id: MOCK_RESEARCHERS[0].id,
        name: MOCK_RESEARCHERS[0].name,
        email: MOCK_RESEARCHERS[0].email,
        institution: MOCK_RESEARCHERS[0].university,
        role: 'researcher',
        avatar: MOCK_RESEARCHERS[0].avatar
      });
    }
  };

  // --- ORGANIZER AUTHENTICATION ---
  const organizerLogin = (emailOrId: string, password?: string): boolean => {
    const lower = emailOrId.toLowerCase().trim();
    const found = organizers.find(
      o => o.officialEmail.toLowerCase() === lower || o.id.toLowerCase() === lower || o.institutionId.toLowerCase() === lower
    );

    if (found) {
      setCurrentOrganizer(found);
      localStorage.setItem('campusnet_organizer_session', JSON.stringify(found));
      logAuditAction('ORGANIZER_LOGIN', 'institution', found.id, found.institutionName, 'Successful organizer login');
      addToast({
        type: 'success',
        title: 'Institution Login Successful',
        message: `Welcome, ${found.coordinatorName} (${found.institutionName})`
      });
      return true;
    }

    addToast({
      type: 'error',
      title: 'Authentication Failed',
      message: 'Invalid institutional credentials or verification pending.'
    });
    return false;
  };

  const organizerLogout = () => {
    if (currentOrganizer) {
      logAuditAction('ORGANIZER_LOGOUT', 'institution', currentOrganizer.id, currentOrganizer.institutionName, 'Organizer session ended');
    }
    setCurrentOrganizer(null);
    localStorage.removeItem('campusnet_organizer_session');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'Organizer session securely terminated.'
    });
  };

  const updateOrganizerProfile = (data: Partial<OrganizerAccount>) => {
    if (!currentOrganizer) return;
    const updated = { ...currentOrganizer, ...data };
    setCurrentOrganizer(updated);
    setOrganizers(prev => prev.map(o => o.id === updated.id ? updated : o));
    localStorage.setItem('campusnet_organizer_session', JSON.stringify(updated));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Institutional coordinator details saved.'
    });
  };

  // --- SUPER ADMIN AUTHENTICATION ---
  const superAdminLogin = (usernameOrEmail: string, password?: string): boolean => {
    const lower = usernameOrEmail.toLowerCase().trim();
    if (lower === 'superadmin.demo' || lower === 'superadmin@campusnet-demo.in' || lower === 'admin') {
      setCurrentSuperAdmin(MOCK_SUPER_ADMIN_ACCOUNT);
      localStorage.setItem('campusnet_admin_session', JSON.stringify(MOCK_SUPER_ADMIN_ACCOUNT));
      logAuditAction('SUPER_ADMIN_LOGIN', 'security', 'adm-001', 'National Admin', 'Super admin authenticated with MFA verification');
      addToast({
        type: 'success',
        title: 'Super Admin Access Granted',
        message: 'Welcome to the CampusNet National Governance Console.'
      });
      return true;
    }

    addToast({
      type: 'error',
      title: 'Admin Authentication Error',
      message: 'Unauthorized credentials or invalid MFA token.'
    });
    return false;
  };

  const superAdminLogout = () => {
    setCurrentSuperAdmin(null);
    localStorage.removeItem('campusnet_admin_session');
    addToast({
      type: 'info',
      title: 'Admin Session Closed',
      message: 'Super administrator console locked.'
    });
  };

  // --- EVENT LIFECYCLE MANAGEMENT ---
  const createOrganizerEvent = (data: Partial<EventItem>): EventItem => {
    const newId = `ev-${Date.now()}`;
    const code = data.code || `CN-${currentOrganizer?.institutionName.substring(0, 3).toUpperCase() || 'ORG'}-26-${Math.floor(100 + Math.random() * 900)}`;

    const newEvent: EventItem = {
      id: newId,
      code,
      title: data.title || 'Untitled Innovation Challenge',
      organizer: currentOrganizer?.institutionName || 'CampusNet Institution',
      organizerId: currentOrganizer?.id || 'KEC-DEMO-001',
      organizerType: 'college',
      eventType: data.eventType || 'Hackathon',
      category: data.category || 'National Hackathon',
      theme: data.theme || 'Interdisciplinary Engineering',
      date: data.date || 'TBD',
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
      venue: data.venue || `${currentOrganizer?.institutionName || 'Campus'} Auditorium`,
      district: data.district || currentOrganizer?.city || 'Bengaluru',
      state: data.state || currentOrganizer?.state || 'Karnataka',
      city: data.city || currentOrganizer?.city || 'Bengaluru',
      mode: data.mode || 'Offline',
      description: data.description || 'Comprehensive hackathon problem statements for students.',
      rules: data.rules && data.rules.length > 0 ? data.rules : ['Original working prototype demonstration mandatory.'],
      tracks: data.tracks && data.tracks.length > 0 ? data.tracks : ['AI & Vision', 'Smart Agritech', 'Clean Energy'],
      prizes: data.prizes && data.prizes.length > 0 ? data.prizes : [{ rank: '1st Prize', amount: '₹1,00,000', description: 'Winner Cash Prize' }],
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      registeredTeamsCount: 0,
      participantLimit: data.participantLimit || 100,
      maxTeamSize: data.maxTeamSize || 6,
      minTeamSize: data.minTeamSize || 2,
      deadline: data.deadline || 'April 30, 2026',
      deadlineStatus: 'upcoming',
      status: 'draft',
      approvalStatus: 'pending',
      coordinatorName: currentOrganizer?.coordinatorName || 'Event Coordinator',
      coordinatorEmail: currentOrganizer?.officialEmail || 'events@campusnet.in',
      coordinatorPhone: currentOrganizer?.mobile || '+91 94401 23456',
      attendanceWindow: data.attendanceWindow || {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        targetLat: 12.7533,
        targetLng: 78.3496,
        allowedRadiusMeters: 500
      },
      submissionRequirements: data.submissionRequirements || ['Project Proposal PDF', 'GitHub Repository', 'Video Demo'],
      isRegistered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEvents(prev => [newEvent, ...prev]);
    logAuditAction('CREATE_EVENT_DRAFT', 'event', newEvent.id, newEvent.title, `Event draft created under code ${code}`);
    addToast({
      type: 'success',
      title: 'Event Draft Created',
      message: `"${newEvent.title}" saved. Ready for review submission.`
    });
    return newEvent;
  };

  const updateOrganizerEvent = (eventId: string, data: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...data, updatedAt: new Date().toISOString() } : e));
    logAuditAction('UPDATE_EVENT', 'event', eventId, data.title || 'Event', 'Event details modified by organizer');
    addToast({
      type: 'success',
      title: 'Event Updated',
      message: 'Event configurations and schedules synced.'
    });
  };

  const submitEventForApproval = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: 'review',
          approvalStatus: 'pending',
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));
    logAuditAction('SUBMIT_EVENT_FOR_APPROVAL', 'event', eventId, 'Event', 'Submitted to Super Admin approval queue');
    addToast({
      type: 'info',
      title: 'Submitted for Review',
      message: 'Event has been submitted to the National Super Admin board for verification.'
    });
  };

  const updateStudentProfile = (data: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('campusnet_user', JSON.stringify(updated));
      return updated;
    });
    setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, ...data } : s));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Student profile details and social links saved.'
    });
  };

  const updateMentorProfile = (mentorId: string, data: Partial<Mentor>) => {
    setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, ...data } : m));
    if (currentUser.id === mentorId || currentUser.email === data.email) {
      setCurrentUser(prev => {
        const updated = { ...prev, ...data };
        localStorage.setItem('campusnet_user', JSON.stringify(updated));
        return updated;
      });
    }
    logAuditAction('UPDATE_MENTOR_PROFILE', 'user', mentorId, data.name || 'Mentor', 'Mentor expertise, social links, and Vidwan profile synced');
    addToast({
      type: 'success',
      title: 'Mentor Profile Saved',
      message: 'Academic expertise, social links, and Vidwan profile synced.'
    });
  };

  const updateResearcherProfile = (scholarId: string, data: Partial<Researcher>) => {
    setResearchers(prev => prev.map(r => r.id === scholarId ? { ...r, ...data } : r));
    if (currentUser.id === scholarId || currentUser.email === data.email) {
      setCurrentUser(prev => {
        const updated = { ...prev, ...data };
        localStorage.setItem('campusnet_user', JSON.stringify(updated));
        return updated;
      });
    }
    logAuditAction('UPDATE_SCHOLAR_PROFILE', 'user', scholarId, data.name || 'PhD Scholar', 'PhD scholar academic profile, research topics, and Vidwan link synced');
    addToast({
      type: 'success',
      title: 'PhD Scholar Profile Saved',
      message: 'Doctoral research area, Vidwan profile, and social links synced.'
    });
  };

  const uploadEventDocument = (eventId: string, doc: Omit<EventHostingDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: EventHostingDocument = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      eventId,
      uploadedAt: new Date().toISOString(),
      verifiedByAdmin: false
    };

    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const existingDocs = e.documents || [];
        return {
          ...e,
          documents: [...existingDocs.filter(d => d.type !== doc.type), newDoc],
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    addToast({
      type: 'success',
      title: 'Document Uploaded',
      message: `"${doc.title}" attached securely for Super Admin verification.`
    });
  };

  const requestEventChanges = (eventId: string, notes: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: 'changes_requested',
          approvalStatus: 'rejected',
          adminReviewNotes: notes,
          approvalComments: notes,
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    // Generate notification for organizer
    const targetEvent = events.find(e => e.id === eventId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Action Required: Changes Requested for "${targetEvent?.title || 'Event'}"`,
        description: notes,
        type: 'event',
        timestamp: 'Just now',
        read: false,
        linkAction: 'events'
      },
      ...prev
    ]);

    logAuditAction('REQUEST_EVENT_CHANGES', 'event', eventId, targetEvent?.title || 'Event', `Changes requested: ${notes}`);
    addToast({
      type: 'warning',
      title: 'Changes Requested',
      message: 'Directive sent to institutional coordinator with feedback.'
    });
  };

  const resubmitEventWithChanges = (eventId: string, updatedData: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          ...updatedData,
          status: 'pending_admin_approval',
          approvalStatus: 'pending',
          resubmissionCount: (e.resubmissionCount || 0) + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    logAuditAction('RESUBMIT_EVENT', 'event', eventId, updatedData.title || 'Event', 'Event resubmitted with revisions for Super Admin approval');
    addToast({
      type: 'success',
      title: 'Event Resubmitted',
      message: 'Updated proposal sent to National Super Admin Queue.'
    });
  };

  const rejectEventWithReason = (eventId: string, reason: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: 'rejected',
          approvalStatus: 'rejected',
          adminReviewNotes: reason,
          approvalComments: reason,
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    const targetEvent = events.find(e => e.id === eventId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Event Proposal Rejected: "${targetEvent?.title || 'Event'}"`,
        description: reason,
        type: 'event',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);

    logAuditAction('REJECT_EVENT', 'event', eventId, targetEvent?.title || 'Event', `Event rejected: ${reason}`);
    addToast({
      type: 'error',
      title: 'Event Rejected',
      message: 'Institutional event proposal declined.'
    });
  };

  const approveAndPublishEvent = (eventId: string, comments?: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: 'published',
          approvalStatus: 'approved',
          adminReviewNotes: comments || 'Approved by National Accreditation Board.',
          approvalComments: comments || 'Approved by National Accreditation Board.',
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    const targetEvent = events.find(e => e.id === eventId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Event Approved & Published: "${targetEvent?.title || 'Event'}"`,
        description: comments || 'Your event has received Super Admin accreditation and is now live on CampusNet.',
        type: 'event',
        timestamp: 'Just now',
        read: false,
        linkAction: 'events'
      },
      ...prev
    ]);

    logAuditAction('APPROVE_AND_PUBLISH_EVENT', 'event', eventId, targetEvent?.title || 'Event', `Accredited and published. Notes: ${comments || 'None'}`);
    addToast({
      type: 'success',
      title: 'Event Accredited & Published! 🎉',
      message: 'Event is now discoverable across all Indian colleges.'
    });
  };

  const approveEvent = (eventId: string, comments?: string) => {
    approveAndPublishEvent(eventId, comments);
  };

  const rejectEvent = (eventId: string, comments: string) => {
    rejectEventWithReason(eventId, comments);
  };

  const publishEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'published', updatedAt: new Date().toISOString() } : e));
    addToast({
      type: 'success',
      title: 'Event Published',
      message: 'Event is now live on CampusNet.'
    });
  };

  // --- INSTITUTION MASTER MANAGEMENT ---
  const addInstitution = (inst: Omit<InstitutionInfo, 'id'>): InstitutionInfo => {
    const newInst: InstitutionInfo = {
      ...inst,
      id: `inst-${Date.now()}`
    };
    setInstitutions(prev => [newInst, ...prev]);
    logAuditAction('ADD_INSTITUTION', 'institution', newInst.id, newInst.name, `New institution registered in ${newInst.state}`);
    addToast({
      type: 'success',
      title: 'Institution Added',
      message: `"${newInst.name}" registered in master catalog.`
    });
    return newInst;
  };

  const updateInstitution = (instId: string, data: Partial<InstitutionInfo>) => {
    setInstitutions(prev => prev.map(i => i.id === instId ? { ...i, ...data } : i));
    logAuditAction('UPDATE_INSTITUTION', 'institution', instId, data.name || 'Institution', 'Institution master details updated');
    addToast({
      type: 'success',
      title: 'Institution Updated',
      message: 'Master institution record saved.'
    });
  };

  const deleteInstitution = (instId: string) => {
    const target = institutions.find(i => i.id === instId);
    setInstitutions(prev => prev.filter(i => i.id !== instId));
    logAuditAction('DELETE_INSTITUTION', 'institution', instId, target?.name || 'Institution', 'Institution master entry removed');
    addToast({
      type: 'info',
      title: 'Institution Removed',
      message: 'Master entry deleted from directory.'
    });
  };

  const importInstitutionsBatch = (batch: InstitutionInfo[]) => {
    if (!batch || batch.length === 0) return;
    setInstitutions(prev => {
      const existingIds = new Set(prev.map(i => i.id));
      const newItems = batch.filter(b => !existingIds.has(b.id));
      return [...prev, ...newItems];
    });
    logAuditAction('BULK_IMPORT_INSTITUTIONS', 'institution', 'batch', 'Master Directory', `Imported ${batch.length} institutions via master dataset import`);
    addToast({
      type: 'success',
      title: 'Institutions Imported',
      message: `Successfully processed ${batch.length} institutional records.`
    });
  };

  const updateEventStatus = (eventId: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status, updatedAt: new Date().toISOString() } : e));
    logAuditAction('UPDATE_EVENT_STATUS', 'event', eventId, 'Event', `Status changed to ${status.toUpperCase()}`);
    addToast({
      type: 'info',
      title: 'Event Status Changed',
      message: `Event is now ${status.toUpperCase().replace('_', ' ')}.`
    });
  };

  const duplicateEvent = (eventId: string): EventItem => {
    const original = events.find(e => e.id === eventId) || events[0];
    const newId = `ev-${Date.now()}`;
    const newCode = `CN-${currentOrganizer?.institutionName.substring(0, 3).toUpperCase() || 'DUP'}-26-${Math.floor(100 + Math.random() * 900)}`;

    const duplicated: EventItem = {
      ...original,
      id: newId,
      code: newCode,
      title: `${original.title} (Duplicate Draft)`,
      status: 'draft',
      approvalStatus: 'pending',
      registeredTeamsCount: 0,
      isRegistered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEvents(prev => [duplicated, ...prev]);
    logAuditAction('DUPLICATE_EVENT', 'event', newId, duplicated.title, `Duplicated from ${original.title}`);
    addToast({
      type: 'success',
      title: 'Event Duplicated',
      message: 'New draft created without copying sensitive participant records.'
    });
    return duplicated;
  };

  // --- PARTICIPANT & REGISTRATION MANAGEMENT ---
  const updateRegistrationStatus = (regId: string, status: 'confirmed' | 'waitlisted' | 'cancelled') => {
    setEventRegistrations(prev => prev.map(r => r.id === regId ? { ...r, registrationStatus: status } : r));
    addToast({
      type: 'info',
      title: 'Registration Status Updated',
      message: `Participant registration marked as ${status}.`
    });
  };

  const markAttendanceQR = (eventId: string, registrationId: string, method: 'qr_scan' | 'manual_override' = 'qr_scan'): boolean => {
    const reg = eventRegistrations.find(r => r.id === registrationId && r.eventId === eventId);
    if (!reg) return false;

    if (reg.attendanceStatus === 'checked_in') {
      addToast({
        type: 'warning',
        title: 'Already Checked In',
        message: `${reg.participantName} was previously marked checked in at ${reg.checkInTimestamp || 'earlier session'}.`
      });
      return false;
    }

    const checkInRecord: QRCheckInRecord = {
      id: `chk-${Date.now()}`,
      eventId,
      registrationId,
      participantId: reg.participantId,
      participantName: reg.participantName,
      institution: reg.institution,
      timestamp: new Date().toISOString(),
      organizerId: currentOrganizer?.id || 'KEC-DEMO-001',
      organizerName: currentOrganizer?.coordinatorName || 'Event Coordinator',
      method,
      deviceInfo: 'CampusNet Institutional Check-In Scanner',
      latitude: 12.7533,
      longitude: 78.3496,
      verified: true
    };

    setQrCheckInRecords(prev => [checkInRecord, ...prev]);
    setEventRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return {
          ...r,
          attendanceStatus: 'checked_in',
          checkInTimestamp: checkInRecord.timestamp,
          checkInMethod: method === 'qr_scan' ? 'qr_scanner' : 'manual_override',
          checkedInBy: currentOrganizer?.coordinatorName || 'Event Coordinator'
        };
      }
      return r;
    }));

    logAuditAction('ATTENDANCE_CHECKIN', 'attendance', registrationId, reg.participantName, `Verified check-in via ${method}`);
    addToast({
      type: 'success',
      title: 'Attendance Verified ✓',
      message: `${reg.participantName} (${reg.institution}) checked in successfully.`
    });
    return true;
  };

  const manualAttendanceOverride = (eventId: string, registrationId: string, notes?: string): boolean => {
    return markAttendanceQR(eventId, registrationId, 'manual_override');
  };

  // --- SUBMISSIONS, CRITERIA & JUDGING ---
  const submitProjectSubmission = (submission: Partial<EventProjectSubmission>) => {
    const newSubmission: EventProjectSubmission = {
      id: `sub-${Date.now()}`,
      eventId: submission.eventId || 'ev-kec-001',
      teamId: submission.teamId || 'team-001',
      teamName: submission.teamName || 'Team Innovation',
      projectTitle: submission.projectTitle || 'Untitled Hackathon Prototype',
      description: submission.description || '',
      problemStatement: submission.problemStatement || '',
      solution: submission.solution || '',
      techStack: submission.techStack || ['AI', 'Hardware'],
      githubUrl: submission.githubUrl,
      demoUrl: submission.demoUrl,
      presentationUrl: submission.presentationUrl,
      videoUrl: submission.videoUrl,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    setProjectSubmissions(prev => [newSubmission, ...prev]);
    addToast({
      type: 'success',
      title: 'Project Submitted for Evaluation',
      message: `"${newSubmission.projectTitle}" has been uploaded to the organizer review queue.`
    });
  };

  const addEvaluationCriterion = (criterion: Omit<EvaluationCriterion, 'id'>) => {
    const newCrit: EvaluationCriterion = {
      ...criterion,
      id: `crit-${Date.now()}`
    };
    setEvaluationCriteria(prev => [...prev, newCrit]);
    addToast({
      type: 'success',
      title: 'Criteria Added',
      message: `Added "${criterion.name}" (${criterion.weightagePercent}% weightage).`
    });
  };

  const deleteEvaluationCriterion = (criterionId: string) => {
    setEvaluationCriteria(prev => prev.filter(c => c.id !== criterionId));
    addToast({
      type: 'info',
      title: 'Criteria Removed',
      message: 'Evaluation rubric updated.'
    });
  };

  const addJudgeAccount = (judge: Omit<JudgeAccount, 'id' | 'accessKey'> & { accessKey?: string }): JudgeAccount => {
    const newJudge: JudgeAccount = {
      ...judge,
      id: `jdg-${Date.now()}`,
      accessKey: judge.accessKey || `JUDGE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    setJudges(prev => [...prev, newJudge]);
    addToast({
      type: 'success',
      title: 'Judge Assigned',
      message: `${judge.name} added with secure access key.`
    });
    return newJudge;
  };

  const assignJudgeToSubmission = (judgeId: string, submissionId: string) => {
    setJudges(prev => prev.map(j => {
      if (j.id === judgeId) {
        return {
          ...j,
          assignedSubmissionIds: Array.from(new Set([...j.assignedSubmissionIds, submissionId]))
        };
      }
      return j;
    }));
    addToast({
      type: 'info',
      title: 'Submission Assigned to Jury',
      message: 'Judge workspace updated.'
    });
  };

  const submitJudgeScore = (scoreData: Omit<EvaluationScore, 'id' | 'submittedAt'>) => {
    const newScore: EvaluationScore = {
      ...scoreData,
      id: `sc-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setEvaluationScores(prev => [newScore, ...prev.filter(s => !(s.submissionId === scoreData.submissionId && s.judgeId === scoreData.judgeId))]);
    
    // Update submission status
    setProjectSubmissions(prev => prev.map(sub => {
      if (sub.id === scoreData.submissionId) {
        return {
          ...sub,
          status: 'evaluated',
          finalScore: scoreData.totalWeightedScore
        };
      }
      return sub;
    }));

    logAuditAction('SUBMIT_JURY_SCORE', 'submission', scoreData.submissionId, 'Submission', `Jury score submitted: ${scoreData.totalWeightedScore}/100`);
    addToast({
      type: 'success',
      title: 'Jury Evaluation Submitted',
      message: `Score recorded: ${scoreData.totalWeightedScore.toFixed(1)}/100.`
    });
  };

  const finalizeEventWinners = (eventId: string, winners: Omit<EventWinnerRecord, 'id' | 'certificateGenerated'>[]) => {
    const winnerRecords: EventWinnerRecord[] = winners.map((w, idx) => ({
      ...w,
      id: `win-${Date.now()}-${idx}`,
      certificateGenerated: false
    }));

    setEventWinners(prev => [...prev.filter(w => w.eventId !== eventId), ...winnerRecords]);
    
    // Update submissions rank
    winners.forEach(w => {
      setProjectSubmissions(prev => prev.map(s => {
        if (s.id === w.submissionId) {
          return { ...s, status: 'winner', rank: w.category };
        }
        return s;
      }));
    });

    logAuditAction('FINALIZE_WINNERS', 'event', eventId, 'Event', `Finalized ${winners.length} winner ranks and awards`);
    addToast({
      type: 'success',
      title: 'Event Rankings Finalized 🏆',
      message: `${winners.length} winners recorded. Ready for certificate issuance in Certificate Center.`
    });
  };

  // --- CERTIFICATE MANAGEMENT CENTER ---
  const createCertificateTemplate = (template: Omit<CertificateTemplate, 'id'>): CertificateTemplate => {
    const newTpl: CertificateTemplate = {
      ...template,
      id: `tpl-${Date.now()}`
    };
    setCertificateTemplates(prev => [...prev, newTpl]);
    addToast({
      type: 'success',
      title: 'Template Created',
      message: `Certificate template "${newTpl.title}" is ready.`
    });
    return newTpl;
  };

  const updateCertificateTemplate = (templateId: string, data: Partial<CertificateTemplate>) => {
    setCertificateTemplates(prev => prev.map(t => t.id === templateId ? { ...t, ...data } : t));
    addToast({
      type: 'info',
      title: 'Template Updated',
      message: 'Certificate styling and layout saved.'
    });
  };

  const generateEventCertificateSingle = (regId: string, role: Certificate['recipientRole'], achievement?: string): Certificate => {
    const reg = eventRegistrations.find(r => r.id === regId) || eventRegistrations[0];
    const event = events.find(e => e.id === reg.eventId) || events[0];
    
    const certNum = `CN-${currentOrganizer?.institutionName.substring(0, 3).toUpperCase() || 'KEC'}-${event.code?.substring(0, 4) || 'AI26'}-${role.substring(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      recipientName: reg.participantName,
      recipientRole: role,
      eventTitle: event.title,
      eventId: event.id,
      eventOrganizer: event.organizer,
      organizerInstitutionId: currentOrganizer?.id,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://campusnet.network/verify/certificate/${certNum}`,
      rank: achievement,
      achievement: achievement || `Certified ${role}`,
      verified: true,
      institution: reg.institution,
      type: 'event',
      status: 'valid'
    };

    setCertificates(prev => [newCert, ...prev]);
    setEventRegistrations(prev => prev.map(r => r.id === regId ? { ...r, certificateStatus: 'generated', certificateId: certNum } : r));
    logAuditAction('GENERATE_CERTIFICATE', 'certificate', certNum, reg.participantName, `Issued ${role} certificate`);
    addToast({
      type: 'success',
      title: 'Certificate Generated 📜',
      message: `ID: ${certNum} with tamper-proof QR verification.`
    });
    return newCert;
  };

  const generateEventCertificatesBulk = (eventId: string, category: Certificate['recipientRole']): Certificate[] => {
    const eligibleRegs = eventRegistrations.filter(r => r.eventId === eventId && r.attendanceStatus === 'checked_in');
    const generated: Certificate[] = [];

    eligibleRegs.forEach(reg => {
      const cert = generateEventCertificateSingle(reg.id, category);
      generated.push(cert);
    });

    logAuditAction('BULK_GENERATE_CERTIFICATES', 'certificate', eventId, category, `Bulk generated ${generated.length} certificates for checked-in participants`);
    addToast({
      type: 'success',
      title: 'Bulk Generation Complete 🎉',
      message: `Generated ${generated.length} certificates for verified attendees.`
    });
    return generated;
  };

  const revokeCertificate = (certificateNumber: string, reason: string): boolean => {
    let found = false;
    
    // Check Event Certs
    setCertificates(prev => prev.map(c => {
      if (c.certificateNumber.toLowerCase() === certificateNumber.toLowerCase()) {
        found = true;
        return {
          ...c,
          status: 'revoked',
          revocationReason: reason,
          revokedAt: new Date().toISOString(),
          revokedBy: currentSuperAdmin?.name || currentOrganizer?.coordinatorName || 'Authorized Admin'
        };
      }
      return c;
    }));

    // Check Mentorship Certs
    setMentorshipCertificates(prev => prev.map(m => {
      if (m.certificateNumber.toLowerCase() === certificateNumber.toLowerCase()) {
        found = true;
        return {
          ...m,
          status: 'revoked'
        };
      }
      return m;
    }));

    if (found) {
      logAuditAction('REVOKE_CERTIFICATE', 'certificate', certificateNumber, 'Revoked Credential', `Revocation Reason: ${reason}`);
      addToast({
        type: 'warning',
        title: 'Certificate Revoked',
        message: `ID ${certificateNumber} has been marked as REVOKED in the national registry.`
      });
      return true;
    }

    addToast({
      type: 'error',
      title: 'Revocation Failed',
      message: 'Certificate ID not found.'
    });
    return false;
  };

  // --- ANNOUNCEMENTS ---
  const createEventAnnouncement = (announcement: Omit<EventAnnouncement, 'id' | 'createdAt'>) => {
    const newAnc: EventAnnouncement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEventAnnouncements(prev => [newAnc, ...prev]);
    addToast({
      type: 'success',
      title: 'Announcement Broadcasted 📢',
      message: `Sent to ${announcement.audience.toUpperCase()} participants.`
    });
  };

  // --- SUPER ADMIN MODERATION ---
  const verifyInstitution = (instId: string) => {
    setInstitutions(prev => prev.map(i => i.id === instId ? { ...i, verified: true } : i));
    setOrganizers(prev => prev.map(o => o.institutionId === instId ? { ...o, verificationStatus: 'verified' } : o));
    logAuditAction('VERIFY_INSTITUTION', 'institution', instId, 'Institution', 'Verified accreditation and authorized event hosting');
    addToast({
      type: 'success',
      title: 'Institution Verified',
      message: 'College is now authorized to publish national events on CampusNet.'
    });
  };

  const suspendInstitution = (instId: string) => {
    setInstitutions(prev => prev.map(i => i.id === instId ? { ...i, verified: false } : i));
    setOrganizers(prev => prev.map(o => o.institutionId === instId ? { ...o, verificationStatus: 'suspended' } : o));
    logAuditAction('SUSPEND_INSTITUTION', 'institution', instId, 'Institution', 'Suspended for compliance audit');
    addToast({
      type: 'warning',
      title: 'Institution Suspended',
      message: 'Event hosting capabilities temporarily locked.'
    });
  };

  const suspendUser = (userId: string) => {
    setStudents(prev => prev.map(s => s.id === userId ? { ...s, status: 'suspended' } : s));
    setMentors(prev => prev.map(m => m.id === userId ? { ...m, status: 'suspended' } : m));
    logAuditAction('SUSPEND_USER', 'user', userId, 'User', 'Account suspended for terms violation');
    addToast({
      type: 'warning',
      title: 'Account Suspended',
      message: 'User account has been locked.'
    });
  };

  const reactivateUser = (userId: string) => {
    setStudents(prev => prev.map(s => s.id === userId ? { ...s, status: 'active' } : s));
    setMentors(prev => prev.map(m => m.id === userId ? { ...m, status: 'active' } : m));
    logAuditAction('REACTIVATE_USER', 'user', userId, 'User', 'Account access restored');
    addToast({
      type: 'success',
      title: 'Account Reactivated',
      message: 'User access restored.'
    });
  };

  const verifyUser = (userId: string) => {
    setStudents(prev => prev.map(s => s.id === userId ? { ...s, verifiedStudent: true, status: 'active' } : s));
    setMentors(prev => prev.map(m => m.id === userId ? { ...m, verifiedMentor: true, status: 'active' } : m));
    logAuditAction('VERIFY_USER_BONAFIDE', 'user', userId, 'User', 'Bonafide credentials validated');
    addToast({
      type: 'success',
      title: 'User Verified',
      message: 'Bonafide badge issued.'
    });
  };

  // --- EXISTING STUDENT / MENTOR / MESSAGING HANDLERS (PRESERVED 100%) ---
  const sendDirectMessage = (receiverId: string, receiverName: string, text: string) => {
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      receiverId,
      receiverName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setDirectMessages(prev => [...prev, newMsg]);
    addToast({
      type: 'success',
      title: 'Message Sent',
      message: `Delivered to ${receiverName}.`
    });
  };

  const sendConnectionRequest = (receiverId: string, note?: string) => {
    const newReq: ConnectionRequest = {
      id: `conn-req-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      senderInstitution: currentUser.institution,
      senderDepartment: currentUser.department,
      receiverId,
      status: 'pending',
      note: note || 'Would love to connect on CampusNet!',
      timestamp: 'Just now'
    };
    setConnectionRequests(prev => [newReq, ...prev]);
    addToast({
      type: 'success',
      title: 'Connection Request Sent',
      message: 'Invitation delivered to peer network.'
    });
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
    addToast({
      type: 'success',
      title: 'Connection Accepted',
      message: 'You are now connected on CampusNet!'
    });
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds(prev => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter(i => i !== id) : [...prev, id];
      addToast({
        type: 'info',
        title: isSaved ? 'Removed from Saved' : 'Saved to Bookmarks',
        message: isSaved ? 'Item removed from your bookmarks.' : 'Item saved for quick access.'
      });
      return next;
    });
  };

  const sendChatMessage = (teamId: string, text: string, fileAttachment?: { name: string; size: string; type: string }) => {
    const newMsg: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      teamId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role === 'mentor' ? 'mentor' : currentUser.role === 'researcher' ? 'researcher' : 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileAttachment
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const addMentorGuidance = (item: Omit<MentorGuidanceItem, 'id' | 'timestamp'>) => {
    const newItem: MentorGuidanceItem = {
      ...item,
      id: `gd-${Date.now()}`,
      timestamp: 'Just now'
    };
    setMentorGuidance(prev => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Guidance Note Posted',
      message: `Directive shared with Team.`
    });
  };

  const createProject = (projectData: Partial<Project>): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: projectData.title || 'Untitled Project',
      problemStatement: projectData.problemStatement || '',
      proposedSolution: projectData.proposedSolution || '',
      domain: projectData.domain || 'AI & Machine Learning',
      technologies: projectData.technologies || [],
      requiredSkills: projectData.requiredSkills || [],
      teamMembersCount: 1,
      institution: currentUser.institution,
      status: 'Idea',
      progressPercent: 15,
      githubUrl: projectData.githubUrl,
      demoUrl: projectData.demoUrl,
      documentationUrl: projectData.documentationUrl,
      objectives: projectData.objectives || [],
      seekingRoles: projectData.seekingRoles || [],
      papersCount: 0,
      milestones: [
        { id: 'm1', title: 'Problem Definition & Literature Review', description: 'Complete requirements specification', status: 'approved', dueDate: '2026-03-30', approvedByMentor: true }
      ],
      tasks: [],
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setProjects(prev => [newProj, ...prev]);
    addToast({
      type: 'success',
      title: 'Project Created on CampusNet 🎉',
      message: `"${newProj.title}" is now open for collaborators.`
    });
    return newProj;
  };

  const updateProjectMilestone = (projectId: string, milestoneId: string, status: 'approved' | 'rejected' | 'in_progress', feedback?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: p.milestones.map(m => m.id === milestoneId ? {
            ...m,
            status,
            approvedByMentor: status === 'approved',
            mentorFeedback: feedback || m.mentorFeedback
          } : m)
        };
      }
      return p;
    }));
    addToast({
      type: status === 'approved' ? 'success' : 'info',
      title: status === 'approved' ? 'Milestone Approved ✓' : 'Milestone Updated',
      message: `Feedback recorded for team.`
    });
  };

  const addProjectTask = (projectId: string, task: Omit<ProjectTask, 'id'>) => {
    const newTask: ProjectTask = { ...task, id: `t-${Date.now()}` };
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, tasks: [...p.tasks, newTask] };
      }
      return p;
    }));
    addToast({
      type: 'success',
      title: 'Task Assigned',
      message: `"${task.title}" assigned to ${task.assignee}.`
    });
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
        };
      }
      return p;
    }));
  };

  const createTeam = (teamData: Partial<Team>): Team => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamData.name || 'New Innovation Team',
      projectName: teamData.projectName || 'New Project',
      domain: teamData.domain || 'Engineering',
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          department: currentUser.department,
          college: currentUser.institution,
          role: 'Team Leader',
          avatar: currentUser.avatar,
          verified: true,
          isLeader: true,
          studentId: currentUser.studentId,
          email: currentUser.email,
          mobile: currentUser.mobile
        }
      ],
      maxMembers: teamData.maxMembers || 6,
      requiredRoles: teamData.requiredRoles || [
        { role: 'Lead Developer', departmentHint: 'CSE', filled: true, filledBy: currentUser.name },
        { role: 'Hardware Specialist', departmentHint: 'ECE', filled: false }
      ],
      status: 'forming',
      mentorStatus: 'none',
      createdAt: new Date().toISOString()
    };
    setTeams(prev => [newTeam, ...prev]);
    addToast({
      type: 'success',
      title: 'Team Created',
      message: `"${newTeam.name}" workspace initialized.`
    });
    return newTeam;
  };

  const joinTeamRole = (teamId: string, roleIndex: number, user: User) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const updatedRoles = [...t.requiredRoles];
        const role = updatedRoles[roleIndex];
        if (role && !role.filled) {
          role.filled = true;
          role.filledBy = user.name;
          const newMember = {
            userId: user.id,
            name: user.name,
            department: user.department,
            college: user.institution,
            role: role.role,
            avatar: user.avatar,
            verified: user.verifiedStudent
          };
          return {
            ...t,
            members: [...t.members, newMember],
            requiredRoles: updatedRoles
          };
        }
      }
      return t;
    }));
    addToast({
      type: 'success',
      title: 'Joined Team!',
      message: `You are now a team member on CampusNet.`
    });
  };

  const sendMentorshipRequest = (req: Omit<MentorshipRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: MentorshipRequest = {
      ...req,
      id: `mreq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setMentorshipRequests(prev => [newReq, ...prev]);
    addToast({
      type: 'success',
      title: 'Mentorship Request Sent',
      message: `Proposal submitted to ${req.mentorName}.`
    });
  };

  const respondToMentorshipRequest = (requestId: string, action: 'accepted' | 'declined' | 'info_requested', message?: string) => {
    setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: action, mentorFeedbackNote: message } : r));
    const req = mentorshipRequests.find(r => r.id === requestId);
    if (action === 'accepted' && req) {
      setTeams(prev => prev.map(t => t.id === req.teamId ? { ...t, mentorId: req.mentorId, mentorName: req.mentorName, mentorStatus: 'accepted' } : t));
      addToast({
        type: 'success',
        title: 'Mentorship Activated 🎉',
        message: `You are now officially guiding Team ${req.teamName}.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Response Recorded',
        message: `Mentorship response sent.`
      });
    }
  };

  const completeMentorshipAndIssueCertificate = (teamId: string, mentorContribution: string, projectOutcome: string): MentorshipCertificate | null => {
    const team = teams.find(t => t.id === teamId) || teams[0];
    const mentor = mentors.find(m => m.id === team.mentorId || m.name === team.mentorName) || mentors[0];
    const proj = projects.find(p => p.teamId === teamId) || projects[0];

    const certNumber = `CN-2026-MNT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: MentorshipCertificate = {
      id: `ment-cert-${Date.now()}`,
      certificateNumber: certNumber,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorDesignation: mentor.designation || mentor.title,
      mentorInstitution: mentor.institution,
      teamId: team.id,
      teamName: team.name,
      studentNames: team.members.map(m => m.name),
      studentInstitutions: Array.from(new Set(team.members.map(m => m.college))),
      projectTitle: proj.title,
      projectDomain: proj.domain,
      startDate: 'September 2025',
      completionDate: 'February 2026',
      durationWeeks: 24,
      mentorContribution,
      milestonesGuided: proj.milestones.length,
      skillsCovered: proj.technologies,
      projectOutcome,
      qrCodeData: `https://campusnet.network/verify/certificate/${certNumber}`,
      verified: true,
      issuedAt: new Date().toISOString(),
      status: 'valid',
      authorizedSignatures: [
        { name: mentor.name, title: 'Faculty Guide', organization: mentor.institution },
        { name: 'Dr. K. Narayanan', title: 'Dean of Research', organization: 'National Innovation Registry' }
      ]
    };

    setMentorshipCertificates(prev => [newCert, ...prev]);
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, mentorStatus: 'completed' } : t));
    
    addToast({
      type: 'success',
      title: 'Mentorship Completed & Certificate Issued! 📜',
      message: `Verifiable Certificate generated (ID: ${certNumber}).`
    });

    return newCert;
  };

  const registerForEvent = (eventId: string, teamId?: string) => {
    const ev = events.find(e => e.id === eventId);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isRegistered: true, registeredTeamsCount: e.registeredTeamsCount + 1 } : e));
    
    // Create new event registration item
    const newReg: EventRegistrationItem = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: ev?.title || 'Event Challenge',
      participantId: currentUser.id,
      participantName: currentUser.name,
      studentId: currentUser.studentId,
      institution: currentUser.institution,
      department: currentUser.department,
      year: currentUser.year,
      email: currentUser.email,
      phone: currentUser.mobile,
      teamId: teamId || 'team-001',
      teamName: 'Team AgriVision AI',
      registrationStatus: 'confirmed',
      paymentStatus: 'free',
      attendanceStatus: 'registered',
      submissionStatus: 'pending',
      certificateStatus: 'pending',
      registeredAt: new Date().toISOString()
    };

    setEventRegistrations(prev => [newReg, ...prev]);

    addToast({
      type: 'success',
      title: 'Team Registered on CampusNet 🎉',
      message: `6-Member Team confirmed for ${ev?.title || 'Event'}.`
    });
  };

  const submitAttendance = async (record: Omit<AttendanceRecord, 'id' | 'timestamp'>): Promise<boolean> => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    addToast({
      type: 'success',
      title: 'GPS Attendance Verified ✓',
      message: `Verified at ${record.eventTitle} nodal center.`
    });
    return true;
  };

  const generateCertificateForEvent = (studentName: string, role: Certificate['recipientRole'], eventTitle: string, organizer: string, rank?: string): Certificate => {
    const certNumber = `CN-2026-${role.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      recipientName: studentName,
      recipientRole: role,
      eventTitle,
      eventOrganizer: organizer,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://campusnet.network/verify/certificate/${certNumber}`,
      rank,
      achievement: rank || `Certified ${role}`,
      verified: true,
      institution: currentUser.institution,
      type: 'event',
      status: 'valid'
    };
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const addAskQuestion = (title: string, body: string, tags: string[]) => {
    const newQ: AskQuestion = {
      id: `q-${Date.now()}`,
      title,
      body,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'mentor' ? 'Verified Mentor' : currentUser.role === 'researcher' ? 'PhD Scholar' : 'Student',
      authorCollege: currentUser.institution,
      tags,
      upvotes: 1,
      answersCount: 0,
      hasAcceptedAnswer: false,
      createdAt: new Date().toISOString(),
      answers: []
    };
    setAskQuestions(prev => [newQ, ...prev]);
    addToast({
      type: 'success',
      title: 'Question Posted',
      message: 'Your query is now live on Ask Campus.'
    });
  };

  const upvoteQuestion = (questionId: string) => {
    setAskQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const isUpvoted = q.isUpvoted;
        return {
          ...q,
          upvotes: isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
          isUpvoted: !isUpvoted
        };
      }
      return q;
    }));
  };

  const addAnswerToQuestion = (questionId: string, body: string) => {
    const newAns = {
      id: `ans-${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'mentor' ? 'Professor' : 'Student',
      authorBadge: currentUser.role === 'mentor' ? 'Verified Mentor' : 'Contributor',
      body,
      upvotes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString()
    };
    setAskQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answersCount: q.answersCount + 1,
          answers: [...q.answers, newAns]
        };
      }
      return q;
    }));
    addToast({
      type: 'success',
      title: 'Answer Submitted',
      message: 'Thank you for contributing academic peer knowledge!'
    });
  };

  const markBestAnswer = (questionId: string, answerId: string) => {
    setAskQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          hasAcceptedAnswer: true,
          answers: q.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId
          }))
        };
      }
      return q;
    }));
  };

  const toggleLikeStory = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        const isLiked = s.isLiked;
        return {
          ...s,
          likesCount: isLiked ? s.likesCount - 1 : s.likesCount + 1,
          isLiked: !isLiked
        };
      }
      return s;
    }));
  };

  const addCommentToStory = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, commentsCount: s.commentsCount + 1 } : s));
  };

  const startVideoMeeting = (teamId: string) => {
    const team = teams.find(t => t.id === teamId) || teams[0];
    setVideoMeeting({
      isActive: true,
      meetingId: `MEET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      teamId,
      teamName: team.name,
      isCamOn: true,
      isMicOn: true,
      isScreenSharing: false,
      connectionQuality: 'excellent',
      participants: team.members.map(m => ({
        id: m.userId,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        isSpeaking: m.userId === currentUser.id,
        isMuted: false
      }))
    });
  };

  const toggleMeetingCam = () => {
    setVideoMeeting(prev => ({ ...prev, isCamOn: !prev.isCamOn }));
  };

  const toggleMeetingMic = () => {
    setVideoMeeting(prev => ({ ...prev, isMicOn: !prev.isMicOn }));
  };

  const toggleMeetingScreenShare = () => {
    setVideoMeeting(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  const endVideoMeeting = () => {
    setVideoMeeting(prev => ({ ...prev, isActive: false }));
  };

  const verifyStudentManually = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, verifiedStudent: true } : s));
    addToast({
      type: 'success',
      title: 'Student Verified',
      message: 'Bonafide status updated.'
    });
  };

  const verifyMentorManually = (mentorId: string) => {
    setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, verifiedMentor: true } : m));
    addToast({
      type: 'success',
      title: 'Mentor Verified',
      message: 'Faculty credentials authenticated.'
    });
  };

  const resetDemoData = useCallback(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
    setStudents(MOCK_STUDENTS);
    setMentors(MOCK_MENTORS);
    setResearchers(MOCK_RESEARCHERS);
    setTeams(MOCK_TEAMS);
    setProjects(MOCK_PROJECTS);
    setEvents(MOCK_EVENTS);
    setCertificates(MOCK_CERTIFICATES);
    setMentorshipCertificates(MOCK_MENTORSHIP_CERTIFICATES);
    setInstitutions(MOCK_INSTITUTIONS_DATA);
    setStories(MOCK_STORIES);
    setAskQuestions(MOCK_QUESTIONS);
    setNotifications(MOCK_NOTIFICATIONS);
    setDirectMessages(MOCK_DIRECT_MESSAGES);
    setMentorshipRequests([]);
    setOrganizers(MOCK_ORGANIZER_ACCOUNTS);
    setCurrentOrganizer(MOCK_ORGANIZER_ACCOUNTS[0]);
    setCurrentSuperAdmin(MOCK_SUPER_ADMIN_ACCOUNT);
    setEventRegistrations(MOCK_EVENT_REGISTRATIONS);
    setQrCheckInRecords(MOCK_QR_CHECKINS);
    setProjectSubmissions(MOCK_PROJECT_SUBMISSIONS);
    setEvaluationCriteria(MOCK_EVALUATION_CRITERIA);
    setJudges(MOCK_JUDGES);
    setEvaluationScores(MOCK_EVALUATION_SCORES);
    setEventWinners(MOCK_EVENT_WINNERS);
    setCertificateTemplates(MOCK_CERTIFICATE_TEMPLATES);
    setEventAnnouncements(MOCK_EVENT_ANNOUNCEMENTS);
    setAuditLogs(MOCK_AUDIT_LOGS);
    setCurrentUser(INITIAL_CURRENT_USER);
    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All system entities have been restored to default seeds.'
    });
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole,
        switchRole,
        activeTab,
        setActiveTab,
        selectedEventId,
        setSelectedEventId,
        selectedProjectId,
        setSelectedProjectId,
        selectedMentorId,
        setSelectedMentorId,
        
        students,
        mentors,
        researchers,
        teams,
        projects,
        events,
        certificates,
        mentorshipCertificates,
        publications,
        conferences,
        institutions,
        stories,
        askQuestions,
        notifications,
        mentorshipRequests,
        attendanceRecords,
        directMessages,
        connectionRequests,
        
        // Public Profile Management
        updateStudentProfile,
        updateMentorProfile,
        updateResearcherProfile,

        // Organizer Portal
        currentOrganizer,
        organizers,
        organizerLogin,
        organizerLogout,
        updateOrganizerProfile,
        
        // Super Admin Portal
        currentSuperAdmin,
        superAdminLogin,
        superAdminLogout,
        
        // Event Lifecycle
        createOrganizerEvent,
        updateOrganizerEvent,
        submitEventForApproval,
        approveEvent,
        rejectEvent,
        publishEvent,
        updateEventStatus,
        duplicateEvent,
        requestEventChanges,
        resubmitEventWithChanges,
        rejectEventWithReason,
        approveAndPublishEvent,
        uploadEventDocument,

        // Institution Master Management
        addInstitution,
        updateInstitution,
        deleteInstitution,
        importInstitutionsBatch,
        
        // Participant Management
        eventRegistrations,
        updateRegistrationStatus,
        markAttendanceQR,
        manualAttendanceOverride,
        qrCheckInRecords,
        
        // Submissions & Judging
        projectSubmissions,
        submitProjectSubmission,
        evaluationCriteria,
        addEvaluationCriterion,
        deleteEvaluationCriterion,
        judges,
        addJudgeAccount,
        assignJudgeToSubmission,
        evaluationScores,
        submitJudgeScore,
        eventWinners,
        finalizeEventWinners,
        
        // Certificate Center
        certificateTemplates,
        createCertificateTemplate,
        updateCertificateTemplate,
        generateEventCertificateSingle,
        generateEventCertificatesBulk,
        revokeCertificate,
        
        // Announcements & Reports
        eventAnnouncements,
        createEventAnnouncement,
        
        // Super Admin
        auditLogs,
        logAuditAction,
        verifyInstitution,
        suspendInstitution,
        suspendUser,
        reactivateUser,
        verifyUser,
        
        // Saved & Modals
        savedItemIds,
        toggleSaveItem,
        selectedEventModal,
        setSelectedEventModal,
        selectedUserProfileModal,
        setSelectedUserProfileModal,
        isDirectMessagingOpen,
        setIsDirectMessagingOpen,
        activeMessagingPartner,
        setActiveMessagingPartner,
        
        filterState,
        setFilterState,
        filterCity,
        setFilterCity,
        
        chatMessages,
        sendChatMessage,
        mentorGuidance,
        addMentorGuidance,
        sendDirectMessage,
        sendConnectionRequest,
        acceptConnectionRequest,
        createProject,
        updateProjectMilestone,
        addProjectTask,
        updateTaskStatus,
        createTeam,
        joinTeamRole,
        
        // Public Actions
        sendMentorshipRequest,
        respondToMentorshipRequest,
        completeMentorshipAndIssueCertificate,
        registerForEvent,
        submitAttendance,
        generateCertificateForEvent,
        addAskQuestion,
        upvoteQuestion,
        addAnswerToQuestion,
        markBestAnswer,
        toggleLikeStory,
        addCommentToStory,
        
        videoMeeting,
        startVideoMeeting,
        toggleMeetingCam,
        toggleMeetingMic,
        toggleMeetingScreenShare,
        endVideoMeeting,
        
        toasts,
        addToast,
        removeToast,
        isAIModalOpen,
        setIsAIModalOpen,
        authModalType,
        setAuthModalType,
        authTargetRole,
        setAuthTargetRole,
        authTargetMode,
        setAuthTargetMode,
        openAuthModal,
        searchQuery,
        setSearchQuery,
        verifyStudentManually,
        verifyMentorManually,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

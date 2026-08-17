import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Mentor, Researcher, Team, Project, EventItem, 
  AttendanceRecord, Certificate, ResearchPublication, CampusStory, 
  AskQuestion, NotificationItem, MentorshipRequest, TeamChatMessage, 
  MentorGuidanceItem, RoleType, ProjectTask, ProjectMilestone 
} from '../types';
import { 
  INITIAL_CURRENT_USER, MOCK_STUDENTS, MOCK_MENTORS, 
  MOCK_RESEARCHERS, MOCK_TEAMS, MOCK_PROJECTS, MOCK_EVENTS, 
  MOCK_CERTIFICATES, MOCK_PUBLICATIONS, MOCK_STORIES, 
  MOCK_ASK_QUESTIONS, MOCK_NOTIFICATIONS 
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
  
  // Data entities
  students: User[];
  mentors: Mentor[];
  researchers: Researcher[];
  teams: Team[];
  projects: Project[];
  events: EventItem[];
  certificates: Certificate[];
  publications: ResearchPublication[];
  stories: CampusStory[];
  askQuestions: AskQuestion[];
  notifications: NotificationItem[];
  mentorshipRequests: MentorshipRequest[];
  attendanceRecords: AttendanceRecord[];
  
  // Team chat & guidance
  chatMessages: TeamChatMessage[];
  sendChatMessage: (teamId: string, text: string, fileAttachment?: { name: string; size: string; type: string }) => void;
  mentorGuidance: MentorGuidanceItem[];
  addMentorGuidance: (item: Omit<MentorGuidanceItem, 'id' | 'timestamp'>) => void;
  
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
  authModalType: 'none' | 'login' | 'student_register' | 'mentor_onboarding';
  setAuthModalType: (type: 'none' | 'login' | 'student_register' | 'mentor_onboarding') => void;
  
  // Universal Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Admin Verification Action
  verifyStudentManually: (studentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('campuslink_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });
  
  const [activeRole, setActiveRole] = useState<RoleType>('student');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-001');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [mentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [researchers] = useState<Researcher[]>(MOCK_RESEARCHERS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [publications] = useState<ResearchPublication[]>(MOCK_PUBLICATIONS);
  const [stories, setStories] = useState<CampusStory[]>(MOCK_STORIES);
  const [askQuestions, setAskQuestions] = useState<AskQuestion[]>(MOCK_ASK_QUESTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([
    {
      id: 'req-001',
      teamId: 'team-agro-001',
      teamName: 'AgriVision Autonomous AI',
      projectTitle: 'AgriVision AI — Edge Drone Crop Diagnostics & Swarm Spraying',
      domain: 'Agriculture & IoT',
      mentorId: 'mnt-001',
      mentorName: 'Dr. Arvind Rao',
      requestedBy: 'Aarav Sharma',
      status: 'accepted',
      message: 'Respected Dr. Rao, our 6-member interdisciplinary team is preparing for SIH 2026. We need your guidance on TensorRT INT8 quantization and ROS2 autonomous navigation on micro-UAVs.',
      matchScore: 96,
      matchBreakdown: {
        domainScore: 38, // out of 40
        techScore: 29,   // out of 30
        researchScore: 19, // out of 20
        availabilityScore: 10 // out of 10
      },
      createdAt: '2026-02-11T10:00:00Z'
    }
  ]);
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  const [chatMessages, setChatMessages] = useState<TeamChatMessage[]>([
    {
      id: 'msg-1',
      teamId: 'team-agro-001',
      senderId: 'usr-std-001',
      senderName: 'Aarav Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'student',
      text: 'Good morning team! @Pooja have you verified the LoRaWAN payload packet schema with the gateway?',
      timestamp: '09:15 AM'
    },
    {
      id: 'msg-2',
      teamId: 'team-agro-001',
      senderId: 'usr-std-002',
      senderName: 'Pooja Iyer',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      senderRole: 'student',
      text: 'Yes Aarav! 16-byte packed struct is now transmitting at 868 MHz without collision. RSSI is -84 dBm over 1.8km.',
      timestamp: '09:22 AM'
    },
    {
      id: 'msg-3',
      teamId: 'team-agro-001',
      senderId: 'mnt-001',
      senderName: 'Dr. Arvind Rao (Mentor)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'mentor',
      text: 'Excellent progress. I have reviewed Milestone 3. Your TensorRT engine graphs look solid. Lets schedule a quick private video review today at 4:30 PM.',
      timestamp: '09:45 AM'
    }
  ]);
  
  const [mentorGuidance, setMentorGuidance] = useState<MentorGuidanceItem[]>([
    {
      id: 'mg-1',
      teamId: 'team-agro-001',
      mentorId: 'mnt-001',
      mentorName: 'Dr. Arvind Rao',
      type: 'approval',
      title: 'Milestone #3 Approved: Edge TensorRT Calibration',
      content: 'The inference metrics (23.8ms per 1080p frame) meet edge real-time criteria. Ensure emergency motor cut-off safety interlocks are triggered whenever confidence drops below 60%.',
      timestamp: '2 hours ago',
      actionRequired: false
    },
    {
      id: 'mg-2',
      teamId: 'team-agro-001',
      mentorId: 'mnt-001',
      mentorName: 'Dr. Arvind Rao',
      type: 'task',
      title: 'Prepare Failure Modes & Effects Analysis (FMEA) Table',
      content: 'For the SIH Grand Finale, the jury will evaluate sensor disconnection fallbacks. Document what happens if the LoRa telemetry drops during an active flight.',
      timestamp: '1 day ago',
      links: ['https://campuslink.network/resources/fmea-template.pdf'],
      actionRequired: true
    }
  ]);
  
  // Video Meeting State
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
  
  // UI Modals & Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'none' | 'login' | 'student_register' | 'mentor_onboarding'>('none');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist user in local storage
  useEffect(() => {
    localStorage.setItem('campuslink_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    if (role === 'student') {
      setCurrentUser(INITIAL_CURRENT_USER);
      setActiveTab('dashboard');
    } else if (role === 'mentor') {
      setCurrentUser({
        ...INITIAL_CURRENT_USER,
        id: 'mnt-001',
        name: 'Dr. Arvind Rao',
        email: 'arvind.rao@iitb.ac.in',
        role: 'mentor',
        institution: 'IIT Bombay'
      });
      setActiveTab('mentors');
    } else if (role === 'researcher') {
      setCurrentUser({
        ...INITIAL_CURRENT_USER,
        id: 'res-001',
        name: 'Kavya Ramanathan (PhD)',
        email: 'kavya.r@iisc.ac.in',
        role: 'researcher',
        institution: 'IISc Bangalore'
      });
      setActiveTab('research');
    } else if (role === 'organizer') {
      setCurrentUser({
        ...INITIAL_CURRENT_USER,
        id: 'org-001',
        name: 'Prof. S. R. Nodal Officer (AICTE)',
        email: 'organizer@sih.gov.in',
        role: 'organizer',
        institution: 'AICTE / Ministry of Education'
      });
      setActiveTab('events');
    } else if (role === 'superadmin') {
      setCurrentUser({
        ...INITIAL_CURRENT_USER,
        id: 'adm-001',
        name: 'System Security Lead',
        email: 'sec-ops@campuslink.internal',
        role: 'superadmin',
        institution: 'National Innovation Coordination Center'
      });
      setActiveTab('admin');
    }
    addToast({
      type: 'info',
      title: 'Role Switched',
      message: `Active view switched to ${role.toUpperCase()}`
    });
  };

  const sendChatMessage = (teamId: string, text: string, fileAttachment?: { name: string; size: string; type: string }) => {
    if (!text.trim() && !fileAttachment) return;
    const newMessage: TeamChatMessage = {
      id: 'msg-' + Date.now(),
      teamId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: (currentUser.role === 'mentor' ? 'mentor' : currentUser.role === 'researcher' ? 'researcher' : 'student'),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileAttachment
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const addMentorGuidance = (item: Omit<MentorGuidanceItem, 'id' | 'timestamp'>) => {
    const newItem: MentorGuidanceItem = {
      ...item,
      id: 'mg-' + Date.now(),
      timestamp: 'Just now'
    };
    setMentorGuidance(prev => [newItem, ...prev]);
    
    // Add Notification to students
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'New Mentor Guidance: ' + item.title,
        description: `${item.mentorName} posted new feedback on your workspace.`,
        type: 'mentor',
        timestamp: 'Just now',
        read: false,
        linkAction: 'workspace'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Guidance Published',
      message: 'Team members have been notified in their workspace.'
    });
  };

  const createProject = (projectData: Partial<Project>): Project => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      title: projectData.title || 'Untitled Innovation Project',
      problemStatement: projectData.problemStatement || '',
      proposedSolution: projectData.proposedSolution || '',
      domain: projectData.domain || 'Multi-Disciplinary Engineering',
      technologies: projectData.technologies || [],
      requiredSkills: projectData.requiredSkills || [],
      teamMembersCount: 1,
      institution: currentUser.institution,
      status: 'Idea',
      progressPercent: 15,
      papersCount: 0,
      milestones: [
        {
          id: 'm-init',
          title: 'Problem Definition & Team Formulation',
          description: 'Define multi-department roles, formulate prototype architecture and submit mentor request.',
          status: 'in_progress',
          dueDate: '2026-03-31'
        }
      ],
      tasks: [],
      createdAt: new Date().toISOString(),
      likes: 1,
      ...projectData
    };
    setProjects(prev => [newProj, ...prev]);
    addToast({
      type: 'success',
      title: 'Project Created!',
      message: `${newProj.title} has been published to the Innovation Hub.`
    });
    return newProj;
  };

  const updateProjectMilestone = (projectId: string, milestoneId: string, status: 'approved' | 'rejected' | 'in_progress', feedback?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          status,
          approvedByMentor: status === 'approved',
          mentorFeedback: feedback || m.mentorFeedback
        };
      });
      const approvedCount = updatedMilestones.filter(m => m.status === 'approved').length;
      const progressPercent = Math.min(100, Math.round((approvedCount / (updatedMilestones.length || 1)) * 100));
      return {
        ...p,
        milestones: updatedMilestones,
        progressPercent
      };
    }));
    addToast({
      type: status === 'approved' ? 'success' : 'info',
      title: `Milestone ${status.toUpperCase()}`,
      message: feedback ? `Feedback: ${feedback}` : 'Project progress updated.'
    });
  };

  const addProjectTask = (projectId: string, task: Omit<ProjectTask, 'id'>) => {
    const newTask: ProjectTask = {
      ...task,
      id: 'task-' + Date.now()
    };
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: [...p.tasks, newTask]
      };
    }));
    addToast({
      type: 'info',
      title: 'Task Added',
      message: `Assigned to ${task.assignee}`
    });
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
      };
    }));
  };

  const createTeam = (teamData: Partial<Team>): Team => {
    const newTeam: Team = {
      id: 'team-' + Date.now(),
      name: teamData.name || 'Innovation Squad',
      projectName: teamData.projectName || 'Inter-Collegiate Challenge',
      domain: teamData.domain || 'Multi-disciplinary',
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          department: currentUser.department,
          college: currentUser.institution,
          role: 'Team Lead',
          avatar: currentUser.avatar,
          verified: currentUser.verifiedStudent,
          isLeader: true
        }
      ],
      maxMembers: 6,
      requiredRoles: teamData.requiredRoles || [
        { role: 'Team Lead / AI', departmentHint: 'CSE / AI', filled: true, filledBy: currentUser.name },
        { role: 'Hardware / ECE', departmentHint: 'ECE', filled: false },
        { role: 'Mechanical Designer', departmentHint: 'Mechanical', filled: false },
        { role: 'UI/UX Designer', departmentHint: 'Design / Human Factors', filled: false },
        { role: 'Cloud & API Engineer', departmentHint: 'CSE / IT', filled: false },
        { role: 'Domain / Research Specialist', departmentHint: 'Domain Science', filled: false }
      ],
      status: 'forming',
      mentorStatus: 'none',
      createdAt: new Date().toISOString(),
      ...teamData
    };
    setTeams(prev => [newTeam, ...prev]);
    addToast({
      type: 'success',
      title: 'Team Formed!',
      message: `Team "${newTeam.name}" is now ready for inter-department recruitment.`
    });
    return newTeam;
  };

  const joinTeamRole = (teamId: string, roleIndex: number, user: User) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      const updatedRoles = [...t.requiredRoles];
      if (updatedRoles[roleIndex]) {
        updatedRoles[roleIndex] = {
          ...updatedRoles[roleIndex],
          filled: true,
          filledBy: user.name
        };
      }
      const existingMember = t.members.find(m => m.userId === user.id);
      const updatedMembers = existingMember ? t.members : [
        ...t.members,
        {
          userId: user.id,
          name: user.name,
          department: user.department,
          college: user.institution,
          role: updatedRoles[roleIndex]?.role || 'Specialist',
          avatar: user.avatar,
          verified: user.verifiedStudent
        }
      ];
      return {
        ...t,
        requiredRoles: updatedRoles,
        members: updatedMembers,
        status: updatedMembers.length >= 6 ? 'active' : 'forming'
      };
    }));
    addToast({
      type: 'success',
      title: 'Joined Team!',
      message: `${user.name} has joined the team workspace.`
    });
  };

  const sendMentorshipRequest = (req: Omit<MentorshipRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: MentorshipRequest = {
      ...req,
      id: 'req-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setMentorshipRequests(prev => [newReq, ...prev]);
    addToast({
      type: 'info',
      title: 'Mentorship Request Sent',
      message: `Request dispatched to ${req.mentorName}. Match Score: ${req.matchScore}%`
    });
  };

  const respondToMentorshipRequest = (requestId: string, action: 'accepted' | 'declined' | 'info_requested', message?: string) => {
    setMentorshipRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return { ...r, status: action };
    }));
    const req = mentorshipRequests.find(r => r.id === requestId);
    if (req && action === 'accepted') {
      setTeams(prev => prev.map(t => {
        if (t.id !== req.teamId) return t;
        return {
          ...t,
          mentorId: req.mentorId,
          mentorName: req.mentorName,
          mentorStatus: 'accepted'
        };
      }));
      setNotifications(prev => [
        {
          id: 'notif-' + Date.now(),
          title: 'Mentorship Request Accepted! 🎉',
          description: `${req.mentorName} accepted to guide Team "${req.teamName}". Workspace is now active.`,
          type: 'mentor',
          timestamp: 'Just now',
          read: false,
          linkAction: 'workspace'
        },
        ...prev
      ]);
    }
    addToast({
      type: action === 'accepted' ? 'success' : 'info',
      title: `Mentorship ${action === 'accepted' ? 'Accepted' : action === 'declined' ? 'Declined' : 'Info Requested'}`,
      message: message || `Updated request status.`
    });
  };

  const registerForEvent = (eventId: string, teamId?: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        isRegistered: true,
        registeredTeamsCount: e.registeredTeamsCount + 1
      };
    }));
    const ev = events.find(e => e.id === eventId);
    addToast({
      type: 'success',
      title: 'Registered for ' + (ev?.title || 'Event'),
      message: 'Your official team registration has been recorded on the national portal.'
    });
  };

  const submitAttendance = async (record: Omit<AttendanceRecord, 'id' | 'timestamp'>): Promise<boolean> => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: 'att-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    
    // Add toast
    if (newRecord.status === 'verified_gps') {
      addToast({
        type: 'success',
        title: 'Attendance Verified! 📍📸',
        message: `GPS Geolocation and Camera snapshot matched nodal venue within ${Math.round(record.distanceMeters)}m.`
      });
      return true;
    } else {
      addToast({
        type: 'warning',
        title: 'Manual Review Queued',
        message: 'GPS variance detected. Flagged for Event Organizer on-ground verification.'
      });
      return false;
    }
  };

  const generateCertificateForEvent = (
    recipientName: string, 
    role: Certificate['recipientRole'], 
    eventTitle: string, 
    organizer: string, 
    rank?: string
  ): Certificate => {
    const certNum = `CL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: 'cert-' + Date.now(),
      certificateNumber: certNum,
      recipientName,
      recipientRole: role,
      eventTitle,
      eventOrganizer: organizer,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://campuslink.network/verify/${certNum}`,
      rank,
      verified: true,
      institution: currentUser.institution
    };
    setCertificates(prev => [newCert, ...prev]);
    addToast({
      type: 'success',
      title: 'Digital Certificate Generated',
      message: `Issued ID: ${certNum} with verifiable QR code.`
    });
    return newCert;
  };

  const addAskQuestion = (title: string, body: string, tags: string[]) => {
    const newQ: AskQuestion = {
      id: 'q-' + Date.now(),
      title,
      body,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'mentor' ? 'Verified Mentor' : currentUser.role === 'researcher' ? 'PhD Researcher' : `Student (${currentUser.department})`,
      authorCollege: currentUser.institution,
      tags,
      upvotes: 1,
      answersCount: 0,
      hasAcceptedAnswer: false,
      createdAt: new Date().toISOString(),
      isUpvoted: true,
      answers: []
    };
    setAskQuestions(prev => [newQ, ...prev]);
    addToast({
      type: 'success',
      title: 'Question Published',
      message: 'Your question has been posted to the Ask Campus community.'
    });
  };

  const upvoteQuestion = (questionId: string) => {
    setAskQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      const isUpvoted = q.isUpvoted;
      return {
        ...q,
        upvotes: isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
        isUpvoted: !isUpvoted
      };
    }));
  };

  const addAnswerToQuestion = (questionId: string, body: string) => {
    const newAnswer = {
      id: 'ans-' + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'mentor' ? 'Verified Mentor' : currentUser.role === 'researcher' ? 'PhD Researcher' : `Student (${currentUser.department})`,
      authorBadge: currentUser.role === 'mentor' ? 'Verified Mentor' : 'Verified Student',
      body,
      upvotes: 1,
      isAccepted: false,
      createdAt: new Date().toISOString()
    };
    setAskQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        answersCount: q.answersCount + 1,
        answers: [...q.answers, newAnswer]
      };
    }));
    addToast({
      type: 'success',
      title: 'Answer Posted',
      message: 'Thank you for contributing to the student innovation network.'
    });
  };

  const markBestAnswer = (questionId: string, answerId: string) => {
    setAskQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        hasAcceptedAnswer: true,
        answers: q.answers.map(a => ({
          ...a,
          isAccepted: a.id === answerId
        }))
      };
    }));
    addToast({
      type: 'success',
      title: 'Best Answer Accepted',
      message: 'Marked as community-verified solution.'
    });
  };

  const toggleLikeStory = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const isLiked = s.isLiked;
      return {
        ...s,
        likesCount: isLiked ? s.likesCount - 1 : s.likesCount + 1,
        isLiked: !isLiked
      };
    }));
  };

  const addCommentToStory = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      return {
        ...s,
        commentsCount: s.commentsCount + 1
      };
    }));
    addToast({
      type: 'info',
      title: 'Comment Added',
      message: 'Your thought was posted on the project demo.'
    });
  };

  // Video Meeting Handlers
  const startVideoMeeting = (teamId: string) => {
    const team = teams.find(t => t.id === teamId) || teams[0];
    const teamParticipants = team.members.map(m => ({
      id: m.userId,
      name: m.name,
      role: m.role,
      avatar: m.avatar,
      isSpeaking: false,
      isMuted: m.userId !== currentUser.id
    }));
    
    // Add mentor if accepted
    if (team.mentorName) {
      teamParticipants.push({
        id: team.mentorId || 'mnt-001',
        name: team.mentorName,
        role: 'Assigned Project Mentor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isSpeaking: true,
        isMuted: false
      });
    }

    setVideoMeeting({
      isActive: true,
      meetingId: `mtg-${team.id}-${Date.now().toString(36)}`,
      teamId: team.id,
      teamName: team.name,
      isCamOn: true,
      isMicOn: true,
      isScreenSharing: false,
      connectionQuality: 'excellent',
      participants: teamParticipants
    });

    addToast({
      type: 'info',
      title: 'Private Meeting Room Live',
      message: 'Server authorization verified for confirmed team members.'
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
    addToast({
      type: 'info',
      title: 'Meeting Ended',
      message: 'Session encrypted logs stored securely in team archive.'
    });
  };

  const verifyStudentManually = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, verifiedStudent: true } : s));
    addToast({
      type: 'success',
      title: 'Student ID Verified',
      message: 'Institutional verification badge granted.'
    });
  };

  return (
    <AppContext.Provider value={{
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
      publications,
      stories,
      askQuestions,
      notifications,
      mentorshipRequests,
      attendanceRecords,
      chatMessages,
      sendChatMessage,
      mentorGuidance,
      addMentorGuidance,
      createProject,
      updateProjectMilestone,
      addProjectTask,
      updateTaskStatus,
      createTeam,
      joinTeamRole,
      sendMentorshipRequest,
      respondToMentorshipRequest,
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
      searchQuery,
      setSearchQuery,
      verifyStudentManually
    }}>
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

export type RoleType = 'student' | 'mentor' | 'researcher' | 'organizer' | 'superadmin';

export type OrganizerPermissionRole = 
  | 'institution_admin' 
  | 'coordinator' 
  | 'certificate_manager' 
  | 'judge_manager' 
  | 'attendance_manager' 
  | 'viewer';

export interface UserPrivacySettings {
  emailPublic: boolean;
  phonePublic: boolean;
  showProjectsToPublic: boolean;
}

export interface UserSocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  leetcode?: string;
  instagram?: string;
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
  twitter?: string;
  leetcode?: string;
  instagram?: string;
  socialLinks?: UserSocialLinks;
  portfolio?: string;
  idCardVerifiedAt?: string;
  role: RoleType;
  connectionsCount?: number;
  connectedUserIds?: string[];
  savedItemIds?: string[];
  privacy?: UserPrivacySettings;
  isDemoData?: boolean;
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
  experience?: string;
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
  github?: string;
  twitter?: string;
  leetcode?: string;
  instagram?: string;
  socialLinks?: UserSocialLinks;
  vidwan_profile_url?: string;
  isDemoData?: boolean;
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
  linkedin?: string;
  github?: string;
  twitter?: string;
  leetcode?: string;
  instagram?: string;
  socialLinks?: UserSocialLinks;
  vidwan_profile_url?: string;
  isDemoData?: boolean;
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

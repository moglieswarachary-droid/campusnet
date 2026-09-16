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

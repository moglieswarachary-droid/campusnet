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

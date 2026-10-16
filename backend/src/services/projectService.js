// ========================================================
// CAMPUSNET PROJECTS & TEAMS SERVICE & FORMATTERS
// Formats Prisma relational entities to frontend JSON contracts
// ========================================================

export function toPrismaProjectStatus(status) {
  if (!status) return 'IDEA';
  const upper = String(status).toUpperCase();
  const valid = ['IDEA', 'PLANNING', 'DEVELOPMENT', 'PROTOTYPE', 'TESTING', 'COMPLETED', 'PUBLISHED'];
  return valid.includes(upper) ? upper : 'IDEA';
}

export function toPrismaMilestoneStatus(status) {
  if (!status) return 'PENDING';
  const upper = String(status).toUpperCase();
  const valid = ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED'];
  return valid.includes(upper) ? upper : 'PENDING';
}

export function toPrismaTaskStatus(status) {
  if (!status) return 'TODO';
  const upper = String(status).toUpperCase();
  const valid = ['TODO', 'IN_PROGRESS', 'DONE'];
  return valid.includes(upper) ? upper : 'TODO';
}

export function formatPrismaProject(proj) {
  if (!proj) return null;
  const statusMap = {
    IDEA: 'Idea',
    PLANNING: 'Planning',
    DEVELOPMENT: 'Development',
    PROTOTYPE: 'Prototype',
    TESTING: 'Testing',
    COMPLETED: 'Completed',
    PUBLISHED: 'Published'
  };

  return {
    id: proj.id,
    title: proj.title,
    problemStatement: proj.problemStatement,
    proposedSolution: proj.proposedSolution,
    description: proj.description || '',
    category: proj.category || '',
    domain: proj.domain,
    technologies: proj.technologies || [],
    requiredSkills: proj.requiredSkills || [],
    teamId: proj.team ? proj.team.id : undefined,
    teamName: proj.team ? proj.team.name : undefined,
    teamMembersCount: proj.teamMembersCount || (proj.team && proj.team.members ? proj.team.members.length : 1),
    institution: proj.institution ? proj.institution.name : (proj.institutionId || 'Academic Institution'),
    state: proj.institution ? proj.institution.state : undefined,
    city: proj.institution ? proj.institution.city : undefined,
    mentor: proj.mentor ? proj.mentor.name : undefined,
    mentorId: proj.mentorId || undefined,
    mentorStatus: proj.mentorStatus || 'none',
    status: statusMap[proj.status] || 'Idea',
    progressPercent: proj.progressPercent || 0,
    githubUrl: proj.githubUrl || undefined,
    demoUrl: proj.demoUrl || undefined,
    documentationUrl: proj.documentationUrl || undefined,
    objectives: proj.objectives || [],
    seekingRoles: proj.seekingRoles || [],
    coverImage: proj.coverImageUrl || undefined,
    papersCount: proj.papersCount || 0,
    milestones: (proj.milestones || []).map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      status: (m.status || 'PENDING').toLowerCase(),
      dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split('T')[0] : '',
      approvedByMentor: Boolean(m.approvedByMentor),
      mentorFeedback: m.mentorFeedback || undefined
    })),
    tasks: (proj.tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      assignee: t.assigneeName || '',
      status: (t.status || 'TODO').toLowerCase(),
      priority: (t.priority || 'medium').toLowerCase()
    })),
    createdAt: proj.createdAt ? new Date(proj.createdAt).toISOString() : new Date().toISOString(),
    likes: proj.likesCount || 0
  };
}

export function formatPrismaTeam(team) {
  if (!team) return null;
  return {
    id: team.id,
    name: team.name,
    projectId: team.projectId || undefined,
    projectName: team.project ? team.project.title : (team.projectName || 'Active Project'),
    domain: team.domain,
    leaderId: team.leaderId,
    leaderName: team.leader ? team.leader.name : 'Team Leader',
    members: (team.members || []).map(m => ({
      userId: m.userId,
      name: m.user ? m.user.name : (m.name || 'Member'),
      department: m.department || (m.user ? m.user.department : ''),
      college: m.college || (m.user ? m.user.institutionName : ''),
      role: m.roleName || (m.isLeader ? 'Team Leader' : 'Contributor'),
      avatar: m.user ? (m.user.avatarUrl || '') : '',
      verified: m.user ? Boolean(m.user.verifiedStudent) : true,
      isLeader: Boolean(m.isLeader),
      studentId: m.studentId || (m.user ? m.user.studentId : undefined),
      email: m.email || (m.user ? m.user.email : undefined),
      mobile: m.mobile || (m.user ? m.user.mobile : undefined)
    })),
    maxMembers: team.maxMembers || 6,
    requiredRoles: Array.isArray(team.requiredRoles) ? team.requiredRoles : [],
    status: team.status || 'forming',
    mentorId: team.mentorId || undefined,
    mentorName: team.mentor ? team.mentor.name : undefined,
    mentorStatus: team.mentorStatus || 'none',
    createdAt: team.createdAt ? new Date(team.createdAt).toISOString() : new Date().toISOString(),
    eventId: team.eventId || undefined,
    eventTitle: team.eventTitle || undefined
  };
}

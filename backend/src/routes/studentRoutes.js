import { sendJson, parseJsonBody } from '../utils/http.js';

/**
 * Handles Student Profiles & Academic Onboarding Routes
 */
export async function handleStudentRoutes({ req, res, pathname, authenticateSession, isPrismaConnected, prisma, usersDb, mentorshipRequestsDb }) {
  if (pathname.startsWith('/api/students/')) {
    const targetStudentId = pathname.replace('/api/students/', '');
    const auth = await authenticateSession(req);
    if (!auth) {
      sendJson(res, 401, { error: 'Authentication required to access student records.' });
      return true;
    }

    let student = usersDb.find(u => u.id === targetStudentId);

    // If not found in memory, try Prisma database lookup
    if (!student && isPrismaConnected && prisma) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { id: targetStudentId } });
        if (dbUser) {
          student = {
            id: dbUser.id,
            email: dbUser.email,
            mobile: dbUser.mobile,
            name: dbUser.name,
            roles: Array.isArray(dbUser.roles) ? dbUser.roles : [dbUser.activeRole || 'STUDENT'],
            activeRole: dbUser.activeRole || 'STUDENT',
            institution: dbUser.institutionName || 'Academic Network',
            department: dbUser.department || 'Engineering',
            course: dbUser.course || 'B.Tech',
            year: dbUser.year || '3rd Year',
            studentId: dbUser.studentId || '',
            bio: dbUser.bio || '',
            skills: Array.isArray(dbUser.skills) ? dbUser.skills : [],
            avatar: dbUser.avatarUrl || '',
            verified: Boolean(dbUser.verifiedStudent || dbUser.status === 'ACTIVE')
          };
          usersDb.push(student);
        }
      } catch (e) {
        console.warn('[Prisma] Student lookup notice:', e.message);
      }
    }

    if (!student) {
      sendJson(res, 404, { error: 'Student record not found.' });
      return true;
    }

    if (req.method === 'GET') {
      const isSelf = auth.user.id === targetStudentId;
      const isSuperAdmin = auth.user.activeRole === 'SUPER_ADMIN';
      const isAssignedMentor = auth.user.activeRole === 'MENTOR' && 
        mentorshipRequestsDb.some(r => r.mentorId === auth.user.id && r.studentId === targetStudentId && r.status === 'accepted');

      if (isSelf || isSuperAdmin || isAssignedMentor) {
        sendJson(res, 200, { student });
      } else {
        // Sanitize sensitive contact fields for third parties
        sendJson(res, 200, {
          student: {
            id: student.id,
            name: student.name,
            institution: student.institution,
            department: student.department,
            course: student.course,
            year: student.year,
            skills: student.skills,
            bio: student.bio,
            verified: student.verified
          }
        });
      }
      return true;
    }

    if (req.method === 'PUT') {
      // Horizontal Privilege Escalation Prevention
      if (auth.user.id !== targetStudentId && auth.user.activeRole !== 'SUPER_ADMIN') {
        sendJson(res, 403, { 
          error: 'Access Denied: Horizontal privilege escalation blocked. You can only edit your own student record.' 
        });
        return true;
      }

      const body = await parseJsonBody(req);
      
      // Update in-memory record
      if (body.name) student.name = body.name.trim();
      if (body.bio !== undefined) student.bio = body.bio;
      if (body.institution) student.institution = body.institution.trim();
      if (body.department) student.department = body.department.trim();
      if (body.course) student.course = body.course.trim();
      if (body.year) student.year = body.year.trim();
      if (body.studentId) student.studentId = body.studentId.trim();
      if (Array.isArray(body.skills)) student.skills = body.skills;
      if (body.avatar) student.avatar = body.avatar;
      if (body.socialLinks) student.socialLinks = body.socialLinks;
      if (body.linkedin) student.linkedin = body.linkedin;
      if (body.github) student.github = body.github;
      student.onboarded = true;

      // Sync to Neon PostgreSQL
      if (isPrismaConnected && prisma) {
        try {
          await prisma.user.update({
            where: { id: targetStudentId },
            data: {
              name: student.name,
              bio: student.bio,
              institutionName: student.institution,
              department: student.department,
              course: student.course,
              year: student.year,
              studentId: student.studentId,
              avatarUrl: student.avatar || undefined,
              updatedAt: new Date()
            }
          });
          console.log(`[Prisma] ✅ Synchronized updated student profile for ${student.email}`);
        } catch (e) {
          console.warn('[Prisma] Student profile update notice:', e.message);
        }
      }

      sendJson(res, 200, { 
        success: true, 
        message: 'Student academic profile successfully updated and synchronized.', 
        student 
      });
      return true;
    }
  }

  return false;
}

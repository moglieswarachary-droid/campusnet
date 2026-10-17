export type PortalType = 
  | 'gateway'
  | 'student'
  | 'mentor'
  | 'researcher'
  | 'organizer'
  | 'admin'
  | 'public';

export const getPortalFromEnvironment = (pathname: string, search: string): PortalType => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const cleanPath = pathname.toLowerCase();
  const cleanSearch = search.toLowerCase();

  // Subdomain routing in production
  if (hostname.startsWith('organizer.') || hostname === 'organizer.campusnet.in') {
    return 'organizer';
  }
  if (hostname.startsWith('admin.') || hostname === 'admin.campusnet.in') {
    return 'admin';
  }
  if (hostname.startsWith('student.')) {
    return 'student';
  }
  if (hostname.startsWith('mentor.')) {
    return 'mentor';
  }
  if (hostname.startsWith('researcher.')) {
    return 'researcher';
  }

  // 1. Dedicated RBAC Gateway Route (entry point before landing page)
  if (cleanPath === '/' || cleanPath === '/gateway') {
    return 'gateway';
  }

  // 2. Student Portal Namespace
  if (cleanPath.startsWith('/student')) {
    return 'student';
  }

  // 3. Mentor Portal Namespace
  if (cleanPath.startsWith('/mentor')) {
    return 'mentor';
  }

  // 4. Research Portal Namespace (canonical /research/login as well as /researcher and /scholar)
  if (
    cleanPath === '/research/login' ||
    cleanPath.startsWith('/research/login/') ||
    cleanPath.startsWith('/researcher') || 
    cleanPath.startsWith('/scholar')
  ) {
    return 'researcher';
  }

  // 5. Organization & Event Manager Portal Namespace
  if (
    cleanPath.startsWith('/organization') ||
    cleanPath.startsWith('/organizer') || 
    cleanPath.startsWith('/event-manager') ||
    cleanPath.startsWith('/portal/organizer') || 
    cleanSearch.includes('portal=organizer')
  ) {
    return 'organizer';
  }

  // 6. Admin, Platform Reviewer & Super Admin Portal Namespace
  if (
    cleanPath.startsWith('/admin') || 
    cleanPath.startsWith('/super-admin') ||
    cleanPath.startsWith('/reviewer') ||
    cleanPath.startsWith('/portal/admin') || 
    cleanSearch.includes('portal=admin')
  ) {
    return 'admin';
  }

  // 7. Shared CampusNet+ Ecosystem (public landing, events, projects, mentors, research hub, etc.)
  return 'public';
};

import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingFallback } from '../common/LoadingFallback';

export type PortalType = 'public' | 'organizer' | 'admin';

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

  // Path or query param routing in local development / testing / direct URLs
  if (
    cleanPath.startsWith('/organizer') || 
    cleanPath.startsWith('/portal/organizer') || 
    cleanSearch.includes('portal=organizer')
  ) {
    return 'organizer';
  }

  if (
    cleanPath.startsWith('/admin') || 
    cleanPath.startsWith('/portal/admin') || 
    cleanSearch.includes('portal=admin')
  ) {
    return 'admin';
  }

  return 'public';
};

interface PortalRouterProps {
  publicApp: React.ReactNode;
  organizerApp: React.ReactNode;
  adminApp: React.ReactNode;
}

export const PortalRouter: React.FC<PortalRouterProps> = ({ publicApp, organizerApp, adminApp }) => {
  const location = useLocation();
  const activePortal = getPortalFromEnvironment(location.pathname, location.search);

  return (
    <Suspense fallback={<LoadingFallback message="Loading Portal..." />}>
      {activePortal === 'public' && publicApp}
      {activePortal === 'organizer' && organizerApp}
      {activePortal === 'admin' && adminApp}
    </Suspense>
  );
};

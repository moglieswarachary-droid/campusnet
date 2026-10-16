import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingFallback } from '../common/LoadingFallback';
import { ErrorBoundary } from '../common/ErrorBoundary';

import { getPortalFromEnvironment, type PortalType } from '../../utils/portalRouting.ts';
export { getPortalFromEnvironment };
export type { PortalType };

interface PortalRouterProps {
  gatewayApp: React.ReactNode;
  studentApp: React.ReactNode;
  mentorApp: React.ReactNode;
  researcherApp: React.ReactNode;
  organizerApp: React.ReactNode;
  adminApp: React.ReactNode;
  publicApp: React.ReactNode;
}

export const PortalRouter: React.FC<PortalRouterProps> = ({ 
  gatewayApp,
  studentApp,
  mentorApp,
  researcherApp,
  organizerApp, 
  adminApp,
  publicApp
}) => {
  const location = useLocation();
  const activePortal = getPortalFromEnvironment(location.pathname, location.search);

  return (
    <ErrorBoundary fallbackMessage="The portal workspace could not be loaded. Please reload to restore your session.">
      <Suspense fallback={<LoadingFallback message="Loading Workspace..." />}>
        {activePortal === 'gateway' && gatewayApp}
        {activePortal === 'student' && studentApp}
        {activePortal === 'mentor' && mentorApp}
        {activePortal === 'researcher' && researcherApp}
        {activePortal === 'organizer' && organizerApp}
        {activePortal === 'admin' && adminApp}
        {activePortal === 'public' && publicApp}
      </Suspense>
    </ErrorBoundary>
  );
};

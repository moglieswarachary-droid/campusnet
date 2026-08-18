import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export type PortalType = 'public' | 'organizer' | 'admin';

export const getInitialPortal = (): PortalType => {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Subdomain routing in production
  if (hostname.startsWith('organizer.') || hostname === 'organizer.campusnet.in') {
    return 'organizer';
  }
  if (hostname.startsWith('admin.') || hostname === 'admin.campusnet.in') {
    return 'admin';
  }

  // Path or query param routing in local development / testing
  if (pathname.startsWith('/organizer') || search.includes('portal=organizer')) {
    return 'organizer';
  }
  if (pathname.startsWith('/admin') || search.includes('portal=admin')) {
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
  const [activePortal, setActivePortal] = useState<PortalType>(getInitialPortal());
  const [showDevSwitcher, setShowDevSwitcher] = useState(false);

  // Listen to popstate / url changes
  useEffect(() => {
    const handleLocationChange = () => {
      setActivePortal(getInitialPortal());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToPortal = (portal: PortalType) => {
    setActivePortal(portal);
    
    // Update browser URL smoothly without reloading
    const url = new URL(window.location.href);
    if (portal === 'public') {
      url.searchParams.delete('portal');
      if (url.pathname.startsWith('/organizer') || url.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''));
      }
    } else {
      url.searchParams.set('portal', portal);
      window.history.pushState({}, '', `?portal=${portal}`);
    }
  };

  return (
    <>
      {/* Active Portal Body */}
      {activePortal === 'public' && publicApp}
      {activePortal === 'organizer' && organizerApp}
      {activePortal === 'admin' && adminApp}
    </>
  );
};

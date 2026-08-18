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

      {/* Unobtrusive Development URL Switcher Dock (For testing separate subdomain URLs locally) */}
      <div className="fixed bottom-2 right-2 z-50 text-[11px] font-sans print:hidden">
        {showDevSwitcher ? (
          <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md space-y-2 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-1.5">
              <span className="font-bold text-amber-300">⚙ Development Portal Switcher</span>
              <button 
                onClick={() => setShowDevSwitcher(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-slate-300">
              In production, each portal is mapped to its dedicated subdomain:
            </p>
            <div className="space-y-1">
              <button
                onClick={() => navigateToPortal('public')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                  activePortal === 'public' ? 'bg-blue-600 font-bold text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>https://campusnet.in</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-black/30 rounded">Public</span>
              </button>

              <button
                onClick={() => navigateToPortal('organizer')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                  activePortal === 'organizer' ? 'bg-amber-600 font-bold text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>https://organizer.campusnet.in</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-black/30 rounded">Organizer</span>
              </button>

              <button
                onClick={() => navigateToPortal('admin')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                  activePortal === 'admin' ? 'bg-red-600 font-bold text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>https://admin.campusnet.in</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-black/30 rounded">Super Admin</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDevSwitcher(true)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shadow-warm-md flex items-center gap-1.5"
            title="Switch portal destination"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono">
              {activePortal === 'public' ? 'campusnet.in' : activePortal === 'organizer' ? 'organizer.campusnet.in' : 'admin.campusnet.in'}
            </span>
          </button>
        )}
      </div>
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SuperAdminAuthView } from './SuperAdminAuthView';
import { SuperAdminLayout, SuperAdminTab } from './SuperAdminLayout';
import { SuperAdminDashboardView } from './SuperAdminDashboardView';
import { SuperAdminEventModeration } from './SuperAdminEventModeration';
import { SuperAdminInstitutionManager } from './SuperAdminInstitutionManager';
import { SuperAdminUserModerator } from './SuperAdminUserModerator';
import { SuperAdminCertificateAuditor } from './SuperAdminCertificateAuditor';
import { SuperAdminAnalyticsView } from './SuperAdminAnalyticsView';
import { SuperAdminAuditLogsView } from './SuperAdminAuditLogsView';
import { ToastContainer } from '../common/Toast';

export const SuperAdminApp: React.FC = () => {
  const { currentSuperAdmin } = useApp();

  const getInitialSection = (): SuperAdminTab => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('/admin/organizations') || path.includes('/admin/institutions') || search.includes('section=organizations')) {
        return 'institutions';
      }
      if (path.includes('/admin/events') || search.includes('section=events')) {
        return 'events_moderation';
      }
      if (path.includes('/admin/users')) return 'users';
      if (path.includes('/admin/certificates')) return 'certificates_audit';
      if (path.includes('/admin/analytics')) return 'analytics';
      if (path.includes('/admin/logs')) return 'audit_logs';
    }
    return 'dashboard';
  };

  const [activeSection, setActiveSection] = useState<SuperAdminTab>(getInitialSection);

  const handleSectionChange = (section: SuperAdminTab) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      const sectionPathMap: Record<SuperAdminTab, string> = {
        dashboard: '/admin',
        events_moderation: '/admin/events',
        institutions: '/admin/organizations',
        users: '/admin/users',
        certificates_audit: '/admin/certificates',
        analytics: '/admin/analytics',
        audit_logs: '/admin/logs'
      };
      const targetPath = sectionPathMap[section] || '/admin';
      window.history.pushState(null, '', targetPath);
    }
  };

  // If not authenticated as Super Admin, render the master login console
  if (!currentSuperAdmin) {
    return (
      <>
        <SuperAdminAuthView />
        <ToastContainer />
      </>
    );
  }

  return (
    <SuperAdminLayout activeSection={activeSection} setActiveSection={handleSectionChange}>
      {activeSection === 'dashboard' && <SuperAdminDashboardView setActiveSection={handleSectionChange} />}
      {activeSection === 'events_moderation' && <SuperAdminEventModeration />}
      {activeSection === 'institutions' && <SuperAdminInstitutionManager />}
      {activeSection === 'users' && <SuperAdminUserModerator />}
      {activeSection === 'certificates_audit' && <SuperAdminCertificateAuditor />}
      {activeSection === 'analytics' && <SuperAdminAnalyticsView />}
      {activeSection === 'audit_logs' && <SuperAdminAuditLogsView />}
      
      <ToastContainer />
    </SuperAdminLayout>
  );
};

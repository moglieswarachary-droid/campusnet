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
  const [activeSection, setActiveSection] = useState<SuperAdminTab>('dashboard');

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
    <SuperAdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === 'dashboard' && <SuperAdminDashboardView setActiveSection={setActiveSection} />}
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

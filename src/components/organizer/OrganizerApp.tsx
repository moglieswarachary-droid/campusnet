import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerAuthView } from './OrganizerAuthView';
import { OrganizerLayout, OrganizerTab } from './OrganizerLayout';
import { OrganizerDashboardView } from './OrganizerDashboardView';
import { EventCreationWizard } from './EventCreationWizard';
import { EventLifecycleManager } from './EventLifecycleManager';
import { OrganizationVerificationStatusView } from './OrganizationVerificationStatusView';
import { ParticipantManagementView } from './ParticipantManagementView';
import { AttendanceQRScannerView } from './AttendanceQRScannerView';
import { ProjectSubmissionsView } from './ProjectSubmissionsView';
import { JudgingManagementView } from './JudgingManagementView';
import { JudgeScoringPortal } from './JudgeScoringPortal';
import { WinnerManagementView } from './WinnerManagementView';
import { CertificateManagementCenter } from './CertificateManagementCenter';
import { EventAnnouncementsView } from './EventAnnouncementsView';
import { EventReportsView } from './EventReportsView';
import { OrganizerProfileView } from './OrganizerProfileView';
import { ToastContainer } from '../common/Toast';

export const OrganizerApp: React.FC = () => {
  const { currentOrganizer } = useApp();

  const getInitialSection = (): OrganizerTab => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path.includes('/verify') || search.includes('section=verify')) return 'verify';
      if (path.includes('/create') || search.includes('section=create')) return 'create_event';
      if (path.includes('/events')) return 'events';
      if (path.includes('/registrations')) return 'registrations';
      if (path.includes('/attendance')) return 'attendance';
      if (path.includes('/submissions')) return 'submissions';
      if (path.includes('/judges')) return 'judges';
      if (path.includes('/certificates')) return 'certificates';
      if (path.includes('/reports')) return 'reports';
      if (path.includes('/profile')) return 'profile';
    }
    return 'dashboard';
  };

  const [activeSection, setActiveSection] = useState<OrganizerTab>(getInitialSection);

  // When organizer logs in, ensure URL and view transition smoothly to events workspace
  useEffect(() => {
    if (currentOrganizer && typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/login') || path.includes('/register') || path === '/organization' || path === '/organization/') {
        window.history.pushState(null, '', '/organization/events');
        setActiveSection('events');
      }
    }
  }, [currentOrganizer]);

  // Sync URL when section changes
  const handleSectionChange = (section: OrganizerTab) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      const sectionPathMap: Record<OrganizerTab, string> = {
        dashboard: '/organization/events',
        events: '/organization/events',
        create_event: '/organization/events/create',
        verify: '/organization/verify',
        registrations: '/organization/registrations',
        attendance: '/organization/attendance',
        submissions: '/organization/submissions',
        judges: '/organization/judges',
        judge_portal: '/organization/judges/portal',
        winners: '/organization/winners',
        certificates: '/organization/certificates',
        announcements: '/organization/announcements',
        reports: '/organization/reports',
        profile: '/organization/profile'
      };

      const targetPath = sectionPathMap[section] || '/organization/events';
      window.history.pushState(null, '', targetPath);
    }
  };

  // If not logged in as organizer, show dedicated institutional login or registration
  if (!currentOrganizer) {
    const isRegisterRoute = typeof window !== 'undefined' && (
      window.location.pathname.toLowerCase().includes('/register') ||
      window.location.search.toLowerCase().includes('action=register')
    );

    return (
      <>
        <OrganizerAuthView initialMode={isRegisterRoute ? 'register' : 'login'} />
        <ToastContainer />
      </>
    );
  }

  return (
    <OrganizerLayout activeSection={activeSection} setActiveSection={handleSectionChange}>
      {activeSection === 'dashboard' && <OrganizerDashboardView setActiveSection={handleSectionChange} />}
      {activeSection === 'events' && <EventLifecycleManager setActiveSection={handleSectionChange} />}
      {activeSection === 'create_event' && <EventCreationWizard setActiveSection={handleSectionChange} />}
      {activeSection === 'verify' && <OrganizationVerificationStatusView onProceedToDashboard={() => handleSectionChange('dashboard')} />}
      {activeSection === 'registrations' && <ParticipantManagementView />}
      {activeSection === 'attendance' && <AttendanceQRScannerView />}
      {activeSection === 'submissions' && <ProjectSubmissionsView />}
      {activeSection === 'judges' && <JudgingManagementView />}
      {activeSection === 'judge_portal' && <JudgeScoringPortal />}
      {activeSection === 'winners' && <WinnerManagementView setActiveSection={handleSectionChange} />}
      {activeSection === 'certificates' && <CertificateManagementCenter />}
      {activeSection === 'announcements' && <EventAnnouncementsView />}
      {activeSection === 'reports' && <EventReportsView />}
      {activeSection === 'profile' && <OrganizerProfileView />}
      
      <ToastContainer />
    </OrganizerLayout>
  );
};

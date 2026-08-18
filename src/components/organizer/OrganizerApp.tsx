import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerAuthView } from './OrganizerAuthView';
import { OrganizerLayout, OrganizerTab } from './OrganizerLayout';
import { OrganizerDashboardView } from './OrganizerDashboardView';
import { EventCreationWizard } from './EventCreationWizard';
import { EventLifecycleManager } from './EventLifecycleManager';
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
  const [activeSection, setActiveSection] = useState<OrganizerTab>('dashboard');

  // If not logged in as organizer, show dedicated institutional login
  if (!currentOrganizer) {
    return (
      <>
        <OrganizerAuthView />
        <ToastContainer />
      </>
    );
  }

  return (
    <OrganizerLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === 'dashboard' && <OrganizerDashboardView setActiveSection={setActiveSection} />}
      {activeSection === 'events' && <EventLifecycleManager setActiveSection={setActiveSection} />}
      {activeSection === 'create_event' && <EventCreationWizard setActiveSection={setActiveSection} />}
      {activeSection === 'registrations' && <ParticipantManagementView />}
      {activeSection === 'attendance' && <AttendanceQRScannerView />}
      {activeSection === 'submissions' && <ProjectSubmissionsView />}
      {activeSection === 'judges' && <JudgingManagementView />}
      {activeSection === 'judge_portal' && <JudgeScoringPortal />}
      {activeSection === 'winners' && <WinnerManagementView setActiveSection={setActiveSection} />}
      {activeSection === 'certificates' && <CertificateManagementCenter />}
      {activeSection === 'announcements' && <EventAnnouncementsView />}
      {activeSection === 'reports' && <EventReportsView />}
      {activeSection === 'profile' && <OrganizerProfileView />}
      
      <ToastContainer />
    </OrganizerLayout>
  );
};

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
import { OrganizationMembersView } from './OrganizationMembersView';
import { OrganizationNotificationsView } from './OrganizationNotificationsView';
import { OrganizationSettingsView } from './OrganizationSettingsView';
import { ToastContainer } from '../common/Toast';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const OrganizerApp: React.FC = () => {
  const { currentOrganizer, addToast } = useApp();

  // Parse path for scoped event IDs (e.g. /organization/events/:eventId or /organization/events/:eventId/registrations)
  const getScopedEventId = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    const match = window.location.pathname.match(/\/organization\/events\/([a-zA-Z0-9_-]+)/);
    if (match && match[1] && match[1] !== 'create') {
      return match[1];
    }
    return undefined;
  };

  const [scopedEventId, setScopedEventId] = useState<string | undefined>(getScopedEventId);

  const getInitialSection = (): OrganizerTab => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      // If pending organization, guide them to verification tracking first
      if (currentOrganizer && currentOrganizer.verificationStatus !== 'verified' && (path === '/organization' || path === '/organization/' || path.includes('/dashboard'))) {
        return 'verify';
      }

      if (path.includes('/verification') || path.includes('/verify') || search.includes('section=verify')) return 'verify';
      if (path.includes('/create') || search.includes('section=create')) return 'create_event';
      if (path.includes('/members')) return 'members';
      if (path.includes('/notifications')) return 'notifications';
      if (path.includes('/settings')) return 'settings';
      if (path.includes('/announcements')) return 'announcements';
      if (path.includes('/registrations')) return 'registrations';
      if (path.includes('/attendance')) return 'attendance';
      if (path.includes('/submissions')) return 'submissions';
      if (path.includes('/judges/portal')) return 'judge_portal';
      if (path.includes('/judges')) return 'judges';
      if (path.includes('/winners')) return 'winners';
      if (path.includes('/certificates')) return 'certificates';
      if (path.includes('/reports')) return 'reports';
      if (path.includes('/profile')) return 'profile';
      if (path.includes('/events')) return 'events';
      if (path.includes('/dashboard')) return 'dashboard';
    }
    return currentOrganizer?.verificationStatus === 'verified' ? 'dashboard' : 'verify';
  };

  const [activeSection, setActiveSection] = useState<OrganizerTab>(getInitialSection);

  // Sync URL when section changes
  const handleSectionChange = (section: OrganizerTab) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      const sectionPathMap: Record<OrganizerTab, string> = {
        dashboard: '/organization/dashboard',
        events: '/organization/events',
        create_event: '/organization/events/create',
        verify: '/organization/verification',
        registrations: '/organization/registrations',
        attendance: '/organization/attendance',
        submissions: '/organization/submissions',
        judges: '/organization/judges',
        judge_portal: '/organization/judges/portal',
        winners: '/organization/winners',
        certificates: '/organization/certificates',
        announcements: '/organization/announcements',
        reports: '/organization/reports',
        profile: '/organization/profile',
        members: '/organization/members',
        notifications: '/organization/notifications',
        settings: '/organization/settings'
      };

      const targetPath = sectionPathMap[section] || '/organization/dashboard';
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

  // Verification guard: If pending organizer tries to create an event directly
  const isUnverified = currentOrganizer.verificationStatus !== 'verified';
  const showVerificationGate = activeSection === 'create_event' && isUnverified;

  return (
    <OrganizerLayout activeSection={activeSection} setActiveSection={handleSectionChange}>
      {/* Pending Institutional Verification Banner */}
      {isUnverified && activeSection !== 'verify' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <p className="text-xs font-bold">Institutional Verification In Progress</p>
              <p className="text-[11px] text-amber-700">Your AISHE/UGC accreditation is under review. Event drafts can be prepared, but publishing requires verified status.</p>
            </div>
          </div>
          <button
            onClick={() => handleSectionChange('verify')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold self-start sm:self-auto shrink-0 transition-colors"
          >
            <span>View Audit Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Section Content */}
      {activeSection === 'dashboard' && <OrganizerDashboardView setActiveSection={handleSectionChange} />}
      {activeSection === 'events' && <EventLifecycleManager setActiveSection={handleSectionChange} />}
      {activeSection === 'create_event' && (
        showVerificationGate ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto my-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Institutional Verification Required</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To host and publish nationwide academic events on CampusNet+, your college must complete AISHE verification. Review typical turnaround is 24-48 business hours.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => handleSectionChange('verify')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
              >
                Go to Verification Center
              </button>
              <button
                onClick={() => handleSectionChange('events')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Return to Events
              </button>
            </div>
          </div>
        ) : (
          <EventCreationWizard setActiveSection={handleSectionChange} />
        )
      )}
      {activeSection === 'verify' && <OrganizationVerificationStatusView onProceedToDashboard={() => handleSectionChange('dashboard')} />}
      {activeSection === 'registrations' && <ParticipantManagementView initialEventId={scopedEventId} />}
      {activeSection === 'attendance' && <AttendanceQRScannerView />}
      {activeSection === 'submissions' && <ProjectSubmissionsView />}
      {activeSection === 'judges' && <JudgingManagementView />}
      {activeSection === 'judge_portal' && <JudgeScoringPortal />}
      {activeSection === 'winners' && <WinnerManagementView setActiveSection={handleSectionChange} />}
      {activeSection === 'certificates' && <CertificateManagementCenter />}
      {activeSection === 'announcements' && <EventAnnouncementsView />}
      {activeSection === 'reports' && <EventReportsView />}
      {activeSection === 'profile' && <OrganizerProfileView />}
      {activeSection === 'members' && <OrganizationMembersView />}
      {activeSection === 'notifications' && <OrganizationNotificationsView />}
      {activeSection === 'settings' && <OrganizationSettingsView />}
      
      <ToastContainer />
    </OrganizerLayout>
  );
};

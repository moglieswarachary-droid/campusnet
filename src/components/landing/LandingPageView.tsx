import React from 'react';
import { HeroSection } from './HeroSection';
import { InstitutionsTicker } from './InstitutionsTicker';
import { HackathonsSection } from './HackathonsSection';
import { GovtChallengesSection } from './GovtChallengesSection';
import { MentorMatchingSection } from './MentorMatchingSection';
import { ProjectsExplorerSection } from './ProjectsExplorerSection';
import { ResearchNetworkSection } from './ResearchNetworkSection';
import { TeamMatchingSection } from './TeamMatchingSection';
import { CampusAIPromotion } from './CampusAIPromotion';
import { StoriesSection } from './StoriesSection';
import { CTASection } from './CTASection';

export const LandingPageView: React.FC = () => {
  return (
    <div className="w-full flex flex-col animate-in fade-in duration-300">
      {/* 1. Hero & Role Authentication Gateway */}
      <HeroSection />

      {/* 2. Accredited Institutions Ticker */}
      <InstitutionsTicker />

      {/* 3. Live Hackathons & Competitions */}
      <HackathonsSection />

      {/* 4. Government & Ministry Challenges */}
      <GovtChallengesSection />

      {/* 5. Multidimensional Mentor Matching */}
      <MentorMatchingSection />

      {/* 6. Interdisciplinary Student Projects Explorer */}
      <ProjectsExplorerSection />

      {/* 7. Research Hub & PhD Scholars */}
      <ResearchNetworkSection />

      {/* 8. 6-Member Team Formation Matrix */}
      <TeamMatchingSection />

      {/* 9. Campus AI Assistant Showcase */}
      <CampusAIPromotion />

      {/* 10. Student Video Demo Reels & Stories */}
      <StoriesSection />

      {/* 11. National Call to Action */}
      <CTASection />
    </div>
  );
};

export default LandingPageView;

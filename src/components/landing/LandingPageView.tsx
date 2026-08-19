import React from 'react';
import { HeroSection } from './HeroSection';
import { InstitutionsTicker } from './InstitutionsTicker';
import { EcosystemPillarsSection } from './EcosystemPillarsSection';
import { LiveSpotlightSection } from './LiveSpotlightSection';
import { CTASection } from './CTASection';

export const LandingPageView: React.FC = () => {
  return (
    <div className="w-full flex flex-col animate-in fade-in duration-300">
      {/* 1. Hero & Role Authentication Gateway + Primary Quick Actions */}
      <HeroSection />

      {/* 2. Accredited Institutional Network Ticker */}
      <InstitutionsTicker />

      {/* 3. The 6 Core Innovation Hubs with Direct Redirect Buttons */}
      <EcosystemPillarsSection />

      {/* 4. Live Ecosystem Spotlight (Top Hackathon, Mentor & Project) */}
      <LiveSpotlightSection />

      {/* 5. Streamlined National Call to Action */}
      <CTASection />
    </div>
  );
};

export default LandingPageView;

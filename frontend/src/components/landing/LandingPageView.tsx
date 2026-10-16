import React from 'react';
import { HeroSection } from './HeroSection';
import { InstitutionsTicker } from './InstitutionsTicker';
import { TrendingSection } from './TrendingSection';
import { CTASection } from './CTASection';

export const LandingPageView: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-white animate-in fade-in duration-200">
      {/* 1. Clean Centered Hero with Search, Workspace Selector & 4 Feature Cards */}
      <HeroSection />

      {/* 2. Accredited Higher Education Institutions Ticker */}
      <InstitutionsTicker />

      {/* 3. Trending on CampusNet (Upcoming Events, Recent Projects, Mentors) */}
      <TrendingSection />

      {/* 4. Streamlined Call to Action */}
      <CTASection />
    </div>
  );
};

export default LandingPageView;

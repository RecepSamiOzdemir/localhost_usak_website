import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { Manifesto } from '../components/home/Manifesto';
import { ValuesBento } from '../components/home/ValuesBento';
import { PersonaCards } from '../components/home/PersonaCards';
import { EventSpotlight } from '../components/home/EventSpotlight';
import { FlowSteps } from '../components/home/FlowSteps';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { StatsSection } from '../components/home/StatsSection';
import { BigCTA } from '../components/home/BigCTA';

export const HomePage: React.FC = () => {
  return (
    <main>
      {/* 1. Karşılama */}
      <HeroSection />
      {/* 2. Misyon Vizyon */}
      <Manifesto />
      {/* 3. Değerlerimiz */}
      <ValuesBento />
      {/* 4. Kimler Katılabilir */}
      <PersonaCards />
      {/* 5. Buluşma Takvimi */}
      <EventSpotlight />
      {/* 6. Buluşma Formatı */}
      <FlowSteps />
      {/* 7. Sponsorlarımız */}
      <SponsorsSection />
      {/* 8. Scoreboard */}
      <StatsSection />
      {/* 9. Hemen aramıza katıl */}
      <BigCTA />
    </main>
  );
};

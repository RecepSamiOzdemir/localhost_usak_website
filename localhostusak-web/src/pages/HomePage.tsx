import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { EventSpotlight } from '../components/home/EventSpotlight';
import { Manifesto } from '../components/home/Manifesto';
import { PersonaCards } from '../components/home/PersonaCards';
import { FlowSteps } from '../components/home/FlowSteps';
import { ValuesBento } from '../components/home/ValuesBento';
import { StatsSection } from '../components/home/StatsSection';
import { BigCTA } from '../components/home/BigCTA';

export const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <EventSpotlight />
      <Manifesto />
      <PersonaCards />
      <FlowSteps />
      <ValuesBento />
      <StatsSection />
      <BigCTA />
    </main>
  );
};

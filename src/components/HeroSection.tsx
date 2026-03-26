import React from 'react';
import CircuitBackground from './CircuitBackground';

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string; // Allow custom styling/height
}

const HeroSection: React.FC<HeroSectionProps> = ({ children, className = '' }) => {
  return (
    <section className={`relative w-full flex items-center justify-center overflow-hidden bg-[#0D0505] ${className}`}>
      {/* Absolute Background Layer */}
      <CircuitBackground />
      
      {/* Relative Content Layer */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        {children}
      </div>
    </section>
  );
};

export default HeroSection;

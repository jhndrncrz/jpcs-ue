import React from 'react';
import GridBackground from './GridBackground';

interface GradientSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const GradientSection: React.FC<GradientSectionProps> = ({ children, className = '', id }) => {
  return (
    <section id={id} className={`relative w-full py-20 ${className}`}>
      {/* Absolute Background Layer */}
      <GridBackground />
      
      {/* Relative Content Layer */}
      <div className="relative z-10 container mx-auto px-6">
        {children}
      </div>
    </section>
  );
};

export default GradientSection;

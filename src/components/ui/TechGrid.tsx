import React from 'react';

const TechGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="tech-grid-bg opacity-30 w-full h-full" />
    </div>
  );
};

export default TechGrid;

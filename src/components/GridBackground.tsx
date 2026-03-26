import React from 'react';

/**
 * Grid Background
 * Simple grid overlay for content sections.
 * Absolute positioning.
 */
const GridBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 0 }}
    >
      {/* Solid background color from theme */}
      <div className="absolute inset-0 bg-[var(--background)]" />

      {/* Major Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Minor Grid (Finer detail) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />
    </div>
  );
};

export default GridBackground;

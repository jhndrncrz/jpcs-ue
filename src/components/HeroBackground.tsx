import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface HeroBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface CircuitPath {
  d: string;
  delay: number;
  startOffset: { x: number; y: number };
  endOffset: { x: number; y: number };
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ className = '', style, children }) => {
  const { theme } = useTheme();
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Vibrant circuit line colors
  const colors = isDark 
    ? ['#FF6B6B', '#FFA94D', '#FFE066', '#FFFFFF']
    : ['#DC3545', '#FD7E14', '#FFC107', '#FFFFFF'];

  // Circuit paths with offset data for donut positioning
  // Offsets push the donut PAST the line endpoint
  const paths: CircuitPath[] = [
    // Left side paths
    { d: "M -8 100 L 100 100 L 100 180 L 200 180", delay: 0, startOffset: { x: -16, y: 0 }, endOffset: { x: 16, y: 0 } },
    { d: "M -8 220 L 80 220 L 80 300", delay: 0.15, startOffset: { x: -16, y: 0 }, endOffset: { x: 0, y: 16 } },
    { d: "M -8 350 L 60 350 L 60 450 L 150 450", delay: 0.3, startOffset: { x: -16, y: 0 }, endOffset: { x: 16, y: 0 } },
    
    // Top paths
    { d: "M 400 -8 L 400 80 L 480 80 L 480 160", delay: 0.1, startOffset: { x: 0, y: -16 }, endOffset: { x: 0, y: 16 } },
    { d: "M 640 -8 L 640 60 L 560 60", delay: 0.25, startOffset: { x: 0, y: -16 }, endOffset: { x: -16, y: 0 } },
    { d: "M 850 -8 L 850 100 L 950 100 L 950 180", delay: 0.05, startOffset: { x: 0, y: -16 }, endOffset: { x: 0, y: 16 } },
    
    // Right side paths
    { d: "M 1288 80 L 1180 80 L 1180 160 L 1100 160", delay: 0.2, startOffset: { x: 16, y: 0 }, endOffset: { x: -16, y: 0 } },
    { d: "M 1288 220 L 1200 220 L 1200 320", delay: 0.35, startOffset: { x: 16, y: 0 }, endOffset: { x: 0, y: 16 } },
    { d: "M 1288 400 L 1150 400 L 1150 500 L 1050 500", delay: 0.15, startOffset: { x: 16, y: 0 }, endOffset: { x: -16, y: 0 } },
    
    // Center decorative paths
    { d: "M 300 -8 L 300 120 L 380 120", delay: 0.4, startOffset: { x: 0, y: -16 }, endOffset: { x: 16, y: 0 } },
    { d: "M 1000 -8 L 1000 90 L 920 90 L 920 170", delay: 0.3, startOffset: { x: 0, y: -16 }, endOffset: { x: 0, y: 16 } },
  ];

  // Parse path to get start and end coordinates
  const getPathEndpoints = (d: string) => {
    const parts = d.split(' ');
    const startX = parseFloat(parts[1]);
    const startY = parseFloat(parts[2]);
    const endX = parseFloat(parts[parts.length - 2]);
    const endY = parseFloat(parts[parts.length - 1]);
    return { startX, startY, endX, endY };
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Rich Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at 30% 20%, #5C2323 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #4A1C1C 0%, transparent 50%), linear-gradient(135deg, #3D1515 0%, #2A1010 50%, #1F0D0D 100%)'
            : 'radial-gradient(ellipse at 20% 30%, #FFB347 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, #FF6B35 0%, transparent 40%), linear-gradient(135deg, #F5A623 0%, #E0683B 40%, #C53030 100%)',
        }}
      />

      {/* Animated Glow Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 20% 50%, rgba(207, 79, 81, 0.15) 0%, transparent 30%), radial-gradient(circle at 80% 30%, rgba(240, 138, 93, 0.1) 0%, transparent 25%)'
            : 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 25%)',
        }}
      />

      {/* Enhanced Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255, 107, 107, 0.08)' : 'rgba(255, 255, 255, 0.25)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255, 107, 107, 0.08)' : 'rgba(255, 255, 255, 0.25)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Secondary Grid (finer) for depth */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255, 107, 107, 0.03)' : 'rgba(255, 255, 255, 0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255, 107, 107, 0.03)' : 'rgba(255, 255, 255, 0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />
      
      {/* Circuit Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1280 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Shimmer gradient for lines */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="x1" from="-100%" to="100%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="200%" dur="3s" repeatCount="indefinite" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Stronger glow for hover */}
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((pathData, idx) => {
          const color = colors[idx % colors.length];
          const { startX, startY, endX, endY } = getPathEndpoints(pathData.d);
          const isHovered = hoveredLine === idx;
          
          // Calculate donut positions (PAST the line endpoints)
          const startDonutX = startX + pathData.startOffset.x;
          const startDonutY = startY + pathData.startOffset.y;
          const endDonutX = endX + pathData.endOffset.x;
          const endDonutY = endY + pathData.endOffset.y;

          return (
            <g 
              key={idx}
              className="circuit-group"
              onMouseEnter={() => setHoveredLine(idx)}
              onMouseLeave={() => setHoveredLine(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Start donut (hollow circle) - positioned BEFORE line start */}
              <circle 
                cx={startDonutX}
                cy={startDonutY}
                r="6" 
                fill="none"
                stroke={color}
                strokeWidth={3}
                filter={isHovered ? "url(#glow-strong)" : "url(#glow)"}
                style={{
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${startDonutX}px ${startDonutY}px`,
                }}
              />
              
              {/* Main Path with thicker stroke */}
              <path
                d={pathData.d}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? 4 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={isHovered ? "url(#glow-strong)" : "url(#glow)"}
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000,
                  animation: `draw-line 2s ease-out ${pathData.delay}s forwards`,
                  transition: 'stroke-width 0.3s ease',
                }}
              />
              
              {/* Shimmer overlay on path */}
              <path
                d={pathData.d}
                fill="none"
                stroke="url(#shimmer)"
                strokeWidth={isHovered ? 4 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000,
                  animation: `draw-line 2s ease-out ${pathData.delay}s forwards`,
                  opacity: 0.5,
                  mixBlendMode: 'overlay',
                }}
              />
              
              {/* End donut (hollow circle) - positioned PAST line end */}
              <circle 
                cx={endDonutX}
                cy={endDonutY}
                r="7" 
                fill="none"
                stroke={color}
                strokeWidth={3}
                filter={isHovered ? "url(#glow-strong)" : "url(#glow)"}
                style={{
                  opacity: 0,
                  animation: `fade-in 0.4s ease-out ${pathData.delay + 1.8}s forwards`,
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${endDonutX}px ${endDonutY}px`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Vignette for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fade-in {
          to {
            opacity: 1;
          }
        }
        .circuit-group:hover path {
          filter: url(#glow-strong);
        }
      `}</style>
    </div>
  );
};

export default HeroBackground;

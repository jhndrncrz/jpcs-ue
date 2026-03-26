import React from 'react';
import { motion } from 'framer-motion';

type ShapeType = 'square' | 'circle' | 'triangle' | 'square-outline' | 'circle-outline';

interface GridShapeProps {
  type: ShapeType;
  gridX: number; // Grid position (multiplied by 50px)
  gridY: number;
  size?: number;
  color?: string;
  delay?: number;
  className?: string;
}

const GridShape: React.FC<GridShapeProps> = ({
  type,
  gridX,
  gridY,
  size = 40,
  color = 'var(--circuit-line-1)',
  delay = 0,
  className = '',
}) => {
  const x = gridX * 50;
  const y = gridY * 50;

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      }
    },
  };

  const renderShape = () => {
    switch (type) {
      case 'square':
        return (
          <rect
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            fill={color}
            rx={4}
          />
        );
      case 'square-outline':
        return (
          <rect
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={2}
            rx={4}
          />
        );
      case 'circle':
        return (
          <circle
            cx={0}
            cy={0}
            r={size / 2}
            fill={color}
          />
        );
      case 'circle-outline':
        return (
          <circle
            cx={0}
            cy={0}
            r={size / 2}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
        );
      case 'triangle': {
        const h = size * 0.866;
        const points = `0,${-h / 2} ${-size / 2},${h / 2} ${size / 2},${h / 2}`;
        return (
          <polygon
            points={points}
            fill={color}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <motion.svg
      className={`absolute pointer-events-auto cursor-pointer ${className}`}
      style={{
        left: x,
        top: y,
        width: size + 20,
        height: size + 20,
        overflow: 'visible',
      }}
      viewBox={`${-size / 2 - 10} ${-size / 2 - 10} ${size + 20} ${size + 20}`}
      initial="hidden"
      animate="visible"
      variants={shapeVariants}
      whileHover={{
        scale: 1.2,
        filter: 'drop-shadow(0 0 15px currentColor)',
        transition: { duration: 0.2 },
      }}
    >
      <defs>
        <linearGradient id={`shine-${gridX}-${gridY}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          <animate
            attributeName="x1"
            values="-100%;200%"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="0%;300%"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      {renderShape()}
    </motion.svg>
  );
};

export default GridShape;

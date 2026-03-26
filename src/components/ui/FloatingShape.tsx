import React, { useId } from 'react';
import { motion } from 'framer-motion';

type ShapeType = 'square' | 'circle' | 'triangle' | 'donut';

interface FloatingShapeProps {
  type: ShapeType;
  color?: string; // Can be a CSS variable or hex
  gradient?: string; // Optional custom gradient
  size?: number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  delay?: number;
  duration?: number;
  className?: string;
  zIndex?: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  type,
  color = 'var(--color-primary-orange)',
  gradient,
  size = 50,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 6,
  className = '',
  zIndex = 0
}) => {
  // Generate unique ID for gradient to avoid conflicts
  const id = useId();
  const gradientId = `shapeGradient-${id.replace(/:/g, '')}`;

  // Define SVG paths for different shapes
  const renderShape = () => {
    const fill = gradient || !color.startsWith('var') && !color.startsWith('#') ? `url(#${gradientId})` : color;
    
    switch (type) {
      case 'square':
        return <rect width="100%" height="100%" rx="10" fill={fill} />;
      case 'circle':
        return <circle cx="50%" cy="50%" r="48%" fill={fill} />;
      case 'triangle':
         return <polygon points="50,5 95,90 5,90" fill={fill} transform="scale(0.01 0.01) scale(100 100)" />;
      case 'donut':
        return (
          <path 
            d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z" 
            fill={fill}
            transform="scale(0.01 0.01) scale(100 100)"
          />
        );
      default:
        return <rect width="100%" height="100%" rx="10" fill={fill} />;
    }
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        zIndex,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {/* Default to orange-red if no gradient provided */}
             {gradient ? null : (
               <>
                 <stop offset="0%" stopColor="#AE3032" stopOpacity="0.8" />
                 <stop offset="100%" stopColor="#E0683B" stopOpacity="0.8" />
               </>
             )}
          </linearGradient>
        </defs>
        {renderShape()}
      </svg>
    </motion.div>
  );
};

export default FloatingShape;

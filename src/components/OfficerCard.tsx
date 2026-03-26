import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfficerCardProps {
  name: string;
  role: string;
  index?: number;
  image?: string;
  year?: string;
  hobbies?: string;
  futureJob?: string;
  motto?: string;
}

const OfficerCard: React.FC<OfficerCardProps> = ({ 
  name, 
  role, 
  index = 0, 
  image,
  year,
  hobbies,
  futureJob,
  motto
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate gradient colors based on index for variety
  const gradientColors = [
    ['#AE3032', '#E0683B'],
    ['#E0683B', '#F0D155'],
    ['#AE3032', '#F0D155'],
    ['#CF4F51', '#F08A5D'],
  ];
  const colors = gradientColors[index % gradientColors.length];
  const gradientStyle = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;

  return (
    <div className="relative">
      <motion.div
        className="group flex flex-col items-center text-center p-8 gap-4 bg-[var(--surface)] border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar Placeholder */}
        <div
          className="w-20 h-20 flex items-center justify-center text-2xl font-bold text-white font-title shadow-lg ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--c-orange)] object-cover overflow-hidden"
          style={{
            background: !image ? gradientStyle : undefined,
          }}
        >
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            name.charAt(0)
          )}
        </div>

        {/* Role */}
        <p className="font-heading text-xs font-semibold text-[var(--c-orange)] uppercase tracking-widest">
          {role}
        </p>

        {/* Name */}
        <h3 className="font-body text-base font-semibold text-[var(--foreground)] leading-tight">
          {name}
        </h3>
      </motion.div>

      {/* Popover Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 mb-4 w-64 bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl z-50 pointer-events-none"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {/* Popover Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--surface)] border-r border-b border-[var(--border)] rotate-45" />
            
            <div className="space-y-4 text-left relative z-10">
              <div className="border-b border-[var(--border)] pb-2">
                <p className="text-[10px] uppercase tracking-widest text-[var(--c-orange)] font-bold">Year Level</p>
                <p className="text-sm font-body text-[var(--foreground)]">{year || 'N/A'}</p>
              </div>
              <div className="border-b border-[var(--border)] pb-2">
                <p className="text-[10px] uppercase tracking-widest text-[var(--c-orange)] font-bold">Hobbies</p>
                <p className="text-sm font-body text-[var(--foreground)] line-clamp-1">{hobbies || 'N/A'}</p>
              </div>
              <div className="border-b border-[var(--border)] pb-2">
                <p className="text-[10px] uppercase tracking-widest text-[var(--c-orange)] font-bold">Future Job</p>
                <p className="text-sm font-body text-[var(--foreground)]">{futureJob || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--c-orange)] font-bold">Motto</p>
                <p className="text-xs font-body italic text-[var(--foreground-muted)] line-clamp-2">
                  "{motto || 'No motto available.'}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfficerCard;

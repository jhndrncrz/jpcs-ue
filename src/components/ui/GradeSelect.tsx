import React from 'react';
import { ChevronDown } from 'lucide-react';

interface GradeSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  mode: 'standard' | 'hub';
  className?: string; // Classes for the inner select
  containerClassName?: string; // Classes for the container
  placeholder?: string;
  id?: string;
}

const GradeSelect: React.FC<GradeSelectProps> = ({ 
  value, 
  onChange, 
  mode, 
  className = '', 
  containerClassName = '',
  placeholder = 'Select Grade',
  id 
}) => {
  const formattedValue = React.useMemo(() => {
    if (value === undefined || value === null || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    // Only format if it's a numerical value (don't format 'D', 'W', etc.)
    if (!isNaN(num) && typeof value === 'number') {
      return num.toFixed(2);
    }
    // If it's a string that looks like a number, try to normalize it
    if (!isNaN(num) && typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) {
      return num.toFixed(2);
    }
    return value.toString();
  }, [value]);

  const options = React.useMemo(() => {
    const opts: string[] = [];
    
    // Core grades: 1.00 to 3.00 in 0.25 increments
    for (let g = 1.0; g <= 3.0; g += 0.25) {
      opts.push(g.toFixed(2));
    }

    if (mode === 'hub') {
      // Hub also includes 4.00, 5.00 and special marks
      opts.push('4.00');
      opts.push('5.00');
      opts.push('D'); // Dropped
      opts.push('W'); // Withdrawn
      opts.push('LFR'); // Lapsed
    }

    return opts;
  }, [mode]);

  // If border-none is passed, we don't apply the default border classes
  const hasNoBorder = className.includes('border-none');
  const baseClasses = `w-full bg-[var(--surface)] p-1.5 pr-7 text-xs font-heading focus:border-[var(--primary)] outline-none transition-colors appearance-none cursor-pointer`;
  const borderClasses = hasNoBorder ? '' : 'border border-[var(--border)]';

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      <select
        id={id}
        value={formattedValue}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} ${borderClasses} ${className}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-1 text-[var(--foreground-muted)] pointer-events-none top-1/2 -translate-y-1/2">
        <ChevronDown size={12} />
      </div>
    </div>
  );
};

export default GradeSelect;

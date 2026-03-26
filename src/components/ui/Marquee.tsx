import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // pixels per second
  paused?: boolean;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = 'left',
  speed = 40,
  paused = false,
  className = '',
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [duration, setDuration] = React.useState(30);
  const hasInitialized = React.useRef(false);

  // Calculate duration once on mount and on resize — NOT on children change
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.scrollWidth;
      if (width > 0) {
        setDuration(width / speed);
        hasInitialized.current = true;
      }
    };

    // Initial measure
    measure();

    // Re-measure on resize
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className={`marquee-container overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        data-direction={direction}
        style={{
          '--marquee-duration': `${duration}s`,
          animationPlayState: paused ? 'paused' : 'running',
        } as React.CSSProperties}
      >
        <div ref={contentRef} className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;

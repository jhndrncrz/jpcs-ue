import React from 'react';
import ScrollReveal from './ui/ScrollReveal';
import Marquee from './ui/Marquee';

const images = [
  '1.png', '2.png', '3.png', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg',
  '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
  '16.jpg', '17.jpg'
];

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface MarqueeRowProps {
  items: string[];
  direction?: 'left' | 'right';
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction = 'left' }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="py-4">
      <Marquee
        speed={60}
        direction={direction}
        paused={hoveredIndex !== null}
      >
        {items.map((img, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`w-80 h-80 shrink-0 mr-6 bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden shadow-lg transition-all duration-500 cursor-pointer
              ${hoveredIndex === i ? 'scale-110 z-20 shadow-2xl relative' : hoveredIndex !== null ? 'opacity-40 scale-95 blur-[1px]' : 'scale-100 opacity-100'}
            `}
          >
            <img
              src={`/pubmats/${img}`}
              alt={`Event pubmat ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export const PubmatsMarquee: React.FC = () => {
  // Each row gets its own independently shuffled order, computed once on mount
  const row1 = React.useMemo(() => shuffle(images), []);
  const row2 = React.useMemo(() => shuffle(images), []);

  return (
    <section className="py-24 bg-[var(--background)] border-b border-[var(--border)] overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <ScrollReveal animation="fade-up">
          <div className="text-center">
            <h2 className="text-[var(--foreground)] mb-4">Our Events &amp; Campaigns</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto" />
            <p className="font-body text-[var(--foreground-muted)] max-w-2xl mx-auto mt-6">
              Take a look at what we've been up to. From general assemblies to webinars, JPCS-UE is always active.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1 — scrolls left, random order */}
        <MarqueeRow items={row1} direction="left" />
        {/* Row 2 — scrolls right, different random order */}
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
};


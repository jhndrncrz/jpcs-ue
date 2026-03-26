import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calculator, Target, GraduationCap } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import HeroSection from '../components/HeroSection';
import GradientSection from '../components/GradientSection';
import OfficerCard from '../components/OfficerCard';
import { PubmatsMarquee } from '../components/PubmatsMarquee';
import Marquee from '../components/ui/Marquee';

const eventPhotos = [
  '/events/1.png', '/events/2.jpg', '/events/3.png', '/events/4.png',
  '/events/5.png', '/events/6.png', '/events/7.png', '/events/8.png',
  '/events/9.png', '/events/10.png', '/events/11.png', '/events/12.png',
];

// Shuffle array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Home: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Slideshow state — two independent sequences
  const [mainPhotos] = useState(() => shuffle(eventPhotos));
  const [secPhotos] = useState(() => shuffle(eventPhotos));
  const [mainIdx, setMainIdx] = useState(0);
  const [secIdx, setSecIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMainIdx(i => (i + 1) % mainPhotos.length), 4000);
    return () => clearInterval(id);
  }, [mainPhotos.length]);

  useEffect(() => {
    const id = setTimeout(() => {
      const interval = setInterval(() => setSecIdx(i => (i + 1) % secPhotos.length), 4000);
      return () => clearInterval(interval);
    }, 2000); // offset by 2 s
    return () => clearTimeout(id);
  }, [secPhotos.length]);

  // Featured officers for preview
  const featuredOfficers = [
    { 
      role: "President", 
      name: "John Adrian Cruz",
      year: "4th Year",
      hobbies: "Playing musical instruments - Writing songs - Playing games",
      futureJob: "DevOps Engineer",
      motto: "Lead with passion, code with purpose."
    },
    { 
      role: "VP Internal", 
      name: "Jamie Noreen Ferrer",
      year: "4th Year",
      hobbies: "Cooking - Designing - Sleeping",
      futureJob: "Designer",
      motto: "Simplicity is the soul of efficient design."
    },
    { 
      role: "VP External", 
      name: "Franchesca Mari Morales",
      year: "4th Year",
      hobbies: "Reading - Shipping - Watching Cdrama",
      futureJob: "Business Woman",
      motto: "Connections build the bridge to innovation."
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION (Circuit Background) */}
      <HeroSection className="min-h-screen">
          <ScrollReveal animation="fade-up" delay={0.2}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="cursor-default select-none group"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <h1
                className="font-logo text-shadow-glow flex items-center justify-center normal-case"
                style={{
                  fontSize: 'clamp(3rem, 12vw, 10rem)',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                }}
              >
                <span className="text-[var(--logo-brackets)]">&lt;</span>
                
                <span 
                  className="relative flex items-center justify-center transition-all duration-700 ease-in-out px-[0.1em] py-4 overflow-hidden"
                  style={{ 
                    maxWidth: isLogoHovered ? '2000px' : '1.8em',
                  }}
                >
                    <span 
                        className={`text-[var(--logo-text)] transition-all duration-500 whitespace-nowrap
                        ${isLogoHovered ? 'opacity-0 scale-90 blur-sm pointer-events-none absolute' : 'opacity-100 scale-100 blur-0'}`}
                    >
                        jpcs
                    </span>
                    
                    <span className={`whitespace-nowrap text-[var(--logo-text)] lowercase tracking-tighter transition-all duration-500
                        ${isLogoHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm absolute'}`}>
                         <Marquee speed={60} pauseOnHover={false}>
                            junior-philippine-computer-society &nbsp;&nbsp;
                         </Marquee>
                    </span>
                </span>

                <span className="text-[var(--logo-brackets)]">/&gt;</span>
              </h1>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.4}>
            <p className="font-heading text-white tracking-[0.3em] uppercase mb-8 font-medium">
              Junior Philippine Computer Society — UE Manila
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.6}>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering the next generation of tech leaders through{' '}
              <span className="font-bold text-[var(--c-yellow)]">innovation</span>,{' '}
              <span className="font-bold text-[var(--c-yellow-dim)]">collaboration</span>, and{' '}
              <span className="font-bold text-white">excellence</span>.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={0.8}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/about" className="btn btn-primary">
                Discover More <ChevronRight size={20} />
              </Link>
              <Link 
                to="/contacts" 
                className="btn btn-outline bg-transparent border-white/40 text-white hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </ScrollReveal>
      </HeroSection>

      {/* 2. THE CHAPTER SECTION (Static Content) */}
      <section className="py-24 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <ScrollReveal animation="slide-left">
                    <div className="space-y-6">
                        <p className="font-heading text-sm text-[var(--primary)] tracking-[0.2em] uppercase">About The Chapter</p>
                        <h2 className="text-[var(--foreground)]">A Community of Innovators</h2>
                        <p className="font-body text-lg text-[var(--foreground-muted)] leading-relaxed text-justify">
                            The Junior Philippine Computer Society UE Manila Chapter (JPCS-UE) is the premier student-led technology organization in the University of the East. We are dedicated to nurturing the potential of every ICT student, providing them with the resources, mentorship, and community needed to excel in the digital age.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-6 bg-[var(--surface)] border-l-4 border-[var(--primary)]">
                                <span className="block font-logo text-3xl text-[var(--foreground)] mb-1">50+</span>
                                <span className="font-heading text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Active Members</span>
                            </div>
                            <div className="p-6 bg-[var(--surface)] border-l-4 border-[var(--accent)]">
                                <span className="block font-logo text-3xl text-[var(--foreground)] mb-1">10+</span>
                                <span className="font-heading text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Annual Events</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="slide-right">
                    <div className="relative">
                        {/* Main photo — true crossfade slideshow */}
                        <div className="aspect-[4/3] bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative group">
                           {mainPhotos.map((src, i) => (
                             <motion.img
                               key={src}
                               src={src}
                               alt="JPCS-UE event"
                               className="absolute inset-0 w-full h-full object-cover"
                               animate={{ opacity: i === mainIdx ? 1 : 0 }}
                               transition={{ duration: 1.2 }}
                             />
                           ))}
                           {/* Overlay gradient */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                           {/* Accent bar */}
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-20" />
                        </div>

                        {/* Secondary photo — true crossfade slideshow, offset */}
                        <div className="absolute -bottom-6 -right-6 w-1/2 aspect-square border border-[var(--border)] hidden md:block overflow-hidden z-20 shadow-xl">
                           {secPhotos.map((src, i) => (
                             <motion.img
                               key={src}
                               src={src}
                               alt="JPCS-UE event"
                               className="absolute inset-0 w-full h-full object-cover"
                               animate={{ opacity: i === secIdx ? 1 : 0 }}
                               transition={{ duration: 1.2 }}
                             />
                           ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
      </section>

      {/* 3. MARQUEE SECTION */}
      <PubmatsMarquee />

      {/* 4. OUR VALUES (Static) */}
      <GradientSection className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="text-center mb-16">
          <h2 className="text-[var(--foreground)] mb-4">Core Excellence</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { title: "Innovation", desc: "Pushing boundaries in software development and emerging tech.", icon: <Calculator size={32} /> },
                { title: "Leadership", desc: "Developing the next generation of industry-ready tech leaders.", icon: <Target size={32} /> },
                { title: "Civic Duty", desc: "Using technology to solve real-world problems for the community.", icon: <GraduationCap size={32} /> }
            ].map((value, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={i * 0.1}>
                    <div className="text-center space-y-4 group">
                        <div className="w-16 h-16 border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                            {value.icon}
                        </div>
                        <h3 className="text-[var(--foreground)]">{value.title}</h3>
                        <p className="font-body text-[var(--foreground-muted)] text-sm leading-relaxed">
                            {value.desc}
                        </p>
                    </div>
                </ScrollReveal>
            ))}
        </div>
      </GradientSection>

      {/* 4. FEATURED OFFICERS PREVIEW */}
      <GradientSection>
        <div className="text-center mb-12">
          <p className="font-heading text-sm text-[var(--primary)] mb-2 tracking-wider uppercase">Leadership</p>
          <h2 className="text-[var(--foreground)]">Meet the Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredOfficers.map((officer, index) => (
             <ScrollReveal key={index} delay={index * 0.1} animation="fade-up" className="h-full">
               <OfficerCard 
                 name={officer.name} 
                 role={officer.role}
                 year={officer.year}
                 hobbies={officer.hobbies}
                 futureJob={officer.futureJob}
                 motto={officer.motto}
                 index={index}
                 image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
               />
             </ScrollReveal>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/about" className="btn btn-outline border-[var(--border)] text-[var(--foreground)]">
            View All Officers <ChevronRight size={16} />
          </Link>
        </div>
      </GradientSection>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[var(--primary)] opacity-10" />
         <div className="container mx-auto px-4 relative z-10 text-center">
            <ScrollReveal animation="scale">
                <h2 className="font-title text-[var(--foreground)] mb-6">READY TO SHAPE THE FUTURE?</h2>
                <p className="font-body text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10">
                    Join the Junior Philippine Computer Society - UE Manila Chapter and be part of the most dynamic tech community on campus.
                </p>
                <Link to="/contacts" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform">
                    Join the Committee &rarr;
                </Link>
            </ScrollReveal>
         </div>
      </section>
    </div>
  );
};

export default Home;

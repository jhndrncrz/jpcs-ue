import React from 'react';
import { Target, Flag } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import OfficerCard from '../components/OfficerCard';
import HeroSection from '../components/HeroSection';
import GradientSection from '../components/GradientSection';

// Officers data
const officers = [
  { 
    role: "Adviser", 
    name: "Melie Jim Sarmiento",
    year: "Faculty",
    hobbies: "Singing - Dancing - Chatting",
    futureJob: "CIO",
    motto: "Knowledge is the key to success."
  },
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
  { 
    role: "Secretary", 
    name: "John Lawrence Urcia",
    year: "4th Year",
    hobbies: "Gaming - Binge Watching - Random Things",
    futureJob: "Backend Developer",
    motto: "Structure and clarity enable growth."
  },
  { 
    role: "Treasurer", 
    name: "Dwyght Dani Dela Cruz",
    year: "4th Year",
    hobbies: "Playing the saxophone - Gaming - Researching gadgets and cars",
    futureJob: "Full Stack Developer",
    motto: "Numbers tell stories for those who listen."
  },
  { 
    role: "Auditor", 
    name: "Sean Arnisto",
    year: "4th Year",
    hobbies: "Gaming - Listening to Le Sserafim - Playing badminton",
    futureJob: "Software Developer",
    motto: "Integrity in every line of code."
  },
  { 
    role: "Dir. of Memberships", 
    name: "John Lester Malonzo",
    year: "4th Year",
    hobbies: "Running - Playing chess - Travelling",
    futureJob: "Freelance UX Designer",
    motto: "Growth begins where comfort ends."
  },
  { 
    role: "Dir. of Special Projects", 
    name: "Racy Anne Dumable",
    year: "4th Year",
    hobbies: "Watching animated series & movies - Reading manga and manhwa - Sleeping",
    futureJob: "Full Stack Developer",
    motto: "Innovation through collaboration."
  },
  { 
    role: "Dir. of Public Relations", 
    name: "Roman Paulo Baet",
    year: "4th Year",
    hobbies: "Editing pubmats - Cooking - Eating out",
    futureJob: "Data Scientist",
    motto: "Communication is the core of community."
  },
  { 
    role: "Social Media Manager", 
    name: "Micko Guinanao",
    year: "4th Year",
    hobbies: "Solving Rubik's cube - Gaming - Sleeping",
    futureJob: "Software Engineer",
    motto: "Engage, inspire, and innovate."
  },
  { 
    role: "Dept. Head of Software Development", 
    name: "John Mark Gatche",
    year: "4th Year",
    hobbies: "Painting - Knitting - Watching films",
    futureJob: "Animator",
    motto: "Code for a better tomorrow."
  },
  { 
    role: "4th Year Representative", 
    name: "Fil Edward Buitizon",
    year: "4th Year",
    hobbies: "Gaming - Doomscrolling - Vibe coding",
    futureJob: "Senior Developer",
    motto: "Sharing knowledge multiplies it."
  },
  { 
    role: "2nd Year Representative", 
    name: "Noel Bandoy",
    year: "2nd Year",
    hobbies: "Gaming - Reading - Tech News",
    futureJob: "Software Engineer",
    motto: "Innovation knows no bounds."
  },
  { 
    role: "1st Year Representative", 
    name: "Chelysse Ann Quimat",
    year: "1st Year",
    hobbies: "Music - Art - Design",
    futureJob: "UI/UX Designer",
    motto: "Designing the future, one pixel at a time."
  },
];

const About: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO HEADER */}
      <HeroSection className="min-h-[50vh] py-32 flex items-center justify-center">
        <div className="text-center max-w-4xl px-4 mx-auto">
          <ScrollReveal animation="fade-up">
            <h1 className="text-white mb-6 uppercase tracking-wider text-shadow-glow">
              ABOUT US
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Learn about our history, mission, and the team driving JPCS UE Manila forward.
            </p>
          </ScrollReveal>
        </div>
      </HeroSection>

      {/* 2. HISTORY */}
      <GradientSection>
          <ScrollReveal animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="mb-8 text-[var(--foreground)]">OUR CHAPTER'S STORY</h2>
              <div className="space-y-6 text-lg text-[var(--foreground-muted)] leading-relaxed text-justify px-4 md:text-center">
                <p>
                  The Junior Philippine Computer Society - UE Manila Chapter was officially 
                  established in 2025 with a vision to revitalize ICT student engagement 
                  within the University of the East Manila.
                </p>
                <p>
                  Recognizing the need for a dedicated platform for technology enthusiasts, 
                  a group of passionate student leaders came together to form this chapter. 
                  Our goal is to bridge the gap between classroom theory and real-world 
                  application, providing a space where students can innovate, collaborate, 
                  and grow as future IT professionals.
                </p>
              </div>
            </div>
          </ScrollReveal>
      </GradientSection>

      {/* 3. MISSION & AIMS */}
      <GradientSection className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Mission Card */}
            <ScrollReveal animation="slide-left">
              <div className="p-10 border border-[var(--border)] bg-[var(--background)] h-full shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[var(--surface)] border border-[var(--border)]">
                    <Target size={28} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Our Vision</h3>
                </div>
                <p className="font-body text-[var(--foreground-muted)] leading-relaxed text-justify">
                  Our vision is to build a vibrant community of aspiring technologists at UE Manila, fostering a culture of excellence, creativity, and ethical practice in computer science. By empowering our members to use technology for positive societal impact, we hope to be recognized as a driving force in shaping the future of innovation.
                </p>
              </div>
            </ScrollReveal>

            {/* Vision Card */}
            <ScrollReveal animation="slide-right">
              <div className="p-10 border border-[var(--border)] bg-[var(--background)] h-full shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[var(--surface)] border border-[var(--border)]">
                     <Flag size={28} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Our Mission</h3>
                </div>
                <div className="space-y-4 font-body text-[var(--foreground-muted)] leading-relaxed text-justify">
                  <p>
                    The Junior Philippine Computer Society at UE Manila is dedicated to instilling a passion for computer science in young minds by providing an inclusive environment for learning, innovation, and professional development.
                  </p>
                  <p>
                    Through engaging activities and educational initiatives, we hope to provide our members with the skills and knowledge they need to become competent technologists and responsible citizens.
                  </p>
                </div>
              </div>
            </ScrollReveal>
        </div>
      </GradientSection>

      {/* 4. OFFICERS BOARD - HIERARCHICAL */}
      <GradientSection>
          <div className="text-center mb-16">
            <h2 className="text-[var(--foreground)] mb-4 leading-tight">
              Organizational <span className="text-[var(--c-orange)]">Structure</span>
            </h2>
            <p className="font-body text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Meet the dedicated leaders and innovators driving the JPCS UE Manila Chapter for the 2025-2026 Academic Year.
            </p>
          </div>

          {/* 4.1 CHAPTER ADVISER */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h3 className="text-lg font-bold text-[var(--c-orange)]">Chapter Adviser</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            <div className="flex justify-center px-4">
              <ScrollReveal animation="fade-up">
                <OfficerCard
                  {...officers.find(o => o.role === "Adviser")!}
                  index={0}
                  image={`https://ui-avatars.com/api/?name=${officers.find(o => o.role === "Adviser")?.name}&background=random`}
                />
              </ScrollReveal>
            </div>
          </div>

          {/* 4.2 EXECUTIVE BOARD */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h3 className="text-lg font-bold text-[var(--c-orange)]">Executive Board</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 space-y-8">
              {/* President Row */}
              <div className="flex justify-center">
                <ScrollReveal animation="fade-up">
                  <OfficerCard
                    {...officers.find(o => o.role === "President")!}
                    index={1}
                    image={`https://ui-avatars.com/api/?name=${officers.find(o => o.role === "President")?.name}&background=random`}
                  />
                </ScrollReveal>
              </div>
              
              {/* VPs Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {officers.filter(o => o.role.includes("VP")).map((officer, i) => (
                  <ScrollReveal key={officer.role} delay={i * 0.1} animation="fade-up">
                    <OfficerCard
                      {...officer}
                      index={i + 2}
                      image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
                    />
                  </ScrollReveal>
                ))}
              </div>

              {/* Secretary, Treasurer, Auditor Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {officers.filter(o => ["Secretary", "Treasurer", "Auditor"].includes(o.role)).map((officer, i) => (
                  <ScrollReveal key={officer.role} delay={i * 0.1} animation="fade-up">
                    <OfficerCard
                      {...officer}
                      index={i + 4}
                      image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* 4.3 STANDING COMMITTEES */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h3 className="text-lg font-bold text-[var(--c-orange)]">Standing Committees</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {officers.filter(o => o.role.startsWith("Dir.")).map((officer, i) => (
                <ScrollReveal key={officer.role} delay={i * 0.1} animation="fade-up">
                  <OfficerCard
                    {...officer}
                    index={i + 7}
                    image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* 4.4 SPECIALIZED TEAMS */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h3 className="text-lg font-bold text-[var(--c-orange)]">Specialized Team</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {officers.filter(o => !["Adviser", "President", "Secretary", "Treasurer", "Auditor"].includes(o.role) && !o.role.includes("VP") && !o.role.startsWith("Dir.") && !o.role.includes("Representative")).map((officer, i) => (
                <ScrollReveal key={officer.role} delay={i * 0.1} animation="fade-up">
                  <OfficerCard
                    {...officer}
                    index={i + 10}
                    image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* 4.5 YEAR LEVEL REPRESENTATIVES */}
          <div>
            <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h3 className="text-lg font-bold text-[var(--c-orange)]">Year Level Representatives</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {officers.filter(o => o.role.includes("Representative")).map((officer, i) => (
                <ScrollReveal key={officer.role} delay={i * 0.1} animation="fade-up">
                  <OfficerCard
                    {...officer}
                    index={i + 13}
                    image={`https://ui-avatars.com/api/?name=${officer.name}&background=random`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
      </GradientSection>
    </div>
  );
};

export default About;

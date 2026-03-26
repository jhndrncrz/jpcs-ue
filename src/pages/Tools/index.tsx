import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ToolsHome from './ToolsHome';
import GWACalculator from './GWACalculator';
import TargetGradeCalculator from './TargetGradeCalculator';
import FinalGradeCalculator from './FinalGradeCalculator';
import PomodoroTimer from './PomodoroTimer';
import ScheduleMaker from './ScheduleMaker';
import AssignmentTracker from './AssignmentTracker';
import StudySessionPlanner from './StudySessionPlanner';
import ProductivityHub from './ProductivityHub';
import ScrollReveal from '../../components/ui/ScrollReveal';
import HeroSection from '../../components/HeroSection';

const Tools: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO HEADER */}
      <HeroSection className="min-h-[50vh] py-32 flex items-center justify-center">
        <div className="text-center max-w-4xl px-4 mx-auto">
          <ScrollReveal animation="fade-up">
            <h1 className="font-logo text-5xl md:text-7xl text-white mb-6 uppercase tracking-wider text-shadow-glow">
              STUDENT TOOLS
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Empowering computer science students with essential utilities for academic success.
            </p>
          </ScrollReveal>
        </div>
      </HeroSection>

      {/* 2. TOOLS CONTENT */}
      <div className="py-24 min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <Routes>
            <Route index element={<ToolsHome />} />
            <Route path="gwa" element={<GWACalculator />} />
            <Route path="target" element={<TargetGradeCalculator />} />
            <Route path="final" element={<FinalGradeCalculator />} />
            <Route path="pomodoro" element={<PomodoroTimer />} />
            <Route path="schedule" element={<ScheduleMaker />} />
            <Route path="assignments" element={<AssignmentTracker />} />
            <Route path="planner" element={<StudySessionPlanner />} />
            <Route path="productivity-hub" element={<ProductivityHub />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Tools;

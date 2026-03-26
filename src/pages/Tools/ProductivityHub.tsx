import React, { useState, useEffect } from 'react';
import { Calendar, Timer, BookOpen, ChevronRight, Activity, HelpCircle, X } from 'lucide-react';
import PomodoroTimer from './PomodoroTimer';
import AssignmentTracker from './AssignmentTracker';
import StudySessionPlanner from './StudySessionPlanner';
import ScrollReveal from '../../components/ui/ScrollReveal';

const ProductivityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'timer' | 'tracker'>('tracker');
  const [showHelp, setShowHelp] = useState(false);

  const steps = [
    { id: 'tracker', label: 'Track', icon: BookOpen, color: 'var(--c-orange)', desc: 'Assignments' },
    { id: 'planner', label: 'Plan', icon: Calendar, color: 'var(--primary)', desc: 'Study Schedule' },
    { id: 'timer', label: 'Focus', icon: Timer, color: 'var(--c-red)', desc: 'Focus Session' },
  ] as const;

  useEffect(() => {
    const handleSwitchToTimer = () => setActiveTab('timer');
    const handleSwitchToPlanner = () => setActiveTab('planner');
    const handleHubSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: 'planner' | 'timer' | 'tracker' }>;
      if (customEvent.detail.tab) setActiveTab(customEvent.detail.tab);
    };

    window.addEventListener('jpcs-ue-pomodoro-start', handleSwitchToTimer);
    window.addEventListener('jpcs-ue-add-to-planner', handleSwitchToPlanner);
    window.addEventListener('jpcs-ue-hub-switch', handleHubSwitch);
    
    return () => {
      window.removeEventListener('jpcs-ue-pomodoro-start', handleSwitchToTimer);
      window.removeEventListener('jpcs-ue-add-to-planner', handleSwitchToPlanner);
      window.removeEventListener('jpcs-ue-hub-switch', handleHubSwitch);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Unified Workflow Navigation */}
      <div className="bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--border)]" />
        <div className="flex flex-col lg:flex-row items-stretch">
          <div className="p-6 lg:p-8 lg:border-r border-[var(--border)] flex items-center justify-between lg:justify-start gap-4 bg-[var(--background)]/50">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl">
                 <Activity size={24} />
               </div>
               <div>
                 <h3 className="font-heading text-xs uppercase tracking-[0.2em] font-bold">Productivity Hub</h3>
                 <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest mt-0.5">Focus Workflow</p>
               </div>
             </div>
             <button 
               onClick={() => setShowHelp(true)}
               className="p-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
               title="How to use the Productivity Hub"
             >
               <HelpCircle size={20} />
             </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row">
            {steps.map((step, index) => {
              const isActive = activeTab === step.id;
              
              return (
                <button 
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex-1 flex flex-col items-center justify-center p-6 transition-all relative group overflow-hidden ${
                    isActive ? 'bg-[var(--background)]' : 'hover:bg-[var(--background)]/30'
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className={`absolute top-4 left-4 text-[10px] font-logo opacity-20 ${isActive ? 'opacity-100 text-[var(--primary)]' : ''}`}>
                    0{index + 1}
                  </div>

                  <div className={`p-3 rounded-full mb-3 transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--foreground-muted)]'
                  }`}>
                    <step.icon size={20} />
                  </div>

                  <div className="text-center">
                    <span className={`block font-heading text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                      isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                    }`}>
                      {step.label}
                    </span>
                    <span className="block text-[8px] uppercase tracking-widest opacity-40 mt-1">
                      {step.desc}
                    </span>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)]" />
                  )}

                  {/* Connector Arrow for large screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20 text-[var(--border)]">
                      <ChevronRight size={24} strokeWidth={1} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative min-h-[600px]">
        {/* We use hidden class instead of conditional rendering to keep components mounted and listening for events */}
        <div className={activeTab === 'planner' ? 'block' : 'hidden'}>
          <ScrollReveal animation="fade-in">
            <StudySessionPlanner />
          </ScrollReveal>
        </div>
        <div className={activeTab === 'timer' ? 'block' : 'hidden'}>
          <ScrollReveal animation="fade-in">
            <PomodoroTimer />
          </ScrollReveal>
        </div>
        <div className={activeTab === 'tracker' ? 'block' : 'hidden'}>
          <ScrollReveal animation="fade-in">
            <AssignmentTracker />
          </ScrollReveal>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowHelp(false)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3 text-[var(--primary)]">
                <HelpCircle size={24} />
                <h3 className="font-heading text-lg uppercase tracking-widest font-bold">The Productivity Workflow</h3>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-[var(--background)] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {[
                { step: "01", title: "Track Everything", desc: "Start by logging all your upcoming tasks and assignments in Step 1. This ensures nothing falls through the cracks and allows you to set priorities.", icon: BookOpen },
                { step: "02", title: "Plan Your Session", desc: "Import your pending tasks into the Study Planner. Configure your available time and generate an optimized schedule using interleaving techniques.", icon: Calendar },
                { step: "03", title: "Deep Focus", desc: "Execute your plan using the Pomodoro timer. The timer will automatically cycle through your planned subjects and scheduled breaks.", icon: Timer }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center rounded-xl font-logo text-xl">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                       <item.icon size={16} /> {item.title}
                    </h4>
                    <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-[var(--background)]/50 border-t border-[var(--border)] text-center">
              <button 
                onClick={() => setShowHelp(false)}
                className="px-8 py-3 bg-[var(--primary)] text-white font-heading text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Got it, Let's Work
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityHub;

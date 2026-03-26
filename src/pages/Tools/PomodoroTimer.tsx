import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Trash2, Activity, Settings2, ChevronRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ToolHeader from '../../components/ui/ToolHeader';


interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface StudySession {
  id: string;
  type: 'study' | 'break';
  subject?: string;
  duration: number;
  startTime: string;
  actualStartTime?: string | null;
  completed: boolean;
}

const PomodoroGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracki
ng-widest mb-2">The Technique</h3>                                                    <p>The Pomodoro Technique is a time management method that uses a timer to
 break work into intervals, traditionally 25 minutes in length, separated by 5-minute breaks.</p>                                                                   </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)]
 text-[11px]">                                                                        <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracki
ng-widest mb-2">Notifications</h3>                                                    <p>The timer will request browser notification permissions. This allows it
 to alert you when a session or break is over, even if the tab is not active.</p>                                                                                   </div>

    <div>
      <h3 className="text-[var(--foreground)] font-heading text-sm uppercase tra
cking-widest mb-2">Sessions & Tasks</h3>                                              <p>Your completed sessions and tasks are stored locally. Use them to track
 your productivity. A common goal is to complete 4 sessions before taking a longer (15-30 min) break.</p>                                                           </div>
  </div>
);

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('jpcs-ue-pomodoro-settings', {
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  
  const [minutes, setMinutes] = useState(settings.focus);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage<number>('jpcs-ue-pomodoro-sessions', 0);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useLocalStorage<StudySession[]>('jpcs-ue-study-sessions', []);
  const [currentPlanIndex, setCurrentPlanIndex] = useState<number>(-1);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [lastCompletedSubject, setLastCompletedSubject] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const getDuration = useCallback((m: typeof mode) => {
    switch(m) {
      case 'focus': return settings.focus;
      case 'shortBreak': return settings.shortBreak;
      case 'longBreak': return settings.longBreak;
      default: return 25;
    }
  }, [settings]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(getDuration(mode));
    setSeconds(0);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
  }, [mode, getDuration]);

  const advancePlan = useCallback(() => {
    const nextIndex = currentPlanIndex + 1;
    if (nextIndex < studyPlan.length) {
      const nextSession = studyPlan[nextIndex];
      setCurrentPlanIndex(nextIndex);
      setMode(nextSession.type === 'study' ? 'focus' : 'shortBreak');
      setActiveSubject(nextSession.subject || null);
      setMinutes(nextSession.duration);
      setSeconds(0);
      setIsActive(true);
    } else {
      setCurrentPlanIndex(-1);
      setStudyPlan([]);
      localStorage.removeItem('jpcs-ue-study-sessions');
    }
  }, [currentPlanIndex, studyPlan, setStudyPlan, getDuration]);

  const handleFeedback = useCallback((finished: boolean) => {
    setShowFeedbackModal(false);
    const updatedPlan = [...studyPlan];
    
    if (finished) {
      if (updatedPlan[currentPlanIndex]) {
        updatedPlan[currentPlanIndex].completed = true;
      }
      setStudyPlan(updatedPlan);
      window.dispatchEvent(new CustomEvent('jpcs-ue-session-complete', { 
        detail: { subject: lastCompletedSubject } 
      }));
      advancePlan();
    } else {
      const current = updatedPlan[currentPlanIndex];
      const newStudy: StudySession = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'study',
        subject: current.subject,
        duration: current.duration,
        startTime: 'Next',
        completed: false
      };
      const newBreak: StudySession = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'break',
        duration: 5,
        startTime: 'Later',
        completed: false
      };
      updatedPlan.splice(currentPlanIndex + 1, 0, newStudy, newBreak);
      setStudyPlan(updatedPlan);
      window.dispatchEvent(new CustomEvent('jpcs-ue-plan-updated'));
      setMode('shortBreak');
      setMinutes(5);
      setSeconds(0);
      setIsActive(true);
    }
  }, [studyPlan, setStudyPlan, currentPlanIndex, lastCompletedSubject, advancePlan]);

  const completeSession = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    if (currentPlanIndex !== -1 && studyPlan && studyPlan.length > 0) {
      const currentSession = studyPlan[currentPlanIndex];
      if (currentSession.type === 'study') {
        setLastCompletedSubject(currentSession.subject || null);
        setShowFeedbackModal(true); 
        return;
      } else {
        advancePlan();
      }
      return;
    }

    let nextMode: typeof mode = 'focus';
    if (mode === 'focus') {
      const event = new CustomEvent('jpcs-ue-session-complete', { 
        detail: { subject: activeSubject } 
      });
      window.dispatchEvent(event);
      const newSessionsCount = (sessionsCompleted || 0) + 1;
      setSessionsCompleted(newSessionsCount);
      nextMode = newSessionsCount % 4 === 0 ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'focus';
    }
    
    setMode(nextMode);
    setMinutes(getDuration(nextMode));
    setSeconds(0);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(nextMode.includes('Break') ? 'Time for a break!' : 'Back to work!');
    }
  }, [mode, sessionsCompleted, setSessionsCompleted, activeSubject, getDuration, currentPlanIndex, studyPlan, advancePlan]);

  const skipPhase = () => {
    if (mode === 'focus' && isActive && !window.confirm('End this focus session early?')) {
      return;
    }
    completeSession();
  };

  const toggleTimer = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!isActive && minutes === 0 && seconds === 0) {
      setMinutes(getDuration(mode));
      setSeconds(0);
    }

    if (!isActive && currentPlanIndex !== -1 && studyPlan && studyPlan[currentPlanIndex] && !studyPlan[currentPlanIndex].actualStartTime) {
       const updatedPlan = [...studyPlan];
       updatedPlan[currentPlanIndex].actualStartTime = new Date().toISOString();
       setStudyPlan(updatedPlan);
       window.dispatchEvent(new CustomEvent('jpcs-ue-plan-updated'));
    }

    setIsActive(!isActive);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            setMinutes(prevMinutes => {
              if (prevMinutes > 0) {
                return prevMinutes - 1;
              } else {
                completeSession();
                return 0;
              }
            });
            return 59;
          }
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, completeSession]);

  const switchMode = (newMode: typeof mode) => {
    if (!isActive) {
      setMode(newMode);
      setMinutes(getDuration(newMode));
      setSeconds(0);
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Listen for events from other tools
    const handleStartSession = (e: any) => {
      const { subject, focusTime } = e.detail;
      setActiveSubject(subject);
      setMode('focus');
      setMinutes(focusTime || settings.focus);
      setSeconds(0);
      setIsActive(true);
    };

    window.addEventListener('jpcs-ue-pomodoro-start', handleStartSession);

    // Initial check for active plan
    const savedPlan = localStorage.getItem('jpcs-ue-study-sessions');
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan);
      if (parsed.length > 0 && currentPlanIndex === -1) {
        setStudyPlan(parsed);
        setCurrentPlanIndex(0);
        const first = parsed[0];
        setMode(first.type === 'study' ? 'focus' : 'shortBreak');
        setActiveSubject(first.subject || null);
        setMinutes(first.duration);
        setSeconds(0);
      }
    }

    return () => window.removeEventListener('jpcs-ue-pomodoro-start', handleStartSession);
  }, [settings.focus, currentPlanIndex, setStudyPlan]);


  const totalSeconds = getDuration(mode) * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 relative">
      <ToolHeader
        title="Focus Timer"
        description="Stay productive with advanced Pomodoro features including task tracking and customizable cycles."
        helpContent={<PomodoroGuide />}
        primaryActions={[
          { label: isActive ? 'Pause' : 'Start', icon: isActive ? Pause : Play, onClick: toggleTimer },
          { label: 'Settings', icon: Settings2, onClick: () => setShowSettings(!showSettings) }
        ]}
        dataActions={[
          { label: 'Reset Timer', icon: RotateCcw, onClick: resetTimer },
          { label: 'Clear Stats', icon: Trash2, onClick: () => setSessionsCompleted(0), className: 'hover:text-red-500 hover:bg-red-500/10' }
        ]}
      />

      {/* Hard Lock Overlay */}
      {studyPlan.length === 0 && (
        <div className="absolute inset-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-12 text-center space-y-8 shadow-2xl">
            <div className="w-24 h-24 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="font-heading text-2xl uppercase tracking-widest font-bold">Plan Required</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                The Focus Timer is now strictly integrated with the workflow. You must generate a study plan in Step 2 before you can start focusing.
              </p>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('jpcs-ue-hub-switch', { detail: { tab: 'planner' } }))}
              className="w-full py-4 bg-[var(--primary)] text-white font-heading text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3"
            >
              Go to Step 2: Plan Session <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <ScrollReveal animation="scale">
            <div className="max-w-md w-full bg-[var(--surface)] border-2 border-[var(--primary)] p-8 shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-heading text-xl uppercase tracking-widest font-bold">Session Complete!</h3>
                <p className="text-sm opacity-60">Did you finish your work on <span className="text-[var(--primary)] font-bold">{lastCompletedSubject}</span>?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleFeedback(false)}
                  className="py-4 border border-[var(--border)] text-[10px] font-heading uppercase tracking-widest hover:bg-[var(--background)] transition-colors"
                >
                  No, Need more time
                </button>
                <button 
                  onClick={() => handleFeedback(true)}
                  className="py-4 bg-[var(--primary)] text-white text-[10px] font-heading uppercase tracking-widest hover:opacity-90 shadow-lg shadow-orange-500/20 font-bold"
                >
                  Yes, Finished!
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ScrollReveal animation="scale">
            <div
              className={`relative overflow-hidden border-2 p-12 text-center transition-all duration-500 ${mode.includes('Break') ? 'border-[var(--c-yellow-dim)] bg-[var(--c-yellow-dim)]/5' : 'border-[var(--primary)] bg-[var(--primary)]/5'}`}
            >
              <div className="absolute right-0 top-0 p-6 opacity-10">
                {mode.includes('Break') ? <Coffee size={120} /> : <BookOpen size={120} />}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                <svg className="h-96 w-96 -rotate-90 transform">
                  <circle
                    cx="192"
                    cy="192"
                    r="180"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-[var(--border)]"
                  />
                  <circle
                    cx="192"
                    cy="192"
                    r="180"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={1131}
                    strokeDashoffset={1131 - (1131 * progress) / 100}
                    className={`${mode.includes('Break') ? 'text-[var(--c-orange)]' : 'text-[var(--primary)]'} transition-all duration-1000 ease-linear`}
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex justify-center gap-4">
                  {(['focus', 'shortBreak', 'longBreak'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => switchMode(value)}
                      className={`rounded-full px-4 py-1 text-[10px] font-heading uppercase tracking-widest transition-all ${mode === value ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
                    >
                      {value === 'focus' ? 'Focus' : value === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </button>
                  ))}
                </div>

                <p className="mb-4 font-heading text-xs uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                  {mode === 'focus' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </p>

                {activeSubject && mode === 'focus' && (
                  <div className="mb-4">
                    <p className="animate-pulse font-heading text-lg uppercase tracking-widest text-[var(--primary)]">
                      Working on: {activeSubject}
                    </p>
                    {currentPlanIndex !== -1 && studyPlan && (
                      <p className="mt-1 text-[10px] font-heading uppercase tracking-widest opacity-40">
                        Session {currentPlanIndex + 1} of {studyPlan.length} in your plan
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-12 font-logo text-9xl tracking-tighter text-[var(--foreground)]">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>

                <div className="flex justify-center gap-6">
                  <button
                    type="button"
                    onClick={(event) => toggleTimer(event)}
                    className={`flex h-20 w-20 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 ${isActive ? 'bg-[var(--foreground-muted)] text-[var(--background)]' : 'bg-[var(--primary)] text-white shadow-xl shadow-orange-500/20'}`}
                  >
                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={skipPhase}
                    title="Skip Phase"
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-all hover:bg-[var(--surface)] active:scale-95"
                  >
                    <div className="flex items-center">
                      <Play size={16} fill="currentColor" />
                      <div className="h-4 w-0.5 bg-current" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={resetTimer}
                    className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground-muted)] transition-all hover:bg-[var(--surface)] active:scale-95"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {showSettings && (
            <ScrollReveal animation="fade-up">
              <div className="space-y-6 border border-[var(--border)] bg-[var(--surface)] p-8">
                <h3 className="font-heading text-lg font-bold uppercase tracking-widest">Timer Settings</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {(['focus', 'shortBreak', 'longBreak'] as const).map((type) => {
                    const value = settings[type];
                    const isInvalid = value < 1 || value > 720;

                    return (
                      <div key={type} className="space-y-2">
                        <label className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
                          {type.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(event) => {
                            const nextValue = parseInt(event.target.value, 10) || 0;
                            setSettings({ ...settings, [type]: nextValue });
                          }}
                          className={`w-full border bg-[var(--background)] p-3 font-logo text-xl outline-none transition-colors ${isInvalid ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]'}`}
                        />
                        {isInvalid && <p className="text-[8px] font-bold uppercase tracking-widest text-red-500">Range: 1-720m</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        <div className="space-y-8">
          {currentPlanIndex !== -1 && studyPlan && studyPlan.length > 0 && (
            <div className="space-y-4 border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-6 text-left">
              <h3 className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest">
                <Activity size={14} className="text-[var(--primary)]" /> Current Plan
              </h3>
              <div className="space-y-2">
                {studyPlan.map((session, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 text-[10px] transition-opacity ${index === currentPlanIndex ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${index === currentPlanIndex ? 'bg-[var(--primary)]' : 'bg-[var(--foreground-muted)]'}`} />
                    <span className="flex-1 truncate font-heading uppercase tracking-widest">
                      {session.type === 'study' ? session.subject : 'Break'}
                    </span>
                    <span className="opacity-40">{session.duration}m</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentPlanIndex(-1);
                  resetTimer();
                }}
                className="w-full border border-[var(--border)] py-2 text-[8px] font-heading uppercase tracking-widest opacity-60 transition-colors hover:bg-[var(--background)] hover:opacity-100"
              >
                Cancel Plan
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <p className="mb-2 font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Sessions</p>
              <div className="text-3xl font-logo text-[var(--foreground)]">{sessionsCompleted}</div>
            </div>
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <p className="mb-2 font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Cycle</p>
              <div className="text-2xl font-logo text-[var(--foreground)]">{Math.floor(sessionsCompleted / 4) + 1}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;

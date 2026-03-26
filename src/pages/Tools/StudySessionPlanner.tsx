import React, { useState } from 'react';
import { Clock, BookOpen, Sparkles, RefreshCw, Layers, Calendar, Timer, ChevronRight, Edit2, Check, X, CheckSquare, Trash2 } from 'lucide-react';
import ScrollReveal from '../../components/ui/ScrollReveal';
import ToolHeader from '../../components/ui/ToolHeader';

export interface StudySession {
  id: string;
  type: 'study' | 'break';
  subject?: string;
  duration: number; // in minutes
  startTime: string;
  actualStartTime?: string | null;
  completed: boolean;
}

interface SubjectConfig {
  name: string;
  sessions: number;
}

const StudySessionPlanner: React.FC = () => {
  const [totalTime, setTotalTime] = useState(120);
  const [subjects, setSubjects] = useState<SubjectConfig[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const studyDuration = 25;
  const breakDuration = 5;
  const longBreakDuration = 15;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editDuration, setEditDuration] = useState<number>(25);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.find(s => s.name === newSubject.trim())) {
      setSubjects([...subjects, { name: newSubject.trim(), sessions: 1 }]);
      setNewSubject('');
    }
  };

  const removeSubject = (name: string) => {
    setSubjects(subjects.filter(s => s.name !== name));
  };

  const updateSubjectSessions = (name: string, delta: number) => {
    setSubjects(subjects.map(s => 
      s.name === name ? { ...s, sessions: Math.max(1, s.sessions + delta) } : s
    ));
  };

  const recalculateTimes = (plan: StudySession[], startIdx: number = 0, initialTime?: Date) => {
    const updated = [...plan];
    if (updated.length === 0) return updated;
    
    let now = initialTime || new Date();
    // Only round to nearest 5m if it's the very start of a new plan
    if (!initialTime && startIdx === 0) {
       now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0);
    }
    
    for (let i = startIdx; i < updated.length; i++) {
       updated[i].startTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
       now = new Date(now.getTime() + updated[i].duration * 60000);
    }
    return updated;
  };

  const generatePlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let activeSubjects = [...subjects];
    // If no subjects, generate a generic study plan based on totalTime
    if (activeSubjects.length === 0) {
      const genericSessions = Math.max(1, Math.floor(totalTime / (studyDuration + breakDuration)));
      activeSubjects = [{ name: 'General Study', sessions: genericSessions }];
    }

    const plan: StudySession[] = [];
    const sessionPool = activeSubjects.flatMap(s => 
      Array(s.sessions).fill(null).map((_, i) => ({ 
        name: s.name, 
        sessionNum: i + 1, 
        total: s.sessions 
      }))
    );

    let sessionCount = 0;
    while (sessionPool.length > 0) {
      const current = sessionPool.shift()!;
      
      plan.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'study',
        subject: current.name,
        duration: studyDuration,
        startTime: '',
        completed: false
      });
      sessionCount++;

      if (sessionPool.length === 0) break;

      const isLongBreak = sessionCount % 4 === 0;
      const actualBreakTime = isLongBreak ? longBreakDuration : breakDuration;
      
      plan.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'break',
        duration: actualBreakTime,
        startTime: '',
        completed: false
      });
    }

    const finalizedPlan = recalculateTimes(plan);
    setSessions(finalizedPlan);
    localStorage.setItem('jpcs-ue-study-sessions', JSON.stringify(finalizedPlan));
  };

  const removeSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    const finalized = recalculateTimes(updated);
    setSessions(finalized);
    localStorage.setItem('jpcs-ue-study-sessions', JSON.stringify(finalized));
  };

  const saveEditedSession = (index: number) => {
    const updated = [...sessions];
    updated[index].subject = editSubject;
    updated[index].duration = editDuration;
    
    const fixedPlan = recalculateTimes(updated);
    setSessions(fixedPlan);
    localStorage.setItem('jpcs-ue-study-sessions', JSON.stringify(fixedPlan));
    setEditingIndex(null);
  };

  const importFromTracker = () => {
    try {
      const saved = localStorage.getItem('jpcs-ue-assignments');
      if (saved) {
        const assignments = JSON.parse(saved);
        const pendingSubjects = [...new Set(assignments
          .filter((a: { completed: boolean }) => !a.completed)
          .map((a: { subject: string, title?: string }) => `${a.subject}: ${a.title || 'Task'}`))] as string[];
        
        setSubjects(prev => {
          const existing = new Set(prev.map(s => s.name));
          const newOnes = pendingSubjects
            .filter(name => !existing.has(name))
            .map(name => ({ name, sessions: 1 }));
          return [...prev, ...newOnes];
        });
      }
    } catch (e) {
      console.error('Failed to import subjects', e);
    }
  };

  React.useEffect(() => {
    const handleAddSubject = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject: string }>;
      const { subject } = customEvent.detail;
      if (subject === 'All Pending') {
        importFromTracker();
      } else if (subject && !subjects.find(s => s.name === subject)) {
        setSubjects(prev => [...prev, { name: subject, sessions: 1 }]);
      }
    };

    const handleRepeatSession = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject: string }>;
      const { subject } = customEvent.detail;
      if (!subject) return;
      
      const savedSessions = localStorage.getItem('jpcs-ue-study-sessions');
      if (savedSessions) {
        const currentSessions: StudySession[] = JSON.parse(savedSessions);
        // Find first incomplete to insert after, or just append
        const newSession: StudySession = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'study',
          subject: `${subject} (Continued)`,
          duration: 25,
          startTime: '',
          completed: false
        };
        const breakSession: StudySession = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'break',
          duration: 5,
          startTime: '',
          completed: false
        };
        
        let insertIndex = currentSessions.findIndex(s => !s.completed);
        if (insertIndex === -1) insertIndex = currentSessions.length;
        
        currentSessions.splice(insertIndex, 0, newSession, breakSession);
        
        const recalculated = recalculateTimes(currentSessions, 0);
        setSessions(recalculated);
        localStorage.setItem('jpcs-ue-study-sessions', JSON.stringify(recalculated));
        window.dispatchEvent(new CustomEvent('jpcs-ue-plan-updated'));
      }
    };

    window.addEventListener('jpcs-ue-add-to-planner', handleAddSubject);
    window.addEventListener('jpcs-ue-repeat-session', handleRepeatSession);

    if (subjects.length === 0) importFromTracker();

    const loadPlan = () => {
      const savedSessions = localStorage.getItem('jpcs-ue-study-sessions');
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    };
    loadPlan();

    const handlePlanUpdate = () => loadPlan();
    window.addEventListener('jpcs-ue-plan-updated', handlePlanUpdate);

    return () => {
      window.removeEventListener('jpcs-ue-add-to-planner', handleAddSubject);
      window.removeEventListener('jpcs-ue-repeat-session', handleRepeatSession);
      window.removeEventListener('jpcs-ue-plan-updated', handlePlanUpdate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <ToolHeader 
        title="Study Planner"
        description="Generate an optimized study schedule with built-in breaks and subject interleaving."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ScrollReveal animation="slide-left">
            <div className="p-8 bg-[var(--surface)] border border-[var(--border)] space-y-8">
              <div className="space-y-4">
                <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Configuration</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-heading uppercase tracking-widest opacity-60">Total Study Time (Minutes)</label>
                  <input 
                    type="number" 
                    value={totalTime}
                    onChange={(e) => setTotalTime(parseInt(e.target.value) || 0)}
                    className={`w-full bg-[var(--background)] border p-4 font-logo text-2xl outline-none transition-colors ${totalTime < 15 || totalTime > 480 ? 'border-red-500 text-red-500' : 'border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)]'}`}
                  />
                  <div className="flex justify-between text-[10px] uppercase tracking-widest transition-colors">
                    <span className={totalTime < 15 ? 'text-red-500 font-bold' : 'opacity-40'}>min: 15m</span>
                    <span className={totalTime > 480 ? 'text-red-500 font-bold' : 'opacity-40'}>max: 480m</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Subjects to Focus On</h3>
                  <button 
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="text-[10px] uppercase tracking-widest text-[var(--primary)] hover:underline"
                  >
                    {showManualEntry ? 'Cancel' : 'Add Custom'}
                  </button>
                </div>

                {showManualEntry && (
                  <form onSubmit={addSubject} className="flex gap-2 animate-fade-in">
                    <input 
                      type="text" 
                      placeholder="Add subject..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="flex-1 bg-[var(--background)] border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--primary)] outline-none"
                    />
                    <button type="submit" className="p-2 bg-[var(--primary)] text-white hover:opacity-90">
                      <Sparkles size={18} />
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {subjects.map(s => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-heading uppercase tracking-widest truncate">{s.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateSubjectSessions(s.name, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[10px] hover:bg-[var(--primary)]/10"
                          >-</button>
                          <span className="text-[10px] font-logo w-4 text-center">{s.sessions}</span>
                          <button 
                            onClick={() => updateSubjectSessions(s.name, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[10px] hover:bg-[var(--primary)]/10"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => removeSubject(s.name)}
                          className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 transition-all font-bold"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {subjects.length === 0 && (
                    <p className="text-[10px] italic opacity-40 py-2 text-center text-orange-500">
                      No subjects. A generic plan will be generated.
                    </p>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={importFromTracker}
                  className="w-full py-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-[10px] font-heading uppercase tracking-widest text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all flex items-center justify-center gap-3"
                >
                  <CheckSquare size={14} /> Import Pending Tasks
                </button>
              </div>

              <button 
                type="button"
                onClick={(e) => generatePlan(e)}
                className="w-full py-4 bg-[var(--primary)] text-white font-heading text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
              >
                <RefreshCw size={16} /> Generate Schedule
              </button>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-2">
          {sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] p-20 opacity-20 text-center">
              <Layers size={64} className="mb-6" />
              <h3 className="font-heading text-xl uppercase tracking-widest">No Schedule Generated</h3>
              <p className="max-w-xs mx-auto mt-4 text-sm font-body">Configure your subjects and total time, then click generate to create your optimized study plan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <ScrollReveal animation="fade-up">
                <div className="flex items-center justify-between mb-6 px-4">
                  <h3 className="font-heading text-lg uppercase tracking-widest flex items-center gap-3">
                    <Calendar className="text-[var(--primary)]" size={20} />
                    Current Plan
                  </h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setSessions([]); localStorage.removeItem('jpcs-ue-study-sessions'); }} 
                      className="text-[10px] text-red-500 uppercase tracking-widest hover:underline"
                    >Clear</button>
                    <div className="text-[10px] font-heading uppercase tracking-widest opacity-60">
                      {sessions.filter(s => s.type === 'study').length} Blocks
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <ScrollReveal key={session.id} animation="fade-up" delay={index * 0.05}>
                    <div className={`flex items-center gap-6 p-4 border border-[var(--border)] transition-all ${session.completed ? 'opacity-40 grayscale pointer-events-none bg-[var(--background)]' : session.type === 'study' ? 'bg-[var(--surface)] border-l-4 border-l-[var(--primary)]' : 'bg-[var(--background)] opacity-80 border-l-4 border-l-[var(--c-yellow-dim)]'}`}>
                      
                      <div className="w-24 text-center">
                        <span className={`font-logo text-lg break-all ${session.completed ? 'line-through' : 'text-[var(--foreground)]'}`}>{session.startTime}</span>
                      </div>
                      
                      {editingIndex === index ? (
                        <div className="flex-1 flex gap-2 items-center">
                          {session.type === 'study' && (
                            <input 
                              className="flex-1 bg-[var(--background)] border border-[var(--border)] px-2 py-1 text-xs" 
                              value={editSubject} 
                              onChange={e => setEditSubject(e.target.value)} 
                            />
                          )}
                          <input 
                            type="number" 
                            className="w-16 bg-[var(--background)] border border-[var(--border)] px-2 py-1 text-xs" 
                            value={editDuration} 
                            onChange={e => setEditDuration(parseInt(e.target.value) || 0)} 
                          /> m
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center gap-4">
                          <div className={`p-2 rounded-md ${session.type === 'study' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]'}`}>
                            {session.type === 'study' ? <BookOpen size={18} /> : <Clock size={18} />}
                          </div>
                          <div>
                            <p className={`text-xs font-heading uppercase tracking-widest ${session.completed ? 'line-through' : (session.type === 'study' ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]')}`}>
                              {session.type === 'study' ? session.subject : 'Break'}
                            </p>
                            <p className="text-[10px] opacity-40">{session.type === 'study' ? 'Focused Session' : 'Rest and recover'}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {editingIndex === index ? (
                          <button onClick={() => saveEditedSession(index)} className="p-2 text-green-500 hover:bg-green-500/10 rounded">
                            <Check size={16} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            {!session.completed && (
                              <button 
                                onClick={() => { setEditingIndex(index); setEditSubject(session.subject || ''); setEditDuration(session.duration); }} 
                                className="p-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                                title="Edit Session"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button 
                              onClick={() => removeSession(session.id)}
                              className="p-2 text-[var(--foreground-muted)] hover:text-red-500 transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="text-right px-2 min-w-[3rem]">
                              <span className="font-heading text-[10px] uppercase tracking-widest opacity-60">{session.duration}m</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Premium CTA Block matching user screenshot */}
              <div className="mt-12 p-10 bg-[#FFF9F6] border border-[#FFE4D8] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-5%] opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 duration-700">
                  <Timer size={240} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 space-y-2">
                  <h3 className="font-heading text-2xl uppercase tracking-[0.3em] text-[#331111] font-bold">READY TO FOCUS?</h3>
                  <p className="text-[#886666] text-xs max-w-sm font-body leading-relaxed">
                    Once you've finalized your plan, move to Step 3 to start your deep work session with your optimized schedule.
                  </p>
                </div>
                
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('jpcs-ue-hub-switch', { detail: { tab: 'timer' } }))}
                  className="px-10 py-5 bg-[#B81D24] text-white font-heading text-xs uppercase tracking-[0.2em] hover:bg-[#96161C] transition-all flex items-center gap-4 shadow-[0_10px_30px_rgba(184,29,36,0.25)] group-hover:translate-y-[-2px] active:translate-y-[0px] font-bold"
                >
                  GO TO STEP 3: START FOCUSING <ChevronRight size={18} />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySessionPlanner;

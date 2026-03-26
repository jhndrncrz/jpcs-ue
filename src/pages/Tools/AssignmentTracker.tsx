import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, CheckCircle2, Clock, Play, Sparkles, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ToolHeader from '../../components/ui/ToolHeader';

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const AssignmentTracker: React.FC = () => {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('jpcs-ue-assignments', []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<{
    subject: string;
    title: string;
    dueDate: string;
    priority: Assignment['priority'];
  }>({
    subject: '',
    title: '',
    dueDate: '',
    priority: 'medium'
  });
  const [sessionCompletePrompt, setSessionCompletePrompt] = useState<{ subject: string; title: string; id: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const addAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = [];
    if (!formData.subject.trim()) newErrors.push('subject');
    if (!formData.title.trim()) newErrors.push('title');
    if (!formData.dueDate) newErrors.push('dueDate');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      ...formData,
      completed: false
    };

    setAssignments([...assignments, newAssignment]);
    setIsAdding(false);
    setFormData({ subject: '', title: '', dueDate: '', priority: 'medium' });
    setErrors([]);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const toggleAssignment = (id: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const target = new Date(dueDate);
    const diff = target.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d left`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h left`;
  };

  const focusOnAssignment = (assignment: Assignment) => {
    const event = new CustomEvent('jpcs-ue-pomodoro-start', { 
      detail: { subject: `${assignment.subject}: ${assignment.title}`, focusTime: 25 } 
    });
    window.dispatchEvent(event);
  };

  const addToPlanner = (assignment: Assignment) => {
    const event = new CustomEvent('jpcs-ue-add-to-planner', { 
      detail: { subject: assignment.subject } 
    });
    window.dispatchEvent(event);
  };

  React.useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('jpcs-ue-assignments');
      if (saved) {
        setAssignments(JSON.parse(saved));
      }
    };
    window.addEventListener('jpcs-ue-assignments-updated', handleUpdate);
    return () => window.removeEventListener('jpcs-ue-assignments-updated', handleUpdate);
  }, []);

  React.useEffect(() => {
    const handleSessionComplete = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject: string }>;
      const { subject } = customEvent.detail;
      if (!subject) return;

      const matchingAssignment = assignments.find(a => 
        !a.completed && (`${a.subject}: ${a.title}` === subject || a.subject === subject)
      );

      if (matchingAssignment) {
        setSessionCompletePrompt({ 
          subject: matchingAssignment.subject, 
          title: matchingAssignment.title, 
          id: matchingAssignment.id 
        });
      }
    };

    window.addEventListener('jpcs-ue-session-complete', handleSessionComplete);
    return () => window.removeEventListener('jpcs-ue-session-complete', handleSessionComplete);
  }, [assignments]);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">

      <ToolHeader 
        title="Assignment Tracker"
        description="Keep track of your academic deadlines and prioritize your workload effectively."
        primaryActions={[
          { label: "Add Assignment", icon: Plus, onClick: () => setIsAdding(!isAdding) }
        ]}
      />

      {sessionCompletePrompt && (
        <ScrollReveal animation="fade-in">
          <div className="mb-8 p-6 bg-[var(--primary)] text-white flex items-center justify-between gap-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-heading uppercase tracking-widest opacity-80">Session Complete!</p>
                <h3 className="font-heading text-lg">Did you finish "{sessionCompletePrompt.title}"?</h3>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('jpcs-ue-repeat-session', { detail: { subject: sessionCompletePrompt.subject }}));
                  setSessionCompletePrompt(null);
                }}
                className="px-4 py-2 border border-white/20 hover:bg-white/10 text-[10px] font-heading uppercase tracking-widest transition-colors"
              >
                No, Not Yet
              </button>
              <button 
                onClick={() => {
                  toggleAssignment(sessionCompletePrompt.id);
                  setSessionCompletePrompt(null);
                }}
                className="px-6 py-2 bg-white text-[var(--primary)] hover:bg-white/90 text-[10px] font-heading uppercase tracking-widest transition-colors font-bold"
              >
                Yes, Mark Done
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      {isAdding && (
        <ScrollReveal animation="fade-in">
          <div className="mb-12 p-8 bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary)]" />
            <form onSubmit={addAssignment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={e => {
                    setFormData({...formData, subject: e.target.value});
                    setErrors(errors.filter(err => err !== 'subject'));
                  }}
                  placeholder="e.g. CS101"
                  className={`w-full bg-[var(--background)] border p-3 text-sm outline-none transition-colors ${errors.includes('subject') ? 'border-red-500' : 'border-[var(--border)] focus:border-[var(--primary)]'}`}
                />
                {errors.includes('subject') && <p className="text-[8px] text-red-500 uppercase tracking-widest font-bold">Subject is required</p>}
              </div>
              <div className="space-y-2 md:col-span-1 lg:col-span-1">
                <label className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    setErrors(errors.filter(err => err !== 'title'));
                  }}
                  placeholder="e.g. Lab Report 1"
                  className={`w-full bg-[var(--background)] border p-3 text-sm outline-none transition-colors ${errors.includes('title') ? 'border-red-500' : 'border-[var(--border)] focus:border-[var(--primary)]'}`}
                />
                {errors.includes('title') && <p className="text-[8px] text-red-500 uppercase tracking-widest font-bold">Title is required</p>}
              </div>
              <div className="space-y-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Due Date</label>
                <input 
                  type="date" 
                  value={formData.dueDate}
                  onChange={e => {
                    setFormData({...formData, dueDate: e.target.value});
                    setErrors(errors.filter(err => err !== 'dueDate'));
                  }}
                  className={`w-full bg-[var(--background)] border p-3 text-sm outline-none transition-colors ${errors.includes('dueDate') ? 'border-red-500' : 'border-[var(--border)] focus:border-[var(--primary)]'}`}
                />
                {errors.includes('dueDate') && <p className="text-[8px] text-red-500 uppercase tracking-widest font-bold">Due date is required</p>}
              </div>
              <div className="space-y-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as Assignment['priority']})}
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-sm focus:border-[var(--primary)] outline-none appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setIsAdding(false); }}
                  className="px-6 py-2 border border-[var(--border)] text-xs font-heading uppercase tracking-widest hover:bg-[var(--surface)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[var(--primary)] text-white text-xs font-heading uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAssignments.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] opacity-30">
            <BookOpen size={48} className="mx-auto mb-4" />
            <p className="font-heading text-sm uppercase tracking-widest">No assignments tracked yet</p>
          </div>
        ) : (
          sortedAssignments.map((assignment, index) => (
            <ScrollReveal key={assignment.id} animation="fade-up" delay={index * 0.05}>
              <div className={`group p-6 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-all relative overflow-hidden ${assignment.completed ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[8px] font-heading uppercase tracking-widest border ${getPriorityColor(assignment.priority)}`}>
                    {assignment.priority} Priority
                  </div>
                  <div className="flex items-center gap-2">
                     {!assignment.completed && (
                        <>
                          <button 
                            type="button"
                            onClick={() => focusOnAssignment(assignment)}
                            className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors rounded opacity-0 group-hover:opacity-100"
                            title="Focus on this"
                          >
                            <Play size={14} fill="currentColor" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => addToPlanner(assignment)}
                            className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors rounded opacity-0 group-hover:opacity-100"
                            title="Add to Study Plan"
                          >
                            <Sparkles size={14} />
                          </button>
                        </>
                     )}
                    <button 
                      type="button"
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-1.5 text-[var(--foreground-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-6 space-y-1">
                  <p className="text-[10px] font-heading text-[var(--primary)] uppercase tracking-widest">{assignment.subject}</p>
                  <h3 className={`font-heading text-lg ${assignment.completed ? 'line-through' : ''}`}>{assignment.title}</h3>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-4 text-[var(--foreground-muted)] text-[10px]">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    {!assignment.completed && (
                      <div className={`flex items-center gap-1 ${getTimeRemaining(assignment.dueDate) === 'Overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                        <Clock size={12} />
                        {getTimeRemaining(assignment.dueDate)}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => toggleAssignment(assignment.id)}
                    className={`flex items-center gap-2 text-[10px] font-heading uppercase tracking-widest transition-colors ${assignment.completed ? 'text-green-500' : 'text-[var(--primary)] hover:text-[var(--foreground)]'}`}
                  >
                    {assignment.completed ? (
                      <>Done <CheckCircle2 size={14} /></>
                    ) : (
                      <>Complete <div className="w-3.5 h-3.5 border border-current rounded-full" /></>
                    )}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>

      <div className="mt-12 p-8 border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Calendar size={120} />
        </div>
        <div>
          <h3 className="font-heading text-xl uppercase tracking-widest mb-2">Ready to Plan?</h3>
          <p className="text-xs opacity-60 max-w-md">Once you've listed your assignments, move to Step 2 to organize them into an optimized study schedule.</p>
        </div>
        <button 
          onClick={() => addToPlanner({ subject: 'All Pending' } as Assignment)}
          className="px-8 py-4 bg-[var(--primary)] text-white font-heading text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-orange-500/20"
        >
          Go to Step 2: Plan Session <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-12 flex items-center justify-center gap-8 py-8 border-t border-[var(--border)] opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-heading uppercase tracking-widest">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[10px] font-heading uppercase tracking-widest">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-heading uppercase tracking-widest">Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTracker;

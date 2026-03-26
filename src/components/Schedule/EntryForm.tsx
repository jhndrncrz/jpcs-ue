import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';
import { type ScheduleEntry } from '../../utils/fileParsers';
import { DAYS } from './constants';

interface EntryFormProps {
  newEntry: Omit<ScheduleEntry, 'id'>;
  setNewEntry: (entry: Omit<ScheduleEntry, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const EntryForm: React.FC<EntryFormProps> = ({ newEntry, setNewEntry, onSave, onCancel, isEditing = false }) => {
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleSave = () => {
    const newErrors = [];
    if (!newEntry.subject.trim()) newErrors.push('subject');
    if (newEntry.day.length === 0) newErrors.push('day');
    
    // Time validation
    const start = newEntry.startTime.split(':').map(Number);
    const end = newEntry.endTime.split(':').map(Number);
    const startVal = start[0] * 60 + start[1];
    const endVal = end[0] * 60 + end[1];
    
    if (startVal >= endVal) newErrors.push('time');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    onSave();
  };

  return (
    <ScrollReveal animation="fade-up">
      <div className="mb-12 p-8 bg-[var(--surface)] border-2 border-[var(--primary)]">
        <h3 className="font-heading text-sm font-bold mb-6 uppercase tracking-widest text-[var(--foreground)]">
          {isEditing ? 'Modify Class Entry' : 'New Class Entry'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Subject Name</label>
            <input 
              type="text" 
              className={`w-full bg-[var(--background)] border p-3 font-heading text-sm outline-none transition-colors ${errors.includes('subject') ? 'border-red-500 text-red-500' : 'border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)]'}`}
              value={newEntry.subject}
              onChange={e => {
                setNewEntry({...newEntry, subject: e.target.value});
                setErrors(errors.filter(err => err !== 'subject'));
              }}
              placeholder="e.g. Data Structures"
            />
            {errors.includes('subject') && <p className="text-[8px] text-red-500 mt-1 uppercase tracking-widest font-bold">Subject name is required</p>}
            <div className="mt-4">
              <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Room / Location</label>
              <input 
                type="text" 
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 font-heading text-sm text-[var(--foreground)]"
                value={newEntry.room}
                onChange={e => setNewEntry({...newEntry, room: e.target.value})}
                placeholder="e.g. Room 402"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Start Time</label>
            <input 
              type="time" 
              step="1800"
              className={`w-full bg-[var(--background)] border p-3 font-heading text-sm outline-none transition-colors ${errors.includes('time') ? 'border-red-500 text-red-500' : 'border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)]'}`}
              value={newEntry.startTime}
              onChange={e => {
                setNewEntry({...newEntry, startTime: e.target.value});
                setErrors(errors.filter(err => err !== 'time'));
              }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">End Time</label>
            <input 
              type="time" 
              step="1800"
              className={`w-full bg-[var(--background)] border p-3 font-heading text-sm outline-none transition-colors ${errors.includes('time') ? 'border-red-500 text-red-500' : 'border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)]'}`}
              value={newEntry.endTime}
              onChange={e => {
                setNewEntry({...newEntry, endTime: e.target.value});
                setErrors(errors.filter(err => err !== 'time'));
              }}
            />
            {errors.includes('time') && <p className="text-[8px] text-red-500 mt-1 uppercase tracking-widest font-bold">Invalid time range</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Entry Style</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setNewEntry({...newEntry, renderType: 'solid'})}
                className={`p-3 text-[10px] font-heading border transition-all ${newEntry.renderType === 'solid' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
              >
                SOLID BACKGROUND
              </button>
              <button 
                onClick={() => setNewEntry({...newEntry, renderType: 'outline'})}
                className={`p-3 text-[10px] font-heading border transition-all ${newEntry.renderType === 'outline' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
              >
                OUTLINE STYLE
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Color Coding</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['var(--primary)', 'var(--c-orange)', '#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4'].map(color => (
                <button 
                  key={color}
                  onClick={() => setNewEntry({...newEntry, color})}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${newEntry.color === color ? 'border-[var(--foreground)] scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color.startsWith('var') ? `var(${color.match(/\(([^)]+)\)/)?.[1] || ''})` : color }}
                />
              ))}
              <input 
                type="color" 
                value={newEntry.color?.startsWith('var') ? '#000000' : newEntry.color}
                onChange={e => setNewEntry({...newEntry, color: e.target.value})}
                className="w-8 h-8 bg-transparent border-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-[10px] font-heading text-[var(--foreground-muted)] mb-2 uppercase tracking-widest">Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <button 
                key={day}
                onClick={() => {
                   const days = newEntry.day.includes(day) 
                    ? newEntry.day.filter((d: string) => d !== day)
                    : [...newEntry.day, day];
                   setNewEntry({...newEntry, day: days});
                   setErrors(errors.filter(err => err !== 'day'));
                }}
                className={`px-3 py-2 font-heading text-[10px] border transition-all ${newEntry.day.includes(day) ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : errors.includes('day') ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.includes('day') && <p className="text-[8px] text-red-500 mt-1 uppercase tracking-widest font-bold">Select at least one day</p>}
        </div>

        <div className="mt-8 flex justify-end gap-3">
           <button onClick={onCancel} className="px-6 py-2 font-heading text-xs uppercase tracking-widest text-[var(--foreground-muted)]">Cancel</button>
           <button onClick={handleSave} className="btn btn-primary py-2 px-6 text-xs uppercase tracking-widest">
             {isEditing ? 'Update Class' : 'Save Class'}
           </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default EntryForm;

import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';
import { THEMES, FONTS, DAYS } from './constants';

interface ScheduleConfig {
  theme: string;
  font: string;
  startHour: number;
  endHour: number;
  activeDays: string[];
}

interface ThemePanelProps {
  config: ScheduleConfig;
  setConfig: (config: ScheduleConfig) => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ config, setConfig }) => {
  return (
    <ScrollReveal animation="fade-up">
      <div className="mb-8 p-6 bg-[var(--surface)] border border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div>
             <label className="block text-[10px] uppercase font-heading text-[var(--foreground-muted)] mb-3 tracking-widest">Visual Theme</label>
             <div className="grid grid-cols-2 gap-2">
               {Object.entries(THEMES).map(([key, t]: [string, any]) => (
                 <button 
                   key={key}
                   onClick={() => setConfig({...config, theme: key})}
                   className={`p-2 text-[10px] font-heading border transition-all ${config.theme === key ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]'}`}
                 >
                   {t.name}
                 </button>
               ))}
             </div>
           </div>

            <div>
              <label className="block text-[10px] uppercase font-heading text-[var(--foreground-muted)] mb-3 tracking-widest">Typography</label>
              <select 
                className="w-full bg-[var(--background)] border border-[var(--border)] p-2 text-sm font-heading focus:border-[var(--primary)] outline-none"
                style={{ fontFamily: config.font }}
                value={config.font}
                onChange={e => setConfig({...config, font: e.target.value})}
              >
                {FONTS.map((f: string) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

           <div>
             <label className="block text1-10px] uppercase font-heading text-[var(--foreground-muted)] mb-3 tracking-widest">Daily Window</label>
             <div className="flex items-center gap-2">
               <input 
                type="number" min="0" max="23" 
                className="w-full bg-[var(--background)] border border-[var(--border)] p-2 text-xs text-center"
                value={config.startHour}
                onChange={e => setConfig({...config, startHour: parseInt(e.target.value) || 0})}
               />
               <span className="text-[var(--foreground-muted)]">–</span>
               <input 
                type="number" min="0" max="23"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-2 text-xs text-center"
                value={config.endHour}
                onChange={e => setConfig({...config, endHour: parseInt(e.target.value) || 0})}
               />
             </div>
           </div>

           <div>
             <label className="block text-[10px] uppercase font-heading text-[var(--foreground-muted)] mb-3 tracking-widest">Active Days</label>
             <div className="flex flex-wrap gap-1">
               {DAYS.map((day: string) => (
                 <button 
                   key={day}
                   onClick={() => {
                     const days = config.activeDays.includes(day)
                       ? config.activeDays.filter((d: string) => d !== day)
                       : [...config.activeDays, day];
                     setConfig({...config, activeDays: days});
                   }}
                   className={`w-8 h-8 flex items-center justify-center text-[10px] font-heading border transition-all ${config.activeDays.includes(day) ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
                 >
                   {day.substring(0, 1)}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ThemePanel;

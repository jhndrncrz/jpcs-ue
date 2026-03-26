import React, { useMemo } from 'react';
import { Trash2, Clock } from 'lucide-react';
import { type ScheduleEntry } from '../../utils/fileParsers';
import { THEMES } from './constants';
import { getContrastColor } from '../../utils/colors';

interface ScheduleGridProps {
  entries: ScheduleEntry[];
  config: {
    startHour: number;
    endHour: number;
    activeDays: string[];
    theme: string;
    font: string;
  };
  isReadOnly?: boolean;
  exportMode?: boolean;
  onDeleteEntry?: (id: string) => void;
  onEditEntry?: (id: string) => void;
  gridRef?: React.RefObject<HTMLDivElement>;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  entries, 
  config, 
  isReadOnly = false, 
  exportMode = false,
  onDeleteEntry,
  onEditEntry,
  gridRef
}) => {
  const activeTheme = useMemo(() => {
    return THEMES[config.theme as keyof typeof THEMES] || THEMES.default;
  }, [config.theme]);

  const SLOTS = useMemo(() => {
    const slots = [];
    for (let hour = config.startHour; hour <= config.endHour; hour++) {
      slots.push({ hour, minute: 0 });
      if (hour < config.endHour) {
        slots.push({ hour, minute: 30 });
      }
    }
    return slots;
  }, [config.startHour, config.endHour]);

  const getAllEntriesForSlot = (day: string, hour: number, minute: number) => {
    return entries.filter(e => {
      const [startH, startM] = e.startTime.split(':').map(Number);
      const [endH, endM] = e.endTime.split(':').map(Number);
      const slotTime = hour * 60 + minute;
      const startTime = startH * 60 + startM;
      const endTime = endH * 60 + endM;
      return e.day.includes(day) && slotTime >= startTime && slotTime < endTime;
    });
  };

  const gridStyles = {
    '--font-heading': config.font,
    '--font-body': config.font,
    '--background': activeTheme.bg,
    '--surface': activeTheme.bg,
    '--foreground': activeTheme.foreground,
    '--foreground-muted': activeTheme.foregroundMuted,
    '--primary': activeTheme.primary,
    '--c-orange': '#ff8200',
    '--c-red-dark': '#ac131e',
    '--c-orange-fire': '#ff5719',
    '--font-header': exportMode ? '12px' : '9px',
    '--font-time': exportMode ? '11px' : '8px',
    '--font-subject': exportMode ? '11px' : '8px',
    '--font-room': exportMode ? '8px' : '6px',
    '--cell-height': exportMode ? '6rem' : '4rem',
    fontFamily: config.font, 
    width: exportMode ? 'max-content' : 'auto'
  } as React.CSSProperties;

  return (
    <div 
      ref={gridRef} 
      className={exportMode ? "bg-transparent select-none" : "overflow-x-auto border border-[var(--border)] bg-[var(--surface)] shadow-2xl rounded-sm"} 
      style={{
        ...gridStyles,
        overflow: exportMode ? 'hidden' : 'auto'
      }}
    >
      <table className={exportMode ? "border-collapse table-fixed" : "w-full border-collapse table-fixed"} style={exportMode ? { width: 'max-content' } : undefined}>
        <thead>
          <tr>
            <th className="p-1 border border-[var(--border)] bg-[var(--background)] w-16"></th>
            {config.activeDays.map(day => (
              <th key={day} className="p-1 border border-[var(--border)] bg-[var(--background)] font-heading text-[var(--font-header)] uppercase tracking-widest text-[var(--foreground-muted)] min-w-[100px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(({ hour, minute }) => (
            <tr key={`${hour}-${minute}`}>
              <td className="p-0.5 border border-[var(--border)] bg-[var(--background)] font-heading text-[var(--font-time)] text-[var(--foreground-muted)] text-center">
                {minute === 0 ? (
                  <div className="font-bold">{hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}</div>
                ) : (
                  <div className="opacity-50">{hour > 12 ? `${hour - 12}:30` : hour === 12 ? '12:30' : `${hour}:30`}</div>
                )}
              </td>
              {config.activeDays.map(day => {
                const slotEntries = getAllEntriesForSlot(day, hour, minute);
                
                return (
                  <td key={day} className="border border-[var(--border)] p-0 relative group hover:bg-[var(--primary)]/5 transition-colors" style={{ height: 'var(--cell-height)' }}>
                    <div className="absolute inset-0 flex gap-0 p-[1px]">
                      {slotEntries.map(entry => {
                        const [startH, startM] = entry.startTime.split(':').map(Number);
                        const isStart = startH === hour && startM === minute;
                        
                        if (!isStart) return null;

                        const entryColor = entry.color && entry.color !== 'var(--primary)' ? entry.color : activeTheme.primary;

                        return (
                          <div 
                            key={entry.id}
                            className={`flex-1 min-w-0 z-10 p-1 border shadow-sm animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col ${config.theme === 'glass' ? 'backdrop-blur-md' : ''}`}
                            style={{ 
                              height: (() => {
                                const [sH, sM] = entry.startTime.split(':').map(Number);
                                const [eH, eM] = entry.endTime.split(':').map(Number);
                                const durationMinutes = (eH * 60 + eM) - (sH * 60 + sM);
                                return `calc(${durationMinutes / 30} * var(--cell-height) + ${(durationMinutes / 30) - 1}px)`;
                              })(),
                              minHeight: 'calc(var(--cell-height) - 4px)',
                              backgroundColor: entry.renderType === 'outline' ? 'transparent' : entryColor,
                              borderColor: entryColor,
                              borderLeftWidth: '3px',
                              borderStyle: 'solid',
                              color: entry.renderType === 'solid' ? getContrastColor(entryColor) : activeTheme.foreground
                            }}
                          >
                            <div className="flex justify-between items-start mb-0.5 gap-0.5">
                               <div className="flex flex-col min-w-0 flex-1">
                                 <span 
                                   className="font-heading text-[var(--font-subject)] font-bold leading-none break-words whitespace-normal" 
                                   style={{ color: entry.renderType === 'solid' ? getContrastColor(entryColor) : entryColor }}
                                   title={entry.subject}
                                 >
                                   {entry.subject}
                                 </span>
                                 {entry.room && (
                                   <span 
                                     className="text-[var(--font-room)] font-heading uppercase tracking-tighter mt-0.5 break-words whitespace-normal opacity-90 leading-tight"
                                     style={{ color: entry.renderType === 'solid' ? (getContrastColor(entryColor) === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)') : 'var(--foreground-muted)' }}
                                   >
                                     {entry.room}
                                   </span>
                                 )}
                               </div>
                               {!isReadOnly && (
                                 <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                   {onEditEntry && (
                                     <button onClick={() => onEditEntry(entry.id)} className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                                       <Clock size={8} className="rotate-0 hover:rotate-12" />
                                     </button>
                                   )}
                                   {onDeleteEntry && (
                                     <button onClick={() => onDeleteEntry(entry.id)} className="text-[var(--foreground-muted)] hover:text-red-500 transition-colors">
                                       <Trash2 size={8} />
                                     </button>
                                   )}
                                 </div>
                               )}
                            </div>
                            <div 
                              className="mt-auto flex items-center gap-0.5 text-[var(--font-room)] font-heading truncate opacity-70"
                              style={{ color: entry.renderType === 'solid' ? (getContrastColor(entryColor) === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)') : 'var(--foreground-muted)' }}
                            >
                               <Clock size={6} /> {entry.startTime}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleGrid;

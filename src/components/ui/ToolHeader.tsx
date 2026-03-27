import React, { useState } from 'react';
import { type LucideIcon, HelpCircle, ShieldAlert } from 'lucide-react';
import HelpModal from './HelpModal';

interface ToolAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  component?: React.ReactNode;
}

interface ToolHeaderProps {
  title: string;
  description: string;
  primaryActions?: ToolAction[];
  secondaryActions?: ToolAction[];
  dataActions?: ToolAction[];
  helpContent?: React.ReactNode;
  showDisclaimer?: boolean;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ 
  title, 
  description, 
  primaryActions = [], 
  secondaryActions = [],
  dataActions = [],
  helpContent,
  showDisclaimer = false
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl text-[var(--foreground)]">{title}</h1>
            {helpContent && (
              <button 
                onClick={() => setIsHelpOpen(true)}
                className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                title="View Guide"
              >
                <HelpCircle size={20} />
              </button>
            )}
          </div>
          <p className="text-[var(--foreground-muted)] font-heading text-sm max-w-xl">{description}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {primaryActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`btn btn-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/20 ${action.className || ''}`}
            >
              <action.icon size={16} />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showDisclaimer && (
        <div className="mt-8 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex gap-5 items-start relative overflow-hidden group transition-all hover:border-[var(--primary)]/50">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--c-orange)] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
          
          <div className="relative z-10 p-2.5 bg-[var(--primary)]/10 rounded-xl shrink-0">
             <ShieldAlert size={22} className="text-[var(--primary)]" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-1.5">
            <span className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
              Official Disclaimer
            </span>
            <p className="font-body text-xs text-[var(--foreground-muted)] leading-relaxed max-w-4xl">
              All calculations provided by this utility are <strong>unofficial</strong> and intended for <strong>estimation purposes only</strong>. Final results are subject to official university records, in accordance with the UE Student Manual and faculty discretion. Please refer to official university announcements for finalized academic results.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-[var(--border)]/30">
        <div className="flex items-center gap-2">
          {secondaryActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`btn btn-outline px-3 py-1.5 text-[10px] uppercase tracking-widest ${action.className || ''}`}
            >
              <action.icon size={14} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
          <div className="flex items-center gap-2">
            {dataActions.map((action, idx) => (
              action.component ? <React.Fragment key={idx}>{action.component}</React.Fragment> : (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`btn btn-ghost p-2 ${action.className || ''}`}
                  title={action.label}
                >
                  <action.icon size={16} />
                  <span className="text-[10px] font-heading uppercase tracking-widest hidden sm:inline">{action.label}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {helpContent && (
        <HelpModal 
          isOpen={isHelpOpen} 
          onClose={() => setIsHelpOpen(false)} 
          title={title}
        >
          {helpContent}
        </HelpModal>
      )}
    </div>
  );
};

export default ToolHeader;

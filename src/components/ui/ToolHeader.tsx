import React, { useState } from 'react';
import { type LucideIcon, HelpCircle } from 'lucide-react';
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
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ 
  title, 
  description, 
  primaryActions = [], 
  secondaryActions = [],
  dataActions = [],
  helpContent
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

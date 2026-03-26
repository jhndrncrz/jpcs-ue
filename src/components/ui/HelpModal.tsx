import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl z-[101] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--primary)]/10">
                  <HelpCircle size={20} className="text-[var(--primary)]" />
                </div>
                <h2 className="font-heading text-lg font-bold text-[var(--foreground)]">{title} Guide</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[var(--border)] transition-colors text-[var(--foreground-muted)]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="prose prose-sm prose-invert max-w-none font-body text-[var(--foreground-muted)] leading-relaxed">
                {children}
              </div>
            </div>

            <div className="p-4 bg-[var(--border)]/10 flex justify-end">
              <button 
                onClick={onClose}
                className="btn btn-primary px-6 py-2 text-xs uppercase tracking-widest hover:bg-[var(--primary-hover)]"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;

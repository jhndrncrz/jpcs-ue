import React, { useMemo } from 'react';
import { Target, Info, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ScrollReveal from '../../components/ui/ScrollReveal';
import ToolHeader from '../../components/ui/ToolHeader';

const TargetGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Target GWA Calculator</h3>
      <p>This tool helps you estimate the average grade you need in your remaining units to hit a specific GWA target.</p>
    </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)] text-[11px]">
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">How to use</h3>
      <ul className="list-decimal pl-5 space-y-2 mt-2">
        <li>Enter your <strong>Current GWA</strong> and total <strong>Completed Units</strong>.</li>
        <li>Enter your <strong>Target GWA</strong> (e.g., 1.50).</li>
        <li>Enter the number of <strong>Remaining Units</strong> in your curriculum.</li>
      </ul>
    </div>

    <div className="bg-[var(--border)]/10 p-4 text-[10px] italic">
      Note: The calculation uses a weighted average formula:
      <br />
      Grade Needed = (Target × Total Units - Current GWA × Completed Units) / Remaining Units
    </div>
  </div>
);

const TargetGradeCalculator: React.FC = () => {
  const [currentGwa, setCurrentGwa] = useLocalStorage<string>('jpcs-ue-target-current-gwa', '');
  const [completedUnits, setCompletedUnits] = useLocalStorage<string>('jpcs-ue-target-completed-units', '');
  const [targetGwa, setTargetGwa] = useLocalStorage<string>('jpcs-ue-target-target-gwa', '');
  const [remainingUnits, setRemainingUnits] = useLocalStorage<string>('jpcs-ue-target-remaining-units', '');

  const requiredGrade = useMemo(() => {
    const cgwa = parseFloat(currentGwa);
    const cunits = parseFloat(completedUnits);
    const tgwa = parseFloat(targetGwa);
    const runits = parseFloat(remainingUnits);

    if (!isNaN(cgwa) && !isNaN(cunits) && !isNaN(tgwa) && !isNaN(runits) && runits > 0) {
      return (tgwa * (cunits + runits) - (cgwa * cunits)) / runits;
    }
    return null;
  }, [currentGwa, completedUnits, targetGwa, remainingUnits]);

  const clearInputs = () => {
    setCurrentGwa('');
    setCompletedUnits('');
    setTargetGwa('');
    setRemainingUnits('');
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <ToolHeader 
        title="Target GWA Calculator"
        description="Determine what average grade you need for the remaining units to reach your graduation goal or honor target."
        helpContent={<TargetGuide />}
        dataActions={[
          { label: "Reset", icon: RefreshCw, onClick: clearInputs }
        ]}
        showDisclaimer={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-heading text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">Current GWA</label>
              <input 
                type="number" 
                step="0.0001"
                placeholder="e.g. 1.75"
                className={`w-full bg-[var(--surface)] border p-3 font-heading outline-none transition-colors ${currentGwa && (parseFloat(currentGwa) < 1.0 || parseFloat(currentGwa) > 5.0) ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]'}`}
                value={currentGwa}
                onChange={(e) => setCurrentGwa(e.target.value)}
              />
              {currentGwa && (parseFloat(currentGwa) < 1.0 || parseFloat(currentGwa) > 5.0) && (
                <p className="text-[9px] text-red-500 mt-1 uppercase tracking-widest font-bold">Grade must be between 1.00 and 5.00</p>
              )}
            </div>
            <div>
              <label className="block font-heading text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">Completed Units</label>
              <input 
                type="number" 
                placeholder="e.g. 60"
                className={`w-full bg-[var(--surface)] border p-3 font-heading outline-none transition-colors ${completedUnits && parseFloat(completedUnits) < 0 ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]'}`}
                value={completedUnits}
                onChange={(e) => setCompletedUnits(e.target.value)}
              />
              {completedUnits && parseFloat(completedUnits) < 0 && (
                <p className="text-[9px] text-red-500 mt-1 uppercase tracking-widest font-bold">Units cannot be negative</p>
              )}
            </div>
            <div>
              <label className="block font-heading text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">Target GWA</label>
              <input 
                type="number" 
                step="0.0001"
                placeholder="e.g. 1.50"
                className={`w-full bg-[var(--surface)] border p-3 font-heading outline-none transition-colors ${targetGwa && (parseFloat(targetGwa) < 1.0 || parseFloat(targetGwa) > 5.0) ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]'}`}
                value={targetGwa}
                onChange={(e) => setTargetGwa(e.target.value)}
              />
              {targetGwa && (parseFloat(targetGwa) < 1.0 || parseFloat(targetGwa) > 5.0) && (
                <p className="text-[9px] text-red-500 mt-1 uppercase tracking-widest font-bold">Grade must be between 1.00 and 5.00</p>
              )}
            </div>
            <div>
              <label className="block font-heading text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">Remaining Units</label>
              <input 
                type="number" 
                placeholder="e.g. 40"
                className={`w-full bg-[var(--surface)] border p-3 font-heading outline-none transition-colors ${remainingUnits && parseFloat(remainingUnits) <= 0 ? 'border-red-500 text-red-500' : 'border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]'}`}
                value={remainingUnits}
                onChange={(e) => setRemainingUnits(e.target.value)}
              />
              {remainingUnits && parseFloat(remainingUnits) <= 0 && (
                <p className="text-[9px] text-red-500 mt-1 uppercase tracking-widest font-bold">Units must be greater than 0</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <ScrollReveal animation="scale">
            <div className="p-8 bg-[var(--surface)] border border-[var(--primary)] relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Target size={64} />
              </div>
              
              <p className="font-heading text-xs uppercase tracking-widest text-[var(--foreground-muted)] mb-2">Required Average Grade</p>
              <div className="text-5xl font-logo text-[var(--foreground)] mb-4">
                {requiredGrade !== null ? requiredGrade.toFixed(4) : '--'}
              </div>

              <div className="h-px bg-[var(--border)] mb-4" />
              
              <div className="font-body text-xs text-[var(--foreground-muted)] leading-relaxed italic">
                {requiredGrade !== null 
                  ? requiredGrade < 1.0 
                    ? "Impossible! That target is too high." 
                    : requiredGrade > 3.0 
                    ? "Careful! A grade lower than 3.00 is considered a failure (5.00)." 
                    : "Work hard to maintain this average grade."
                  : "Input your data to see the result."}
              </div>
            </div>
          </ScrollReveal>

          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
            <Info size={16} className="text-[var(--primary)] mt-1 flex-shrink-0" />
            <p className="font-body text-[10px] text-[var(--foreground-muted)] leading-relaxed">
              <strong>Tip:</strong> You can find your completed units and current GWA in your student portal on the "Grades" or "Curriculum" tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetGradeCalculator;

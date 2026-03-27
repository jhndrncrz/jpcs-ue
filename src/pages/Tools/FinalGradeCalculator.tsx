import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Calculator, Settings2, Sparkles, School, BarChart3 } from 'lucide-react';
import { 
  calculateCumulativeMidterm, 
  calculateCumulativeFinal, 
  calculateCategoryScore, 
  transmutePercentage,
  getUEGrade,
  CategoryCalcMode,
  type GradeEntry 
} from '../../utils/gradeCalculations';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ToolHeader from '../../components/ui/ToolHeader';
import GradeSelect from '../../components/ui/GradeSelect';
import ScrollReveal from '../../components/ui/ScrollReveal';

const GradeCalculatorGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">UE Grading System</h3>
      <p>Grades are calculated <strong>cumulatively</strong> across three terms:</p>
      <ul className="list-disc pl-5 mt-2 space-y-2 text-[11px]">
        <li><strong>Prelim:</strong> 100% of your prelim activities.</li>
        <li><strong>Midterm:</strong> 1/3 (Prelim Grade) + 2/3 (Tentative Midterm Grade).</li>
        <li><strong>Finals:</strong> 1/3 (Midterm Grade) + 2/3 (Tentative Final Grade).</li>
      </ul>
    </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)]">
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Catch-up Mode Guide</h3>
      <p className="mb-2">This mode is for <strong>planning</strong>. It calculates what you need in your <em>remaining</em> tasks to reach a target grade.</p>
      <div className="space-y-3 mt-4 text-[11px]">
        <div className="flex gap-3">
          <div className="font-bold text-[var(--primary)]">1.</div>
          <div><strong>Set Target:</strong> Choose your goal (e.g., 1.50) in the period header.</div>
        </div>
        <div className="flex gap-3">
          <div className="font-bold text-[var(--primary)]">2.</div>
          <div><strong>Check "Needed":</strong> The sidebar will show the required average score for unfilled categories.</div>
        </div>
        <div className="flex gap-3">
          <div className="font-bold text-[var(--primary)]">3.</div>
          <div><strong>Magic Wand:</strong> Click <Sparkles size={12} className="inline" /> to auto-fill empty categories with realistic hypothetical scores that meet your target.</div>
        </div>
      </div>
    </div>

    <div className="text-[10px] italic text-[var(--foreground-muted)] p-2 bg-[var(--surface)] border border-[var(--border)]">
      Note: If a target is impossible (requires &gt; 100% or &lt; 0%), the calculator will cap the recommendation at its limits.
    </div>
  </div>
);

interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  calcMode: CategoryCalcMode;
  applicableTerms: ('prelim' | 'midterm' | 'final')[];
}

const FinalGradeCalculator: React.FC = () => {
  const [categories, setCategories] = useLocalStorage<GradeCategory[]>('jpcs-ue-final-categories', [
    { id: '1', name: 'Activities', weight: 0.2, calcMode: CategoryCalcMode.AVERAGE_PERCENTAGE, applicableTerms: ['prelim', 'midterm', 'final'] },
    { id: '2', name: 'Quizzes', weight: 0.2, calcMode: CategoryCalcMode.AVERAGE_PERCENTAGE, applicableTerms: ['prelim', 'midterm', 'final'] },
    { id: '3', name: 'Labs', weight: 0.2, calcMode: CategoryCalcMode.AVERAGE_PERCENTAGE, applicableTerms: ['prelim', 'midterm', 'final'] },
    { id: '4', name: 'Exam', weight: 0.3, calcMode: CategoryCalcMode.TOTAL_SCORE, applicableTerms: ['prelim', 'midterm', 'final'] },
    { id: '5', name: 'Attendance/Recitation', weight: 0.1, calcMode: CategoryCalcMode.AVERAGE_PERCENTAGE, applicableTerms: ['final'] }
  ]);

  const [entries, setEntries] = useLocalStorage<GradeEntry[]>('jpcs-ue-final-entries', []);
  const [showSettings, setShowSettings] = useState(false);
  const [includeHypothetical, _setIncludeHypothetical] = useState(true);
  const [catchUpMode, setCatchUpMode] = useState(false);

  const setIncludeHypothetical = (val: boolean) => {
    if (catchUpMode) return;
    _setIncludeHypothetical(val);
  };

  // Force hypothetical true when catch-up is on
  React.useEffect(() => {
    if (catchUpMode) _setIncludeHypothetical(true);
  }, [catchUpMode]);
  const [targetGrades, setTargetGrades] = useLocalStorage<Record<string, number>>('jpcs-ue-target-grades', {
    prelim: 1.5,
    midterm: 1.5,
    final: 1.5
  });

  // ... calculateTermData logic ...
  const termGrades = useMemo(() => {
    const calculateTermData = (term: 'prelim' | 'midterm' | 'final') => {
      let totalWeighted = 0;
      let activeWeightSum = 0;
      const termNormalizedWeights: Record<string, number> = {};

      const applicableCategories = categories.filter(cat => cat.applicableTerms.includes(term));
      const termEntries = entries.filter(e => {
        if (e.term !== term) return false;
        if (e.isHypothetical && !includeHypothetical) return false;
        return true;
      });

      const categoriesWithEntries = applicableCategories.filter(cat => 
        termEntries.some(e => e.categoryId === cat.id)
      );

      const targetCategories = categoriesWithEntries.length > 0 ? categoriesWithEntries : applicableCategories;
      const targetWeightSum = targetCategories.reduce((sum, cat) => sum + cat.weight, 0);

      applicableCategories.forEach(cat => {
        const catEntries = termEntries.filter(e => e.categoryId === cat.id);
        
        if (targetWeightSum > 0 && targetCategories.some(tc => tc.id === cat.id)) {
          termNormalizedWeights[cat.id] = cat.weight / targetWeightSum;
        } else {
          termNormalizedWeights[cat.id] = 0;
        }

        if (catEntries.length > 0) {
          const rawCatScore = calculateCategoryScore(catEntries, cat.calcMode);
          const transmutedCatScore = transmutePercentage(rawCatScore);
          totalWeighted += (transmutedCatScore / 100) * cat.weight;
          activeWeightSum += cat.weight;
        }
      });

      // Intra-term recommendation metrics
      const totalApplicableWeight = applicableCategories.reduce((sum, cat) => sum + cat.weight, 0);
      const remainingWeight = applicableCategories
        .filter(cat => !termEntries.some(e => e.categoryId === cat.id))
        .reduce((sum, cat) => sum + cat.weight, 0);

      // Percentage display based on ACTIVE categories (Normalization)
      const normalizedRawPercentage = activeWeightSum > 0 ? (totalWeighted / activeWeightSum) * 100 : 0;
      const normalizedPercentage = Math.round(normalizedRawPercentage);
      const normalizedGrade = getUEGrade(normalizedPercentage);

      // Percentage for cumulative/GWA calculation based on TOTAL applicable weight
      const totalRawPercentage = totalApplicableWeight > 0 ? (totalWeighted / totalApplicableWeight) * 100 : 0;
      const transmutedPercentage = Math.round(totalRawPercentage);
      const termGrade = getUEGrade(transmutedPercentage);

      return { 
        grade: termGrade, 
        transmutedPercentage,
        normalizedPercentage,
        normalizedGrade,
        totalWeighted,
        activeWeightSum,
        totalApplicableWeight,
        remainingWeight,
        normalizedWeights: termNormalizedWeights 
      };
    };

    const pData = calculateTermData('prelim');
    const tentativeMData = calculateTermData('midterm');
    
    // Percentage-first cumulative:
    const rawCumulativeMPerc = calculateCumulativeMidterm(pData.transmutedPercentage, tentativeMData.transmutedPercentage);
    const cumulativeMPerc = Math.round(rawCumulativeMPerc);
    const m = getUEGrade(cumulativeMPerc);

    const tentativeFData = calculateTermData('final');
    // Percentage-first cumulative:
    const rawCumulativeFPerc = calculateCumulativeFinal(cumulativeMPerc, tentativeFData.transmutedPercentage);
    const cumulativeFPerc = Math.round(rawCumulativeFPerc);
    const f = getUEGrade(cumulativeFPerc);

    return {
      prelim: pData,
      midterm: { 
        ...tentativeMData, 
        cumulativeGrade: m,
        cumulativePercentage: cumulativeMPerc 
      },
      final: { 
        ...tentativeFData, 
        cumulativeGrade: f,
        cumulativePercentage: cumulativeFPerc 
      },
      normalizedWeights: {
        prelim: pData.normalizedWeights,
        midterm: tentativeMData.normalizedWeights,
        final: tentativeFData.normalizedWeights
      }
    };
  }, [entries, categories, includeHypothetical]);

  const addEntry = (term: 'prelim' | 'midterm' | 'final', categoryId: string) => {
    setEntries(prev => [...prev, {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      score: 0,
      total: 100,
      categoryId,
      term
    }]);
  };

  const updateEntry = (id: string, field: keyof GradeEntry, value: string | number | boolean) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleTermApplicability = (catId: string, term: 'prelim' | 'midterm' | 'final') => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        const terms = c.applicableTerms.includes(term)
          ? c.applicableTerms.filter(t => t !== term)
          : [...c.applicableTerms, term];
        return { ...c, applicableTerms: terms };
      }
      return c;
    }));
  };

  const clearAllData = () => {
    if (window.confirm('Clear all grade entries? Your configuration will be saved.')) {
      setEntries([]);
    }
  };

  const autoFillTerm = (term: 'prelim' | 'midterm' | 'final') => {
    const thresholds = [
      { p: 98, g: 1.0 }, { p: 95, g: 1.25 }, { p: 92, g: 1.5 }, { p: 89, g: 1.75 },
      { p: 86, g: 2.0 }, { p: 83, g: 2.25 }, { p: 80, g: 2.5 }, { p: 77, g: 2.75 },
      { p: 75, g: 3.0 }, { p: 70, g: 4.0 }, { p: 0, g: 5.0 }
    ];
    const periodTargetGrade = targetGrades[term] || 1.5;
    
    // Target threshold exactly (integer rounding covers the bracket)
    const baseTargetPercent = [...thresholds].reverse().find(t => t.g <= periodTargetGrade)?.p || 75;
    const targetThreshold = baseTargetPercent;
    
    let neededTermPerc = targetThreshold;
    if (term === 'midterm') {
      neededTermPerc = (3 * targetThreshold - termGrades.prelim.transmutedPercentage) / 2;
    } else if (term === 'final') {
      neededTermPerc = (3 * targetThreshold - termGrades.midterm.cumulativePercentage) / 2;
    }

    const applicableCategories = categories.filter(cat => cat.applicableTerms.includes(term));
    const termEntries = entries.filter(e => e.term === term);
    const totalApplicableWeight = applicableCategories.reduce((sum, cat) => sum + cat.weight, 0);
    
    if (neededTermPerc > 100 || neededTermPerc < 50) {
      alert(`Target Grade ${periodTargetGrade.toFixed(2)} is NOT attainable. Needed: ${neededTermPerc.toFixed(1)}% | Range: [50% - 100%]`);
      return;
    }

    // Fixed: Scale by totalApplicableWeight to match calculateTermData normalization
    const totalGoalWeightSum = (neededTermPerc / 100) * totalApplicableWeight;
    
    // Categorize entries and categories
    const entriesToUpdate = termEntries.filter(e => e.isHypothetical || e.score === 0);
    let fixedTransmutedWeightSum = 0;
    const variableCategories: Array<{
      cat: typeof categories[0],
      variableEntries: GradeEntry[],
      needsNewEntry: boolean
    }> = [];

    applicableCategories.forEach(cat => {
      const catEntries = termEntries.filter(e => e.categoryId === cat.id);
      const catVarEntries = catEntries.filter(e => entriesToUpdate.some(eu => eu.id === e.id));
      
      if (catVarEntries.length === 0 && catEntries.length > 0) {
        // Entire category is fixed
        const catScore = calculateCategoryScore(catEntries, cat.calcMode);
        fixedTransmutedWeightSum += (catScore / 100) * cat.weight;
      } else {
        variableCategories.push({
          cat,
          variableEntries: catVarEntries,
          needsNewEntry: catEntries.length === 0
        });
      }
    });

    if (variableCategories.length === 0) {
      alert("No updateable or empty segments found in this term!");
      return;
    }

    let missingTransmutedWeightSum = Math.max(0, totalGoalWeightSum - fixedTransmutedWeightSum);
    let currentRemainingVarWeight = variableCategories.reduce((sum, vc) => sum + vc.cat.weight, 0);

    const updatedEntriesMap: Record<string, number> = {};
    const newEntries: GradeEntry[] = [];

    variableCategories.forEach((vc, idx) => {
      const isLast = idx === variableCategories.length - 1;
      // Add randomness to category distribution: jitter between 0.8x and 1.2x
      const jitter = 0.8 + Math.random() * 0.4;
      const shareOfRemaining = vc.cat.weight / currentRemainingVarWeight;
      
      let targetCatWeightContribution = isLast ? missingTransmutedWeightSum : missingTransmutedWeightSum * shareOfRemaining * jitter;
      
      // Ensure the contribution is within the category's valid range (0.5 to 1.0 multiplier of weight)
      // (Wait, transmuted percentage range is 50-100, so contribution range is 0.5*weight to 1.0*weight)
      const maxPossible = vc.cat.weight * 1.0;
      const minPossible = vc.cat.weight * 0.5;
      targetCatWeightContribution = Math.max(minPossible, Math.min(maxPossible, targetCatWeightContribution));
      
      // Secondary check: ensure we don't consume so much that remaining categories cannot reach even 0.5 transmuted
      // OR consume so little that remaining categories would need > 1.0 transmuted
      if (!isLast) {
        const remainingMissing = missingTransmutedWeightSum - targetCatWeightContribution;
        const remainingVarWeight = currentRemainingVarWeight - vc.cat.weight;
        
        if (remainingMissing > (remainingVarWeight * 1.0)) {
          targetCatWeightContribution += (remainingMissing - remainingVarWeight * 1.0);
        } else if (remainingMissing < (remainingVarWeight * 0.5)) {
          targetCatWeightContribution -= (remainingVarWeight * 0.5 - remainingMissing);
        }
      }

      missingTransmutedWeightSum -= targetCatWeightContribution;
      currentRemainingVarWeight -= vc.cat.weight;
      
      const targetCatScore = (targetCatWeightContribution / vc.cat.weight) * 100;
      const catEntries = termEntries.filter(e => e.categoryId === vc.cat.id);
      
      if (vc.cat.calcMode === 'Average Percentage') {
        const numTotal = vc.needsNewEntry ? 1 : catEntries.length;
        // Target raw cat score is based on the inverse of transmutePercentage
        const targetRawCatScore = Math.max(0, (targetCatScore - 50) * 2);
        
        const fixedRawSum = catEntries.filter(e => !vc.variableEntries.some(ve => ve.id === e.id))
                                         .reduce((s, e) => s + (e.score / e.total) * 100, 0);
        
        let neededVarRawPercSum = targetRawCatScore * numTotal - fixedRawSum;
        
        const varList = vc.needsNewEntry ? [null] : vc.variableEntries;
        varList.forEach((ve, vIdx) => {
          const isVarLast = vIdx === varList.length - 1;
          const share = isVarLast ? neededVarRawPercSum : (neededVarRawPercSum / (varList.length - vIdx)) * (0.9 + Math.random() * 0.2);
          const rawPerc = Math.max(0, Math.min(100, Math.round(share)));
          neededVarRawPercSum -= rawPerc;
          
          if (ve === null) {
            newEntries.push({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
              score: rawPerc, total: 100, categoryId: vc.cat.id, term, isHypothetical: true
            });
          } else {
            updatedEntriesMap[ve.id] = rawPerc;
          }
        });
      } else {
        // Total Score mode
        const fixedScoresSum = catEntries.filter(e => !vc.variableEntries.some(ve => ve.id === e.id)).reduce((s, e) => s + e.score, 0);
        const fixedTotalsSum = catEntries.filter(e => !vc.variableEntries.some(ve => ve.id === e.id)).reduce((s, e) => s + e.total, 0);
        const varTotalsSum = vc.needsNewEntry ? 100 : vc.variableEntries.reduce((s, e) => s + e.total, 0);
        const totalPossible = fixedTotalsSum + varTotalsSum;
        
        const rawPerc = (targetCatScore - 50) * 2;
        let neededVarScoresSum = Math.max(0, (rawPerc / 100) * totalPossible - fixedScoresSum);
        
        const varList = vc.needsNewEntry ? [null] : vc.variableEntries;
        varList.forEach((ve, vIdx) => {
          const isVarLast = vIdx === varList.length - 1;
          const share = isVarLast ? neededVarScoresSum : (neededVarScoresSum / (varList.length - vIdx)) * (0.95 + Math.random() * 0.1);
          const limit = ve ? ve.total : 100;
          const score = Math.max(0, Math.min(limit, Math.round(share)));
          neededVarScoresSum -= score;
          
          if (ve === null) {
            newEntries.push({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
              score, total: 100, categoryId: vc.cat.id, term, isHypothetical: true
            });
          } else {
            updatedEntriesMap[ve.id] = score;
          }
        });
      }
    });

    setEntries(prev => {
      const updated = prev.map(e => updatedEntriesMap[e.id] !== undefined ? { ...e, score: updatedEntriesMap[e.id], isHypothetical: true } : e);
      return [...updated, ...newEntries];
    });

    // Final Verification (Predicted Outcome)
    // Recalculate accurately based on the new term summation rules
    let finalTransmutedWeightSum = 0;
    applicableCategories.forEach(cat => {
      const catEntriesAfter = [...termEntries, ...newEntries].filter(e => e.categoryId === cat.id).map(e => {
        if (updatedEntriesMap[e.id] !== undefined) return { ...e, score: updatedEntriesMap[e.id] };
        return e;
      });
      
      if (catEntriesAfter.length > 0) {
        const rawCatScore = calculateCategoryScore(catEntriesAfter, cat.calcMode);
        const transmutedCatScore = transmutePercentage(rawCatScore);
        finalTransmutedWeightSum += (transmutedCatScore / 100) * cat.weight;
      }
    });

    const predictedRawPerc = totalApplicableWeight > 0 ? (finalTransmutedWeightSum / totalApplicableWeight) * 100 : 0;
    const predictedTentativePerc = Math.round(predictedRawPerc);
    
    let predictedActualPerc = predictedTentativePerc;
    if (term === 'midterm') {
      predictedActualPerc = Math.round(calculateCumulativeMidterm(termGrades.prelim.transmutedPercentage, predictedTentativePerc));
    } else if (term === 'final') {
      predictedActualPerc = Math.round(calculateCumulativeFinal(termGrades.midterm.cumulativePercentage, predictedTentativePerc));
    }
    
    const predictedGrade = getUEGrade(predictedActualPerc);
    const isSuccess = predictedGrade <= periodTargetGrade + 0.001;

    setTimeout(() => {
      if (isSuccess) {
        alert(`✅ Magic Wand: Target Grade ${periodTargetGrade.toFixed(2)} achieved for ${term} period! (${predictedGrade.toFixed(2)} - ${predictedActualPerc.toFixed(1)}%)`);
      } else {
        alert(`⚠️ Magic Wand: Target Grade ${periodTargetGrade.toFixed(2)} reached closest approximation (${predictedGrade.toFixed(2)} - ${predictedActualPerc.toFixed(1)}%).`);
      }
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <ToolHeader 
        title="Smart Grade Calculator"
        description="Granular grade tracking with custom weights and term visibility based on UE's grading system."
        helpContent={<GradeCalculatorGuide />}
        primaryActions={[
          { 
            label: catchUpMode ? "Standard Mode" : "Catch-up Mode", 
            icon: catchUpMode ? Calculator : Sparkles, 
            onClick: () => setCatchUpMode(!catchUpMode), 
            className: catchUpMode ? "bg-[var(--c-orange)] text-white shadow-[var(--c-orange)]/20 shadow-lg" : "" 
          },
          { label: "Settings", icon: Settings2, onClick: () => setShowSettings(!showSettings), className: showSettings ? "bg-white text-[var(--primary)] border-[var(--primary)]" : "" }
        ]}
        secondaryActions={[
          { 
            label: includeHypothetical ? "Hide Hypothetical" : "Show Hypothetical", 
            icon: includeHypothetical ? Calculator : Sparkles, 
            onClick: () => !catchUpMode && setIncludeHypothetical(!includeHypothetical),
            className: catchUpMode ? "opacity-50 cursor-not-allowed" : ""
          }
        ]}
        dataActions={[
          { label: "Clear Entries", icon: Trash2, onClick: clearAllData, className: "hover:text-red-500 hover:bg-red-500/10" }
        ]}
        showDisclaimer={true}
      />

      {showSettings && (
        <ScrollReveal animation="fade-up">
          <div className="mb-12 p-8 bg-[var(--surface)] border-2 border-[var(--primary)] text-[var(--foreground)]">
            <h3 className="font-heading text-sm font-bold mb-8 uppercase tracking-widest">Category Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[var(--background)] border border-[var(--border)] space-y-4">
                   <div className="flex justify-between items-center">
                     <input 
                       className="font-heading font-bold text-xs bg-transparent border-none focus:ring-0 p-0"
                       value={cat.name}
                       onChange={e => setCategories(prev => prev.map(c => c.id === cat.id ? {...c, name: e.target.value} : c))}
                     />
                     <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="text-red-500 hover:scale-110 transition-transform">
                       <Trash2 size={14} />
                     </button>
                   </div>
                   
                   <div>
                     <label className="block text-[8px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Weight</label>
                     <input 
                       type="number" step="0.05"
                       className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 text-xs font-heading font-bold"
                       value={cat.weight}
                       onChange={e => setCategories(prev => prev.map(c => c.id === cat.id ? {...c, weight: parseFloat(e.target.value) || 0} : c))}
                     />
                   </div>

                   <div>
                     <label className="block text-[8px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Calc mode</label>
                     <select 
                       className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 text-xs font-heading appearance-none font-bold"
                       value={cat.calcMode}
                       onChange={e => setCategories(prev => prev.map(c => c.id === cat.id ? {...c, calcMode: e.target.value as CategoryCalcMode} : c))}
                     >
                       {Object.values(CategoryCalcMode).map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                   </div>

                   <div>
                     <label className="block text-[8px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Terms</label>
                     <div className="flex gap-2">
                       {(['prelim', 'midterm', 'final'] as const).map(term => (
                         <button 
                           key={term}
                           onClick={() => toggleTermApplicability(cat.id, term)}
                           className={`flex-1 py-1 text-[8px] font-heading uppercase border transition-all font-bold ${cat.applicableTerms.includes(term) ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
                         >
                           {term.substring(0, 1)}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
              ))}
              <button 
                onClick={() => setCategories([...categories, { id: Math.random().toString(), name: 'New Category', weight: 0.1, calcMode: CategoryCalcMode.AVERAGE_PERCENTAGE, applicableTerms: ['prelim', 'midterm', 'final'] }])}
                className="p-4 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <Plus size={20} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)]" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-[var(--foreground-muted)]">Add Category</span>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
               <div className={`font-heading text-xs uppercase tracking-widest ${Math.abs(categories.reduce((s, c) => s + c.weight, 0) - 1) < 0.001 ? 'text-[var(--primary)]' : 'text-red-500 animate-pulse font-bold'}`}>
                 Total Normalized Weight: {(categories.reduce((s, c) => s + c.weight, 0) * 100).toFixed(0)}%
               </div>
               <button onClick={() => setShowSettings(false)} className="btn btn-primary py-2 px-8 text-xs uppercase tracking-widest">Done</button>
            </div>
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          {(['prelim', 'midterm', 'final'] as const).map(term => (
            <div key={term} className="space-y-4">
              <div className="flex items-end justify-between mb-8 border-b-2 border-[var(--primary)] pb-3 pr-4">
                <div className="flex flex-col">
                  <h3 className="font-heading text-2xl uppercase tracking-widest text-[var(--foreground)] leading-none mb-1">
                    {term} Period
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-logo text-[var(--foreground)] leading-none">
                       {(term === 'prelim' ? termGrades.prelim.normalizedGrade : term === 'midterm' ? termGrades.midterm.normalizedGrade : termGrades.final.normalizedGrade).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-heading font-medium text-[var(--foreground-muted)] uppercase tracking-widest leading-none">
                       ({(term === 'prelim' ? termGrades.prelim.normalizedPercentage : term === 'midterm' ? termGrades.midterm.normalizedPercentage : termGrades.final.normalizedPercentage)}%)
                    </span>
                  </div>
                </div>
                {catchUpMode && (
                  <div className="flex items-end gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-end gap-4">
                      <div className="flex flex-col items-end">
                        <label className="text-[9px] font-heading text-[var(--foreground-muted)] uppercase tracking-widest mb-1.5 leading-none">Target Grade</label>
                        <GradeSelect
                          mode="standard"
                          value={targetGrades[term].toFixed(2)}
                          onChange={(val) => setTargetGrades(prev => ({ ...prev, [term]: parseFloat(val) }))}
                          className="w-24 border-none text-right font-bold text-lg p-0 h-auto bg-transparent focus:ring-0 leading-none"
                        />
                      </div>
                      <button 
                        onClick={() => autoFillTerm(term)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)] hover:text-white transition-all font-heading text-[9px] uppercase tracking-widest leading-none mb-0.5"
                      >
                        <Sparkles size={12} />
                        Magic Wand
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.filter(cat => cat.applicableTerms.includes(term)).map(cat => {
                  const catEntries = entries.filter(e => e.term === term && e.categoryId === cat.id);
                  const catScore = calculateCategoryScore(catEntries, cat.calcMode);
                  
                  return (
                    <div key={cat.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] group">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-heading text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">{cat.name}</h4>
                          <p className="text-[8px] font-heading text-[var(--foreground-muted)] uppercase tracking-widest" title={`Norm: ${(termGrades.normalizedWeights[term][cat.id] * 100).toFixed(0)}% | Raw: ${(cat.weight * 100).toFixed(0)}%`}>
                            <span className="text-[var(--primary)] font-bold">{(termGrades.normalizedWeights[term][cat.id] * 100).toFixed(0)}% Weight</span> • {cat.calcMode}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                             <span className="font-logo text-xl text-[var(--primary)]">{(catScore || 0).toFixed(1)}%</span>
                           </div>
                           <button 
                            onClick={() => addEntry(term, cat.id)}
                             className="w-8 h-8 bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                         {catEntries.map(entry => {
                           const isInvalid = entry.score > entry.total || entry.score < 0;
                           return (
                            <div key={entry.id} className={`flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300 p-1 px-2 -mx-2 transition-colors ${entry.isHypothetical ? 'bg-[var(--primary)]/5 italic' : ''}`}>
                               <div className={`flex-1 flex items-center bg-[var(--background)] border transition-colors p-2 ${isInvalid ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-[var(--border)]'}`}>
                                 <input 
                                  type="number"
                                  placeholder="Score"
                                  className={`w-full bg-transparent border-none focus:ring-0 text-xs font-heading text-center font-bold ${isInvalid ? 'text-red-500' : entry.isHypothetical ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}
                                  value={entry.score || ''}
                                  onChange={(e) => updateEntry(entry.id, 'score', parseFloat(e.target.value) || 0)}
                                />
                                <span className={`text-xs opacity-30 ${isInvalid ? 'text-red-500' : 'text-[var(--foreground-muted)]'}`}>/</span>
                                <input 
                                  type="number"
                                  placeholder="Total"
                                  className={`w-full bg-transparent border-none focus:ring-0 text-xs font-heading text-center ${isInvalid ? 'text-red-500' : entry.isHypothetical ? 'text-[var(--primary)]/50 font-bold' : 'text-[var(--foreground-muted)] font-bold'}`}
                                  value={entry.total || ''}
                                  onChange={(e) => updateEntry(entry.id, 'total', parseFloat(e.target.value) || 100)}
                                />
                               </div>
                               <button 
                                 onClick={() => updateEntry(entry.id, 'isHypothetical', !entry.isHypothetical)} 
                                 className={`w-6 h-6 flex items-center justify-center transition-colors ${entry.isHypothetical ? 'text-[var(--primary)] bg-[var(--primary)]/10' : 'text-[var(--foreground-muted)] hover:text-[var(--primary)]'}`}
                                 title={entry.isHypothetical ? "Mark as Official" : "Mark as Hypothetical"}
                               >
                                 <Sparkles size={12} className={entry.isHypothetical ? 'animate-pulse' : ''} />
                               </button>
                               <button onClick={() => deleteEntry(entry.id)} className="text-[var(--foreground-muted)] hover:text-red-500 transition-colors">
                                 <Trash2 size={14} />
                               </button>
                            </div>
                           );
                         })}
                        {catEntries.length === 0 && (
                          <p className="text-center py-4 text-[10px] font-heading text-[var(--foreground-muted)] uppercase tracking-widest border border-dashed border-[var(--border)]">No data entered</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 border-l border-[var(--border)] pl-8">
          <div className="sticky top-24 space-y-6">
            <ScrollReveal animation="slide-right">
              <div className="space-y-6">
                <div className="p-8 bg-gradient-to-br from-[var(--surface)] to-[var(--background)] border-2 border-[var(--primary)] text-center relative overflow-hidden shadow-2xl shadow-black/10">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <School size={64} className="text-[var(--primary)]" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-heading text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4">Overall GWA</p>
                    <div className="text-7xl font-logo text-[var(--foreground)] mb-2 drop-shadow-md">
                      {termGrades.final.cumulativeGrade.toFixed(2)}
                    </div>
                    <div className="inline-block px-3 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                      <span className="text-xs font-heading font-bold text-[var(--primary)]">
                        {termGrades.final.cumulativePercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-sm">
                  <h4 className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                    <BarChart3 size={12} /> Grade Breakdown
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">Prelim Period</span>
                        <span className="text-[8px] text-[var(--foreground-muted)]/50 uppercase">100% Weighted</span>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-bold text-[var(--foreground)] text-sm">{termGrades.prelim.grade.toFixed(2)}</div>
                        <div className="text-[10px] text-[var(--foreground-muted)]">{termGrades.prelim.transmutedPercentage.toFixed(0)}%</div>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--border)]/30" />

                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="font-heading text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold">Actual Midterm</span>
                        <span className="text-[8px] text-[var(--primary)]/50 uppercase italic">(P + 2*TM) / 3</span>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-bold text-[var(--primary)] text-sm">{termGrades.midterm.cumulativeGrade.toFixed(2)}</div>
                        <div className="text-[10px] text-[var(--primary)]/70">{termGrades.midterm.cumulativePercentage.toFixed(0)}%</div>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--border)]/30" />

                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="font-heading text-[10px] uppercase tracking-widest text-[var(--c-orange)] font-bold">Actual Final</span>
                        <span className="text-[8px] text-[var(--c-orange)]/50 uppercase italic">(AM + 2*TF) / 3</span>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-bold text-[var(--c-orange)] text-sm">{termGrades.final.cumulativeGrade.toFixed(2)}</div>
                        <div className="text-[10px] text-[var(--c-orange)]/70">{termGrades.final.cumulativePercentage.toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Recommendations */}
                <div className="mt-8 pt-6 border-t border-[var(--border)] text-left space-y-6">
                  {(['prelim', 'midterm', 'final'] as const).map(term => {
                    const data = term === 'prelim' ? termGrades.prelim : term === 'midterm' ? termGrades.midterm : termGrades.final;
                    if (catchUpMode && data.remainingWeight > 0) {
                      return (
                        <div key={term + '-intra'} className="space-y-3">
                          <p className="font-heading text-[9px] uppercase tracking-widest text-[var(--foreground-muted)] flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-[var(--primary)]"></span>
                             Required in {term} tasks
                          </p>
                          <div className="space-y-1">
                            {[targetGrades[term], 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0].filter((v, i, a) => a.indexOf(v) === i).sort().map(tg => {
                              const thresholds = [
                                { p: 98, g: 1.0 }, { p: 95, g: 1.25 }, { p: 92, g: 1.5 }, { p: 89, g: 1.75 },
                                { p: 86, g: 2.0 }, { p: 83, g: 2.25 }, { p: 80, g: 2.5 }, { p: 77, g: 2.75 },
                                { p: 75, g: 3.0 }, { p: 70, g: 4.0 }, { p: 0, g: 5.0 }
                              ];
                              
                              const targetPerc = [...thresholds].reverse().find(t => t.g <= tg)?.p || 75;
                              
                              let neededTermPerc = targetPerc;
                              if (term === 'midterm') {
                                neededTermPerc = (3 * targetPerc - termGrades.prelim.transmutedPercentage) / 2;
                              } else if (term === 'final') {
                                neededTermPerc = (3 * targetPerc - termGrades.midterm.cumulativePercentage) / 2;
                              }
                              
                              const totalNeededWeightInTerm = (neededTermPerc / 100) * data.totalApplicableWeight;
                              const neededTransmutedPercInRemaining = ( totalNeededWeightInTerm - data.totalWeighted ) / data.remainingWeight;
                              const neededRawInRemaining = (neededTransmutedPercInRemaining - 0.5) * 2;
                              
                              if (neededRawInRemaining === null || neededRawInRemaining > 1.25 || neededRawInRemaining < -0.2) return null;
                              
                              return (
                                <div key={tg} className="flex justify-between text-[10px] items-center">
                                   <span className="text-[var(--foreground-muted)]">To reach {tg.toFixed(2)}:</span>
                                   <span className={`font-bold ${neededRawInRemaining > 1.0 ? 'text-red-500' : 'text-[var(--primary)]'}`}>
                                     {(neededRawInRemaining * 100).toFixed(1)}% Raw
                                   </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </ScrollReveal>

            <div className="p-6 bg-[var(--surface)] border-l-4 border-[var(--c-orange)] shadow-xl shadow-black/5">
               <h4 className="font-heading text-xs font-bold flex items-center gap-2 text-[var(--foreground)] uppercase tracking-widest mb-3" title="Independent assistance for each term's grade target">
                 <Sparkles size={14} className="text-[var(--c-orange)]" /> Smart Assistant
               </h4>
               <p className="font-body text-[10px] text-[var(--foreground-muted)] leading-relaxed mb-4">
                 Set your <strong>Target Grade</strong> in any period header and use the <strong>Magic Wand</strong> to simulate scores.
               </p>
               <div className="space-y-2">
                  <div className="text-[9px] text-[var(--foreground-muted)] italic leading-tight">
                    * Transmutation: (Raw % / 2) + 50
                  </div>
                  <div className="text-[9px] text-[var(--foreground-muted)] italic leading-tight">
                    * Actual Midterm = (P + 2*TM) / 3
                  </div>
                  <div className="text-[9px] text-[var(--foreground-muted)] italic leading-tight">
                    * Actual Final = (AM + 2*TF) / 3
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalGradeCalculator;

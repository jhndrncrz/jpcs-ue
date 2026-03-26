import React, { useMemo } from 'react';
import { TrendingUp, Calendar, School, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  calculateGWA, 
  getLatinHonors, 
  SubjectType, 
  type AcademicYear 
} from '../../utils/gradeCalculations';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ScrollReveal from '../../components/ui/ScrollReveal';
import ToolHeader from '../../components/ui/ToolHeader';

const LatinHonorsGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Latin Honors Rules</h3>
      <p>UE's Latin Honors criteria involve both a minimum GWA and specific subject inclusion rules:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Summa Cum Laude:</strong> 1.0000 - 1.2500</li>
        <li><strong>Magna Cum Laude:</strong> 1.2501 - 1.4500</li>
        <li><strong>Cum Laude:</strong> 1.4501 - 1.7500</li>
      </ul>
    </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)] text-[11px]">
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Subject Inclusion</h3>
      <p>Per university rules, <strong>PE subjects</strong> are included in the GWA computation for Honors, but <strong>NSTP subjects</strong> are excluded.</p>
    </div>

    <div>
       <h3 className="text-[var(--foreground)] font-heading text-sm uppercase tracking-widest mb-2">Eligibility</h3>
       <p>Students must not have any failing grades (5.00), Dropped (D), or Withdrawn (W) marks in any subject (including NSTP) to qualify for Latin Honors.</p>
    </div>
  </div>
);

const LatinHonorsTracker: React.FC = () => {
  const [academicYears] = useLocalStorage<AcademicYear[]>('jpcs-ue-academic-years', []);

  const { overallGwa, honorsStatus, semestersData } = useMemo(() => {
    const allSubjects = academicYears.flatMap(ay => ay.semesters.flatMap(sem => sem.subjects));
    
    // For Latin Honors: Includes PE, Excludes NSTP
    const calculatedGwa = calculateGWA(allSubjects, { excludeTypes: [SubjectType.NSTP] });
    
    const hasFailing = allSubjects.some(s => {
      const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
      return g === 5.0 || s.grade === 'D' || s.grade === 'W';
    });

    const semestersData = academicYears.flatMap(ay => ay.semesters.map(sem => ({
      ...sem,
      ayYear: ay.year,
      gwa: calculateGWA(sem.subjects, { excludeTypes: [SubjectType.NSTP] })
    })));

    return {
      overallGwa: calculatedGwa,
      honorsStatus: getLatinHonors(calculatedGwa.gwa, hasFailing),
      semestersData
    };
  }, [academicYears]);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <ToolHeader 
        title="Honors & Progress Tracker"
        description="A unified view of your academic journey across all years and semesters, focused on Latin Honors standing."
        helpContent={<LatinHonorsGuide />}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className="flex-1">
          <h2 className="font-heading text-2xl text-[var(--foreground)] mb-2">Honors & Progress Tracker</h2>
          <p className="font-body text-[var(--foreground-muted)] text-sm">Monitor your cumulative performance and honors eligibility.</p>
        </div>
        
        <ScrollReveal animation="scale">
          <div className="p-6 bg-[var(--surface)] border-2 border-[var(--primary)] flex items-center gap-6">
            <div className="text-center">
              <p className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Cumulative GWA</p>
              <div className="text-4xl font-logo text-[var(--foreground)]">{overallGwa.gwa.toFixed(4)}</div>
              <p className="text-[8px] font-heading text-[var(--foreground-muted)] uppercase">(Excludes NSTP)</p>
            </div>
            <div className="w-px h-12 bg-[var(--border)]" />
            <div className="text-center">
              <p className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Honors Standing</p>
              <div className={`font-title text-lg ${honorsStatus !== 'None' ? 'text-[var(--c-orange)]' : 'text-[var(--foreground-muted)]'}`}>
                {honorsStatus}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {semestersData.map((sem, idx) => (
          <div key={idx} className="p-6 bg-[var(--surface)] border border-[var(--border)] relative group transition-all hover:border-[var(--primary)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <School size={12} className="text-[var(--foreground-muted)]" />
                <span className="text-[8px] font-heading text-[var(--foreground-muted)] uppercase tracking-widest">{sem.ayYear}</span>
              </div>
            </div>
            
            <h4 className="font-heading text-sm font-bold mb-4 flex items-center gap-2 text-[var(--foreground)]">
              <Calendar size={14} className="text-[var(--primary)]" />
              {sem.name}
            </h4>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px] font-heading text-[var(--foreground-muted)] uppercase tracking-widest">
                <span>Semester GWA</span>
                <span>{sem.gwa.gwa.toFixed(4)}</span>
              </div>
              <div className="w-full bg-[var(--background)] h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--primary)] h-full transition-all duration-500" 
                  style={{ width: `${Math.max(0, Math.min(100, (3 - sem.gwa.gwa) / 2 * 100))}%` }}
                />
              </div>
            </div>
            
            <Link 
              to="/tools/gwa" 
              className="flex items-center gap-1 text-[10px] font-heading text-[var(--primary)] uppercase tracking-wider font-bold hover:underline"
            >
              Update Data <ExternalLink size={10} />
            </Link>
          </div>
        ))}

        {semestersData.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
             <p className="font-heading text-[var(--foreground-muted)] uppercase tracking-widest text-xs mb-4">No academic data found</p>
             <Link to="/tools/gwa" className="btn btn-primary py-2 px-6 text-xs uppercase tracking-widest">Add Data in GWA Hub</Link>
          </div>
        )}
      </div>

      {semestersData.length > 1 && (
        <ScrollReveal animation="fade-up">
          <div className="p-8 bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-heading text-sm font-bold mb-12 flex items-center gap-2 uppercase tracking-widest text-[var(--foreground)]">
              <TrendingUp size={16} className="text-[var(--primary)]" />
              Academic Performance Trend
            </h3>
            
            <div className="h-64 flex items-end gap-2 md:gap-4 px-4 overflow-x-auto pb-4">
              {semestersData.map((sem, idx) => {
                const height = sem.gwa.gwa > 0 ? ((5 - sem.gwa.gwa) / 4) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 min-w-[60px] flex flex-col items-center gap-2 group relative">
                    <div className="w-full relative h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-[var(--primary)]/20 to-[var(--primary)] border-t border-[var(--primary)] transition-all duration-700 ease-out group-hover:from-[var(--c-orange)]/40 group-hover:to-[var(--c-orange)]"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-heading text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[var(--foreground)]">
                        {sem.gwa.gwa.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center mt-2">
                       <span className="font-heading text-[8px] uppercase tracking-tighter text-[var(--foreground)] whitespace-nowrap">
                        {sem.name.substring(0, 3)}
                       </span>
                       <span className="font-heading text-[6px] text-[var(--foreground-muted)] uppercase">
                        {sem.ayYear.split('-')[0]}
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

export default LatinHonorsTracker;

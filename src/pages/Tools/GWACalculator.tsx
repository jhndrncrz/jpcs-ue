import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Upload, School, Settings2, BarChart3, Sparkles } from 'lucide-react';
import { 
  calculateGWA, 
  getLatinHonors, 
  checkUEScholarship, 
  sortAcademicYears,
  mergeAcademicYears,
  SubjectType, 
  type Subject, 
  type AcademicYear 
} from '../../utils/gradeCalculations';
import { parseGradesXLSX } from '../../utils/fileParsers';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ToolHeader from '../../components/ui/ToolHeader';
import GradeSelect from '../../components/ui/GradeSelect';

const GWAGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Grading System</h3>
      <p>UE uses a 1.00 to 5.00 scale, where 1.00 is the highest and 5.00 is failing. Other marks include:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li><strong>D (Dropped):</strong> No units earned, counts as failing for honors.</li>
        <li><strong>W (Withdrawn):</strong> No units earned, counts as failing for honors.</li>
        <li><strong>LFR (Lapsed):</strong> Failing mark.</li>
      </ul>
    </div>

    <div className="p-4 bg-[var(--c-orange)]/5 border-l-2 border-[var(--c-orange)]">
      <h3 className="text-[var(--c-orange)] font-heading text-sm uppercase tracking-widest mb-2">Latin Honors</h3>
      <ul className="space-y-1">
        <li>• <strong>Summa Cum Laude:</strong> 1.0000 - 1.2000</li>
        <li>• <strong>Magna Cum Laude:</strong> 1.2001 - 1.4000</li>
        <li>• <strong>Cum Laude:</strong> 1.4001 - 1.6000</li>
        <li>• <strong>Includes PE</strong>, Excludes NSTP.</li>
        <li>• No failing grade (5.0, D, or W) ever.</li>
      </ul>
    </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)]">
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Scholarships</h3>
      <p>Scholarship eligibility is determined for the <strong>next semester</strong> based on your performance in the current semester.</p>
      <ul className="space-y-1 mt-2">
        <li>• <strong>Semester GPA:</strong> 1.00-1.25 (University), 1.2501-1.50 (College).</li>
        <li>• <strong>Overall GWA:</strong> Must be 1.60 or better.</li>
        <li>• <strong>Excludes:</strong> Both PE and NSTP.</li>
      </ul>
    </div>

    <div>
      <h3 className="text-[var(--foreground)] font-heading text-sm uppercase tracking-widest mb-2">Hypothetical Grades</h3>
      <p>Use the <Sparkles size={14} className="inline inline-block text-[var(--primary)]" /> icon to mark a subject as hypothetical. This is useful for planning future grades without affecting your official records.</p>
    </div>
  </div>
);

const GWACalculator: React.FC = () => {
  const [academicYears, setAcademicYears] = useLocalStorage<AcademicYear[]>('jpcs-ue-academic-years', []);

  const [filterPE, setFilterPE] = useState(false);
  const [filterNSTP, setFilterNSTP] = useState(true);
  const [viewMode, setViewMode] = useState<'honors' | 'scholarship'>('honors');
  const [includeHypothetical, setIncludeHypothetical] = useState(true);

  const flatSubjects = useMemo(() => {
    return academicYears.flatMap(ay => ay.semesters.flatMap(sem => sem.subjects));
  }, [academicYears]);

  const stats = useMemo(() => {
    const activeSubjects = flatSubjects.filter(s => includeHypothetical || !s.isHypothetical);
    
    // Determine failing status for eligibility (affects both honors and scholarship)
    const hasFailing = activeSubjects.some(s => {
      const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
      return g === 5.0 || s.grade === 'D' || s.grade === 'W';
    });

    if (viewMode === 'scholarship') {
      // Scholarship uses a fixed rule: No PE, No NSTP
      const { gwa, totalUnits } = calculateGWA(activeSubjects, { excludeTypes: [SubjectType.PE, SubjectType.NSTP] });
      return {
        gwa,
        result: 'Check Semesters', // Scholarship is per semester
        totalUnits
      };
    } else {
      // Honors mode: Excludes NSTP, but includes PE (per latin.txt)
      const excludeTypes: SubjectType[] = [];
      if (filterPE) excludeTypes.push(SubjectType.PE);
      if (filterNSTP) excludeTypes.push(SubjectType.NSTP);

      const { gwa, totalUnits } = calculateGWA(activeSubjects, { excludeTypes });
      return {
        gwa,
        result: getLatinHonors(gwa, hasFailing),
        totalUnits
      };
    }
  }, [flatSubjects, filterPE, filterNSTP, viewMode, includeHypothetical]);

  const addAcademicYear = () => {
    const newAY: AcademicYear = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      year: 'New Academic Year',
      semesters: []
    };
    setAcademicYears([...academicYears, newAY]);
  };

  const addSemester = (ayId: string) => {
    setAcademicYears(prev => prev.map(ay => {
      if (ay.id === ayId) {
        return {
          ...ay,
          semesters: [
            ...ay.semesters,
            { 
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9), 
              name: `Semester ${ay.semesters.length + 1}`, 
              subjects: [{ code: '', description: '', grade: '', units: 3, type: SubjectType.Professional }] 
            }
          ]
        };
      }
      return ay;
    }));
  };

  const addSubject = (ayId: string, semId: string) => {
    setAcademicYears(prev => prev.map(ay => {
      if (ay.id === ayId) {
        return {
          ...ay,
          semesters: ay.semesters.map(sem => {
            if (sem.id === semId) {
              return {
                ...sem,
                subjects: [...sem.subjects, { code: '', description: '', grade: '', units: 3, type: SubjectType.Professional }]
              };
            }
            return sem;
          })
        };
      }
      return ay;
    }));
  };

  const updateSubject = (ayId: string, semId: string, subIndex: number, field: keyof Subject, value: string | number | boolean) => {
    setAcademicYears(prev => prev.map(ay => {
      if (ay.id === ayId) {
        return {
          ...ay,
          semesters: ay.semesters.map(sem => {
            if (sem.id === semId) {
              const newSubjects = [...sem.subjects];
              newSubjects[subIndex] = { ...newSubjects[subIndex], [field]: value };
              return { ...sem, subjects: newSubjects };
            }
            return sem;
          })
        };
      }
      return ay;
    }));
  };

  const removeSubject = (ayId: string, semId: string, subIndex: number) => {
    setAcademicYears(prev => prev.map(ay => {
      if (ay.id === ayId) {
        return {
          ...ay,
          semesters: ay.semesters.map(sem => {
            if (sem.id === semId) {
              return { ...sem, subjects: sem.subjects.filter((_, i) => i !== subIndex) };
            }
            return sem;
          })
        };
      }
      return ay;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as ArrayBuffer;
      const importedAYs = parseGradesXLSX(data);
      
      if (importedAYs.length > 0) {
        setAcademicYears(prev => {
          const merged = mergeAcademicYears(prev, importedAYs);
          alert(`Successfully imported ${importedAYs.length} academic years/semesters.`);
          return merged;
        });
      } else {
        alert('No valid academic records found in the XLSX file.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const clearAllGrades = () => {
    if (window.confirm('Are you sure you want to clear all grade records? This will delete all your academic history.')) {
      setAcademicYears([]);
    }
  };

  const sortedAYs = useMemo(() => sortAcademicYears(academicYears), [academicYears]);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <ToolHeader 
        title="Academic Hub"
        description="Manage your entire academic record and track honors/scholarships. Supports XLSX imports from the student portal."
        helpContent={<GWAGuide />}
        primaryActions={[
          { label: "Add Year", icon: Plus, onClick: addAcademicYear }
        ]}
        secondaryActions={[
          { 
            label: viewMode === 'honors' ? "Honors View" : "Scholarship View", 
            icon: viewMode === 'honors' ? BarChart3 : Settings2,
            onClick: () => setViewMode(viewMode === 'honors' ? 'scholarship' : 'honors')
          }
        ]}
        dataActions={[
          { 
            label: "Import XLSX", 
            icon: Upload,
            component: (
              <label className="btn btn-ghost p-2 cursor-pointer" title="Import XLSX">
                <Upload size={16} />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Import XLSX</span>
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
              </label>
            )
          },
          { label: "Clear All", icon: Trash2, onClick: clearAllGrades, className: "hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]" }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          {sortedAYs.map((ay) => (
            <div key={ay.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-logo">
                    <School size={20} />
                  </div>
                  <input 
                    type="text" 
                    className="font-heading text-xl bg-transparent border-none focus:ring-0 text-[var(--foreground)]"
                    value={ay.year}
                    onChange={(e) => setAcademicYears(prev => prev.map(a => a.id === ay.id ? {...a, year: e.target.value} : a))}
                  />
                </div>
                <button onClick={() => addSemester(ay.id)} className="text-xs font-heading text-[var(--primary)] uppercase tracking-wider hover:underline">
                  + Add Semester
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {ay.semesters.map((sem) => (
                  <div key={sem.id} className="ml-4 pl-6 border-l-2 border-[var(--border)] space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <input 
                          type="text" 
                          className="font-heading font-bold text-sm bg-transparent border-none focus:ring-0 text-[var(--foreground)]"
                          value={sem.name}
                          onChange={(e) => setAcademicYears(prev => prev.map(a => a.id === ay.id ? {
                            ...a, semesters: a.semesters.map(s => s.id === sem.id ? {...s, name: e.target.value} : s)
                          } : a))}
                        />
                        {viewMode === 'scholarship' && (
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-heading px-2 py-0.5 rounded-full border ${
                              checkUEScholarship(sem.subjects, flatSubjects, flatSubjects.some(s => {
                                const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
                                return g === 5.0 || s.grade === 'D' || s.grade === 'W';
                              })) !== 'None' ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' : 'bg-[var(--border)]/20 border-transparent text-[var(--foreground-muted)]'
                            }`}>
                              {checkUEScholarship(sem.subjects, flatSubjects, flatSubjects.some(s => {
                                const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
                                return g === 5.0 || s.grade === 'D' || s.grade === 'W';
                              })) !== 'None' ? `Applied to Next Semester` : 'No Scholarship for Next Sem'}
                            </span>
                            {checkUEScholarship(sem.subjects, flatSubjects, flatSubjects.some(s => {
                                const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
                                return g === 5.0 || s.grade === 'D' || s.grade === 'W';
                              })) !== 'None' && (
                              <span className="text-[9px] font-heading uppercase tracking-widest text-[var(--primary)] font-bold">
                                {checkUEScholarship(sem.subjects, flatSubjects, flatSubjects.some(s => {
                                  const g = typeof s.grade === 'string' ? parseFloat(s.grade) : s.grade;
                                  return g === 5.0 || s.grade === 'D' || s.grade === 'W';
                                }))}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button onClick={() => addSubject(ay.id, sem.id)} className="text-[10px] font-heading text-[var(--foreground-muted)] hover:text-[var(--primary)] uppercase tracking-widest">
                         Add Subject
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[var(--border)]/30">
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter w-8"></th>
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter w-24">Code</th>
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter min-w-[150px]">Description</th>
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter w-40">Type</th>
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter w-28">Grade</th>
                            <th className="pb-2 font-heading text-[10px] uppercase text-[var(--foreground-muted)] tracking-tighter w-12">Units</th>
                            <th className="pb-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]/10">
                          {sem.subjects.map((sub, idx) => (
                            <tr key={idx} className={`group ${sub.isHypothetical ? 'bg-[var(--primary)]/[0.03] italic' : ''}`}>
                              <td className="py-2 pr-2">
                                <button 
                                  onClick={() => updateSubject(ay.id, sem.id, idx, 'isHypothetical', !sub.isHypothetical)}
                                  className={`p-1 rounded-sm transition-colors ${sub.isHypothetical ? 'text-[var(--primary)] bg-[var(--primary)]/10' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
                                  title={sub.isHypothetical ? "Mark as Official" : "Mark as Hypothetical"}
                                >
                                  <Sparkles size={12} />
                                </button>
                              </td>
                              <td className="py-2 pr-2">
                                <input 
                                  type="text" 
                                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-heading text-[var(--foreground)]"
                                  value={sub.code}
                                  onChange={(e) => updateSubject(ay.id, sem.id, idx, 'code', e.target.value)}
                                  placeholder="Code"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <input 
                                  type="text" 
                                  className="w-full bg-transparent border-none focus:ring-0 text-xs text-[var(--foreground)] min-w-[200px]"
                                  value={sub.description}
                                  onChange={(e) => updateSubject(ay.id, sem.id, idx, 'description', e.target.value)}
                                  placeholder="Subject Description"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <select 
                                  className="w-full bg-transparent border-none focus:ring-0 text-[10px] font-heading text-[var(--foreground-muted)] appearance-none cursor-pointer"
                                  value={sub.type || SubjectType.Professional}
                                  onChange={(e) => updateSubject(ay.id, sem.id, idx, 'type', e.target.value)}
                                >
                                  {Object.values(SubjectType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-2 pr-2">
                                <GradeSelect
                                  mode="hub"
                                  value={sub.grade}
                                  onChange={(val) => updateSubject(ay.id, sem.id, idx, 'grade', val)}
                                  className={`w-full border-none focus:ring-0 text-xs font-bold font-heading text-center ${sub.isHypothetical ? 'text-[var(--primary)]/70' : 'text-[var(--primary)]'}`}
                                  placeholder="1.00"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <div className="space-y-1">
                                  <input 
                                    type="number" 
                                    className={`w-full bg-transparent border transition-colors focus:ring-0 text-xs text-center ${sub.units <= 0 || sub.units > 30 ? 'border-red-500 text-red-500' : 'border-transparent text-[var(--foreground)]'}`}
                                    value={sub.units}
                                    onChange={(e) => updateSubject(ay.id, sem.id, idx, 'units', parseInt(e.target.value) || 0)}
                                    title={sub.units <= 0 ? "Units must be > 0" : sub.units > 30 ? "Units too high" : ""}
                                  />
                                </div>
                              </td>
                              <td className="py-2 text-right">
                                <button 
                                  onClick={() => removeSubject(ay.id, sem.id, idx)}
                                  className="text-[var(--foreground-muted)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 bg-[var(--surface)] border-2 border-[var(--primary)] relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary)] opacity-10 blur-3xl" />
               <p className="font-heading text-xs uppercase tracking-widest text-[var(--foreground-muted)] mb-2 text-center">
                 GWA
               </p>
               <div className="text-5xl font-logo text-[var(--foreground)] text-center mb-1">
                 {stats.gwa.toFixed(4)}
               </div>
               <p className="text-[10px] font-heading text-center text-[var(--foreground-muted)] mb-4">{stats.totalUnits} Calculated Units</p>
               
               <div className="h-px bg-[var(--border)] mb-4" />
                               <div className="space-y-4">
                  <div className="text-center">
                    <p className="font-heading text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      {viewMode === 'honors' ? 'Current Standing' : 'Scholarship Summary'}
                    </p>
                    <div className={`font-title text-base ${stats.result !== 'None' ? (viewMode === 'honors' ? 'text-[var(--c-orange)]' : 'text-[var(--primary)]') : 'text-[var(--foreground-muted)]'}`}>
                      {stats.result}
                    </div>
                  </div>
                </div>
            </div>

            <div className="p-6 bg-[var(--surface)] border border-[var(--border)]">
              <h4 className="font-heading text-sm font-bold mb-4 flex items-center gap-2 text-[var(--foreground)]">
                <Settings2 size={16} className="text-[var(--foreground-muted)]" />
                Computation Controls
              </h4>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[var(--primary)] rounded-none" 
                    checked={includeHypothetical}
                    onChange={() => setIncludeHypothetical(!includeHypothetical)}
                  />
                  <div className="flex flex-col">
                    <span className="font-heading text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Include Hypothetical</span>
                    <span className="text-[9px] text-[var(--foreground-muted)]/60 italic">Count sparkles in calculation</span>
                  </div>
                </label>
                <div className="h-px bg-[var(--border)]/30" />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[var(--primary)] rounded-none" 
                    checked={filterPE}
                    onChange={() => setFilterPE(!filterPE)}
                  />
                  <span className="font-heading text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Force Exclude PE</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[var(--primary)] rounded-none" 
                    checked={filterNSTP}
                    onChange={() => setFilterNSTP(!filterNSTP)}
                  />
                  <span className="font-heading text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Force Exclude NSTP</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GWACalculator;

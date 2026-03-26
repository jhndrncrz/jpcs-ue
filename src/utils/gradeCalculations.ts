export const SubjectType = {
  GE: 'General Education',
  Professional: 'Professional',
  PE: 'Physical Education',
  NSTP: 'NSTP'
} as const;

export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];

export interface Subject {
  code: string;
  description: string;
  grade: number | string;
  units: number;
  type?: SubjectType;
  isHypothetical?: boolean;
}

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface AcademicYear {
  id: string;
  year: string;
  semesters: Semester[];
}

export const CategoryCalcMode = {
  AVERAGE_PERCENTAGE: 'Average Percentage',
  TOTAL_SCORE: 'Total Score'
} as const;

export type CategoryCalcMode = (typeof CategoryCalcMode)[keyof typeof CategoryCalcMode];

export const roundToFourDecimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
};

export const transmutePercentage = (rawPercentage: number): number => {
  // UE Transmutation: (Raw % / 2) + 50
  return (rawPercentage / 2) + 50;
};

export const calculateGWA = (
  subjects: Subject[], 
  options: { excludeTypes?: SubjectType[] } = {}
): { gwa: number, totalUnits: number } => {
  let totalGradePoints = 0;
  let totalUnits = 0;

  subjects.forEach((subj) => {
    // Determine type if not provided
    const description = subj.description.toLowerCase();
    const code = subj.code.toUpperCase();
    let type = subj.type;

    if (!type) {
      if (description.includes('physical education') || code.startsWith('PE') || code.startsWith('PPF') || code.startsWith('PEN')) {
        type = SubjectType.PE;
      } else if (description.includes('nstp') || code.startsWith('STC')) {
        type = SubjectType.NSTP;
      } else if (code.startsWith('ZGE')) {
        type = SubjectType.GE;
      } else {
        type = SubjectType.Professional;
      }
    }

    if (options.excludeTypes?.includes(type)) return;

    const grade = typeof subj.grade === 'string' ? parseFloat(subj.grade) : subj.grade;
    if (!isNaN(grade as number) && subj.units > 0) {
      totalGradePoints += (grade as number) * subj.units;
      totalUnits += subj.units;
    }
  });

  if (totalUnits === 0) return { gwa: 0, totalUnits: 0 };
  return { 
    gwa: roundToFourDecimals(totalGradePoints / totalUnits), 
    totalUnits 
  };
};

export const getLatinHonors = (gwa: number, hasFailingGrade: boolean) => {
  // UE Latin Honors (per latin.txt): Includes PE, Excludes NSTP
  // GWA rounded to nearest ten thousandths (4 decimals)
  if (hasFailingGrade || gwa > 1.6000) return 'None';
  if (gwa <= 1.2000) return 'Summa Cum Laude';
  if (gwa <= 1.4000) return 'Magna Cum Laude';
  if (gwa <= 1.6000) return 'Cum Laude';
  return 'None';
};

export const checkUEScholarship = (
  semesterSubjects: Subject[], 
  allSubjects: Subject[],
  hasFailingGradeEver: boolean
): string => {
  // UE Scholarship (per scholarship.txt): Excludes PE and NSTP
  // Rule A: Semester GPA (No PE/NSTP)
  // Rule B: Overall GWA (No PE/NSTP) of 1.6000 or better
  // Rule C: No failing grade (5.0, D, W) in any semester

  if (hasFailingGradeEver) return 'None';

  const { gwa: overallGWA } = calculateGWA(allSubjects, { excludeTypes: [SubjectType.PE, SubjectType.NSTP] });
  if (overallGWA > 1.6000 || overallGWA === 0) return 'None';

  const { gwa: semesterGPA } = calculateGWA(semesterSubjects, { excludeTypes: [SubjectType.PE, SubjectType.NSTP] });
  
  if (semesterGPA >= 1.0000 && semesterGPA <= 1.2500) return 'University Scholarship';
  if (semesterGPA > 1.2500 && semesterGPA <= 1.5000) return 'College Scholarship';
  
  return 'None';
};

// Helper for percentage-based cumulative calculation
export const calculateCumulativeMidterm = (prelimPerc: number, tentativeMidtermPerc: number) => {
  return (prelimPerc + 2 * tentativeMidtermPerc) / 3;
};

export const calculateCumulativeFinal = (midtermCumulativePerc: number, tentativeFinalPerc: number) => {
  return (midtermCumulativePerc + 2 * tentativeFinalPerc) / 3;
};

export const calculateRequiredTentativeGrade = (currentTermPerc: number, targetNextPerc: number) => {
  return (3 * targetNextPerc - currentTermPerc) / 2;
};

export const calculateNeededInRemainingCategories = (
  currentWeightedScore: number,
  remainingWeight: number,
  targetPercentage: number
) => {
  if (remainingWeight <= 0) return null;
  return (targetPercentage - currentWeightedScore) / remainingWeight;
};

// Final Grade Category Logic
export interface GradeEntry {
  id: string;
  score: number;
  total: number;
  categoryId: string;
  term: 'prelim' | 'midterm' | 'final';
  isHypothetical?: boolean;
}

export const getUEGrade = (percentage: number): number => {
  // percentage here is the TRANSMUTED percentage
  if (percentage >= 98) return 1.0;
  if (percentage >= 95) return 1.25;
  if (percentage >= 92) return 1.5;
  if (percentage >= 89) return 1.75;
  if (percentage >= 86) return 2.0;
  if (percentage >= 83) return 2.25;
  if (percentage >= 80) return 2.5;
  if (percentage >= 77) return 2.75;
  if (percentage >= 75) return 3.0;
  if (percentage >= 70) return 4.0;
  
  return 5.0;
};

export const calculateCategoryScore = (
  entries: GradeEntry[], 
  mode: CategoryCalcMode
): number => {
  if (entries.length === 0) return 0;

  if (mode === CategoryCalcMode.TOTAL_SCORE) {
    const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
    const totalPossible = entries.reduce((sum, e) => sum + e.total, 0);
    return totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
  } else {
    // AVERAGE_PERCENTAGE - compute the percentage of each entry first, before averaging them
    const percentages = entries.map(e => {
      return e.total > 0 ? (e.score / e.total) * 100 : 0;
    });
    return percentages.reduce((sum, p) => sum + p, 0) / entries.length;
  }
};

export const sortAcademicYears = (years: AcademicYear[]): AcademicYear[] => {
  const getYearNum = (y: string) => parseInt(y.split('-')[0]) || 0;
  const getSemPriority = (s: string) => {
    const name = s.toLowerCase();
    if (name.includes('summer')) return 3;
    if (name.includes('second')) return 2;
    if (name.includes('first')) return 1;
    return 0;
  };

  return [...years].sort((a, b) => getYearNum(b.year) - getYearNum(a.year)).map(ay => ({
    ...ay,
    semesters: [...ay.semesters].sort((a, b) => getSemPriority(b.name) - getSemPriority(a.name))
  }));
};

export const mergeAcademicYears = (existing: AcademicYear[], imported: AcademicYear[]): AcademicYear[] => {
  const merged = JSON.parse(JSON.stringify(existing)) as AcademicYear[];

  imported.forEach(impAy => {
    const existingAy = merged.find(ay => ay.year === impAy.year);
    if (!existingAy) {
      merged.push(impAy);
    } else {
      impAy.semesters.forEach(impSem => {
        const existingSem = existingAy!.semesters.find(s => s.name === impSem.name);
        if (!existingSem) {
          existingAy!.semesters.push(impSem);
        } else {
          // Merge subjects, avoid duplicates by code
          impSem.subjects.forEach(impSub => {
            if (!existingSem.subjects.find(s => s.code === impSub.code)) {
              existingSem.subjects.push(impSub);
            }
          });
        }
      });
    }
  });

  return sortAcademicYears(merged);
};

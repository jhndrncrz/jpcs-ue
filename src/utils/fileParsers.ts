import * as XLSX from 'xlsx';
import type { AcademicYear, Semester, SubjectType } from './gradeCalculations';
import { SubjectType as SubjType } from './gradeCalculations';

export const parseGradesXLSX = (fileData: ArrayBuffer): AcademicYear[] => {
  const workbook = XLSX.read(fileData);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  
  const academicYears: AcademicYear[] = [];
  let currentAY: AcademicYear | null = null;
  let currentSemester: Semester | null = null;

  const ayRegex = /S\.Y\.\s*(\d{4}-\d{4})/i;
  const summerRegex = /SUMMER\s*(\d{4})/i;
  const semRegex = /(FIRST SEMESTER|SECOND SEMESTER|SUMMER)/i;

  // Skip header (Row 0 usually contains headers)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    // Based on the format from grades.csv/xlsx:
    // Row might be a Semester Header or a Subject Row
    // [Index, Code, Description, Grade, ReEx, Units]
    const code = (row[1] as { toString: () => string })?.toString().trim() || '';
    const description = (row[2] as { toString: () => string })?.toString().trim() || '';
    const grade = (row[3] as { toString: () => string })?.toString().trim() || '';
    const unitsColumn = row[5] as { toString: () => string } | undefined;
    const units = parseInt(unitsColumn?.toString() || '0') || 0;

    if (!code && description) {
      // Header detection (e.g., "FIRST SEMESTER S.Y. 2025-2026")
      const semMatch = description.match(semRegex);
      if (semMatch) {
        let yearString = '';
        const ayMatch = description.match(ayRegex);
        const summerMatch = description.match(summerRegex);

        if (ayMatch) {
          yearString = ayMatch[1];
        } else if (summerMatch) {
          const sYear = parseInt(summerMatch[1]);
          yearString = `${sYear - 1}-${sYear}`;
        }

        if (yearString) {
          currentAY = academicYears.find(ay => ay.year === yearString) || null;
          if (!currentAY) {
            currentAY = {
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
              year: yearString,
              semesters: []
            };
            academicYears.push(currentAY);
          }

          currentSemester = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
            name: description.split('S.Y.')[0].trim(),
            subjects: []
          };
          currentAY.semesters.push(currentSemester);
        }
      }
    } else if (code && currentSemester) {
      // Improved Type Detection logic
      let detectedType: SubjectType | undefined;
      const codeUpper = code.toUpperCase();
      const descLower = description.toLowerCase();

      if (descLower.includes('physical education') || codeUpper.startsWith('PE') || codeUpper.startsWith('PPF') || codeUpper.startsWith('PEN')) {
        detectedType = SubjType.PE;
      } else if (descLower.includes('nstp') || codeUpper.startsWith('STC')) {
        detectedType = SubjType.NSTP;
      } else if (codeUpper.startsWith('ZGE')) {
        detectedType = SubjType.GE;
      } else {
        detectedType = SubjType.Professional;
      }

      currentSemester.subjects.push({
        code,
        description,
        grade: grade ? parseFloat(grade) : 'N/A',
        units,
        type: detectedType
      });
    }
  }

  return academicYears;
};

export interface ScheduleEntry {
  id: string;
  subject: string;
  day: string[];
  startTime: string; // HH:MM
  endTime: string;
  room: string;
  color?: string;
  renderType?: 'solid' | 'outline';
}

export const parseScheduleXLSX = (fileData: ArrayBuffer): ScheduleEntry[] => {
  const workbook = XLSX.read(fileData);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  const entries: ScheduleEntry[] = [];
  const dayMap: { [key: string]: string[] } = {
    'M': ['Monday'],
    'T': ['Tuesday'],
    'W': ['Wednesday'],
    'TH': ['Thursday'],
    'F': ['Friday'],
    'S': ['Saturday'],
    'MW': ['Monday', 'Wednesday'],
    'TTH': ['Tuesday', 'Thursday'],
    'WF': ['Wednesday', 'Friday'],
    'M-S': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  // Typical UE Schedule XLSX columns (approximate based on CSV)
  // [Index, Section, SubjectCode, Description, Units, Days, Time, Room]
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 7) continue;

    const description = row[3]?.toString().trim();
    const days = row[5]?.toString().trim();
    const timeRange = row[6]?.toString().trim();
    const room = row[7]?.toString().trim() || 'TBA';

    if (description && days && timeRange) {
      const times = timeRange.split('-');
      if (times.length === 2) {
        const formatTime = (t: string) => {
          const clean = t.padStart(4, '0');
          return `${clean.substring(0, 2)}:${clean.substring(2, 4)}`;
        };

        const startTime = formatTime(times[0]);
        const endTime = formatTime(times[1]);

        let mappedDays: string[] = [];
        if (dayMap[days]) {
          mappedDays = dayMap[days];
        } else {
          if (days.includes('M')) mappedDays.push('Monday');
          if (days.includes('T') && !days.includes('TH')) mappedDays.push('Tuesday');
          if (days.includes('W')) mappedDays.push('Wednesday');
          if (days.includes('TH')) mappedDays.push('Thursday');
          if (days.includes('F')) mappedDays.push('Friday');
          if (days.includes('S')) mappedDays.push('Saturday');
        }

        entries.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
          subject: description,
          day: [...new Set(mappedDays)],
          startTime,
          endTime,
          room
        });
      }
    }
  }

  return entries;
};

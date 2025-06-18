import { Class, LessonCoverage } from "@/types/lessonCoverage";
import { addDays, format, subDays } from "date-fns";

export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Mathematics 3.A",
    subject: "Mathematics",
    grade: 3,
    students: 24,
    teacher: "Ms. Johnson"
  },
  {
    id: "class-2", 
    name: "English 2.B",
    subject: "English",
    grade: 2,
    students: 22,
    teacher: "Mr. Smith"
  },
  {
    id: "class-3",
    name: "Science 4.A", 
    subject: "Science",
    grade: 4,
    students: 26,
    teacher: "Dr. Brown"
  },
  {
    id: "class-4",
    name: "History 5.C",
    subject: "History", 
    grade: 5,
    students: 28,
    teacher: "Ms. Davis"
  },
  {
    id: "class-5",
    name: "Art 1.A",
    subject: "Art",
    grade: 1,
    students: 20,
    teacher: "Mr. Wilson"
  }
];

// Generate lesson coverage data for the past 2 weeks
export const mockLessonCoverage: LessonCoverage[] = [];

const generateMockData = () => {
  const today = new Date();
  const startDate = subDays(today, 14); // 2 weeks ago
  
  for (let i = 0; i <= 14; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Skip weekends (simplified - only generate for weekdays)
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue;
    }
    
    mockClasses.forEach(classItem => {
      // Randomly assign lesson status with realistic distribution
      const rand = Math.random();
      let status: 'present' | 'missing' | 'incomplete';
      
      if (rand < 0.75) {
        status = 'present';
      } else if (rand < 0.9) {
        status = 'incomplete';
      } else {
        status = 'missing';
      }
      
      const coverage: LessonCoverage = {
        id: `coverage-${classItem.id}-${dateStr}`,
        classId: classItem.id,
        className: classItem.name,
        date: dateStr,
        status,
        lesson: status !== 'missing' ? {
          title: `${classItem.subject} Lesson - ${format(currentDate, 'MMM dd')}`,
          duration: 45 + Math.floor(Math.random() * 30), // 45-75 minutes
          objectives: [
            `Learn core ${classItem.subject.toLowerCase()} concepts`,
            `Practice problem-solving skills`,
            `Apply knowledge through examples`
          ]
        } : undefined
      };
      
      mockLessonCoverage.push(coverage);
    });
  }
};

generateMockData();

export const getLessonCoverageStats = (coverageData: LessonCoverage[]) => {
  const totalLessons = coverageData.length;
  const presentLessons = coverageData.filter(l => l.status === 'present').length;
  const missingLessons = coverageData.filter(l => l.status === 'missing').length;
  const incompleteLessons = coverageData.filter(l => l.status === 'incomplete').length;
  
  return {
    totalClasses: mockClasses.length,
    totalDays: Math.ceil(totalLessons / mockClasses.length),
    presentLessons,
    missingLessons,
    incompleteLessons,
    coveragePercentage: Math.round((presentLessons / totalLessons) * 100)
  };
};
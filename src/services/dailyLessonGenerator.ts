import { useAuth } from '@/hooks/useAuth';
import { userLearningProfileService } from './userLearningProfileService';
import { conceptMasteryService } from './conceptMasteryService';
import { LessonActivity } from '@/components/education/components/types/LessonTypes';

interface DailyLessonConfig {
  subject: string;
  skillArea: string;
  userId: string;
  gradeLevel: number;
  currentDate: string;
}

interface StudentProgressData {
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  masteredConcepts: string[];
  overallAccuracy: number;
}

export class DailyLessonGenerator {
  private static readonly LESSON_CACHE_KEY = 'daily_lesson_cache';

  /**
   * Generate a completely new lesson for the day based on student progress and curriculum
   */
  static async generateDailyLesson(config: DailyLessonConfig): Promise<LessonActivity[]> {
    const { subject, skillArea, userId, gradeLevel, currentDate } = config;
    
    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    
    // Check if we have a lesson for today
    const existingLesson = this.getTodaysLesson(userId, subject, currentDate);
    if (existingLesson) {
      console.log('📚 Found existing lesson for today, using cached version');
      return existingLesson;
    }

    // Get student's current progress and abilities
    const studentProgress = await this.getStudentProgress(userId, subject, skillArea);
    
    // Generate curriculum-aligned activities based on student's current level
    const activities = await this.generateCurriculumBasedActivities(
      subject,
      skillArea,
      gradeLevel,
      studentProgress
    );

    // Cache the lesson for today
    this.cacheTodaysLesson(userId, subject, currentDate, activities);
    
    console.log(`✅ Generated ${activities.length} new activities for ${subject}`);
    return activities;
  }

  /**
   * Get student's current progress and learning profile
   */
  private static async getStudentProgress(userId: string, subject: string, skillArea: string): Promise<StudentProgressData> {
    try {
      const [profile, conceptMastery] = await Promise.all([
        userLearningProfileService.getLearningProfile(userId, subject, skillArea),
        conceptMasteryService.getConceptMastery(userId, subject)
      ]);

      return {
        currentLevel: profile?.current_difficulty_level || 1,
        strengths: profile?.strengths || [],
        weaknesses: profile?.weaknesses || [],
        masteredConcepts: conceptMastery
          .filter(c => c.masteryLevel > 0.8)
          .map(c => c.conceptName),
        overallAccuracy: profile?.overall_accuracy || 0
      };
    } catch (error) {
      console.warn('Could not load student progress, using defaults:', error);
      return {
        currentLevel: 1,
        strengths: [],
        weaknesses: [],
        masteredConcepts: [],
        overallAccuracy: 0
      };
    }
  }

  /**
   * Generate curriculum-based activities tailored to student's level
   */
  private static async generateCurriculumBasedActivities(
    subject: string,
    skillArea: string,
    gradeLevel: number,
    studentProgress: StudentProgressData
  ): Promise<LessonActivity[]> {
    const activities: LessonActivity[] = [];
    const lessonId = `lesson-${Date.now()}`;

    // Determine skill focus based on weaknesses and grade level
    const focusAreas = this.determineFocusAreas(subject, gradeLevel, studentProgress);
    
    // Generate 6-8 activities for a complete lesson (20-25 minutes)
    for (let i = 0; i < 7; i++) {
      const activityType = this.getActivityTypeForIndex(i);
      const focusArea = focusAreas[i % focusAreas.length];
      
      const activity = await this.createCurriculumActivity(
        lessonId,
        i,
        subject,
        skillArea,
        focusArea,
        gradeLevel,
        studentProgress,
        activityType
      );
      
      activities.push(activity);
    }

    return activities;
  }

  /**
   * Determine focus areas based on grade level and student progress
   */
  private static determineFocusAreas(subject: string, gradeLevel: number, studentProgress: StudentProgressData): string[] {
    const gradeBasedSkills = this.getGradeSkills(subject, gradeLevel);
    
    // Prioritize weaknesses, then add grade-appropriate skills
    const focusAreas = [
      ...studentProgress.weaknesses.slice(0, 2), // Address top 2 weaknesses
      ...gradeBasedSkills.filter(skill => !studentProgress.masteredConcepts.includes(skill))
    ];

    return focusAreas.length > 0 ? focusAreas : gradeBasedSkills;
  }

  /**
   * Get grade-appropriate skills for the subject
   */
  private static getGradeSkills(subject: string, gradeLevel: number): string[] {
    const skillMap: Record<string, Record<string, string[]>> = {
      mathematics: {
        'K-2': ['number_recognition', 'basic_addition', 'basic_subtraction', 'shapes', 'counting'],
        '3-5': ['multiplication', 'division', 'fractions', 'decimals', 'geometry_basics'],
        '6-8': ['algebra_basics', 'ratios', 'proportions', 'integers', 'coordinate_plane'],
        '9-12': ['algebra', 'geometry', 'trigonometry', 'statistics', 'calculus_prep']
      },
      english: {
        'K-2': ['phonics', 'sight_words', 'basic_reading', 'sentence_structure'],
        '3-5': ['reading_comprehension', 'vocabulary', 'grammar', 'writing_basics'],
        '6-8': ['literature_analysis', 'essay_writing', 'research_skills', 'advanced_grammar'],
        '9-12': ['critical_thinking', 'rhetorical_analysis', 'advanced_writing', 'literature_interpretation']
      },
      science: {
        'K-2': ['observation', 'classification', 'basic_life_science', 'weather'],
        '3-5': ['scientific_method', 'ecosystems', 'matter', 'energy'],
        '6-8': ['earth_science', 'biology_basics', 'chemistry_intro', 'physics_intro'],
        '9-12': ['advanced_biology', 'chemistry', 'physics', 'environmental_science']
      }
    };

    const gradeRange = gradeLevel <= 2 ? 'K-2' : 
                      gradeLevel <= 5 ? '3-5' : 
                      gradeLevel <= 8 ? '6-8' : '9-12';

    return skillMap[subject.toLowerCase()]?.[gradeRange] || ['general_skills'];
  }

  /**
   * Create a curriculum-aligned activity
   */
  private static async createCurriculumActivity(
    lessonId: string,
    index: number,
    subject: string,
    skillArea: string,
    focusArea: string,
    gradeLevel: number,
    studentProgress: StudentProgressData,
    activityType: string
  ): Promise<LessonActivity> {
    const activityId = `${lessonId}-activity-${index}`;
    const difficulty = this.calculateDifficulty(studentProgress, gradeLevel);

    // Generate age-appropriate content
    const content = await this.generateActivityContent(
      subject,
      focusArea,
      activityType,
      difficulty,
      gradeLevel
    );

    return {
      id: activityId,
      title: `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Challenge`,
      phase: this.mapActivityTypeToPhase(activityType),
      duration: 180, // 3 minutes per activity
      content,
      order: index,
      completed: false
    };
  }

  /**
   * Calculate appropriate difficulty based on student progress
   */
  private static calculateDifficulty(studentProgress: StudentProgressData, gradeLevel: number): number {
    let baseDifficulty = Math.min(gradeLevel, 5); // Cap at 5 for elementary

    // Adjust based on accuracy
    if (studentProgress.overallAccuracy > 85) {
      baseDifficulty = Math.min(baseDifficulty + 1, 10);
    } else if (studentProgress.overallAccuracy < 60) {
      baseDifficulty = Math.max(baseDifficulty - 1, 1);
    }

    return baseDifficulty;
  }

  /**
   * Generate content for the activity based on type and focus
   */
  private static async generateActivityContent(
    subject: string,
    focusArea: string,
    activityType: string,
    difficulty: number,
    gradeLevel: number
  ): Promise<any> {
    // This should call the AI content generation service
    // For now, return structured content based on type
    
    if (activityType === 'interactive-game') {
      return this.createInteractiveGameContent(subject, focusArea, difficulty, gradeLevel);
    } else if (activityType === 'content-delivery') {
      return this.createContentDeliveryContent(subject, focusArea, gradeLevel);
    } else {
      return this.createApplicationContent(subject, focusArea, difficulty, gradeLevel);
    }
  }

  private static createInteractiveGameContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number) {
    // Generate unique questions using current timestamp to ensure uniqueness
    const timestamp = Date.now();
    const uniqueNumbers = [
      Math.floor(Math.random() * 50) + (difficulty * 10),
      Math.floor(Math.random() * 30) + (difficulty * 5)
    ];

    if (subject.toLowerCase() === 'mathematics') {
      return {
        question: `Emma has ${uniqueNumbers[0]} stickers and gives away ${uniqueNumbers[1]} to her friends. How many stickers does Emma have left?`,
        options: [
          (uniqueNumbers[0] - uniqueNumbers[1]).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] + 5).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] - 3).toString(),
          (uniqueNumbers[0] + uniqueNumbers[1]).toString()
        ],
        correct: 0,
        explanation: `Emma started with ${uniqueNumbers[0]} stickers and gave away ${uniqueNumbers[1]}, so she has ${uniqueNumbers[0]} - ${uniqueNumbers[1]} = ${uniqueNumbers[0] - uniqueNumbers[1]} stickers left.`,
        uniqueId: `math-${timestamp}-${uniqueNumbers.join('-')}`
      };
    }

    return {
      question: `New question for ${focusArea} - ${timestamp}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
      explanation: "Explanation for the answer",
      uniqueId: `${subject}-${timestamp}`
    };
  }

  private static createContentDeliveryContent(subject: string, focusArea: string, gradeLevel: number) {
    return {
      text: `Today we're exploring ${focusArea.replace(/_/g, ' ')} concepts designed for your current learning level. Let's discover something new together!`,
      segments: [{
        explanation: `Understanding ${focusArea.replace(/_/g, ' ')} is an important skill that builds your knowledge step by step.`,
        examples: [`Example for ${focusArea}`, `Another way to think about ${focusArea}`]
      }]
    };
  }

  private static createApplicationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number) {
    return {
      scenario: `Let's apply what we've learned about ${focusArea.replace(/_/g, ' ')} in a real-world situation!`,
      task: `Your challenge is to use ${focusArea.replace(/_/g, ' ')} skills to solve this problem.`,
      guidance: "Take your time and think through each step carefully."
    };
  }

  private static getActivityTypeForIndex(index: number): string {
    const types = ['content-delivery', 'interactive-game', 'application', 'interactive-game', 'content-delivery', 'interactive-game', 'application'];
    return types[index % types.length];
  }

  private static mapActivityTypeToPhase(activityType: string): 'content-delivery' | 'interactive-game' | 'application' | 'introduction' | 'creative-exploration' | 'summary' {
    const phaseMap: Record<string, any> = {
      'content-delivery': 'content-delivery',
      'interactive-game': 'interactive-game',
      'application': 'application'
    };
    return phaseMap[activityType] || 'content-delivery';
  }

  /**
   * Cache management for daily lessons
   */
  private static getTodaysLesson(userId: string, subject: string, currentDate: string): LessonActivity[] | null {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      if (!cache) return null;

      const parsedCache = JSON.parse(cache);
      const key = `${userId}-${subject}-${currentDate}`;
      
      return parsedCache[key] || null;
    } catch (error) {
      console.warn('Error reading lesson cache:', error);
      return null;
    }
  }

  private static cacheTodaysLesson(userId: string, subject: string, currentDate: string, activities: LessonActivity[]): void {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      const parsedCache = cache ? JSON.parse(cache) : {};
      
      const key = `${userId}-${subject}-${currentDate}`;
      parsedCache[key] = activities;

      // Clean old entries (keep only last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      Object.keys(parsedCache).forEach(cacheKey => {
        const [, , date] = cacheKey.split('-');
        if (new Date(date) < sevenDaysAgo) {
          delete parsedCache[cacheKey];
        }
      });

      localStorage.setItem(this.LESSON_CACHE_KEY, JSON.stringify(parsedCache));
      console.log(`✅ Cached lesson for ${key}`);
    } catch (error) {
      console.warn('Error caching lesson:', error);
    }
  }

  /**
   * Force regenerate lesson (for testing or manual refresh)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    try {
      const cache = localStorage.getItem(this.LESSON_CACHE_KEY);
      if (!cache) return;

      const parsedCache = JSON.parse(cache);
      const key = `${userId}-${subject}-${currentDate}`;
      
      if (parsedCache[key]) {
        delete parsedCache[key];
        localStorage.setItem(this.LESSON_CACHE_KEY, JSON.stringify(parsedCache));
        console.log(`🗑️ Cleared cached lesson for ${key}`);
      }
    } catch (error) {
      console.warn('Error clearing lesson cache:', error);
    }
  }
}

export const dailyLessonGenerator = DailyLessonGenerator;

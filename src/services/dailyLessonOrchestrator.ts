// Daily Lesson Orchestrator - Creates targeted learning experiences
import { CurriculumManager, LearningUnit } from './curriculumManager';
import { UserLearningProfileService } from './userLearningProfileService';
import { DEFAULT_LESSON_MINUTES } from '@/constants/lesson';

export interface DailyLessonPlan {
  date: string;
  student_id: string;
  grade_level: number;
  total_duration_minutes: number;
  learning_units: LearningUnit[];
  activity_sequence: DailyActivity[];
  personalization_notes: string[];
  curriculum_coverage: {
    standards_addressed: string[];
    skills_practiced: string[];
    new_concepts_introduced: string[];
  };
}

export interface DailyActivity {
  id: string;
  type: 'warm_up' | 'instruction' | 'practice' | 'game' | 'assessment' | 'break' | 'review';
  title: string;
  duration_minutes: number;
  curriculum_unit_id: string;
  difficulty_level: number;
  activity_data: {
    content_type: 'ai_question' | 'educational_game' | 'interactive_lesson' | 'creative_project';
    parameters: Record<string, any>;
  };
  nelie_guidance: {
    introduction_prompt: string;
    help_prompts: string[];
    encouragement_messages: string[];
  };
}

export class DailyLessonOrchestrator {
  private static readonly TARGET_DAILY_MINUTES = DEFAULT_LESSON_MINUTES; // configurable lesson length
  private static readonly ACTIVITY_TYPES_DISTRIBUTION = {
    instruction: 0.30,     // 30% - Learning new concepts
    practice: 0.40,       // 40% - Practicing skills  
    games: 0.25,          // 25% - Educational games
    assessment: 0.05      // 5% - Quick progress checks
  };

  static async generateDailyLesson(
    studentId: string, 
    gradeLevel: number, 
    subject: string = 'mathematics'
  ): Promise<DailyLessonPlan> {
    console.log(`🎯 Generating lesson for Grade ${gradeLevel} ${subject}`);
    
    // Get student learning profile
    const studentProfile = await UserLearningProfileService.getLearningProfile(
      studentId, 
      subject, 
      'general'
    );

    // Get curriculum units for grade level
    const availableUnits = CurriculumManager.getCurriculumForGrade(subject, gradeLevel);
    
    // Select appropriate units based on student readiness
    const selectedUnits = this.selectLearningUnits(availableUnits, studentProfile);
    
    // Create activity sequence for targeted learning experience
    const activitySequence = await this.createTimedSequence(selectedUnits, studentProfile);
    
    const lessonPlan: DailyLessonPlan = {
      date: new Date().toISOString().split('T')[0],
      student_id: studentId,
      grade_level: gradeLevel,
      total_duration_minutes: this.TARGET_DAILY_MINUTES,
      learning_units: selectedUnits,
      activity_sequence: activitySequence,
      personalization_notes: this.generatePersonalizationNotes(studentProfile),
      curriculum_coverage: {
        standards_addressed: selectedUnits.flatMap(u => u.curriculum_standards.map(s => s.standard)),
        skills_practiced: selectedUnits.flatMap(u => u.skill_areas),
        new_concepts_introduced: this.identifyNewConcepts(selectedUnits, studentProfile)
      }
    };

    console.log(`✅ Generated lesson with ${activitySequence.length} activities`);
    return lessonPlan;
  }

  private static selectLearningUnits(availableUnits: LearningUnit[], studentProfile: any): LearningUnit[] {
    // For short lessons, focus on 1-2 learning units max
    const readinessScores = availableUnits.map(unit => ({
      unit,
      readiness: CurriculumManager.estimateStudentReadiness(studentProfile, unit)
    }));

    const suitableUnits = readinessScores
      .filter(item => item.readiness >= 60)
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, 2) // Max 2 units for concise lesson
      .map(item => item.unit);

    return suitableUnits.length > 0 ? suitableUnits : [availableUnits[0]];
  }

  private static async createTimedSequence(units: LearningUnit[], studentProfile: any): Promise<DailyActivity[]> {
    const activities: DailyActivity[] = [];
    const targetMinutes = this.TARGET_DAILY_MINUTES;
    let currentMinutes = 0;

    // Start with a quick warm-up (2 minutes)
    activities.push(this.createQuickWarmUp(studentProfile));
    currentMinutes += 2;

    // Main content delivery (6-8 minutes)
    const mainInstruction = this.createMainInstruction(units[0], studentProfile);
    activities.push(mainInstruction);
    currentMinutes += mainInstruction.duration_minutes;

    // Interactive practice (5-7 minutes)
    const practiceActivity = this.createPracticeActivity(units[0], studentProfile);
    activities.push(practiceActivity);
    currentMinutes += practiceActivity.duration_minutes;

    // Educational game (4-6 minutes)
    const gameActivity = this.createGameActivity(units[0], studentProfile);
    activities.push(gameActivity);
    currentMinutes += gameActivity.duration_minutes;

    // Final assessment/review (2-3 minutes)
    const finalActivity = this.createQuickAssessment(units[0], studentProfile);
    activities.push(finalActivity);
    currentMinutes += finalActivity.duration_minutes;

    // Adjust timing to match target duration
    this.adjustTimingToTargetMinutes(activities, targetMinutes);

    console.log(`📋 Created sequence: ${activities.length} activities, ${currentMinutes} minutes`);
    return activities;
  }

  private static adjustTimingToTargetMinutes(activities: DailyActivity[], targetMinutes: number): void {
    const currentTotal = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);
    
    if (currentTotal !== targetMinutes) {
      const difference = targetMinutes - currentTotal;
      // Distribute the difference across practice and game activities
      const adjustableActivities = activities.filter(a => a.type === 'practice' || a.type === 'game');
      
      if (adjustableActivities.length > 0) {
        const adjustmentPerActivity = Math.floor(difference / adjustableActivities.length);
        adjustableActivities.forEach(activity => {
          activity.duration_minutes = Math.max(2, activity.duration_minutes + adjustmentPerActivity);
        });
      }
    }
  }

  private static createQuickWarmUp(studentProfile: any): DailyActivity {
    return {
      id: `warmup-${Date.now()}`,
      type: 'warm_up',
      title: 'Quick Math Warm-Up',
      duration_minutes: 2,
      curriculum_unit_id: 'review',
      difficulty_level: Math.max(1, studentProfile.current_difficulty_level - 1),
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: 2,
          review_previous_concepts: true,
          time_limit: 120 // 2 minutes
        }
      },
      nelie_guidance: {
        introduction_prompt: "Let's start with a quick warm-up to activate your math brain!",
        help_prompts: [
          "Take a moment to think...",
          "Remember what we learned before!",
          "You've got this!"
        ],
        encouragement_messages: [
          "Great start!",
          "Your brain is ready to learn!",
          "Perfect warm-up!"
        ]
      }
    };
  }

  private static createMainInstruction(unit: LearningUnit, studentProfile: any): DailyActivity {
    return {
      id: `instruction-${unit.id}-${Date.now()}`,
      type: 'instruction',
      title: `Learn: ${unit.title}`,
      duration_minutes: 7,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'interactive_lesson',
        parameters: {
          curriculum_standards: unit.curriculum_standards,
          learning_objectives: unit.curriculum_standards.flatMap(s => s.learning_objectives),
          visual_aids: true,
          interactive_examples: true,
          time_limit: 420 // 7 minutes
        }
      },
      nelie_guidance: {
        introduction_prompt: `Today we're exploring ${unit.title}! I'll guide you through each step.`,
        help_prompts: [
          "Would you like me to explain this differently?",
          "Let's break this into smaller steps!",
          "Ask me anything you're curious about!"
        ],
        encouragement_messages: [
          "You're understanding this really well!",
          "Great questions help you learn!",
          "I can see you're thinking deeply about this!"
        ]
      }
    };
  }

  private static createPracticeActivity(unit: LearningUnit, studentProfile: any): DailyActivity {
    return {
      id: `practice-${unit.id}-${Date.now()}`,
      type: 'practice',
      title: `Practice: ${unit.title}`,
      duration_minutes: 6,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: 4,
          curriculum_aligned: true,
          adaptive_difficulty: true,
          skill_areas: unit.skill_areas,
          time_limit: 360 // 6 minutes
        }
      },
      nelie_guidance: {
        introduction_prompt: "Time to practice what we just learned! You're ready for this!",
        help_prompts: [
          "What strategy might work here?",
          "Think about what we just learned...",
          "Take your time to work through this!"
        ],
        encouragement_messages: [
          "Excellent thinking!",
          "You're applying the concepts perfectly!",
          "Your practice is paying off!"
        ]
      }
    };
  }

  private static createGameActivity(unit: LearningUnit, studentProfile: any): DailyActivity {
    return {
      id: `game-${unit.id}-${Date.now()}`,
      type: 'game',
      title: `Math Game: ${unit.title}`,
      duration_minutes: 4,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'educational_game',
        parameters: {
          game_type: 'quick_challenge',
          skill_focus: unit.skill_areas[0],
          fun_theme: this.selectGameTheme(studentProfile),
          time_limit: 240 // 4 minutes
        }
      },
      nelie_guidance: {
        introduction_prompt: "Let's make learning fun with this quick game challenge!",
        help_prompts: [
          "Games help your brain learn in exciting ways!",
          "Don't worry about mistakes - they help you grow!",
          "What patterns do you notice?"
        ],
        encouragement_messages: [
          "You're learning and having fun!",
          "Games make math exciting!",
          "Your playful learning is amazing!"
        ]
      }
    };
  }

  private static createQuickAssessment(unit: LearningUnit, studentProfile: any): DailyActivity {
    return {
      id: `assessment-${unit.id}-${Date.now()}`,
      type: 'assessment',
      title: `Quick Check: ${unit.title}`,
      duration_minutes: 1,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: 1,
          mastery_check: true,
          curriculum_standards: unit.curriculum_standards.map(s => s.id),
          time_limit: 60 // 1 minute
        }
      },
      nelie_guidance: {
        introduction_prompt: "Let's do a quick check of what you've learned!",
        help_prompts: [
          "Think about what we practiced...",
          "You know this!",
          "Take a moment to consider..."
        ],
        encouragement_messages: [
          "Great progress in this short lesson!",
          "Your understanding is growing!",
          "Ready for tomorrow's adventure!"
        ]
      }
    };
  }

  private static selectGameTheme(studentProfile: any): string {
    const themes = ['space_adventure', 'underwater_exploration', 'magical_forest', 'detective_mystery', 'cooking_challenge'];
    return themes[Math.floor(Math.random() * themes.length)];
  }

  private static generatePersonalizationNotes(studentProfile: any): string[] {
    const notes: string[] = [];
    
    if (studentProfile.learning_style === 'visual') {
      notes.push('Uses visual representations and diagrams for concept explanation');
    }
    
    if (studentProfile.attention_span_minutes < DEFAULT_LESSON_MINUTES) {
      notes.push('Optimized for focused learning sessions');
    }
    
    if (studentProfile.overall_accuracy < 70) {
      notes.push('Provides additional scaffolding and encouragement');
    }
    
    notes.push(`Adjusted for ${studentProfile.preferred_pace} learning pace`);
    notes.push('Designed for optimal engaged learning duration');
    
    return notes;
  }

  private static identifyNewConcepts(units: LearningUnit[], studentProfile: any): string[] {
    const allConcepts = units.flatMap(u => u.curriculum_standards.flatMap(s => s.learning_objectives));
    const masteredConcepts = studentProfile.mastered_concepts || [];
    
    return allConcepts.filter(concept => !masteredConcepts.includes(concept));
  }

  static async generateAdditionalActivities(
    basePlan: DailyLessonPlan, 
    count: number = 3
  ): Promise<DailyActivity[]> {
    console.log(`🚀 Generating ${count} additional activities for fast learners`);
    
    const additionalActivities: DailyActivity[] = [];
    const baseUnit = basePlan.learning_units[0];
    
    for (let i = 0; i < count; i++) {
      const activityType = i % 2 === 0 ? 'practice' : 'game';
      
      const activity: DailyActivity = {
        id: `additional-${Date.now()}-${i}`,
        type: activityType,
        title: `Bonus ${activityType === 'practice' ? 'Practice' : 'Game'}: ${baseUnit?.title}`,
        duration_minutes: 5,
        curriculum_unit_id: baseUnit?.id || 'general',
        difficulty_level: 3, // Slightly higher for fast learners
        activity_data: {
          content_type: activityType === 'practice' ? 'ai_question' : 'educational_game',
          parameters: {
            question_count: activityType === 'practice' ? 3 : undefined,
            game_type: activityType === 'game' ? 'challenge_mode' : undefined,
            adaptive_difficulty: true,
            time_limit: 300 // 5 minutes
          }
        },
        nelie_guidance: {
          introduction_prompt: `Excellent progress! Here's an extra ${activityType} to keep you challenged!`,
          help_prompts: [
            "You're ready for this challenge!",
            "Use what you've learned so far!",
            "Take your time to think it through!"
          ],
          encouragement_messages: [
            "Amazing progress!",
            "You're mastering this quickly!",
            "Your learning speed is impressive!"
          ]
        }
      };
      
      additionalActivities.push(activity);
    }
    
    return additionalActivities;
  }
}


// Daily Lesson Orchestrator - Creates 3-hour comprehensive learning experiences
import { CurriculumManager, LearningUnit } from './curriculumManager';
import { UserLearningProfileService } from './userLearningProfileService';

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
  private static readonly TARGET_DAILY_MINUTES = 180; // 3 hours
  private static readonly ACTIVITY_TYPES_DISTRIBUTION = {
    instruction: 0.25,     // 25% - Learning new concepts
    practice: 0.35,       // 35% - Practicing skills
    games: 0.25,          // 25% - Educational games
    assessment: 0.10,     // 10% - Progress checking
    breaks: 0.05          // 5% - Mental breaks
  };

  static async generateDailyLesson(
    studentId: string, 
    gradeLevel: number, 
    subject: string = 'mathematics'
  ): Promise<DailyLessonPlan> {
    console.log(`🎯 Generating comprehensive daily lesson for Grade ${gradeLevel} ${subject}`);
    
    // Get student learning profile
    const studentProfile = await UserLearningProfileService.getLearningProfile(
      studentId, 
      subject, 
      'general'
    );

    // Get curriculum units for grade level
    const availableUnits = CurriculumManager.getCurriculumForGrade(subject, gradeLevel);
    
    // Select appropriate units based on student readiness and previous progress
    const selectedUnits = this.selectLearningUnits(availableUnits, studentProfile);
    
    // Create activity sequence for 3-hour learning experience
    const activitySequence = await this.createActivitySequence(selectedUnits, studentProfile);
    
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

    console.log(`✅ Generated daily lesson with ${activitySequence.length} activities covering ${lessonPlan.curriculum_coverage.standards_addressed.length} standards`);
    return lessonPlan;
  }

  private static selectLearningUnits(availableUnits: LearningUnit[], studentProfile: any): LearningUnit[] {
    // Select 2-3 learning units that fit the student's current level
    const readinessScores = availableUnits.map(unit => ({
      unit,
      readiness: CurriculumManager.estimateStudentReadiness(studentProfile, unit)
    }));

    // Sort by readiness and select appropriate units
    const suitableUnits = readinessScores
      .filter(item => item.readiness >= 60) // Student must be at least 60% ready
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, 3)
      .map(item => item.unit);

    return suitableUnits.length > 0 ? suitableUnits : [availableUnits[0]]; // Fallback to first unit
  }

  private static async createActivitySequence(units: LearningUnit[], studentProfile: any): Promise<DailyActivity[]> {
    const activities: DailyActivity[] = [];
    const totalMinutes = this.TARGET_DAILY_MINUTES;
    let remainingMinutes = totalMinutes;

    // Start with warm-up activity (10 minutes)
    activities.push(this.createWarmUpActivity(studentProfile));
    remainingMinutes -= 10;

    // Distribute remaining time across units
    const minutesPerUnit = Math.floor(remainingMinutes / units.length);
    
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const unitActivities = await this.createUnitActivities(unit, minutesPerUnit, studentProfile);
      activities.push(...unitActivities);

      // Add break between units (except last)
      if (i < units.length - 1) {
        activities.push(this.createBreakActivity(5));
      }
    }

    // End with review activity
    activities.push(this.createReviewActivity(studentProfile));

    return activities;
  }

  private static createWarmUpActivity(studentProfile: any): DailyActivity {
    return {
      id: `warmup-${Date.now()}`,
      type: 'warm_up',
      title: 'Daily Math Warm-Up',
      duration_minutes: 10,
      curriculum_unit_id: 'review',
      difficulty_level: Math.max(1, studentProfile.current_difficulty_level - 1),
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: 3,
          review_previous_concepts: true,
          adaptive_difficulty: true
        }
      },
      nelie_guidance: {
        introduction_prompt: "Good morning! Let's start with a quick warm-up to get your math brain ready for today's adventure!",
        help_prompts: [
          "Remember what we learned yesterday?",
          "Take your time, there's no rush!",
          "You're doing great, keep going!"
        ],
        encouragement_messages: [
          "Perfect start to the day!",
          "Your brain is warmed up and ready!",
          "Great job getting ready to learn!"
        ]
      }
    };
  }

  private static async createUnitActivities(unit: LearningUnit, timeAllocation: number, studentProfile: any): Promise<DailyActivity[]> {
    const activities: DailyActivity[] = [];
    
    // Instruction phase (25% of unit time)
    const instructionTime = Math.floor(timeAllocation * 0.25);
    activities.push({
      id: `instruction-${unit.id}-${Date.now()}`,
      type: 'instruction',
      title: `Learning: ${unit.title}`,
      duration_minutes: instructionTime,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'interactive_lesson',
        parameters: {
          curriculum_standards: unit.curriculum_standards,
          learning_objectives: unit.curriculum_standards.flatMap(s => s.learning_objectives),
          visual_aids: true,
          interactive_examples: true
        }
      },
      nelie_guidance: {
        introduction_prompt: `Today we're exploring ${unit.title}! I'll be here to help you understand every step.`,
        help_prompts: [
          "Would you like me to explain this differently?",
          "Let's break this down into smaller pieces!",
          "Remember, questions help you learn better!"
        ],
        encouragement_messages: [
          "You're getting the hang of this!",
          "Great questions lead to great understanding!",
          "I can see you're really thinking about this!"
        ]
      }
    });

    // Practice phase (35% of unit time)
    const practiceTime = Math.floor(timeAllocation * 0.35);
    activities.push({
      id: `practice-${unit.id}-${Date.now()}`,
      type: 'practice',
      title: `Practice: ${unit.title}`,
      duration_minutes: practiceTime,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: Math.floor(practiceTime / 3), // ~3 minutes per question
          curriculum_aligned: true,
          adaptive_difficulty: true,
          skill_areas: unit.skill_areas
        }
      },
      nelie_guidance: {
        introduction_prompt: "Time to practice what we just learned! I believe in you!",
        help_prompts: [
          "What strategy might work here?",
          "Let's think step by step...",
          "What do you remember from our lesson?"
        ],
        encouragement_messages: [
          "Excellent work! You're mastering this!",
          "I love how you're thinking through this!",
          "You're building strong math skills!"
        ]
      }
    });

    // Game phase (25% of unit time)
    const gameTime = Math.floor(timeAllocation * 0.25);
    activities.push({
      id: `game-${unit.id}-${Date.now()}`,
      type: 'game',
      title: `Math Game: ${unit.title}`,
      duration_minutes: gameTime,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'educational_game',
        parameters: {
          game_type: 'adaptive_challenge',
          skill_focus: unit.skill_areas[0],
          fun_theme: this.selectGameTheme(studentProfile),
          collaborative_elements: true
        }
      },
      nelie_guidance: {
        introduction_prompt: "Learning through play is the best! Let's have some fun while practicing math!",
        help_prompts: [
          "Games help your brain learn in new ways!",
          "Don't worry about mistakes - they help you learn!",
          "What pattern do you notice?"
        ],
        encouragement_messages: [
          "You're having fun AND learning!",
          "Games make math exciting!",
          "Your playful learning is inspiring!"
        ]
      }
    });

    // Assessment phase (10% of unit time)
    const assessmentTime = Math.floor(timeAllocation * 0.10);
    activities.push({
      id: `assessment-${unit.id}-${Date.now()}`,
      type: 'assessment',
      title: `Check Understanding: ${unit.title}`,
      duration_minutes: assessmentTime,
      curriculum_unit_id: unit.id,
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'ai_question',
        parameters: {
          question_count: 2,
          mastery_check: true,
          curriculum_standards: unit.curriculum_standards.map(s => s.id),
          adaptive_feedback: true
        }
      },
      nelie_guidance: {
        introduction_prompt: "Let's see how well you understand what we've learned today!",
        help_prompts: [
          "Take your time to think...",
          "What strategies have worked for you?",
          "Remember, this helps me understand how to help you better!"
        ],
        encouragement_messages: [
          "You've shown great understanding!",
          "I'm proud of your learning today!",
          "You're ready for tomorrow's adventures!"
        ]
      }
    });

    return activities;
  }

  private static createBreakActivity(minutes: number): DailyActivity {
    return {
      id: `break-${Date.now()}`,
      type: 'break',
      title: 'Learning Break',
      duration_minutes: minutes,
      curriculum_unit_id: 'break',
      difficulty_level: 0,
      activity_data: {
        content_type: 'interactive_lesson',
        parameters: {
          break_type: 'mindful_moment',
          activities: ['deep_breathing', 'positive_visualization', 'gentle_movement']
        }
      },
      nelie_guidance: {
        introduction_prompt: "Time for a quick brain break! Let's recharge for more learning!",
        help_prompts: [
          "Take some deep breaths with me!",
          "Stretch those learning muscles!",
          "A little rest helps your brain grow stronger!"
        ],
        encouragement_messages: [
          "Perfect! You're taking care of your learning brain!",
          "Rest is an important part of learning!",
          "You're ready for the next adventure!"
        ]
      }
    };
  }

  private static createReviewActivity(studentProfile: any): DailyActivity {
    return {
      id: `review-${Date.now()}`,
      type: 'review',
      title: 'Daily Learning Review',
      duration_minutes: 15,
      curriculum_unit_id: 'review',
      difficulty_level: studentProfile.current_difficulty_level || 2,
      activity_data: {
        content_type: 'interactive_lesson',
        parameters: {
          review_type: 'reflection_and_consolidation',
          summarize_key_concepts: true,
          celebrate_progress: true,
          preview_tomorrow: true
        }
      },
      nelie_guidance: {
        introduction_prompt: "What an amazing learning day! Let's review all the incredible things you've discovered!",
        help_prompts: [
          "What was your favorite part of today?",
          "What new skill are you most proud of?",
          "What would you like to explore more tomorrow?"
        ],
        encouragement_messages: [
          "You've accomplished so much today!",
          "Your learning journey is inspiring!",
          "I can't wait to see what you'll discover tomorrow!"
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
    
    if (studentProfile.attention_span_minutes < 20) {
      notes.push('Includes frequent breaks and variety to maintain engagement');
    }
    
    if (studentProfile.overall_accuracy < 70) {
      notes.push('Provides additional scaffolding and encouragement');
    }
    
    notes.push(`Adjusted for ${studentProfile.preferred_pace} learning pace`);
    
    return notes;
  }

  private static identifyNewConcepts(units: LearningUnit[], studentProfile: any): string[] {
    const allConcepts = units.flatMap(u => u.curriculum_standards.flatMap(s => s.learning_objectives));
    const masteredConcepts = studentProfile.mastered_concepts || [];
    
    return allConcepts.filter(concept => !masteredConcepts.includes(concept));
  }
}

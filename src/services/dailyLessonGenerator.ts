// @ts-nocheck

import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import { DailyLessonConfig } from './dailyLessonGenerator/types';
import { StudentProgressService } from './dailyLessonGenerator/studentProgressService';
import { CurriculumService } from './dailyLessonGenerator/curriculumService';
import { CacheService } from './dailyLessonGenerator/cacheService';
import { calendarService } from './CalendarService';
import { aiContentGenerator } from './content/aiContentGenerator'; // Fixed import path
import learnerProfileService from './learnerProfile/LearnerProfileService';
import { supabase } from '@/integrations/supabase/client';
import { generateContent } from '@/ai/contentService';
import { buildLessonContext as buildUnifiedLessonContext } from './content/unifiedLessonContext';
import { generateLessonPlan, generateActivityForSlot } from './content/aiPlannerActivityPipeline';
import type { Planner, PlannerActivitySlot, GeneratedActivity } from './content/aiPlannerActivityPipeline';
import { DEFAULT_DAILY_UNIVERSE_MINUTES } from '@/constants/lesson';
import { validateAndNormalize } from '@/services/ai/validators/lessonQuality';
import { resolveCurriculumTargets } from '@/utils/curriculumTargets';

// Cache world/context/slots for per-slot regeneration (dev-only usage)
const PLANNER_SESSION_CACHE = new Map<string, { world: any; context: any; slots: any[] }>();

export class DailyLessonGenerator {
  /**
   * Generate a completely new lesson for the day based on student progress and curriculum
   */
  static async generateDailyLesson(config: DailyLessonConfig): Promise<LessonActivity[]> {
    const { subject, skillArea, userId, gradeLevel, currentDate } = config;
    
    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    
    // Get student's current progress and abilities
    const studentProgress = await StudentProgressService.getStudentProgress(userId, subject, skillArea);
    const learnerProfile = await learnerProfileService.getProfile(userId);
    const activeKeywords = await calendarService.getActiveKeywords(currentDate, gradeLevel, []);
    console.log('📅 Active keywords for lesson:', activeKeywords.join(', '));
    
    // Generate AI-powered curriculum activities using the new prompt template
    const activities = await this.generateAIPoweredActivities(
      subject,
      skillArea,
      gradeLevel,
      studentProgress,
      learnerProfile,
      activeKeywords,
    );
    
    console.log(`✅ Generated ${activities.length} AI-powered activities for ${subject}`);
    return activities;
  }

  /**
   * Generate AI-powered activities using the new prompt template system
   */
  private static async generateAIPoweredActivities(
    subject: string,
    skillArea: string,
    gradeLevel: number,
    studentProgress: any,
    learnerProfile: any,
    activeKeywords: string[],
  ): Promise<LessonActivity[]> {
    if ((subject || '').toLowerCase() === 'general') {
      throw new Error('Subject=general afvist: Planner kræver kanonisk fag.');
    }
    // 0) Preferred: Planner → Activity pipeline (new)
    try {
      const targets = resolveCurriculumTargets({ subject, gradeBand: String(gradeLevel), country: 'DK' });
      console.debug("[NELIE] Planner ctx", {
        subject,
        gradeBand: String(gradeLevel),
        targets: targets.slice(0, 5),
        calendar: activeKeywords
      });

      const context = buildUnifiedLessonContext({
        subject,
        gradeLevel,
        activeKeywords,
        learnerProfile,
        studentProgress,
        lessonDurationMinutes: DEFAULT_DAILY_UNIVERSE_MINUTES,
        curriculumTargets: targets,
      });

      const planner = await generateLessonPlan(context);
      const world = planner.world;
      const slots: PlannerActivitySlot[] = (planner.scenes || []).flatMap(s => s.activities) as PlannerActivitySlot[];
      const allSlots = planner.bonusActivity ? [...slots, planner.bonusActivity as PlannerActivitySlot] : slots;
      console.info("[NELIE] Planner OK", {
        subject,
        duration: context.time.lessonDurationMinutes,
        slots: allSlots.length,
        standards: (context.curriculum?.standards?.length ?? 0)
      });

      // --- Finish & polish helpers (slot-level) ---
      const bindStandardsToSlots = (arr: any[], targets: string[]) => {
        if (!Array.isArray(arr) || !targets?.length) return arr;
        return arr.map((s: any, i: number) => {
          const std = (s as any).linkedCurriculumStandard || targets[i % targets.length];
          const lo = (s as any).learningObjective || `Apply standard ${std}`;
          return { ...s, linkedCurriculumStandard: std, learningObjective: lo };
        });
      };

      const normalizePlannerTime = (arr: any[], targetMin = 150) => {
        const sum = arr.reduce((a: number, s: any) => a + (s?.timeMin || s?.estimatedTimeMin || 0), 0);
        const diff = targetMin - sum;
        if (Math.abs(diff) <= 5 || !arr.length) return arr;
        const per = Math.trunc(diff / arr.length);
        return arr.map((s: any) => ({
          ...s,
          timeMin: Math.max(3, (s?.timeMin || s?.estimatedTimeMin || 0) + per),
        }));
      };

      const enforceVariety = (arr: any[]) => {
        const kinds = new Set(arr.map((s: any) => (s?.activityType || s?.type)));
        if (kinds.size >= 3) return arr;
        const upgrade = (s: any) => {
          const t = s?.activityType || s?.type;
          if (t === 'diagnostic_mcq') return { ...s, activityType: 'scenario_choice', type: 'scenario_choice' };
          if (t === 'observation' || t === 'observe_image') return { ...s, activityType: 'short_constructed_response', type: 'short_constructed_response' };
          return s;
        };
        return arr.map((s: any, i: number) => (i % 2 === 0 ? upgrade(s) : s));
      };

      // Prepare slots: bind standards, normalize time (~80% activities), and enforce variety
      const slotsTargetMin = Math.round((context.time.lessonDurationMinutes || 45) * 0.8);
      const preparedSlots: PlannerActivitySlot[] = enforceVariety(
        normalizePlannerTime(
          bindStandardsToSlots(allSlots as any[], (context as any)?.curriculum?.standards || []),
          slotsTargetMin
        )
      ) as any;

      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      // Store session context for dev regeneration
      PLANNER_SESSION_CACHE.set(sessionId, { world, context, slots: preparedSlots as any[] });

      const mapKindToLessonType = (k: string): LessonActivity['type'] => {
        switch (k) {
          case 'diagnostic_mcq': return 'interactive-game';
          case 'scenario_choice': return 'interactive-game';
          case 'data_reading': return 'application';
          case 'observe_image': return 'content-delivery';
          case 'creative_task': return 'creative-exploration';
          case 'sort_match': return 'interactive-game';
          case 'puzzle': return 'interactive-game';
          default: return 'content-delivery';
        }
      };

      const intro: LessonActivity = {
        id: `${sessionId}-intro`,
        title: world?.title || `${subject} Adventure`,
        type: 'introduction',
        duration: Math.max(180, Math.round((context.time.lessonDurationMinutes || 45) * 60 * 0.1)),
        content: {
          hook: world?.tone,
          text: (world as any)?.setting || (planner as any)?.world?.tone,
          description: (planner as any)?.world?.title
        },
        subject,
        skillArea
      };

      const generatedActivities: LessonActivity[] = await Promise.all(
        preparedSlots.map(async (slot, i) => {
          const g = await generateActivityForSlot(slot, world, context);
          const type = mapKindToLessonType((g as any).kind || (slot as any).type);
          const act = {
            id: `${sessionId}-act-${i + 1}`,
            title: (g as any).question || (g as any).narrative || `${subject} Activity ${i + 1}`,
            type,
            duration: Math.max(120, (((g as any).estimatedTimeMin ?? (slot as any).timeMin ?? 5) * 60)),
            content: {
              question: (g as any).question,
              options: (g as any).options,
              correctAnswer: typeof (g as any).correctIndex === 'number' ? (g as any).correctIndex : undefined,
              explanation: (g as any).explanation,
              text: (g as any).narrative,
              scenario: (g as any).narrative,
              instructions: (g as any).narrative
            },
            difficulty: ((g as any).finalDifficulty || (g as any).difficulty) as any,
            subject,
            skillArea,
            curriculumStandard: (slot as any).linkedCurriculumStandard,
            metadata: { generatedBy: 'planner-activity', slotId: (slot as any).slotId, sessionId, curriculumStandard: (slot as any).linkedCurriculumStandard, learningObjective: (slot as any).learningObjective }
          } as LessonActivity;
          return sanitizeLessonActivity(act);
        })
      );

      // Mini-validator normalization focused on activity block (80% of total time)
      const targetActivitiesMin = Math.round((context.time.lessonDurationMinutes || 45) * 0.8);
      const validated = validateAndNormalize(
        generatedActivities.map((a: any) => ({
          question: a?.content?.question || a?.title,
          options: a?.content?.options,
          correctIndex: a?.content?.correctAnswer,
          rubric: a?.content?.rubric,
          hints: a?.content?.hints || (a?.content?.explanation ? [String(a.content.explanation).slice(0, 120)] : []),
          estimatedTimeMin: Math.max(3, Math.round((a?.duration || 180) / 60)),
          kind: a?.type,
          __original: a,
        })),
        targetActivitiesMin
      ) as any[];

      if (!validated.length) {
        throw new Error('[NELIE] No valid activities after validation (Planner→Activities)');
      }

      const normalizedActivities: LessonActivity[] = validated.map((v: any) => {
        const orig = v.__original as LessonActivity;
        return {
          ...orig,
          duration: Math.max(120, Number(v.estimatedTimeMin || Math.round((orig.duration || 180) / 60)) * 60),
        };
      });

      console.debug('[NELIE] Activities summary', {
        count: normalizedActivities.length,
        kinds: Array.from(new Set(normalizedActivities.map((a: any) => a.type))),
        timeSum: Math.round(normalizedActivities.reduce((s: number, a: any) => s + (a.duration || 0), 0) / 60),
      });

      const wrap: LessonActivity = {
        id: `${sessionId}-wrap`,
        title: 'Reflection & Wrap-up',
        type: 'summary',
        duration: Math.max(180, Math.round((context.time.lessonDurationMinutes || 45) * 60 * 0.1)),
        content: {
          keyTakeaways: ((planner as any)?.world?.learningObjectives) || []
        },
        subject,
        skillArea
      };

      const mapped = [intro, ...normalizedActivities, wrap];
      if (mapped.length >= 2) {
        console.log(`✅ Planner→Activity pipeline generated ${normalizedActivities.length} activities`);
        return mapped;
      }
    } catch (e) {
      console.warn('⚠️ Planner→Activity pipeline failed, trying legacy structured plan:', e);
    }

    // 1) Try structured full-lesson plan first (120–180 min)
    try {
      const ability = (studentProgress?.accuracy_rate ?? 0.65) >= 0.85
        ? 'above'
        : (studentProgress?.accuracy_rate ?? 0.65) >= 0.6
          ? 'normal'
          : 'below';

      const plan = await generateContent({
        mode: 'daily',
        subject,
        gradeLevel,
        curriculum: 'K-12',
        studentProfile: {
          ability,
          learningStyle: learnerProfile?.learning_style_preference || 'mixed'
        }
      });

      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const normalizeType = (t?: string): LessonActivity['type'] => {
        const s = (t || '').toLowerCase();
        if (s.includes('quiz') || s.includes('question') || s.includes('check')) return 'interactive-game';
        if (s.includes('game')) return 'educational-game';
        if (s.includes('discussion') || s.includes('reflection')) return 'summary';
        if (s.includes('project') || s.includes('practice') || s.includes('task') || s.includes('application')) return 'application';
        return 'content-delivery';
      };

      const mapped: LessonActivity[] = [];

      // Intro with objectives/materials
      mapped.push({
        id: `${sessionId}-intro`,
        title: `${subject} Overview & Objectives`,
        type: 'introduction',
        duration: Math.max(300, Math.min(900, plan.durationMinutes ? Math.round(plan.durationMinutes * 60 * 0.05) : 600)),
        content: {
          hook: plan.objectives?.length ? `Today's objectives: ${plan.objectives.slice(0, 3).join('; ')}` : undefined,
          text: plan.materials?.length ? `Materials: ${plan.materials.join(', ')}` : undefined,
          description: plan.title
        },
        subject,
        skillArea
      });

      (plan.activities || []).forEach((act, i) => {
        mapped.push({
          id: `${sessionId}-act-${i + 1}`,
          title: act.type ? `${act.type}` : `${subject} Activity ${i + 1}`,
          type: normalizeType(act.type),
          duration: Math.max(180, (act.timebox || 10) * 60),
          content: {
            instructions: act.instructions,
            text: act.instructions
          },
          subject,
          skillArea,
          metadata: { generatedBy: 'full-lesson', planTitle: plan.title, index: i }
        });
      });

      if (plan.reflectionPrompts?.length) {
        mapped.push({
          id: `${sessionId}-reflect`,
          title: 'Reflection & Wrap-up',
          type: 'summary',
          duration: Math.max(300, Math.min(900, plan.durationMinutes ? Math.round(plan.durationMinutes * 60 * 0.1) : 600)),
          content: {
            keyTakeaways: plan.reflectionPrompts
          },
          subject,
          skillArea
        });
      }

      if (mapped.length >= 2) {
        console.log(`✅ Structured plan generated with ${mapped.length} segments`);
        return mapped;
      }
    } catch (e) {
      console.warn('⚠️ Structured plan generation failed, falling back to activity-by-activity:', e);
    }

    // 2) Fallback: generate 7 diverse activities (legacy path)
    const activities: LessonActivity[] = [];
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const usedQuestions = new Set<string>(); // Track used questions to prevent duplicates

    console.log('🤖 Using AI content generation with new prompt template');
    console.log(`🎯 Session ID: ${sessionId} - Generating unique content`);

    // Generate 7 diverse activities using AI with enhanced variety
    for (let i = 0; i < 7; i++) {
      let attempts = 0;
      let uniqueContent = false;
      
      while (!uniqueContent && attempts < 3) {
        try {
          // Use standard lesson generation for daily lessons, not Training Ground
          const { data: aiContent, error } = await supabase.functions.invoke('generate-adaptive-content', {
            body: {
              type: 'lesson-activity',
              subject,
              skillArea: this.getVariedSkillAreaForIndex(skillArea, i),
              gradeLevel,
              difficultyLevel: gradeLevel + this.getDifficultyVariation(i),
              activityType: this.getActivityTypeForIndex(i),
              learningStyle: learnerProfile?.learning_style_preference || 'balanced',
              interests: learnerProfile?.interests || [],
              performanceData: {
                accuracy: studentProgress?.accuracy_rate || 0.75,
                engagement: studentProgress?.engagement_level || 'moderate'
              },
              calendarKeywords: activeKeywords,
              sessionId,
              activityIndex: i,
              varietyPrompt: this.getVarietyPrompt(i),
              uniquenessSeeds: this.getUniquenessSeeds(i, attempts)
            }
          });

          if (error) {
            console.error('❌ Training Ground generation error:', error);
            throw error;
          }

          // Handle both envelope { generatedContent } and raw content objects from the edge function
          const payload: any = (aiContent && (aiContent as any).generatedContent)
            ? (aiContent as any).generatedContent
            : aiContent || {};

          // Basic validation: ensure we have at least a question/title or options
          const questionText: string | undefined = payload.question || payload.prompt || payload.title;
          const titleText: string = payload.title || this.generateActivityTitle(subject, skillArea, i);

          // Uniqueness check uses normalized question/title text
          const questionKey = (questionText?.toLowerCase().trim()) ||
                              (titleText?.toLowerCase().trim()) ||
                              `activity-${i}`;

          if (!usedQuestions.has(questionKey)) {
            usedQuestions.add(questionKey);
            uniqueContent = true;

            const options = payload.options || payload.choices || [];
            const correctAnswer = (typeof payload.correctIndex === 'number')
              ? payload.correctIndex
              : (typeof payload.correct === 'number'
                  ? payload.correct
                  : payload.correctAnswer);

            const activity: LessonActivity = {
              id: `${sessionId}-activity-${i}`,
              title: titleText,
              type: this.getActivityTypeForIndex(i) as any,
              phase: this.getActivityTypeForIndex(i) as any,
              duration: 180,
              content: {
                question: questionText,
                options,
                correctAnswer,
                explanation: payload.explanation,
                text: payload.explanation || payload.text,
                hook: payload.hook,
                scenario: payload.scenario,
                creativePrompt: payload.creativePrompt
              },
              difficulty: gradeLevel + this.getDifficultyVariation(i),
              subject,
              skillArea: this.getVariedSkillAreaForIndex(skillArea, i),
              metadata: {
                generatedBy: 'daily-lesson-ai',
                sessionId,
                activityIndex: i
              }
            };

            activities.push(activity);
            console.log(`✅ Generated UNIQUE AI activity ${i + 1}: ${activity.title}`);
          } else {
            console.log(`🔄 Duplicate detected for activity ${i + 1}, retrying...`);
            attempts++;
          }
        } catch (error) {
          console.error(`❌ Failed to generate AI activity ${i} (attempt ${attempts + 1}):`, error);
          attempts++;
        }
      }
      
      // If we couldn't generate unique content, create fallback
      if (!uniqueContent) {
        const fallbackActivity: LessonActivity = {
          id: `${sessionId}-fallback-${i}`,
          title: `${subject} Challenge ${i + 1}`,
          type: 'quiz',
          phase: 'quiz',
          duration: 180,
          content: {
            question: `Challenge ${i + 1}: What mathematical principle applies here? (Scenario ${i + 1})`,
            options: [
              `Approach A for scenario ${i + 1}`,
              `Approach B for scenario ${i + 1}`,
              `Approach C for scenario ${i + 1}`,
              `Approach D for scenario ${i + 1}`
            ],
            correctAnswer: i % 4,
            explanation: `This scenario helps build understanding of ${subject} concepts through practical application.`
          },
          subject,
          skillArea
        };
        activities.push(fallbackActivity);
        console.log(`⚠️ Using fallback activity ${i + 1}`);
      }
    }

    return activities;
  }

  private static generateActivityTitle(subject: string, skillArea: string, index: number): string {
    const titles = [
      `${subject} Fundamentals`,
      `${skillArea.replace(/_/g, ' ')} Challenge`,
      `Problem Solving in ${subject}`,
      `${subject} Application`,
      `Critical Thinking`,
      `Advanced ${skillArea.replace(/_/g, ' ')}`,
      `${subject} Mastery`
    ];
    return titles[index % titles.length];
  }

  private static getActivityTypeForIndex(index: number): string {
    const types = ['content-delivery', 'interactive-game', 'application', 'problem-solving', 'creative-exercise', 'real-world-application', 'critical-thinking'];
    return types[index % types.length];
  }

  private static getVariedSkillAreaForIndex(baseSkillArea: string, index: number): string {
    if (baseSkillArea === 'general_mathematics') {
      const mathAreas = ['arithmetic', 'problem_solving', 'geometry_basics', 'measurement', 'data_handling', 'patterns', 'number_sense'];
      return mathAreas[index % mathAreas.length];
    }
    return baseSkillArea;
  }

  private static getDifficultyVariation(index: number): number {
    // Slight difficulty variation: -1, 0, +1
    return (index % 3) - 1;
  }

  private static getVarietyPrompt(index: number): string {
    const prompts = [
      'Use real-world scenarios',
      'Include visual/spatial elements', 
      'Focus on word problems',
      'Incorporate games or puzzles',
      'Use creative storytelling',
      'Apply practical examples',
      'Challenge critical thinking'
    ];
    return prompts[index % prompts.length];
  }

  private static getUniquenessSeeds(index: number, attempt: number): string[] {
    const baseSeeds = [
      `variation-${index}-${attempt}`,
      `timestamp-${Date.now()}`,
      `random-${Math.random().toString(36).substr(2, 9)}`
    ];
    
    const contextualSeeds = [
      'different-character-names',
      'alternative-scenarios',
      'varied-number-sets',
      'unique-situations',
      'diverse-contexts',
      'fresh-perspectives'
    ];
    
    return [...baseSeeds, contextualSeeds[index % contextualSeeds.length]];
  }

  /**
   * Force regenerate lesson (for testing or manual refresh)
   */
  static clearTodaysLesson(userId: string, subject: string, currentDate: string): void {
    CacheService.clearTodaysLesson(userId, subject, currentDate);
  }
}

// Option sanitizer + per-slot regeneration (dev utilities)
function sanitizeLessonActivity(act: any): any {
  try {
    const c = act?.content || {};
    if (Array.isArray(c.options) && c.options.length) {
      const raw = c.options.map((s: any) => String(s ?? ''));
      const trimmed = raw.map((s: string) => s.replace(/^[A-D][)\.]+\s*/i, '').replace(/^\d+[)\.]+\s*/, '').trim());
      const seen = new Map<string, number>();
      const unique: string[] = [];
      let newCorrect = 0;
      const oldCorrect = typeof c.correctAnswer === 'number' ? c.correctAnswer : -1;
      trimmed.forEach((opt, i) => {
        const key = opt.toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, unique.length);
          unique.push(opt);
          if (i === oldCorrect) newCorrect = seen.get(key)!;
        }
      });
      act.content.options = unique;
      act.content.correctAnswer = Math.min(newCorrect, Math.max(0, unique.length - 1));
    }
  } catch {}
  return act;
}

export async function regenerateActivityBySlotId(sessionId: string, slotId: string): Promise<LessonActivity | null> {
  const entry = PLANNER_SESSION_CACHE.get(sessionId);
  if (!entry) return null;
  const slot = (entry.slots || []).find((s: any) => s?.slotId === slotId || s?.id === slotId) || null;
  if (!slot) return null;

  const mapKindToLessonType = (k: string): LessonActivity['type'] => {
    switch (k) {
      case 'diagnostic_mcq': return 'interactive-game';
      case 'scenario_choice': return 'interactive-game';
      case 'data_reading': return 'application';
      case 'observe_image': return 'content-delivery';
      case 'creative_task': return 'creative-exploration';
      case 'sort_match': return 'interactive-game';
      case 'puzzle': return 'interactive-game';
      default: return 'content-delivery';
    }
  };

  const g = await generateActivityForSlot(slot as any, entry.world, entry.context);
  const type = mapKindToLessonType((g as any).kind || (slot as any).type);
  const subject = (entry.context?.subject) || 'Subject';
  const skillArea = (entry.context?.skillArea) || 'general';
  const act: LessonActivity = {
    id: `${sessionId}-act-regenerated-${Date.now()}`,
    title: (g as any).question || (g as any).narrative || `${subject} Activity` ,
    type,
    duration: Math.max(120, (((g as any).estimatedTimeMin ?? (slot as any).timeMin ?? 5) * 60)),
    content: {
      question: (g as any).question,
      options: (g as any).options,
      correctAnswer: typeof (g as any).correctIndex === 'number' ? (g as any).correctIndex : undefined,
      explanation: (g as any).explanation,
      text: (g as any).narrative,
      scenario: (g as any).narrative,
      instructions: (g as any).narrative
    },
    difficulty: ((g as any).finalDifficulty || (g as any).difficulty) as any,
    subject,
    skillArea,
    curriculumStandard: (slot as any).linkedCurriculumStandard,
    metadata: {
      generatedBy: 'planner-activity',
      slotId: (slot as any).slotId,
      sessionId,
      curriculumStandard: (slot as any).linkedCurriculumStandard,
      learningObjective: (slot as any).learningObjective
    }
  } as any;
  return sanitizeLessonActivity(act);
}

export const dailyLessonGenerator = DailyLessonGenerator;

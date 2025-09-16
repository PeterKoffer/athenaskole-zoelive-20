import { supabase } from "@/integrations/supabase/client";
import { UniversePacks } from "@/content/universe.catalog";
import type { UniversePack } from "@/content/types";

export interface AdventureUniverse {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  description: string;
  goals: any;
  metadata: any;
  image_url?: string;
  slug: string;
  category?: string;
  imagePrompt?: string;
}

export interface AdventureContent {
  id: string;
  universe_id: string;
  summary: string;
  objectives: string[];
  activities: any;
}

export interface AdventureProgress {
  id: string;
  student_id: string;
  universe_id: string;
  completed_at: Date;
  is_recap: boolean;
  performance_score?: number;
}

export interface AdventureSelectionCriteria {
  userId: string;
  gradeLevel?: string;
  subject?: string;
  preferences?: {
    curriculum?: string;
    difficulty?: string;
    learningStyle?: string;
    interests?: string[];
  };
}

export class AdventureService {
  
  /**
   * Convert UniversePack to AdventureUniverse format
   */
  private static universePackToAdventure(pack: UniversePack, gradeLevel: string = "6-8"): AdventureUniverse {
    return {
      id: pack.id,
      title: pack.title,
      subject: pack.subjectHint,
      grade_level: gradeLevel,
      description: `Embark on an exciting ${pack.category.toLowerCase()} adventure! ${pack.title} combines hands-on learning with real-world problem solving.`,
      goals: pack.beats[gradeLevel as keyof typeof pack.beats] || pack.beats["6-8"],
      metadata: {
        category: pack.category,
        tags: pack.tags,
        crossSubjects: pack.crossSubjects,
        beats: pack.beats
      },
      slug: pack.id,
      category: pack.category,
      imagePrompt: pack.imagePrompt
    };
  }

  /**
   * Get today's adventure for the student using the curated catalog
   * Ensures they never see the same universe twice (unless recap)
   */
  static async getTodaysAdventure(criteria: AdventureSelectionCriteria): Promise<{
    universe: AdventureUniverse;
    content?: AdventureContent;
    isRecap: boolean;
  }> {
    try {
      // Get completed adventures from database
      const { data: completedAdventures } = await supabase
        .from('student_adventures')
        .select('universe_id, is_recap')
        .eq('student_id', criteria.userId);

      const completedUniverseIds = completedAdventures
        ?.filter(a => !a.is_recap)
        .map(a => a.universe_id) || [];

      // Filter available universes from catalog
      const availableUniverses = UniversePacks.filter(pack => 
        !completedUniverseIds.includes(pack.id)
      );

      let selectedPack: UniversePack;
      let isRecap = false;

      if (availableUniverses.length === 0) {
        // No new universes available - time for a recap!
        if (completedUniverseIds.length === 0) {
          // First time user - select random universe
          selectedPack = UniversePacks[Math.floor(Math.random() * UniversePacks.length)];
        } else {
          // Select a random completed universe for recap
          const completedPacks = UniversePacks.filter(pack => 
            completedUniverseIds.includes(pack.id)
          );
          selectedPack = completedPacks[Math.floor(Math.random() * completedPacks.length)];
          isRecap = true;
        }
      } else {
        // Filter by subject preference if provided
        let filteredUniverses = availableUniverses;
        if (criteria.subject) {
          const subjectMatches = availableUniverses.filter(pack => 
            pack.subjectHint.toLowerCase().includes(criteria.subject!.toLowerCase()) ||
            pack.crossSubjects.some(s => s.toLowerCase().includes(criteria.subject!.toLowerCase()))
          );
          if (subjectMatches.length > 0) {
            filteredUniverses = subjectMatches;
          }
        }

        // Select random universe
        selectedPack = filteredUniverses[Math.floor(Math.random() * filteredUniverses.length)];
      }

      // Convert to AdventureUniverse format
      const selectedUniverse = this.universePackToAdventure(selectedPack, criteria.gradeLevel || "6-8");

      // Generate content based on the universe pack
      const content: AdventureContent = {
        id: `content-${selectedPack.id}`,
        universe_id: selectedPack.id,
        summary: `Today you'll dive into ${selectedPack.title}! This ${selectedPack.category.toLowerCase()} adventure will challenge you to think creatively and solve real-world problems.`,
        objectives: [
          `Understand the key concepts behind ${selectedPack.title}`,
          `Apply problem-solving skills in a ${selectedPack.category.toLowerCase()} context`,
          `Create something tangible related to ${selectedPack.title}`,
          `Reflect on the learning experience and present your findings`
        ],
        activities: this.generateActivitiesFromBeats(selectedPack, criteria.gradeLevel || "6-8")
      };

      return {
        universe: selectedUniverse,
        content,
        isRecap
      };

    } catch (error) {
      console.error('Error in getTodaysAdventure:', error);
      throw error;
    }
  }

  /**
   * Generate activities from universe pack beats
   */
  private static generateActivitiesFromBeats(pack: UniversePack, gradeLevel: string) {
    const beats = pack.beats[gradeLevel as keyof typeof pack.beats] || pack.beats["6-8"];
    
    return beats.map((beat, index) => ({
      id: `activity-${index + 1}`,
      title: beat.title,
      type: beat.kind,
      instructions: this.generateInstructionsForBeat(beat, pack),
      estimatedMinutes: beat.minutes[gradeLevel as keyof typeof beat.minutes] || beat.minutes["6-8"],
      props: beat.props,
      tags: beat.tags
    }));
  }

  /**
   * Generate instructions for a specific beat
   */
  private static generateInstructionsForBeat(beat: any, pack: UniversePack): string {
    const baseInstruction = `In this ${beat.kind.replace('_', ' ')} activity for "${pack.title}":`;
    
    switch (beat.kind) {
      case 'visual_hook':
        return `${baseInstruction} Start by visualizing what your ${pack.title.toLowerCase()} adventure will look like. What's the setting? Who are the key people involved? What challenges might you face?`;
      
      case 'make_something':
        return `${baseInstruction} Create a concrete item that will help you in your ${pack.title.toLowerCase()} journey. This could be a plan, design, prototype, or tool.`;
      
      case 'investigate':
        return `${baseInstruction} Research and gather important information. What do you need to know to succeed? What constraints or challenges exist?`;
      
      case 'practice':
        return `${baseInstruction} Practice key skills through quick exercises and challenges. Build confidence in the fundamentals you'll need.`;
      
      case 'apply':
        return `${baseInstruction} Put your knowledge to work! Solve a real problem or overcome a specific challenge in your ${pack.title.toLowerCase()}.`;
      
      case 'reflect':
        return `${baseInstruction} Think about what you've learned and accomplished. What worked well? What would you do differently?`;
      
      case 'present':
        return `${baseInstruction} Share your results and insights. Show what you've created and explain what you learned along the way.`;
      
      default:
        return `${baseInstruction} Complete this learning activity as part of your ${pack.title.toLowerCase()} adventure.`;
    }
  }

  /**
   * Mark an adventure as completed
   */
  static async completeAdventure(
    studentId: string, 
    universeId: string, 
    isRecap: boolean = false, 
    performanceScore?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('student_adventures')
      .insert({
        student_id: studentId,
        universe_id: universeId,
        is_recap: isRecap,
        performance_score: performanceScore
      });

    if (error) {
      console.error('Error completing adventure:', error);
      throw error;
    }
  }

  /**
   * Get student's adventure history
   */
  static async getAdventureHistory(studentId: string): Promise<AdventureProgress[]> {
    const { data, error } = await supabase
      .from('student_adventures')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      completed_at: new Date(item.completed_at)
    })) as AdventureProgress[];
  }

  /**
   * Get adventure statistics
   */
  static async getAdventureStats(studentId: string): Promise<{
    totalCompleted: number;
    totalRecaps: number;
    averageScore: number;
    streak: number;
  }> {
    const { data } = await supabase
      .from('student_adventures')
      .select('performance_score, is_recap, completed_at')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (!data) {
      return { totalCompleted: 0, totalRecaps: 0, averageScore: 0, streak: 0 };
    }

    const totalCompleted = data.filter(a => !a.is_recap).length;
    const totalRecaps = data.filter(a => a.is_recap).length;
    const scoresWithData = data.filter(a => a.performance_score !== null);
    const averageScore = scoresWithData.length > 0 
      ? scoresWithData.reduce((sum, a) => sum + (a.performance_score || 0), 0) / scoresWithData.length
      : 0;

    // Calculate streak (consecutive days with adventures)
    // TODO: Implement proper streak calculation based on dates
    const streak = data.length; // Simplified for now

    return {
      totalCompleted,
      totalRecaps,
      averageScore: Math.round(averageScore),
      streak
    };
  }
}
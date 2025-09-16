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
    // Convert grade level to integer for image system
    const gradeInt = gradeLevel === "K-2" ? 1 : 
                     gradeLevel === "3-5" ? 4 : 
                     gradeLevel === "6-8" ? 6 : 
                     gradeLevel === "9-10" ? 9 : 11;
    
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
        beats: pack.beats,
        gradeInt: gradeInt
      },
      slug: pack.id,
      category: pack.category,
      imagePrompt: pack.imagePrompt,
      // Use the universe image system path format
      image_url: `universe-images/${pack.id}/${gradeInt}/cover.webp`
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
   * Generate engaging, age-appropriate instructions for adventure activities
   */
  private static generateInstructionsForBeat(beat: any, pack: UniversePack): string {
    const adventureTitle = pack.title;
    
    switch (beat.kind) {
      case 'visual_hook':
        return `🎬 Dive into the exciting world of ${adventureTitle}! Imagine the thrilling setting, meet the key players, and discover the amazing challenges you'll face on your adventure!`;
      
      case 'make_something':
        return `🛠️ Unleash your creativity! Design and build something incredible that will be your secret weapon for conquering the ${adventureTitle} mission. Will it be a clever plan, cool design, or awesome prototype?`;
      
      case 'investigate':
        return `🕵️ Become an expert detective! Research and uncover the vital clues you need to master this challenge. What secrets will you discover? What obstacles will you outsmart?`;
      
      case 'practice':
        return `🎯 Power up your skills! Train like a champion through fun exercises and exciting challenges. Build your confidence and become unstoppable!`;
      
      case 'apply':
        return `⚡ Time to shine! Put your amazing knowledge to work and solve real problems like a true hero. Show the world what you can accomplish!`;
      
      case 'reflect':
        return `🌟 Celebrate your incredible journey! Look back at all the awesome things you've learned and achieved. What made you feel like a superstar? What would you do even better next time?`;
      
      case 'present':
        return `📢 Share your greatness with the world! Show off your amazing creations and inspire others with your incredible discoveries and insights!`;
      
      default:
        return `🚀 Get ready for an amazing ${adventureTitle} experience that will blow your mind and make learning the best part of your day!`;
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
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
   * Generate magical, age-appropriate backstory to hook students into the adventure
   */
  private static generateMagicalBackstory(pack: UniversePack, gradeLevel: string): string {
    const gradeInt = gradeLevel === "K-2" ? 1 : 
                     gradeLevel === "3-5" ? 4 : 
                     gradeLevel === "6-8" ? 6 : 
                     gradeLevel === "9-10" ? 9 : 11;

    const isYoung = gradeInt <= 5; // K-5 gets more magical language
    const isMiddle = gradeInt >= 6 && gradeInt <= 8; // 6-8 gets adventure language  
    const isOlder = gradeInt >= 9; // 9+ gets challenge/discovery language

    const adventureTitle = pack.title;
    const subject = pack.subjectHint;
    const category = pack.category.toLowerCase();

    // Create backstory templates based on age and adventure type
    if (isYoung) {
      const youngStories = [
        `🌟 En dag når du går forbi en gammel, glemte ${adventureTitle.toLowerCase()}, begynder den pludselig at skinne magisk! Du opdager, at den gemmer på fantastiske hemmeligheder, der kan hjælpe dig med at lære om ${subject}. Hvad mon der sker, hvis du tager mod udfordringen?`,
        `✨ I din baghave finder du en mystisk bog om ${adventureTitle}. Når du åbner den, springer ordene ud af siderne og inviterer dig med på det mest spændende eventyr! Er du klar til at springe ind i ${subject}-verdenen?`,
        `🎪 Den gamle cirkusvogn på hjørnet har altid været tom - indtil i dag! Pludselig summer den af aktivitet med ${adventureTitle}, og du får chancen for at blive dagens helt ved at mestre ${subject} på en helt ny måde!`
      ];
      return youngStories[Math.floor(Math.random() * youngStories.length)];
    }

    if (isMiddle) {
      const middleStories = [
        `🚀 Du støder på en gådefuld ${adventureTitle.toLowerCase()}, som ser helt almindelig ud - men hold da op! Den gemmer på utrolige muligheder for at udforske ${subject} på en måde, du aldrig har prøvet før. Tør du tage udfordringen op?`,
        `🕵️ En mærkelig opdagelse venter dig: ${adventureTitle} har brug for din hjælp! Med dine ${subject}-færdigheder som våben, kan du løse mysteriet og redde dagen. Hvad venter der på den anden side af eventyret?`,
        `⚡ Forestil dig at ${adventureTitle.toLowerCase()} pludselig bliver dit ansvar. Du har chancen for at vise, hvad du kan med ${subject}, men der er både udfordringer og fantastiske overraskelser forude. Er du klar til at bevise dit værd?`
      ];
      return middleStories[Math.floor(Math.random() * middleStories.length)];
    }

    // Older students (9+)
    const olderStories = [
      `🎯 En uventet mulighed dukker op: du får chancen for at tage kontrol over ${adventureTitle} og bevise dine ${subject}-færdigheder i praksis. Det handler ikke bare om teori - det er din chance for at skabe noget betydningsfuldt og vise verden, hvad du kan!`,
      `🌍 ${adventureTitle} står over for en kritisk udfordring, og der er brug for nogen med dine ${subject}-talenter til at finde løsningen. Dette er mere end bare en opgave - det er din mulighed for at gøre en reel forskel og lære utroligt meget undervejs.`,
      `💡 Du opdager en fascinerende situation omkring ${adventureTitle}, der kræver kreativ problemløsning og solid ${subject}-viden. Dette projekt kan åbne døre til ny erkendelse og give dig færdigheder, du kan bruge resten af livet!`
    ];
    return olderStories[Math.floor(Math.random() * olderStories.length)];
  }

  /**
   * Convert UniversePack to AdventureUniverse format
   */
  private static universePackToAdventure(pack: UniversePack, gradeLevel: string = "6-8"): AdventureUniverse {
    // Convert grade level to integer for image system
    const gradeInt = gradeLevel === "K-2" ? 1 : 
                     gradeLevel === "3-5" ? 4 : 
                     gradeLevel === "6-8" ? 6 : 
                     gradeLevel === "9-10" ? 9 : 11;
    
    // Generate magical backstory to hook the student
    const magicalBackstory = this.generateMagicalBackstory(pack, gradeLevel);
    
    return {
      id: pack.id,
      title: pack.title,
      subject: pack.subjectHint,
      grade_level: gradeLevel,
      description: magicalBackstory,
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
        summary: `Nu hvor du er trådt ind i eventyret, er det tid til at dykke dybt ned i ${selectedPack.title}! Denne ${selectedPack.category.toLowerCase()} oplevelse vil udfordre dig til at tænke kreativt, løse problemer fra den virkelige verden, og opdage nye måder at anvende din viden på.`,
        objectives: [
          `Forstå nøglekoncepterne bag ${selectedPack.title}`,
          `Anvend problemløsningsevner i en ${selectedPack.category.toLowerCase()} sammenhæng`,
          `Skab noget konkret relateret til ${selectedPack.title}`,
          `Reflektér over læringsoplevelsen og præsentér dine fund`
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
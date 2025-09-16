import { supabase } from "@/integrations/supabase/client";
import type { UniversePack } from "@/content/types";

export interface BackstoryOptions {
  expires?: number;
  language?: string;
}

/**
 * Service for managing pre-generated adventure backstories
 * Similar to the universe image system but for magical story intros
 */
export class BackstoryService {
  private static readonly BUCKET_NAME = 'universe-backstories';
  private static readonly MIN_LENGTH = 50; // Minimum backstory length in characters

  /**
   * Get a signed URL for a backstory, healing if needed
   */
  static async getBackstorySignedUrl(
    universeId: string, 
    gradeInt: number, 
    options: BackstoryOptions = {}
  ): Promise<string | null> {
    const { expires = 300, language = 'en' } = options;
    const path = `${universeId}/${gradeInt}/backstory_${language}.txt`;
    
    try {
      // Check if backstory exists in storage
      const { data: existsData, error: existsError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(path);

      if (existsData && !existsError) {
        // File exists, get signed URL
        const { data: signedData } = await supabase.storage
          .from(this.BUCKET_NAME)
          .createSignedUrl(path, expires);
        
        if (signedData?.signedUrl) {
          return signedData.signedUrl;
        }
      }

      // File doesn't exist or error occurred - return null to trigger fallback
      console.log(`Backstory not found in storage: ${path}`);
      return null;

    } catch (error) {
      console.error('Error getting backstory signed URL:', error);
      return null;
    }
  }

  /**
   * Generate a magical backstory based on universe pack and grade level
   */
  static generateMagicalBackstory(pack: UniversePack, gradeLevel: string, language: string = 'en'): string {
    const gradeInt = gradeLevel === "K-2" ? 1 : 
                     gradeLevel === "3-5" ? 4 : 
                     gradeLevel === "6-8" ? 6 : 
                     gradeLevel === "9-10" ? 9 : 11;

    const isYoung = gradeInt <= 5; // K-5 gets more magical language
    const isMiddle = gradeInt >= 6 && gradeInt <= 8; // 6-8 gets adventure language  
    const isOlder = gradeInt >= 9; // 9+ gets challenge/discovery language

    const adventureTitle = pack.title;
    const subject = pack.subjectHint;
    
    if (language === 'en') {
      // English backstories  
      if (isYoung) {
        const youngStories = [
          `🌟 One day you walk past an old, forgotten ${adventureTitle.toLowerCase()}, and suddenly it begins to shine magically! You discover it holds fantastic secrets that can help you learn about ${subject}. What will happen if you take on the challenge?`,
          `✨ In your backyard you find a mysterious book about ${adventureTitle}. When you open it, the words jump off the pages and invite you on the most exciting adventure! Are you ready to dive into the world of ${subject}?`,
          `🎪 The old circus wagon on the corner has always been empty - until today! Suddenly it's buzzing with activity around ${adventureTitle}, and you get the chance to become today's hero by mastering ${subject} in a whole new way!`
        ];
        return youngStories[Math.floor(Math.random() * youngStories.length)];
      }

      if (isMiddle) {
        const middleStories = [
          `🚀 You stumble upon a mysterious ${adventureTitle.toLowerCase()} that looks completely ordinary - but wow! It holds incredible opportunities to explore ${subject} in ways you've never tried before. Do you dare take on the challenge?`,
          `🕵️ A strange discovery awaits you: ${adventureTitle} needs your help! With your ${subject} skills as weapons, you can solve the mystery and save the day. What awaits on the other side of the adventure?`,
          `⚡ Imagine that ${adventureTitle.toLowerCase()} suddenly becomes your responsibility. You have the chance to show what you can do with ${subject}, but there are both challenges and fantastic surprises ahead. Are you ready to prove your worth?`
        ];
        return middleStories[Math.floor(Math.random() * middleStories.length)];
      }

      // Older students (9+)
      const olderStories = [
        `🎯 An unexpected opportunity arises: you get the chance to take control of ${adventureTitle} and prove your ${subject} skills in practice. This isn't just about theory - it's your chance to create something meaningful and show the world what you can do!`,
        `🌍 ${adventureTitle} faces a critical challenge, and someone with your ${subject} talents is needed to find the solution. This is more than just a task - it's your opportunity to make a real difference and learn incredibly much along the way.`,
        `💡 You discover a fascinating situation around ${adventureTitle} that requires creative problem-solving and solid ${subject} knowledge. This project can open doors to new insights and give you skills you can use for the rest of your life!`
      ];
      return olderStories[Math.floor(Math.random() * olderStories.length)];
    }

    if (language === 'da') {
      // Danish backstories
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

    // Ultimate fallback
    return `🌟 Welcome to ${adventureTitle}! Get ready for an exciting ${subject} adventure that will challenge and inspire you!`;
  }

  /**
   * Upload a generated backstory to storage
   */
  static async uploadBackstory(
    universeId: string, 
    gradeInt: number, 
    backstoryText: string, 
    language: string = 'en'
  ): Promise<boolean> {
    const path = `${universeId}/${gradeInt}/backstory_${language}.txt`;
    
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, new Blob([backstoryText], { type: 'text/plain' }), {
          cacheControl: '86400', // 24 hours
          upsert: true
        });

      if (error) {
        console.error('Error uploading backstory:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error uploading backstory:', error);
      return false;
    }
  }

  /**
   * Get or generate a backstory for a universe pack
   */
  static async getOrGenerateBackstory(
    pack: UniversePack, 
    gradeLevel: string, 
    language: string = 'en'
  ): Promise<string> {
    const gradeInt = gradeLevel === "K-2" ? 1 : 
                     gradeLevel === "3-5" ? 4 : 
                     gradeLevel === "6-8" ? 6 : 
                     gradeLevel === "9-10" ? 9 : 11;

    // Try to get from storage first
    const signedUrl = await this.getBackstorySignedUrl(pack.id, gradeInt, { language });
    
    if (signedUrl) {
      try {
        const response = await fetch(signedUrl);
        if (response.ok) {
          const backstoryText = await response.text();
          if (backstoryText.length >= this.MIN_LENGTH) {
            return backstoryText;
          }
        }
      } catch (error) {
        console.error('Error fetching cached backstory:', error);
      }
    }

    // Generate new backstory
    const backstory = this.generateMagicalBackstory(pack, gradeLevel, language);
    
    // Try to cache it for next time (don't block on this)
    this.uploadBackstory(pack.id, gradeInt, backstory, language).catch(console.warn);
    
    return backstory;
  }

  /**
   * Initialize the backstory storage bucket if it doesn't exist
   */
  static async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        console.log('Creating backstory storage bucket...');
        // This would need to be done via migration or admin panel
        // For now, just log that it needs to be created
        console.warn(`Backstory bucket '${this.BUCKET_NAME}' needs to be created manually in Supabase admin panel`);
      }
    } catch (error) {
      console.error('Error checking backstory bucket:', error);
    }
  }
}
export class SpeechDeduplicationManager {
  private spokenContent = new Set<string>();
  private sessionStartTime = Date.now();
  
  // Generate a unique key for content based on text and context
  private generateContentKey(text: string, context?: string): string {
    const cleanText = text.trim().toLowerCase().substring(0, 100);
    return context ? `${context}:${cleanText}` : cleanText;
  }
  
  // Check if content has already been spoken
  hasBeenSpoken(text: string, context?: string): boolean {
    const key = this.generateContentKey(text, context);
    return this.spokenContent.has(key);
  }
  
  // Mark content as spoken
  markAsSpoken(text: string, context?: string): void {
    const key = this.generateContentKey(text, context);
    this.spokenContent.add(key);
    console.log('🔇 Marked as spoken:', key);
  }
  
  // Allow content to be spoken again (for repeat buttons)
  allowRepeat(text: string, context?: string): void {
    const key = this.generateContentKey(text, context);
    this.spokenContent.delete(key);
    console.log('🔊 Allowing repeat for:', key);
  }
  
  // Clear all spoken content (for new sessions)
  clearAll(): void {
    this.spokenContent.clear();
    this.sessionStartTime = Date.now();
    console.log('🆕 Speech deduplication cleared');
  }
  
  // Clear content older than specified time (in minutes)
  clearOld(minutesOld: number = 30): void {
    // For now, we'll keep it simple and not implement time-based clearing
    // since we're using a Set that doesn't store timestamps
  }
}

// Global instance for the entire app
export const speechDeduplication = new SpeechDeduplicationManager();

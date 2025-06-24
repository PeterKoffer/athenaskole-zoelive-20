
// Speech Deduplication Manager for Nelie
// Prevents the same content from being spoken multiple times in quick succession

interface SpokenContent {
  text: string;
  context?: string;
  timestamp: number;
  hash: string;
}

class SpeechDeduplicationManager {
  private spokenContent: Map<string, SpokenContent> = new Map();
  private readonly DEDUPLICATION_WINDOW = 30000; // 30 seconds
  private readonly MAX_ENTRIES = 100;

  private generateHash(text: string, context?: string): string {
    const content = `${text.toLowerCase().trim()}:${context || 'default'}`;
    return btoa(content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  hasBeenSpoken(text: string, context?: string): boolean {
    if (!text?.trim()) return true;

    const hash = this.generateHash(text, context);
    const entry = this.spokenContent.get(hash);
    
    if (!entry) return false;

    const now = Date.now();
    const timeSinceSpoken = now - entry.timestamp;
    
    // If spoken recently, consider it a duplicate
    if (timeSinceSpoken < this.DEDUPLICATION_WINDOW) {
      console.log(`🔇 Content recently spoken (${Math.round(timeSinceSpoken/1000)}s ago):`, text.substring(0, 50));
      return true;
    }

    // Clean up old entry
    this.spokenContent.delete(hash);
    return false;
  }

  markAsSpoken(text: string, context?: string): void {
    if (!text?.trim()) return;

    const hash = this.generateHash(text, context);
    const now = Date.now();
    
    // Clean up old entries before adding new one
    this.cleanupOldEntries(now);
    
    // Add new entry
    this.spokenContent.set(hash, {
      text: text.substring(0, 100), // Store truncated version for debugging
      context,
      timestamp: now,
      hash
    });

    console.log('🔇 Marked as spoken:', `${context || 'default'}:${text.substring(0, 50)}`);

    // Enforce max entries limit
    if (this.spokenContent.size > this.MAX_ENTRIES) {
      const oldestKey = Array.from(this.spokenContent.keys())[0];
      this.spokenContent.delete(oldestKey);
    }
  }

  allowRepeat(text: string, context?: string): void {
    if (!text?.trim()) return;

    const hash = this.generateHash(text, context);
    this.spokenContent.delete(hash);
    console.log('🔄 Allowing repeat for:', text.substring(0, 50));
  }

  clearAll(): void {
    this.spokenContent.clear();
    console.log('🆕 Speech deduplication cleared');
  }

  clearContext(context: string): void {
    const toDelete = Array.from(this.spokenContent.entries())
      .filter(([_, entry]) => entry.context === context)
      .map(([key, _]) => key);
    
    toDelete.forEach(key => this.spokenContent.delete(key));
    console.log(`🗑️ Cleared deduplication for context: ${context}`);
  }

  private cleanupOldEntries(now: number): void {
    const cutoff = now - this.DEDUPLICATION_WINDOW;
    const toDelete = Array.from(this.spokenContent.entries())
      .filter(([_, entry]) => entry.timestamp < cutoff)
      .map(([key, _]) => key);
    
    toDelete.forEach(key => this.spokenContent.delete(key));
  }

  // Debug method
  getStatus(): { totalEntries: number; contexts: string[]; recentEntries: string[] } {
    const entries = Array.from(this.spokenContent.values());
    return {
      totalEntries: entries.length,
      contexts: [...new Set(entries.map(e => e.context || 'default'))],
      recentEntries: entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map(e => `${e.context}:${e.text.substring(0, 30)}`)
    };
  }
}

export const speechDeduplication = new SpeechDeduplicationManager();

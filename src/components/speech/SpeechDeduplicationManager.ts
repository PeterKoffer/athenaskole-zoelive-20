
class SpeechDeduplicationManager {
  private static spokenItems = new Set<string>();

  static generateHash(text: string, context?: string): string {
    const combined = `${text}-${context || 'default'}`;
    
    // Use a simple hash function instead of btoa to avoid Unicode issues
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  static hasBeenSpoken(text: string, context?: string): boolean {
    const hash = this.generateHash(text, context);
    return this.spokenItems.has(hash);
  }

  static markAsSpoken(text: string, context?: string): void {
    const hash = this.generateHash(text, context);
    this.spokenItems.add(hash);
    console.log(`🔇 Marked as spoken: ${context || 'default'}:${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
  }

  static clearHistory(): void {
    this.spokenItems.clear();
    console.log('🧹 Speech deduplication history cleared');
  }

  static getHistorySize(): number {
    return this.spokenItems.size;
  }
}

export default SpeechDeduplicationManager;

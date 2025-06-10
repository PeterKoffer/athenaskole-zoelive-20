import { supabase } from '@/integrations/supabase/client';

export interface ContentFingerprint {
  id: string;
  userId: string;
  contentType: 'question' | 'game' | 'activity';
  subject: string;
  skillArea: string;
  gradeLevel: number;
  contentHash: string;
  semanticFingerprint: string;
  keyWords: string[];
  difficulty: number;
  createdAt: string;
  lastUsed: string;
  usageCount: number;
  userRating?: number;
}

export interface DeduplicationResult {
  isUnique: boolean;
  similarityScore: number;
  duplicateId?: string;
  reason?: string;
  recommendations?: string[];
}

export interface ContentVariation {
  originalContentId: string;
  variationType: 'numbers' | 'context' | 'format' | 'difficulty';
  description: string;
  applied: boolean;
}

class ContentDeduplicationService {
  private readonly SIMILARITY_THRESHOLD = 0.85;
  private readonly CONTEXT_WINDOW_DAYS = 30;
  private readonly MAX_USAGE_COUNT = 3;

  /**
   * Check if content is unique for a user
   */
  async checkContentUniqueness(
    userId: string,
    contentType: 'question' | 'game' | 'activity',
    content: string,
    subject: string,
    skillArea: string,
    gradeLevel: number
  ): Promise<DeduplicationResult> {
    console.log(`🔍 Checking content uniqueness for user ${userId}`);

    // Generate content fingerprint
    const fingerprint = this.generateContentFingerprint(
      content, 
      contentType, 
      subject, 
      skillArea, 
      gradeLevel
    );

    // Get user's recent content history
    const recentContent = await this.getRecentContentHistory(userId, contentType, subject);

    // Check for duplicates
    const duplicateCheck = this.findDuplicates(fingerprint, recentContent);

    if (duplicateCheck.isUnique) {
      // Store fingerprint for future reference
      await this.storeContentFingerprint(userId, fingerprint);
    }

    return duplicateCheck;
  }

  /**
   * Generate content variations to avoid repetition
   */
  async generateContentVariations(
    originalContent: string,
    contentType: 'question' | 'game' | 'activity',
    subject: string,
    gradeLevel: number,
    variationCount: number = 3
  ): Promise<ContentVariation[]> {
    console.log(`🎨 Generating ${variationCount} content variations`);

    const variations: ContentVariation[] = [];

    // Generate different types of variations
    const variationTypes: ContentVariation['variationType'][] = [
      'numbers',
      'context', 
      'format',
      'difficulty'
    ];

    for (let i = 0; i < variationCount && i < variationTypes.length; i++) {
      const variationType = variationTypes[i];
      
      const variation: ContentVariation = {
        originalContentId: this.generateContentId(originalContent),
        variationType,
        description: this.generateVariationDescription(variationType, originalContent, subject),
        applied: false
      };

      variations.push(variation);
    }

    return variations;
  }

  /**
   * Get diversified content recommendations
   */
  async getDiversifiedRecommendations(
    userId: string,
    subject: string,
    skillArea: string,
    gradeLevel: number,
    count: number = 5
  ): Promise<{
    recommendations: string[];
    diversityScore: number;
    coverage: {
      topics: string[];
      formats: string[];
      difficulties: number[];
    };
  }> {
    console.log(`🎯 Getting diversified recommendations for ${subject}/${skillArea}`);

    // Get user's content history
    const contentHistory = await this.getContentHistory(userId, subject, 60); // 60 days

    // Analyze content patterns
    const patterns = this.analyzeContentPatterns(contentHistory);

    // Generate diversified recommendations
    const recommendations = this.generateDiversifiedRecommendations(
      patterns,
      subject,
      skillArea,
      gradeLevel,
      count
    );

    // Calculate diversity score
    const diversityScore = this.calculateDiversityScore(recommendations, patterns);

    return {
      recommendations: recommendations.map(r => r.content),
      diversityScore,
      coverage: {
        topics: [...new Set(recommendations.map(r => r.topic))],
        formats: [...new Set(recommendations.map(r => r.format))],
        difficulties: [...new Set(recommendations.map(r => r.difficulty))]
      }
    };
  }

  /**
   * Track content usage and update fingerprints
   */
  async trackContentUsage(
    userId: string,
    contentId: string,
    performance: {
      accuracy: number;
      timeSpent: number;
      engagement: number;
    },
    userFeedback?: {
      rating: number;
      difficulty: 'too_easy' | 'just_right' | 'too_hard';
      interest: 'boring' | 'okay' | 'interesting';
    }
  ): Promise<void> {
    console.log(`📊 Tracking content usage: ${contentId}`);

    try {
      // Update usage count and last used date
      await supabase
        .from('content_fingerprints')
        .update({
          last_used: new Date().toISOString(),
          usage_count: supabase.rpc('increment_usage_count', { content_id: contentId }),
          user_rating: userFeedback?.rating
        })
        .eq('id', contentId)
        .eq('user_id', userId);

      // Store detailed usage analytics
      await supabase
        .from('content_usage_analytics')
        .insert({
          user_id: userId,
          content_id: contentId,
          accuracy: performance.accuracy,
          time_spent: performance.timeSpent,
          engagement_score: performance.engagement,
          user_rating: userFeedback?.rating,
          difficulty_feedback: userFeedback?.difficulty,
          interest_feedback: userFeedback?.interest,
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error tracking content usage:', error);
    }
  }

  /**
   * Get content freshness score
   */
  async getContentFreshnessScore(
    userId: string,
    subject: string,
    skillArea: string,
    days: number = 7
  ): Promise<{
    score: number;
    staleness: number;
    recommendations: string[];
  }> {
    const recentContent = await this.getRecentContentHistory(userId, 'question', subject, days);
    
    // Calculate uniqueness in recent content
    const uniqueTopics = new Set(recentContent.map(c => c.skillArea)).size;
    const totalContent = recentContent.length;
    
    const freshnessScore = totalContent > 0 ? (uniqueTopics / totalContent) * 100 : 100;
    const staleness = Math.max(0, 100 - freshnessScore);

    const recommendations = this.generateFreshnessRecommendations(staleness, subject, skillArea);

    return {
      score: freshnessScore,
      staleness,
      recommendations
    };
  }

  /**
   * Clean up old content fingerprints
   */
  async cleanupOldFingerprints(userId: string, daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { data, error } = await supabase
        .from('content_fingerprints')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      const deletedCount = data?.length || 0;
      console.log(`🧹 Cleaned up ${deletedCount} old content fingerprints`);
      
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up fingerprints:', error);
      return 0;
    }
  }

  /**
   * Generate content fingerprint
   */
  private generateContentFingerprint(
    content: string,
    contentType: 'question' | 'game' | 'activity',
    subject: string,
    skillArea: string,
    gradeLevel: number
  ): ContentFingerprint {
    const contentHash = this.generateHash(content);
    const semanticFingerprint = this.generateSemanticFingerprint(content);
    const keyWords = this.extractKeyWords(content);

    return {
      id: `${contentHash}-${Date.now()}`,
      userId: '', // Will be set when storing
      contentType,
      subject,
      skillArea,
      gradeLevel,
      contentHash,
      semanticFingerprint,
      keyWords,
      difficulty: this.estimateContentDifficulty(content, gradeLevel),
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      usageCount: 0
    };
  }

  /**
   * Generate hash for content
   */
  private generateHash(content: string): string {
    // Simple hash function - in production, use a proper hash function
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate semantic fingerprint
   */
  private generateSemanticFingerprint(content: string): string {
    // Extract semantic features
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Remove common words
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'her', 'now', 'air', 'any', 'may', 'say', 'she', 'use', 'way', 'who', 'oil', 'sit', 'set'];
    const meaningfulWords = words.filter(word => !commonWords.includes(word));

    // Create semantic signature
    const signature = meaningfulWords
      .slice(0, 10) // Top 10 meaningful words
      .sort()
      .join('-');

    return this.generateHash(signature);
  }

  /**
   * Extract key words from content
   */
  private extractKeyWords(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Count word frequency
    const wordCount = words.reduce((count, word) => {
      count[word] = (count[word] || 0) + 1;
      return count;
    }, {} as Record<string, number>);

    // Return top 5 most frequent words
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Estimate content difficulty
   */
  private estimateContentDifficulty(content: string, gradeLevel: number): number {
    // Simple difficulty estimation based on content complexity
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Complexity factors
    const complexityScore = (avgWordsPerSentence * 0.1) + (avgWordLength * 0.5);
    
    // Adjust for grade level
    const baseDifficulty = Math.max(1, Math.min(5, Math.ceil(gradeLevel / 3)));
    const adjustedDifficulty = Math.max(1, Math.min(5, baseDifficulty + (complexityScore - 5) * 0.5));
    
    return Math.round(adjustedDifficulty);
  }

  /**
   * Get recent content history
   */
  private async getRecentContentHistory(
    userId: string,
    contentType: 'question' | 'game' | 'activity',
    subject: string,
    days: number = 30
  ): Promise<ContentFingerprint[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('content_fingerprints')
        .select('*')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .eq('subject', subject)
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent content history:', error);
      return [];
    }
  }

  /**
   * Get content history for pattern analysis
   */
  private async getContentHistory(
    userId: string,
    subject: string,
    days: number
  ): Promise<ContentFingerprint[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('content_fingerprints')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .gte('created_at', cutoffDate.toISOString())
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching content history:', error);
      return [];
    }
  }

  /**
   * Find duplicate content
   */
  private findDuplicates(
    newFingerprint: ContentFingerprint,
    existingContent: ContentFingerprint[]
  ): DeduplicationResult {
    for (const existing of existingContent) {
      // Check exact hash match
      if (existing.contentHash === newFingerprint.contentHash) {
        return {
          isUnique: false,
          similarityScore: 1.0,
          duplicateId: existing.id,
          reason: 'Exact content match',
          recommendations: ['Try generating a variation of this content']
        };
      }

      // Check semantic similarity
      if (existing.semanticFingerprint === newFingerprint.semanticFingerprint) {
        const keywordOverlap = this.calculateKeywordOverlap(
          existing.keyWords,
          newFingerprint.keyWords
        );

        if (keywordOverlap > this.SIMILARITY_THRESHOLD) {
          return {
            isUnique: false,
            similarityScore: keywordOverlap,
            duplicateId: existing.id,
            reason: 'High semantic similarity',
            recommendations: [
              'Change the context or scenario',
              'Use different numbers or examples',
              'Modify the question format'
            ]
          };
        }
      }

      // Check usage frequency
      if (existing.usageCount >= this.MAX_USAGE_COUNT) {
        const recentUsage = this.isRecentlyUsed(existing.lastUsed, 7); // 7 days
        if (recentUsage) {
          return {
            isUnique: false,
            similarityScore: 0.5,
            duplicateId: existing.id,
            reason: 'Content used too frequently',
            recommendations: [
              'Wait before reusing this content',
              'Generate fresh content on the same topic'
            ]
          };
        }
      }
    }

    return {
      isUnique: true,
      similarityScore: 0,
      reason: 'Content is unique'
    };
  }

  /**
   * Calculate keyword overlap
   */
  private calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;

    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    return intersection.size / Math.max(set1.size, set2.size);
  }

  /**
   * Check if content was recently used
   */
  private isRecentlyUsed(lastUsed: string, days: number): boolean {
    const lastUsedDate = new Date(lastUsed);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return lastUsedDate > cutoffDate;
  }

  /**
   * Store content fingerprint
   */
  private async storeContentFingerprint(
    userId: string,
    fingerprint: ContentFingerprint
  ): Promise<void> {
    try {
      fingerprint.userId = userId;

      await supabase
        .from('content_fingerprints')
        .insert(fingerprint);

    } catch (error) {
      console.error('Error storing content fingerprint:', error);
    }
  }

  /**
   * Generate content variations
   */
  private generateVariationDescription(
    variationType: ContentVariation['variationType'],
    originalContent: string,
    subject: string
  ): string {
    const descriptions = {
      numbers: 'Change numerical values while maintaining difficulty level',
      context: 'Use different real-world scenarios or examples',
      format: 'Present the same concept using different question formats',
      difficulty: 'Adjust complexity while keeping the same learning objective'
    };

    return descriptions[variationType];
  }

  /**
   * Generate content ID
   */
  private generateContentId(content: string): string {
    return this.generateHash(content);
  }

  /**
   * Analyze content patterns
   */
  private analyzeContentPatterns(contentHistory: ContentFingerprint[]): {
    topicFrequency: Record<string, number>;
    formatFrequency: Record<string, number>;
    difficultyDistribution: Record<number, number>;
    overusedContent: string[];
  } {
    const topicFrequency: Record<string, number> = {};
    const formatFrequency: Record<string, number> = {};
    const difficultyDistribution: Record<number, number> = {};
    const overusedContent: string[] = [];

    contentHistory.forEach(content => {
      // Topic frequency
      topicFrequency[content.skillArea] = (topicFrequency[content.skillArea] || 0) + 1;

      // Format frequency
      formatFrequency[content.contentType] = (formatFrequency[content.contentType] || 0) + 1;

      // Difficulty distribution
      difficultyDistribution[content.difficulty] = (difficultyDistribution[content.difficulty] || 0) + 1;

      // Overused content
      if (content.usageCount >= this.MAX_USAGE_COUNT) {
        overusedContent.push(content.id);
      }
    });

    return {
      topicFrequency,
      formatFrequency,
      difficultyDistribution,
      overusedContent
    };
  }

  /**
   * Generate diversified recommendations
   */
  private generateDiversifiedRecommendations(
    patterns: any,
    subject: string,
    skillArea: string,
    gradeLevel: number,
    count: number
  ): Array<{
    content: string;
    topic: string;
    format: string;
    difficulty: number;
  }> {
    const recommendations = [];
    const topics = this.getTopicsForSubject(subject, skillArea);
    const formats = ['question', 'game', 'activity'];
    const difficulties = this.getDifficultiesForGrade(gradeLevel);

    // Ensure diversity in recommendations
    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length];
      const format = formats[i % formats.length];
      const difficulty = difficulties[i % difficulties.length];

      recommendations.push({
        content: `${format} about ${topic} at difficulty ${difficulty}`,
        topic,
        format,
        difficulty
      });
    }

    return recommendations;
  }

  /**
   * Calculate diversity score
   */
  private calculateDiversityScore(recommendations: any[], patterns: any): number {
    // Simple diversity calculation
    const topicDiversity = new Set(recommendations.map(r => r.topic)).size / recommendations.length;
    const formatDiversity = new Set(recommendations.map(r => r.format)).size / recommendations.length;
    const difficultyDiversity = new Set(recommendations.map(r => r.difficulty)).size / recommendations.length;

    return ((topicDiversity + formatDiversity + difficultyDiversity) / 3) * 100;
  }

  /**
   * Generate freshness recommendations
   */
  private generateFreshnessRecommendations(staleness: number, subject: string, skillArea: string): string[] {
    const recommendations = [];

    if (staleness > 70) {
      recommendations.push('Introduce completely new topics and question formats');
      recommendations.push('Vary the context and real-world applications');
    } else if (staleness > 40) {
      recommendations.push('Mix familiar topics with new presentation styles');
      recommendations.push('Rotate between different difficulty levels');
    } else {
      recommendations.push('Content variety is good, maintain current approach');
    }

    return recommendations;
  }

  /**
   * Helper methods for content generation
   */
  private getTopicsForSubject(subject: string, skillArea: string): string[] {
    // Return relevant topics for the subject/skill area
    const topicMap: Record<string, string[]> = {
      mathematics: ['algebra', 'geometry', 'statistics', 'fractions', 'decimals'],
      english: ['reading', 'writing', 'grammar', 'vocabulary', 'literature'],
      science: ['biology', 'physics', 'chemistry', 'earth_science', 'space'],
      social_studies: ['history', 'geography', 'civics', 'economics', 'culture']
    };

    return topicMap[subject] || [skillArea];
  }

  private getDifficultiesForGrade(gradeLevel: number): number[] {
    const baseDifficulty = Math.max(1, Math.min(5, Math.ceil(gradeLevel / 3)));
    return [
      Math.max(1, baseDifficulty - 1),
      baseDifficulty,
      Math.min(5, baseDifficulty + 1)
    ];
  }
}

export const contentDeduplicationService = new ContentDeduplicationService();
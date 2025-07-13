
// Origin validation utilities for cross-origin communication

export class OriginChecker {
  private allowedOrigins: string[] = [];

  constructor() {
    this.initializeAllowedOrigins();
  }

  private initializeAllowedOrigins() {
    // Static allowed origins for Jules AI
    const julesOrigins = [
      'https://aistudio.google.com',
      'https://gemini.google.com',
      'https://makersuite.google.com',
      'https://ai.google.dev',
      'https://developers.google.com',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      'https://www.googleapis.com'
    ];

    // Lovable editor and platform origins
    const lovableOrigins = [
      'https://lovable.dev',
      'https://app.lovable.dev',
      'https://preview.lovable.dev'
    ];

    // Get current origin
    const currentOrigin = window.location.origin;
    
    // Initialize with static origins
    this.allowedOrigins = [...julesOrigins, ...lovableOrigins];
    
    // Always add current origin
    if (!this.allowedOrigins.includes(currentOrigin)) {
      this.allowedOrigins.push(currentOrigin);
      console.log('✅ Added current origin to allowed list:', currentOrigin);
    }

    // Check if we're in a Lovable preview environment
    const isLovablePreview = this.isLovablePreviewEnvironment(currentOrigin);
    if (isLovablePreview) {
      console.log('✅ Detected Lovable preview environment');
      // Add additional Lovable patterns
      const additionalLovablePatterns = [
        'https://*.lovable.app',
        'https://*.lovableproject.com'
      ];
      // Note: These are pattern strings, not actual origins
      console.log('📝 Lovable preview patterns recognized:', additionalLovablePatterns);
    }

    console.log('🎯 Final allowed origins:', this.allowedOrigins);
  }

  private isLovablePreviewEnvironment(origin: string): boolean {
    const lovablePatterns = [
      /^https:\/\/.*\.lovable\.app$/,
      /^https:\/\/.*\.lovableproject\.com$/,
      /^https:\/\/id-preview--.*\.lovable\.app$/
    ];

    return lovablePatterns.some(pattern => pattern.test(origin));
  }

  public isOriginAllowed(origin: string): boolean {
    // Check exact matches first
    const exactMatch = this.allowedOrigins.some(allowed => origin === allowed);
    
    if (exactMatch) {
      console.log(`🔍 Origin check: ${origin} -> ✅ ALLOWED (exact match)`);
      return true;
    }

    // Check Lovable domain patterns
    const lovablePatterns = [
      /^https:\/\/.*\.lovable\.app$/,
      /^https:\/\/.*\.lovableproject\.com$/,
      /^https:\/\/id-preview--.*\.lovable\.app$/,
      /^https:\/\/.*\.lovable\.dev$/
    ];

    for (const pattern of lovablePatterns) {
      if (pattern.test(origin)) {
        console.log(`🔍 Origin check: ${origin} -> ✅ ALLOWED (Lovable pattern match)`);
        return true;
      }
    }

    // Check Google/Jules domain patterns
    const googlePatterns = [
      /^https:\/\/.*\.google\.com$/,
      /^https:\/\/.*\.googleapis\.com$/,
      /^https:\/\/.*\.google\.dev$/
    ];

    for (const pattern of googlePatterns) {
      if (pattern.test(origin)) {
        console.log(`🔍 Origin check: ${origin} -> ✅ ALLOWED (Google pattern match)`);
        return true;
      }
    }

    console.log(`🔍 Origin check: ${origin} -> ❌ BLOCKED`);
    return false;
  }

  public getAllowedOrigins(): string[] {
    return [...this.allowedOrigins];
  }

  public isInLovableEditor(): boolean {
    // Check if we're running inside the Lovable editor
    return window.parent !== window && 
           window.parent.location?.origin === 'https://lovable.dev';
  }
}


// Origin validation utilities for cross-origin communication

export class OriginChecker {
  private allowedOrigins: string[] = [];

  constructor() {
    this.initializeAllowedOrigins();
  }

  private initializeAllowedOrigins() {
    // Static allowed origins
    const staticOrigins = [
      'https://aistudio.google.com',
      'https://gemini.google.com',
      'https://makersuite.google.com',
      'https://ai.google.dev',
      'https://developers.google.com',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      'https://www.googleapis.com',
      'https://lovable.dev',
      'https://app.lovable.dev',
      'https://preview.lovable.dev'
    ];

    // Add current origin
    const currentOrigin = window.location.origin;
    
    // Add Lovable preview domain patterns
    const lovablePreviewPattern = /^https:\/\/.*\.lovable\.app$/;
    const lovableIdPreviewPattern = /^https:\/\/id-preview--.*\.lovable\.app$/;
    
    this.allowedOrigins = [...staticOrigins];
    
    // Always add current origin
    if (!this.allowedOrigins.includes(currentOrigin)) {
      this.allowedOrigins.push(currentOrigin);
      console.log('✅ Added current origin to allowed list:', currentOrigin);
    }

    // Add common Lovable patterns if they match
    if (lovablePreviewPattern.test(currentOrigin) || lovableIdPreviewPattern.test(currentOrigin)) {
      // Extract base domain patterns
      const baseDomain = currentOrigin.replace(/^https:\/\/[^.]+/, 'https://*');
      console.log('✅ Detected Lovable preview environment, added pattern:', baseDomain);
    }
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
      /^https:\/\/id-preview--.*\.lovable\.app$/,
      /^https:\/\/.*\.lovable\.dev$/
    ];

    for (const pattern of lovablePatterns) {
      if (pattern.test(origin)) {
        console.log(`🔍 Origin check: ${origin} -> ✅ ALLOWED (pattern match)`);
        return true;
      }
    }

    // Check if origin ends with any allowed domain
    const domainMatch = this.allowedOrigins.some(allowed => 
      origin === allowed || origin.endsWith(allowed.replace('https://', ''))
    );

    if (domainMatch) {
      console.log(`🔍 Origin check: ${origin} -> ✅ ALLOWED (domain match)`);
      return true;
    }

    console.log(`🔍 Origin check: ${origin} -> ❌ BLOCKED`);
    return false;
  }

  public getAllowedOrigins(): string[] {
    return [...this.allowedOrigins];
  }
}

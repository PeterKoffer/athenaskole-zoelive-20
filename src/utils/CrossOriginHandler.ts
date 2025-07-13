// Cross-origin handler for Jules AI integration
class CrossOriginHandler {
  public allowedOrigins: string[] = [];

  private messageHandlers = new Map<string, (data: any) => void>();

  constructor() {
    this.initializeAllowedOrigins();
    this.initializeHandlers();
    console.log('🔧 CrossOriginHandler initialized with allowed origins:', this.allowedOrigins);
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

  private initializeHandlers() {
    // Handle Jules code modification requests
    this.messageHandlers.set('julesCodeModification', (data) => {
      console.log('🤖 Jules code modification request:', data);
      this.handleJulesModification(data);
    });

    // Handle authentication requests
    this.messageHandlers.set('julesAuth', (data) => {
      console.log('🔐 Jules authentication request:', data);
      this.handleJulesAuth(data);
    });

    // Handle project access requests
    this.messageHandlers.set('julesProjectAccess', (data) => {
      console.log('📁 Jules project access request:', data);
      this.handleJulesProjectAccess(data);
    });
  }

  private isOriginAllowed(origin: string): boolean {
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

  public handleMessage = (event: MessageEvent) => {
    console.log('📨 Received message event:', {
      origin: event.origin,
      type: event.data?.type,
      timestamp: new Date().toISOString()
    });

    // Check origin
    if (!this.isOriginAllowed(event.origin)) {
      console.warn('⚠️ Message from unauthorized origin blocked:', event.origin);
      return;
    }

    const { type, data } = event.data || {};
    
    if (!type) {
      console.warn('⚠️ Message missing type field:', event.data);
      return;
    }

    const handler = this.messageHandlers.get(type);
    if (handler) {
      console.log(`✅ Handling message type: ${type}`);
      handler(data);
    } else {
      console.log(`ℹ️ No handler for message type: ${type}`);
    }
  };

  private handleJulesModification(data: any) {
    try {
      console.log('🔄 Processing Jules modification:', data);
      
      // Dispatch custom event for the application to handle
      const customEvent = new CustomEvent('julesCodeModification', {
        detail: data
      });
      
      window.dispatchEvent(customEvent);
      console.log('✅ Jules modification event dispatched');
      
      // Send acknowledgment back to Jules
      this.sendMessageToJules({
        type: 'modificationAck',
        success: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error handling Jules modification:', error);
      this.sendMessageToJules({
        type: 'modificationError',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleJulesAuth(data: any) {
    try {
      console.log('🔐 Processing Jules authentication:', data);
      
      // For now, just acknowledge the auth request
      // In a real implementation, you might verify tokens or permissions
      this.sendMessageToJules({
        type: 'authAck',
        success: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error handling Jules auth:', error);
      this.sendMessageToJules({
        type: 'authError',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleJulesProjectAccess(data: any) {
    try {
      console.log('📁 Processing Jules project access:', data);
      
      // Send project information back to Jules
      const projectInfo = {
        name: 'School Dashboard',
        framework: 'React + TypeScript',
        features: ['Authentication', 'Dashboard', 'User Management'],
        lastModified: new Date().toISOString()
      };
      
      this.sendMessageToJules({
        type: 'projectInfo',
        data: projectInfo,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error handling Jules project access:', error);
      this.sendMessageToJules({
        type: 'projectAccessError',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  private sendMessageToJules(message: any) {
    try {
      // Try to find Jules window
      const julesOrigins = this.allowedOrigins.filter(origin => 
        origin.includes('google') || origin.includes('gemini')
      );
      
      console.log('📤 Attempting to send message to Jules:', message);
      console.log('🎯 Target origins:', julesOrigins);
      
      // Post message to all potential Jules origins
      julesOrigins.forEach(origin => {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, origin);
            console.log(`✅ Message sent to parent at ${origin}`);
          }
          
          if (window.opener) {
            window.opener.postMessage(message, origin);
            console.log(`✅ Message sent to opener at ${origin}`);
          }
        } catch (error) {
          console.log(`ℹ️ Could not send message to ${origin}:`, error.message);
        }
      });
      
      // Also try sending to current origin if it's different
      const currentOrigin = window.location.origin;
      if (!julesOrigins.includes(currentOrigin)) {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*');
            console.log(`✅ Message sent to parent with wildcard`);
          }
        } catch (error) {
          console.log(`ℹ️ Could not send wildcard message:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('❌ Error sending message to Jules:', error);
    }
  }

  public initialize() {
    console.log('🚀 Initializing CrossOriginHandler...');
    
    // Add message event listener
    window.addEventListener('message', this.handleMessage);
    console.log('👂 Message event listener added');
    
    // Send ready signal to potential Jules instances
    setTimeout(() => {
      this.sendMessageToJules({
        type: 'lovableReady',
        timestamp: new Date().toISOString(),
        capabilities: ['codeModification', 'projectAccess', 'realTimeUpdates']
      });
      console.log('📡 Ready signal sent to Jules');
    }, 1000);
  }

  public cleanup() {
    console.log('🧹 Cleaning up CrossOriginHandler...');
    window.removeEventListener('message', this.handleMessage);
    this.messageHandlers.clear();
  }

  // Debug method to test communication
  public testCommunication() {
    console.log('🧪 Testing Jules communication...');
    
    this.sendMessageToJules({
      type: 'testMessage',
      message: 'Hello from Lovable!',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Test message sent');
  }
}

// Create singleton instance
const crossOriginHandler = new CrossOriginHandler();

// Initialize Jules integration
export const initializeJulesIntegration = () => {
  console.log('🤖 Initializing Jules integration...');
  crossOriginHandler.initialize();
};

// Export handler for manual operations
export { crossOriginHandler };

// Debug function to troubleshoot cross-origin issues
export const debugCrossOriginIssues = () => {
  console.log('🔍 === CROSS-ORIGIN DEBUG INFORMATION ===');
  console.log('📍 Current URL:', window.location.href);
  console.log('🌐 Current Origin:', window.location.origin);
  console.log('👤 User Agent:', navigator.userAgent);
  
  console.log('🎯 Allowed Origins:', crossOriginHandler.allowedOrigins);
  
  console.log('🖼️ Frame Information:');
  console.log('  - Is in iframe:', window !== window.parent);
  console.log('  - Has opener:', !!window.opener);
  console.log('  - Parent origin:', window.parent !== window ? 'Available' : 'Same window');
  
  console.log('🔐 Security Information:');
  console.log('  - Protocol:', window.location.protocol);
  console.log('  - Is HTTPS:', window.location.protocol === 'https:');
  
  // Test communication
  setTimeout(() => {
    crossOriginHandler.testCommunication();
  }, 500);
};

// Default export
export default crossOriginHandler;

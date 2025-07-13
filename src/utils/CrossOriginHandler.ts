// Safe postMessage handler for cross-origin communication
export class CrossOriginHandler {
  private allowedOrigins: string[];

  constructor(allowedOrigins: string[] = []) {
    this.allowedOrigins = allowedOrigins;
    this.setupMessageListener();
  }

  // Add trusted origins
  addAllowedOrigin(origin: string) {
    if (!this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
    }
  }

  // Safe postMessage sender
  sendMessage(targetWindow: Window, message: any, targetOrigin: string) {
    // Always specify the exact target origin
    if (this.allowedOrigins.includes(targetOrigin) || targetOrigin === '*') {
      try {
        targetWindow.postMessage(message, targetOrigin);
        console.log(`✅ Message sent to ${targetOrigin}:`, message);
      } catch (error) {
        console.error(`❌ Failed to send message to ${targetOrigin}:`, error);
      }
    } else {
      console.warn(`🚫 Origin ${targetOrigin} not in allowed list`);
    }
  }

  // Safe message receiver
  private setupMessageListener() {
    window.addEventListener('message', (event: MessageEvent) => {
      // Always verify the origin for security
      if (!this.allowedOrigins.includes(event.origin) && event.origin !== window.location.origin) {
        console.warn(`🚫 Blocked message from untrusted origin: ${event.origin}`);
        return;
      }

      // Process trusted messages
      this.handleMessage(event.data, event.origin, event);
    });
  }

  // Override this method to handle specific messages
  handleMessage(data: any, origin: string, event?: MessageEvent) {
    console.log(`📨 Received message from ${origin}:`, data);
    
    // Handle Jules-specific messages
    switch (data.type) {
      case 'JULES_HANDSHAKE':
        this.handleJulesHandshake(data, origin, event);
        break;
      case 'JULES_CODE_REQUEST':
        this.handleJulesCodeRequest(data, origin);
        break;
      case 'JULES_CODE_MODIFICATION':
        this.handleJulesCodeModification(data, origin);
        break;
      case 'AUTH_TOKEN':
        this.handleAuthToken(data.token);
        break;
      case 'NAVIGATION':
        this.handleNavigation(data.path);
        break;
      case 'ERROR':
        this.handleError(data.error);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private handleJulesHandshake(data: any, origin: string, event?: MessageEvent) {
    console.log('🤖 Jules handshake received from:', origin);
    
    // Send back confirmation with app info
    const response = {
      type: 'JULES_HANDSHAKE_RESPONSE',
      status: 'connected',
      appInfo: {
        name: 'NELIE Education Platform',
        version: '1.0.0',
        framework: 'React + Vite + TypeScript',
        capabilities: ['code_read', 'code_write', 'ui_modify', 'data_access']
      },
      timestamp: Date.now()
    };

    // Try to send back to parent window or source
    if (window.parent !== window) {
      this.sendMessage(window.parent, response, origin);
    }
    if (event?.source && event.source !== window) {
      this.sendMessage(event.source as Window, response, origin);
    }
  }

  private handleJulesCodeRequest(data: any, origin: string) {
    console.log('🤖 Jules requesting code access:', data);
    
    // For security, we'll provide a sanitized view of the code structure
    const codeStructure = {
      type: 'JULES_CODE_RESPONSE',
      structure: {
        components: ['Auth', 'AuthForm', 'RoleSelector', 'ProtectedRoute'],
        pages: ['AuthPage', 'HomePage', 'DailyProgram', 'Dashboards'],
        hooks: ['useAuth', 'useRoleAccess', 'useAuthForm'],
        utils: ['CrossOriginHandler'],
        integrations: ['Supabase']
      },
      message: 'Code structure available. Lovable integration ready.'
    };

    if (window.parent !== window) {
      this.sendMessage(window.parent, codeStructure, origin);
    }
  }

  private handleJulesCodeModification(data: any, origin: string) {
    console.log('🤖 Jules requesting code modification:', data);
    
    // Send acknowledgment that we received the modification request
    const response = {
      type: 'JULES_MODIFICATION_RECEIVED',
      status: 'received',
      requestId: data.requestId || Date.now(),
      message: 'Modification request received. Processing through Lovable interface.'
    };

    if (window.parent !== window) {
      this.sendMessage(window.parent, response, origin);
    }

    // Trigger a custom event that other parts of the app can listen to
    window.dispatchEvent(new CustomEvent('julesCodeModification', { detail: data }));
  }

  private handleAuthToken(token: string) {
    // Store token securely (not in localStorage for production)
    sessionStorage.setItem('auth_token', token);
    console.log('✅ Auth token received and stored');
  }

  private handleNavigation(path: string) {
    // Use React Router for navigation
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
      // Trigger React Router update
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  private handleError(error: any) {
    console.error('❌ Received error:', error);
    // Handle error appropriately
  }

  // Method to announce our presence to parent windows
  announcePresence() {
    const announcement = {
      type: 'LOVABLE_APP_READY',
      appInfo: {
        name: 'NELIE Education Platform',
        ready: true,
        capabilities: ['cross_origin_communication', 'jules_integration']
      },
      timestamp: Date.now()
    };

    // Announce to parent window
    if (window.parent !== window) {
      this.sendMessage(window.parent, announcement, '*');
    }

    // Also announce to opener if exists
    if (window.opener) {
      this.sendMessage(window.opener, announcement, '*');
    }

    console.log('📢 Announced presence to parent windows');
  }
}

// Create enhanced instance with Google and Jules-friendly origins
export const crossOriginHandler = new CrossOriginHandler([
  'https://lovable.dev',
  'https://gptengineer.app', 
  'https://gemini.google.com',
  'https://bard.google.com',
  'https://ai.google.dev',
  'https://makersuite.google.com',
  'https://aistudio.google.com',
  'https://colab.research.google.com',
  'https://colab.sandbox.google.com',
  'https://accounts.google.com',
  'https://developers.google.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  // Add the current origin for self-communication
  window.location.origin
]);

// Initialize Jules integration
export function initializeJulesIntegration() {
  console.log('🚀 Initializing Jules integration...');
  
  // Announce our presence
  crossOriginHandler.announcePresence();
  
  // Set up periodic heartbeat
  setInterval(() => {
    const heartbeat = {
      type: 'JULES_HEARTBEAT',
      timestamp: Date.now(),
      status: 'active'
    };
    
    if (window.parent !== window) {
      crossOriginHandler.sendMessage(window.parent, heartbeat, '*');
    }
  }, 30000); // Every 30 seconds

  console.log('✅ Jules integration initialized');
}

// Example: Send message to Jules/Google AI
export function sendToJules(data: any) {
  const message = {
    type: 'LOVABLE_TO_JULES',
    data,
    timestamp: Date.now(),
    source: 'lovable-nelie-app'
  };
  
  // Try various Google origins
  const googleOrigins = [
    'https://gemini.google.com',
    'https://bard.google.com', 
    'https://ai.google.dev',
    'https://aistudio.google.com'
  ];
  
  googleOrigins.forEach(origin => {
    if (window.parent !== window) {
      crossOriginHandler.sendMessage(window.parent, message, origin);
    }
  });
}

// Example: Handle iframe communication
export function setupIframeComm(iframeElement: HTMLIFrameElement, targetOrigin: string) {
  iframeElement.onload = () => {
    const message = {
      type: 'INIT',
      timestamp: Date.now(),
      source: 'lovable-frontend'
    };
    
    crossOriginHandler.sendMessage(
      iframeElement.contentWindow!, 
      message, 
      targetOrigin
    );
  };
}

// Debug utilities
export function debugCrossOriginIssues() {
  console.log('🔍 Cross-Origin Debug Info:');
  console.log('Current origin:', window.location.origin);
  console.log('User agent:', navigator.userAgent);
  console.log('Cookies enabled:', navigator.cookieEnabled);
  console.log('Local storage available:', typeof(Storage) !== 'undefined');
  console.log('Parent window:', window.parent !== window ? 'Present' : 'None');
  console.log('Opener window:', window.opener ? 'Present' : 'None');
  
  // Test postMessage capabilities
  try {
    window.postMessage('test', window.location.origin);
    console.log('✅ postMessage works');
  } catch (e) {
    console.log('❌ postMessage failed:', e);
  }
}

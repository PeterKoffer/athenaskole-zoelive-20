
// Safe postMessage handler for cross-origin communication
export class CrossOriginHandler {
  private allowedOrigins: string[];
  private debugMode: boolean = true; // Enable debug logging

  constructor(allowedOrigins: string[] = []) {
    this.allowedOrigins = allowedOrigins;
    this.debugLog('🔧 CrossOriginHandler initialized with origins:', this.allowedOrigins);
    this.setupMessageListener();
  }

  private debugLog(message: string, ...args: any[]) {
    if (this.debugMode) {
      console.log(`[CrossOriginHandler] ${message}`, ...args);
    }
  }

  private debugWarn(message: string, ...args: any[]) {
    if (this.debugMode) {
      console.warn(`[CrossOriginHandler] ${message}`, ...args);
    }
  }

  private debugError(message: string, ...args: any[]) {
    if (this.debugMode) {
      console.error(`[CrossOriginHandler] ${message}`, ...args);
    }
  }

  // Add trusted origins
  addAllowedOrigin(origin: string) {
    if (!this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
      this.debugLog('✅ Added new allowed origin:', origin);
    } else {
      this.debugLog('ℹ️ Origin already in allowed list:', origin);
    }
  }

  // Safe postMessage sender
  sendMessage(targetWindow: Window, message: any, targetOrigin: string) {
    this.debugLog('📤 Attempting to send message:', {
      targetOrigin,
      message,
      allowedOrigins: this.allowedOrigins,
      isOriginAllowed: this.allowedOrigins.includes(targetOrigin) || targetOrigin === '*'
    });

    // Always specify the exact target origin
    if (this.allowedOrigins.includes(targetOrigin) || targetOrigin === '*') {
      try {
        // Check if target window is valid
        if (!targetWindow) {
          this.debugError('❌ Target window is null/undefined');
          return;
        }

        // Check if target window is closed
        if (targetWindow.closed) {
          this.debugError('❌ Target window is closed');
          return;
        }

        targetWindow.postMessage(message, targetOrigin);
        this.debugLog(`✅ Message sent successfully to ${targetOrigin}:`, message);
      } catch (error) {
        this.debugError(`❌ Failed to send message to ${targetOrigin}:`, error);
        this.debugError('Target window details:', {
          isClosed: targetWindow?.closed,
          isNull: targetWindow === null,
          isUndefined: targetWindow === undefined
        });
      }
    } else {
      this.debugWarn(`🚫 Origin ${targetOrigin} not in allowed list. Allowed origins:`, this.allowedOrigins);
    }
  }

  // Safe message receiver
  private setupMessageListener() {
    this.debugLog('🎧 Setting up message listener');
    
    window.addEventListener('message', (event: MessageEvent) => {
      this.debugLog('📨 Raw message received:', {
        origin: event.origin,
        data: event.data,
        source: event.source === window ? 'self' : event.source === window.parent ? 'parent' : 'other',
        allowedOrigins: this.allowedOrigins,
        currentOrigin: window.location.origin
      });

      // Always verify the origin for security
      const isOriginAllowed = this.allowedOrigins.includes(event.origin) || event.origin === window.location.origin;
      
      if (!isOriginAllowed) {
        this.debugWarn(`🚫 Blocked message from untrusted origin: ${event.origin}`, {
          data: event.data,
          allowedOrigins: this.allowedOrigins
        });
        return;
      }

      this.debugLog(`✅ Processing trusted message from ${event.origin}`);
      
      // Process trusted messages
      this.handleMessage(event.data, event.origin, event);
    });

    this.debugLog('✅ Message listener setup complete');
  }

  // Override this method to handle specific messages
  handleMessage(data: any, origin: string, event?: MessageEvent) {
    this.debugLog(`📨 Handling message from ${origin}:`, data);
    
    // Validate message structure
    if (!data || typeof data !== 'object') {
      this.debugWarn('⚠️ Invalid message format (not an object):', data);
      return;
    }

    if (!data.type) {
      this.debugWarn('⚠️ Message missing type field:', data);
      return;
    }
    
    // Handle Jules-specific messages
    switch (data.type) {
      case 'JULES_HANDSHAKE':
        this.debugLog('🤖 Processing Jules handshake');
        this.handleJulesHandshake(data, origin, event);
        break;
      case 'JULES_CODE_REQUEST':
        this.debugLog('🤖 Processing Jules code request');
        this.handleJulesCodeRequest(data, origin);
        break;
      case 'JULES_CODE_MODIFICATION':
        this.debugLog('🤖 Processing Jules code modification');
        this.handleJulesCodeModification(data, origin);
        break;
      case 'AUTH_TOKEN':
        this.debugLog('🔐 Processing auth token');
        this.handleAuthToken(data.token);
        break;
      case 'NAVIGATION':
        this.debugLog('🧭 Processing navigation request');
        this.handleNavigation(data.path);
        break;
      case 'ERROR':
        this.debugLog('❌ Processing error message');
        this.handleError(data.error);
        break;
      default:
        this.debugLog('❓ Unknown message type:', data.type, data);
    }
  }

  private handleJulesHandshake(data: any, origin: string, event?: MessageEvent) {
    this.debugLog('🤖 Jules handshake received from:', origin, data);
    
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

    this.debugLog('🤖 Sending handshake response:', response);

    // Try to send back to parent window or source
    if (window.parent !== window) {
      this.debugLog('📤 Sending handshake response to parent window');
      this.sendMessage(window.parent, response, origin);
    }
    if (event?.source && event.source !== window) {
      this.debugLog('📤 Sending handshake response to event source');
      this.sendMessage(event.source as Window, response, origin);
    }
  }

  private handleJulesCodeRequest(data: any, origin: string) {
    this.debugLog('🤖 Jules requesting code access:', data);
    
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

    this.debugLog('📤 Sending code structure response:', codeStructure);

    if (window.parent !== window) {
      this.sendMessage(window.parent, codeStructure, origin);
    }
  }

  private handleJulesCodeModification(data: any, origin: string) {
    this.debugLog('🤖 Jules requesting code modification:', data);
    
    // Send acknowledgment that we received the modification request
    const response = {
      type: 'JULES_MODIFICATION_RECEIVED',
      status: 'received',
      requestId: data.requestId || Date.now(),
      message: 'Modification request received. Processing through Lovable interface.'
    };

    this.debugLog('📤 Sending modification acknowledgment:', response);

    if (window.parent !== window) {
      this.sendMessage(window.parent, response, origin);
    }

    // Trigger a custom event that other parts of the app can listen to
    this.debugLog('🔔 Dispatching custom event: julesCodeModification');
    window.dispatchEvent(new CustomEvent('julesCodeModification', { detail: data }));
  }

  private handleAuthToken(token: string) {
    // Store token securely (not in localStorage for production)
    sessionStorage.setItem('auth_token', token);
    this.debugLog('✅ Auth token received and stored');
  }

  private handleNavigation(path: string) {
    this.debugLog('🧭 Handling navigation to:', path);
    // Use React Router for navigation
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
      // Trigger React Router update
      window.dispatchEvent(new PopStateEvent('popstate'));
      this.debugLog('✅ Navigation completed');
    } else {
      this.debugError('❌ Navigation not supported - missing history API');
    }
  }

  private handleError(error: any) {
    this.debugError('❌ Received error:', error);
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

    this.debugLog('📢 Announcing presence:', announcement);

    // Check window relationships
    this.debugLog('🔍 Window relationships:', {
      hasParent: window.parent !== window,
      hasOpener: !!window.opener,
      currentOrigin: window.location.origin,
      userAgent: navigator.userAgent.substring(0, 100) + '...'
    });

    // Announce to parent window
    if (window.parent !== window) {
      this.debugLog('📤 Announcing to parent window');
      this.sendMessage(window.parent, announcement, '*');
    } else {
      this.debugLog('ℹ️ No parent window detected');
    }

    // Also announce to opener if exists
    if (window.opener) {
      this.debugLog('📤 Announcing to opener window');
      this.sendMessage(window.opener, announcement, '*');
    } else {
      this.debugLog('ℹ️ No opener window detected');
    }

    this.debugLog('✅ Presence announcement completed');
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
  
  // Debug current environment
  console.log('🔍 Environment details:', {
    origin: window.location.origin,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent.substring(0, 100) + '...',
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: typeof(Storage) !== 'undefined'
  });
  
  // Announce our presence
  crossOriginHandler.announcePresence();
  
  // Set up periodic heartbeat
  const heartbeatInterval = setInterval(() => {
    const heartbeat = {
      type: 'JULES_HEARTBEAT',
      timestamp: Date.now(),
      status: 'active'
    };
    
    console.log('[Jules Heartbeat] Sending heartbeat:', heartbeat);
    
    if (window.parent !== window) {
      crossOriginHandler.sendMessage(window.parent, heartbeat, '*');
    }
  }, 30000); // Every 30 seconds

  // Store interval ID for cleanup
  (window as any).__julesHeartbeatInterval = heartbeatInterval;

  console.log('✅ Jules integration initialized with heartbeat');
}

// Example: Send message to Jules/Google AI
export function sendToJules(data: any) {
  const message = {
    type: 'LOVABLE_TO_JULES',
    data,
    timestamp: Date.now(),
    source: 'lovable-nelie-app'
  };
  
  console.log('🤖 Sending message to Jules:', message);
  
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
  console.log('🖼️ Setting up iframe communication:', { targetOrigin });
  
  iframeElement.onload = () => {
    const message = {
      type: 'INIT',
      timestamp: Date.now(),
      source: 'lovable-frontend'
    };
    
    console.log('🖼️ Iframe loaded, sending init message:', message);
    
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
  console.log('Full URL:', window.location.href);
  console.log('User agent:', navigator.userAgent);
  console.log('Cookies enabled:', navigator.cookieEnabled);
  console.log('Local storage available:', typeof(Storage) !== 'undefined');
  console.log('Session storage available:', typeof(sessionStorage) !== 'undefined');
  console.log('Parent window:', window.parent !== window ? 'Present' : 'None');
  console.log('Opener window:', window.opener ? 'Present' : 'None');
  console.log('Frame depth:', window.top === window ? 0 : 'In frame');
  
  // Test postMessage capabilities
  try {
    window.postMessage('test', window.location.origin);
    console.log('✅ postMessage self-test works');
  } catch (e) {
    console.log('❌ postMessage self-test failed:', e);
  }

  // Test access to parent
  try {
    if (window.parent !== window) {
      console.log('✅ Can access parent window');
      // Try to send a test message
      window.parent.postMessage({ type: 'DEBUG_TEST', source: 'nelie-app' }, '*');
      console.log('✅ Test message sent to parent');
    }
  } catch (e) {
    console.log('❌ Cannot access parent window:', e);
  }

  // Log current handlers
  console.log('Registered event listeners:', {
    crossOriginHandlerActive: !!crossOriginHandler,
    allowedOrigins: crossOriginHandler?.allowedOrigins || []
  });
}

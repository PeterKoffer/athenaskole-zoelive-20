// Safe postMessage handler for cross-origin communication
export class CrossOriginHandler {
  private allowedOrigins: string[];

  constructor(allowedOrigins: string[] = []) {
    this.allowedOrigins = allowedOrigins;
    if (window.location.origin !== 'null') {
      this.addAllowedOrigin(window.location.origin);
    }
    this.setupMessageListener();
    console.log('CrossOriginHandler initialized with allowed origins:', this.allowedOrigins);
  }

  // Add trusted origins
  addAllowedOrigin(origin: string) {
    if (!this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
      console.log('Added allowed origin:', origin);
    }
  }

  // Safe postMessage sender
  sendMessage(targetWindow: Window, message: any, targetOrigin: string) {
    console.log(`Attempting to send message to ${targetOrigin}:`, message);
    // Always specify the exact target origin
    if (this.allowedOrigins.includes(targetOrigin)) {
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
    window.addEventListener('message', (event) => {
      console.log('Received message event:', event);
      // Always verify the origin
      if (!this.allowedOrigins.includes(event.origin)) {
        console.warn(`🚫 Blocked message from untrusted origin: ${event.origin}`);
        return;
      }

      // Process trusted messages
      this.handleMessage(event.data, event.origin);
    });
  }

  // Override this method to handle specific messages
  handleMessage(data: any, origin: string) {
    console.log(`📨 Received message from ${origin}:`, data);
    
    // Example message handling
    switch (data.type) {
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
}

// Create default instance with allowed origins
export const crossOriginHandler = new CrossOriginHandler([
  'https://lovable.dev',
  'https://gptengineer.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'https://*.google.com',
  'https://*.ai.google.dev',
  'https://bard.google.com',
  'https://gemini.google.com',
]);

// Example: Send message to GPT Engineer
export function sendToGPTEngine(data: any) {
  const targetOrigin = 'https://gptengineer.app';
  crossOriginHandler.sendMessage(window.parent, data, targetOrigin);
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
  
  // Test postMessage capabilities
  try {
    window.postMessage('test', window.location.origin);
    console.log('✅ postMessage works');
  } catch (e) {
    console.log('❌ postMessage failed:', e);
  }
}
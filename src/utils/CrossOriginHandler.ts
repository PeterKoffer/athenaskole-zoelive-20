
// Cross-origin handler for Jules AI integration
import { OriginChecker } from './originChecker';
import { JulesMessenger } from './julesMessenger';
import { MessageHandlers } from './messageHandlers';

class CrossOriginHandler {
  private originChecker: OriginChecker;
  private messenger: JulesMessenger;
  private messageHandlers: MessageHandlers;

  constructor() {
    this.originChecker = new OriginChecker();
    this.messenger = new JulesMessenger(this.originChecker.getAllowedOrigins());
    this.messageHandlers = new MessageHandlers(this.messenger);
    
    console.log('🔧 CrossOriginHandler initialized with allowed origins:', this.originChecker.getAllowedOrigins());
  }

  public get allowedOrigins(): string[] {
    return this.originChecker.getAllowedOrigins();
  }

  public handleMessage = (event: MessageEvent) => {
    console.log('📨 Received message event:', {
      origin: event.origin,
      type: event.data?.type,
      timestamp: new Date().toISOString()
    });

    // Check origin
    if (!this.originChecker.isOriginAllowed(event.origin)) {
      console.warn('⚠️ Message from unauthorized origin blocked:', event.origin);
      return;
    }

    const { type, data } = event.data || {};
    
    if (!type) {
      console.warn('⚠️ Message missing type field:', event.data);
      return;
    }

    if (this.messageHandlers.hasHandler(type)) {
      console.log(`✅ Handling message type: ${type}`);
      const handler = this.messageHandlers.getHandler(type);
      handler?.(data);
    } else {
      console.log(`ℹ️ No handler for message type: ${type}`);
    }
  };

  public initialize() {
    console.log('🚀 Initializing CrossOriginHandler...');
    
    // Add message event listener
    window.addEventListener('message', this.handleMessage);
    console.log('👂 Message event listener added');
    
    // Send ready signal to potential Jules instances
    setTimeout(() => {
      this.messenger.sendMessageToJules({
        type: 'lovableReady',
        timestamp: new Date().toISOString(),
        data: {
          capabilities: ['codeModification', 'projectAccess', 'realTimeUpdates']
        }
      });
      console.log('📡 Ready signal sent to Jules');
    }, 1000);
  }

  public cleanup() {
    console.log('🧹 Cleaning up CrossOriginHandler...');
    window.removeEventListener('message', this.handleMessage);
  }

  // Debug method to test communication
  public testCommunication() {
    this.messenger.testCommunication();
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

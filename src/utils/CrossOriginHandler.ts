
// Cross-origin communication utilities
export function initializeJulesIntegration() {
  console.log('🤖 Initializing Jules integration...');
  
  // Set up global handlers for Jules communication
  (window as any).julesHandler = {
    receiveMessage: (message: any) => {
      console.log('📨 Received message from Jules:', message);
      
      // Dispatch custom event for components to listen to
      const event = new CustomEvent('julesCodeModification', {
        detail: message
      });
      window.dispatchEvent(event);
    },
    
    sendMessage: (message: any) => {
      console.log('📤 Sending message to Jules:', message);
      // Implementation for sending messages back to Jules
    }
  };
}

export function crossOriginHandler(event: MessageEvent) {
  console.log('🌐 Cross-origin message received:', event);
  
  // Validate origin if needed
  if (event.origin !== window.location.origin) {
    console.log('⚠️ Message from different origin:', event.origin);
  }
  
  // Handle the message
  if (event.data && typeof event.data === 'object') {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'JULES_MODIFICATION':
        console.log('🔧 Jules modification request:', payload);
        break;
      case 'JULES_STATUS':
        console.log('📊 Jules status update:', payload);
        break;
      default:
        console.log('❓ Unknown message type:', type);
    }
  }
}

export function debugCrossOriginIssues() {
  console.log('🐛 Debugging cross-origin setup...');
  console.log('Current origin:', window.location.origin);
  console.log('User agent:', navigator.userAgent);
  console.log('Jules handler available:', !!(window as any).julesHandler);
}

// Initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('message', crossOriginHandler);
}

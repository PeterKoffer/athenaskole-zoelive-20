
// Communication utilities for sending messages to Jules AI

import type { JulesMessage } from '@/types/jules';

export class JulesMessenger {
  private allowedOrigins: string[];

  constructor(allowedOrigins: string[]) {
    this.allowedOrigins = allowedOrigins;
  }

  public sendMessageToJules(message: JulesMessage) {
    try {
      console.log('📤 Attempting to send message to Jules:', message);
      
      // Check if we're in Lovable editor first
      const isInLovableEditor = window.parent !== window;
      
      if (isInLovableEditor) {
        // Try to send to Lovable editor first
        try {
          window.parent.postMessage(message, 'https://lovable.dev');
          console.log('✅ Message sent to Lovable editor');
        } catch (error) {
          console.log('ℹ️ Could not send message to Lovable editor:', error.message);
        }
      }

      // Try Jules-specific origins
      const julesOrigins = this.allowedOrigins.filter(origin => 
        origin.includes('google') || origin.includes('gemini')
      );
      
      console.log('🎯 Jules target origins:', julesOrigins);
      
      // Post message to potential Jules origins
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
      
      // Fallback: try wildcard for current environment
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(message, '*');
          console.log(`✅ Message sent to parent with wildcard`);
        }
      } catch (error) {
        console.log(`ℹ️ Could not send wildcard message:`, error.message);
      }
      
    } catch (error) {
      console.error('❌ Error sending message to Jules:', error);
    }
  }

  public testCommunication() {
    console.log('🧪 Testing Jules communication...');
    
    // First, test basic environment info
    console.log('🏠 Environment check:');
    console.log('  - Current origin:', window.location.origin);
    console.log('  - Has parent:', window.parent !== window);
    console.log('  - Has opener:', !!window.opener);
    
    // Test message
    this.sendMessageToJules({
      type: 'testMessage',
      data: 'Hello from Lovable!',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Test message sent');
  }
}

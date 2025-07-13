
// Communication utilities for sending messages to Jules AI

import type { JulesMessage } from '@/types/jules';

export class JulesMessenger {
  private allowedOrigins: string[];

  constructor(allowedOrigins: string[]) {
    this.allowedOrigins = allowedOrigins;
  }

  public sendMessageToJules(message: JulesMessage) {
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

  public testCommunication() {
    console.log('🧪 Testing Jules communication...');
    
    this.sendMessageToJules({
      type: 'testMessage',
      data: 'Hello from Lovable!',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Test message sent');
  }
}


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

      const hasParent = window.parent && window.parent !== window;
      const hasOpener = !!window.opener;

      const getReferrerOrigin = () => {
        try {
          return new URL(document.referrer).origin;
        } catch {
          return undefined;
        }
      };

      const targetOrigin = getReferrerOrigin() || '*';

      if (hasParent) {
        try {
          window.parent.postMessage(message, targetOrigin);
          console.log(`✅ Message sent to parent at ${targetOrigin}`);
        } catch (error) {
          console.log('ℹ️ Could not post message to parent:', (error as Error).message);
        }
      }

      if (hasOpener) {
        try {
          window.opener.postMessage(message, targetOrigin);
          console.log(`✅ Message sent to opener at ${targetOrigin}`);
        } catch (error) {
          console.log('ℹ️ Could not post message to opener:', (error as Error).message);
        }
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

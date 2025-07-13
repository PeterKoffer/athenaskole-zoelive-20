import { isOriginAllowed } from './originChecker';

export function sendMessage(targetWindow: Window, message: any, targetOrigin: string) {
  console.log(`Attempting to send message to ${targetOrigin}:`, message);
  if (isOriginAllowed(targetOrigin)) {
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

export function sendToJules(message: any) {
  const julesOrigin = 'https://gemini.google.com';
  sendMessage(window.parent, message, julesOrigin);
}

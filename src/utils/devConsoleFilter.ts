// Development-only console filter to mute noisy iframe/extension messages

if (import.meta.env.DEV) {
  const IGNORE_PATTERNS = [
    /Failed to execute 'postMessage'.*does not match the recipient window's origin/,
    /target origin does not match/i,
  ];
  
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && IGNORE_PATTERNS.some(pattern => pattern.test(args[0] as string))) {
      return; // Mute this message
    }
    origError(...args);
  };
}
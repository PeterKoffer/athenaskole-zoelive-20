


export function setupUserInteractionListeners(
  setHasUserInteracted: () => void,
  alreadyInteracted: boolean
) {
  const enableOnInteraction = () => {
    if (!alreadyInteracted) setHasUserInteracted();
  };

  ["click", "touchstart", "keydown"].forEach((event) => {
    document.addEventListener(event, enableOnInteraction, { once: true });
  });
}

export function setupPageVisibilityListener(stopFunc: () => void, isSpeaking: boolean) {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isSpeaking) stopFunc();
  });
}

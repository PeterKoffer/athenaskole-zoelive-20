
import { useCallback, useRef } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playCorrectAnswerSound = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      
      // Create a pleasant, dopamine-inducing sound sequence
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set up the first note (C5 - 523.25 Hz)
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator1.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      // Set up the second note for harmony (E5 - 659.25 Hz)
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
      oscillator2.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.2); // C6
      
      // Set oscillator types for pleasant sound
      oscillator1.type = 'triangle';
      oscillator2.type = 'sine';
      
      // Create envelope for smooth attack and decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
      
      // Start and stop oscillators
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.4);
      oscillator2.stop(audioContext.currentTime + 0.4);
      
      console.log('🔊 Playing correct answer sound effect!');
    } catch (error) {
      console.error('❌ Error playing sound effect:', error);
    }
  }, [initAudioContext]);

  const playWrongAnswerSound = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      
      // Create a gentle, encouraging sound for wrong answers
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Gentle descending tone
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(350, audioContext.currentTime + 0.3);
      
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      console.log('🔊 Playing wrong answer sound effect');
    } catch (error) {
      console.error('❌ Error playing wrong answer sound:', error);
    }
  }, [initAudioContext]);

  return {
    playCorrectAnswerSound,
    playWrongAnswerSound
  };
};

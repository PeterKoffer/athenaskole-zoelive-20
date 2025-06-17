
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
      
      // Create a euphoric, dopamine-inducing sound sequence
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a triumphant major chord progression (C-E-G to F-A-C to G-B-D)
      // First chord: C Major
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      oscillator3.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
      
      // Second chord: F Major (uplifting transition)
      oscillator1.frequency.setValueAtTime(698.46, audioContext.currentTime + 0.15); // F5
      oscillator2.frequency.setValueAtTime(880.00, audioContext.currentTime + 0.15); // A5
      oscillator3.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.15); // C6
      
      // Final chord: G Major (resolution with higher octave for excitement)
      oscillator1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3); // G5
      oscillator2.frequency.setValueAtTime(987.77, audioContext.currentTime + 0.3); // B5
      oscillator3.frequency.setValueAtTime(1174.7, audioContext.currentTime + 0.3); // D6
      
      // Set oscillator types for rich, warm sound
      oscillator1.type = 'triangle';
      oscillator2.type = 'sine';
      oscillator3.type = 'triangle';
      
      // Create euphoric envelope - quick attack, sustained high, gentle decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05); // Quick attack
      gainNode.gain.setValueAtTime(0.35, audioContext.currentTime + 0.2); // Sustain
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.35); // Keep energy
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6); // Gentle fade
      
      // Start and stop oscillators
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator3.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.6);
      oscillator2.stop(audioContext.currentTime + 0.6);
      oscillator3.stop(audioContext.currentTime + 0.6);
      
      console.log('🎉 Playing dopamine-inducing correct answer sound!');
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

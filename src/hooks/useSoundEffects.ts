
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
      
      // Faster, more immediate dopamine-inducing sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Faster chord progression - C Major to G Major (instant satisfaction)
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      oscillator3.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
      
      // Quick transition to higher, more exciting chord
      oscillator1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.08); // G5
      oscillator2.frequency.setValueAtTime(987.77, audioContext.currentTime + 0.08); // B5
      oscillator3.frequency.setValueAtTime(1174.7, audioContext.currentTime + 0.08); // D6
      
      // Set oscillator types for rich, warm sound
      oscillator1.type = 'triangle';
      oscillator2.type = 'sine';
      oscillator3.type = 'triangle';
      
      // Much faster, more immediate envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02); // Very quick attack
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime + 0.1); // Short sustain
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25); // Quick fade
      
      // Start and stop oscillators - much shorter duration
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator3.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.25);
      oscillator2.stop(audioContext.currentTime + 0.25);
      oscillator3.stop(audioContext.currentTime + 0.25);
      
      console.log('🎉 Playing fast dopamine-inducing correct answer sound!');
    } catch (error) {
      console.error('❌ Error playing sound effect:', error);
    }
  }, [initAudioContext]);

  const playWrongAnswerSound = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      
      // Faster, gentler sound for wrong answers
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Quick descending tone
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(350, audioContext.currentTime + 0.15);
      
      oscillator.type = 'sine';
      
      // Faster envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      
      console.log('🔊 Playing fast wrong answer sound effect');
    } catch (error) {
      console.error('❌ Error playing wrong answer sound:', error);
    }
  }, [initAudioContext]);

  return {
    playCorrectAnswerSound,
    playWrongAnswerSound
  };
};

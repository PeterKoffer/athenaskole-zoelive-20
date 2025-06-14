
import { useState, useRef, useEffect, useCallback } from "react";

interface UsePronunciationPracticeOptions {
  targetText: string;
  language: string;
  onScoreUpdate?: (score: number) => void;
}

/**
 * Custom hook for managing pronunciation practice logic
 */
export function usePronunciationPractice({
  targetText,
  language,
  onScoreUpdate,
}: UsePronunciationPracticeOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const recognitionRef = useRef<any>(null);

  // SpeechRecognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "english" ? "en-US" : language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        analyzePronunciation(transcript, targetText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, targetText]);

  // Pronunciation scoring logic
  const analyzePronunciation = useCallback((spoken: string, target: string) => {
    const similarity = calculateSimilarity(spoken.toLowerCase(), target.toLowerCase());
    const score = Math.round(similarity * 100);
    setPronunciationScore(score);
    onScoreUpdate?.(score);

    if (score >= 90) {
      setFeedback("Perfect pronunciation! 🌟");
    } else if (score >= 75) {
      setFeedback("Really good! Try again to improve 👍");
    } else if (score >= 60) {
      setFeedback("Good try! Focus on pronunciation 🎯");
    } else {
      setFeedback("Try again - listen to the example first 🔄");
    }
  }, [onScoreUpdate]);

  // Simple matching – can be improved later
  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;

    words1.forEach(word1 => {
      if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
        matches++;
      }
    });

    return matches / Math.max(words1.length, words2.length);
  };

  // API: Start/stop/playing/listen/reset
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscription("");
      setPronunciationScore(null);
      setFeedback("");
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const playTargetAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      setIsPlayingExample(true);
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingExample(false);
      utterance.onerror = () => setIsPlayingExample(false);
      speechSynthesis.speak(utterance);
    }
  }, [targetText]);

  const reset = useCallback(() => {
    setTranscription("");
    setPronunciationScore(null);
    setFeedback("");
  }, []);

  return {
    isListening,
    isPlayingExample,
    transcription,
    pronunciationScore,
    feedback,
    startListening,
    stopListening,
    playTargetAudio,
    reset,
  };
}

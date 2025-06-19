
// TODO: Language Lab - Future Roadmap Considerations:
// 1. Six-Phase Structure: Evaluate if any parts of the Language Lab (e.g., cultural notes, introductions to complex grammar)
//    could benefit from being presented within the standard 6-phase lesson structure used by other NELIE subjects.
//    Language drills might remain in their current, more focused format.
// 2. Authoring Tools: For scalability, consider developing tools or a system for educators/linguists to easily create and manage
//    language curricula, lessons, and exercises, rather than direct JSON editing.
// 3. AI-Powered Enhancements:
//    - AI for generating diverse practice sentences.
//    - AI for providing feedback on free-form text/speech input.
//    - AI for adaptive difficulty adjustment within exercises.
// 4. Visuals: Incorporate more images and illustrations for vocabulary and cultural context.

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelectionView from "./language-learning/LanguageSelectionView";
import LessonView from "./language-learning/LessonView";
import {
  LanguageLabLanguage,
  LanguageLabCurriculum,
  LanguageLabLesson,
  LanguageLearningProps
} from "./language-learning/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // Assuming a loading spinner component

const LanguageLearning = ({ initialLanguage }: LanguageLearningProps) => {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<LanguageLabLanguage[]>([]);
  const [selectedLanguageData, setSelectedLanguageData] = useState<LanguageLabLanguage | null>(null);
  const [currentCurriculum, setCurrentCurriculum] = useState<LanguageLabCurriculum | null>(null);
  const [currentLessonData, setCurrentLessonData] = useState<LanguageLabLesson | null>(null);

  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(1250);

  // Fetch available languages on mount
  useEffect(() => {
    // TODO: Implement Spaced Repetition System (SRS) logic here or in a dedicated service.
    // - This could influence lesson selection (e.g., prioritizing review lessons).
    // - Vocabulary items within lessons could be selected for review based on SRS metadata.

    // TODO: Enhance K-12 Curriculum Alignment:
    // - Develop a more robust mapping between K-12 standards/grades and the curriculum levels/units.
    // - Potentially filter or adapt content based on more granular K-12 requirements.
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const response = await fetch('/data/language-lab/languages.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LanguageLabLanguage[] = await response.json();
        setLanguages(data);
        if (initialLanguage) {
          const lang = data.find(l => l.code === initialLanguage);
          if (lang) setSelectedLanguageData(lang);
          else console.warn(`Initial language "${initialLanguage}" not found.`);
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        // Handle error appropriately in UI
      } finally {
        setIsLoadingLanguages(false);
      }
    };
    fetchLanguages();
  }, [initialLanguage]);

  // Fetch curriculum when selectedLanguageData changes
  useEffect(() => {
    if (!selectedLanguageData) {
      setCurrentCurriculum(null); // Clear curriculum if no language is selected
      return;
    }
    const fetchCurriculum = async () => {
      setIsLoadingCurriculum(true);
      setCurrentCurriculum(null); // Clear previous curriculum
      setCurrentLessonData(null); // Clear previous lesson
      try {
        // Paths in languages.json are relative to public/data/
        const response = await fetch(`/data/${selectedLanguageData.curriculumPath}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LanguageLabCurriculum = await response.json();
        setCurrentCurriculum(data);
      } catch (error) {
        console.error(`Failed to fetch curriculum for ${selectedLanguageData.name}:`, error);
        // Handle error appropriately in UI
      } finally {
        setIsLoadingCurriculum(false);
      }
    };
    fetchCurriculum();
  }, [selectedLanguageData]);

  const handleLanguageSelect = useCallback((languageCode: string) => {
    const lang = languages.find(l => l.code === languageCode);
    if (lang) {
      setSelectedLanguageData(lang);
      setCurrentLessonData(null); // Reset lesson when language changes
    }
  }, [languages]);

  const handleLessonSelect = useCallback(async (lessonPath: string) => {
    setIsLoadingLesson(true);
    try {
      // Paths in curriculum JSON are relative to public/data/
      const response = await fetch(`/data/${lessonPath}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LanguageLabLesson = await response.json();
      setCurrentLessonData(data);
    } catch (error) {
      console.error(`Failed to fetch lesson from ${lessonPath}:`, error);
      // Handle error appropriately in UI
    } finally {
      setIsLoadingLesson(false);
    }
  }, []);

  const handleBackToSelection = useCallback(() => {
    setCurrentLessonData(null);
  }, []);

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  const handleLessonComplete = () => {
    setCurrentLessonData(null); // Go back to lesson selection for that language
    setStreak(prev => prev + 1);
    setXp(prev => prev + 50); // Example XP gain
  };

  const handleHeartLost = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const handleXpGained = (amount: number) => {
    setXp(prev => prev + amount);
  };

  if (isLoadingLanguages) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!currentLessonData ? (
        <LanguageSelectionView
          languages={languages}
          selectedLanguageCode={selectedLanguageData?.code}
          curriculum={currentCurriculum}
          isLoadingCurriculum={isLoadingCurriculum}
          hearts={hearts}
          streak={streak}
          xp={xp}
          onLanguageSelect={handleLanguageSelect}
          onLessonSelect={handleLessonSelect}
          onBack={handleBackToProgram}
          currentLanguageName={selectedLanguageData?.name}
        />
      ) : (
        <LessonView
          currentLesson={currentLessonData}
          isLoadingLesson={isLoadingLesson} // Pass loading state
          hearts={hearts}
          xp={xp}
          onBack={handleBackToSelection}
          onLessonComplete={handleLessonComplete}
          onHeartLost={handleHeartLost}
          onXpGained={handleXpGained}
          currentLanguageCode={selectedLanguageData?.code || 'en'} // Pass current language code
        />
      )}
    </div>
  );
};

export default LanguageLearning;

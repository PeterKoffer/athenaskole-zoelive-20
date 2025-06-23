
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { LessonSection, VocabularyItem } from "./types";

interface SectionRendererProps {
  section: LessonSection;
  currentLanguageCode: string;
  playAudio: (text: string, langCode?: string) => void;
}

const SectionRenderer = ({ section, currentLanguageCode, playAudio }: SectionRendererProps) => {
  const renderSectionContent = (section: LessonSection) => {
    switch (section.type) {
      case 'vocabulary':
        return (
          <div className="space-y-3">
            {section.items?.map((item: VocabularyItem, index: number) => (
              <Card key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold text-lime-300">{item.term}</p>
                    <p className="text-md text-gray-300">{item.translation}</p>
                  </div>
                  {item.audio && (
                    <Button variant="ghost" size="icon" onClick={() => playAudio(item.term, currentLanguageCode)}>
                      <Volume2 className="w-6 h-6 text-purple-400" />
                    </Button>
                  )}
                </div>
                {item.exampleSentence && <p className="text-sm text-gray-400 mt-1 italic">E.g.: "{item.exampleSentence}"</p>}
              </Card>
            ))}
          </div>
        );
      case 'exercises':
        return null; // Exercises are handled separately
      case 'grammar':
        return <p className="text-gray-400">Grammar section rendering (TODO)</p>;
      case 'dialogue':
        return <p className="text-gray-400">Dialogue section rendering (TODO)</p>;
      case 'cultureNote':
        return <p className="text-gray-400">Cultural note rendering (TODO)</p>;
      default:
        return <p className="text-gray-400">Unsupported section type: {section.type}</p>;
    }
  };

  return renderSectionContent(section);
};

export default SectionRenderer;

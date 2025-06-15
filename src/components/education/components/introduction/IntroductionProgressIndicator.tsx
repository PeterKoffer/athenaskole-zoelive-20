
interface IntroductionProgressIndicatorProps {
  sections: { title: string; text: string }[];
  currentSection: number;
}

const IntroductionProgressIndicator = ({
  sections,
  currentSection,
}: IntroductionProgressIndicatorProps) => (
  <div className="flex justify-center mb-6">
    <div className="flex space-x-2">
      {sections.map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index <= currentSection ? 'bg-purple-400' : 'bg-purple-700'
          }`}
        />
      ))}
    </div>
  </div>
);

export default IntroductionProgressIndicator;

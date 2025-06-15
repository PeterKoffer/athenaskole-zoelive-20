
interface IntroductionContentProps {
  currentContent: { title: string; text: string };
}

const IntroductionContent = ({ currentContent }: IntroductionContentProps) => (
  <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold text-white mb-3">{currentContent.title}</h3>
    <p className="text-purple-100 leading-relaxed text-lg">{currentContent.text}</p>
  </div>
);

export default IntroductionContent;

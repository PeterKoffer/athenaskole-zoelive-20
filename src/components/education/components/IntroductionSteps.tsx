
interface IntroductionStepsProps {
  currentStepText: string;
}

const IntroductionSteps = ({ currentStepText }: IntroductionStepsProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <p className="text-lg text-white leading-relaxed">
        {currentStepText}
      </p>
    </div>
  );
};

export default IntroductionSteps;

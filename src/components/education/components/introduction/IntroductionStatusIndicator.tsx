
interface IntroductionStatusIndicatorProps {
  hasStarted: boolean;
  isSpeaking: boolean;
  isComplete: boolean;
}

const IntroductionStatusIndicator = ({ hasStarted, isSpeaking, isComplete }: IntroductionStatusIndicatorProps) => {
  if (!hasStarted) {
    return (
      <div className="text-center mt-4">
        <p className="text-purple-300 text-sm">
          You can start with Nelie's voice guidance or proceed directly to the lesson
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-4">
      <p className="text-purple-300 text-sm">
        {isSpeaking ? (
          <>
            <div className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Nelie is speaking...
          </>
        ) : isComplete ? (
          'Introduction complete! Ready to start your class.'
        ) : (
          'Moving to next section...'
        )}
      </p>
    </div>
  );
};

export default IntroductionStatusIndicator;

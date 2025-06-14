
interface QuestionLoadingStateProps {
  message?: string;
}

const QuestionLoadingState = ({ 
  message = "Creating a personalized question for you..." 
}: QuestionLoadingStateProps) => {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-lg p-8 text-center">
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-blue-400 rounded-full mx-auto mb-4"></div>
        <h3 className="text-white text-lg font-semibold mb-2">Generating Question</h3>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default QuestionLoadingState;

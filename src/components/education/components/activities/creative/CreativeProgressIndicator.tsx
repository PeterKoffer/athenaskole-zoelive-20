
interface CreativeProgressIndicatorProps {
  currentPrompt: number;
  totalPrompts: number;
}

const CreativeProgressIndicator = ({ currentPrompt, totalPrompts }: CreativeProgressIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalPrompts }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            index < currentPrompt ? 'bg-green-400' : 
            index === currentPrompt ? 'bg-purple-400' : 'bg-purple-700'
          }`}
        />
      ))}
    </div>
  );
};

export default CreativeProgressIndicator;

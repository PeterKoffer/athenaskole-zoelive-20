
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div 
          key={index} 
          className={`w-3 h-3 rounded-full ${index <= currentStep ? 'bg-purple-400' : 'bg-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;

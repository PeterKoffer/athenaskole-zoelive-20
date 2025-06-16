
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';
import Blackboard from '../shared/Blackboard';

interface ActivitySimulationGameProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivitySimulationGame = ({
  activity,
  onActivityComplete
}: ActivitySimulationGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [money, setMoney] = useState(0);
  const [customersServed, setCustomersServed] = useState(0);
  const [gamePhase, setGamePhase] = useState<'playing' | 'success' | 'complete'>('playing');
  const [selectedSlices, setSelectedSlices] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const scenarios = activity.content?.scenarios || [];
  const currentCustomer = scenarios[currentScenario];

  const handleServeCustomer = (slices: number) => {
    const correctSlices = parseInt(currentCustomer?.challenge?.match(/\d+/)?.[0] || '0');
    
    if (slices === correctSlices) {
      const earnedMoney = parseInt(currentCustomer?.reward?.match(/\$(\d+)/)?.[1] || '0');
      setMoney(prev => prev + earnedMoney);
      setCustomersServed(prev => prev + 1);
      setGamePhase('success');
      
      setTimeout(() => {
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(prev => prev + 1);
          setGamePhase('playing');
          setSelectedSlices(0);
        } else {
          setGamePhase('complete');
          setHasCompleted(true);
        }
      }, 2000);
    } else {
      // Wrong answer - show feedback but continue
      setGamePhase('success');
      setTimeout(() => {
        setGamePhase('playing');
        setSelectedSlices(0);
      }, 2000);
    }
  };

  // Auto-advance to next activity after completion
  useEffect(() => {
    if (hasCompleted && gamePhase === 'complete') {
      console.log('🍕 Pizza Fraction Factory completed, advancing to next activity...');
      setTimeout(() => {
        onActivityComplete(true);
      }, 3500); // Give user time to see completion message
    }
  }, [hasCompleted, gamePhase, onActivityComplete]);

  if (gamePhase === 'complete') {
    return (
      <Blackboard>
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold text-white">Pizza Shop Master!</h2>
          <div className="space-y-2">
            <p className="text-xl text-green-400">Customers Served: {customersServed}</p>
            <p className="text-xl text-yellow-400">Money Earned: ${money}</p>
          </div>
          <p className="text-gray-300">You've mastered fractions through pizza!</p>
          <div className="text-blue-300 text-sm mt-4">
            Advancing to next activity...
          </div>
        </div>
      </Blackboard>
    );
  }

  return (
    <Blackboard>
      <div className="space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{activity.title}</h2>
          <div className="flex space-x-4">
            <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
              💰 ${money}
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
              👥 {customersServed} served
            </div>
          </div>
        </div>

        {/* Current Customer */}
        {gamePhase === 'playing' && currentCustomer ? (
          <div className="space-y-6">
            <div className="bg-orange-900/50 border border-orange-400 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <p className="text-white text-lg">{currentCustomer.customer}</p>
              <p className="text-orange-200 mt-2 font-medium">{currentCustomer.challenge}</p>
            </div>

            {/* Pizza Cutting Interface */}
            <div className="bg-yellow-900/30 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">🍕</div>
              <p className="text-white mb-4">How many slices should you cut this pizza into?</p>
              
              <div className="flex justify-center space-x-2 mb-6">
                {[2, 4, 6, 8, 12].map(slices => (
                  <Button
                    key={slices}
                    onClick={() => setSelectedSlices(slices)}
                    className={`w-16 h-16 text-xl font-bold ${
                      selectedSlices === slices
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                  >
                    {slices}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => handleServeCustomer(selectedSlices)}
                disabled={selectedSlices === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold disabled:opacity-50"
              >
                🍽️ Serve Customer
              </Button>
            </div>
          </div>
        ) : gamePhase === 'success' ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h3 className="text-2xl font-bold text-green-400">Great job!</h3>
            <p className="text-white">{currentCustomer?.reward}</p>
          </div>
        ) : null}

        {/* Progress */}
        <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          />
        </div>
        
        {/* Scenario progress indicator */}
        <div className="text-center text-gray-300 text-sm">
          Customer {currentScenario + 1} of {scenarios.length}
        </div>
      </div>
    </Blackboard>
  );
};

export default ActivitySimulationGame;

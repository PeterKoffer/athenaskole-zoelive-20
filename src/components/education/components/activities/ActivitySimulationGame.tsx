
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
  const [showManualComplete, setShowManualComplete] = useState(false);

  const scenarios = activity.content?.scenarios || [];
  const currentCustomer = scenarios[currentScenario];

  // Show manual complete button after 15 seconds (reduced from 30)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowManualComplete(true);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleServeCustomer = (slices: number) => {
    console.log('🍕 Serving customer with', slices, 'slices');
    console.log('🎯 Current customer challenge:', currentCustomer?.challenge);
    
    // Extract the fraction from the challenge text - improved parsing
    const fractionMatch = currentCustomer?.challenge?.match(/(\d+)\/(\d+)/);
    if (!fractionMatch) {
      console.error('❌ Could not parse fraction from challenge:', currentCustomer?.challenge);
      // Fallback - assume they got it right if no fraction found
      handleCorrectAnswer();
      return;
    }
    
    const numerator = parseInt(fractionMatch[1]);
    const denominator = parseInt(fractionMatch[2]);
    
    console.log('🔢 Parsed fraction:', numerator, '/', denominator);
    
    // For pizza fractions, the correct number of slices is simply the numerator
    // when the pizza is cut into denominator pieces
    const correctSlices = numerator;
    
    console.log('🎯 Expected slices:', correctSlices, 'Selected:', slices);
    
    // Check if the answer is correct
    if (slices === correctSlices) {
      console.log('✅ Correct answer! Customer served successfully');
      handleCorrectAnswer();
    } else {
      console.log('❌ Wrong answer, but allowing retry');
      // Show feedback but allow retry
      setGamePhase('success');
      setTimeout(() => {
        setGamePhase('playing');
        setSelectedSlices(0);
      }, 2000);
    }
  };

  const handleCorrectAnswer = () => {
    const earnedMoney = 25 + (currentScenario * 10);
    setMoney(prev => prev + earnedMoney);
    setCustomersServed(prev => prev + 1);
    setGamePhase('success');
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        // Move to next customer
        setCurrentScenario(prev => prev + 1);
        setGamePhase('playing');
        setSelectedSlices(0);
      } else {
        console.log('🎉 All customers served! Game complete');
        setGamePhase('complete');
      }
    }, 2000);
  };

  const handleManualComplete = () => {
    console.log('🔧 Manual completion triggered by user');
    onActivityComplete(true);
  };

  // Auto-complete when all scenarios are done
  useEffect(() => {
    if (gamePhase === 'complete') {
      console.log('🏁 Pizza Factory completed, calling onActivityComplete...');
      const timer = setTimeout(() => {
        onActivityComplete(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase, onActivityComplete]);

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
          <div className="text-blue-300 text-lg mt-4 animate-pulse">
            ✨ Advancing to next activity...
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
              <p className="text-white text-lg font-semibold">{currentCustomer.customer}</p>
              <p className="text-orange-200 mt-2 text-lg">{currentCustomer.challenge}</p>
            </div>

            {/* Pizza Cutting Interface */}
            <div className="bg-yellow-900/30 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">🍕</div>
              <p className="text-white mb-4 text-lg">How many slices should you give them?</p>
              
              <div className="flex justify-center space-x-2 mb-6 flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(slices => (
                  <Button
                    key={slices}
                    onClick={() => setSelectedSlices(slices)}
                    className={`w-16 h-16 text-xl font-bold ${
                      selectedSlices === slices
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                  >
                    {slices}
                  </Button>
                ))}
              </div>

              {selectedSlices > 0 && (
                <p className="text-white mb-4">
                  Selected: Give <strong>{selectedSlices}</strong> slices
                </p>
              )}

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
            <p className="text-white text-lg">{currentCustomer?.reward || 'Well done!'}</p>
          </div>
        ) : null}

        {/* Manual Complete Button (fallback) */}
        {showManualComplete && (
          <div className="text-center mt-6">
            <Button
              onClick={handleManualComplete}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
            >
              ✨ Continue to Next Activity
            </Button>
            <p className="text-gray-400 text-sm mt-2">Click if you want to move on</p>
          </div>
        )}

        {/* Progress */}
        <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          />
        </div>
        
        <div className="text-center text-gray-300 text-sm">
          Customer {currentScenario + 1} of {scenarios.length}
        </div>
      </div>
    </Blackboard>
  );
};

export default ActivitySimulationGame;

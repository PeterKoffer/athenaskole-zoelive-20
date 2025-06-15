
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, Award } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface SimulationGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

interface SimulationState {
  money: number;
  customers: number;
  satisfaction: number;
  day: number;
  gameComplete: boolean;
}

const SimulationGame = ({ level, onLevelComplete, gameData }: SimulationGameProps) => {
  const [state, setState] = useState<SimulationState>({
    money: 100,
    customers: 0,
    satisfaction: 50,
    day: 1,
    gameComplete: false
  });

  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const targetDays = 5;

  const actions = [
    {
      id: 'advertise',
      name: '📢 Advertise',
      cost: 20,
      effect: 'Attract more customers',
      moneyChange: -20,
      customerChange: 10,
      satisfactionChange: 0
    },
    {
      id: 'improve_service',
      name: '⭐ Improve Service',
      cost: 30,
      effect: 'Increase customer satisfaction',
      moneyChange: -30,
      customerChange: 0,
      satisfactionChange: 15
    },
    {
      id: 'hire_staff',
      name: '👥 Hire Staff',
      cost: 50,
      effect: 'Handle more customers',
      moneyChange: -50,
      customerChange: 5,
      satisfactionChange: 10
    },
    {
      id: 'end_day',
      name: '🌙 End Day',
      cost: 0,
      effect: 'Calculate daily earnings',
      moneyChange: 0,
      customerChange: 0,
      satisfactionChange: 0
    }
  ];

  const handleAction = (action: typeof actions[0]) => {
    if (action.cost > state.money && action.id !== 'end_day') return;
    
    setSelectedAction(action.id);
    
    if (action.id === 'end_day') {
      // Calculate daily earnings
      const earnings = state.customers * (state.satisfaction / 100) * 10;
      const newMoney = state.money + earnings;
      const newDay = state.day + 1;
      
      setState(prev => ({
        ...prev,
        money: Math.round(newMoney),
        day: newDay,
        customers: Math.max(0, prev.customers - 5), // Some customers leave
        satisfaction: Math.max(20, prev.satisfaction - 5), // Satisfaction decreases over time
        gameComplete: newDay > targetDays
      }));
    } else {
      setState(prev => ({
        ...prev,
        money: prev.money + action.moneyChange,
        customers: Math.max(0, prev.customers + action.customerChange),
        satisfaction: Math.min(100, Math.max(0, prev.satisfaction + action.satisfactionChange))
      }));
    }
    
    setTimeout(() => setSelectedAction(null), 1000);
  };

  useEffect(() => {
    if (state.gameComplete) {
      const finalScore = state.money + (state.customers * 10) + (state.satisfaction * 2);
      const perfect = state.money > 200 && state.satisfaction > 70;
      
      setTimeout(() => {
        onLevelComplete(finalScore, perfect);
      }, 2000);
    }
  }, [state.gameComplete, state.money, state.customers, state.satisfaction, onLevelComplete]);

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Settings className="w-6 h-6 mr-2 text-cyan-400" />
            Business Simulation
          </span>
          <Badge className="bg-cyan-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!state.gameComplete ? (
          <>
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">
                Day {state.day} of {targetDays}
              </h2>
              <p className="text-gray-400">
                Manage your business wisely to maximize profit and customer satisfaction!
              </p>
            </div>

            {/* Status Indicators */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-xl font-bold text-green-400">${state.money}</div>
                <div className="text-gray-400 text-sm">Money</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-xl font-bold text-blue-400">{state.customers}</div>
                <div className="text-gray-400 text-sm">Customers</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-xl font-bold text-yellow-400">{state.satisfaction}%</div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(state.satisfaction, 100)}`}
                    style={{ width: `${state.satisfaction}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg">Available Actions:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {actions.map(action => (
                  <Button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={action.cost > state.money && action.id !== 'end_day'}
                    className={`
                      p-4 h-auto text-left transition-all duration-200
                      ${selectedAction === action.id 
                        ? 'bg-green-600 text-white' 
                        : action.id === 'end_day'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }
                      ${action.cost > state.money && action.id !== 'end_day' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold mb-1">{action.name}</div>
                        <div className="text-sm opacity-80">{action.effect}</div>
                      </div>
                      {action.cost > 0 && (
                        <div className="text-right">
                          <div className="text-red-300 font-bold">-${action.cost}</div>
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-green-900 border-green-500 border-2 rounded-lg p-6 text-center space-y-4">
            <Award className="w-16 h-16 text-yellow-400 mx-auto" />
            <h3 className="text-3xl font-bold text-white">Business Complete! 🎉</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">${state.money}</div>
                <div className="text-green-200">Final Money</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{state.customers}</div>
                <div className="text-green-200">Customers</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{state.satisfaction}%</div>
                <div className="text-green-200">Satisfaction</div>
              </div>
            </div>
            
            <p className="text-green-200">
              {state.money > 200 && state.satisfaction > 70 
                ? "Outstanding business management! You're a natural entrepreneur!" 
                : state.money > 150 
                ? "Good job! Your business is profitable and growing!" 
                : "Not bad! You're learning valuable business skills!"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationGame;

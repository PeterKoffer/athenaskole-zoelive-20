
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, Crown, Award, Sparkles } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'avatar' | 'theme' | 'badge' | 'content';
  emoji: string;
  unlocked: boolean;
  owned: boolean;
}

interface RewardsSystemProps {
  currentCoins: number;
  onPurchase: (rewardId: string, cost: number) => void;
}

const RewardsSystem = ({ currentCoins, onPurchase }: RewardsSystemProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'avatar' | 'theme' | 'badge' | 'content'>('all');

  useEffect(() => {
    initializeRewards();
  }, []);

  const initializeRewards = () => {
    const rewardsList: Reward[] = [
      // Avatar rewards
      {
        id: 'viking_avatar',
        name: 'Viking Kriger',
        description: 'Bliv til en sej viking kriger',
        cost: 50,
        type: 'avatar',
        emoji: '⚔️',
        unlocked: true,
        owned: false
      },
      {
        id: 'princess_avatar',
        name: 'Prinsesse',
        description: 'En smuk prinsesse avatar',
        cost: 50,
        type: 'avatar',
        emoji: '👸',
        unlocked: true,
        owned: false
      },
      {
        id: 'wizard_avatar',
        name: 'Troldmand',
        description: 'Magisk troldmand med kræfter',
        cost: 75,
        type: 'avatar',
        emoji: '🧙‍♂️',
        unlocked: currentCoins >= 75,
        owned: false
      },
      
      // Theme rewards
      {
        id: 'space_theme',
        name: 'Rumtema',
        description: 'Udforsk rummet mens du lærer',
        cost: 100,
        type: 'theme',
        emoji: '🚀',
        unlocked: currentCoins >= 100,
        owned: false
      },
      {
        id: 'underwater_theme',
        name: 'Undervandstema',
        description: 'Dyk ned i havets dybder',
        cost: 100,
        type: 'theme',
        emoji: '🌊',
        unlocked: currentCoins >= 100,
        owned: false
      },
      
      // Badge rewards
      {
        id: 'pronunciation_master',
        name: 'Udtale Mester',
        description: 'For fantastisk udtale',
        cost: 25,
        type: 'badge',
        emoji: '🎯',
        unlocked: true,
        owned: false
      },
      {
        id: 'vocabulary_king',
        name: 'Ord Konge',
        description: 'For at mestre ordforråd',
        cost: 30,
        type: 'badge',
        emoji: '📚',
        unlocked: true,
        owned: false
      },
      {
        id: 'grammar_genius',
        name: 'Grammatik Geni',
        description: 'For perfekt grammatik',
        cost: 40,
        type: 'badge',
        emoji: '✏️',
        unlocked: currentCoins >= 40,
        owned: false
      },
      
      // Content rewards
      {
        id: 'bonus_lessons',
        name: 'Bonus Lektioner',
        description: '5 ekstra lektioner om danske traditioner',
        cost: 80,
        type: 'content',
        emoji: '📖',
        unlocked: currentCoins >= 80,
        owned: false
      },
      {
        id: 'premium_games',
        name: 'Premium Spil',
        description: 'Adgang til eksklusive læringsspil',
        cost: 120,
        type: 'content',
        emoji: '🎮',
        unlocked: currentCoins >= 120,
        owned: false
      }
    ];

    setRewards(rewardsList);
  };

  const handlePurchase = (reward: Reward) => {
    if (currentCoins >= reward.cost && !reward.owned) {
      setRewards(prev => prev.map(r => 
        r.id === reward.id ? { ...r, owned: true } : r
      ));
      onPurchase(reward.id, reward.cost);
    }
  };

  const filteredRewards = rewards.filter(reward => 
    selectedCategory === 'all' || reward.type === selectedCategory
  );

  const categories = [
    { id: 'all', name: 'Alle', icon: Star },
    { id: 'avatar', name: 'Avatarer', icon: Crown },
    { id: 'theme', name: 'Temaer', icon: Sparkles },
    { id: 'badge', name: 'Badges', icon: Award },
    { id: 'content', name: 'Indhold', icon: Gift }
  ];

  const ownedRewards = rewards.filter(r => r.owned);

  return (
    <div className="space-y-6">
      {/* Header with current coins */}
      <Card className="bg-gradient-to-r from-yellow-900 to-orange-900 border-yellow-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Star className="w-8 h-8 text-yellow-400" />
            <span className="text-3xl font-bold text-white">{currentCoins}</span>
            <span className="text-xl text-gray-300">stjerner</span>
          </div>
          <p className="text-gray-300">Køb fede belønninger med dine stjerner!</p>
        </CardContent>
      </Card>

      {/* Category filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={selectedCategory === category.id 
                    ? "bg-lime-600 hover:bg-lime-700" 
                    : "text-gray-300 border-gray-600 hover:bg-gray-700"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Owned rewards summary */}
      {ownedRewards.length > 0 && (
        <Card className="bg-green-900/20 border-green-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gift className="w-5 h-5 mr-2 text-green-400" />
              Mine Belønninger ({ownedRewards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ownedRewards.map((reward) => (
                <Badge
                  key={reward.id}
                  variant="outline"
                  className="bg-green-600 text-white border-green-600 px-3 py-1"
                >
                  {reward.emoji} {reward.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => (
          <Card 
            key={reward.id} 
            className={`${
              reward.owned 
                ? 'bg-green-900/20 border-green-700' 
                : reward.unlocked 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-800/50 border-gray-600 opacity-60'
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-3">{reward.emoji}</div>
              <h3 className="font-semibold text-white mb-2">{reward.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{reward.cost}</span>
                </div>
                
                {reward.owned ? (
                  <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                    Ejet ✓
                  </Badge>
                ) : reward.unlocked ? (
                  <Button
                    onClick={() => handlePurchase(reward)}
                    disabled={currentCoins < reward.cost}
                    className={`w-full ${
                      currentCoins >= reward.cost
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {currentCoins >= reward.cost ? 'Køb nu' : 'Ikke råd'}
                  </Button>
                ) : (
                  <Badge variant="outline" className="bg-gray-600 text-gray-400 border-gray-600">
                    Låst 🔒
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardsSystem;

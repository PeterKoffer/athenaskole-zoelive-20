
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Users, Zap, Brain, TrendingUp, Server } from 'lucide-react';
import { scalableQuestionGeneration } from '@/services/scalableQuestionGeneration';

interface SystemMonitorProps {
  onClose: () => void;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ onClose }) => {
  const [stats, setStats] = useState({
    cachedQuestions: 0,
    activeUsers: 0,
    cacheHitRate: 0,
    systemLoad: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const systemStats = scalableQuestionGeneration.getSystemStats();
      setStats(systemStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Show monitor only in development or for admins
  useEffect(() => {
    const showMonitor = localStorage.getItem('showSystemMonitor') === 'true' || 
                      window.location.hostname === 'localhost';
    setIsVisible(showMonitor);
  }, []);

  if (!isVisible) return null;

  const getLoadColor = (load: number) => {
    if (load < 0.5) return 'text-green-400';
    if (load < 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoadDescription = (load: number) => {
    if (load < 0.3) return 'Low Load - Optimal Performance';
    if (load < 0.6) return 'Medium Load - Good Performance';
    if (load < 0.8) return 'High Load - Monitor Closely';
    return 'Critical Load - Scale Up Needed';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-gray-900 border-gray-700 shadow-xl">
        <CardContent className="p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">System Monitor</h3>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-3">
            {/* Active Users */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Active Users</span>
              </div>
              <span className="text-white font-semibold">{stats.activeUsers}/500</span>
            </div>

            {/* Cached Questions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">Cache Size</span>
              </div>
              <span className="text-white font-semibold">{stats.cachedQuestions}</span>
            </div>

            {/* Cache Hit Rate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Cache Hit Rate</span>
              </div>
              <span className="text-white font-semibold">{Math.round(stats.cacheHitRate * 100)}%</span>
            </div>

            {/* System Load */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">System Load</span>
              </div>
              <span className={`font-semibold ${getLoadColor(stats.systemLoad)}`}>
                {Math.round(stats.systemLoad * 100)}%
              </span>
            </div>

            {/* Load Status */}
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className={`text-xs ${getLoadColor(stats.systemLoad)}`}>
                  {getLoadDescription(stats.systemLoad)}
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-green-400 text-sm font-semibold">AI Ready</div>
                <div className="text-xs text-gray-400">Questions Generated</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-blue-400 text-sm font-semibold">Scalable</div>
                <div className="text-xs text-gray-400">500+ Users</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Real-time system performance monitoring
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;

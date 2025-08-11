
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Clock, TrendingUp, Star, Award } from "lucide-react";

interface ChildProgress {
  childName: string;
  weeklyMinutes: number;
  completedLessons: number;
  pronunciationScore: number;
  challengesCompleted: number;
  streak: number;
  newAchievements: string[];
}

interface ParentNotificationsProps {
  childProgress: ChildProgress;
  parentEmail?: string;
}

const ParentNotifications = ({ childProgress, parentEmail }: ParentNotificationsProps) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [weeklyReportSent, setWeeklyReportSent] = useState(false);

  useEffect(() => {
    generateProgressNotifications();
  }, [childProgress]);

  const generateProgressNotifications = () => {
    const newNotifications: any[] = [];

    // Streak milestone notification
    if (childProgress.streak > 0 && childProgress.streak % 7 === 0) {
      newNotifications.push({
        id: `streak_${childProgress.streak}`,
        type: 'milestone',
        title: `${childProgress.childName} has a ${childProgress.streak} day streak! 🔥`,
        message: `Amazing dedication! ${childProgress.childName} has used the app for ${childProgress.streak} days in a row.`,
        timestamp: new Date(),
        priority: 'high'
      });
    }

    // Weekly goal achievement
    if (childProgress.weeklyMinutes >= 120) {
      newNotifications.push({
        id: 'weekly_goal_achieved',
        type: 'achievement',
        title: 'Weekly goal achieved! 🎯',
        message: `${childProgress.childName} has reached the weekly goal with ${childProgress.weeklyMinutes} minutes of learning.`,
        timestamp: new Date(),
        priority: 'medium'
      });
    }

    // New achievements
    childProgress.newAchievements.forEach((achievement, index) => {
      newNotifications.push({
        id: `achievement_${index}`,
        type: 'achievement',
        title: `New achievement unlocked! 🏆`,
        message: `${childProgress.childName} has earned: ${achievement}`,
        timestamp: new Date(),
        priority: 'medium'
      });
    });

    // Pronunciation improvement
    if (childProgress.pronunciationScore >= 90) {
      newNotifications.push({
        id: 'pronunciation_excellent',
        type: 'progress',
        title: 'Excellent pronunciation! 🎤',
        message: `${childProgress.childName} has achieved ${childProgress.pronunciationScore}% accuracy in pronunciation.`,
        timestamp: new Date(),
        priority: 'low'
      });
    }

    setNotifications(prev => [...newNotifications, ...prev.slice(0, 10)]);
  };

  const sendWeeklyReport = async () => {
    if (!parentEmail) return;

    const report = {
      childName: childProgress.childName,
      weekSummary: {
        totalMinutes: childProgress.weeklyMinutes,
        lessonsCompleted: childProgress.completedLessons,
        averagePronunciation: childProgress.pronunciationScore,
        challengesCompleted: childProgress.challengesCompleted,
        streak: childProgress.streak,
        achievements: childProgress.newAchievements
      },
      recommendations: [
        childProgress.pronunciationScore < 75 ? "Focus on pronunciation exercises" : "Continue the great work with pronunciation",
        childProgress.weeklyMinutes < 120 ? "Try to increase daily learning time" : "Perfect weekly learning!",
        childProgress.challengesCompleted < 3 ? "Explore the daily challenges" : "Fantastic engagement with challenges"
      ]
    };

    try {
      // In a real app, this would send an email via backend
      console.log('Sending weekly report:', report);
      setWeeklyReportSent(true);
      
      // Simulate email send
      setTimeout(() => {
        setNotifications(prev => [{
          id: 'weekly_report_sent',
          type: 'system',
          title: 'Weekly report sent 📧',
          message: `Weekly report for ${childProgress.childName} has been sent to ${parentEmail}`,
          timestamp: new Date(),
          priority: 'low'
        }, ...prev]);
      }, 1000);
    } catch (error) {
      console.error('Failed to send weekly report:', error);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-purple-600 border-purple-600';
      case 'achievement': return 'bg-yellow-600 border-yellow-600';
      case 'progress': return 'bg-blue-600 border-blue-600';
      case 'system': return 'bg-green-600 border-green-600';
      default: return 'bg-gray-600 border-gray-600';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Star className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      case 'progress': return <TrendingUp className="w-5 h-5" />;
      case 'system': return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Report Card */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Send className="w-6 h-6 mr-2" />
            Weekly Report to Parents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-semibold">This Week's Highlights:</h4>
              <div className="space-y-1 text-gray-300">
                <p>• {childProgress.weeklyMinutes} minutes of learning</p>
                <p>• {childProgress.completedLessons} lessons completed</p>
                <p>• {childProgress.pronunciationScore}% pronunciation accuracy</p>
                <p>• {childProgress.challengesCompleted} challenges completed</p>
                <p>• {childProgress.streak} day streak</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-semibold">New Achievements:</h4>
              <div className="space-y-1">
                {childProgress.newAchievements.length > 0 ? (
                  childProgress.newAchievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-600 text-white border-yellow-600 mr-2 mb-1">
                      {achievement}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No new achievements this week</p>
                )}
              </div>
            </div>
          </div>

          {parentEmail && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-600">
              <div>
                <p className="text-white font-medium">Send to: {parentEmail}</p>
                <p className="text-gray-400 text-sm">Automatic every Sunday at 6:00 PM</p>
              </div>
              <Button
                onClick={sendWeeklyReport}
                disabled={weeklyReportSent}
                className="bg-green-600 hover:bg-green-700"
              >
                {weeklyReportSent ? 'Sent ✓' : 'Send Now'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Notifications */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Bell className="w-6 h-6 mr-2 text-lime-400" />
            Live Notifications
            {notifications.length > 0 && (
              <Badge variant="outline" className="ml-auto bg-red-600 text-white border-red-600">
                {notifications.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`${getNotificationColor(notification.type)} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-white mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{notification.title}</h4>
                        <p className="text-gray-100 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-gray-300" />
                          <span className="text-gray-300 text-xs">
                            {notification.timestamp.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No new notifications</p>
              <p className="text-sm">Notifications appear when progress is made</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Weekly reports</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Achievement notifications</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Milestone notifications</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Daily reminders</span>
              <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">Every day at 4:00 PM</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentNotifications;

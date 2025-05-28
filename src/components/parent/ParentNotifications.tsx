
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
    const newNotifications = [];

    // Streak milestone notification
    if (childProgress.streak > 0 && childProgress.streak % 7 === 0) {
      newNotifications.push({
        id: `streak_${childProgress.streak}`,
        type: 'milestone',
        title: `${childProgress.childName} har ${childProgress.streak} dage i træk! 🔥`,
        message: `Fantastisk dedikation! ${childProgress.childName} har brugt appen ${childProgress.streak} dage i træk.`,
        timestamp: new Date(),
        priority: 'high'
      });
    }

    // Weekly goal achievement
    if (childProgress.weeklyMinutes >= 120) {
      newNotifications.push({
        id: 'weekly_goal_achieved',
        type: 'achievement',
        title: 'Ugentligt mål nået! 🎯',
        message: `${childProgress.childName} har nået det ugentlige mål med ${childProgress.weeklyMinutes} minutter læring.`,
        timestamp: new Date(),
        priority: 'medium'
      });
    }

    // New achievements
    childProgress.newAchievements.forEach((achievement, index) => {
      newNotifications.push({
        id: `achievement_${index}`,
        type: 'achievement',
        title: `Ny præstation låst op! 🏆`,
        message: `${childProgress.childName} har optjent: ${achievement}`,
        timestamp: new Date(),
        priority: 'medium'
      });
    });

    // Pronunciation improvement
    if (childProgress.pronunciationScore >= 90) {
      newNotifications.push({
        id: 'pronunciation_excellent',
        type: 'progress',
        title: 'Fremragende udtale! 🎤',
        message: `${childProgress.childName} har opnået ${childProgress.pronunciationScore}% nøjagtighed i udtale.`,
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
        childProgress.pronunciationScore < 75 ? "Fokuser på udtaleøvelser" : "Fortsæt det gode arbejde med udtale",
        childProgress.weeklyMinutes < 120 ? "Prøv at øge den daglige læretid" : "Perfekt ugentlig læring!",
        childProgress.challengesCompleted < 3 ? "Udforsk de daglige udfordringer" : "Fantastisk engagement i udfordringer"
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
          title: 'Ugentlig rapport sendt 📧',
          message: `Ugentlig rapport for ${childProgress.childName} er sendt til ${parentEmail}`,
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
            Ugentlig Rapport til Forældre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Denne Uges Highlights:</h4>
              <div className="space-y-1 text-gray-300">
                <p>• {childProgress.weeklyMinutes} minutter læring</p>
                <p>• {childProgress.completedLessons} lektioner afsluttet</p>
                <p>• {childProgress.pronunciationScore}% udtale nøjagtighed</p>
                <p>• {childProgress.challengesCompleted} udfordringer klaret</p>
                <p>• {childProgress.streak} dages streak</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Nye Præstationer:</h4>
              <div className="space-y-1">
                {childProgress.newAchievements.length > 0 ? (
                  childProgress.newAchievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-600 text-white border-yellow-600 mr-2 mb-1">
                      {achievement}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Ingen nye præstationer denne uge</p>
                )}
              </div>
            </div>
          </div>

          {parentEmail && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-600">
              <div>
                <p className="text-white font-medium">Send til: {parentEmail}</p>
                <p className="text-gray-400 text-sm">Automatisk hver søndag kl. 18:00</p>
              </div>
              <Button
                onClick={sendWeeklyReport}
                disabled={weeklyReportSent}
                className="bg-green-600 hover:bg-green-700"
              >
                {weeklyReportSent ? 'Sendt ✓' : 'Send Nu'}
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
            Live Notifikationer
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
                            {notification.timestamp.toLocaleString('da-DK')}
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
              <p>Ingen nye notifikationer</p>
              <p className="text-sm">Notifikationer vises når der sker fremskridt</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Notifikations Indstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Ugentlige rapporter</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Aktiveret</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Præstations notifikationer</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Aktiveret</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Milestone notifikationer</span>
              <Badge variant="outline" className="bg-green-600 text-white border-green-600">Aktiveret</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Daglige påmindelser</span>
              <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">Hver dag kl. 16:00</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentNotifications;

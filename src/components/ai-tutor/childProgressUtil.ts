
export const getChildProgress = (user: any) => ({
  childName: user?.user_metadata?.name?.split(' ')[0] || "Emma",
  weeklyMinutes: 95,
  completedLessons: 8,
  pronunciationScore: 87,
  challengesCompleted: 12,
  streak: 5,
  newAchievements: ["Pronunciation Master", "7 Day Streak"]
});


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

const AchievementsCard = () => {
  const { t, i18n } = useTranslation();

  const achievements = [
    { name: t("days_in_a_row"), description: t("Used the app every day for a week"), date: "2024-01-15", emoji: "🔥" },
    { name: t("Math Master"), description: t("Reached 80% in mathematics"), date: "2024-01-10", emoji: "🧮" },
    { name: t("Spelling Champion"), description: t("Spelled 100 words correctly"), date: "2024-01-08", emoji: "✏️" },
    { name: t("Curious Learner"), description: t("Tried all subjects"), date: "2024-01-05", emoji: "🎓" }
  ];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Award className="w-5 h-5 text-lime-400" />
          <span>{t("Recent Achievements")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LanguageSwitcher />
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-2xl">{achievement.emoji}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{achievement.name}</h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("Achieved_on", { date: new Date(achievement.date).toLocaleDateString(i18n.language) })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;


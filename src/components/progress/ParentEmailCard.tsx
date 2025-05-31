
import { Card, CardContent } from "@/components/ui/card";

const ParentEmailCard = () => {
  return (
    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-lime-400">
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Parent email next week 📧</h3>
        <p className="text-gray-300 mb-4">
          Your parents will receive a report about your progress:
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="font-semibold text-green-400">Improvement</div>
            <div className="text-white">Mathematics: +15%</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="font-semibold text-blue-400">Most Active</div>
            <div className="text-white">Tuesday: 2 hours</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="font-semibold text-purple-400">New Badges</div>
            <div className="text-white">2 this week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentEmailCard;

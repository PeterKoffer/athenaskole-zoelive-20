
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

const NeliesTips = () => {
  const tipsText = "Start with the subject you find hardest - then you'll get it done! Remember to take breaks between activities. Say 'hi Nelie' if you need help along the way. Try speaking out loud when practicing languages - it helps with pronunciation!";

  return (
    <TextWithSpeaker
      text={tipsText}
      context="nelies-tips"
      position="corner"
      showOnHover={false}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span className="text-2xl">💡</span>
            <span>Nelie's Tips for Today</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300">
            <li>• Start with the subject you find hardest - then you'll get it done!</li>
            <li>• Remember to take breaks between activities</li>
            <li>• Say 'hi Nelie' if you need help along the way</li>
            <li>• Try speaking out loud when practicing languages - it helps with pronunciation!</li>
          </ul>
        </CardContent>
      </Card>
    </TextWithSpeaker>
  );
};

export default NeliesTips;

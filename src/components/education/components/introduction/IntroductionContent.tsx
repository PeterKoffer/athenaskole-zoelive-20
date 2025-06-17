
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface IntroductionContentProps {
  currentStepText: string;
  currentStep: number;
  totalSteps: number;
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isIntroductionComplete: boolean;
  subject: string;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onStartLesson: () => void;
}

const IntroductionContent = ({
  currentStepText,
  currentStep,
  totalSteps,
  autoReadEnabled,
  isSpeaking,
  isIntroductionComplete,
  subject,
  onMuteToggle,
  onManualRead,
  onStartLesson
}: IntroductionContentProps) => {
  // Get subject-specific content
  const getSubjectContent = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'english':
        return {
          emoji: '📚',
          title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} with Nelie!`,
          description: 'Ready for an amazing language and literature adventure?',
          welcomeText: 'Welcome to the World of Words and Stories. Meet Nelie, your AI-powered learning companion. Experience personalized English learning that adapts to your unique style, making every lesson engaging and effective.',
          tips: 'English Learning Tips: Take your time reading and understanding - there\'s no rush! Ask Nelie to repeat if you need to hear something again. Language is like exploring new worlds - have fun with it! Every new word you learn opens new possibilities.'
        };
      case 'music':
        return {
          emoji: '🎵',
          title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} with Nelie!`,
          description: 'Ready for an amazing musical adventure?',
          welcomeText: 'Welcome to the Beautiful World of Music. Meet Nelie, your AI-powered learning companion. Experience personalized music education that adapts to your unique learning style, making every lesson harmonious and engaging.',
          tips: 'Music Learning Tips: Listen carefully to different sounds and rhythms! Ask Nelie to play examples if you need to hear them again. Music is about feeling and expression - let your creativity flow! Every note you learn brings you closer to making beautiful music.'
        };
      case 'science':
        return {
          emoji: '🔬',
          title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} with Nelie!`,
          description: 'Ready for an amazing scientific discovery adventure?',
          welcomeText: 'Welcome to the Fascinating World of Science. Meet Nelie, your AI-powered learning companion. Experience personalized science education that adapts to your curiosity, making every lesson an exciting exploration.',
          tips: 'Science Learning Tips: Be curious and ask lots of questions! Ask Nelie to explain if something seems confusing. Science is about discovering how things work - experiment and explore! Every discovery you make helps you understand the world better.'
        };
      case 'computer-science':
        return {
          emoji: '💻',
          title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} with Nelie!`,
          description: 'Ready for an amazing coding and technology adventure?',
          welcomeText: 'Welcome to the Exciting World of Technology. Meet Nelie, your AI-powered learning companion. Experience personalized computer science education that adapts to your learning style, making programming fun and accessible.',
          tips: 'Programming Learning Tips: Think step by step through problems! Ask Nelie to explain code if you get stuck. Programming is like solving puzzles - be patient and creative! Every line of code you write brings your ideas to life.'
        };
      case 'creative-arts':
        return {
          emoji: '🎨',
          title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} with Nelie!`,
          description: 'Ready for an amazing artistic adventure?',
          welcomeText: 'Welcome to the Colorful World of Creative Arts. Meet Nelie, your AI-powered learning companion. Experience personalized art education that nurtures your creativity, making every lesson an artistic journey.',
          tips: 'Art Learning Tips: Express yourself freely and creatively! Ask Nelie for inspiration when you need ideas. Art is about personal expression - there are no wrong answers! Every creation you make is unique and valuable.'
        };
      default:
        return {
          emoji: '🔢',
          title: 'Mathematics with Nelie!',
          description: 'Ready for an amazing math adventure?',
          welcomeText: 'Welcome to the Future of Learning. Meet Nelie, your AI-powered learning companion. Experience personalized education that adapts to your unique learning style, making every lesson engaging and effective.',
          tips: 'Math Learning Tips: Take your time with each problem - there\'s no rush! Ask Nelie to repeat if you need to hear something again. Math is like solving puzzles - have fun with it! Every mistake is a chance to learn something new.'
        };
    }
  };

  const subjectContent = getSubjectContent(subject);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <TextWithSpeaker
        text={subjectContent.welcomeText}
        context={`${subject}-welcome-message`}
        position="corner"
        showOnHover={false}
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{subjectContent.emoji}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{subjectContent.title}</h1>
          <div className="text-2xl text-purple-200 mb-6">
            {subjectContent.description}
          </div>
        </div>
      </TextWithSpeaker>

      {/* Nelie's current message */}
      <TextWithSpeaker
        text={currentStepText}
        context="introduction-step-message"
        position="corner"
        showOnHover={false}
      >
        <div className="bg-blue-900/40 rounded-lg p-8 border border-blue-400/30">
          <div className="text-blue-100 text-xl leading-relaxed mb-6 text-center">
            {currentStepText}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-blue-300 text-sm font-medium">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <div className="flex-1 bg-blue-900 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </TextWithSpeaker>

      {/* Subject-specific Tips Section */}
      <TextWithSpeaker
        text={subjectContent.tips}
        context={`${subject}-learning-tips`}
        position="corner"
        showOnHover={false}
      >
        <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-6">
          <h3 className="text-yellow-200 font-bold text-lg mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            {subject.charAt(0).toUpperCase() + subject.slice(1)} Learning Tips
          </h3>
          <ul className="space-y-2 text-yellow-100">
            {subjectContent.tips.split('! ').filter(tip => tip.trim()).map((tip, index) => (
              <li key={index}>• {tip.trim()}{tip.endsWith('!') ? '' : '!'}</li>
            ))}
          </ul>
        </div>
      </TextWithSpeaker>
    </div>
  );
};

export default IntroductionContent;

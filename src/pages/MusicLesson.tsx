
import { EnhancedMusicLesson } from '@/components/education/music/EnhancedMusicLesson';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const MusicLesson = () => {
  const navigate = useNavigate();

  const handleLessonComplete = (score: number, responses: any[]) => {
    const percentage = Math.round((score / responses.length) * 100);
    
    toast.success(`🎵 Lesson Complete! You scored ${score}/${responses.length} (${percentage}%)`);
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/student-dashboard');
    }, 2000);
  };

  return <EnhancedMusicLesson onComplete={handleLessonComplete} />;
};

export default MusicLesson;

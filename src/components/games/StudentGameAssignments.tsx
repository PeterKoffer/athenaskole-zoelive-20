import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Target, 
  Calendar, 
  Trophy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { gameAssignmentService } from '@/services/gameAssignmentService';
import type { GameAssignment } from '@/types/database';
import { curriculumGames, type CurriculumGame } from '@/components/games/CurriculumGameConfig';

interface StudentGameAssignmentsProps {
  onGameSelect?: (gameId: string, assignmentId?: string) => void;
}

const StudentGameAssignments = ({ onGameSelect }: StudentGameAssignmentsProps) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<GameAssignment[]>([]);
  const [studentProgress, setStudentProgress] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await gameAssignmentService.getStudentAssignments(user.id);
      setAssignments(data);
      
      // Load progress for each assignment
      const progressData: Record<string, any> = {};
      for (const assignment of data) {
        const progress = await gameAssignmentService.getStudentProgress(user.id, assignment.game_id);
        progressData[assignment.game_id] = progress;
      }
      setStudentProgress(progressData);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
    setIsLoading(false);
  };

  const getGameDetails = (gameId: string): CurriculumGame | undefined => {
    return curriculumGames.find(game => game.id === gameId);
  };

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      mathematics: 'bg-blue-500',
      english: 'bg-green-500',
      science: 'bg-purple-500',
      'computer-science': 'bg-orange-500',
      'social-studies': 'bg-red-500',
      'creative-arts': 'bg-pink-500',
      music: 'bg-yellow-500',
    };
    return colors[subject] || 'bg-gray-500';
  };

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', text: 'Overdue', color: 'text-red-400' };
    if (diffDays === 0) return { status: 'today', text: 'Due Today', color: 'text-yellow-400' };
    if (diffDays <= 3) return { status: 'soon', text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'text-orange-400' };
    return { status: 'future', text: `Due ${format(due, 'MMM dd')}`, color: 'text-gray-400' };
  };

  const getProgressPercentage = (gameId: string): number => {
    const progress = studentProgress[gameId];
    if (!progress) return 0;
    
    // Calculate progress based on completed sessions and average score
    if (progress.completedSessions === 0) return 0;
    if (progress.averageScore >= 80) return 100;
    if (progress.averageScore >= 60) return 75;
    if (progress.averageScore >= 40) return 50;
    return 25;
  };

  const handlePlayGame = (assignment: GameAssignment) => {
    if (onGameSelect) {
      onGameSelect(assignment.game_id, assignment.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-600 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Game Assignments</h2>
        <p className="text-gray-400">
          Complete these educational games assigned by your teacher to enhance your learning.
        </p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const game = getGameDetails(assignment.game_id);
          const progress = studentProgress[assignment.game_id];
          const progressPercentage = getProgressPercentage(assignment.game_id);
          const dueDateStatus = getDueDateStatus(assignment.due_date);
          
          return (
            <Card key={assignment.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{game?.emoji || '🎮'}</div>
                    <div>
                      <CardTitle className="text-white text-lg flex items-center">
                        {game?.title || assignment.game_id}
                        {progressPercentage === 100 && (
                          <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${getSubjectColor(assignment.subject)} text-white`}>
                          {assignment.subject.replace('-', ' ')}
                        </Badge>
                        {assignment.skill_area && (
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {assignment.skill_area}
                          </Badge>
                        )}
                        {game && (
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {game.timeEstimate}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {dueDateStatus && (
                      <div className={`text-sm ${dueDateStatus.color} flex items-center`}>
                        {dueDateStatus.status === 'overdue' && <AlertCircle className="w-4 h-4 mr-1" />}
                        <Calendar className="w-4 h-4 mr-1" />
                        {dueDateStatus.text}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {assignment.learning_objective && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Learning Goal:
                    </h4>
                    <p className="text-white text-sm">{assignment.learning_objective}</p>
                  </div>
                )}
                
                {game?.description && (
                  <div>
                    <p className="text-gray-300 text-sm">{game.description}</p>
                  </div>
                )}

                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Progress</span>
                    <span className="text-sm text-gray-400">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Stats */}
                {progress && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{progress.completedSessions || 0}</div>
                      <div className="text-xs text-gray-400">Sessions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white flex items-center justify-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                        {progress.bestScore || 0}
                      </div>
                      <div className="text-xs text-gray-400">Best Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {progress.totalTimeSpent ? Math.round(progress.totalTimeSpent / 60) : 0}m
                      </div>
                      <div className="text-xs text-gray-400">Time Spent</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-400">
                    {game && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Estimated: {game.timeEstimate}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handlePlayGame(assignment)}
                    className="bg-lime-500 hover:bg-lime-600 text-black"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {progressPercentage > 0 ? 'Continue' : 'Start Game'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {assignments.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-white text-lg font-medium mb-2">No Assignments Yet</h3>
              <p className="text-gray-400">
                Your teacher hasn't assigned any games yet. Check back later for exciting learning activities!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentGameAssignments;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Plus, 
  Gamepad2, 
  Calendar as CalendarIcon, 
  Users, 
  BookOpen,
  Trash2,
  Edit,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { gameAssignmentService, type GameAssignment } from '@/services/gameAssignmentService';
import { curriculumGames, type CurriculumGame } from '@/components/games/CurriculumGameConfig';

const TeacherGameAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<GameAssignment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [skillArea, setSkillArea] = useState<string>('');
  const [learningObjective, setLearningObjective] = useState<string>('');
  const [assignedToClass, setAssignedToClass] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();

  // Get unique subjects from games
  const subjects = [...new Set(curriculumGames.map(game => game.subject))];
  
  // Filter games by selected subject
  const filteredGames = selectedSubject 
    ? curriculumGames.filter(game => game.subject === selectedSubject)
    : curriculumGames;

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await gameAssignmentService.getTeacherAssignments(user.id);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
    setIsLoading(false);
  };

  const handleCreateAssignment = async () => {
    if (!user?.id || !selectedGame || !selectedSubject) return;

    setIsLoading(true);
    try {
      const assignment = await gameAssignmentService.createAssignment({
        teacher_id: user.id,
        game_id: selectedGame,
        subject: selectedSubject,
        skill_area: skillArea || undefined,
        learning_objective: learningObjective || undefined,
        assigned_to_class: assignedToClass || undefined,
        due_date: dueDate?.toISOString(),
      });

      if (assignment) {
        setAssignments(prev => [assignment, ...prev]);
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteAssignment = async (id: string) => {
    const success = await gameAssignmentService.deleteAssignment(id);
    if (success) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const resetForm = () => {
    setSelectedGame('');
    setSelectedSubject('');
    setSkillArea('');
    setLearningObjective('');
    setAssignedToClass('');
    setDueDate(undefined);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Game Assignments</h2>
          <p className="text-gray-400">Assign educational games to your lessons and track student progress</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lime-500 hover:bg-lime-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Assign Game
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Game to Lesson</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          <span className="capitalize">{subject.replace('-', ' ')}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="game">Game</Label>
                  <Select value={selectedGame} onValueChange={setSelectedGame} disabled={!selectedSubject}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredGames.map(game => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.emoji} {game.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="skillArea">Skill Area (Optional)</Label>
                <Input
                  id="skillArea"
                  value={skillArea}
                  onChange={(e) => setSkillArea(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="e.g., Fractions, Reading Comprehension"
                />
              </div>

              <div>
                <Label htmlFor="learningObjective">Learning Objective</Label>
                <Textarea
                  id="learningObjective"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="What should students learn from this game?"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Assign to Class</Label>
                  <Input
                    id="class"
                    value={assignedToClass}
                    onChange={(e) => setAssignedToClass(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="e.g., 3A, Math Group 1"
                  />
                </div>

                <div>
                  <Label>Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAssignment}
                  disabled={!selectedGame || !selectedSubject || isLoading}
                  className="bg-lime-500 hover:bg-lime-600 text-black"
                >
                  {isLoading ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const game = getGameDetails(assignment.game_id);
          
          return (
            <Card key={assignment.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{game?.emoji || '🎮'}</div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {game?.title || assignment.game_id}
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
                            {game.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-600 text-red-400 hover:bg-red-600"
                      onClick={() => assignment.id && handleDeleteAssignment(assignment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {assignment.learning_objective && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Learning Objective:</h4>
                    <p className="text-white text-sm">{assignment.learning_objective}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    {assignment.assigned_to_class && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {assignment.assigned_to_class}
                      </div>
                    )}
                    {assignment.due_date && (
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Due: {format(new Date(assignment.due_date), "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs">
                    Created: {assignment.created_at && format(new Date(assignment.created_at), "MMM dd, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {assignments.length === 0 && !isLoading && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No Game Assignments</h3>
              <p className="text-gray-400 mb-4">
                Create your first game assignment to enhance student learning with interactive activities.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-lime-500 hover:bg-lime-600 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Your First Game
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherGameAssignments;

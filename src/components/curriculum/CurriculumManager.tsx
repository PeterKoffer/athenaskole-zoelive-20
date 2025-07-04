
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { CurriculumStep, Curriculum } from '@/types/curriculum';

interface CurriculumManagerProps {
  step: CurriculumStep;
  onBack: () => void;
  onCurriculumComplete: (curriculumId: string) => void;
}

const CurriculumManager = ({ step, onBack, onCurriculumComplete }: CurriculumManagerProps) => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCurriculum, setNewCurriculum] = useState<Partial<Curriculum>>({
    title: '',
    description: '',
    subject: '',
    content: '',
    duration: 30,
    order: 1
  });

  // Load existing curriculums for this step
  useEffect(() => {
    if (step.curriculums && step.curriculums.length > 0) {
      // Sort by order just in case they are not already sorted
      const sortedCurriculums = [...step.curriculums].sort((a, b) => a.order - b.order);
      setCurriculums(sortedCurriculums);
    } else {
      // Fallback: Generate 12 sample curriculums if step.curriculums is empty
      const sampleCurriculums: Curriculum[] = Array.from({ length: 12 }, (_, index) => ({
        id: `${step.id}-curriculum-sample-${index + 1}`, // Added -sample- to distinguish from real IDs
        stepId: step.id,
        title: `Sample Curriculum ${index + 1} for ${step.title}`,
        description: `This is sample content for ${step.title.toLowerCase()} - Module ${index + 1}`,
        subject: getSubjectForStep(step.stepNumber, index),
        content: `Detailed sample content for curriculum ${index + 1} of step ${step.stepNumber}. This is placeholder data.`,
        duration: 20 + (index * 5), // Varying duration
        isCompleted: Math.random() > 0.7, // Some randomly completed
        order: index + 1
      }));
      setCurriculums(sampleCurriculums);
    }
  }, [step]);

  // This function is needed for the sample curriculum fallback
  const getSubjectForStep = (stepNumber: number, curriculumIndex: number) => {
    const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education', 'Technology', 'Language', 'Philosophy', 'Psychology'];
    // Use stepNumber to vary the starting subject, making samples look a bit different per step
    return subjects[(curriculumIndex + stepNumber) % subjects.length];
  };

  const handleAddCurriculum = () => {
    if (curriculums.length >= 12) {
      alert('Maximum 12 curriculums per step allowed');
      return;
    }

    const curriculum: Curriculum = {
      id: `curriculum-${Date.now()}`,
      stepId: step.id,
      title: newCurriculum.title || '',
      description: newCurriculum.description || '',
      subject: newCurriculum.subject || '',
      content: newCurriculum.content || '',
      duration: newCurriculum.duration || 30,
      isCompleted: false,
      order: curriculums.length + 1
    };

    setCurriculums([...curriculums, curriculum]);
    setNewCurriculum({
      title: '',
      description: '',
      subject: '',
      content: '',
      duration: 30,
      order: curriculums.length + 2
    });
    setIsAdding(false);
  };

  const handleDeleteCurriculum = (id: string) => {
    setCurriculums(curriculums.filter(c => c.id !== id));
  };

  const handleToggleComplete = (curriculumId: string) => {
    setCurriculums(curriculums.map(c => 
      c.id === curriculumId ? { ...c, isCompleted: !c.isCompleted } : c
    ));
    onCurriculumComplete(curriculumId);
  };

  const completedCount = curriculums.filter(c => c.isCompleted).length;
  const progressPercentage = curriculums.length > 0 ? (completedCount / curriculums.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {step.stepNumber}
                </div>
                <span>{step.title}</span>
              </CardTitle>
              <p className="text-gray-400 mt-2">{step.description}</p>
            </div>
            <Button onClick={onBack} variant="outline" className="border-gray-600 text-white">
              Back to Steps
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Curriculum Progress</span>
              <span className="text-white">{completedCount}/{curriculums.length} completed</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add New Curriculum */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Manage Curriculums ({curriculums.length}/12)</CardTitle>
            {!isAdding && curriculums.length < 12 && (
              <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Curriculum
              </Button>
            )}
          </div>
        </CardHeader>
        {isAdding && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Title</Label>
                <Input
                  id="title"
                  value={newCurriculum.title}
                  onChange={(e) => setNewCurriculum({...newCurriculum, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Curriculum title"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                <Select 
                  value={newCurriculum.subject} 
                  onValueChange={(value) => setNewCurriculum({...newCurriculum, subject: value})}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Philosophy">Philosophy</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={newCurriculum.description}
                onChange={(e) => setNewCurriculum({...newCurriculum, description: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Curriculum description"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-gray-300">Content</Label>
              <Textarea
                id="content"
                value={newCurriculum.content}
                onChange={(e) => setNewCurriculum({...newCurriculum, content: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Detailed curriculum content"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-gray-300">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newCurriculum.duration}
                onChange={(e) => setNewCurriculum({...newCurriculum, duration: parseInt(e.target.value)})}
                className="bg-gray-700 border-gray-600 text-white"
                min="5"
                max="180"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddCurriculum} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Curriculum
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="border-gray-600 text-white">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Curriculums List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {curriculums.map((curriculum) => (
          <Card key={curriculum.id} className={`bg-gray-800 border-gray-700 ${curriculum.isCompleted ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{curriculum.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">{curriculum.subject}</Badge>
                    <Badge variant="outline" className="text-xs">{curriculum.duration} min</Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white p-1"
                    onClick={() => setEditingId(curriculum.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 p-1"
                    onClick={() => handleDeleteCurriculum(curriculum.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">{curriculum.description}</p>
              <Button
                onClick={() => handleToggleComplete(curriculum.id)}
                className={`w-full ${
                  curriculum.isCompleted 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {curriculum.isCompleted ? 'Completed ✓' : 'Mark Complete'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CurriculumManager;

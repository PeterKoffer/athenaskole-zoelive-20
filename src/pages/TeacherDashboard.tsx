
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react";
import SubjectWeighting from "@/components/teacher/SubjectWeighting";
import { useState, useEffect } from "react";
import CurriculumEditorModal from "@/components/curriculum/CurriculumEditorModal";

const TeacherDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Create mock subjects data instead of fetching from file
    const mockSubjects = [
      {
        id: '1',
        name: 'Mathematics',
        description: 'Core mathematical concepts and problem solving',
        weight: 25
      },
      {
        id: '2', 
        name: 'Science',
        description: 'Scientific inquiry and understanding',
        weight: 25
      },
      {
        id: '3',
        name: 'English Language Arts',
        description: 'Reading, writing, and communication skills',
        weight: 25
      },
      {
        id: '4',
        name: 'Social Studies',
        description: 'History, geography, and civic understanding',
        weight: 25
      }
    ];
    
    setSubjects(mockSubjects);
  }, []);

  const handleSaveWeights = (weights) => {
    // TODO: Save the weights to the database.
    console.log("Saving weights:", weights);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your classes and student progress
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                My Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your assigned classes and students.
              </p>
              <CurriculumEditorModal />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Lesson Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and manage your lesson plans and materials.
              </p>
              <CurriculumEditorModal />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                Student Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track individual student performance and growth.
              </p>
              <Button className="w-full">View Progress</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View your teaching schedule and upcoming events.
              </p>
              <Button className="w-full">View Schedule</Button>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <SubjectWeighting subjects={subjects} onSave={handleSaveWeights} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Target, Users } from 'lucide-react';

export default function MathematicsLearning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mathematics Learning</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore mathematical concepts through interactive lessons and engaging activities
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                Solve math problems tailored to your level
              </p>
              <Button className="w-full">
                Start Practice
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Interactive Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                Learn with step-by-step guided lessons
              </p>
              <Button className="w-full" variant="outline">
                Browse Lessons
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                Collaborate with peers on math challenges
              </p>
              <Button className="w-full" variant="outline">
                Join Group
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Mathematical Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Algebra', 'Geometry', 'Calculus', 'Statistics',
                'Trigonometry', 'Number Theory', 'Probability', 'Linear Algebra'
              ].map((topic, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-800">{topic}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, Calendar, Download } from 'lucide-react';

const SchoolAnalyticsPage = () => {
  const navigate = useNavigate();

  // Mock analytics data
  const stats = [
    { title: "Total Students", value: "486", change: "+12", icon: Users, color: "text-blue-600" },
    { title: "Average Performance", value: "87%", change: "+3.2%", icon: TrendingUp, color: "text-green-600" },
    { title: "Active Classes", value: "24", change: "+2", icon: BookOpen, color: "text-purple-600" },
    { title: "Monthly Sessions", value: "1,247", change: "+156", icon: Calendar, color: "text-orange-600" },
  ];

  const subjectPerformance = [
    { subject: "Mathematics", average: 85, trend: "up" },
    { subject: "English", average: 89, trend: "up" },
    { subject: "Science", average: 82, trend: "down" },
    { subject: "History", average: 88, trend: "up" },
    { subject: "Art", average: 92, trend: "up" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/school-dashboard')}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">School Analytics</h1>
              <p className="text-muted-foreground">View school performance metrics and reports</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Subject Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{subject.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{subject.average}%</span>
                          <TrendingUp className={`w-4 h-4 ${subject.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${subject.average}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">New student enrollment</p>
                    <p className="text-sm text-muted-foreground">Emma Nielsen joined class 3.A</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Performance milestone</p>
                    <p className="text-sm text-muted-foreground">Class 2.B achieved 90% average</p>
                  </div>
                  <span className="text-sm text-muted-foreground">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Teacher assignment</p>
                    <p className="text-sm text-muted-foreground">Mr. Anderson assigned to new class</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Curriculum update</p>
                    <p className="text-sm text-muted-foreground">Math curriculum revised for grade 4</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolAnalyticsPage;

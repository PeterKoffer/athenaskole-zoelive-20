import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Save, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildDailyLesson } from '@/services/lesson/buildDailyLesson';

interface LessonPlan {
  id: string;
  plan_date: string;
  lesson_data: any;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export default function TeacherPlanning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 60,
    activities: [] as any[]
  });

  const orgId = 'school-1'; // This should come from user context
  const classId = 'class-1'; // This should come from user context

  // Fetch lesson plans for the selected month
  useEffect(() => {
    if (!user) return;
    
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    
    fetchLessonPlans(startOfMonth, endOfMonth);
  }, [user, selectedDate]);

  const fetchLessonPlans = async (start: Date, end: Date) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('org_id', orgId)
        .gte('plan_date', start.toISOString().split('T')[0])
        .lte('plan_date', end.toISOString().split('T')[0])
        .order('plan_date');

      if (error) throw error;
      setLessonPlans(data || []);
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const planForDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return lessonPlans.find(plan => plan.plan_date === dateStr);
  }, [selectedDate, lessonPlans]);

  const generateLesson = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      const gradeBand = grade <= 2 ? "K-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : grade <= 10 ? "9-10" : "11-12";
      
      const lesson = await buildDailyLesson({
        userId: user.id,
        gradeBand,
        minutes: 60,
        dateISO: selectedDate.toISOString().split('T')[0]
      });

      setFormData({
        title: lesson.hero?.title || 'Generated Lesson',
        subject: lesson.hero?.subject || 'General',
        description: lesson.hero?.subtitle || '',
        duration: lesson.hero?.minutes || 60,
        activities: lesson.activities || []
      });
      
      setShowModal(true);
    } catch (error) {
      console.error('Error generating lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLessonPlan = async () => {
    if (!user) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const lessonData = {
      hero: {
        title: formData.title,
        subject: formData.subject,
        subtitle: formData.description,
        minutes: formData.duration
      },
      activities: formData.activities
    };

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('lesson_plans')
          .update({ lesson_data: lessonData })
          .eq('id', editingPlan.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lesson_plans')
          .insert({
            teacher_id: user.id,
            org_id: orgId,
            class_id: classId,
            plan_date: dateStr,
            lesson_data: lessonData,
            status: 'draft'
          });
        
        if (error) throw error;
      }

      setShowModal(false);
      setEditingPlan(null);
      
      // Refresh plans
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      fetchLessonPlans(startOfMonth, endOfMonth);
    } catch (error) {
      console.error('Error saving lesson plan:', error);
    }
  };

  const publishPlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update({ status: 'published' })
        .eq('id', planId);
      
      if (error) throw error;
      
      // Refresh plans
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      fetchLessonPlans(startOfMonth, endOfMonth);
    } catch (error) {
      console.error('Error publishing plan:', error);
    }
  };

  const editPlan = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.lesson_data.hero?.title || '',
      subject: plan.lesson_data.hero?.subject || '',
      description: plan.lesson_data.hero?.subtitle || '',
      duration: plan.lesson_data.hero?.minutes || 60,
      activities: plan.lesson_data.activities || []
    });
    setShowModal(true);
  };

  const hasPlansOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return lessonPlans.some(plan => plan.plan_date === dateStr);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Daily Program
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Teacher Planning</h1>
              <p className="text-muted-foreground">Plan and schedule lessons for your class</p>
            </div>
          </div>
          <Button onClick={() => navigate('/calendar')} variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Full Calendar View
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{
                  hasPlans: hasPlansOnDate
                }}
                modifiersStyles={{
                  hasPlans: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
                }}
                className="rounded-md border"
              />
              <div className="mt-4 text-sm text-muted-foreground">
                Dates with lessons are highlighted
              </div>
            </CardContent>
          </Card>

          {/* Lesson for Selected Date */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lesson for {selectedDate.toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Button onClick={generateLesson} disabled={loading} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Generate Lesson
                  </Button>
                  {!planForDate && (
                    <Button onClick={() => setShowModal(true)} variant="outline" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Manual
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : planForDate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{planForDate.lesson_data.hero?.title}</h3>
                      <p className="text-muted-foreground">{planForDate.lesson_data.hero?.subject} • {planForDate.lesson_data.hero?.minutes} minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={planForDate.status === 'published' ? 'default' : 'secondary'}>
                        {planForDate.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => editPlan(planForDate)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {planForDate.status === 'draft' && (
                        <Button size="sm" onClick={() => publishPlan(planForDate.id)}>
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {planForDate.lesson_data.hero?.subtitle && (
                    <p className="text-sm">{planForDate.lesson_data.hero.subtitle}</p>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Activities ({planForDate.lesson_data.activities?.length || 0})</h4>
                    <div className="space-y-2">
                      {planForDate.lesson_data.activities?.slice(0, 3).map((activity: any, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">{activity.title || activity.name || `Activity ${index + 1}`}</p>
                          <p className="text-sm text-muted-foreground">{activity.description || activity.content}</p>
                        </div>
                      ))}
                      {(planForDate.lesson_data.activities?.length || 0) > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{(planForDate.lesson_data.activities?.length || 0) - 3} more activities
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No lesson planned for this date</p>
                  <p className="text-sm text-muted-foreground">Click "Generate Lesson" to create an AI-powered lesson or "Create Manual" to build your own</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Planning Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Lesson Plan' : 'Create Lesson Plan'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Lesson description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                min={15}
                max={180}
              />
            </div>
            
            {formData.activities.length > 0 && (
              <div>
                <label className="text-sm font-medium">Activities</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      <p className="font-medium">{activity.title || activity.name || `Activity ${index + 1}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveLessonPlan} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
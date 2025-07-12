import React, { useState, useEffect } from 'react';
import { preferencesService, SchoolPreferences, TeacherPreferences, SubjectWeights } from '../services/PreferencesService';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

const PreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const [schoolPreferences, setSchoolPreferences] = useState<SchoolPreferences | null>(null);
  const [teacherPreferences, setTeacherPreferences] = useState<TeacherPreferences | null>(null);

  useEffect(() => {
    console.log('User:', user);
    if (user) {
      const schoolId = user.id; // Placeholder
      console.log('Fetching preferences for school:', schoolId, 'and user:', user.id);
      preferencesService.getSchoolPreferences(schoolId).then(prefs => {
        console.log('School prefs from service:', prefs);
        if (!prefs) {
          setSchoolPreferences({ school_id: schoolId, subject_weights: {} });
        } else {
          setSchoolPreferences(prefs);
        }
      });
      preferencesService.getTeacherPreferences(user.id).then(prefs => {
        console.log('Teacher prefs from service:', prefs);
        if (!prefs) {
          setTeacherPreferences({ teacher_id: user.id, school_id: schoolId, subject_weights: {} });
        } else {
          setTeacherPreferences(prefs);
        }
      });
    }
  }, [user]);

  const handleSchoolWeightChange = (subject: NELIESubject, value: number) => {
    if (schoolPreferences) {
      const newWeights = { ...schoolPreferences.subject_weights, [subject]: value };
      setSchoolPreferences({ ...schoolPreferences, subject_weights: newWeights });
    }
  };

  const handleTeacherWeightChange = (subject: NELIESubject, value: number) => {
    if (teacherPreferences) {
      const newWeights = { ...teacherPreferences.subject_weights, [subject]: value };
      setTeacherPreferences({ ...teacherPreferences, subject_weights: newWeights });
    }
  };

  const saveSchoolPreferences = () => {
    if(schoolPreferences) {
      preferencesService.updateSchoolPreferences(schoolPreferences);
    }
  }

  const saveTeacherPreferences = () => {
    if(teacherPreferences) {
      preferencesService.updateTeacherPreferences(teacherPreferences);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Curriculum Preferences</h1>

      {/* School Preferences */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>School-wide Subject Weights</CardTitle>
        </CardHeader>
        <CardContent>
          {schoolPreferences && Object.values(NELIESubject).map(subject => (
            <div key={subject} className="mb-4">
              <label>{subject}</label>
              <Slider
                value={[schoolPreferences.subject_weights[subject] || 50]}
                onValueChange={(value) => handleSchoolWeightChange(subject, value[0])}
              />
            </div>
          ))}
          <Button onClick={saveSchoolPreferences}>Save School Preferences</Button>
        </CardContent>
      </Card>

      {/* Teacher Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Your Teacher Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          {teacherPreferences && Object.values(NELIESubject).map(subject => (
            <div key={subject} className="mb-4">
              <label>{subject}</label>
              <Slider
                value={[teacherPreferences.subject_weights[subject] || 50]}
                onValueChange={(value) => handleTeacherWeightChange(subject, value[0])}
              />
            </div>
          ))}
           <Button onClick={saveTeacherPreferences}>Save Teacher Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesPage;

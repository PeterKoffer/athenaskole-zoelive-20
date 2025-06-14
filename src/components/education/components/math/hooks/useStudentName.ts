
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useStudentName = () => {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    const fetchStudentName = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();

        if (profile?.name) {
          setStudentName(profile.name.split(' ')[0]); // Use first name
        } else if (user.user_metadata?.name) {
          setStudentName(user.user_metadata.name.split(' ')[0]);
        }
      } catch (error) {
        console.log('Could not fetch student name, using default');
        if (user.user_metadata?.name) {
          setStudentName(user.user_metadata.name.split(' ')[0]);
        }
      }
    };

    fetchStudentName();
  }, [user]);

  return studentName;
};

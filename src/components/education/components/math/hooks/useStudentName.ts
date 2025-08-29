
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth'; // Import UserMetadata
import { supabase } from '@/lib/supabaseClient';

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
          .maybeSingle();

        if (profile?.name) {
          setStudentName(profile.name.split(' ')[0]); // Use first name
        } else if ((user?.user_metadata as UserMetadata)?.name) {
          setStudentName((user.user_metadata as UserMetadata).name!.split(' ')[0]);
        } else if ((user?.user_metadata as UserMetadata)?.first_name) {
          setStudentName((user.user_metadata as UserMetadata).first_name!);
        }
      } catch (error) {
        console.log('Could not fetch student name, using default', error);
        const metadata = user?.user_metadata as UserMetadata | undefined;
        if (metadata?.name) {
          setStudentName(metadata.name.split(' ')[0]);
        } else if (metadata?.first_name) {
          setStudentName(metadata.first_name);
        }
      }
    };

    fetchStudentName();
  }, [user]);

  return studentName;
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth'; // Import UserMetadata
import { supabase } from '@/integrations/supabase/client';

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCard = ({ userName }: WelcomeCardProps) => {
  const { user } = useAuth();
  const [actualUserName, setActualUserName] = useState(userName);

  // Force English locale for date formatting
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fetch user's actual name from profile
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();

        if (profile?.name) {
          const firstName = profile.name.split(' ')[0];
          setActualUserName(firstName);
        } else if ((user?.user_metadata as UserMetadata)?.name) {
          const firstName = (user.user_metadata as UserMetadata).name!.split(' ')[0];
          setActualUserName(firstName);
        } else if ((user?.user_metadata as UserMetadata)?.first_name) {
          setActualUserName((user.user_metadata as UserMetadata).first_name!);
        }
      } catch (error) {
        console.log('Could not fetch user name, using provided userName or fallback from user_metadata', error);
        const metadata = user?.user_metadata as UserMetadata | undefined;
        if (metadata?.name) {
          const firstName = metadata.name.split(' ')[0];
          setActualUserName(firstName);
        } else if (metadata?.first_name) {
          setActualUserName(metadata.first_name);
        }
      }
    };

    fetchUserName();
  }, [user]);

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-3 text-white">
          <div className="text-4xl">🎓</div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Hi {actualUserName}! I'm Nelie</h1>
            <p className="text-purple-100 text-lg">{todaysDate}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <p className="text-xl mb-4 text-center leading-relaxed">
            Welcome to your personal AI tutor, {actualUserName}! I've prepared an exciting program for you today. 
            You can choose where to start, and I'll guide you through each activity.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-lg">Let's learn something amazing together, {actualUserName}!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;

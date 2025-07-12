
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const UserImpersonation = () => {
  const { user } = useAuth();
  const [targetUserId, setTargetUserId] = useState('');

  const handleImpersonate = async () => {
    if (!targetUserId) {
      toast({
        title: 'Error',
        description: 'Please enter a user ID to impersonate.',
        variant: 'destructive',
      });
      return;
    }

    if (user?.role !== 'admin' && user?.role !== 'school_leader') {
      toast({
        title: 'Error',
        description: 'You do not have permission to impersonate users.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signIn({
        id: targetUserId,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Successfully impersonating user ${targetUserId}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">User Impersonation</h3>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter User ID"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        />
        <Button onClick={handleImpersonate}>Impersonate</Button>
      </div>
    </div>
  );
};

export default UserImpersonation;

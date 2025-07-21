import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const RoleSwitcher = () => {
  const { user, updateUserRole } = useAuth();
  const { userRole } = useRoleAccess();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>(userRole || 'student');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleUpdate = async () => {
    if (!selectedRole || selectedRole === userRole) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserRole(selectedRole);
      toast({
        title: "Role Updated",
        description: `Your role has been changed to ${selectedRole}. Please refresh the page.`,
      });
      
      // Refresh the page to ensure all components pick up the new role
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Role Switcher</CardTitle>
        <CardDescription>
          Change your role to access different parts of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Current Role: <span className="font-semibold">{userRole}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Email: {user.email}
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select New Role:</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="school_staff">School Staff</SelectItem>
              <SelectItem value="school_leader">School Leader</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleRoleUpdate}
          disabled={isUpdating || selectedRole === userRole}
          className="w-full"
        >
          {isUpdating ? 'Updating...' : 'Update Role'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
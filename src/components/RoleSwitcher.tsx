import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const RoleSwitcher = () => {
  const { user } = useAuth();
  const { userRole, setUserRoleManually } = useRoleAccess();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>(userRole || 'student');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleUpdate = () => {
    if (!selectedRole || selectedRole === userRole) {
      return;
    }

    setIsUpdating(true);
    try {
      setUserRoleManually(selectedRole as any);
      toast({
        title: "Role Updated Successfully!",
        description: `You are now temporarily viewing as a ${selectedRole}. Redirecting...`,
      });
      
      // Wait a bit, then redirect to the appropriate dashboard
      setTimeout(() => {
        const targetPaths: Record<string, string> = {
          'admin': '/school-dashboard',
          'school_leader': '/school-dashboard', 
          'school_staff': '/school-dashboard',
          'teacher': '/teacher-dashboard',
          'parent': '/parent-dashboard',
          'student': '/'
        };
        
        const targetPath = targetPaths[selectedRole] || '/';
        window.location.href = targetPath; // Force full page navigation
      }, 1500);
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
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="student" className="text-foreground hover:bg-accent">Student</SelectItem>
              <SelectItem value="teacher" className="text-foreground hover:bg-accent">Teacher</SelectItem>
              <SelectItem value="parent" className="text-foreground hover:bg-accent">Parent</SelectItem>
              <SelectItem value="school_staff" className="text-foreground hover:bg-accent">School Staff</SelectItem>
              <SelectItem value="school_leader" className="text-foreground hover:bg-accent">School Leader</SelectItem>
              <SelectItem value="admin" className="text-foreground hover:bg-accent">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleRoleUpdate}
          disabled={isUpdating || selectedRole === userRole}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update Role'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
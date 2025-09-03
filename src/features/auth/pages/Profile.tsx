
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Users } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { userRole, setUserRoleManually } = useRoleAccess();

  console.log('Profile page render:', { user: user?.email, userRole, loading });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRoleChange = () => {
    console.log('Switching to role selector');
    setUserRoleManually('student'); // Temporary to trigger the flow
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Not Signed In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">Please sign in to view your profile</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/auth')} className="w-full bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and role</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Current Role</label>
                  <p className="text-white">{userRole || 'No role assigned'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">User ID</label>
                  <p className="text-white text-xs font-mono">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleRoleChange}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Change Role / Switch User
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-700"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

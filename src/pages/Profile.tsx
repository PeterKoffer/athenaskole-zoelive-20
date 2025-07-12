
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Not Signed In</h2>
              <p className="text-gray-400 mb-6">Please sign in to view your profile.</p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:opacity-90"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            Sign Out
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Your account information</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium">Email</label>
                <p className="text-white text-lg">{user.email}</p>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium">User ID</label>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium">Account Created</label>
                <p className="text-white">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              
              {user.user_metadata?.role && (
                <div>
                  <label className="text-gray-300 text-sm font-medium">Role</label>
                  <p className="text-white capitalize">{user.user_metadata.role}</p>
                </div>
              )}
              
              {user.user_metadata?.name && (
                <div>
                  <label className="text-gray-300 text-sm font-medium">Name</label>
                  <p className="text-white">{user.user_metadata.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/preferences')}
                className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white"
              >
                Manage Preferences
              </Button>
              
              <Button 
                onClick={() => navigate('/daily-universe')}
                className="w-full justify-start bg-gradient-to-r from-purple-400 to-cyan-400 hover:opacity-90"
              >
                Go to Learning Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

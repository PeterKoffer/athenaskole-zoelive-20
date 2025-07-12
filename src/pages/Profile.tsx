
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Settings } from 'lucide-react';

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Profile page - User:', user?.email, 'Loading:', loading);

  const handleSignOut = async () => {
    try {
      console.log('Signing out user');
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {user && (
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Sign Out
            </Button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400 text-lg">Manage your account and preferences</p>
        </div>

        {/* Content */}
        {!user ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Not Signed In</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Please sign in to view and manage your profile.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Account Information Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium flex items-center mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <p className="text-white text-lg bg-gray-700 p-3 rounded">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member Since
                    </label>
                    <p className="text-white text-lg bg-gray-700 p-3 rounded">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">User ID</label>
                  <p className="text-gray-400 font-mono text-sm bg-gray-700 p-3 rounded break-all">{user.id}</p>
                </div>
                
                {user.user_metadata?.name && (
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Display Name</label>
                    <p className="text-white text-lg bg-gray-700 p-3 rounded">{user.user_metadata.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Settings className="w-6 h-6 mr-3" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => navigate('/preferences')}
                  className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white h-12 text-lg"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Manage Preferences
                </Button>
                
                <Button 
                  onClick={() => navigate('/daily-universe')}
                  className="w-full justify-start bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white h-12 text-lg"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Go to Learning Dashboard
                </Button>

                <Button 
                  onClick={() => navigate('/math')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                >
                  <Calculator className="w-5 h-5 mr-3" />
                  Practice Math
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Database, Eye, CheckCircle, XCircle } from 'lucide-react';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { supabase } from '@/lib/supabaseClient';

const UserVerificationDebug: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [kcMasteryData, setKcMasteryData] = useState<any[]>([]);
  const [rawProfileData, setRawProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching data for user:', user.id, user.email);
      
      // 1. Check raw profile table data
      console.log('📊 Checking raw profiles table...');
      const { data: rawProfile, error: rawProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (rawProfileError && rawProfileError.code !== 'PGRST116') {
        console.error('❌ Raw profile error:', rawProfileError);
      } else {
        console.log('✅ Raw profile data:', rawProfile);
        setRawProfileData(rawProfile);
      }

      // 2. Check KC mastery table data
      console.log('📊 Checking knowledge_component_mastery table...');
      const { data: kcData, error: kcError } = await supabase
        .from('knowledge_component_mastery')
        .select('*')
        .eq('user_id', user.id);

      if (kcError) {
        console.error('❌ KC mastery error:', kcError);
      } else {
        console.log('✅ KC mastery data:', kcData);
        setKcMasteryData(kcData || []);
      }

      // 3. Use SupabaseProfileService to get processed data
      console.log('📊 Using SupabaseProfileService...');
      const profileService = new SupabaseProfileService();
      const processedProfile = await profileService.getProfile(user.id);
      
      console.log('✅ Processed profile data:', processedProfile);
      setProfileData(processedProfile);

    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🆕 Creating initial profile for user:', user.id);
      const profileService = new SupabaseProfileService();
      const newProfile = await profileService.createInitialProfile(user.id);
      console.log('✅ Initial profile created:', newProfile);
      
      // Refresh data
      await fetchUserData();
    } catch (err) {
      console.error('❌ Error creating initial profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return (
      <Card className="bg-red-900/30 border-red-700/50">
        <CardContent className="p-4">
          <p className="text-red-200">❌ No user logged in. Please sign in first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <Card className="bg-blue-900/30 border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-blue-200 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Logged In User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>User ID:</strong> {user.id}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Created:</strong> {user.created_at}</div>
          <div><strong>Role:</strong> {user.user_metadata?.role || 'None'}</div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex space-x-4">
        <Button 
          onClick={fetchUserData} 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
        
        {!rawProfileData && (
          <Button 
            onClick={createInitialProfile} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Database className="w-4 h-4 mr-2" />
            Create Initial Profile
          </Button>
        )}
      </div>

      {error && (
        <Card className="bg-red-900/30 border-red-700/50">
          <CardContent className="p-4">
            <p className="text-red-200">❌ Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Raw Profile Data */}
      <Card className="bg-gray-800/50 border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-gray-200 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Raw Profile Table Data
            {rawProfileData ? (
              <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 ml-2 text-red-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rawProfileData ? (
            <pre className="text-sm bg-gray-900 p-4 rounded overflow-x-auto">
              {JSON.stringify(rawProfileData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-400">No profile data found in database</p>
          )}
        </CardContent>
      </Card>

      {/* KC Mastery Data */}
      <Card className="bg-gray-800/50 border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-gray-200 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Knowledge Component Mastery Data
            <Badge className="ml-2" variant="secondary">
              {kcMasteryData.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kcMasteryData.length > 0 ? (
            <div className="space-y-4">
              {kcMasteryData.map((kc, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-cyan-400">{kc.kc_id}</strong>
                    <Badge variant={kc.mastery_level > 0.7 ? "default" : "secondary"}>
                      {Math.round(kc.mastery_level * 100)}% mastery
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>Attempts: {kc.attempts} | Correct: {kc.correct_attempts}</div>
                    <div>Last Attempt: {kc.last_attempt_timestamp || 'Never'}</div>
                    <div>History entries: {Array.isArray(kc.history) ? kc.history.length : 0}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No KC mastery data found</p>
          )}
        </CardContent>
      </Card>

      {/* Processed Profile Data */}
      <Card className="bg-gray-800/50 border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-gray-200 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Processed Profile (via Service)
            {profileData ? (
              <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 ml-2 text-red-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileData ? (
            <pre className="text-sm bg-gray-900 p-4 rounded overflow-x-auto">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-400">No processed profile data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserVerificationDebug;


import { useUserProfileContext } from '@/contexts/UserProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

const ProfilePage = () => {
  const { profile, loading, error, updateProfile } = useUserProfileContext();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      name: formData.get('name') as string,
      role: formData.get('role') as UserRole,
    };
    updateProfile(updates);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-gray-300">Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-gray-300">Email</label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={profile.email}
                  disabled
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="role" className="text-gray-300">Role</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={profile.role}
                  className="w-full p-2 bg-gray-700 text-white border-gray-600 rounded"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

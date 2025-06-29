
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { learnerProfileService } from '@/services/learnerProfileService'; // Assuming named export

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  // Set initial language from profile
  useEffect(() => {
    if (user && !authLoading) {
      learnerProfileService.getProfile(user.id).then(profile => {
        if (profile.preferences?.preferredLanguage && profile.preferences.preferredLanguage !== i18n.language) {
          i18n.changeLanguage(profile.preferences.preferredLanguage);
        }
      }).catch(error => {
        console.error("LanguageSwitcher: Error fetching profile for initial language", error);
      });
    }
  }, [user, authLoading, i18n]);

  const handleChange = async (lng: string) => {
    await i18n.changeLanguage(lng);
    if (user) {
      try {
        // Optimistically update UI, then save to backend
        const currentProfile = await learnerProfileService.getProfile(user.id);
        const updatedPreferences = {
          ...currentProfile.preferences,
          preferredLanguage: lng,
        };
        await learnerProfileService.updatePreferences(user.id, updatedPreferences);
      } catch (error) {
        console.error("LanguageSwitcher: Error updating language preference in profile", error);
        // Optionally, revert i18n language change if profile update fails, or notify user
      }
    }
  };

  // Do not render the switcher if auth is still loading or user is not available
  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-3">
      <Button variant="outline" size="sm" onClick={() => handleChange('en')}>
        English
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleChange('es')}>
        Español
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleChange('da')}>
        Dansk
      </Button>
    </div>
  );
};

export default LanguageSwitcher;

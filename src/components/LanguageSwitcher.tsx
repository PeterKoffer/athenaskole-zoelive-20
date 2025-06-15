
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 mb-3">
      <Button variant="outline" size="sm" onClick={() => handleChange('en')}>
        English
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleChange('es')}>
        Español
      </Button>
    </div>
  );
};

export default LanguageSwitcher;

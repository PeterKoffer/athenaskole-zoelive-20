
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (lng: string) => {
    console.log(`🌍 Switching language to: ${lng}`);
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'da', label: 'Dansk' }
  ];

  return (
    <div className="flex gap-2 mb-3">
      {languages.map((language) => (
        <Button 
          key={language.code}
          variant={i18n.language === language.code ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleChange(language.code)}
          className={`
            min-w-[80px] font-medium transition-colors
            ${i18n.language === language.code 
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
              : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300 hover:border-gray-400'
            }
          `}
        >
          {language.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

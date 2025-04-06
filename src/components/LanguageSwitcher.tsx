import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'rw' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
    >
      <Languages className="h-5 w-5" />
      <span>{i18n.language === 'en' ? 'Kinyarwanda' : 'English'}</span>
    </button>
  );
};

export default LanguageSwitcher;
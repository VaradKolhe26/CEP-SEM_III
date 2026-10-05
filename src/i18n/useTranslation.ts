import { useApp } from '../context/AppContext';
import { translations, TranslationKey, languageOptions } from './translations';
import { Language } from '../types';

export const useTranslation = () => {
  const { language, setLanguage } = useApp();

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    const currentLangDict = translations[language] || translations.en;
    let text = (currentLangDict[key] || translations.en[key] || key) as string;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  const currentLanguageOption =
    languageOptions.find((opt) => opt.code === language) || languageOptions[0];

  return {
    t,
    language,
    setLanguage,
    languageOptions,
    currentLanguageOption,
  };
};

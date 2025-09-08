// Language configuration entry file
import en from './en.js';
import zh from './zh.js';

const translations = {
  en,
  zh
};

// Export available language list
export const availableLanguages = ['en', 'zh'];

// Default language
export const defaultLanguage = 'en';

// Utility function to get translation text
export function getTranslations(language) {
  return translations[language] || translations[defaultLanguage];
}

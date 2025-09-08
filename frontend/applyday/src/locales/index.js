// 语言配置入口文件
import { en } from './en.js';
import { zh } from './zh.js';

export const translations = {
  en,
  zh
};

// 导出可用的语言列表
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// 获取翻译文本的工具函数
export const getTranslations = (languageCode) => {
  return translations[languageCode] || translations.en;
};

// 默认语言
export const defaultLanguage = 'en';

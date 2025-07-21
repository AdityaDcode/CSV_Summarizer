export const supportedLanguages = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'kannada', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'marathi', name: 'मराठी', flag: '🇮🇳' }
] as const;

export type LanguageCode = typeof supportedLanguages[number]['code'];
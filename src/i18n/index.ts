import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ko } from './ko';
import { en } from './en';
import { languages } from './languages';

// 기본 번역 (한국어)
const defaultTranslation = ko;

// 리소스 객체 생성 - 모든 언어에 대해 기본 번역을 사용
const resources: { [key: string]: { translation: typeof ko } } = {};

// 모든 언어에 대해 기본 번역을 할당
languages.forEach(lang => {
  resources[lang.code] = {
    translation: lang.code === 'ko' ? ko : en // 한국어가 아니면 영어 사용
  };
});

// i18n 초기화
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: true, // 개발 시에만 true로 설정
    interpolation: {
      escapeValue: false, // React에서는 이미 XSS 방지가 되어있음
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false, // React 18+ 호환성을 위해 false로 설정
    }
  });

export default i18n;

// 언어 변경 함수
export const changeLanguage = async (language: string) => {
  try {
    // 지원하는 언어인지 확인
    if (!isLanguageSupported(language)) {
      console.warn(`Language ${language} is not supported, falling back to Korean`);
      language = 'ko';
    }
    
    await i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    return true;
  } catch (error) {
    console.error('Language change failed:', error);
    return false;
  }
};

// 현재 언어 가져오기
export const getCurrentLanguage = (): string => {
  return i18n.language || 'ko';
};

// 지원하는 언어 목록
export const supportedLanguages = languages.map(lang => lang.code);

// 언어가 지원되는지 확인
export const isLanguageSupported = (language: string): boolean => {
  return supportedLanguages.includes(language);
}; 
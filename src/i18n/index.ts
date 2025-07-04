import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 모든 언어 파일 import
import ko from './ko';
import en from './en';
import fr from './fr';
import es from './es';
import ja from './ja';
import zh from './zh';
import de from './de';
import it from './it';
import pt from './pt';
import ru from './ru';
import ar from './ar';
import hi from './hi';
import th from './th';
import vi from './vi';
import id from './id';
import ms from './ms';
import tr from './tr';
import pl from './pl';
import nl from './nl';
import sv from './sv';

import { languages } from './languages';

// 언어별 번역 리소스 매핑
const translationResources = {
  ko,
  en,
  fr,
  es,
  ja,
  zh,
  de,
  it,
  pt,
  ru,
  ar,
  hi,
  th,
  vi,
  id,
  ms,
  tr,
  pl,
  nl,
  sv,
};

// 리소스 객체 생성
const resources: { [key: string]: { translation: typeof ko } } = {};

// 모든 언어에 대해 실제 번역을 할당
languages.forEach(lang => {
  const translation = translationResources[lang.code as keyof typeof translationResources];
  if (translation) {
    resources[lang.code] = {
      translation
    };
  } else {
    // 번역이 없는 경우 영어를 fallback으로 사용
    console.warn(`Translation for ${lang.code} not found, using English as fallback`);
    resources[lang.code] = {
      translation: en
    };
  }
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
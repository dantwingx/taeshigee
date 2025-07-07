/**
 * 애플리케이션 전역 상수 정의
 */

// UI 관련 상수
export const UI_CONSTANTS = {
  // Toast 메시지 지속 시간 (밀리초)
  TOAST_DURATION: 5000,
  
  // 최대 태그 개수
  MAX_TAGS_PER_TASK: 10,
  
  // 태그 이름 최대 길이
  MAX_TAG_NAME_LENGTH: 50,
  
  // 태스크 제목 최대 길이
  MAX_TASK_TITLE_LENGTH: 255,
  
  // 태스크 설명 최대 길이
  MAX_TASK_DESCRIPTION_LENGTH: 1000,
  
  // 사용자 이름 최대 길이
  MAX_USER_NAME_LENGTH: 100,
  
  // 이메일 최대 길이
  MAX_EMAIL_LENGTH: 255,
  
  // 카테고리 최대 길이
  MAX_CATEGORY_LENGTH: 100,
} as const

// API 관련 상수
export const API_CONSTANTS = {
  // API 요청 타임아웃 (밀리초)
  REQUEST_TIMEOUT: 10000,
  
  // 재시도 횟수
  MAX_RETRY_COUNT: 3,
  
  // 캐시 유효 시간 (밀리초)
  CACHE_DURATION: 5 * 60 * 1000, // 5분
} as const

// 페이지네이션 관련 상수
export const PAGINATION_CONSTANTS = {
  // 기본 페이지 크기
  DEFAULT_PAGE_SIZE: 20,
  
  // 최대 페이지 크기
  MAX_PAGE_SIZE: 100,
  
  // 무한스크롤 임계값
  INFINITE_SCROLL_THRESHOLD: 100,
} as const

// 검색/필터 관련 상수
export const SEARCH_CONSTANTS = {
  // 검색어 최소 길이
  MIN_SEARCH_LENGTH: 1,
  
  // 검색어 최대 길이
  MAX_SEARCH_LENGTH: 100,
  
  // 검색 지연 시간 (밀리초)
  SEARCH_DEBOUNCE_DELAY: 300,
} as const

// 날짜/시간 관련 상수
export const DATE_CONSTANTS = {
  // 상대적 시간 표시 임계값 (일)
  RELATIVE_TIME_THRESHOLD: 7,
  
  // 날짜 포맷
  DATE_FORMAT: 'YYYY-MM-DD',
  
  // 시간 포맷
  TIME_FORMAT: 'HH:mm',
  
  // 날짜시간 포맷
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
} as const

// 애니메이션 관련 상수
export const ANIMATION_CONSTANTS = {
  // 기본 애니메이션 지속 시간 (밀리초)
  DEFAULT_DURATION: 200,
  
  // 빠른 애니메이션 지속 시간 (밀리초)
  FAST_DURATION: 150,
  
  // 느린 애니메이션 지속 시간 (밀리초)
  SLOW_DURATION: 300,
} as const

// 파일 업로드 관련 상수
export const FILE_CONSTANTS = {
  // 최대 파일 크기 (바이트)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // 허용된 파일 타입
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // 최대 파일 개수
  MAX_FILE_COUNT: 10,
} as const

// 보안 관련 상수
export const SECURITY_CONSTANTS = {
  // 비밀번호 최소 길이
  MIN_PASSWORD_LENGTH: 8,
  
  // 비밀번호 최대 길이
  MAX_PASSWORD_LENGTH: 128,
  
  // 세션 만료 시간 (밀리초)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24시간
  
  // 로그인 시도 제한 횟수
  MAX_LOGIN_ATTEMPTS: 5,
  
  // 로그인 시도 제한 시간 (밀리초)
  LOGIN_ATTEMPT_TIMEOUT: 15 * 60 * 1000, // 15분
} as const

// 성능 관련 상수
export const PERFORMANCE_CONSTANTS = {
  // 이미지 지연 로딩 임계값
  LAZY_LOAD_THRESHOLD: 0.1,
  
  // 가상화 아이템 높이
  VIRTUAL_ITEM_HEIGHT: 80,
  
  // 가상화 버퍼 크기
  VIRTUAL_BUFFER_SIZE: 5,
} as const 
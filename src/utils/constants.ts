/**
 * 애플리케이션 전역 상수 정의
 */

import { TaskTemplate, EmojiCategory } from '@/types/task'

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

// 표준 태스크 템플릿
export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'diet-3days',
    name: 'templateExamples.diet3days.name',
    emoji: '🥗',
    title: 'templateExamples.diet3days.title',
    description: 'templateExamples.diet3days.description',
    tags: [
      'templateExamples.diet3days.tags.0',
      'templateExamples.diet3days.tags.1',
      'templateExamples.diet3days.tags.2'
    ],
    duration: 3,
    category: 'health',
    isPopular: true,
    autoSettings: {
      category: 'health',
      importance: 'high',
      priority: 'high',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '09:00'
    }
  },
  {
    id: 'diet-week',
    name: 'templateExamples.dietWeek.name',
    emoji: '💪',
    title: 'templateExamples.dietWeek.title',
    description: 'templateExamples.dietWeek.description',
    tags: [
      'templateExamples.dietWeek.tags.0',
      'templateExamples.dietWeek.tags.1',
      'templateExamples.dietWeek.tags.2'
    ],
    duration: 7,
    category: 'health',
    isPopular: true,
    autoSettings: {
      category: 'health',
      importance: 'high',
      priority: 'high',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '09:00'
    }
  },
  {
    id: 'diet-month',
    name: 'templateExamples.dietMonth.name',
    emoji: '🎯',
    title: 'templateExamples.dietMonth.title',
    description: 'templateExamples.dietMonth.description',
    tags: [
      'templateExamples.dietMonth.tags.0',
      'templateExamples.dietMonth.tags.1',
      'templateExamples.dietMonth.tags.2'
    ],
    duration: 30,
    category: 'health',
    isPopular: true,
    autoSettings: {
      category: 'health',
      importance: 'high',
      priority: 'medium',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '09:00'
    }
  },
  {
    id: 'exercise-daily',
    name: 'templateExamples.exerciseDaily.name',
    emoji: '🏃‍♂️',
    title: 'templateExamples.exerciseDaily.title',
    description: 'templateExamples.exerciseDaily.description',
    tags: [
      'templateExamples.exerciseDaily.tags.0',
      'templateExamples.exerciseDaily.tags.1',
      'templateExamples.exerciseDaily.tags.2'
    ],
    duration: 1,
    category: 'health',
    autoSettings: {
      category: 'health',
      importance: 'medium',
      priority: 'medium',
      isPublic: false,
      dueTime: '21:00',
      reminderTime: '18:00'
    }
  },
  {
    id: 'water-intake',
    name: 'templateExamples.waterIntake.name',
    emoji: '💧',
    title: 'templateExamples.waterIntake.title',
    description: 'templateExamples.waterIntake.description',
    tags: [
      'templateExamples.waterIntake.tags.0',
      'templateExamples.waterIntake.tags.1',
      'templateExamples.waterIntake.tags.2'
    ],
    duration: 1,
    category: 'health',
    autoSettings: {
      category: 'health',
      importance: 'medium',
      priority: 'low',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '10:00'
    }
  },
  {
    id: 'study-daily',
    name: 'templateExamples.studyDaily.name',
    emoji: '📚',
    title: 'templateExamples.studyDaily.title',
    description: 'templateExamples.studyDaily.description',
    tags: [
      'templateExamples.studyDaily.tags.0',
      'templateExamples.studyDaily.tags.1',
      'templateExamples.studyDaily.tags.2'
    ],
    duration: 1,
    category: 'study',
    autoSettings: {
      category: 'study',
      importance: 'high',
      priority: 'high',
      isPublic: false,
      dueTime: '23:00',
      reminderTime: '20:00'
    }
  },
  {
    id: 'language-study',
    name: 'templateExamples.languageStudy.name',
    emoji: '🌍',
    title: 'templateExamples.languageStudy.title',
    description: 'templateExamples.languageStudy.description',
    tags: [
      'templateExamples.languageStudy.tags.0',
      'templateExamples.languageStudy.tags.1',
      'templateExamples.languageStudy.tags.2'
    ],
    duration: 1,
    category: 'study',
    autoSettings: {
      category: 'study',
      importance: 'medium',
      priority: 'medium',
      isPublic: false,
      dueTime: '22:00',
      reminderTime: '19:00'
    }
  },
  {
    id: 'work-planning',
    name: 'templateExamples.workPlanning.name',
    emoji: '📋',
    title: 'templateExamples.workPlanning.title',
    description: 'templateExamples.workPlanning.description',
    tags: [
      'templateExamples.workPlanning.tags.0',
      'templateExamples.workPlanning.tags.1',
      'templateExamples.workPlanning.tags.2'
    ],
    duration: 1,
    category: 'work',
    autoSettings: {
      category: 'work',
      importance: 'high',
      priority: 'high',
      isPublic: false,
      dueTime: '18:00',
      reminderTime: '09:00'
    }
  },
  {
    id: 'skill-improvement',
    name: 'templateExamples.skillImprovement.name',
    emoji: '⚡',
    title: 'templateExamples.skillImprovement.title',
    description: 'templateExamples.skillImprovement.description',
    tags: [
      'templateExamples.skillImprovement.tags.0',
      'templateExamples.skillImprovement.tags.1',
      'templateExamples.skillImprovement.tags.2'
    ],
    duration: 7,
    category: 'work',
    autoSettings: {
      category: 'work',
      importance: 'high',
      priority: 'medium',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '20:00'
    }
  },
  {
    id: 'reading',
    name: 'templateExamples.reading.name',
    emoji: '📖',
    title: 'templateExamples.reading.title',
    description: 'templateExamples.reading.description',
    tags: [
      'templateExamples.reading.tags.0',
      'templateExamples.reading.tags.1',
      'templateExamples.reading.tags.2'
    ],
    duration: 1,
    category: 'hobby',
    autoSettings: {
      category: 'hobby',
      importance: 'medium',
      priority: 'low',
      isPublic: false,
      dueTime: '22:00',
      reminderTime: '21:00'
    }
  },
  {
    id: 'music-practice',
    name: 'templateExamples.musicPractice.name',
    emoji: '🎵',
    title: 'templateExamples.musicPractice.title',
    description: 'templateExamples.musicPractice.description',
    tags: [
      'templateExamples.musicPractice.tags.0',
      'templateExamples.musicPractice.tags.1',
      'templateExamples.musicPractice.tags.2'
    ],
    duration: 1,
    category: 'hobby',
    autoSettings: {
      category: 'hobby',
      importance: 'medium',
      priority: 'low',
      isPublic: false,
      dueTime: '21:00',
      reminderTime: '20:00'
    }
  },
  {
    id: 'early-sleep',
    name: 'templateExamples.earlySleep.name',
    emoji: '😴',
    title: 'templateExamples.earlySleep.title',
    description: 'templateExamples.earlySleep.description',
    tags: [
      'templateExamples.earlySleep.tags.0',
      'templateExamples.earlySleep.tags.1',
      'templateExamples.earlySleep.tags.2'
    ],
    duration: 1,
    category: 'daily',
    autoSettings: {
      category: 'daily',
      importance: 'medium',
      priority: 'medium',
      isPublic: false,
      dueTime: '23:00',
      reminderTime: '22:30'
    }
  },
  {
    id: 'gratitude',
    name: 'templateExamples.gratitude.name',
    emoji: '🙏',
    title: 'templateExamples.gratitude.title',
    description: 'templateExamples.gratitude.description',
    tags: [
      'templateExamples.gratitude.tags.0',
      'templateExamples.gratitude.tags.1',
      'templateExamples.gratitude.tags.2'
    ],
    duration: 1,
    category: 'daily',
    autoSettings: {
      category: 'daily',
      importance: 'low',
      priority: 'low',
      isPublic: false,
      dueTime: '23:59',
      reminderTime: '22:00'
    }
  }
]

// 이모지 카테고리
export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'faces',
    name: '얼굴',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠']
  },
  {
    id: 'animals',
    name: '동물',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔']
  },
  {
    id: 'food',
    name: '음식',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🍾', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂', '🥄', '🔪', '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂']
  },
  {
    id: 'activities',
    name: '활동',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵', '🎗', '🎫', '🎟', '🎪', '🤹‍♀️', '🤹', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟', '🎯', '🎳', '🎮', '🎰', '🧩', '🎨', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🎮', '🎰', '🧩', '🎨']
  },
  {
    id: 'objects',
    name: '물건',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🎮', '🎰', '🧩', '🎨', '🎭', '🎪', '🎟', '🎫', '🎗', '🏵', '🎖', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵', '🎗', '🎫', '🎟', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟', '🎯', '🎳', '🎮', '🎰', '🧩', '🎨', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🎮', '🎰', '🧩', '🎨', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🎮', '🎰', '🧩', '🎨', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🎮', '🎰', '🧩', '🎨']
  },
  {
    id: 'symbols',
    name: '기호',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }
] 
export interface User {
  id: string
  userNumber: number // 사용자 번호 (serial number)
  email: string
  password: string
  name: string // 사용자 이름
  createdAt: string
  lastUpdated: string
  userSettings?: UserSettings
  language?: string // 사용자 언어 (백엔드에서 내려줌)
  darkMode?: boolean // 다크모드 설정 (백엔드에서 내려줌)
}

export interface UserSettings {
  darkMode: boolean
  language: string
}

export interface AuthState {
  user: User | null
  users: User[] // 전체 사용자 목록 추가
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  // 사용자 ID 관리
  nextUserId: number
  nextUserNumber: number // 사용자 번호 관리
  usedUserIds: Set<string>
  // 등록된 이메일 관리
  registeredEmails: Set<string>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  // 이메일 중복 검증
  isEmailAvailable: (email: string) => boolean
  // 사용자 ID 변경 기능
  changeUserId: (newUserId: string) => Promise<boolean>
  isUserIdAvailable: (userId: string) => boolean
  // 사용자 이름 변경 기능
  changeUserName: (newName: string) => Promise<boolean>
  // 개발용: 테스트 계정 생성
  createTestAccount: () => User
} 
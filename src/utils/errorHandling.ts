/**
 * 에러 처리 및 로깅 유틸리티
 */

export interface AppError {
  message: string
  code?: string
  details?: Record<string, any>
  timestamp: Date
  context?: string
}

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical'

export interface ErrorLogEntry {
  level: ErrorLevel
  message: string
  error?: Error | AppError
  context?: Record<string, any>
  timestamp: Date
  userId?: string
}

/**
 * 애플리케이션 에러 클래스
 */
export class AppError extends Error {
  public code?: string
  public details?: Record<string, any>
  public timestamp: Date
  public context?: string

  constructor(message: string, code?: string, details?: Record<string, any>, context?: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.timestamp = new Date()
    this.context = context
  }
}

/**
 * 에러 로깅 함수
 */
export function logError(
  level: ErrorLevel,
  message: string,
  error?: Error | AppError,
  context?: Record<string, any>,
  userId?: string
): void {
  const logEntry: ErrorLogEntry = {
    level,
    message,
    error,
    context,
    timestamp: new Date(),
    userId,
  }

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    const logMethod = level === 'error' || level === 'critical' ? 'error' : 'warn'
    console[logMethod](`[${level.toUpperCase()}] ${message}`, {
      error,
      context,
      timestamp: logEntry.timestamp,
      userId,
    })
  }

  // 프로덕션 환경에서는 에러 추적 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // TODO: Sentry, LogRocket 등 에러 추적 서비스 연동
    // sendErrorToTrackingService(logEntry)
  }
}

/**
 * API 에러 처리 함수
 */
export function handleApiError(error: unknown, context?: string): AppError {
  let appError: AppError

  if (error instanceof AppError) {
    appError = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    appError = new AppError((error as Error).message, 'UNKNOWN_ERROR', undefined, context)
  } else if (typeof error === 'string') {
    appError = new AppError(error, 'UNKNOWN_ERROR', undefined, context)
  } else {
    appError = new AppError('알 수 없는 오류가 발생했습니다.', 'UNKNOWN_ERROR', undefined, context)
  }

  logError('error', appError.message, appError, { context })
  return appError
}

/**
 * 네트워크 에러 처리 함수
 */
export function handleNetworkError(error: unknown, url?: string): AppError {
  let message = '네트워크 오류가 발생했습니다.'
  let code = 'NETWORK_ERROR'

  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as Error).message
    if (errorMessage.includes('fetch')) {
      message = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
      code = 'NETWORK_CONNECTION_ERROR'
    } else if (errorMessage.includes('timeout')) {
      message = '요청 시간이 초과되었습니다. 다시 시도해주세요.'
      code = 'NETWORK_TIMEOUT_ERROR'
    } else {
      message = errorMessage
    }
  }

  const appError = new AppError(message, code, { url })
  logError('error', appError.message, appError, { url })
  return appError
}

/**
 * 사용자 친화적인 에러 메시지 생성
 */
export function getUserFriendlyMessage(error: AppError | Error | string): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof AppError) {
    // 코드별 사용자 친화적 메시지
    switch (error.code) {
      case 'NETWORK_CONNECTION_ERROR':
        return '인터넷 연결을 확인해주세요.'
      case 'NETWORK_TIMEOUT_ERROR':
        return '요청 시간이 초과되었습니다. 다시 시도해주세요.'
      case 'UNAUTHORIZED':
        return '로그인이 필요합니다.'
      case 'FORBIDDEN':
        return '접근 권한이 없습니다.'
      case 'NOT_FOUND':
        return '요청한 리소스를 찾을 수 없습니다.'
      case 'VALIDATION_ERROR':
        return '입력 정보를 확인해주세요.'
      case 'SERVER_ERROR':
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      default:
        return error.message || '알 수 없는 오류가 발생했습니다.'
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as Error).message || '알 수 없는 오류가 발생했습니다.'
  }

  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * 에러 복구 가능 여부 확인
 */
export function isRecoverableError(error: AppError | Error): boolean {
  if (error instanceof AppError) {
    // 복구 불가능한 에러 코드들
    const nonRecoverableCodes = ['CRITICAL_ERROR', 'AUTHENTICATION_FAILED']
    return !nonRecoverableCodes.includes(error.code || '')
  }
  return true
}

/**
 * 에러 재시도 가능 여부 확인
 */
export function isRetryableError(error: AppError | Error): boolean {
  if (error instanceof AppError) {
    // 재시도 가능한 에러 코드들
    const retryableCodes = ['NETWORK_ERROR', 'NETWORK_TIMEOUT_ERROR', 'SERVER_ERROR']
    return retryableCodes.includes(error.code || '')
  }
  return false
}

/**
 * 에러 발생 시 사용자에게 알림
 */
export function notifyError(error: AppError | Error | string, context?: string): void {
  const message = getUserFriendlyMessage(error)
  
  // Toast 알림 (useToastStore가 있는 경우)
  if (typeof window !== 'undefined' && window.__TAESHIGEE_TOAST__) {
    window.__TAESHIGEE_TOAST__.showToast('error', message)
  } else {
    // 기본 alert (fallback)
    alert(message)
  }

  // 에러 로깅
  if (error instanceof Error || error instanceof AppError) {
    logError('error', message, error, { context })
  } else {
    logError('error', message, undefined, { context })
  }
}

/**
 * 비동기 함수 에러 처리 래퍼
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
  fallback?: T
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const appError = handleApiError(error, context)
    
    if (fallback !== undefined) {
      return fallback
    }
    
    throw appError
  }
}

/**
 * React 컴포넌트 에러 경계용 에러 처리
 */
export function handleComponentError(error: Error, errorInfo?: React.ErrorInfo): void {
  const appError = new AppError(
    error.message,
    'COMPONENT_ERROR',
    { stack: error.stack, componentStack: errorInfo?.componentStack }
  )
  
  logError('error', 'React 컴포넌트 에러', appError, {
    componentStack: errorInfo?.componentStack,
  })
}

// 전역 에러 핸들러 등록
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logError('error', '전역 에러', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logError('error', '처리되지 않은 Promise 거부', event.reason, {
      promise: event.promise,
    })
  })
}

// TypeScript 전역 타입 확장
declare global {
  interface Window {
    __TAESHIGEE_TOAST__?: {
      showToast: (type: string, message: string) => void
    }
  }
} 
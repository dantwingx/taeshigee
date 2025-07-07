/**
 * 백엔드 에러 처리 유틸리티
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: Record<string, any>;

  constructor(message: string, code: string, statusCode: number = 500, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * 에러 코드별 사용자 친화적 메시지
 */
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // 인증 관련
  'AUTHENTICATION_FAILED': '로그인이 필요합니다.',
  'INVALID_CREDENTIALS': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'TOKEN_EXPIRED': '로그인이 만료되었습니다. 다시 로그인해주세요.',
  'INSUFFICIENT_PERMISSIONS': '접근 권한이 없습니다.',
  
  // 입력 검증
  'VALIDATION_ERROR': '입력 정보를 확인해주세요.',
  'REQUIRED_FIELD': '필수 항목을 입력해주세요.',
  'INVALID_FORMAT': '올바른 형식으로 입력해주세요.',
  'FIELD_TOO_LONG': '입력 내용이 너무 깁니다.',
  'FIELD_TOO_SHORT': '입력 내용이 너무 짧습니다.',
  
  // 리소스 관련
  'RESOURCE_NOT_FOUND': '요청한 정보를 찾을 수 없습니다.',
  'RESOURCE_ALREADY_EXISTS': '이미 존재하는 정보입니다.',
  'RESOURCE_CONFLICT': '충돌이 발생했습니다.',
  
  // 데이터베이스 관련
  'DATABASE_ERROR': '데이터 처리 중 오류가 발생했습니다.',
  'CONSTRAINT_VIOLATION': '데이터 제약 조건을 위반했습니다.',
  'FOREIGN_KEY_VIOLATION': '관련 데이터가 존재하지 않습니다.',
  
  // 네트워크/서버 관련
  'NETWORK_ERROR': '네트워크 오류가 발생했습니다.',
  'SERVER_ERROR': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  'SERVICE_UNAVAILABLE': '서비스를 일시적으로 사용할 수 없습니다.',
  
  // 비즈니스 로직
  'BUSINESS_RULE_VIOLATION': '업무 규칙을 위반했습니다.',
  'RATE_LIMIT_EXCEEDED': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  'MAINTENANCE_MODE': '시스템 점검 중입니다.',
  
  // 기본
  'UNKNOWN_ERROR': '알 수 없는 오류가 발생했습니다.',
};

/**
 * 에러 코드별 HTTP 상태 코드
 */
const ERROR_STATUS_CODES: Record<string, number> = {
  // 4xx 클라이언트 오류
  'AUTHENTICATION_FAILED': 401,
  'INVALID_CREDENTIALS': 401,
  'TOKEN_EXPIRED': 401,
  'INSUFFICIENT_PERMISSIONS': 403,
  'VALIDATION_ERROR': 400,
  'REQUIRED_FIELD': 400,
  'INVALID_FORMAT': 400,
  'FIELD_TOO_LONG': 400,
  'FIELD_TOO_SHORT': 400,
  'RESOURCE_NOT_FOUND': 404,
  'RESOURCE_ALREADY_EXISTS': 409,
  'RESOURCE_CONFLICT': 409,
  'BUSINESS_RULE_VIOLATION': 400,
  'RATE_LIMIT_EXCEEDED': 429,
  
  // 5xx 서버 오류
  'DATABASE_ERROR': 500,
  'CONSTRAINT_VIOLATION': 500,
  'FOREIGN_KEY_VIOLATION': 500,
  'NETWORK_ERROR': 500,
  'SERVER_ERROR': 500,
  'SERVICE_UNAVAILABLE': 503,
  'MAINTENANCE_MODE': 503,
  'UNKNOWN_ERROR': 500,
};

/**
 * 에러를 사용자 친화적 메시지로 변환
 */
export function getUserFriendlyMessage(errorCode: string): string {
  return USER_FRIENDLY_MESSAGES[errorCode] || USER_FRIENDLY_MESSAGES['UNKNOWN_ERROR'];
}

/**
 * 에러 코드에 해당하는 HTTP 상태 코드 반환
 */
export function getErrorStatusCode(errorCode: string): number {
  return ERROR_STATUS_CODES[errorCode] || 500;
}

/**
 * 에러 로깅 (개발 환경에서만 상세 정보 출력)
 */
export function logError(error: Error | AppError, context?: Record<string, any>): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.error('=== ERROR LOG ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    if (error instanceof AppError) {
      console.error('Code:', error.code);
      console.error('Status Code:', error.statusCode);
      console.error('Details:', error.details);
    }
    
    if (context) {
      console.error('Context:', context);
    }
    console.error('==================');
  } else {
    // 프로덕션에서는 간단한 로그만
    console.error(`[ERROR] ${error.message}`, {
      code: error instanceof AppError ? error.code : 'UNKNOWN',
      context: context ? Object.keys(context) : undefined,
    });
  }
}

/**
 * API 에러 응답 생성
 */
export function createApiErrorResponse(
  errorCode: string,
  details?: Record<string, any>,
  customMessage?: string
): NextResponse {
  const statusCode = getErrorStatusCode(errorCode);
  const message = customMessage || getUserFriendlyMessage(errorCode);
  
  const errorResponse: ApiError = {
    code: errorCode,
    message,
    statusCode,
    ...(details && { details }),
  };
  
  // 에러 로깅
  const appError = new AppError(message, errorCode, statusCode, details);
  logError(appError);
  
  return NextResponse.json(
    {
      success: false,
      error: errorResponse,
    },
    { status: statusCode }
  );
}

/**
 * 일반적인 에러를 API 에러로 변환
 */
export function handleUnexpectedError(error: unknown, context?: string): NextResponse {
  let errorCode = 'UNKNOWN_ERROR';
  let details: Record<string, any> = {};
  
  if (error instanceof AppError) {
    errorCode = error.code;
    details = error.details || {};
  } else if (error instanceof Error) {
    // 일반 Error 객체를 분석하여 적절한 코드 할당
    if (error.message.includes('duplicate key')) {
      errorCode = 'RESOURCE_ALREADY_EXISTS';
    } else if (error.message.includes('foreign key')) {
      errorCode = 'FOREIGN_KEY_VIOLATION';
    } else if (error.message.includes('not null')) {
      errorCode = 'REQUIRED_FIELD';
    } else if (error.message.includes('unique constraint')) {
      errorCode = 'RESOURCE_ALREADY_EXISTS';
    } else {
      errorCode = 'SERVER_ERROR';
    }
    details = { originalMessage: error.message };
  } else {
    errorCode = 'UNKNOWN_ERROR';
    details = { originalError: String(error) };
  }
  
  // 컨텍스트 정보 추가
  if (context) {
    details.context = context;
  }
  
  return createApiErrorResponse(errorCode, details);
}

/**
 * 검증 에러 응답 생성
 */
export function createValidationError(field: string, message: string): NextResponse {
  return createApiErrorResponse('VALIDATION_ERROR', { field }, message);
}

/**
 * 인증 에러 응답 생성
 */
export function createAuthenticationError(message?: string): NextResponse {
  return createApiErrorResponse('AUTHENTICATION_FAILED', {}, message);
}

/**
 * 권한 에러 응답 생성
 */
export function createPermissionError(message?: string): NextResponse {
  return createApiErrorResponse('INSUFFICIENT_PERMISSIONS', {}, message);
}

/**
 * 리소스 없음 에러 응답 생성
 */
export function createNotFoundError(resource: string): NextResponse {
  return createApiErrorResponse('RESOURCE_NOT_FOUND', { resource }, `${resource}을(를) 찾을 수 없습니다.`);
} 
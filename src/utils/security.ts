/**
 * XSS 방지를 위한 보안 유틸리티 함수들
 */

/**
 * HTML 특수문자를 이스케이프하여 XSS 공격 방지
 * @param text 이스케이프할 텍스트
 * @returns 이스케이프된 안전한 텍스트
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text);
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * URL을 안전하게 검증하고 이스케이프
 * @param url 검증할 URL
 * @returns 안전한 URL 또는 빈 문자열
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }
  
  // URL 패턴 검증 (http, https, mailto, tel만 허용)
  const safeUrlPattern = /^(https?:\/\/|mailto:|tel:)/i;
  if (!safeUrlPattern.test(url)) {
    return '';
  }
  
  return escapeHtml(url);
}

/**
 * 사용자 입력 텍스트를 안전하게 정리
 * @param text 정리할 텍스트
 * @returns 안전한 텍스트
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  // HTML 태그 제거
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // 특수문자 이스케이프
  return escapeHtml(cleanText);
}

/**
 * 태그 이름을 안전하게 검증
 * @param tagName 검증할 태그 이름
 * @returns 안전한 태그 이름 또는 빈 문자열
 */
export function sanitizeTagName(tagName: string): string {
  if (typeof tagName !== 'string') {
    return '';
  }
  
  // 태그 이름 패턴 검증 (알파벳, 숫자, 언더스코어, 하이픈만 허용)
  const safeTagPattern = /^[a-zA-Z0-9_-]+$/;
  if (!safeTagPattern.test(tagName)) {
    return '';
  }
  
  // 길이 제한 (최대 50자)
  if (tagName.length > 50) {
    return '';
  }
  
  return tagName.trim();
}

/**
 * 사용자 입력을 안전하게 검증하는 통합 함수
 * @param input 검증할 입력값
 * @param type 입력 타입 ('text', 'url', 'tag', 'email')
 * @returns 안전한 입력값
 */
export function sanitizeInput(input: string, type: 'text' | 'url' | 'tag' | 'email' = 'text'): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  switch (type) {
    case 'url':
      return sanitizeUrl(input);
    case 'tag':
      return sanitizeTagName(input);
    case 'email':
      // 이메일 패턴 검증
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(input) ? escapeHtml(input) : '';
    case 'text':
    default:
      return sanitizeText(input);
  }
} 
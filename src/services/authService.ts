import { apiService } from './api';
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface MeResponse {
  success: boolean;
  user: User;
}

class AuthService {
  // 로그인
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/login', credentials);
    return response as AuthResponse;
  }

  // 회원가입
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/register', credentials);
    return response as AuthResponse;
  }

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<MeResponse> {
    const response = await apiService.get<MeResponse>('/api/auth/me');
    return response as MeResponse;
  }

  // 토큰 저장
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // 토큰 제거
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // 토큰 조회
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 
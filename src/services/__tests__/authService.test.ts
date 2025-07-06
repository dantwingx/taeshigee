import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import type { LoginCredentials, RegisterCredentials } from '../../types/auth';

// apiService 모킹
vi.mock('../api', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { apiService } from '../api';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('로그인 요청을 올바르게 처리해야 함', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        success: true,
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (apiService.post as any).mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(apiService.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('회원가입 요청을 올바르게 처리해야 함', async () => {
      const credentials: RegisterCredentials = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const mockResponse = {
        success: true,
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (apiService.post as any).mockResolvedValue(mockResponse);

      const result = await authService.register(credentials);

      expect(apiService.post).toHaveBeenCalledWith('/api/auth/register', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('현재 사용자 정보를 올바르게 조회해야 함', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (apiService.get as any).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(apiService.get).toHaveBeenCalledWith('/api/auth/me');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('토큰 관리', () => {
    it('토큰을 저장하고 조회할 수 있어야 함', () => {
      const token = 'test-token';
      
      authService.saveToken(token);
      expect(authService.getToken()).toBe(token);
    });

    it('토큰을 제거할 수 있어야 함', () => {
      const token = 'test-token';
      
      authService.saveToken(token);
      expect(authService.getToken()).toBe(token);
      
      authService.removeToken();
      expect(authService.getToken()).toBeNull();
    });

    it('인증 상태를 올바르게 확인해야 함', () => {
      expect(authService.isAuthenticated()).toBe(false);
      
      authService.saveToken('test-token');
      expect(authService.isAuthenticated()).toBe(true);
      
      authService.removeToken();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
}); 
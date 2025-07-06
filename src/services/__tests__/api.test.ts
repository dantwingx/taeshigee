import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../api';

// fetch 모킹
global.fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('GET 요청', () => {
    it('성공적인 GET 요청을 처리해야 함', async () => {
      const mockResponse = { success: true, data: { id: 1, name: 'test' } };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.get('/api/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('에러 응답을 처리해야 함', async () => {
      const mockError = { success: false, error: 'Not found' };
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(apiService.get('/api/test')).rejects.toThrow('Not found');
    });
  });

  describe('POST 요청', () => {
    it('성공적인 POST 요청을 처리해야 함', async () => {
      const mockData = { name: 'test' };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.post('/api/test', mockData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Authorization 헤더', () => {
    it('토큰이 있을 때 Authorization 헤더를 포함해야 함', async () => {
      const token = 'test-token';
      localStorage.setItem('authToken', token);
      
      const mockResponse = { success: true };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiService.get('/api/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    });

    it('토큰이 없을 때 Authorization 헤더를 포함하지 않아야 함', async () => {
      const mockResponse = { success: true };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiService.get('/api/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
}); 
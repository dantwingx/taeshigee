import { apiService } from './api';

export interface UserSettings {
  language: string;
  darkMode: boolean;
}

export interface SettingsResponse {
  success: boolean;
  settings: UserSettings & {
    name?: string; // 백엔드에서 반환하는 이름 필드
  };
}

class UserService {
  // 사용자 설정 조회
  async getSettings(): Promise<SettingsResponse> {
    const response = await apiService.get<SettingsResponse>('/api/user/settings');
    return response as SettingsResponse;
  }

  // 사용자 설정 업데이트
  async updateSettings(settings: Partial<UserSettings>): Promise<SettingsResponse> {
    const response = await apiService.put<SettingsResponse>('/api/user/settings', settings);
    return response as SettingsResponse;
  }

  // 사용자 이름 변경 (별도 함수)
  async updateUserName(name: string): Promise<SettingsResponse> {
    const response = await apiService.put<SettingsResponse>('/api/user/settings', { name });
    return response as SettingsResponse;
  }
}

export const userService = new UserService(); 
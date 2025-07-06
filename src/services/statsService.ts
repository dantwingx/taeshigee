import { apiService } from './api';

export interface UserStats {
  totalTasks: number;
  importantTasks: number;
  urgentTasks: number;
  publicTasks: number;
  privateTasks: number;
  totalLikes: number;
}

export interface SystemStats {
  totalTasks: number;
  publicTasks: number;
  totalLikes: number;
}

export interface StatsResponse {
  success: boolean;
  userStats: UserStats;
  systemStats: SystemStats;
}

class StatsService {
  // 통계 조회
  async getStats(): Promise<StatsResponse> {
    const response = await apiService.get<StatsResponse>('/api/stats');
    return response as StatsResponse;
  }
}

export const statsService = new StatsService(); 
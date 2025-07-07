import { apiService } from './api';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task';
import i18n from '../i18n';

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  likesCount: number;
}

class TaskService {
  // 사용자 태스크 목록 조회
  async getUserTasks(search?: string, filter?: string): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);
    
    const endpoint = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiService.get<TasksResponse>(endpoint);
    return response as TasksResponse;
  }

  // 공개 태스크 목록 조회
  async getPublicTasks(search?: string, filter?: string): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);
    
    const endpoint = `/api/public-tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiService.get<TasksResponse>(endpoint);
    return response as TasksResponse;
  }

  // 태스크 생성
  async createTask(data: CreateTaskData): Promise<TaskResponse> {
    const response = await apiService.post<TaskResponse>('/api/tasks', data);
    return response as TaskResponse;
  }

  // 태스크 수정
  async updateTask(id: string, data: UpdateTaskData): Promise<TaskResponse> {
    const response = await apiService.put<TaskResponse>(`/api/tasks/${id}`, data);
    return response as TaskResponse;
  }

  // 태스크 삭제
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.delete<{ success: boolean; message: string }>(`/api/tasks/${id}`);
    return response as { success: boolean; message: string };
  }

  // 태스크 복제
  async duplicateTask(id: string): Promise<TaskResponse> {
    const currentLanguage = i18n.language || 'ko';
    const response = await apiService.post<TaskResponse>(`/api/tasks/${id}/duplicate?lang=${currentLanguage}`);
    return response as TaskResponse;
  }

  // 태스크 좋아요/취소
  async toggleLike(id: string): Promise<LikeResponse> {
    const response = await apiService.post<LikeResponse>(`/api/tasks/${id}/like`);
    return response as LikeResponse;
  }
}

export const taskService = new TaskService(); 
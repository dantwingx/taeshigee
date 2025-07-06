import { apiService } from './api';
import type { TagStats } from '../types/task';

export interface TagsResponse {
  success: boolean;
  tags: TagStats[];
}

class TagService {
  // 모든 태그 조회
  async getAllTags(): Promise<TagsResponse> {
    const response = await apiService.get<TagsResponse>('/api/tags');
    return response as TagsResponse;
  }
}

export const tagService = new TagService(); 
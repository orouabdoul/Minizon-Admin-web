import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { Review, ReviewStats, ReviewStatus } from '../models/review.model';

interface ReviewListParams {
  search?:    string;
  status?:    string;
  direction?: string;
  rating?:    string;
  per_page?:  number;
}

export const reviewService = {
  getStats: () =>
    api.get<ApiBodyResponse<ReviewStats>>('/admin/reviews/stats'),

  getAll: (params?: ReviewListParams) =>
    api.get<ApiBodyResponse<Review[]>>('/admin/reviews', { params }),

  setStatus: (uuid: string, status: ReviewStatus) =>
    api.patch<ApiBodyResponse<null>>(`/admin/reviews/${uuid}/status`, { status }),

  remove: (uuid: string) =>
    api.delete<ApiBodyResponse<null>>(`/admin/reviews/${uuid}`),
};

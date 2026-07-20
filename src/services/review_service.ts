import { api } from './api';
import type { ReviewStatus } from '../models/review.model';

export const reviewService = {
  getAll:    (params?: { status?: ReviewStatus; direction?: string; search?: string }) =>
               api.get('/admin/reviews', { params }),
  setStatus: (id: string, status: ReviewStatus) => api.patch(`/admin/reviews/${id}`, { status }),
  remove:    (id: string)                        => api.delete(`/admin/reviews/${id}`),
};

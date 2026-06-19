export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiBodyResponse<T> {
  success: boolean;
  message: string;
  body: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  message: string;
  success: boolean;
}

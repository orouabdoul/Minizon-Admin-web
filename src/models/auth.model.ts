export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
  twoFactorEnabled: boolean;
}

export interface AdminProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  city: string;
  neighborhood: string;
  address_details: string | null;
  kyc_status: string;
}

export interface AdminUser {
  id: number;
  uuid: string;
  phone: string;
  is_verified: boolean;
  is_blocked: boolean;
  penalty_points: number;
  role: string;
  profile: AdminProfile;
}

export interface AuthToken {
  token: string;
  user: AdminUser;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
}

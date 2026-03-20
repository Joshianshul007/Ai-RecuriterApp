export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: "jobseeker" | "employer";
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

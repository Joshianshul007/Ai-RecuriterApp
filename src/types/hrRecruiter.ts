import type { CompanySize } from "@/models/HrRecruiter";

export interface HrRegisterBody {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;

  // Company
  companyName: string;
  companyWebsite?: string;
  companySize?: CompanySize;
  industry?: string;

  // Recruiter
  designation?: string;
}

export interface HrLoginBody {
  email: string;
  password: string;
}

export interface HrRecruiterUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  designation?: string;
  role: string;
  isVerified: boolean;
  isApproved: boolean;
}

export interface HrAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  recruiter?: HrRecruiterUser;
}

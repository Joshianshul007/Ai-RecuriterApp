export interface UserProfile {
  basics: {
    name: string;
    email: string;
    targetRole: string;
  };
  skills: {
    manual: string[];
    aiSuggested: string[];
    approved: string[];
  };
  projects: {
    rawInput: string;
    aiEnhanced: string;
    approved: boolean;
  }[];
  experience: {
    rawInput: string;
    aiEnhanced: string;
    approved: boolean;
  }[];
  summary: string;
  roleRecommendations: string[];
  completionScore: number;
  onboardingCompleted: boolean;
}

export interface AIEnhanceProjectRequest {
  rawInput: string;
}

export interface AIEnhanceProjectResponse {
  structuredDescription: string;
  extractedSkills: string[];
}

export interface AIEnhanceExperienceRequest {
  rawInput: string;
}

export interface AIEnhanceExperienceResponse {
  structuredSummary: string;
  extractedSkills: string[];
}

export interface AIGenerateSummaryRequest {
  skills: string[];
  projects: string[];
  experience: string[];
}

export interface AIGenerateSummaryResponse {
  profileSummary: string;
  roleRecommendations: string[];
}

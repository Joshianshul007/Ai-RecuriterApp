// ─── Shared Job Constants ─────────────────────────────────
// Used by both the recruiter form and the public search UI

export const JOB_CATEGORIES = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "data", label: "Data Science & Analytics" },
  { value: "design", label: "UI/UX Design" },
  { value: "management", label: "Product & Management" },
  { value: "mobile", label: "Mobile Development" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "other", label: "Other" },
] as const;

export const JOB_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "junior", label: "Junior (0-2 yrs)" },
  { value: "mid", label: "Mid-Level (2-5 yrs)" },
  { value: "senior", label: "Senior (5-8 yrs)" },
  { value: "executive", label: "Executive (8+ yrs)" },
] as const;

export const LOCATIONS = [
  "Remote",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Noida",
  "Gurugram",
  "Ahmedabad",
  "New York",
  "San Francisco",
  "London",
  "Singapore",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number]["value"];
export type JobType = (typeof JOB_TYPES)[number]["value"];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];

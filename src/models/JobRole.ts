import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobRole extends Document {
  recruiterId: mongoose.Types.ObjectId;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  category: string;
  jobType: string;
  description: string;
  requiredSkills: string[];
  experienceLevel?: "junior" | "mid" | "senior" | "executive";
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  keywords: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobRoleSchema = new Schema<IJobRole>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "HrRecruiter",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "frontend",
        "backend",
        "fullstack",
        "devops",
        "data",
        "design",
        "management",
        "mobile",
        "ai_ml",
        "other",
      ],
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    description: {
      type: String,
      default: "",
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "executive"],
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
    },
    keywords: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Text index for keyword search ───────────────────────
JobRoleSchema.index(
  { title: "text", companyName: "text", description: "text" },
  { weights: { title: 10, companyName: 5, description: 1 } }
);

// ─── Secondary indexes for filter queries ────────────────
JobRoleSchema.index({ category: 1, isActive: 1 });
JobRoleSchema.index({ location: 1, isActive: 1 });
JobRoleSchema.index({ recruiterId: 1 });
JobRoleSchema.index({ createdAt: -1 });

// ─── Pre-save: Auto-generate keywords array ─────────────
JobRoleSchema.pre("save", function () {
  const words = new Set<string>();
  // Extract from title
  this.title
    .toLowerCase()
    .split(/\s+/)
    .forEach((w) => words.add(w));
  // Extract from skills
  this.requiredSkills.forEach((s) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .forEach((w) => words.add(w))
  );
  // Extract from company name
  this.companyName
    .toLowerCase()
    .split(/\s+/)
    .forEach((w) => words.add(w));
  this.keywords = Array.from(words).filter((w) => w.length > 1);
});

const JobRole: Model<IJobRole> =
  mongoose.models.JobRole ?? mongoose.model<IJobRole>("JobRole", JobRoleSchema);

export default JobRole;

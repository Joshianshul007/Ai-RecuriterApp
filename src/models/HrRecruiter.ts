import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ─── Types ────────────────────────────────────────────────
export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export interface IHrRecruiter extends Document {
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;

  // Company info
  companyName: string;
  companyWebsite?: string;
  companySize?: CompanySize;
  industry?: string;
  companyLogo?: string;
  companyDescription?: string;

  // Recruiter-specific
  designation?: string;      // e.g. "HR Manager", "Talent Acquisition Lead"
  linkedIn?: string;

  // Account status
  isVerified: boolean;
  isApproved: boolean;       // admin can approve/reject employer accounts
  role: "employer";

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────
const HrRecruiterSchema = new Schema<IHrRecruiter>(
  {
    // Personal
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: { type: String },

    // Company
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    companyWebsite: { type: String, trim: true },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    industry: { type: String, trim: true },
    companyLogo: { type: String },
    companyDescription: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Recruiter-specific
    designation: { type: String, trim: true },
    linkedIn: { type: String, trim: true },

    // Account status
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, default: "employer", immutable: true },
  },
  { timestamps: true }
);

// ─── Pre-save: Hash password ──────────────────────────────
HrRecruiterSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: Compare password ───────────────────
HrRecruiterSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Model (singleton-safe for Next.js) ──────────────────
const HrRecruiter: Model<IHrRecruiter> =
  mongoose.models.HrRecruiter ??
  mongoose.model<IHrRecruiter>("HrRecruiter", HrRecruiterSchema);

export default HrRecruiter;

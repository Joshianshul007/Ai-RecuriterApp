import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ─── Types ────────────────────────────────────────────────
export type UserRole = "jobseeker" | "employer" | "admin";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    basics: { name: string; email: string; targetRole: string };
    skills: { manual: string[]; aiSuggested: string[]; approved: string[] };
    projects: { rawInput: string; aiEnhanced: string; approved: boolean }[];
    experience: { rawInput: string; aiEnhanced: string; approved: boolean }[];
    summary: string;
    roleRecommendations: string[];
    completionScore: number;
    onboardingCompleted: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    profile: {
      basics: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        targetRole: { type: String, default: "" },
      },
      skills: {
        manual: [{ type: String }],
        aiSuggested: [{ type: String }],
        approved: [{ type: String }],
      },
      projects: [
        {
          rawInput: { type: String, default: "" },
          aiEnhanced: { type: String, default: "" },
          approved: { type: Boolean, default: false },
        },
      ],
      experience: [
        {
          rawInput: { type: String, default: "" },
          aiEnhanced: { type: String, default: "" },
          approved: { type: Boolean, default: false },
        },
      ],
      summary: { type: String, default: "" },
      roleRecommendations: [{ type: String }],
      completionScore: { type: Number, default: 0 },
      onboardingCompleted: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: Hash password ──────────────────────────────
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: Compare password ───────────────────
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Model (singleton-safe for Next.js) ──────────────────
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;

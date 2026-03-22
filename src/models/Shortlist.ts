import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShortlist extends Document {
  recruiterId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  jobRoleId?: mongoose.Types.ObjectId;
  status: "shortlisted" | "rejected" | "pending";
  matchScore?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistSchema = new Schema<IShortlist>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRoleId: {
      type: Schema.Types.ObjectId,
      ref: "JobRole",
    },
    status: {
      type: String,
      enum: ["shortlisted", "rejected", "pending"],
      default: "pending",
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a recruiter can only shortlist a candidate once (or once per job role if we enforce it)
ShortlistSchema.index({ recruiterId: 1, candidateId: 1 }, { unique: true });

const Shortlist: Model<IShortlist> =
  mongoose.models.Shortlist ?? mongoose.model<IShortlist>("Shortlist", ShortlistSchema);

export default Shortlist;

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HrRecruiter from "@/models/HrRecruiter";
import type { HrRegisterBody, HrAuthResponse } from "@/types/hrRecruiter";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: HrRegisterBody = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      companyName,
      companyWebsite,
      companySize,
      industry,
      designation,
    } = body;

    // ── Validate required fields ──────────────────────────
    if (!firstName || !lastName || !email || !password || !confirmPassword || !companyName) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ── Check duplicate email (across both collections) ───
    const existingRecruiter = await HrRecruiter.findOne({ email: email.toLowerCase() });
    if (existingRecruiter) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ── Create HR Recruiter ───────────────────────────────
    const recruiter = await HrRecruiter.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite?.trim(),
      companySize,
      industry: industry?.trim(),
      designation: designation?.trim(),
    });

    // ── Issue JWT ─────────────────────────────────────────
    const token = jwt.sign(
      {
        id: recruiter._id.toString(),
        email: recruiter.email,
        role: "employer",
        type: "hr",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return NextResponse.json<HrAuthResponse>(
      {
        success: true,
        message: "HR Recruiter account created. Awaiting admin approval.",
        token,
        recruiter: {
          id: recruiter._id.toString(),
          firstName: recruiter.firstName,
          lastName: recruiter.lastName,
          email: recruiter.email,
          companyName: recruiter.companyName,
          designation: recruiter.designation,
          role: recruiter.role,
          isVerified: recruiter.isVerified,
          isApproved: recruiter.isApproved,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[HR_REGISTER]", error);
    return NextResponse.json<HrAuthResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HrRecruiter from "@/models/HrRecruiter";
import type { HrLoginBody, HrAuthResponse } from "@/types/hrRecruiter";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: HrLoginBody = await request.json();
    const { email, password } = body;

    // ── Validate fields ───────────────────────────────────
    if (!email || !password) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── Find recruiter and select password ────────────────
    const recruiter = await HrRecruiter.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!recruiter) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Verify password ───────────────────────────────────
    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json<HrAuthResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Check approval status ─────────────────────────────
    if (!recruiter.isApproved) {
      return NextResponse.json<HrAuthResponse>(
        {
          success: false,
          message:
            "Your account is pending admin approval. You will be notified once approved.",
        },
        { status: 403 }
      );
    }

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
        message: "Login successful",
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
      { status: 200 }
    );
  } catch (error) {
    console.error("[HR_LOGIN]", error);
    return NextResponse.json<HrAuthResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

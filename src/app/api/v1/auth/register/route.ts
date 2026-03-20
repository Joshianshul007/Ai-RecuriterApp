import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import type { RegisterBody, AuthResponse } from "@/types/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterBody = await request.json();
    const { firstName, lastName, email, phone, password, confirmPassword, role } = body;

    // ── Validate required fields ──────────────────────────
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ── Check duplicate email ─────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ── Create user (password hashed by pre-save hook) ────
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password,
      role: role ?? "jobseeker",
    });

    // ── Issue JWT ─────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Account created successfully",
        token,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

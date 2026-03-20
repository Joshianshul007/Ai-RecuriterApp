import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import type { LoginBody, AuthResponse } from "@/types/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginBody = await request.json();
    const { email, password } = body;

    // ── Validate required fields ──────────────────────────
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── Find user and explicitly select password ──────────
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Verify password ───────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Issue JWT ─────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Login successful",
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
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN]", error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

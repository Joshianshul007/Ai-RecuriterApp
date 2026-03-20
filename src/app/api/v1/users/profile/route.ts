import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { skills, projects, experiences, summary, roleRecommendations } = body;

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {
        basics: { name: `${user.firstName} ${user.lastName}`, email: user.email, targetRole: "" },
        skills: { manual: [], aiSuggested: [], approved: [] },
        projects: [],
        experience: [],
        summary: "",
        roleRecommendations: [],
        completionScore: 0,
        onboardingCompleted: false,
      };
    }

    // Update profile fields
    user.profile.skills.approved = skills || [];
    user.profile.projects = (projects || []).map((p: any) => ({
      rawInput: p.rawInput,
      aiEnhanced: p.aiEnhanced,
      approved: p.approved,
    }));
    user.profile.experience = (experiences || []).map((e: any) => ({
      rawInput: e.rawInput,
      aiEnhanced: e.aiEnhanced,
      approved: e.approved,
    }));
    user.profile.summary = summary || "";
    user.profile.roleRecommendations = roleRecommendations || [];

    // Calculate completion score
    let score = 0;
    if (user.profile.skills.approved.length > 0) score += 25;
    if (user.profile.projects.length > 0) score += 25;
    if (user.profile.experience.length > 0) score += 25;
    if (user.profile.summary) score += 25;
    user.profile.completionScore = score;
    user.profile.onboardingCompleted = score === 100;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Profile saved successfully", completionScore: score },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PROFILE_SAVE]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

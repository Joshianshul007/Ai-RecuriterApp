import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ─── Helper: Extract & verify user from JWT ─────────────
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) return { error: "User not found", status: 404 };
    return { user };
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }
}

// ─── GET: Load saved profile ─────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { user } = auth;

    // Return profile or empty defaults
    const profile = user.profile || {
      basics: { name: "", email: "", targetRole: "" },
      skills: { manual: [], aiSuggested: [], approved: [] },
      projects: [],
      experience: [],
      summary: "",
      roleRecommendations: [],
      suggestedSkills: [],
      completionScore: 0,
      onboardingCompleted: false,
    };

    return NextResponse.json(
      { success: true, profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST: Save profile (supports partial updates) ──────
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { user } = auth;
    const body = await request.json();
    const {
      skills,
      projects,
      experiences,
      summary,
      roleRecommendations,
      suggestedSkills,
    } = body;

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {
        basics: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          targetRole: "",
        },
        skills: { manual: [], aiSuggested: [], approved: [] },
        projects: [],
        experience: [],
        summary: "",
        roleRecommendations: [],
        suggestedSkills: [],
        completionScore: 0,
        onboardingCompleted: false,
      };
    }

    // Partial update — only overwrite fields that are provided
    if (skills !== undefined) {
      user.profile.skills.approved = skills;
    }

    if (projects !== undefined) {
      user.profile.projects = projects.map((p: any) => ({
        rawInput: p.rawInput || "",
        aiEnhanced: p.aiEnhanced || "",
        approved: p.approved || false,
        extractedSkills: p.extractedSkills || [],
        projectSummary: p.projectSummary || "",
        suggestedRoles: p.suggestedRoles || [],
      }));
    }

    if (experiences !== undefined) {
      user.profile.experience = experiences.map((e: any) => ({
        rawInput: e.rawInput || "",
        aiEnhanced: e.aiEnhanced || "",
        approved: e.approved || false,
        extractedSkills: e.extractedSkills || [],
        suggestedTitle: e.suggestedTitle || "",
      }));
    }

    if (summary !== undefined) {
      user.profile.summary = summary;
    }

    if (roleRecommendations !== undefined) {
      user.profile.roleRecommendations = roleRecommendations;
    }

    if (suggestedSkills !== undefined) {
      user.profile.suggestedSkills = suggestedSkills;
    }

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
      {
        success: true,
        message: "Profile saved successfully",
        completionScore: score,
      },
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

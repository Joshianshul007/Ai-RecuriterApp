import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { enhanceJobDescription } from "@/lib/gemini";
import jwt from "jsonwebtoken";

// ─── Helper: Extract & verify HR token ───────────────────
function getRecruiterId(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(
      auth.split(" ")[1],
      process.env.JWT_SECRET as string
    ) as any;
    if (decoded?.role === "employer" && decoded?.id) return decoded.id;
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const recruiterId = getRecruiterId(req);
    if (!recruiterId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, category } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required",
        },
        { status: 400 }
      );
    }

    const enhancedData = await enhanceJobDescription(
      title,
      description,
      category
    );

    return NextResponse.json({
      success: true,
      data: enhancedData,
    });
  } catch (error: any) {
    console.error("AI Enhance Job Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to enhance job description" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { enhanceExperience } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { rawInput, existingSkills } = await request.json();

    if (!rawInput || rawInput.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Please provide a meaningful experience description." },
        { status: 400 }
      );
    }

    console.log("[AI_ENHANCE_EXPERIENCE] Input:", rawInput.substring(0, 100));
    const result = await enhanceExperience(rawInput, existingSkills || []);
    console.log("[AI_ENHANCE_EXPERIENCE] Success");

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    console.error("[AI_ENHANCE_EXPERIENCE] Error:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message?.includes("429")
          ? "AI rate limit reached. Please wait 30 seconds and try again."
          : "AI processing failed: " + (error?.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

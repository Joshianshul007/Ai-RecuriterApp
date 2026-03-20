import { NextRequest, NextResponse } from "next/server";
import { enhanceProject } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { rawInput } = await request.json();

    if (!rawInput || rawInput.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Please provide a meaningful project description." },
        { status: 400 }
      );
    }

    const result = await enhanceProject(rawInput);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[AI_ENHANCE_PROJECT]", error);
    return NextResponse.json(
      { success: false, message: "AI processing failed. Please try again." },
      { status: 500 }
    );
  }
}

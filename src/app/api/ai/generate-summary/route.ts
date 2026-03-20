import { NextRequest, NextResponse } from "next/server";
import { generateProfileSummary } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { skills, projects, experiences } = await request.json();

    if (
      (!skills || skills.length === 0) &&
      (!projects || projects.length === 0) &&
      (!experiences || experiences.length === 0)
    ) {
      return NextResponse.json(
        { success: false, message: "Please add at least one skill, project, or experience first." },
        { status: 400 }
      );
    }

    const result = await generateProfileSummary(
      skills || [],
      projects || [],
      experiences || []
    );

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[AI_GENERATE_SUMMARY]", error);
    return NextResponse.json(
      { success: false, message: "AI processing failed. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateProfileSummary } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skills = body.skills || [];
    const projects = body.projects || [];
    const experiences = body.experiences || [];

    console.log("[AI_GENERATE_SUMMARY] Received:", {
      skillsCount: skills.length,
      projectsCount: projects.length,
      experiencesCount: experiences.length,
    });

    // Allow generating summary with any data available
    if (skills.length === 0 && projects.length === 0 && experiences.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please add at least one skill, project, or experience first." },
        { status: 400 }
      );
    }

    const result = await generateProfileSummary(skills, projects, experiences);

    console.log("[AI_GENERATE_SUMMARY] Success:", result);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    console.error("[AI_GENERATE_SUMMARY] Error:", error?.message || error);
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

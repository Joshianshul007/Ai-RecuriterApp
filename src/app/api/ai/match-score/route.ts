import { NextResponse } from "next/server";
import { generateMatchScore } from "@/lib/gemini";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!decoded || !decoded.userId || decoded.role !== "employer") {
      return NextResponse.json({ success: false, message: "Forbidden: HR Access Only" }, { status: 403 });
    }

    const { candidateProfile, jobRoleDescription } = await req.json();

    if (!candidateProfile || !jobRoleDescription) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const matchData = await generateMatchScore(candidateProfile, jobRoleDescription);

    return NextResponse.json({ success: true, match: matchData });
  } catch (error: any) {
    console.error("AI Match Score API Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}

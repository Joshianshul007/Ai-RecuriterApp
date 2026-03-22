import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!decoded || !decoded.userId || decoded.role !== "employer") {
      return NextResponse.json({ success: false, message: "Forbidden: HR Access Only" }, { status: 403 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const skillsParam = url.searchParams.get("skills") || "";

    const query: any = { role: "jobseeker" };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "profile.basics.targetRole": { $regex: search, $options: "i" } }
      ];
    }

    if (skillsParam) {
      const skillsArray = skillsParam.split(",").map(s => s.trim().toLowerCase());
      // we match any skill in the approved skills array or AI suggested if we want
      query["profile.skills.approved"] = { 
        $in: skillsArray.map(skill => new RegExp(skill, "i")) 
      };
    }

    const candidates = await User.find(query)
      .select("firstName lastName email profile avatar createdAt")
      .sort({ "profile.completionScore": -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: candidates.map((c: any) => ({
        id: c._id,
        name: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.profile?.basics?.name || "Anonymous Candidate",
        email: c.email,
        avatar: c.avatar,
        targetRole: c.profile?.basics?.targetRole || c.profile?.roleRecommendations?.[0] || "Unknown Role",
        skills: c.profile?.skills?.approved || [],
        experienceCount: c.profile?.experience?.length || 0,
        projectsCount: c.profile?.projects?.length || 0,
        summary: c.profile?.summary || "",
        completionScore: c.profile?.completionScore || 0,
        createdAt: c.createdAt
      }))
    });
  } catch (error: any) {
    console.error("Fetch Candidates API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

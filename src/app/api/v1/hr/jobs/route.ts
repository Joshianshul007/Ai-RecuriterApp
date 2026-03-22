import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JobRole from "@/models/JobRole";
import HrRecruiter from "@/models/HrRecruiter";
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

// ─── GET  /api/v1/hr/jobs — List recruiter's jobs ────────
export async function GET(req: Request) {
  try {
    await connectDB();
    const recruiterId = getRecruiterId(req);
    if (!recruiterId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const jobs = await JobRole.find({ recruiterId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error("GET /hr/jobs error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

// ─── POST /api/v1/hr/jobs — Create a new job ────────────
export async function POST(req: Request) {
  try {
    await connectDB();
    const recruiterId = getRecruiterId(req);
    if (!recruiterId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();
    const {
      title,
      location,
      category,
      jobType,
      description,
      requiredSkills,
      experienceLevel,
      salary,
    } = body;

    // Validate required fields
    if (!title || !location || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, location, and category are required",
        },
        { status: 400 }
      );
    }

    // Fetch recruiter's company info to auto-fill
    const recruiter = await HrRecruiter.findById(recruiterId).lean();
    const companyName =
      body.companyName || (recruiter as any)?.companyName || "Unknown Company";
    const companyLogo = body.companyLogo || (recruiter as any)?.companyLogo;

    const job = await JobRole.create({
      recruiterId,
      title,
      companyName,
      companyLogo,
      location,
      category,
      jobType: jobType || "full-time",
      description: description || "",
      requiredSkills: requiredSkills || [],
      experienceLevel,
      salary,
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error: any) {
    console.error("POST /hr/jobs error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

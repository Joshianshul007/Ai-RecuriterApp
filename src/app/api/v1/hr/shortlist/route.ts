import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Shortlist from "@/models/Shortlist";
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

    // Fetch shortlists for this HR
    const shortlists = await Shortlist.find({
      recruiterId: decoded.userId,
      status: "shortlisted"
    })
      .populate({
        path: "candidateId",
        select: "firstName lastName email profile avatar"
      })
      .sort({ createdAt: -1 })
      .lean();

    // Map candidate objects to the frontend expected shape
    const data = shortlists.map((s: any) => {
      const c = s.candidateId;
      if (!c) return null; // Candidate might have been deleted

      return {
        id: c._id,
        name: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.profile?.basics?.name || "Anonymous",
        email: c.email,
        avatar: c.avatar,
        targetRole: c.profile?.basics?.targetRole || c.profile?.roleRecommendations?.[0] || "Unknown Role",
        skills: c.profile?.skills?.approved || [],
        experienceCount: c.profile?.experience?.length || 0,
        projectsCount: c.profile?.projects?.length || 0,
        summary: c.profile?.summary || "",
        matchScore: s.matchScore || 0,
        notes: s.notes || "",
        shortlistedAt: s.createdAt
      };
    }).filter(Boolean);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Fetch Shortlists API Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const { candidateId, status, notes, matchScore } = await req.json();

    if (!candidateId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Verify candidate exists
    const candidate = await User.findById(candidateId).lean();
    if (!candidate || candidate.role !== "jobseeker") {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    // Upsert shortlist entry
    const shortlistEntry = await Shortlist.findOneAndUpdate(
      { recruiterId: decoded.userId, candidateId },
      { 
        status, 
        ...(notes !== undefined && { notes }), 
        ...(matchScore !== undefined && { matchScore }) 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: shortlistEntry });
  } catch (error: any) {
    console.error("Manage Shortlist API Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}

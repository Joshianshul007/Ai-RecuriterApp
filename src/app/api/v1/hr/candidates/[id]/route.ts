import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Shortlist from "@/models/Shortlist";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id: candidateId } = await params;
    const candidate = await User.findOne({ _id: candidateId, role: "jobseeker" }).lean();


    if (!candidate) {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    // Check if this HR has shortlisted this candidate
    const shortlistEntry = await Shortlist.findOne({
      recruiterId: decoded.userId,
      candidateId: candidateId,
    }).lean();

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate._id,
        name: [candidate.firstName, candidate.lastName].filter(Boolean).join(" ") || candidate.profile?.basics?.name || "Anonymous Candidate",
        email: candidate.email,
        phone: candidate.phone,
        avatar: candidate.avatar,
        profile: candidate.profile,
        createdAt: candidate.createdAt,
      },
      shortlistStatus: shortlistEntry ? {
        status: shortlistEntry.status,
        matchScore: shortlistEntry.matchScore,
        notes: shortlistEntry.notes
      } : null
    });
  } catch (error: any) {
    console.error("Fetch Candidate Details API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

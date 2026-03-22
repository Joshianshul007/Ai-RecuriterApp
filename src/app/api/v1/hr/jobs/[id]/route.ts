import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JobRole from "@/models/JobRole";
import jwt from "jsonwebtoken";

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

// ─── GET  /api/v1/hr/jobs/[id] — Get single job ─────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const recruiterId = getRecruiterId(req);
    if (!recruiterId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const job = await JobRole.findOne({ _id: id, recruiterId }).lean();
    if (!job)
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    console.error("GET /hr/jobs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

// ─── PUT  /api/v1/hr/jobs/[id] — Update job ─────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const recruiterId = getRecruiterId(req);
    if (!recruiterId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const body = await req.json();

    const job = await JobRole.findOneAndUpdate(
      { _id: id, recruiterId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!job)
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    console.error("PUT /hr/jobs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/v1/hr/jobs/[id] — Soft-delete ──────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const recruiterId = getRecruiterId(req);
    if (!recruiterId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const job = await JobRole.findOneAndUpdate(
      { _id: id, recruiterId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!job)
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Job deactivated successfully",
    });
  } catch (error: any) {
    console.error("DELETE /hr/jobs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

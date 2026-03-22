import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JobRole from "@/models/JobRole";

// ─── GET /api/v1/jobs/search — Public job search ────────
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() || "";
    const location = url.searchParams.get("location")?.trim() || "";
    const category = url.searchParams.get("category")?.trim() || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // Build query — only active jobs
    const query: any = { isActive: true };

    // Keyword search: partial match on title, companyName, or keywords array
    if (q) {
      const regex = new RegExp(q, "i");
      query.$or = [
        { title: { $regex: regex } },
        { companyName: { $regex: regex } },
        { keywords: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    // Location: partial match
    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }

    // Category: exact match
    if (category) {
      query.category = category;
    }

    const [jobs, total] = await Promise.all([
      JobRole.find(query)
        .select(
          "title companyName companyLogo location category jobType description requiredSkills experienceLevel salary createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobRole.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Job search error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

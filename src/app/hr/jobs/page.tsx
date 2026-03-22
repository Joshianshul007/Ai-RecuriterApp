"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Briefcase, MapPin, Clock, Edit2, Trash2, Search, AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function HRJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/hr/jobs", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      } else {
        setError(data.message || "Failed to load jobs");
      }
    } catch {
      setError("An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this job?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/hr/jobs/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (data.success) {
        fetchJobs();
      } else {
        alert(data.message || "Failed to delete job");
      }
    } catch {
      alert("An error occurred while deleting the job.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Job Postings
          </h1>
          <p className="text-white/50 text-sm">
            Manage your open roles and job listings.
          </p>
        </div>
        <Link
          href="/hr/jobs/new"
          className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-teal-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-[#0a111a] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[120px] bg-[#0a111a] border border-white/5 rounded-2xl" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-[#0a111a] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white truncate max-w-[80%]">
                    {job.title}
                  </h3>
                  <span
                    className={
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider " +
                      (job.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20")
                    }
                  >
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="capitalize">{job.jobType.replace("-", " ")}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                <button
                  className="p-2 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors"
                  title="Edit Job"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {job.isActive && (
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Close Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <Link
                  href={"/hr/jobs/" + job._id + "/candidates"}
                  className="ml-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View Candidates
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#0a111a] border border-white/5 rounded-2xl py-16 text-center">
            <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-1">No jobs found</h3>
            <p className="text-white/40 text-sm mb-6">
              {search
                ? "No jobs match your search criteria."
                : "You haven't posted any jobs yet."}
            </p>
            {!search && (
              <Link
                href="/hr/jobs/new"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Post First Job
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

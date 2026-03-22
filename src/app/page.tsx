"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { JOB_CATEGORIES, LOCATIONS } from "@/constants/job";
import {
  Search, MapPin, Briefcase, Building2, Clock, ChevronRight,
  Loader2, AlertCircle, X
} from "lucide-react";

const stats = [
  { icon: Briefcase, value: "25,850", label: "Jobs" },
  { icon: Building2, value: "18,400", label: "Companies" },
];

const brands = [
  { name: "Spotify", path: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { name: "Slack", path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
  { name: "Adobe", path: "M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm13.748 0H14.25l8.382 21.248z" },
  { name: "Asana", path: "M19.141 12.336a4.856 4.856 0 1 1-9.712 0 4.856 4.856 0 0 1 9.712 0zM4.856 7.484a4.856 4.856 0 1 0 0 9.712 4.856 4.856 0 0 0 0-9.712zm14.288 0a4.856 4.856 0 1 0 0 9.712 4.856 4.856 0 0 0 0-9.712z" },
  { name: "Linear", path: "M0 14.109l9.891 9.893a12.038 12.038 0 0 1-9.89-9.893zM0 9.293L14.707 24a12.04 12.04 0 0 1-2.402.248A12.072 12.072 0 0 1 0 12.26v-2.967zm11.795-9.17l12.108 12.104a12.04 12.04 0 0 1-1.793 4.098L7.703.677a12.034 12.034 0 0 1 4.092-1.554zM5.354.006L23.994 18.64A12.062 12.062 0 0 1 5.354.006z" },
];

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  category: string;
  description: string;
  requiredSkills: string[];
  experienceLevel?: string;
  salary?: { min?: number; max?: number; currency: string };
  createdAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-teal-500/30 text-teal-300 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function JobCard({ job, query }: { job: Job; query: string }) {
  const categoryLabel =
    JOB_CATEGORIES.find((c) => c.value === job.category)?.label ?? job.category;
  const timeAgo = (() => {
    const ms = Date.now() - new Date(job.createdAt).getTime();
    const days = Math.floor(ms / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  })();

  const salaryText =
    job.salary?.min && job.salary?.max
      ? `${job.salary.currency} ${(job.salary.min / 1000).toFixed(0)}K–${(job.salary.max / 1000).toFixed(0)}K/yr`
      : null;

  return (
    <div className="group bg-[#111827]/60 border border-white/[0.07] hover:border-teal-500/30 rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/5">
      <div className="flex items-start gap-4">
        {/* Company Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {job.companyName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h3 className="text-base md:text-lg font-bold text-white group-hover:text-teal-400 transition-colors truncate">
              {highlightMatch(job.title, query)}
            </h3>
            <span className="shrink-0 bg-white/5 border border-white/10 text-white/60 text-[11px] font-medium px-2.5 py-1 rounded-full capitalize">
              {job.jobType.replace("-", " ")}
            </span>
          </div>

          <p className="text-sm text-white/60 font-medium mb-3">
            {highlightMatch(job.companyName, query)}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[12px] text-white/40 mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {highlightMatch(job.location, query)}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {categoryLabel}
            </span>
            {salaryText && (
              <span className="text-emerald-400 font-semibold">{salaryText}</span>
            )}
            <span className="flex items-center gap-1.5 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo}
            </span>
          </div>

          <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2 mb-4">
            {job.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap items-center gap-2">
            {job.requiredSkills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="bg-white/5 border border-white/[0.08] text-white/60 text-[11px] font-medium px-2.5 py-1 rounded-lg"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="text-[11px] text-white/30">
                +{job.requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-white/30 capitalize">
          {job.experienceLevel ? `${job.experienceLevel} level` : "All levels"}
        </span>
        <button className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold hover:text-teal-300 transition-colors group/btn">
          Apply Now
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#111827]/60 border border-white/[0.07] rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-white/5 rounded-lg w-3/4" />
          <div className="h-4 bg-white/5 rounded-lg w-1/2" />
          <div className="flex gap-3">
            <div className="h-3 bg-white/5 rounded w-20" />
            <div className="h-3 bg-white/5 rounded w-16" />
          </div>
          <div className="h-10 bg-white/5 rounded-lg w-full" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-white/5 rounded-lg w-16" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchJobs = useCallback(async (q: string, loc: string, cat: string, page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (loc) params.set("location", loc);
      if (cat) params.set("category", cat);
      params.set("page", page.toString());
      params.set("limit", "9");
      const res = await fetch(`/api/v1/jobs/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setPagination(data.pagination);
        setSearched(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setError(data.message || "Search failed.");
      }
    } catch {
      setError("Unable to search jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load featured jobs on mount
  useEffect(() => {
    searchJobs("", "", "");
  }, [searchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(query, locationFilter, categoryFilter);
  };

  const clearSearch = () => {
    setQuery("");
    setLocationFilter("");
    setCategoryFilter("");
    searchJobs("", "", "");
    setSearched(false);
  };

  const isFiltered = query || locationFilter || categoryFilter;

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[88vh] flex flex-col">
        {/* Background Image + Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-center"
            style={{ filter: "blur(1px)" }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-24 pb-14">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Find Your Dream Job Today!
          </h1>
          <p className="text-white/75 text-base md:text-lg mb-10 max-w-lg">
            Connecting Talent with Opportunity: Your Gateway to Career Success
          </p>

          {/* ── Search Bar ── */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col sm:flex-row items-stretch overflow-hidden"
          >
            {/* Job Title */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Job Title or Company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-gray-300 hover:text-gray-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">Select Location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Briefcase className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">Select Category</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-6 py-3 transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search Job
            </button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/80 backdrop-blur-sm shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-xl leading-none">
                      {stat.value}
                    </p>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Brand Logos Strip ── */}
      <section className="bg-[#111111] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-white font-semibold text-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d={brand.path} />
              </svg>
              <span className="tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Job Results Section ── */}
      <section ref={resultsRef} className="py-16 px-4 bg-[#0d0d0d] scroll-mt-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {isFiltered ? "Search Results" : "Featured Jobs"}
              </h2>
              {pagination && (
                <p className="text-white/40 text-sm">
                  {isFiltered
                    ? `Found ${pagination.total} job${pagination.total !== 1 ? "s" : ""}`
                    : `${pagination.total} open positions`}
                </p>
              )}
            </div>
            {isFiltered && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Job Cards */}
          {!loading && jobs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} query={query} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => searchJobs(query, locationFilter, categoryFilter, pagination.page - 1)}
                    className="px-4 py-2 text-sm text-white/60 border border-white/10 rounded-xl hover:border-white/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-white/40 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => searchJobs(query, locationFilter, categoryFilter, pagination.page + 1)}
                    className="px-4 py-2 text-sm text-white/60 border border-white/10 rounded-xl hover:border-white/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && searched && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-7 h-7 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
              <p className="text-white/40 text-sm mb-6">
                Try different keywords, location, or category.
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

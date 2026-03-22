"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Heart, TrendingUp, Sparkles, ChevronRight,
  UserPlus, MoreVertical, Clock, Search, Plus,
  CheckCircle2, AlertTriangle, ChevronDown
} from "lucide-react";

interface Stats {
  total: number;
  shortlisted: number;
  newCandidates: number;
  avgMatchScore: number;
}

type TabType = "all" | "new" | "shortlisted" | "rejected";

export default function HRDashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, shortlisted: 0, newCandidates: 0, avgMatchScore: 0 });
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Recruiter");

  // Tab & Filter state
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortBy, setSortBy] = useState("recent");

  // Filter state
  const [roleFilter, setRoleFilter] = useState("all");
  const [expFilter, setExpFilter] = useState<string[]>([]);
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");

  const AVAILABLE_SKILLS = ["React", "Node.js", "Python", "MongoDB", "AWS", "TypeScript", "Docker", "Next.js", "Java", "SQL"];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.firstName || "Recruiter");
      } catch (e) {}
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        const [cRes, sRes] = await Promise.all([
          fetch("/api/v1/hr/candidates", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/hr/shortlist", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const cData = await cRes.json();
        const sData = await sRes.json();

        if (cData.success) {
          const candidates = cData.data || [];
          const shortlists = sData.success ? sData.data || [] : [];

          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const newCands = candidates.filter((c: any) => new Date(c.createdAt) > oneDayAgo).length;
          const avgScore = shortlists.length > 0
            ? Math.round(shortlists.reduce((acc: number, curr: any) => acc + (curr.matchScore || 0), 0) / shortlists.length)
            : 0;

          setStats({ total: candidates.length, shortlisted: shortlists.length, newCandidates: newCands, avgMatchScore: avgScore });
          setAllCandidates(candidates);
          setShortlistedCandidates(shortlists);
        }
      } catch (err) {
        console.error("Failed to load HR dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Toggle experience filter
  const toggleExp = (val: string) => {
    setExpFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  // Toggle skill filter
  const toggleSkill = (skill: string) => {
    setSkillFilters(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  // Clear all filters
  const clearFilters = () => {
    setRoleFilter("all");
    setExpFilter([]);
    setSkillFilters([]);
    setSkillSearch("");
  };

  // Get filtered candidates based on active tab
  const getFilteredCandidates = () => {
    let candidates = allCandidates;

    // Tab filter
    if (activeTab === "new") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      candidates = candidates.filter(c => new Date(c.createdAt) > oneDayAgo);
    }

    // Skills filter
    if (skillFilters.length > 0) {
      candidates = candidates.filter(c =>
        skillFilters.every(skill => c.skills?.some((s: string) => s.toLowerCase().includes(skill.toLowerCase())))
      );
    }

    // Sort
    if (sortBy === "score") {
      candidates = [...candidates].sort((a, b) => (b.completionScore || 0) - (a.completionScore || 0));
    }

    return candidates;
  };

  const filteredCandidates = getFilteredCandidates();
  const topMatches = [...allCandidates].sort((a, b) => (b.completionScore || 0) - (a.completionScore || 0)).slice(0, 3);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-white/50 text-sm">Here&apos;s what&apos;s happening with your hiring pipeline today</p>
        </div>
        <Link href="/hr/jobs/new" className="hidden md:flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-teal-500/20">
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={Users} label="Total Candidates" value={stats.total}
          sub={`+${stats.newCandidates} this week`} subColor="text-emerald-400"
          iconBg="bg-teal-500/15" iconColor="text-teal-400"
        />
        <StatCard
          icon={UserPlus} label="New Applications" value={stats.newCandidates}
          sub="Last 24 hours" subColor="text-white/40"
          iconBg="bg-violet-500/15" iconColor="text-violet-400"
        />
        <StatCard
          icon={Heart} label="Shortlisted" value={stats.shortlisted}
          sub={`↑ ${stats.shortlisted} added today`} subColor="text-emerald-400"
          iconBg="bg-emerald-500/15" iconColor="text-emerald-400"
        />
        <StatCard
          icon={TrendingUp} label="Avg. Match Score" value={`${stats.avgMatchScore}%`}
          sub="Across all roles" subColor="text-white/40"
          iconBg="bg-cyan-500/15" iconColor="text-cyan-400"
        />
      </div>

      {/* Main Content: Candidates List + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

        {/* LEFT: Tabbed Candidate List + Filters */}
        <div className="space-y-0">

          {/* Tabs Row */}
          <div className="flex flex-wrap items-center gap-1 border-b border-white/10 mb-0">
            {([
              { key: "all", label: `All Candidates (${stats.total})` },
              { key: "new", label: "New" },
              { key: "shortlisted", label: `Shortlisted (${stats.shortlisted})` },
              { key: "rejected", label: "Rejected" },
            ] as { key: TabType; label: string }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-teal-400 text-teal-400"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-white/30 text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-teal-500/50 cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="score">Match Score</option>
              </select>
            </div>
          </div>

          {/* Content Row: Filters + Candidates */}
          <div className="flex gap-5 pt-5">

            {/* Filters Panel (Left) */}
            <div className="w-[220px] shrink-0 space-y-5 hidden lg:block">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-white/40 hover:text-teal-400 transition-colors">Clear All</button>
              </div>

              {/* Search skills */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500/50"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-2 block">Job Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2.5 outline-none focus:border-teal-500/50 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="backend">Backend Developer</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="fullstack">Full Stack Developer</option>
                  <option value="ml">Machine Learning Engineer</option>
                  <option value="data">Data Scientist</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-2 block">Experience</label>
                <div className="space-y-2">
                  {["Fresher (0-1 yr)", "Junior (1-3 yrs)", "Mid (3-5 yrs)", "Senior (5+ yrs)"].map(exp => (
                    <label key={exp} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={expFilter.includes(exp)}
                        onChange={() => toggleExp(exp)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-teal-500"
                      />
                      <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        skillFilters.includes(skill)
                          ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                          : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {skill} {skillFilters.includes(skill) ? "✕" : ""}
                    </button>
                  ))}
                </div>
                <button className="text-teal-400 text-[11px] mt-2 hover:text-teal-300">+ Add more</button>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Apply Filters
              </button>
            </div>

            {/* Candidate Cards List */}
            <div className="flex-1 space-y-3 min-w-0">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-[88px] bg-white/5 rounded-xl" />)}
                </div>
              ) : filteredCandidates.length > 0 ? (
                filteredCandidates.slice(0, 8).map(candidate => (
                  <CandidateRow key={candidate.id} candidate={candidate} />
                ))
              ) : (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No candidates match the current filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Insights Panel */}
        <div className="space-y-5">
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">AI Insights</h3>
              </div>
              <Link href="/hr/candidates" className="text-xs text-teal-400 hover:text-teal-300">View All</Link>
            </div>

            {/* Top Matching Candidates */}
            <div className="p-5 border-b border-white/5">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Top Matching Candidates</p>
              <div className="space-y-3">
                {topMatches.length > 0 ? topMatches.map((c, i) => (
                  <Link href={`/hr/candidates/${c.id}`} key={c.id} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate group-hover:text-teal-400 transition-colors">{c.name}</p>
                      <p className="text-[11px] text-white/40 truncate">{c.targetRole || "Unknown role"}</p>
                    </div>
                    <div className={`text-sm font-bold ${
                      (c.completionScore || 0) >= 85 ? "text-emerald-400" :
                      (c.completionScore || 0) >= 70 ? "text-amber-400" : "text-white/50"
                    }`}>
                      {c.completionScore || 0}%
                    </div>
                  </Link>
                )) : (
                  <p className="text-xs text-white/30 italic">No candidates to show yet.</p>
                )}
              </div>
            </div>

            {/* Missing Skills in Pipeline */}
            <div className="p-5 border-b border-white/5">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Missing Skills in Pipeline</p>
              <div className="flex flex-wrap gap-2">
                {["Docker", "AWS", "Kubernetes", "GraphQL"].map(skill => (
                  <span key={skill} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white/70 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="p-5">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Recommended Actions</p>
              <div className="space-y-2.5">
                {[
                  "Review 12 new applications",
                  `Schedule interviews for ${stats.shortlisted} candidates`,
                  "Update job description for better matches",
                ].map((action, i) => (
                  <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-teal-500" />
                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">{action}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Stat Card ────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, subColor, iconBg, iconColor }: {
  icon: any; label: string; value: string | number; sub: string; subColor: string; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-[#0a111a] border border-white/[0.08] rounded-2xl p-4 md:p-5 flex items-center gap-4 group hover:border-white/15 transition-colors relative overflow-hidden">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className={`text-[11px] mt-0.5 ${subColor}`}>{sub}</p>
      </div>
      <button className="absolute top-3 right-3 text-white/20 hover:text-white/50 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Candidate Row ────────────────────────────────────── */
function CandidateRow({ candidate }: { candidate: any }) {
  const score = candidate.completionScore || 0;
  let scoreColor = "text-red-400 border-red-500/30 bg-red-500/10";
  if (score >= 60) scoreColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
  if (score >= 80) scoreColor = "text-teal-400 border-teal-500/30 bg-teal-500/10";

  return (
    <Link
      href={`/hr/candidates/${candidate.id}`}
      className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-teal-500/20 rounded-xl px-4 py-3.5 transition-all group"
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {candidate.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors truncate">{candidate.name}</h4>
        <p className="text-[11px] text-white/40 truncate">{candidate.targetRole || "No role specified"}</p>
      </div>

      {/* Skills chips */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {(candidate.skills || []).slice(0, 3).map((skill: string) => (
          <span key={skill} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] text-white/60">{skill}</span>
        ))}
        {(candidate.skills?.length || 0) > 3 && (
          <span className="text-[10px] text-white/30">+{candidate.skills.length - 3}</span>
        )}
      </div>

      {/* Experience */}
      <div className="hidden sm:flex items-center gap-1 text-white/40 text-xs shrink-0">
        <Clock className="w-3 h-3" />
        {candidate.experienceCount || 0} yrs
      </div>

      {/* Score Badge */}
      <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 ${scoreColor}`}>
        <span className="text-sm font-bold leading-none">{score}%</span>
        <span className="text-[8px] mt-0.5 opacity-70">Match</span>
      </div>

      {/* More */}
      <button className="text-white/20 hover:text-white/50 transition-colors shrink-0" onClick={(e) => e.preventDefault()}>
        <MoreVertical className="w-4 h-4" />
      </button>
    </Link>
  );
}

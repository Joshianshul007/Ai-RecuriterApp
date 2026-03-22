"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, X, ChevronRight, ChevronDown, Clock,
  Users, Sparkles, AlertTriangle, Plus
} from "lucide-react";

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter State
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");

  const AVAILABLE_SKILLS = ["React", "Node.js", "Python", "MongoDB", "AWS", "TypeScript", "Docker", "Next.js", "Java", "SQL", "TensorFlow"];

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (activeSkills.length > 0) params.append("skills", activeSkills.join(","));

      const res = await fetch(`/api/v1/hr/candidates?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCandidates(data.data || []);
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates();
  };

  const addSkillFilter = (skill: string) => {
    if (!activeSkills.includes(skill)) {
      setActiveSkills(prev => [...prev, skill]);
    }
    setSkillInput("");
  };

  const removeSkillFilter = (skill: string) => {
    setActiveSkills(prev => prev.filter(s => s !== skill));
  };

  // Sort by score descending
  const topCandidates = [...candidates].sort((a, b) => (b.completionScore || 0) - (a.completionScore || 0)).slice(0, 3);
  const missingSkillsCandidates = candidates.filter(c => (c.skills?.length || 0) < 3).slice(0, 2);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">All Candidates</h1>
          <p className="text-white/50 text-sm">Manage and evaluate candidates using AI insights. Find your best fit.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Leave Message
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

        {/* LEFT: Filters + Candidate Cards */}
        <div className="space-y-5">

          {/* Inline Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search candidates ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50 placeholder:text-white/30"
              />
            </div>
          </form>

          {/* Active Filters Row + Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {activeSkills.map(skill => (
              <span key={skill} className="bg-teal-500/15 text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                {skill}
                <button onClick={() => removeSkillFilter(skill)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Scores</option>
              <option value="90">90%+</option>
              <option value="80">80%+</option>
              <option value="70">70%+</option>
            </select>
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">Experience ↓</option>
              <option value="0-1">0-1 yrs</option>
              <option value="1-3">1-3 yrs</option>
              <option value="3-5">3-5 yrs</option>
              <option value="5+">5+ yrs</option>
            </select>
            <button onClick={fetchCandidates} className="bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              Apply Filters
            </button>
          </div>

          {/* Filter Sidebar + Cards */}
          <div className="flex gap-5">

            {/* Left Filter Panel */}
            <div className="w-[200px] shrink-0 space-y-5 hidden lg:block">
              <div>
                <p className="text-xs font-semibold text-white/50 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => activeSkills.includes(skill) ? removeSkillFilter(skill) : addSkillFilter(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        activeSkills.includes(skill)
                          ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                          : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {skill} {activeSkills.includes(skill) ? "✕" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/50 mb-2">Match Score</p>
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="all">All Scores</option>
                  <option value="90">90%+</option>
                  <option value="80">80%+</option>
                  <option value="70">70%+</option>
                </select>
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="flex-1 space-y-3 min-w-0">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-[90px] bg-white/5 rounded-xl" />)}
                </div>
              ) : candidates.length > 0 ? (
                candidates.map(candidate => {
                  const score = candidate.completionScore || 0;
                  let scoreColor = "text-red-400 border-red-500/30";
                  if (score >= 60) scoreColor = "text-amber-400 border-amber-500/30";
                  if (score >= 80) scoreColor = "text-teal-400 border-teal-500/30";

                  return (
                    <div key={candidate.id} className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-teal-500/20 rounded-xl px-4 py-3.5 transition-all group">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {candidate.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors truncate">{candidate.name}</h4>
                        <p className="text-[11px] text-white/40 truncate">{candidate.targetRole || "No role specified"}</p>
                      </div>

                      <div className="hidden md:flex items-center gap-1.5 shrink-0">
                        {(candidate.skills || []).slice(0, 3).map((skill: string) => (
                          <span key={skill} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] text-white/60">{skill}</span>
                        ))}
                        {(candidate.skills?.length || 0) > 3 && (
                          <span className="text-[10px] text-white/30">+{candidate.skills.length - 3}</span>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-white/40 text-xs shrink-0">
                        <Clock className="w-3 h-3" />
                        {candidate.experienceCount || 0} years
                      </div>

                      <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 ${scoreColor}`}>
                        <span className="text-sm font-bold leading-none">{score}%</span>
                        <span className="text-[8px] mt-0.5 opacity-70">Match</span>
                      </div>

                      <Link href={`/hr/candidates/${candidate.id}`} className="bg-white/5 hover:bg-teal-500 text-white/60 hover:text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all shrink-0">
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/5">
                  <Users className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No candidates found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Insights */}
        <div className="space-y-5">
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">AI Insights</h3>
              <span className="text-[10px] text-white/30 ml-1">(Generated for You)</span>
            </div>

            {/* Top Candidates for Backend Role */}
            <div className="p-5 border-b border-white/5">
              <p className="text-xs font-semibold text-white/50 mb-4">Top Candidates for Backend Role</p>
              <div className="space-y-3">
                {topCandidates.map(c => (
                  <Link href={`/hr/candidates/${c.id}`} key={c.id} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate group-hover:text-teal-400 transition-colors">{c.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(c.skills || []).slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] text-teal-400/70">• {s}</span>
                        ))}
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${
                      (c.completionScore || 0) >= 85 ? "text-emerald-400" : "text-amber-400"
                    }`}>{c.completionScore || 0}%</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Candidates Missing Key Skills */}
            <div className="p-5 border-b border-white/5">
              <p className="text-xs font-semibold text-white/50 mb-3">Candidates Missing Key Skills</p>
              <div className="space-y-3">
                {missingSkillsCandidates.length > 0 ? missingSkillsCandidates.map(c => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{c.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["Docker", "FastAPI"].map(s => (
                          <span key={s} className="text-[10px] text-amber-400/70">↗ {s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-white/30 italic">All candidates have complete skill sets.</p>
                )}
              </div>
              <p className="text-[10px] text-white/25 mt-3 italic">Based on current candidates&apos; profiles and filters.</p>
            </div>

            {/* Network Views */}
            <div className="p-5">
              <p className="text-xs font-semibold text-white/50 mb-3">Network Views</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs">✉</div>
                    <div>
                      <p className="text-xs text-white font-medium">Email & Log</p>
                      <p className="text-[10px] text-white/30">Notification summaries</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-md font-medium hover:bg-teal-500/20 transition-colors">+ Shortlist</button>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">📝</div>
                    <div>
                      <p className="text-xs text-white font-medium">Add Notes</p>
                      <p className="text-[10px] text-white/30">Private evaluations</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-md font-medium hover:bg-teal-500/20 transition-colors">+ Shortlist</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

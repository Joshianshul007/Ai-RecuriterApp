"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Target,
  BriefcaseBusiness,
  Code2,
  FileText,
  CheckCircle2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
interface ProjectResult {
  rawInput: string;
  enhancedDescription: string;
  extractedSkills: string[];
  projectSummary: string;
  suggestedRoles: string[];
  approved: boolean;
}

interface ExperienceResult {
  rawInput: string;
  enhancedDescription: string;
  extractedSkills: string[];
  suggestedTitle: string;
  approved: boolean;
}

interface SummaryResult {
  summary: string;
  recommendedRoles: string[];
  suggestedSkills: string[];
}

const STEPS = [
  { id: 0, label: "Skills", icon: Code2 },
  { id: 1, label: "Projects", icon: BriefcaseBusiness },
  { id: 2, label: "Experience", icon: Target },
  { id: 3, label: "Summary", icon: FileText },
];

export default function BuildProfilePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 0: Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Step 1: Projects
  const [projectInput, setProjectInput] = useState("");
  const [projects, setProjects] = useState<ProjectResult[]>([]);

  // Step 2: Experience
  const [experienceInput, setExperienceInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceResult[]>([]);

  // Step 3: Summary
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);

  // ─── Skill Handlers ─────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // ─── Project Handler ────────────────────────────────
  const enhanceProject = async () => {
    if (!projectInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/enhance-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: projectInput }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => [
          ...prev,
          { rawInput: projectInput, ...data.data, approved: false },
        ]);
        // Auto-add extracted skills
        const newSkills = data.data.extractedSkills.filter(
          (s: string) => !skills.includes(s)
        );
        if (newSkills.length) setSkills((prev) => [...prev, ...newSkills]);
        setProjectInput("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Experience Handler ─────────────────────────────
  const enhanceExperience = async () => {
    if (!experienceInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/enhance-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: experienceInput }),
      });
      const data = await res.json();
      if (data.success) {
        setExperiences((prev) => [
          ...prev,
          { rawInput: experienceInput, ...data.data, approved: false },
        ]);
        const newSkills = data.data.extractedSkills.filter(
          (s: string) => !skills.includes(s)
        );
        if (newSkills.length) setSkills((prev) => [...prev, ...newSkills]);
        setExperienceInput("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Summary Handler ───────────────────────────────
  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          projects: projects.map((p) => p.enhancedDescription),
          experiences: experiences.map((e) => e.enhancedDescription),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSummaryResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Save Profile ──────────────────────────────────
  const saveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills,
          projects: projects.map((p) => ({
            rawInput: p.rawInput,
            aiEnhanced: p.enhancedDescription,
            approved: p.approved,
          })),
          experiences: experiences.map((e) => ({
            rawInput: e.rawInput,
            aiEnhanced: e.enhancedDescription,
            approved: e.approved,
          })),
          summary: summaryResult?.summary || "",
          roleRecommendations: summaryResult?.recommendedRoles || [],
        }),
      });
      alert("🎉 Profile saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-teal-400" />
          AI Profile Builder
        </h1>
        <p className="text-white/60 text-sm">
          Describe your work in simple language. Our AI will structure it professionally.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === i;
          const isCompleted =
            (i === 0 && skills.length > 0) ||
            (i === 1 && projects.length > 0) ||
            (i === 2 && experiences.length > 0) ||
            (i === 3 && summaryResult !== null);

          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : isCompleted
                  ? "text-emerald-400/80 hover:bg-white/5"
                  : "text-white/40 hover:bg-white/5"
              }`}
            >
              {isCompleted && !isActive ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area — Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: User Input (3/5 width) */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
          {/* ── Step 0: Skills ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">What are your key skills?</h2>
                <p className="text-white/50 text-sm">Add your skills manually. AI will also extract skills from your projects and experience later.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g. Python, React, Machine Learning..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-teal-500/50"
                />
                <button
                  onClick={addSkill}
                  className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 group"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="opacity-50 hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-white/30 text-sm italic">No skills added yet. Start typing above!</p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 1: Projects ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Describe a project you worked on</h2>
                <p className="text-white/50 text-sm">Write it however you like. AI will structure it professionally.</p>
              </div>
              <div className="space-y-3">
                <textarea
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  placeholder='e.g. "I built a finance extractor using AI that pulls data from invoices and bank statements using OCR and NLP..."'
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-teal-500/50 resize-none"
                />
                <button
                  onClick={enhanceProject}
                  disabled={loading || !projectInput.trim()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>

              {/* AI Results */}
              {projects.map((p, i) => (
                <div key={i} className="bg-[#0a111a] border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">You said:</p>
                      <p className="text-white/60 text-sm italic">&ldquo;{p.rawInput}&rdquo;</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const updated = [...projects];
                          updated[i].approved = true;
                          setProjects(updated);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          p.approved
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-white/40 hover:text-emerald-400"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                        className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-teal-400/80 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Enhanced:
                    </p>
                    <p className="text-white/90 text-sm leading-relaxed">{p.enhancedDescription}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.extractedSkills?.map((s) => (
                      <span key={s} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2.5 py-1 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 2: Experience ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Describe your work experience</h2>
                <p className="text-white/50 text-sm">Tell us about past roles, responsibilities, and achievements.</p>
              </div>
              <div className="space-y-3">
                <textarea
                  value={experienceInput}
                  onChange={(e) => setExperienceInput(e.target.value)}
                  placeholder='e.g. "I worked as a backend developer at a startup for 2 years. Built REST APIs using Node.js and managed a MongoDB database..."'
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-teal-500/50 resize-none"
                />
                <button
                  onClick={enhanceExperience}
                  disabled={loading || !experienceInput.trim()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>

              {/* AI Results */}
              {experiences.map((e, i) => (
                <div key={i} className="bg-[#0a111a] border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">You said:</p>
                      <p className="text-white/60 text-sm italic">&ldquo;{e.rawInput}&rdquo;</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const updated = [...experiences];
                          updated[i].approved = true;
                          setExperiences(updated);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          e.approved
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-white/40 hover:text-emerald-400"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))}
                        className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-teal-400/80 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Enhanced:
                    </p>
                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{e.enhancedDescription}</p>
                  </div>
                  {e.suggestedTitle && (
                    <p className="text-xs text-amber-400/80">
                      Suggested Title: <span className="font-semibold text-amber-300">{e.suggestedTitle}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {e.extractedSkills?.map((s) => (
                      <span key={s} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2.5 py-1 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 3: Summary ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">AI-Generated Profile Summary</h2>
                <p className="text-white/50 text-sm">Based on everything you&apos;ve added, AI will compile your professional summary.</p>
              </div>

              {!summaryResult ? (
                <button
                  onClick={generateSummary}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate My Profile Summary
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#0a111a] border border-teal-500/20 rounded-xl p-5">
                    <p className="text-xs text-teal-400/80 uppercase tracking-wider mb-2">Professional Summary</p>
                    <p className="text-white/90 text-sm leading-relaxed">{summaryResult.summary}</p>
                  </div>

                  <div className="bg-[#0a111a] border border-white/10 rounded-xl p-5">
                    <p className="text-xs text-amber-400/80 uppercase tracking-wider mb-3">Recommended Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {summaryResult.recommendedRoles?.map((role) => (
                        <span key={role} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg px-3 py-1.5 text-xs font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0a111a] border border-white/10 rounded-xl p-5">
                    <p className="text-xs text-indigo-400/80 uppercase tracking-wider mb-3">Skills to Learn</p>
                    <div className="flex flex-wrap gap-2">
                      {summaryResult.suggestedSkills?.map((skill) => (
                        <span key={skill} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-3 py-1.5 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={generateSummary}
                      disabled={loading}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white/80 px-4 py-2.5 rounded-lg text-sm transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                      Regenerate
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={loading}
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Save Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 hover:text-white px-4 py-2 rounded-lg text-sm disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={step === 3}
              className="flex items-center gap-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 px-4 py-2 rounded-lg text-sm disabled:opacity-30 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Live Preview Panel (2/5 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-5 sticky top-24">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Live Profile Preview
            </h3>

            {/* Skills */}
            <div className="mb-5">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Skills ({skills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.length > 0 ? (
                  skills.slice(0, 12).map((s) => (
                    <span key={s} className="bg-teal-500/10 text-teal-400/80 rounded-full px-2 py-0.5 text-[10px]">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-white/20 text-xs italic">No skills yet</span>
                )}
                {skills.length > 12 && (
                  <span className="text-white/30 text-[10px]">+{skills.length - 12} more</span>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="mb-5">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Projects ({projects.length})</p>
              {projects.length > 0 ? (
                projects.map((p, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-2.5 mb-2">
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2">{p.enhancedDescription}</p>
                    {p.approved && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-1" />}
                  </div>
                ))
              ) : (
                <span className="text-white/20 text-xs italic">No projects yet</span>
              )}
            </div>

            {/* Experience */}
            <div className="mb-5">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Experience ({experiences.length})</p>
              {experiences.length > 0 ? (
                experiences.map((e, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-2.5 mb-2">
                    <p className="text-amber-300/80 text-[10px] font-semibold mb-0.5">{e.suggestedTitle}</p>
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{e.enhancedDescription}</p>
                  </div>
                ))
              ) : (
                <span className="text-white/20 text-xs italic">No experience yet</span>
              )}
            </div>

            {/* Summary */}
            {summaryResult && (
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Summary</p>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-4">{summaryResult.summary}</p>
              </div>
            )}

            {/* Completion Score */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                <span>Completion</span>
                <span className="text-teal-400">
                  {Math.min(
                    100,
                    (skills.length > 0 ? 25 : 0) +
                      (projects.length > 0 ? 25 : 0) +
                      (experiences.length > 0 ? 25 : 0) +
                      (summaryResult ? 25 : 0)
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (skills.length > 0 ? 25 : 0) +
                        (projects.length > 0 ? 25 : 0) +
                        (experiences.length > 0 ? 25 : 0) +
                        (summaryResult ? 25 : 0)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  LOCATIONS,
  JobCategory,
  JobType,
  ExperienceLevel,
} from "@/constants/job";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(LOCATIONS[0].toString());
  const [category, setCategory] = useState<JobCategory>("frontend");
  const [jobType, setJobType] = useState<JobType>("full-time");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("mid");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillsInput.trim().replace(",", "");
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillsInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleEnhance = async () => {
    if (!title || !description || !category) {
      setError("Please fill out Title, Category, and Description to enhance it.");
      return;
    }

    setEnhancing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ai/enhance-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category }),
      });

      const data = await res.json();
      if (data.success) {
        setDescription(data.data.enhancedDescription);
        
        // Add new suggested skills without duplicating
        const suggested = data.data.suggestedSkills || [];
        const newSkills = [...skills];
        suggested.forEach((s: string) => {
          if (!newSkills.includes(s)) newSkills.push(s);
        });
        setSkills(newSkills);
      } else {
        setError(data.message || "Failed to enhance description.");
      }
    } catch (err) {
      setError("An error occurred while enhancing.");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !category || !description) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title,
        location,
        category,
        jobType,
        experienceLevel,
        description,
        requiredSkills: skills,
        salary: {
          min: salaryMin ? parseInt(salaryMin) : undefined,
          max: salaryMax ? parseInt(salaryMax) : undefined,
          currency: "INR",
        },
      };

      const res = await fetch("/api/v1/hr/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/hr/jobs"), 1500);
      } else {
        setError(data.message || "Failed to post job");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Job Posted Successfully!</h2>
        <p className="text-white/50 text-sm">Redirecting to your job listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <Link
        href="/hr/jobs"
        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Post a New Job
        </h1>
        <p className="text-white/50 text-sm">
          Create a new job listing to find your perfect candidate.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#0a111a] border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-4">
            Basic details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50 appearance-none"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-slate-900">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Location <span className="text-red-400">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50 appearance-none"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-slate-900">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Job Type <span className="text-red-400">*</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50 appearance-none"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Experience Level <span className="text-red-400">*</span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50 appearance-none"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value} className="bg-slate-900">
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Salary Range (Optional, INR)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
                />
                <span className="text-white/30">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a111a] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-semibold text-white">
              Job Description
            </h2>
            <button
              type="button"
              onClick={handleEnhance}
              disabled={enhancing || !title || !description}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
            >
              {enhancing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> AI Enhance
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 flex justify-between">
              <span>Description <span className="text-red-400">*</span></span>
              <span className="text-xs text-white/40 font-normal">Write a draft, and let AI polish it!</span>
            </label>
            <textarea
              placeholder="Describe the role, responsibilities, and team..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 resize-y custom-scrollbar"
            />
          </div>

          <div className="space-y-2 border-t border-white/5 pt-6">
            <label className="text-sm font-medium text-white/70 block mb-2">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-teal-400/50 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
            />
            <p className="text-[11px] text-white/30 mt-1.5">Press Enter or comma to add a skill</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Link
            href="/hr/jobs"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Posting...
              </>
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

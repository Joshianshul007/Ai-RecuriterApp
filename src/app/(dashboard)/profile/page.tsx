"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Briefcase, FileText, Target, Code2, Award, Download, Pencil } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  title: string;
  summary: string;
  skills: { approved: string[] };
  projects: Array<{
    aiEnhanced: string;
    extractedSkills: string[];
    projectSummary: string;
  }>;
  experience: Array<{
    aiEnhanced: string;
    suggestedTitle: string;
    extractedSkills: string[];
  }>;
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await fetch("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile({
            ...data.profile,
            name: data.user?.name || "Anonymous User",
            email: data.user?.email || "No Email Provided",
            title: data.profile.summary ? data.profile.roleRecommendations?.[0] || "Professional" : "Job Seeker",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!profile || (!profile.summary && (!profile.skills?.approved || profile.skills.approved.length === 0))) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
        <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Profile is Empty</h2>
        <p className="text-white/60">You haven&apos;t built your AI profile yet. Let&apos;s get started!</p>
        <Link
          href="/build-profile"
          className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4 inline-block"
        >
          Build AI Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 text-transparent bg-clip-text">
              My Profile
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest font-bold">
              <Award className="w-3 h-3" /> Ready
            </span>
          </h1>
          <p className="text-white/60 mt-1">This is how recruiters will see your application.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <Link
            href="/build-profile"
            className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <div className="bg-[#0a111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Top Banner */}
        <div className="h-32 bg-gradient-to-r from-teal-500/20 to-emerald-500/10 w-full relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="px-8 pb-10">
          {/* Avatar & Header Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 mb-10 relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 border-4 border-[#0a111a] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {profile.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="mt-14 md:mt-12 flex-1">
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <p className="text-teal-400 font-medium mb-3">{profile.title}</p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column (2/3 width) */}
            <div className="md:col-span-2 space-y-10">
              
              {/* Summary */}
              {profile.summary && (
                <section>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <FileText className="w-4 h-4 text-teal-500" />
                    Professional Summary
                  </h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {profile.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {profile.experience && profile.experience.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Target className="w-4 h-4 text-teal-500" />
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-teal-500/20">
                        <div className="absolute w-2 h-2 bg-teal-500 rounded-full -left-[5px] top-1.5" />
                        <h4 className="text-white font-semibold mb-1">{exp.suggestedTitle}</h4>
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line mb-3">
                          {exp.aiEnhanced}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.extractedSkills?.map((s) => (
                            <span key={s} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/5">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Briefcase className="w-4 h-4 text-teal-500" />
                    Projects
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {profile.projects.map((proj, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors relative">
                        <h4 className="text-white font-semibold mb-2 line-clamp-1">{proj.projectSummary}</h4>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                          {proj.aiEnhanced}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.extractedSkills?.map((s) => (
                            <span key={s} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Column (1/3 width) - Sidebar */}
            <div className="space-y-8">
              
              {/* Skills */}
              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Code2 className="w-4 h-4 text-teal-500" />
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.approved?.length > 0 ? (
                    profile.skills.approved.map((skill) => (
                      <span
                        key={skill}
                        className="bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg px-3 py-1.5 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-white/40 text-sm italic">No skills added.</p>
                  )}
                </div>
              </section>

              {/* Additional Details (Optional metadata) */}
              <section>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <p className="text-white/80 text-sm font-medium mb-1">Status:</p>
                  <p className="text-teal-400/80 text-xs leading-relaxed mb-4">
                    Actively Interviewing
                  </p>

                  <p className="text-white/80 text-sm font-medium mb-1">Target Role:</p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {profile.title}
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

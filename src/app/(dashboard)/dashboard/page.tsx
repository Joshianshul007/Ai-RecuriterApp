"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Target, 
  BriefcaseBusiness, 
  Plus, 
  Clock 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    // 1. Optimistic load
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFirstName(user.firstName || "User");
      } catch (e) {}
    }

    // 2. Network verification fallback
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setFirstName(data.user.firstName);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(console.error);
    }
  }, []);

  // Mock data for UI development
  const profileCompletion = 45;
  const missingSections = [
    { name: "Add Projects", isComplete: false },
    { name: "Add Experience", isComplete: false },
    { name: "Basic Details", isComplete: true },
  ];
  
  const suggestedRoles = ["Backend Developer", "Machine Learning Engineer", "Data Scientist"];
  const suggestedSkills = ["Node.js", "Python", "MongoDB", "TensorFlow"];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {firstName}</h1>
        <p className="text-white/60">
          Build your AI-powered profile and let opportunities find you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Actions) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Completion Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Profile Completion</h2>
                <p className="text-white/60 text-sm">You are almost there! Complete your profile to stand out.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-teal-400">{profileCompletion}%</span>
              </div>
            </div>

            <Progress value={profileCompletion} className="h-2 bg-white/10 mb-6 relative z-10" />

            <div className="space-y-3 mb-8 relative z-10">
              {missingSections.map((section) => (
                <div key={section.name} className="flex items-center gap-3">
                  {section.isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/30" />
                  )}
                  <span className={section.isComplete ? "text-white/50 line-through text-sm" : "text-white/80 text-sm"}>
                    {section.name}
                  </span>
                </div>
              ))}
            </div>

            <Link 
              href="/build-profile" 
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors relative z-10"
            >
              Complete Profile
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/build-profile" className="group bg-white/5 border border-white/10 hover:border-teal-500/50 rounded-xl p-5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-white font-medium mb-1">Add Experience</h3>
              <p className="text-white/50 text-sm">Let AI structure your past roles.</p>
            </Link>
            
            <Link href="/build-profile" className="group bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-xl p-5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <BriefcaseBusiness className="w-5 h-5" />
              </div>
              <h3 className="text-white font-medium mb-1">Add Project</h3>
              <p className="text-white/50 text-sm">Got a new project? Add it here.</p>
            </Link>
          </div>
          
        </div>

        {/* Right Column (AI Suggestions) */}
        <div className="space-y-6">
          
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">AI Suggestions</h2>
            </div>
            
            <div className="space-y-6">
              {/* Suggested Roles */}
              <div>
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  Top Matching Roles
                </h3>
                <div className="space-y-2">
                  {suggestedRoles.map(role => (
                    <div key={role} className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white/90">
                      {role}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Skills */}
              <div>
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Skills to Add
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(skill => (
                    <button key={skill} className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-full px-3 py-1 text-xs transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-transparent border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/90">Registered account</p>
                  <p className="text-xs text-white/40 mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/50">AI Summary Generated</p>
                  <p className="text-xs text-white/30 mt-0.5">Pending profile completion</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

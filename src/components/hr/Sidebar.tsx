"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Heart, Scale, Briefcase,
  Sparkles, ScanSearch, BarChart3, ChevronUp, LogOut,
  Settings, User
} from "lucide-react";

export default function HRSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Recruiter");
  const [shortlistCount, setShortlistCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName([user.firstName, user.lastName].filter(Boolean).join(" ") || "Recruiter");
      } catch (e) {}
    }

    // Fetch shortlist count
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/v1/hr/shortlist", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setShortlistCount(data.data?.length || 0);
      } catch (e) {}
    };
    fetchCount();
  }, []);

  const MAIN_NAV = [
    { label: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
    { label: "Candidates", href: "/hr/candidates", icon: Users },
    { label: "Job Postings", href: "/hr/jobs", icon: Briefcase },
    { label: "Shortlisted", href: "/hr/shortlisted", icon: Heart, badge: shortlistCount },
    { label: "Compare", href: "/hr/compare", icon: Scale },
  ];

  const AI_NAV = [
    { label: "AI Match Score", href: "/hr/candidates", icon: Sparkles },
    { label: "Screening", href: "/hr/candidates", icon: ScanSearch },
    { label: "Reports", href: "/hr/dashboard", icon: BarChart3 },
  ];

  const isActive = (href: string, label: string) => {
    if (label === "Dashboard") return pathname === "/hr/dashboard";
    if (label === "AI Match Score" || label === "Screening" || label === "Reports") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="w-[260px] bg-[#0a111a] border-r border-white/5 h-full flex-col hidden md:flex">
      
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/5 shrink-0">
        <Link href="/hr/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            AAI <span className="bg-gradient-to-r from-teal-400 to-emerald-400 text-transparent bg-clip-text">Recruiter</span>
          </span>
        </Link>
      </div>

      {/* Scrollable Nav Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-6">
        
        {/* MAIN Section */}
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-3 mb-3">Main</p>
          <nav className="space-y-1">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.label);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    active
                      ? "bg-teal-500/15 text-teal-400"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-teal-500/20 text-teal-400 text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI TOOLS Section */}
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-3 mb-3">AI Tools</p>
          <nav className="space-y-1">
            {AI_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade to Pro Card */}
        <div className="mx-1 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <p className="text-sm font-bold text-white">Upgrade to Pro</p>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mb-3">
            Unlock advanced filtering & team collaboration
          </p>
          <button className="w-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors border border-white/10">
            Upgrade
          </button>
        </div>

      </div>

      {/* Bottom: User Profile */}
      <div className="border-t border-white/5 p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-white/40">HR Manager</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-white/30 hover:text-red-400 p-1 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

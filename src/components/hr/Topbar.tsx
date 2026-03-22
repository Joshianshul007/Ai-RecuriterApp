"use client";

import { useEffect, useState } from "react";
import { Search, Bell, HelpCircle, User } from "lucide-react";

export default function HRTopbar() {
  const [userName, setUserName] = useState("JR");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "JR";
        setUserName(initials);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="h-[72px] border-b border-white/5 bg-[#0a111a] px-6 flex items-center justify-between shrink-0">
      
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-teal-400 transition-colors" />
          <input
            type="text"
            placeholder="Search candidates by name, skill, role..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-16 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/40 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-white/20 font-mono bg-white/5 px-1.5 py-0.5 rounded">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-6">
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 flex items-center justify-center transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a111a]"></span>
        </button>
        
        <button className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 flex items-center justify-center transition-colors">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>

        <div className="w-px h-6 bg-white/10 mx-2"></div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-teal-500/20 transition-all">
          {userName}
        </div>
      </div>
    </div>
  );
}

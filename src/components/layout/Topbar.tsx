"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function Topbar() {
  const [userName, setUserName] = useState("Loading...");
  const [initials, setInitials] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileCompletion = 45; // Placeholder percentage
  const lastSaved = "Saved just now"; 

  useEffect(() => {
    // 1. Optimistic load from local cache
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const fullName = `${user.firstName} ${user.lastName}`;
        setUserName(fullName);
        setInitials(user.firstName.charAt(0) + user.lastName.charAt(0));
        if (user.avatar) setAvatar(user.avatar);
      } catch (e) {}
    }

    // 2. Fetch fresh data from backend (handles old tokens without cached user)
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          const u = data.user;
          const fullName = `${u.firstName} ${u.lastName}`;
          setUserName(fullName);
          setInitials(u.firstName.charAt(0) + u.lastName.charAt(0));
          if (u.avatar) setAvatar(u.avatar);
          localStorage.setItem("user", JSON.stringify(u));
        }
      })
      .catch(console.error);
    } else {
      setUserName("Guest User");
      setInitials("GU");
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 for easy DB storage
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploading(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/v1/users/avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: base64String }),
        });

        const data = await res.json();
        if (data.success) {
          setAvatar(base64String);
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            user.avatar = base64String;
            localStorage.setItem("user", JSON.stringify(user));
          }
        } else {
          alert("Failed to upload avatar: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading avatar");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#070e17]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      
      {/* Auto-save Status */}
      <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
        {lastSaved}
      </div>

      {/* Progress & User */}
      <div className="flex items-center gap-6">
        
        {/* Profile Completion Bar */}
        <div className="hidden md:flex items-center gap-3 w-48">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
              <span>Profile</span>
              <span className="text-teal-400">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-1.5 bg-white/10" />
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 hidden md:block" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{userName}</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Job Seeker</span>
          </div>
          
          {/* Avatar Upload Container */}
          <div 
            onClick={handleAvatarClick}
            className="group relative w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/30 overflow-hidden cursor-pointer hover:border-teal-400 transition-colors"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Upload className="w-4 h-4 text-white" />}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
        
      </div>
    </header>
  );
}

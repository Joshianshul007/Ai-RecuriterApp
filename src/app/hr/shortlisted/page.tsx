"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, ChevronRight, UserMinus } from "lucide-react";

export default function ShortlistedPage() {
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }
        
        const res = await fetch("/api/v1/hr/shortlist", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setShortlisted(data.data || []);
      } catch (err) {
        console.error("Failed to load shortlists", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShortlists();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Star className="w-8 h-8 text-emerald-400" /> Saved Candidates
        </h1>
        <p className="text-white/60">Review your shortlisted talent pool and custom evaluations.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl"></div>)}
        </div>
      ) : shortlisted.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shortlisted.map((candidate) => (
            <div key={candidate.id} className="bg-[#0a111a] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition-colors flex flex-col h-full">
              
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0D141F&color=14B8A6`} 
                    alt={candidate.name}
                    className="w-14 h-14 rounded-full border border-white/10"
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg">{candidate.name}</h3>
                    <p className="text-teal-400 text-sm font-medium">{candidate.targetRole}</p>
                  </div>
                </div>

                {candidate.matchScore > 0 && (
                  <div className="text-right">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-0.5">Match Score</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      {candidate.matchScore}%
                    </p>
                  </div>
                )}
              </div>

              {candidate.notes && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 flex-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Your Notes
                  </p>
                  <p className="text-white/80 text-sm italic line-clamp-3">"{candidate.notes}"</p>
                </div>
              )}

              <div className="mt-auto flex gap-3 pt-4 border-t border-white/5">
                <Link href={`/hr/candidates/${candidate.id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  Full Evaluation <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-2xl">
          <UserMinus className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No shortlists yet</h3>
          <p className="text-white/50 mb-6">You haven't saved any candidates. Head to the talent pool to start evaluating.</p>
          <Link href="/hr/candidates" className="inline-flex bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Browse Candidates
          </Link>
        </div>
      )}
    </div>
  );
}

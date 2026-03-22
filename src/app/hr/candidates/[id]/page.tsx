"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Star, XCircle, FileText, CheckCircle2,
  BriefcaseBusiness, GraduationCap, MapPin, Mail, Phone, ExternalLink, Sparkles, AlertTriangle, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Shortlist State
  const [status, setStatus] = useState<"pending" | "shortlisted" | "rejected">("pending");
  const [notes, setNotes] = useState("");
  const [savingAction, setSavingAction] = useState(false);

  // AI Match Score State
  const [targetRole, setTargetRole] = useState("");
  const [matchData, setMatchData] = useState<{ matchScore?: number, strengths?: string[], missingSkills?: string[] } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        
        const res = await fetch(`/api/v1/hr/candidates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        
        if (data.success) {
          setCandidate(data.candidate);
          if (data.shortlistStatus) {
            setStatus(data.shortlistStatus.status);
            setNotes(data.shortlistStatus.notes || "");
            if (data.shortlistStatus.matchScore) {
              setMatchData({ matchScore: data.shortlistStatus.matchScore });
            }
          }
        } else {
          toast.error("Candidate not found");
          router.push("/hr/candidates");
        }
      } catch (err) {
        console.error("Failed to load candidate", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id, router]);

  const handleAction = async (newStatus: "shortlisted" | "rejected") => {
    try {
      setSavingAction(true);
      const token = localStorage.getItem("token");
      await fetch(`/api/v1/hr/shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          candidateId: id,
          status: newStatus,
          notes,
          matchScore: matchData?.matchScore
        })
      });
      setStatus(newStatus);
      toast.success(`Candidate ${newStatus === "shortlisted" ? "shortlisted" : "rejected"}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setSavingAction(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingAction(true);
      const token = localStorage.getItem("token");
      await fetch(`/api/v1/hr/shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ candidateId: id, status, notes, matchScore: matchData?.matchScore })
      });
      toast.success("Notes saved");
    } catch (err) {
      toast.error("Failed to save notes");
    } finally {
      setSavingAction(false);
    }
  };

  const handleAnalyzeMatch = async () => {
    if (!targetRole.trim()) { toast.error("Enter a target job role description first"); return; }
    try {
      setAnalyzing(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/ai/match-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ candidateProfile: candidate.profile, jobRoleDescription: targetRole })
      });
      const data = await res.json();
      
      if (data.success && data.match) {
        setMatchData(data.match);
        toast.success("AI Analysis Complete");
      }
    } catch (err) {
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-8 max-w-6xl mx-auto"><div className="h-48 bg-white/5 rounded-2xl"></div></div>;
  }
  if (!candidate) return null;

  const profile = candidate.profile;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/hr/candidates" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-white flex-1">Candidate Profile</h1>
        
        {/* Quick Status Tag */}
        {status === "shortlisted" && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold flex items-center gap-2">
            <Star className="w-4 h-4" /> Shortlisted
          </div>
        )}
        {status === "rejected" && (
          <div className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Rejected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Details */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] pointer-events-none rounded-full" />
            <div className="flex items-start gap-6 relative z-10">
              <img 
                src={candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0D141F&color=14B8A6&size=128`} 
                alt={candidate.name}
                className="w-24 h-24 rounded-2xl border-2 border-white/10"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{candidate.name}</h1>
                <p className="text-teal-400 text-lg font-medium mb-4">{profile?.basics?.targetRole || profile?.roleRecommendations?.[0] || "No role specified"}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/40" />
                    {candidate.email}
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-white/40" />
                      {candidate.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profile?.summary && (
            <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Professional Summary
              </h2>
              <p className="text-white/90 leading-relaxed">{profile.summary}</p>
            </div>
          )}

          {/* Core Skills */}
          {profile?.skills?.approved?.length > 0 && (
            <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.approved.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile?.experience?.length > 0 && (
            <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4" /> Work Experience
              </h2>
              <div className="space-y-8">
                {profile.experience.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l border-white/10">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    <h3 className="text-lg font-bold text-white mb-1">{exp.suggestedTitle || "Professional Role"}</h3>
                    <div className="text-white/80 whitespace-pre-line text-sm leading-relaxed mb-3">
                      {exp.aiEnhanced}
                    </div>
                    {exp.extractedSkills && exp.extractedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {exp.extractedSkills.map((s: string) => (
                          <span key={s} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile?.projects?.length > 0 && (
            <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-6 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Key Projects
              </h2>
              <div className="space-y-6">
                {profile.projects.map((proj: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                    <h3 className="text-white font-bold mb-2">{proj.projectSummary || "Project"}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">{proj.aiEnhanced}</p>
                    {proj.extractedSkills && proj.extractedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-white/5">
                        {proj.extractedSkills.map((s: string) => (
                          <span key={s} className="text-xs text-white/50 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-teal-500/50"></span> {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Insights & Actions Panel */}
        <div className="space-y-6">
          
          {/* AI Match System (CORE FEATURE) */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-[#0a111a] border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" /> AI Insights Profile Match
            </h2>

            {!matchData ? (
              <div className="space-y-4">
                <p className="text-white/60 text-sm">Describe the target job role to generate a deep technical analysis of this candidate's fit.</p>
                <textarea
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Node.js Developer with AWS and Docker experience..."
                  className="w-full bg-[#060c14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500/50 outline-none resize-none h-24"
                />
                <button
                  onClick={handleAnalyzeMatch}
                  disabled={analyzing}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <>Run AI Assessment</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center pt-2">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Match Score</p>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 inline-block">
                    {matchData.matchScore || 0}%
                  </div>
                </div>

                {matchData.strengths && matchData.strengths.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {matchData.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-white/70 bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-lg leading-snug">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchData.missingSkills && matchData.missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Missing Requirements
                    </h3>
                    <ul className="space-y-2">
                      {matchData.missingSkills.map((s, i) => (
                        <li key={i} className="text-sm text-white/70 bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-lg leading-snug">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  onClick={() => setMatchData(null)}
                  className="text-indigo-400 text-xs hover:text-indigo-300 w-full text-center"
                >
                  Run against a different role
                </button>
              </div>
            )}
          </div>

          {/* Action Board */}
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest">
              Recruiter Actions
            </h2>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("shortlisted")}
                disabled={savingAction}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  status === "shortlisted" 
                    ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "bg-white/5 text-white/70 hover:bg-emerald-500/20 hover:text-emerald-400"
                }`}
              >
                <Star className="w-4 h-4" /> Shortlist
              </button>
              <button
                onClick={() => handleAction("rejected")}
                disabled={savingAction}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  status === "rejected" 
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
                    : "bg-white/5 text-white/70 hover:bg-red-500/20 hover:text-red-400"
                }`}
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <label className="text-xs text-white/50 font-semibold mb-2 flex items-center gap-2 uppercase">
                <MessageSquare className="w-3.5 h-3.5" /> Private Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private evaluation notes..."
                className="w-full bg-[#060c14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-teal-500/50 outline-none resize-none h-32 mb-3"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingAction}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

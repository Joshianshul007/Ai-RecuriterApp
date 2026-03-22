"use client";

import { useState, useEffect } from "react";
import { Scale, Plus, X, Activity, CheckCircle2, MinusCircle } from "lucide-react";

export default function CompareCandidatesPage() {
  const [availableCandidates, setAvailableCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for picking candidates
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/v1/hr/candidates", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
          setAvailableCandidates(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const selectedCandidates = selectedIds.map(id => availableCandidates.find(c => c.id === id)).filter(Boolean);

  const toggleCandidate = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 3) return; // Max 3 comparisons
      setSelectedIds(prev => [...prev, id]);
      setIsPicking(false); // Auto close after pick
    }
  };

  const removeCandidate = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  // Compile a master list of all unique skills from selected candidates
  const allSkills = Array.from(new Set(selectedCandidates.flatMap(c => c.skills || []))).sort();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Scale className="w-8 h-8 text-indigo-400" /> Compare Candidates
        </h1>
        <p className="text-white/60">Select up to 3 candidates to evaluate their skills and experience side-by-side.</p>
      </div>

      {/* Comparison Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {selectedCandidates.map(c => (
          <div key={c.id} className="min-w-[300px] flex-1 bg-[#0a111a] border border-white/10 rounded-2xl relative">
            <button 
              onClick={() => removeCandidate(c.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 text-center border-b border-white/10">
              <img 
                src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D141F&color=14B8A6`} 
                alt={c.name}
                className="w-20 h-20 rounded-full border-2 border-white/10 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white">{c.name}</h3>
              <p className="text-white/50 text-sm mt-1">{c.targetRole}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10">
              <div className="p-4 text-center">
                <p className="text-xs text-white/40 uppercase font-semibold mb-1">Score</p>
                <p className="text-lg font-bold text-white">{c.completionScore}%</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-white/40 uppercase font-semibold mb-1">Exp.</p>
                <p className="text-lg font-bold text-white">{c.experienceCount} Roles</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add Candidate Slot */}
        {selectedIds.length < 3 && (
          <button 
            onClick={() => setIsPicking(true)}
            className="min-w-[300px] flex-1 border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center p-8 transition-colors group h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-white/70 font-medium group-hover:text-indigo-400 transition-colors">Add Candidate</p>
            <p className="text-white/40 text-sm mt-2">{3 - selectedIds.length} slots remaining</p>
          </button>
        )}
      </div>

      {/* Skills Matrix Table */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0a111a] border border-white/10 rounded-2xl overflow-hidden mt-8">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Skills Matrix</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40 bg-[#060c14]">
                  <th className="p-4 font-semibold w-1/4">Skill</th>
                  {selectedCandidates.map(c => (
                    <th key={c.id} className="p-4 font-semibold">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allSkills.map(skill => (
                  <tr key={skill} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-white/80 font-medium">{skill}</td>
                    {selectedCandidates.map(c => {
                      const hasSkill = c.skills?.includes(skill);
                      return (
                        <td key={c.id} className="p-4">
                          {hasSkill ? (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1 rounded-full text-sm font-semibold">
                              <CheckCircle2 className="w-4 h-4" /> Yes
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-white/20 w-fit px-3 py-1 rounded-full text-sm">
                              <MinusCircle className="w-4 h-4" /> -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {allSkills.length === 0 && (
                  <tr>
                    <td colSpan={selectedCandidates.length + 1} className="p-8 text-center text-white/40">
                      No skills found across selected candidates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Picker Modal */}
      {isPicking && (
        <div className="fixed inset-0 bg-[#060c14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a111a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white mb-1">Select Candidate to Compare</h2>
              <button onClick={() => setIsPicking(false)} className="text-white/50 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="animate-pulse flex flex-col gap-2">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
                </div>
              ) : availableCandidates.length === 0 ? (
                <p className="text-center text-white/40 py-8">No candidates available.</p>
              ) : (
                availableCandidates.map(c => {
                  const isSelected = selectedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCandidate(c.id)}
                      disabled={isSelected}
                      className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-colors ${
                        isSelected 
                        ? "bg-white/5 opacity-50 cursor-not-allowed" 
                        : "bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D141F&color=14B8A6`} 
                          alt={c.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-white font-bold">{c.name}</p>
                          <p className="text-white/50 text-xs">{c.targetRole}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        {isSelected ? (
                          <span className="text-indigo-400 font-medium">Selected</span>
                        ) : (
                          <span className="text-white/40">Ready</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

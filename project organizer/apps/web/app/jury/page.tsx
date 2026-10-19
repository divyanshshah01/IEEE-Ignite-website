"use client";

import React, { useEffect, useState } from "react";
import { getJuryAssignments, submitScores } from "../actions/jury";
import { getCurrentUser } from "../actions/auth";
import { CheckCircle2, Lock, ExternalLink, Scale } from "lucide-react";

export default function JuryPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const auth = await getCurrentUser();
      if (!auth.success || !auth.user) {
        window.location.href = "/";
        return;
      }
      setUser(auth.user);

      const res = await getJuryAssignments();
      if (res.success) {
        setAssignments(res.assignments || []);
        setTemplates(res.templates || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores(prev => ({ ...prev, [criterionId]: value }));
  };

  const handleSubmitEvaluation = async (assignmentId: string) => {
    // Validate we have all scores
    const assignment = assignments.find(a => a.id === assignmentId);
    const eventId = assignment?.submission?.problemStatement?.track?.eventId;
    const template = templates.find(t => t.eventId === eventId);
    
    if (!template) {
      alert("No marking scheme found for this event.");
      return;
    }

    const allCriteria = template.sections.flatMap((s: any) => s.criteria);
    const criteriaScores = allCriteria.map((c: any) => ({
      criterionId: c.id,
      score: scores[c.id] || 0
    }));

    if (criteriaScores.some((cs: any) => cs.score === 0)) {
       const confirm = window.confirm("You have criteria with a score of 0. Are you sure you want to submit?");
       if (!confirm) return;
    }

    setSubmitting(true);
    const res = await submitScores(assignmentId, criteriaScores);
    if (res.success) {
      alert("Evaluation securely submitted and locked.");
      window.location.reload();
    } else {
      alert(res.error || "Failed to submit scores");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const activeAssignment = assignments.find(a => a.id === activeAssignmentId);
  const activeTemplate = activeAssignment 
    ? templates.find(t => t.eventId === activeAssignment.submission?.problemStatement?.track?.eventId)
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar List */}
      <aside className="w-full md:w-96 flex flex-col gap-6">
        <div className="mb-4">
          <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
            <Scale className="text-cyan-400 w-8 h-8" /> JURY PORTAL
          </h1>
          <p className="text-slate-400 font-manrope mt-2">
            Welcome, Judge {user?.firstName}. Select a project below to begin your evaluation.
          </p>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {assignments.length === 0 && (
             <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-slate-500 font-manrope">
               No submissions assigned to you yet.
             </div>
          )}
          {assignments.map(a => {
            const isLocked = a.status === "SUBMITTED" || a.status === "LOCKED";
            const isActive = activeAssignmentId === a.id;
            
            return (
              <button
                key={a.id}
                onClick={() => setActiveAssignmentId(a.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all ${
                  isActive 
                    ? "bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.2)]" 
                    : "bg-[#090a0f] border-white/10 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold font-orbitron text-slate-400">
                    {a.submission?.problemStatement?.track?.event?.name || "Event"}
                  </span>
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-green-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <h3 className="font-bold text-white font-orbitron line-clamp-1">{a.submission?.team?.name}</h3>
                <p className="text-xs text-slate-500 font-manrope mt-1 line-clamp-1">
                  {a.submission?.problemStatement?.title}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Evaluation Interface */}
      <main className="flex-1">
        {!activeAssignment ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-[#090a0f] p-12 text-center">
            <Scale className="w-16 h-16 text-slate-700 mb-4" />
            <h2 className="text-2xl font-orbitron font-bold text-slate-500">SELECT A SUBMISSION</h2>
            <p className="text-slate-600 font-manrope">Choose a project from the left panel to begin evaluating.</p>
          </div>
        ) : (
          <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Status Overlay */}
            {(activeAssignment.status === "SUBMITTED" || activeAssignment.status === "LOCKED") && (
              <div className="absolute top-0 right-0 bg-green-500 text-white font-orbitron font-bold px-6 py-2 rounded-bl-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-5 h-5" /> SCORES LOCKED
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-4xl font-orbitron font-bold text-white mb-2">{activeAssignment.submission?.team?.name}</h2>
              <p className="text-slate-400 font-manrope text-lg">Solving: <span className="text-cyan-400">{activeAssignment.submission?.problemStatement?.title}</span></p>
            </div>

            {/* Submission Links */}
            <div className="flex gap-4 mb-10">
              {activeAssignment.submission?.versions[0]?.assets.map((asset: any) => (
                <a 
                  key={asset.id} 
                  href={asset.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white font-manrope text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  {asset.type === "REPOSITORY" ? "Source Code" : "Live Demo"}
                </a>
              ))}
            </div>

            {/* Evaluation Rubric */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">EVALUATION RUBRIC</h3>
              
              {!activeTemplate ? (
                <p className="text-yellow-400 font-manrope">The organizer has not defined a marking scheme for this event yet.</p>
              ) : (
                <div className="space-y-8">
                  {activeTemplate.sections.map((section: any) => (
                    <div key={section.id} className="space-y-4">
                      {section.criteria.map((crit: any) => {
                        const isLocked = activeAssignment.status === "SUBMITTED" || activeAssignment.status === "LOCKED";
                        const savedScore = activeAssignment.scores?.find((s: any) => s.criterionId === crit.id)?.score;
                        const currentVal = savedScore ?? (scores[crit.id] || 0);

                        return (
                          <div key={crit.id} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h4 className="font-bold text-white font-manrope">{crit.name}</h4>
                                <p className="text-xs text-slate-400">Weight: {crit.weight * 100}%</p>
                              </div>
                              <div className="text-xl font-orbitron font-bold text-cyan-400">
                                {currentVal} <span className="text-slate-500 text-sm">/ {crit.maxScore}</span>
                              </div>
                            </div>
                            
                            <input 
                              type="range" 
                              min="0" 
                              max={crit.maxScore} 
                              step="1"
                              value={currentVal}
                              onChange={(e) => handleScoreChange(crit.id, parseInt(e.target.value))}
                              disabled={isLocked}
                              className={`w-full h-2 rounded-full appearance-none outline-none ${isLocked ? 'bg-slate-700 cursor-not-allowed' : 'bg-cyan-900 cursor-pointer'}`}
                            />
                            <style jsx>{`
                              input[type='range']::-webkit-slider-thumb {
                                appearance: none;
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: ${isLocked ? '#94a3b8' : '#22d3ee'};
                                cursor: ${isLocked ? 'not-allowed' : 'pointer'};
                                transition: all 0.2s;
                              }
                            `}</style>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Submit Button */}
                  {!(activeAssignment.status === "SUBMITTED" || activeAssignment.status === "LOCKED") && (
                    <div className="pt-6">
                      <button 
                        onClick={() => handleSubmitEvaluation(activeAssignment.id)}
                        disabled={submitting}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold tracking-wider text-lg rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all"
                      >
                        {submitting ? "LOCKING EVALUATION..." : "SUBMIT & LOCK SCORES"}
                      </button>
                      <p className="text-center text-xs text-slate-500 font-manrope mt-3">
                        Warning: Once submitted, these scores cannot be edited. They will be sent directly to the Organizer Dashboard.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

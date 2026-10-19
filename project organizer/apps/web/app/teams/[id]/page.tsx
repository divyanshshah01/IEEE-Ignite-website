"use client";

import React, { useEffect, useState, use } from "react";
import { getTeamDetails, submitProject } from "../../actions/submissions";
import { Trophy, Github, Link as LinkIcon, Lock } from "lucide-react";

export default function TeamWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [problemId, setProblemId] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getTeamDetails(resolvedParams.id);
      if (res.success && res.team) {
        setTeam(res.team);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemId || !repoUrl) {
      alert("Problem Statement and Repository URL are required.");
      return;
    }
    
    setSubmitting(true);
    const res = await submitProject(resolvedParams.id, problemId, repoUrl, demoUrl);
    if (res.success) {
      alert("Project submitted successfully!");
      window.location.reload();
    } else {
      alert(res.error || "Failed to submit");
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

  if (!team) {
    return <div className="text-center py-20 text-white font-manrope">Team not found or access denied.</div>;
  }

  // Flatten problem statements for the dropdown
  const problemStatements = team.event?.hackathonTracks?.flatMap((t: any) => t.problemStatements) || [];
  
  const currentSubmission = team.submissions?.[0];
  const isLocked = currentSubmission?.status === "LOCKED" || currentSubmission?.status === "UNDER_REVIEW";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-white/10 flex justify-between items-end">
        <div>
          <span className="text-cyan-400 font-bold font-orbitron tracking-widest text-sm mb-2 block">
            WORKSPACE // {team.event?.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">
            {team.name}
          </h1>
          <p className="text-slate-400 font-manrope">
            Status: <span className="text-white font-bold">{team.status}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Submission Form */}
          <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-purple-400 w-6 h-6" />
              <h2 className="text-2xl font-orbitron font-bold text-white">PROJECT SUBMISSION</h2>
            </div>
            
            {isLocked ? (
              <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-xl text-center">
                <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">SUBMISSION LOCKED</h3>
                <p className="text-slate-400 font-manrope">
                  Your project has been locked for judging. Good luck!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-sm font-manrope font-bold text-slate-300 mb-2 block">
                    PROBLEM STATEMENT
                  </label>
                  <select 
                    value={problemId}
                    onChange={e => setProblemId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-manrope"
                    required
                  >
                    <option value="">-- Select the problem you solved --</option>
                    {problemStatements.map((ps: any) => (
                      <option key={ps.id} value={ps.id}>{ps.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-manrope font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" /> REPOSITORY URL (Required)
                  </label>
                  <input 
                    type="url" 
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/repo"
                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-manrope"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-manrope font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> LIVE DEMO URL (Optional)
                  </label>
                  <input 
                    type="url" 
                    value={demoUrl}
                    onChange={e => setDemoUrl(e.target.value)}
                    placeholder="https://your-project.vercel.app"
                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-manrope"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold tracking-wider text-lg rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all disabled:opacity-50"
                  >
                    {submitting ? "UPLOADING..." : (currentSubmission ? "UPDATE SUBMISSION" : "SUBMIT PROJECT")}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3 font-manrope">
                    You can update your submission until the hackathon deadline.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-6">
            <h3 className="font-orbitron font-bold text-white mb-4">CURRENT ROSTER</h3>
            <div className="space-y-3">
              {team.members.map((m: any) => (
                <div key={m.id} className="flex justify-between items-center text-sm font-manrope">
                  <span className="text-slate-300">{m.user.firstName}</span>
                  <span className={`text-xs font-bold ${m.role === 'LEADER' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {currentSubmission && (
            <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-6">
              <h3 className="font-orbitron font-bold text-white mb-2">SUBMISSION STATUS</h3>
              <span className={`inline-block px-3 py-1 text-xs font-bold font-orbitron rounded-sm ${
                currentSubmission.status === 'DRAFT' ? 'bg-slate-500/20 text-slate-400' :
                currentSubmission.status === 'SUBMITTED' ? 'bg-blue-500/20 text-blue-400' :
                currentSubmission.status === 'UNDER_REVIEW' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {currentSubmission.status}
              </span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

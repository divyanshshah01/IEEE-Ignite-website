"use client";

import React, { useEffect, useState } from "react";
import { getMyTeams, createTeam, inviteTeamMember } from "../actions/teams";
import { getPublicEvents } from "../actions/events";
import { Trophy, Plus, Mail, Users, User, Shield } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newEventId, setNewEventId] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteEmails, setInviteEmails] = useState<{ [teamId: string]: string }>({});

  useEffect(() => {
    async function loadData() {
      const [teamsRes, eventsRes] = await Promise.all([
        getMyTeams(),
        getPublicEvents(),
      ]);

      if (teamsRes.success) setTeams(teamsRes.teams || []);
      if (eventsRes.success) setEvents(eventsRes.data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventId || !newTeamName) return;
    
    const res = await createTeam(newEventId, newTeamName);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Failed to create team");
    }
  };

  const handleInvite = async (teamId: string) => {
    const email = inviteEmails[teamId];
    if (!email) return;

    const res = await inviteTeamMember(teamId, email);
    if (res.success) {
      alert("Invite sent!");
      setInviteEmails({ ...inviteEmails, [teamId]: "" });
      window.location.reload();
    } else {
      alert(res.error || "Failed to send invite");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
            TEAM <span className="text-cyan-400">HQ</span>
          </h1>
          <p className="text-slate-400 font-manrope text-lg">
            Manage your hackathon teams, recruit members, and prepare for glory.
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-sm bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)]"
        >
          <Plus className="w-4 h-4" /> NEW TEAM
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
          <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">NO TEAMS YET</h3>
          <p className="text-slate-400 font-manrope mb-6 max-w-md mx-auto">
            You haven't joined or created any teams. Create a team to participate in upcoming hackathons.
          </p>
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-2 rounded-sm border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-orbitron transition-all"
          >
            CREATE TEAM
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team) => (
            <div key={team.id} className="bg-[#090a0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              {/* Event Badge */}
              <div className="absolute top-0 right-0 bg-cyan-500/10 border-b border-l border-cyan-500/30 px-4 py-2 rounded-bl-xl">
                <span className="text-xs font-bold font-orbitron text-cyan-400">
                  {team.event?.name}
                </span>
              </div>

              <h2 className="text-2xl font-orbitron font-bold text-white mb-1 mt-4">{team.name}</h2>
              <div className="flex gap-2 mb-6">
                <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-slate-300">
                  STATUS: {team.status}
                </span>
                {team.joinCode && (
                  <span className="inline-block px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 rounded-sm text-xs font-bold text-purple-400 font-mono tracking-widest cursor-copy" title="Copy Team Token" onClick={() => {navigator.clipboard.writeText(team.joinCode); alert('Copied: ' + team.joinCode)}}>
                    TOKEN: {team.joinCode}
                  </span>
                )}
              </div>

              {/* Members List */}
              <div className="mb-6">
                <h4 className="text-sm font-bold font-manrope text-slate-500 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> CURRENT ROSTER
                </h4>
                <div className="space-y-3">
                  {team.members.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white font-manrope">{m.user.firstName}</p>
                          <p className="text-xs text-slate-400">{m.user.email}</p>
                        </div>
                      </div>
                      {m.role === "LEADER" && (
                        <Shield className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invites */}
              {team.invites && team.invites.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold font-manrope text-slate-500 mb-3">PENDING INVITES</h4>
                  <div className="space-y-2">
                    {team.invites.map((inv: any) => (
                      <div key={inv.id} className="text-xs text-slate-400 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {inv.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <a 
                  href={`/teams/${team.id}`} 
                  className="block text-center w-full py-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 font-orbitron text-sm transition-colors border border-cyan-500/30 rounded-sm"
                >
                  ENTER WORKSPACE
                </a>
              </div>

              {/* Invite Form */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold font-manrope text-slate-500 mb-3">RECRUIT MEMBER</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="hacker@email.com"
                    value={inviteEmails[team.id] || ""}
                    onChange={e => setInviteEmails({ ...inviteEmails, [team.id]: e.target.value })}
                    className="flex-1 bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                    onClick={() => handleInvite(team.id)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-orbitron rounded-sm transition-colors"
                  >
                    SEND INVITE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0f1115] border border-white/10 p-8 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-orbitron text-white mb-6">CREATE NEW TEAM</h2>
            <form onSubmit={handleCreateTeam} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-manrope text-slate-400 mb-1 block">SELECT EVENT</label>
                <select 
                  value={newEventId}
                  onChange={e => setNewEventId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">-- Choose Event --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-manrope text-slate-400 mb-1 block">TEAM NAME</label>
                <input 
                  type="text" 
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="Cyber Ninjas"
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron tracking-wider rounded-sm shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all">
                INITIALIZE TEAM
              </button>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-sm text-slate-500 hover:text-white mt-2">
                CANCEL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

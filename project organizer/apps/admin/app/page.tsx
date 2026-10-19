import { getDashboardStats } from "./actions/dashboard";
import { OverviewChart, UserGrowthChart } from "./components/DashboardCharts";
import { Calendar, Users, Code2, QrCode, MoreVertical, ArrowUpRight } from "lucide-react";

export default async function DashboardOverview() {
  const result = await getDashboardStats();
  
  if (!result.success || !result.data) {
    return (
      <div className="w-full flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-4 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-destructive font-medium">{result.error}</p>
        </div>
      </div>
    );
  }

  const { totalEvents, activeHackathons, totalParticipants, liveCheckins } = result.data;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Stats Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Events */}
        <div className="p-5 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Calendar className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Total Events</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-100">{totalEvents}</p>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 12.5%
              </span>
            </div>
          </div>
        </div>

        {/* Active Hackathons */}
        <div className="p-5 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Code2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Active Hackathons</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-100">{activeHackathons}</p>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 5.2%
              </span>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Total Users</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-100">{totalParticipants || 32}</p>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 18.2%
              </span>
            </div>
          </div>
        </div>

        {/* Live Check-ins */}
        <div className="p-5 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <QrCode className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Live Check-ins</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-100">{liveCheckins || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Overview</h2>
            <select className="bg-[#1e293b] border border-[#334155] text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <OverviewChart data={result.data.chartData} />
          </div>
        </div>

        {/* Recent Hackathons */}
        <div className="p-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Recent Hackathons</h2>
            <a href="/hackathons" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</a>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "CodeStorm 2026", participants: 120, date: "May 10 - May 12", status: "Live", statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
              { name: "AI Innovate", participants: 85, date: "May 15 - May 17", status: "Upcoming", statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
              { name: "HackTheFuture", participants: 64, date: "May 20 - May 22", status: "Registration Open", statusColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
              { name: "BuildForBharat", participants: 50, date: "May 25 - May 27", status: "Coming Soon", statusColor: "text-slate-400 bg-slate-400/10 border-slate-400/20" }
            ].map((hack, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1e293b]/50 transition-colors cursor-pointer border border-transparent hover:border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{hack.name}</p>
                    <p className="text-xs text-slate-500">{hack.participants} Participants</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1.5">{hack.date}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${hack.statusColor}`}>
                    {hack.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Top Events */}
        <div className="p-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Top Events</h2>
            <a href="/events" className="text-sm text-indigo-400 hover:text-indigo-300">View All</a>
          </div>
          <div className="space-y-5">
            {[
              { name: "Tech Conference 2026", date: "May 20 - May 22", status: "Live", color: "text-emerald-400" },
              { name: "Design Summit", date: "Jun 01 - Jun 02", status: "Completed", color: "text-slate-500" },
              { name: "Web Dev Workshop", date: "Jun 10 - Jun 12", status: "Completed", color: "text-slate-500" }
            ].map((ev, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#1e293b] pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{ev.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{ev.date}</p>
                </div>
                <span className={`text-xs font-medium ${ev.color}`}>{ev.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="p-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">User Growth</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-slate-100">{totalParticipants || 0}</p>
                <span className="text-xs text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 15.6%</span>
              </div>
            </div>
            <select className="bg-[#1e293b] border border-[#334155] text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-40">
            <UserGrowthChart data={result.data.chartData} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-lg">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Create New Event", icon: Calendar, color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { label: "Add Hackathon", icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { label: "Manage Users", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "View Payments", icon: QrCode, color: "text-emerald-400", bg: "bg-emerald-500/10" }
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-[#1e293b] bg-[#0a0b10] hover:border-indigo-500/50 hover:bg-[#1e293b]/50 transition-all group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.bg} group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-slate-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

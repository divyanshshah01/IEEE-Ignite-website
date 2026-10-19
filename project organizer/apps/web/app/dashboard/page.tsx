"use client";

import React, { useEffect, useState } from "react";
import { getDashboardData } from "../actions/dashboard";
import { QrCode as QrCodeIcon, Trophy, Calendar, Users, ArrowRight, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getDashboardData();
      if (res.success && res.user) {
        setData(res);
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.user) return null;
  const { user, registrations, teams } = data;

  // Find the most relevant QR Code (latest upcoming event)
  const nearestEventRegistration = registrations?.find((reg: any) => reg.qrCode);
  const qrValue = nearestEventRegistration?.qrCode;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
      
      {/* Top Profile & Active Ticket Section */}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        
        {/* Profile Sidebar */}
        <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0">
          <div className="bg-[#090a0f] border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-600" />
            
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-cyan-500/50 mb-4 flex items-center justify-center text-3xl font-orbitron font-bold mt-4">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-orbitron font-bold text-white mb-1">
              {user.firstName}
            </h2>
            <p className="text-sm text-slate-400 font-manrope">{user.email}</p>
          </div>
        </aside>

        {/* Active Ticket Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 relative">
          
          {/* Event Details Panel */}
          {nearestEventRegistration && (
            <div className="bg-[#05050a] border border-white/10 rounded-2xl p-8 shadow-2xl flex-1 lg:max-w-md">
              <h3 className="font-orbitron font-bold text-2xl mb-8 border-b border-white/10 pb-4">EVENT DETAILS</h3>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                  <Calendar className="w-6 h-6 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-manrope font-bold tracking-widest uppercase mb-1">START DATE</p>
                    <p className="text-base font-manrope text-white">{new Date(nearestEventRegistration.event.startAt).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Calendar className="w-6 h-6 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-manrope font-bold tracking-widest uppercase mb-1">END DATE</p>
                    <p className="text-base font-manrope text-white">{new Date(nearestEventRegistration.event.endAt).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <MapPin className="w-6 h-6 text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-manrope font-bold tracking-widest uppercase mb-1">LOCATION</p>
                    <p className="text-base font-manrope text-white">Virtual / Online</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Users className="w-6 h-6 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-manrope font-bold tracking-widest uppercase mb-1">PARTICIPANTS</p>
                    <p className="text-base font-manrope text-white">{registrations.length} Registered</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Panel */}
          {qrValue ? (
            <div className="bg-[#05050a] border border-green-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.1)] flex-1 lg:max-w-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-green-400 tracking-widest mb-3">REGISTERED</h3>
              <p className="text-sm text-slate-400 font-manrope mb-8 leading-relaxed max-w-[250px]">
                You are all set for this event! Keep your QR code ready for check-in.
              </p>
              
              <div className="bg-white p-4 rounded-xl w-48 h-48 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <QRCode value={qrValue} size={160} className="w-full h-full" />
              </div>
              
              <p className="text-xs text-slate-500 mt-6 font-mono tracking-wider">Token: {qrValue.substring(0, 16)}...</p>
            </div>
          ) : (
            <div className="bg-[#05050a] border border-white/10 rounded-2xl p-8 shadow-2xl flex-1 lg:max-w-sm flex flex-col items-center justify-center text-center">
              <QrCodeIcon className="w-20 h-20 text-slate-700 mb-6" />
              <h3 className="font-orbitron font-bold text-xl text-slate-500 mb-2">NO ACTIVE TICKET</h3>
              <p className="text-sm text-slate-600 font-manrope">Register for an event to get your QR code here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content (My Registrations & Teams) */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
            <Calendar className="text-cyan-400" /> MY REGISTRATIONS
          </h2>
          {registrations?.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-slate-400 font-manrope mb-4">You haven't registered for any events yet.</p>
              <Link href="/events" className="inline-block px-6 py-2 rounded-sm bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 font-orbitron text-sm transition-colors border border-cyan-500/30">
                BROWSE EVENTS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registrations.map((reg: any) => {
                const now = new Date();
                const start = new Date(reg.event.startAt);
                const end = new Date(reg.event.endAt);
                let computedStatus = "Upcoming";
                if (now > end) computedStatus = "Completed";
                else if (now >= start && now <= end) computedStatus = "Live";

                return (
                  <div key={reg.id} className="p-5 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <h3 className="font-orbitron font-bold text-lg mb-2 text-white">{reg.event.name}</h3>
                    <div className="flex flex-col gap-1 text-sm text-slate-400 font-manrope">
                      <p className="flex justify-between">
                        <span>Event: <span className={computedStatus === 'Live' ? 'text-emerald-400' : 'text-slate-300'}>{computedStatus}</span></span>
                        <span>Registration: <span className="text-cyan-400">{reg.status}</span></span>
                      </p>
                      <p>Date: {new Date(reg.event.startAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Link href={`/events/${reg.event.id}`} className="mt-4 flex items-center gap-2 text-cyan-500 text-sm font-semibold hover:text-cyan-400 transition-colors">
                      View Event <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#090a0f] border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="text-purple-400" /> MY TEAMS
          </h2>
          {teams?.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-slate-400 font-manrope mb-4">You are not part of any team.</p>
              <Link href="/teams" className="inline-block px-6 py-2 rounded-sm bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 font-orbitron text-sm transition-colors border border-purple-500/30">
                TEAM HEADQUARTERS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((t: any) => (
                <div key={t.id} className="p-5 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-orbitron font-bold text-lg text-white">{t.team.name}</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded font-bold uppercase">{t.role}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-slate-400 font-manrope">
                    <p>Event: <span className="text-white">{t.team.event.name}</span></p>
                    <p className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-purple-400" />
                      {t.team._count.members} Members
                    </p>
                  </div>
                  <Link href={`/teams`} className="mt-4 flex items-center gap-2 text-purple-500 text-sm font-semibold hover:text-purple-400 transition-colors">
                    Manage Team <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

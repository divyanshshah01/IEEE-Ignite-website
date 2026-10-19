"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicEvents } from "../actions/events";
import { Trophy, Calendar, MapPin, Users, Flame, Code, Terminal, Clock, ShieldAlert } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import Image from "next/image";
import Link from "next/link";

export default function SingleHackathonPage() {
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const res = await getPublicEvents({ category: "Hackathon" });
      if (res.success && res.data && res.data.length > 0) {
        // Just grab the first one, or the one that is closest to start
        const events = res.data.sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
        setHackathon(events[0]);
      }
      setLoading(false);
    }
    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center text-white relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center max-w-2xl text-center px-4">
          <ShieldAlert className="w-24 h-24 text-orange-500 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 tracking-widest uppercase">
            NO ACTIVE <span className="text-orange-500">HACKATHONS</span>
          </h1>
          <p className="text-slate-400 font-manrope text-lg mb-8">
            Our systems indicate no hackathons are currently scheduled. The grid is quiet for now. Check back later for upcoming transmissions.
          </p>
          <Link href="/" className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-orbitron tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(hackathon.startAt);
  const endDate = new Date(hackathon.endAt);

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden font-sans">
      <AnimatedBackground />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/80 to-[#020202]" />
          {hackathon.imageUrl && (
            <img 
              src={hackathon.imageUrl} 
              alt={hackathon.name} 
              className="w-full h-full object-cover opacity-20"
            />
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-orbitron text-orange-400 tracking-widest uppercase">PREMIER HACKATHON EVENT</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tight uppercase leading-[1.1]">
              {hackathon.name}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 font-manrope max-w-xl">
              {hackathon.summary || "Build the future. Challenge the impossible. Join the ultimate cyberpunk hackathon experience."}
            </p>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-orbitron uppercase">DATE</span>
                  <span className="text-sm font-bold">{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-orbitron uppercase">DURATION</span>
                  <span className="text-sm font-bold">24 HOURS</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-orbitron uppercase">VENUE</span>
                  <span className="text-sm font-bold">MAIN ARENA</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/events/${hackathon.id}`}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-orbitron font-bold tracking-widest text-center rounded-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] uppercase group"
              >
                ENTER THE GRID
                <Terminal className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full" />
            {hackathon.imageUrl ? (
              <img 
                src={hackathon.imageUrl} 
                alt="Hackathon Poster" 
                className="relative z-10 w-full max-w-md drop-shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-float rounded-lg"
              />
            ) : (
              <img 
                src="/robot.svg" 
                alt="Cyberpunk Mascot" 
                className="relative z-10 w-full max-w-md drop-shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-float"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {/* Geometric shape background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-64 h-64 border border-orange-500/30 rotate-45 animate-[spin_20s_linear_infinite]" />
              <div className="w-64 h-64 border border-cyan-500/30 rotate-12 absolute animate-[spin_30s_linear_infinite_reverse]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS / HIGHLIGHTS */}
      <section className="py-16 border-y border-white/5 bg-black/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Trophy, value: hackathon.settings?.metadata?.prizePool || "TBA", label: "PRIZE POOL" },
            { icon: Users, value: hackathon.settings?.metadata?.hackersCount || "TBA", label: "HACKERS" },
            { icon: Code, value: hackathon.settings?.metadata?.codingHours || "24", label: "HOURS OF CODING" },
            { icon: Flame, value: hackathon._count?.hackathonTracks || "1", label: "TRACKS" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-lg hover:border-orange-500/50 transition-colors">
              <stat.icon className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-3xl font-orbitron font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-manrope tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-6 uppercase tracking-widest">
            ABOUT <span className="text-orange-500">THE HACKATHON</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-transparent mx-auto mb-8" />
          <div className="prose prose-invert prose-orange mx-auto font-manrope text-slate-300 text-lg leading-relaxed">
            {hackathon.description ? (
              <div dangerouslySetInnerHTML={{ __html: hackathon.description }} />
            ) : (
              <p>
                Gear up for 24 hours of non-stop innovation. Whether you are a master coder or a creative visionary, this is your arena. 
                Form a squad, choose a track, and build solutions that push the boundaries of technology. Energy drinks, mentors, 
                and high-speed Wi-Fi provided. Bring your setup and your A-game.
              </p>
            )}
          </div>
          
          {hackathon.settings?.metadata?.innerImageUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-12 relative rounded-2xl overflow-hidden border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.2)]"
            >
              <img 
                src={hackathon.settings.metadata.innerImageUrl} 
                alt="About Hackathon" 
                className="w-full h-auto object-cover max-h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/10 skew-y-3 scale-110 -z-10 border-y border-orange-500/20" />
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <Flame className="w-16 h-16 text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,1)]" />
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-6 uppercase">
            ARE YOU READY TO HACK?
          </h2>
          <p className="text-slate-300 font-manrope mb-10 text-lg max-w-xl">
            Registrations are closing soon. Secure your spot in the most anticipated tech showdown of the year.
          </p>
          <Link 
            href={`/events/${hackathon.id}`}
            className="px-10 py-5 bg-white text-black hover:bg-orange-500 hover:text-white font-orbitron font-bold tracking-widest text-xl rounded-sm transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] uppercase"
          >
            REGISTER SQUAD
          </Link>
        </div>
      </section>
    </div>
  );
}

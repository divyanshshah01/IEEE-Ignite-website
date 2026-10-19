"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Code, Bot, Cpu, Trophy, Instagram, Linkedin, Github, Mail, ArrowRight, Calendar, MapPin, Users, CheckCircle, Flame, Rocket, ChevronRight } from "lucide-react";
import { getPublicEvents } from "./actions/events";
import { getDashboardData } from "./actions/dashboard";
import QRCode from "react-qr-code";
import AnimatedBackground from "./components/AnimatedBackground";
import CommitteeCard from "./components/CommitteeCard";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 14,
    minutes: 42,
    seconds: 9,
  });

  const [nearestEvent, setNearestEvent] = useState<any>(null);
  const [userQrCode, setUserQrCode] = useState<string | null>(null);
  const [org, setOrg] = useState<any>(null);

  // Committee Data Placeholders
  const festHeads = [
    { name: "ALEX MERCER", role: "FEST HEAD", authLevel: "ROOT" },
    { name: "SARAH CONNOR", role: "CO-FEST HEAD", authLevel: "ROOT" },
  ];
  
  const coreTeam = [
    { name: "NIKHIL SINGH", role: "HEAD WEB DEVELOPMENT", authLevel: "ADMIN" },
    { name: "DAVID BOWMAN", role: "TECHNICAL LEAD", authLevel: "ADMIN" },
    { name: "ELLEN RIPLEY", role: "DESIGN LEAD", authLevel: "ADMIN" },
    { name: "NEO ANDERSON", role: "MARKETING LEAD", authLevel: "ADMIN" },
  ];

  const sponsorsTeam = [
    { name: "BRUCE WAYNE", role: "SPONSORSHIP HEAD", authLevel: "EXEC" },
    { name: "TONY STARK", role: "INVESTMENT LEAD", authLevel: "EXEC" },
  ];

  const organizers = [
    { name: "PETER PARKER", role: "VOLUNTEER LEAD", authLevel: "STAFF" },
    { name: "CLARK KENT", role: "MEDIA LEAD", authLevel: "STAFF" },
    { name: "DIANA PRINCE", role: "PR LEAD", authLevel: "STAFF" },
    { name: "BARRY ALLEN", role: "HOSPITALITY", authLevel: "STAFF" },
  ];

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    // Fetch data
    async function loadData() {
      try {
        const eventsRes = await getPublicEvents();
        if (eventsRes.success && eventsRes.data && eventsRes.data.length > 0) {
          setNearestEvent(eventsRes.data[0]); // Get the first upcoming event
        }

        const dashRes = await getDashboardData();
        if (dashRes.success && dashRes.registrations && dashRes.registrations.length > 0) {
          // If registered, get the QR code
          const regWithQr = dashRes.registrations.find((r: any) => r.qrCode);
          if (regWithQr) {
            setUserQrCode(regWithQr.qrCode);
          }
        }

        const { getOrganizationDetails } = await import("./actions/organization");
        const orgRes = await getOrganizationDetails();
        if (orgRes.success) {
          setOrg(orgRes.organization);
        }

      } catch (err) {
        console.error("Failed to load landing page data", err);
      }
    }
    loadData();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#020202] text-white font-sans selection:bg-orange-500/30">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* WebGL Animated Background */}
        <AnimatedBackground />
        
        {/* Main UI Overlay - Z-20 to be above background */}
        <div className="relative z-20 w-full h-full flex flex-col p-4 md:p-8 md:px-12 pointer-events-auto">
        
        {/* Top Navbar */}
        <nav className="w-full flex items-center justify-between border-b border-white/10 pb-4 relative">
          <div className="flex items-center gap-3">
            {org?.logoUrl ? (
              <img src={org.logoUrl} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
            ) : (
              <Flame className="w-10 h-10 text-orange-500 fill-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
            )}
            <span className="font-orbitron font-bold text-3xl tracking-widest hidden sm:block text-white">{org?.name || "IGNITE"}</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 font-manrope text-xs tracking-[0.2em] text-slate-300">
            <a href="#" className="hover:text-white font-bold transition-colors">HOME</a>
            <a href="/events" className="hover:text-white font-bold transition-colors">EVENTS</a>
            <a href="/hackathons" className="hover:text-white font-bold transition-colors">HACKATHON</a>
            <a href="/dashboard" className="text-orange-500 border-b-2 border-orange-500 pb-1 font-bold transition-colors">MY DASHBOARD</a>
          </div>

          <Link href="/events" className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-950 border border-orange-500/50 text-white font-orbitron font-bold text-xs tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all">
            REGISTER NOW <ChevronRight className="w-4 h-4 text-orange-400" />
          </Link>
        </nav>

        {/* Main Content Body */}
        <div className="flex-1 flex w-full max-w-[1400px] mx-auto mt-4 xl:mt-8 pb-10 justify-between">
          
          {/* Left Panel */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl xl:max-w-3xl">
            <div className="flex items-center gap-4 text-orange-400 font-orbitron text-xs md:text-sm font-bold tracking-[0.4em] mb-3">
              <span>////</span>
              <p>THE FLAME HAS AWAKENED</p>
            </div>

            <h1 className="text-6xl md:text-[90px] lg:text-[100px] font-black font-orbitron leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              IGNITE
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-orbitron text-orange-500 tracking-widest mt-1 mb-4 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              TECH FEST 2027
            </h2>
            
            <p className="text-slate-300 font-manrope max-w-md text-xs md:text-sm mb-6 leading-relaxed opacity-90">
              Where Innovation Meets Impact.<br/>
              Shape the Future. Be the Flame.
            </p>

            {/* Grid Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col bg-white/5 border border-white/10 border-t-orange-500 rounded-2xl p-4 hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full border border-orange-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Code className="w-4 h-4 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="font-orbitron font-bold text-xs tracking-wider mb-1 text-white">CODE</h3>
                <p className="text-[9px] text-slate-400 leading-tight">Algorithm &<br/>Logic Puzzles</p>
              </div>
              <div className="flex flex-col bg-white/5 border border-white/10 border-t-orange-500 rounded-2xl p-4 hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full border border-orange-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Bot className="w-4 h-4 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="font-orbitron font-bold text-xs tracking-wider mb-1 text-white">BUILD</h3>
                <p className="text-[9px] text-slate-400 leading-tight">Robotics Challenges<br/>IoT Fabrication</p>
              </div>
              <div className="flex flex-col bg-white/5 border border-white/10 border-t-orange-500 rounded-2xl p-4 hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full border border-orange-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Cpu className="w-4 h-4 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="font-orbitron font-bold text-xs tracking-wider mb-1 text-white">INNOVATE</h3>
                <p className="text-[9px] text-slate-400 leading-tight">Ideathon & Pitch<br/>Product Showcases</p>
              </div>
              <div className="flex flex-col bg-white/5 border border-white/10 border-t-orange-500 rounded-2xl p-4 hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full border border-orange-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Trophy className="w-4 h-4 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="font-orbitron font-bold text-xs tracking-wider mb-1 text-white">DOMINATE</h3>
                <p className="text-[9px] text-slate-400 leading-tight">Leadership Summit<br/>Innovation Awards</p>
              </div>
            </div>

            {/* Countdown & CTA Row */}
            <div className="mb-4">
              <p className="text-[10px] font-orbitron tracking-[0.3em] font-bold text-orange-500 mb-3 uppercase">THE INFERNO BEGINS IN</p>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                
                <div className="flex items-center gap-2">
                  {[
                    { label: "DAYS", value: timeLeft.days },
                    { label: "HOURS", value: timeLeft.hours },
                    { label: "MINUTES", value: timeLeft.minutes },
                    { label: "SECONDS", value: String(timeLeft.seconds).padStart(2, '0') }
                  ].map((t, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center justify-center w-14 h-16 md:w-16 md:h-20 border border-orange-500/50 bg-[#0a0500]/80 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500 opacity-80" />
                        <span className="text-xl md:text-3xl font-orbitron font-black text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">{t.value}</span>
                        <span className="text-[8px] md:text-[9px] font-manrope tracking-widest font-bold text-slate-400 mt-1">{t.label}</span>
                      </div>
                      {i < 3 && <span className="text-lg md:text-xl font-bold text-orange-500/50 mb-2">:</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/events" className="inline-flex items-center justify-center w-full lg:w-auto gap-8 px-6 py-4 bg-gradient-to-r from-orange-950 via-orange-800 to-orange-600 border border-orange-500 text-orange-400 hover:text-white font-orbitron text-xs md:text-sm font-bold tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all group">
                  ENTER THE INFERNO <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
                
              </div>
            </div>
          </div>

          {/* Right Panel Overlays */}
          <div className="hidden xl:flex flex-col items-end justify-center ml-auto h-full pt-0 pb-4 gap-6">
            
            {/* Top Right HUD Reticle */}
            <div className="relative w-56 h-56 border border-orange-500/20 rounded-full flex items-center justify-center before:content-[''] before:absolute before:inset-2 before:border before:border-dashed before:border-orange-500/40 before:rounded-full before:animate-[spin_30s_linear_infinite] after:content-[''] after:absolute after:inset-[-10px] after:border after:border-orange-500/10 after:rounded-full">
              {/* Glowing Dots */}
              <div className="absolute top-0 w-1.5 h-1.5 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute bottom-0 w-1.5 h-1.5 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute left-0 w-1.5 h-1.5 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute right-0 w-1.5 h-1.5 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute top-1/4 left-3 w-1 h-1 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute top-1/4 right-3 w-1 h-1 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute bottom-1/4 left-3 w-1 h-1 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <div className="absolute bottom-1/4 right-3 w-1 h-1 bg-orange-500 rounded-full drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />

              <div className="text-center font-orbitron tracking-[0.2em] font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                <p className="text-orange-500 mb-1 text-base">IGNITE</p>
                <p className="mb-0.5 text-xs text-slate-200">THE CODE</p>
                <p className="text-xs text-slate-200">OF TOMORROW</p>
              </div>
            </div>

            {/* Info Panel 1 */}
            <div className="w-72 bg-[#0a0500]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-manrope text-[10px] md:text-xs font-bold tracking-widest text-slate-300">REGISTRATION</span>
                </div>
                <span className="font-orbitron text-xs font-bold tracking-widest text-green-500">OPEN</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-manrope text-[10px] md:text-xs font-bold tracking-widest text-slate-300">GLOBAL SPONSORS</span>
                </div>
                <span className="font-orbitron text-xs font-bold tracking-widest text-white">80+</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="w-4 h-4 text-slate-400" />
                  <span className="font-manrope text-[10px] md:text-xs font-bold tracking-widest text-slate-300">SPACES</span>
                </div>
                <span className="font-orbitron text-xs font-bold tracking-widest text-orange-400">LIMITED</span>
              </div>
            </div>

            {/* Info Panel 2 (Socials) */}
            <div className="w-72 bg-[#0a0500]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col shadow-2xl">
              <span className="font-orbitron text-[10px] md:text-xs font-bold tracking-widest text-orange-500 mb-2">STAY CONNECTED</span>
              <p className="font-manrope text-[9px] text-slate-400 mb-4">Join our community for updates & more.</p>
              <div className="flex gap-3 justify-between">
                {[Github, Instagram, Linkedin, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-xl hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/20 transition-all text-slate-300">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            
          </div>

        </div>

        {/* Sub-Nav Tracks */}
        <div className="w-full border-t border-white/5 bg-[#020202]/80 backdrop-blur-sm py-4 hidden md:flex items-center justify-center absolute bottom-0 left-0 z-20">
          <div className="flex items-center justify-center gap-6 font-manrope text-xs font-bold tracking-[0.2em] text-slate-400">
            <span className="flex items-center gap-4 text-orange-500"><div className="w-8 h-8 rounded-full border border-orange-500/30 flex items-center justify-center"><Flame className="w-4 h-4" /></div></span>
            <span className="text-orange-500">{"//"}</span>
            <span className="hover:text-white transition-colors cursor-pointer">EVENT TRACKS</span>
            <span className="text-orange-500">{"//"}</span>
            <span className="hover:text-white transition-colors cursor-pointer">ROBOTICS EXPO</span>
            <span className="text-orange-500">{"//"}</span>
            <span className="hover:text-white transition-colors cursor-pointer">BLOCKCHAIN SUMMIT</span>
            <span className="text-orange-500">{"//"}</span>
            <span className="hover:text-white transition-colors cursor-pointer">AI INNOVATION</span>
            <span className="text-orange-500">{"//"}</span>
            <span className="hover:text-white transition-colors cursor-pointer">COMPETITIVE PROGRAMMING</span>
          </div>
        </div>
      </div>
      </section>

      {/* ===================== ABOUT US SECTION ===================== */}
      <section className="relative w-full min-h-[60vh] py-24 px-8 md:px-20 border-t border-orange-500/20 bg-gradient-to-b from-[#020202] to-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center gap-4 text-orange-400 font-orbitron text-sm font-bold tracking-[0.4em] mb-8 justify-center">
            <span>////</span>
            <p>THE ORIGIN</p>
            <span>////</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-orbitron text-center mb-10 tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            WHAT IS <span className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">IGNITE?</span>
          </h2>
          <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm relative group hover:border-orange-500/50 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/50" />
            <p className="text-lg md:text-xl font-manrope text-slate-300 leading-relaxed text-center font-medium">
              Ignite is not just a hackathon; it is the crucible where the future of technology is forged. 
              Bringing together the brightest minds across the globe, we challenge you to break boundaries in 
              AI, Robotics, Web3, and Competitive Programming. 
              <br/><br/>
              Over 3 days of intense collaboration, you will build, innovate, and dominate.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== COMMITTEE SECTION ===================== */}
      <section className="relative w-full py-24 px-8 md:px-20 border-t border-orange-500/20 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 text-orange-400 font-orbitron text-sm font-bold tracking-[0.4em] mb-12">
            <span>////</span>
            <p>THE ARCHITECTS</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-orbitron mb-16 tracking-wider">
            ORGANIZING COMMITTEE
          </h2>
          
          <div className="space-y-24">
            {/* Fest Heads */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1" />
                <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">Fest Heads</h3>
                <div className="h-px bg-gradient-to-l from-orange-500/50 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                <div className="hidden lg:block" /> {/* Spacers for centering 2 items in 4 cols */}
                {festHeads.map((member, i) => (
                  <CommitteeCard key={i} {...member} />
                ))}
                <div className="hidden lg:block" />
              </div>
            </div>

            {/* Core Team */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1" />
                <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">Core Team</h3>
                <div className="h-px bg-gradient-to-l from-orange-500/50 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreTeam.map((member, i) => (
                  <CommitteeCard key={i} {...member} />
                ))}
              </div>
            </div>

            {/* Investment & Sponsors */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1" />
                <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase text-center">Investment / Sponsors</h3>
                <div className="h-px bg-gradient-to-l from-orange-500/50 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                <div className="hidden lg:block" />
                {sponsorsTeam.map((member, i) => (
                  <CommitteeCard key={i} {...member} />
                ))}
                <div className="hidden lg:block" />
              </div>
            </div>

            {/* Organizers */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1" />
                <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">Organizers</h3>
                <div className="h-px bg-gradient-to-l from-orange-500/50 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {organizers.map((member, i) => (
                  <CommitteeCard key={i} {...member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SCHEDULE SECTION ===================== */}
      <section className="relative w-full py-24 px-8 md:px-20 border-t border-orange-500/20 bg-gradient-to-b from-[#050505] to-[#020202]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-orange-400 font-orbitron text-sm font-bold tracking-[0.4em] mb-12">
            <span>////</span>
            <p>THE TIMELINE</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-orbitron mb-16 tracking-wider text-center">
            EVENT SCHEDULE
          </h2>

          <div className="space-y-12 relative before:absolute before:top-0 before:bottom-0 before:left-5 md:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-orange-500/50 before:via-orange-400/50 before:to-transparent">
            {[
              { day: "DAY 1", time: "09:00 AM", title: "OPENING CEREMONY", desc: "Kickoff, Keynote Speakers & Theme Reveal" },
              { day: "DAY 1", time: "11:00 AM", title: "HACKING BEGINS", desc: "Teams assemble and development starts" },
              { day: "DAY 2", time: "02:00 PM", title: "MENTORSHIP ROUND", desc: "Expert guidance & project reviews" },
              { day: "DAY 3", time: "10:00 AM", title: "SUBMISSIONS CLOSE", desc: "Final code freeze and pitch prep" },
              { day: "DAY 3", time: "04:00 PM", title: "CLOSING & AWARDS", desc: "Winner announcements and celebrations" },
            ].map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Node */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 bg-[#020202] shadow-[0_0_10px_rgba(249,115,22,0.5)] shrink-0 absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-6 border border-white/10 bg-white/5 rounded-sm ml-auto md:ml-0 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-orbitron font-bold tracking-widest">{item.day}</span>
                    <span className="text-orange-400 text-xs font-orbitron tracking-widest">{item.time}</span>
                  </div>
                  <h3 className="font-orbitron font-bold text-xl mb-2 text-white">{item.title}</h3>
                  <p className="font-manrope text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===================== BOOKING CTA SECTION ===================== */}
      <section className="relative w-full py-32 px-8 md:px-20 bg-black overflow-hidden border-t border-orange-500/20">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
        </div>
        
        {/* Cyber Grid Lines Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-12">
          
          {/* Cyber Robot Image */}
          <div className="relative w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] -mb-10 md:-mb-14 z-40 pointer-events-none">
            <Image 
              src="/robot.svg" 
              alt="Cyber Robot" 
              fill 
              className="object-contain object-bottom"
            />
          </div>

          {/* Huge Text */}
          <div className="relative z-30 flex flex-col items-center">
            <h2 className="font-orbitron font-black text-6xl md:text-[8rem] leading-none tracking-tighter mb-2 text-white uppercase drop-shadow-2xl">
              BOOK YOUR
            </h2>
            <h2 className="font-orbitron font-black text-6xl md:text-[8.5rem] leading-none tracking-tighter mb-16 uppercase drop-shadow-2xl">
              <span className="text-white drop-shadow-lg">SLOTS </span>
              <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">NOW</span>
            </h2>
          </div>

          {/* Buttons Area */}
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4 relative z-30">
            
            {/* Make Payment Button */}
            <button className="group relative px-10 py-5 bg-[#0a0a0a] border border-white/10 hover:border-orange-500 transition-colors overflow-hidden flex items-center justify-center rounded-sm">
              <div className="absolute inset-0 bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative font-orbitron font-bold text-orange-500 group-hover:text-orange-400 tracking-widest uppercase transition-colors">
                MAKE PAYMENT
              </span>
            </button>

            {/* Contact Us Block */}
            <div className="flex items-center gap-8 px-8 py-5 bg-[#0a0a0a] border border-white/10 group hover:border-white/20 transition-colors rounded-sm">
              <span className="font-manrope text-xs font-bold text-slate-300 tracking-widest uppercase">
                CONTACT US ON:
              </span>
              <div className="flex items-center gap-5">
                <a href="#" className="text-white/70 hover:text-orange-500 transition-all hover:scale-110"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-white/70 hover:text-orange-500 transition-all hover:scale-110"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="text-white/70 hover:text-orange-500 transition-all hover:scale-110"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-white/70 hover:text-orange-500 transition-all hover:scale-110"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative w-full py-12 px-8 md:px-20 border-t border-white/10 bg-[#020202]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-3">
            {org?.logoUrl ? (
              <img src={org.logoUrl} alt="Logo" className="w-10 h-10 object-contain opacity-50 hover:opacity-100 transition-all" />
            ) : (
              <Flame className="w-10 h-10 text-orange-500 opacity-50 hover:opacity-100 transition-all" />
            )}
            <span className="font-orbitron font-bold text-xl tracking-widest text-slate-500">{org?.name || "IGNITE"}</span>
          </div>

          <div className="flex gap-6 font-manrope text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-slate-600 font-manrope text-xs">
            © 2027 IGNITE TECH FEST. All Rights Reserved.
          </div>
          
        </div>
      </footer>

    </div>
  );
}

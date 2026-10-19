"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getPublicEvents } from "../actions/events";
import { Users, Trophy, ChevronLeft, ChevronRight, Bot } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("CENTERSTAGE EVENTS");

  const tabs = ["CENTERSTAGE EVENTS", "DEPARTMENTAL EVENTS", "GUEST LECTURES"];
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchEvents() {
      // In a real app, we might pass activeTab as category
      const res = await getPublicEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, [activeTab]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen px-6 pt-16 pb-12 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* Huge Center EVENTS Title */}
      <div className="flex flex-col items-center mb-16">
        <h1 
          className="text-[60px] md:text-[100px] font-orbitron font-black text-transparent bg-clip-text tracking-widest text-center"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #a0a0a0 50%, #404040 100%)',
            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.8))'
          }}
        >
          EVENTS
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs md:text-sm font-orbitron font-bold tracking-widest transition-all relative ${
                activeTab === tab ? "text-orange-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 shadow-[0_0_8px_#f97316]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-8 flex flex-col w-full">
          
          {/* Section Header */}
          <div className="flex items-center w-full mb-8">
            {/* Glowing Hexagon / Indicator */}
            <div className="flex items-center justify-center w-8 h-8 relative mr-4">
              <div className="absolute inset-0 bg-orange-500/30 blur-md rounded-full" />
              <div 
                className="w-4 h-4 bg-orange-400 relative z-10"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              />
            </div>
            
            <h2 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">
              {activeTab.split(' ')[0]}
            </h2>
            
            {/* Horizontal Line Divider */}
            <div className="flex-1 h-[1px] bg-white/20 mx-6 relative">
              <div className="absolute left-0 top-0 w-32 h-[1px] bg-gradient-to-r from-orange-500 to-transparent shadow-[0_0_10px_#f97316]" />
            </div>

            {/* Carousel Arrows */}
            <div className="flex gap-2">
              <button 
                onClick={scrollLeft}
                className="w-10 h-10 bg-[#151515] hover:bg-[#202020] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-10 h-10 bg-[#151515] hover:bg-[#202020] border border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-4 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* CSS to hide scrollbar for webkit */}
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />

            {events.length === 0 ? (
              <div className="w-full text-center py-12 border border-slate-800 border-dashed rounded-2xl bg-slate-900/10">
                <p className="text-slate-400 font-manrope">No events in this category yet. Check back later!</p>
              </div>
            ) : (
              events.map((event, i) => (
                <div key={event.id} className="snap-start shrink-0 w-[300px] sm:w-[350px]">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative w-full aspect-[3/4]"
                  >
                    {/* Hover Red Glow Background */}
                    <div className="absolute -inset-4 bg-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20" />
                    
                    {/* Hover Textured Background */}
                    <div 
                      className="absolute inset-0 bg-red-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{
                        clipPath: 'polygon(15px 0, 35% 0, 40% 18px, 60% 18px, 65% 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)'
                      }}
                    />

                    {/* Main Card Container (Acts as the border) */}
                    <div 
                      className="relative w-full h-full bg-white/20 group-hover:bg-orange-500/60 transition-colors duration-500 p-[1px]"
                      style={{
                        clipPath: 'polygon(15px 0, 35% 0, 40% 18px, 60% 18px, 65% 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)'
                      }}
                    >
                      {/* Inner Card (The actual background) */}
                      <div 
                        className="relative w-full h-full bg-[#050508] transition-colors duration-500 flex flex-col overflow-hidden"
                        style={{
                          clipPath: 'polygon(15px 0, 35% 0, 40% 18px, 60% 18px, 65% 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)'
                        }}
                      >
                        {/* Top Label */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 text-[10px] font-orbitron font-bold tracking-[0.3em] text-white pt-1">
                          EVENTS
                        </div>

                        {/* Left Decoration */}
                        <div className="absolute left-1 top-24 flex flex-col gap-2 z-20">
                          <div className="w-1.5 h-1.5 bg-white" />
                          <div className="w-1.5 h-1.5 bg-white" />
                          <div className="w-1.5 h-1.5 bg-white" />
                          <div className="w-1.5 h-16 mt-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#f97316_2px,#f97316_4px)] opacity-70" />
                        </div>

                        {/* Right Decoration (Vertical Text) */}
                        <div className="absolute right-2 top-28 z-20 text-[7px] font-orbitron tracking-[0.5em] text-white opacity-80" style={{ writingMode: 'vertical-rl' }}>
                          {event._count.hackathonTracks > 0 ? 'HACKATHON' : 'EXHIBITION'}
                        </div>

                        {/* Image Area - taking up top portion */}
                        <div className="relative w-full h-3/5 p-4 transition-all duration-500 group-hover:p-6 group-hover:h-1/2 z-10">
                          <div className="w-full h-full relative overflow-hidden bg-[#0a0a0f] border border-white/10 group-hover:border-orange-500/40 transition-colors duration-500 shadow-inner">
                            {event.imageUrl ? (
                              <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-black opacity-80" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)]" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                  <Trophy className="w-12 h-12 text-slate-500 group-hover:text-orange-400 transition-colors duration-500" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col p-8 pt-4 justify-center items-center text-center relative z-10 transition-transform duration-500 group-hover:-translate-y-4">
                          <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider mb-2 leading-tight">
                            {event.name}
                          </h3>
                          
                          {/* Prize Info (Hidden by default, fades in on hover) */}
                          <div className="opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 overflow-hidden flex flex-col items-center mt-2">
                            <span className="text-[9px] font-orbitron tracking-widest text-slate-300">PRIZES WORTH</span>
                            <span className="text-orange-500 font-orbitron font-bold text-lg mt-0.5">RS. 20,000 *</span>
                          </div>
                          
                          <a 
                            href={`/events/${event.id}`}
                            className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs font-orbitron tracking-widest text-orange-400 hover:text-white border-b border-orange-400 hover:border-white pb-1"
                          >
                            VIEW DETAILS
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Bot Icon from Screenshot */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
          <div className="relative w-14 h-14 bg-[#05050a] border-2 border-cyan-400 rounded-full flex items-center justify-center overflow-hidden">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

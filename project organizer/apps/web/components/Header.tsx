"use client";

import { motion } from "framer-motion";
import { Search, Bell, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  const getGreeting = () => {
    if (pathname === "/") return "Here's an overview of your events today.";
    if (pathname === "/events") return "Manage your ongoing and upcoming events.";
    if (pathname === "/tasks") return "Track event schedules and itineraries.";
    if (pathname === "/calendar") return "Your schedule and deadlines.";
    if (pathname === "/team") return "Manage your attendees and team roles.";
    if (pathname === "/settings") return "Configure your application preferences.";
    return "Welcome back.";
  };

  const getTitle = () => {
    if (pathname === "/") return (
      <>Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mohit</span></>
    );
    if (pathname === "/events") return "Events";
    if (pathname === "/tasks") return "Schedules";
    if (pathname === "/team") return "Attendees";
    return pathname.charAt(1).toUpperCase() + pathname.slice(2);
  };

  return (
    <header className="flex items-center justify-between p-8 border-b border-white/5 bg-transparent z-10 sticky top-0 backdrop-blur-md">
      <div>
        <motion.h1 
          key={pathname + "-title"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-white tracking-tight"
        >
          {getTitle()}
        </motion.h1>
        <motion.p 
          key={pathname + "-subtitle"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-slate-400 text-sm mt-1"
        >
          {getGreeting()}
        </motion.p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all w-64 text-white placeholder-slate-500"
          />
        </div>
        <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition relative text-slate-300">
          <Bell size={18} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#090a0f]"></span>
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40">
          <Plus size={16} />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </header>
  );
}

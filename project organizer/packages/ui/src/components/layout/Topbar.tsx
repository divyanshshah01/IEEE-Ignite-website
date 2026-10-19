"use client";

import React from "react";
import { useNavigation } from "../navigation/NavigationProvider";
import { Search, Bell, Command } from "lucide-react";
import { Button } from "../ui/button";

export function Topbar() {
  const { isSidebarOpen } = useNavigation();

  return (
    <header className="h-16 border-b border-[#1e293b] bg-[#0a0b10]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-100 hidden md:block">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1e293b]/50 rounded-full border border-[#334155] text-sm text-slate-400 w-72 cursor-pointer hover:bg-[#1e293b]/80 transition-colors shadow-inner">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"
            disabled
          />
          <div className="ml-auto flex items-center gap-1 bg-[#0a0b10] px-1.5 py-0.5 rounded border border-[#334155]">
            <Command className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-500 font-bold">K</span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] w-9 h-9 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#0a0b10]" />
        </Button>
      </div>
    </header>
  );
}

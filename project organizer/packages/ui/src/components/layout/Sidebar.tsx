"use client";

import React from "react";
import { useNavigation } from "../navigation/NavigationProvider";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { isSidebarOpen, filteredItems } = useNavigation();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full bg-[#0b0e14] border-r border-[#1e293b] shadow-2xl relative z-40 shrink-0"
    >
      <div className="flex items-center h-16 px-5 border-b border-[#1e293b] overflow-hidden bg-[#0a0b10] shrink-0">
        <div className="flex items-center gap-3 w-full">
          <img src="/logo.svg" alt="IGNITE Logo" className="w-auto h-8 max-w-[180px] object-contain shrink-0" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        {filteredItems.map((item) => {
          const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
          // Active if current path exactly matches href, or if it's a sub-route (excluding root /)
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-sm",
                isActive 
                  ? "bg-gradient-to-r from-[#2e1f4d] to-[#1e1b3a] text-[#a78bfa] font-semibold border border-[#4c1d95]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" 
                  : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-slate-200 font-medium border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-[#a78bfa]" : "text-slate-500 group-hover:text-slate-300")} />
              {isSidebarOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-14 px-2 py-1 bg-[#1e293b] text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-[#334155]">
                  {item.label}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* User Profile Snippet */}
      <div className="p-4 border-t border-[#1e293b] bg-[#0a0b10]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center shrink-0">
            <LucideIcons.User className="w-4 h-4 text-slate-400" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-200 truncate">Nikhil Sharma</span>
              <span className="text-xs text-slate-500 truncate">Administrator</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

"use client";

import React from "react";
import { useNavigation } from "../navigation/NavigationProvider";
import { cn } from "../../lib/utils";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "../navigation/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useNavigation();

  return (
    <div className="flex h-full w-full bg-[#0a0b10] text-slate-200 overflow-hidden font-sans">
      <CommandPalette />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Topbar />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

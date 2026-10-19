"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings,
  Activity,
  Calendar,
  Users
} from "lucide-react";

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Events", href: "/events", icon: FolderKanban },
  { name: "Schedules", href: "/tasks", icon: Activity },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Attendees", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-xl flex flex-col p-6 hidden md:flex shrink-0"
    >
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <span className="font-semibold text-xl tracking-tight text-white">Organizer</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
          ME
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">Mohit</div>
          <div className="text-xs text-slate-400">Pro Plan</div>
        </div>
      </div>
    </motion.aside>
  );
}

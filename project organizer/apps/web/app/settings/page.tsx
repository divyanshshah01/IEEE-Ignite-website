"use client";

import { motion } from "framer-motion";

export default function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 max-w-4xl mx-auto w-full flex-1 z-10"
    >
      <div className="glass rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <h3 className="text-white font-medium">Theme</h3>
              <p className="text-sm text-slate-400">Select your preferred interface theme</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <h3 className="text-white font-medium">Notifications</h3>
              <p className="text-sm text-slate-400">Receive alerts on your devices</p>
            </div>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

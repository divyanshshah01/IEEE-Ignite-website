"use client";

import { motion } from "framer-motion";

export default function Calendar() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-7xl mx-auto w-full flex-1 z-10 h-full flex flex-col"
    >
      <div className="glass flex-1 rounded-2xl p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Calendar View</h2>
          <p className="text-slate-400">Full calendar implementation coming soon.</p>
        </div>
      </div>
    </motion.div>
  );
}

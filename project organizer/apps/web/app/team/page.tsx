"use client";

import { motion } from "framer-motion";

export default function Team() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto w-full flex-1 z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass p-6 rounded-2xl text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4" />
            <h3 className="text-white font-medium">Team Member {i}</h3>
            <p className="text-sm text-slate-400">Software Engineer</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

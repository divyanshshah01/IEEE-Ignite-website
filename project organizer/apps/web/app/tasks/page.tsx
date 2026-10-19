"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export default function Tasks() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto w-full flex-1 z-10"
    >
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Today's Tasks</h2>
        <div className="space-y-4">
          {[
            { title: "Review pull requests", project: "Frontend Redesign", done: true },
            { title: "Design database schema", project: "Backend API", done: false },
            { title: "Write weekly report", project: "Management", done: false },
            { title: "Fix navigation bug", project: "Mobile App MVP", done: false },
          ].map((task, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                {task.done ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <Circle className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                )}
                <div>
                  <p className={`font-medium ${task.done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">{task.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

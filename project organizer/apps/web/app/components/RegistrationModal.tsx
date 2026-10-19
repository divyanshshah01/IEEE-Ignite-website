"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerForEvent, joinTeamWithCode } from "../actions/registration";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  initialMode?: "register" | "join";
}

export function RegistrationModal({ isOpen, onClose, eventId, eventName, initialMode = "register" }: RegistrationModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "join">(initialMode);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    year: "1st Year",
    degree: "",
    joinCode: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    let res;
    if (mode === "join") {
      if (!formData.joinCode || formData.joinCode.length !== 6) {
        setStatus("error");
        setErrorMessage("Please enter a valid 6-digit Team Token.");
        return;
      }
      res = await joinTeamWithCode(eventId, formData.joinCode, formData);
    } else {
      res = await registerForEvent(eventId, formData);
    }

    if (res.success) {
      setStatus("success");
      setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 2000);
    } else {
      setStatus("error");
      setErrorMessage(res.error || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0b0e14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-orbitron font-bold text-white">
              {mode === "join" ? "JOIN A TEAM" : "REGISTER NOW"}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-400 mb-6 font-manrope">
              You are registering for <strong className="text-white">{eventName}</strong>. 
              {mode === "register" ? " Fill out your details below." : " Enter your 6-digit team token and your details to join."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-manrope">
              {mode === "join" && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Team Token (6-digit)</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={formData.joinCode}
                    onChange={e => setFormData({ ...formData, joinCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. A1B2C3"
                    className="w-full bg-black/50 border border-purple-500/30 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono tracking-[0.2em] uppercase"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                    placeholder="Create a password (or enter your existing one)"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">University / College</label>
                  <input
                    required
                    type="text"
                    value={formData.university}
                    onChange={e => setFormData({ ...formData, university: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                    placeholder="MIT"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Degree</label>
                  <input
                    required
                    type="text"
                    value={formData.degree}
                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                    placeholder="B.Tech CS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Year</label>
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 transition-colors appearance-none"
                  >
                    <option value="1st Year" className="bg-[#0b0e14]">1st Year</option>
                    <option value="2nd Year" className="bg-[#0b0e14]">2nd Year</option>
                    <option value="3rd Year" className="bg-[#0b0e14]">3rd Year</option>
                    <option value="4th Year" className="bg-[#0b0e14]">4th Year</option>
                    <option value="Graduated" className="bg-[#0b0e14]">Graduated</option>
                  </select>
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p>Success! Redirecting to your dashboard...</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full mt-6 py-3 rounded-lg font-orbitron font-bold tracking-wider transition-all
                  ${status === "success" 
                    ? "bg-emerald-500 text-white" 
                    : "bg-purple-600 hover:bg-purple-500 text-white"}
                  ${status === "loading" ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {status === "loading" ? "PROCESSING..." : 
                 status === "success" ? "SUCCESS!" : 
                 mode === "join" ? "JOIN TEAM" : "COMPLETE REGISTRATION"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <button 
                onClick={() => setMode(mode === "register" ? "join" : "register")}
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors font-medium"
              >
                {mode === "register" ? "Have a team token? Join a team instead." : "Don't have a token? Register individually."}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

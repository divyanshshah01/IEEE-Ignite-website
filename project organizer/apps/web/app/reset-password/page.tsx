"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../actions/auth";
import { Flame } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No reset token provided. Please request a new link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("No reset token provided.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    const res = await resetPassword(token, newPassword);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setError(res.error || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="relative z-20 bg-[#0f1115]/90 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-xl max-w-md w-full shadow-2xl mx-4">
      <div className="flex flex-col items-center mb-8">
        <Flame className="w-12 h-12 text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] mb-4" />
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white tracking-widest text-center">
          RESET PASSWORD
        </h2>
        <p className="text-xs font-manrope text-slate-400 mt-2 text-center uppercase tracking-widest">
          Enter your new credentials
        </p>
      </div>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
          <h3 className="text-green-400 font-orbitron text-xl mb-2">ACCESS RESTORED</h3>
          <p className="text-slate-300 font-manrope text-sm">Your password has been reset successfully. Redirecting you to the portal...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-manrope font-bold text-slate-400 mb-2 block uppercase tracking-wider">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="text-xs font-manrope font-bold text-slate-400 mb-2 block uppercase tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !token} 
            className="w-full py-4 mt-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-orbitron font-bold tracking-widest rounded-md shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all uppercase"
          >
            {loading ? "PROCESSING..." : "UPDATE PASSWORD"}
          </button>
          
          <button 
            type="button" 
            onClick={() => router.push("/")} 
            className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest mt-2"
          >
            RETURN TO HOME
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#020202] text-white font-sans flex items-center justify-center">
      <AnimatedBackground />
      <React.Suspense fallback={<div className="text-orange-500 font-orbitron font-bold">LOADING...</div>}>
        <ResetPasswordForm />
      </React.Suspense>
    </div>
  );
}

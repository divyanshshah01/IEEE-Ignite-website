"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, requestPasswordReset } from "../actions/auth";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [resetting, setResetting] = useState(false);

  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await getCurrentUser();
      if (res.success) {
        setUser(res.user);
      }
      setLoading(false);
    }
    
    async function loadOrg() {
      const { getOrganizationDetails } = await import("../actions/organization");
      const res = await getOrganizationDetails();
      if (res.success) {
        setOrg(res.organization);
      }
    }

    checkAuth();
    loadOrg();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) return;
    const res = await loginUser(email, password);
    if (res.success) {
      window.location.reload();
    } else {
      setLoginError(res.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/";
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage("");
    setResetLink("");
    if (!resetEmail) return;
    
    setResetting(true);
    const res = await requestPasswordReset(resetEmail);
    if (res.success) {
      setResetMessage(res.message || "Reset link generated.");
      if (res.resetLink) setResetLink(res.resetLink);
    } else {
      setResetMessage(res.error || "Failed to generate link.");
    }
    setResetting(false);
  };

  return (
    <>
      {!isHomePage && (
      <>
        {/* Spacer to push content down below the fixed header */}
        <div className="h-20 w-full shrink-0" />
        <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-[#05050a]/80 backdrop-blur-md z-40 flex items-center px-8">
        <a href="/" className="flex items-center gap-3">
          {org?.logoUrl ? (
            <img src={org.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
          ) : (
            <Image src="/logo.svg" alt="IGNITE Logo" width={40} height={40} className="w-10 h-10 object-contain" />
          )}
          <span className="font-orbitron font-bold text-2xl tracking-widest hidden sm:block drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-white">IGNITE</span>
        </a>

        {/* Centered Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-manrope text-sm tracking-widest text-slate-300 absolute left-1/2 -translate-x-1/2">
          <a href="/" className="hover:text-orange-400 font-bold transition-colors">HOME</a>
          <a href="/events" className="hover:text-orange-400 font-bold transition-colors">EVENTS</a>
          <a href="/hackathons" className="hover:text-orange-400 font-bold transition-colors">HACKATHONS</a>
        </nav>
        
        {/* Right side User actions / Auth */}
        <div className="ml-auto flex items-center gap-4 text-sm font-manrope tracking-widest">
          {loading ? (
            <div className="w-20 h-8 animate-pulse bg-white/10 rounded-sm" />
          ) : user ? (
            <div className="flex items-center gap-6">
              <a href="/jury" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
                JURY
              </a>
              <a href="/teams" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                TEAMS
              </a>
              <a href="/dashboard" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
                MY DASHBOARD
              </a>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 font-bold transition-colors ml-4 border-l border-white/10 pl-4">
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="px-6 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-500 text-white font-orbitron font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            >
              LOGIN
            </button>
          )}
        </div>
      </header>
      </>
      )}

      {/* Very Simple Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0f1115] border border-white/10 p-8 rounded-xl max-w-sm w-full">
            <h2 className="text-2xl font-orbitron text-white mb-6">ACCESS PORTAL</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-manrope text-slate-400 mb-1 block">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="hacker@ignite.org"
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-manrope text-slate-400 block">PASSWORD</label>
                <button type="button" onClick={() => { setLoginModalOpen(false); setForgotModalOpen(true); }} className="text-[10px] text-cyan-500 hover:text-cyan-400 font-manrope">
                  FORGOT PASSWORD?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                required
              />
              {loginError && (
                <div className="text-red-400 text-sm mt-2">{loginError}</div>
              )}
              <button type="submit" className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron tracking-wider rounded-sm shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all">
                AUTHENTICATE
              </button>
              <button type="button" onClick={() => setLoginModalOpen(false)} className="text-sm text-slate-500 hover:text-white mt-2">
                CANCEL
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0f1115] border border-white/10 p-8 rounded-xl max-w-sm w-full">
            <h2 className="text-2xl font-orbitron text-white mb-2">RESET ACCESS</h2>
            <p className="text-xs font-manrope text-slate-400 mb-6">Enter your registered email to receive a reset link.</p>
            <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-manrope text-slate-400 mb-1 block">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="hacker@ignite.org"
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              {resetMessage && (
                <div className="text-sm mt-2 text-slate-300">{resetMessage}</div>
              )}
              {resetLink && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-900 rounded-sm mt-2">
                  <p className="text-[10px] text-cyan-400 font-manrope mb-1 uppercase">Dev Mode Reset Link:</p>
                  <a href={resetLink} className="text-xs text-white underline break-all">{resetLink}</a>
                </div>
              )}
              <button type="submit" disabled={resetting} className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-orbitron tracking-wider rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all">
                {resetting ? "GENERATING..." : "REQUEST LINK"}
              </button>
              <button type="button" onClick={() => setForgotModalOpen(false)} className="text-sm text-slate-500 hover:text-white mt-2">
                CLOSE
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

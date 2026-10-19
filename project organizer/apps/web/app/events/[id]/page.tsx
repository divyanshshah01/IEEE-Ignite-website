"use client";

import React, { useEffect, useState, use } from "react";
import { getEventDetails } from "../../actions/registrations";
import { MapPin, Calendar, Clock, Trophy, Users, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { RegistrationModal } from "../../components/RegistrationModal";
import QRCode from "react-qr-code";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [eventData, setEventData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"register" | "join">("register");

  useEffect(() => {
    async function fetchDetails() {
      const res = await getEventDetails(resolvedParams.id);
      if (res.success && res.data) {
        setEventData(res.data.event);
        setIsRegistered(res.data.isRegistered);
        setQrToken(res.data.qrCode);
      }
      setLoading(false);
    }
    fetchDetails();
  }, [resolvedParams.id]);

  const handleOpenModal = (mode: "register" | "join") => {
    setModalMode(mode);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center py-20 mt-20 text-white font-manrope">
        Event not found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      {/* Event Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden relative border border-white/10 flex flex-col justify-end p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/80 to-transparent z-10" />
        {/* Placeholder for actual event image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 font-orbitron text-xs font-bold tracking-widest rounded-sm backdrop-blur-sm border border-cyan-500/30">
              {eventData.hackathonTracks.length > 0 ? "HACKATHON" : "EVENT"}
            </span>
            <span className="px-3 py-1 bg-white/10 text-slate-300 font-manrope text-xs font-bold rounded-sm backdrop-blur-sm">
              {eventData.state}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 leading-tight">
            {eventData.name}
          </h1>
          <p className="text-xl text-slate-400 font-manrope max-w-2xl">
            {eventData.description || "Join us for an incredible journey of technology and innovation."}
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Main Info */}
        <div className="flex-1 space-y-8">
          <section className="bg-[#090a0f] border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">EVENT DETAILS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-300 font-manrope">
              <div className="flex items-start gap-4">
                <Calendar className="text-cyan-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500 font-bold mb-1">START DATE</p>
                  <p>{new Date(eventData.startAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500 font-bold mb-1">END DATE</p>
                  <p>{new Date(eventData.endAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="text-green-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500 font-bold mb-1">CAPACITY</p>
                  <p>{eventData.capacity ? `${eventData.capacity} Participants` : "Unlimited"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-red-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500 font-bold mb-1">LOCATION</p>
                  <p>{eventData.venueId ? "In-Person Event" : "Virtual / Online"}</p>
                </div>
              </div>
            </div>
          </section>

          {eventData.hackathonTracks.length > 0 && (
            <section className="bg-[#090a0f] border border-white/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="text-purple-400" /> HACKATHON TRACKS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventData.hackathonTracks.map((track: any) => (
                  <div key={track.id} className="p-4 border border-white/5 bg-white/5 rounded-xl">
                    <h3 className="font-orbitron font-bold text-lg text-white mb-2">{track.title}</h3>
                    <p className="text-sm text-slate-400 font-manrope">{track.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Registration */}
        <aside className="w-full md:w-96">
          <div className="bg-[#090a0f] border border-white/10 p-8 rounded-2xl sticky top-28">
            {isRegistered ? (
              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2">REGISTERED</h3>
                <p className="text-sm text-slate-400 font-manrope mb-6">
                  You are all set for this event! Keep your QR code ready for check-in.
                </p>
                {qrToken && (
                  <div className="bg-white p-4 rounded-xl inline-block mb-4">
                    <QRCode value={qrToken} size={128} />
                  </div>
                )}
                <p className="text-xs text-slate-500 font-manrope break-all max-w-[200px]">Token: {qrToken}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-orbitron font-bold text-white mb-4">JOIN THE EVENT</h3>
                <p className="text-sm text-slate-400 font-manrope mb-8">
                  Secure your spot at {eventData.name}. Limited capacity available.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleOpenModal("register")}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold tracking-wider text-lg rounded-sm shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all"
                  >
                    REGISTER NOW
                  </button>
                  {eventData.hackathonTracks.length > 0 && (
                    <button 
                      onClick={() => handleOpenModal("join")}
                      className="w-full py-4 bg-transparent border-2 border-purple-600 hover:bg-purple-600/20 text-white font-orbitron font-bold tracking-wider text-lg rounded-sm transition-all"
                    >
                      JOIN A TEAM
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <RegistrationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={resolvedParams.id}
        eventName={eventData.name}
        initialMode={modalMode}
      />
    </div>
  );
}

// File: app/lounge/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X, CheckCircle2, AlertCircle, ArrowRight, Wine, Users, Calendar, Clock } from "lucide-react";
import PaystackModal from "@/app/components/PaystackModal";
import { saveReservation } from "@/app/actions";

// VIP Access fee (₦) — adjust as needed
const VIP_ACCESS_FEE = 25000;

export default function LoungePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName]     = useState("");
  const [phone, setPhone]             = useState("");
  const [date, setDate]               = useState("");
  const [experience, setExperience]   = useState("Premium Bottle Service");
  const [isFormReady, setIsFormReady] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setIsFormReady(guestName.trim().length > 1 && phone.trim().length >= 8 && date !== "");
  }, [guestName, phone, date]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) return;
    setShowPaystack(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaystack(false);
    setIsSaving(true);
    setServerError("");

    const result = await saveReservation({
      customerName: guestName,
      phone,
      type: "LOUNGE",
      date,
      time: "TBD", 
      guests: experience.includes("Cabana") ? 10 : 2,
      experience,
      amount: VIP_ACCESS_FEE,
      isPaid: true
    });

    setIsSaving(false);
    if (result.success) {
      setIsConfirmed(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsConfirmed(false);
        setGuestName(""); setPhone(""); setDate("");
      }, 4500);
    } else {
      setServerError(result.error);
    }
  };

  const closeModal = () => {
    if (showPaystack) return;
    setIsModalOpen(false);
    setIsConfirmed(false);
    setGuestName(""); setPhone(""); setDate("");
  };

  return (
    <main className="min-h-screen bg-[#0f0a06] font-['Inter'] text-white selection:bg-[#C9A84C]/30 overflow-x-hidden relative">
      
      {/* ── Paystack Modal ── */}
      <PaystackModal
        isOpen={showPaystack}
        onClose={() => setShowPaystack(false)}
        onSuccess={handlePaymentSuccess}
        amount={VIP_ACCESS_FEE}
        description={`VIP Lounge — ${experience}`}
        customerName={guestName}
      />

      {/* ── VIP Booking Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0f0a06]/90 backdrop-blur-xl"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#141419] border border-white/10 p-10 sm:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-2xl animate-in fade-in zoom-in-95 duration-500">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-white/20 hover:text-[#C9A84C] transition-colors duration-500 bg-white/5 p-3 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* ── Success State ── */}
            {isConfirmed ? (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-8 border border-[#C9A84C]/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Reservation <span className="text-[#C9A84C]">Confirmed.</span>
                </h3>
                <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed">
                  Welcome to the elite, <strong>{guestName}</strong>. Your VIP reservation for <strong>{experience}</strong> is secured. Our concierge will contact you on {phone}.
                </p>
              </div>
            ) : isSaving ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest">Securing VIP Access...</p>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="mb-12 text-center">
                  <span className="block text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.6em] mb-6 border border-[#C9A84C]/20 w-fit mx-auto px-4 py-1.5">
                    Private Entry
                  </span>
                  <h3 className="text-4xl sm:text-6xl text-white font-bold tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Reserve <span className="text-[#C9A84C]">VIP</span> Access
                  </h3>
                  <p className="text-gray-400 text-sm font-light tracking-wide max-w-sm mx-auto leading-relaxed">
                    VIP access requires a reservation deposit of <strong className="text-[#C9A84C]">₦{VIP_ACCESS_FEE.toLocaleString()}</strong>. Confirmed via Paystack.
                  </p>
                </div>

                <form className="space-y-10" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold block">Guest Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-light text-white focus:outline-none focus:border-[#C9A84C] transition-all duration-300 placeholder:text-white/10"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold block">Contact Number</label>
                      <input
                        type="tel"
                        placeholder="+234..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-light text-white focus:outline-none focus:border-[#C9A84C] transition-all duration-300 placeholder:text-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold block">Arrival Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-light text-white focus:outline-none focus:border-[#C9A84C] transition-all duration-300 [color-scheme:dark]"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold block">Experience</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-light text-white focus:outline-none focus:border-[#C9A84C] transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option className="bg-[#141419]">Premium Bottle Service</option>
                        <option className="bg-[#141419]">Daybed &amp; Cabana</option>
                        <option className="bg-[#141419]">Priority Guestlist</option>
                      </select>
                    </div>
                  </div>

                  {serverError && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4" /> {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormReady || isSaving}
                    className="w-full mt-6 bg-[#C9A84C] text-[#0f0a06] text-[10px] font-black uppercase tracking-[0.4em] py-5 rounded-sm hover:bg-white transition-all duration-500 shadow-xl shadow-[#C9A84C]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm & Pay ₦{VIP_ACCESS_FEE.toLocaleString()}
                  </button>

                  <div className="text-center">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">
                      Secure Payments: Card · Bank Transfer · GTBank / Access
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Cinematic Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/lounge_bg.png"
            alt="Fortunate Hub VIP Lounge"
            fill
            priority
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-[#0f0a06]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a06]/40 to-transparent" />
        </div>

        {/* Floating Accents */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C9A84C]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#4A1C21]/20 blur-[120px] rounded-full" />

        <div className="relative z-10 text-center max-w-5xl mx-auto py-20 px-6">
          <div className="flex items-center justify-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.6em]">
              3rd Floor • The Summit
            </span>
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
          </div>
          
          <h1
            className="text-6xl sm:text-8xl lg:text-[120px] font-bold text-white mb-10 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ascend to <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px #C9A84C" }}>Elite Luxury.</span>
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-base mb-16 max-w-2xl mx-auto font-light tracking-wide leading-relaxed animate-in fade-in duration-1000 delay-300">
            Ilorin's most exclusive lifestyle destination. Sun-drenched cabanas, premium bottle service, and an architectural ambiance crafted for those who demand the extraordinary.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-12 py-6 bg-[#C9A84C] text-[#0f0a06] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 rounded-sm shadow-2xl shadow-[#C9A84C]/20 w-full sm:w-auto"
            >
              <span className="relative z-10">Reserve VIP Access</span>
              <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>
            <Link
              href="/"
              className="group px-12 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-500 rounded-sm w-full sm:w-auto text-center"
            >
              Back to Hub
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 animate-bounce">
          <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Discover</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ── Section: Features ── */}
      <section className="py-40 px-8 sm:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            { icon: <Wine className="w-8 h-8" />, title: "Bottle Service", desc: "Curated selection of premium spirits and vintages served with theatrical precision." },
            { icon: <Users className="w-8 h-8" />, title: "Private Events", desc: "The ultimate venue for corporate mixers, birthdays, and exclusive celebrations." },
            { icon: <Calendar className="w-8 h-8" />, title: "Daily Vibes", desc: "From sunset chill to late-night energy, the ambiance evolves with the clock." }
          ].map((feature, i) => (
            <div key={i} className="group">
              <div className="text-[#C9A84C] mb-8 group-hover:scale-110 transition-transform duration-500 inline-block p-4 bg-white/5 rounded-2xl border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer Link ── */}
      <footer className="py-20 border-t border-white/5 text-center">
        <Image src="/5050_logo2.png" alt="Logo" width={40} height={40} className="mx-auto mb-6 grayscale opacity-20" />
        <p className="text-[10px] text-white/10 font-bold uppercase tracking-[0.6em]">
          Fortunate Hub &bull; VIP Lounge
        </p>
      </footer>
    </main>
  );
}

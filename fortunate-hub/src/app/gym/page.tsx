// File: app/gym/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import PaystackModal from "@/app/components/PaystackModal";
import { saveGymMembership } from "@/app/actions";

// Plan config
const plans = [
  { key: "Day Pass",     price: 10000,  description: "Full Gym Access • Locker Room",              tier: "01" },
  { key: "Monthly Pro",  price: 100000, description: "24/7 Access • Classes • Eatery Perks",       tier: "02", badge: "Standard" },
  { key: "VIP Annual",   price: 1000000, description: "All Access • PT Sessions • Lounge Priority", tier: "03" },
];

export default function HighFashionGymPage() {
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [selectedPlan, setSelectedPlan]       = useState("Monthly Pro");
  const [memberName, setMemberName]           = useState("");
  const [memberPhone, setMemberPhone]         = useState("");
  const [isFormComplete, setIsFormComplete]   = useState(false);
  const [showPaystack, setShowPaystack]       = useState(false);
  const [isMemberConfirmed, setIsMemberConfirmed] = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [serverError, setServerError]         = useState("");

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else             document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  useEffect(() => {
    setIsFormComplete(memberName.trim().length > 1 && memberPhone.trim().length >= 8);
  }, [memberName, memberPhone]);

  const openModal = (plan: string) => {
    setSelectedPlan(plan);
    setMemberName("");
    setMemberPhone("");
    setIsFormComplete(false);
    setIsMemberConfirmed(false);
    setIsModalOpen(true);
  };

  const currentPlan = plans.find((p) => p.key === selectedPlan) ?? plans[1];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    setShowPaystack(true); // Open Paystack modal
  };

  const handlePaymentSuccess = async () => {
    setShowPaystack(false);
    setIsSaving(true);
    setServerError("");

    const result = await saveGymMembership({
      memberName,
      phone: memberPhone,
      plan: selectedPlan,
      isPaid: true
    });

    setIsSaving(false);
    if (result.success) {
      setIsMemberConfirmed(true);
      setTimeout(() => setIsModalOpen(false), 4000);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] font-['Inter'] text-white selection:bg-[#C9A84C] selection:text-[#050505] overflow-x-hidden">

      {/* ── Paystack Payment Modal ── */}
      <PaystackModal
        isOpen={showPaystack}
        onClose={() => setShowPaystack(false)}
        onSuccess={handlePaymentSuccess}
        amount={currentPlan.price}
        description={`Fortunate Gym — ${selectedPlan}`}
        customerName={memberName}
      />

      {/* ── Sticky Top Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 sm:px-16 py-6 flex items-center justify-between bg-[#050505]/80 backdrop-blur-md border-b border-[#C9A84C]/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-5 py-2.5 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C9A84C] hover:text-[#050505] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Return to Hub
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hidden sm:block">
          Fortunate Gym <span className="text-[#C9A84C] mx-2">•</span> 2nd Floor
        </span>
      </nav>

      {/* ── Membership Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md">
          <div className="w-full max-w-4xl p-6 sm:p-12 relative">
            <button
              onClick={() => !showPaystack && setIsModalOpen(false)}
              className="absolute top-0 right-6 sm:right-12 text-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors duration-500 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]"
            >
              Close <X className="w-6 h-6" strokeWidth={1} />
            </button>

            {/* ── Success State ── */}
            {isMemberConfirmed ? (
              <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700 py-20">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-5xl sm:text-7xl font-light tracking-tighter mb-6 text-[#C9A84C]">
                  Access Granted.
                </h3>
                <p className="text-white/50 font-light tracking-wide max-w-md">
                  Welcome, <span className="text-white">{memberName}</span>. Your{" "}
                  <span className="text-[#C9A84C]">{selectedPlan}</span> is now active.
                  Present this confirmation at the front desk.
                </p>
              </div>
            ) : isSaving ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest">Recording Membership...</p>
              </div>
            ) : (
              /* ── Form State ── */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                  <h3 className="text-5xl sm:text-7xl font-light tracking-tighter leading-none mb-8 text-[#C9A84C]">
                    Initiation.
                  </h3>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-sm mb-6">
                    Securing <span className="text-white">{selectedPlan}</span> access for ₦{currentPlan.price.toLocaleString()}.
                    Complete your details, then confirm payment to activate your membership.
                  </p>
                  {/* Payment required notice */}
                  <div className="flex items-start gap-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-lg px-4 py-3 mb-6">
                    <span className="text-[#C9A84C] text-[10px]">🔒</span>
                    <p className="text-[#C9A84C]/80 text-[10px] font-medium leading-relaxed">
                      Payment is required to activate gym access. Your membership will only be confirmed after successful payment.
                    </p>
                  </div>
                  <div className="w-full h-[1px] bg-[#C9A84C]/20" />
                </div>

                <form className="space-y-10" onSubmit={handleFormSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl font-light focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-white/20"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl font-light focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-white/20"
                      required
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full bg-[#050505] border-b border-white/20 pb-4 text-2xl font-light focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none cursor-pointer text-white/80"
                    >
                      {plans.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.key} — ₦{p.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {serverError && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4" /> {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormComplete || isSaving}
                    className="flex items-center gap-6 mt-4 group disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="w-12 h-12 rounded-full border border-[#C9A84C]/50 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:text-[#050505] transition-all duration-700 text-[#C9A84C] group-disabled:hover:bg-transparent">
                      <ArrowRight className="w-4 h-4" strokeWidth={1} />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A84C]">
                      Proceed to Payment
                    </span>
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[8px] font-bold text-[#C9A84C]/40 uppercase tracking-[0.2em]">
                      Secure Payments: Card · Bank Transfer · USSD
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section 1: Editorial Hero ── */}
      <section className="relative h-screen flex flex-col justify-end px-8 sm:px-16 pb-16 sm:pb-24">
        <div className="absolute inset-0 z-0">
          <Image src="/gym_bg.png" alt="Modern Gym" fill className="object-cover object-center opacity-50" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 to-transparent" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-[#7D1C2B]/30 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#C9A84C]/10 blur-[100px] pointer-events-none" />
        </div>
        <div className="absolute top-32 left-8 sm:left-16 z-10">
          <span className="inline-flex items-center gap-3 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 backdrop-blur-sm text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.4em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            2nd Floor • Open Now
          </span>
        </div>
        <div className="relative z-10 w-full max-w-[1800px] mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-12">
          <h1 className="text-6xl sm:text-8xl lg:text-[140px] font-light leading-[0.8] tracking-tighter">
            Evolve <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #C9A84C" }}>Limitlessly.</span>
          </h1>
          <div className="flex flex-col gap-4 max-w-xs">
            <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed tracking-wide">
              Premium conditioning, elite programming, and architectural perfection on the 2nd floor of Fortunate Hub.
            </p>
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-[#C9A84C] text-[#050505] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-colors duration-300 text-center"
            >
              Explore Memberships
            </button>
            <button
              onClick={() => document.getElementById("facilities")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 border border-white/20 text-white/70 text-[10px] font-bold uppercase tracking-[0.3em] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-300 text-center"
            >
              View Facilities
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 2: Facilities ── */}
      <section id="facilities" className="py-32 sm:py-48 px-8 sm:px-16 max-w-[1800px] mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-24">
          <div className="w-12 h-[2px] bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.5em]">The Arsenal</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {[
          { num: "01", label: "Strength", title: "State-of-the-Art", accent: "Gear.", image: "/gym_bg.png", alt: "Equipment", accentColor: "#C9A84C", plan: "Day Pass", caption: "Tournament-Grade Equipment", side: "right" },
          { num: "02", label: "Coaching", title: "Expert", accent: "Trainers.", image: "/hero_bg.png", alt: "Coaching", accentColor: "#C9A84C", plan: "Monthly Pro", caption: "Elite Certified Coaches", side: "left" },
          { num: "03", label: "Recovery", title: "The Hub", accent: "Advantage.", image: "/rooftop_bg.png", alt: "Recovery", accentColor: "#7D1C2B", plan: "VIP Annual", caption: "Exclusive Member Perks", side: "right" },
        ].map((block, i) => (
          <div key={block.num}>
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start mb-32 ${block.side === "left" ? "" : ""}`}>
              {block.side === "left" && (
                <div className="lg:col-span-7 relative h-[500px] sm:h-[700px] w-full overflow-hidden group order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <Image src={block.image} alt={block.alt} fill className="object-cover transition-all duration-[3000ms] group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0" />
                  <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A84C] bg-[#050505]/80 px-4 py-2 border border-[#C9A84C]/30">{block.caption}</span>
                  </div>
                </div>
              )}

              <div className={`${block.side === "left" ? "lg:col-span-5 lg:pl-16 order-1 lg:order-2" : "lg:col-span-4"} lg:sticky lg:top-32`}>
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.4em] px-3 py-1 mb-6 text-white" style={{ background: block.accentColor }}>
                  {block.num} / {block.label}
                </span>
                <h2 className="text-4xl sm:text-6xl font-light tracking-tighter mb-8">
                  {block.title} <br />
                  <span style={{ color: block.accentColor }}>{block.accent}</span>
                </h2>
                <p className="text-white/50 text-sm font-light leading-relaxed max-w-sm mb-8">
                  {block.num === "01" && "Equipped with industry-leading machinery, expansive free-weight zones, and high-performance lifting platforms designed exclusively for the serious athlete."}
                  {block.num === "02" && "Work with elite coaches dedicated to pushing your boundaries, correcting biomechanics, and optimizing your long-term programming for absolute perfection."}
                  {block.num === "03" && "Refuel post-workout. Fortunate Gym members receive exclusive priority and wellness amenities at the Eatery downstairs, seamlessly integrating your lifestyle."}
                </p>
                {block.num === "03" ? (
                  <Link href="/restaurant" className="text-[10px] font-bold uppercase tracking-[0.3em] pb-1 hover:opacity-70 transition-colors flex items-center gap-3" style={{ color: block.accentColor, borderBottom: `1px solid ${block.accentColor}50` }}>
                    Visit Eatery <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                ) : (
                  <button onClick={() => openModal(block.plan)} className="text-[10px] font-bold uppercase tracking-[0.3em] pb-1 hover:opacity-70 transition-colors flex items-center gap-3" style={{ color: block.accentColor, borderBottom: `1px solid ${block.accentColor}50` }}>
                    Join Now <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </button>
                )}
              </div>

              {block.side === "right" && (
                <div className="lg:col-span-8 relative h-[500px] sm:h-[700px] w-full overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={{ background: `linear-gradient(to top, ${block.accentColor}40, transparent)` }} />
                  <Image src={block.image} alt={block.alt} fill className="object-cover transition-all duration-[3000ms] group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0" />
                  <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A84C] bg-[#050505]/80 px-4 py-2 border border-[#C9A84C]/30">{block.caption}</span>
                  </div>
                </div>
              )}
            </div>
            {i < 2 && <div className="w-full h-[1px] bg-gradient-to-r from-[#C9A84C]/30 via-white/5 to-transparent mb-32" />}
          </div>
        ))}
      </section>

      {/* ── Section 3: Pricing ── */}
      <section id="pricing" className="py-32 sm:py-48 px-8 sm:px-16 bg-[#080303] relative">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <div className="w-12 h-[2px] bg-[#7D1C2B]" />
            <span className="text-[#7D1C2B] text-[10px] font-bold uppercase tracking-[0.5em]">Membership Access</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <div className="mb-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
            <h2 className="text-6xl sm:text-8xl font-light tracking-tighter">
              Select Your <span className="text-[#C9A84C]">Tier.</span>
            </h2>
            <p className="text-white/50 text-sm font-light max-w-xs">
              Payment is confirmed via Paystack before access is granted. All tiers include full locker room access.
            </p>
          </div>

          <div className="border-t border-white/10">
            {plans.map((plan, idx) => (
              <div
                key={plan.key}
                className={`group border-b py-12 flex flex-col lg:flex-row justify-between items-start lg:items-center transition-all duration-700 px-8 cursor-pointer ${
                  idx === 1
                    ? "border-[#7D1C2B]/50 hover:bg-[#7D1C2B] hover:text-white"
                    : "border-white/10 hover:bg-[#C9A84C] hover:text-[#050505]"
                }`}
                onClick={() => openModal(plan.key)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-20 w-full lg:w-2/3">
                  <span className={`text-[10px] font-medium uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity ${idx === 1 ? "text-[#7D1C2B]" : "text-[#C9A84C]"} group-hover:text-inherit`}>
                    {plan.tier}
                  </span>
                  <div className="flex items-center gap-6">
                    <h3 className="text-4xl sm:text-5xl font-light tracking-tighter">{plan.key}</h3>
                    {plan.badge && <span className="text-[8px] border border-current px-2 py-1 uppercase tracking-[0.3em]">{plan.badge}</span>}
                  </div>
                  <span className="text-xs font-light tracking-wide opacity-50 group-hover:opacity-100 hidden lg:block">{plan.description}</span>
                </div>
                <div className="mt-8 lg:mt-0 flex items-center justify-between w-full lg:w-auto gap-12">
                  <span className="text-2xl sm:text-4xl font-light">
                    ₦{(plan.price / 1000).toFixed(0)}{plan.price >= 1000000 ? "M" : "K"}
                  </span>
                  <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-24 px-8 text-center bg-[#050505] border-t border-[#C9A84C]/10">
        <Link href="/" className="inline-block group mb-8">
          <Image src="/5050_logo2.png" alt="Logo" width={60} height={60} className="opacity-70 group-hover:opacity-100 transition-all duration-700 rounded-full ring-2 ring-[#C9A84C]/20 group-hover:ring-[#C9A84C]/60" />
        </Link>
        <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-bold mb-2">Fortunate Gym</p>
        <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">2nd Floor • Fortunate Hub • Ilorin</p>
      </footer>
    </main>
  );
}

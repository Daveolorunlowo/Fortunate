// File: app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Utensils, Wine, Dumbbell, ArrowRight, CakeSlice, Truck, Phone } from "lucide-react";

const ecosystem = [
  {
    title: "The Restaurant",
    description: "Exquisite daily foods, quick snacks, and our signature grills in a luxurious dining atmosphere.",
    href: "/restaurant",
    icon: <Utensils className="w-5 h-5" />,
    image: "/hero_bg.png",
    tag: "Open Now",
  },
  {
    title: "The Confectionery",
    description: "Home to Fifty-Fifty Foods. Freshly baked bread, custom cakes, and assorted premium pastries.",
    href: "/restaurant", // Assuming it routes to same place for now, or a specific bakery page later
    icon: <CakeSlice className="w-5 h-5" />,
    image: "/rooftop_bg.png",
    tag: "Open Now",
  },
  {
    title: "The Gym",
    description: "Located on the 2nd Floor. State-of-the-art equipment, personal training, and elite recovery zones.",
    href: "/gym",
    icon: <Dumbbell className="w-5 h-5" />,
    image: "/gym_bg.png",
    tag: "Open Now",
  },
  {
    title: "The VIP Lounge",
    description: "Located on the 3rd Floor. Premium cocktails, exclusive events, and high-end nightlife.",
    href: "/lounge",
    icon: <Wine className="w-5 h-5" />,
    image: "/lounge_bg.png",
    tag: "Open Now",
  },
];

export default function MainHubDirectory() {
  return (
    <main className="min-h-screen bg-[#0f0a06] font-['Inter'] selection:bg-[#C9A84C]/30 selection:text-white">
      {/* ── Cinematic Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg.png"
            alt="Fortunate Hub Interior"
            fill
            priority
            className="object-cover object-center animate-[cinematic-pan_30s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-[#0f0a06]/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,10,6,0.7)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block text-[#C9A84C] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] mb-8 border border-[#C9A84C]/30 px-5 py-2 backdrop-blur-sm bg-black/20">
            Taiwo Isale • Ilorin
          </span>
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter leading-[1.05] drop-shadow-2xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            One Destination.<br />
            <span className="text-[#C9A84C] drop-shadow-[0_0_40px_rgba(201,168,76,0.35)]">Many Choices.</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto font-light tracking-wide leading-relaxed mb-14">
            Dine on exquisite cuisine, pick up freshly baked confectioneries, push your limits in our state-of-the-art gym,
            and unwind in our premium lounge — all under one breathtaking roof.
          </p>
          <a
            href="#explore"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-[#C9A84C] transition-colors border-b border-white/10 hover:border-[#C9A84C] pb-2"
          >
            Explore Services <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* ── Navigation Grid ── */}
      <section id="explore" className="px-4 sm:px-8 pt-24 sm:pt-32 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.5em] block mb-4">The Directory</span>
          <h2
            className="text-4xl sm:text-6xl font-bold text-white tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ecosystem.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative overflow-hidden rounded-lg h-[340px] sm:h-[380px] flex flex-col justify-end p-8 sm:p-10 border border-white/5 hover:border-[#C9A84C]/40 bg-black/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[2500ms] ease-out filter grayscale-[40%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-[#0f0a06]/70 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/25">
                    {item.icon}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.tag}
                  </span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-sm">
                  {item.description}
                </p>

                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-[#C9A84C] transition-colors duration-500">
                  Enter <ArrowRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Delivery Services Banner ── */}
      <section className="px-4 sm:px-8 pb-24 sm:pb-32 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-[#C9A84C]/20 bg-[#1a120b] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Truck className="w-5 h-5 text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.4em]">Prompt Delivery Across Ilorin</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Can't make it to the Hub?
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Order your favorite meals, grills, cakes, and bread from Fortunate Hub by phone or online. We ensure your food arrives hot, fresh, and on time.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <a href="tel:09038532190" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#C9A84C] text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors duration-300 rounded-sm">
              <Phone className="w-4 h-4" /> Call to Order
            </a>
            <Link href="/restaurant" className="flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-300 rounded-sm">
              Order Online
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-16 px-4 text-center bg-black/40">
        <img src="/5050_logo2.png" alt="Logo" className="h-14 w-14 rounded-full object-cover mx-auto mb-4 ring-1 ring-white/10" />
        <p className="text-gray-600 text-[10px] tracking-[0.3em] uppercase mb-6">
          Dine &bull; Train &bull; Unwind
        </p>
        <div className="flex justify-center flex-wrap gap-8 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-8">
          <a href="/restaurant" className="hover:text-[#C9A84C] transition-colors">Menu & Bakery</a>
          <a href="/restaurant/book" className="hover:text-[#C9A84C] transition-colors">Reservations</a>
          <a href="https://www.instagram.com/5050_express_kitchen_24/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors">Instagram</a>
        </div>
        <p className="text-gray-700 text-[9px] tracking-widest uppercase leading-loose">
          &copy; {new Date().getFullYear()} Fortunate Hub &mdash; Harmony Estate Rd, Taiwo Isale, Ilorin 240101, Kwara<br />
          0903 853 2190 &nbsp;|&nbsp; 0707 064 6407
        </p>
        {/* ── Internal Staff Links (subtle, not styled for customers) ── */}
        <div className="mt-10 pt-6 border-t border-white/[0.03] flex justify-center gap-8">
          <a
            href="/staff"
            className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/10 hover:text-white/30 transition-colors duration-500"
          >
            Staff Portal
          </a>
          <a
            href="/admin"
            className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/10 hover:text-white/30 transition-colors duration-500"
          >
            Management
          </a>
        </div>
      </footer>
    </main>
  );
}

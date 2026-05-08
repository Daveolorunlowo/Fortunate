// File: app/restaurant/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone, ArrowRight, ChefHat } from "lucide-react";

const dishes = [
  {
    name: "Smoky Jollof",
    price: "₦6,500",
    image: "/dish1.png",
    badge: "Signature",
    badgeColor: "bg-[#7D1C2B]",
    description: "Parboiled long-grain rice infused with hardwood smoke and our secret heritage spice blend.",
  },
  {
    name: "Special Fried Rice",
    price: "₦7,000",
    image: "/dish2.png",
    badge: null,
    badgeColor: "",
    description: "Premium jasmine rice tossed with fresh mixed veggies, succulent prawns, and savory soy-sesame notes.",
  },
  {
    name: "Assorted Meat Platter",
    price: "₦5,500",
    image: "/boiled_yam.png",
    badge: "New",
    badgeColor: "bg-[#C9A84C] text-[#0f0a06]",
    description: "A rich selection of perfectly seasoned and grilled meats, served with our signature pepper sauce.",
  },
];

export default function RestaurantHome() {
  return (
    <main className="min-h-screen bg-[#faf8f5] font-['Inter']">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg.png"
            alt="Fortunate Restaurant Interior"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10">
          <span className="inline-block text-[#C9A84C] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] mb-6 border-b border-[#C9A84C]/30 pb-2">
            Taste the Fortunate Experience
          </span>
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-xl leading-[1.05] tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Elevated Dining<br />in Ilorin
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-12 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Authentic flavors meet modern luxury. Discover a curated menu designed to delight your senses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/eatery"
              className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 rounded-sm bg-[#7D1C2B] text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(125,28,43,0.4)]"
            >
              <span className="relative z-10">View Full Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </Link>
            <Link
              href="/restaurant/book"
              className="w-full sm:w-auto px-10 py-4 rounded-sm border border-[#C9A84C]/50 text-[#C9A84C] font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-[#C9A84C]/10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Info Bar ── */}
      <section className="bg-[#1a0a0c] text-white py-6 border-b border-[#C9A84C]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4 sm:pt-0">
              <div className="p-3 bg-[#7D1C2B]/20 rounded-full text-[#C9A84C]">
                <Clock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Opening Hours</p>
                <p className="text-sm font-semibold tracking-wide">6:00 AM – 10:00 PM</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4 sm:pt-0 sm:pl-6">
              <div className="p-3 bg-[#7D1C2B]/20 rounded-full text-[#C9A84C]">
                <MapPin className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Location</p>
                <p className="text-sm font-semibold tracking-wide">Harmony Estate Rd, Ilorin</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4 sm:pt-0 sm:pl-6">
              <div className="p-3 bg-[#7D1C2B]/20 rounded-full text-[#C9A84C]">
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Reservations / Delivery</p>
                <p className="text-sm font-semibold tracking-wide">0903 853 2190</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Our Chef (Split Section) ── */}
      <section className="bg-white">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative min-h-[450px] lg:min-h-[600px] overflow-hidden group">
            <Image
              src="/reserved_table.png"
              alt="Our Chef in Action"
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-10 sm:p-16 lg:p-20">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/25">
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#7D1C2B]/60">Meet Our Chef</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4a1c21] mb-6 leading-tight tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Where Tradition Meets Innovation
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 font-light">
                Our kitchen is led by a team of passionate culinary artists who blend heritage Nigerian recipes
                with contemporary techniques. Every plate tells a story of Ilorin&apos;s rich food culture,
                elevated for the modern palate. From our signature smoky jollof to freshly baked artisan bread,
                each dish is crafted with locally sourced ingredients and obsessive attention to detail.
              </p>
              <Link
                href="/restaurant/book"
                className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D1C2B] hover:text-[#C9A84C] transition-colors group/btn border-b border-[#7D1C2B]/20 hover:border-[#C9A84C] pb-2"
              >
                Reserve Your Experience
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chef's Specials (Featured Dishes Grid) ── */}
      <section className="py-24 px-4 sm:px-6 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.5em] block mb-4">Curated For You</span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#4a1c21] mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Chef&apos;s Specials
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden group transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-gray-200 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {dish.badge && (
                    <div className={`absolute top-4 right-4 ${dish.badgeColor} text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md`}>
                      {dish.badge}
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-xl font-bold text-[#4a1c21]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {dish.name}
                    </h3>
                    <span className="text-[#C9A84C] font-bold text-sm">{dish.price}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-1 font-light">
                    {dish.description}
                  </p>
                  <Link
                    href="/eatery"
                    className="block text-center w-full py-3 text-[10px] font-bold uppercase tracking-widest text-[#7D1C2B] border border-[#7D1C2B]/15 rounded-sm hover:bg-[#7D1C2B] hover:text-white transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Footer ── */}
      <footer className="bg-[#1a0a0c] py-16 text-center">
        <h3
          className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Stay in the <span className="text-[#C9A84C]">Loop</span>
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm mb-8 max-w-sm mx-auto font-light tracking-wide">
          Join our exclusive circle for seasonal menu reveals, private events, and special offers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3 px-6">
          <input
            type="email"
            placeholder="Email Address"
            className="px-5 py-3 w-full bg-white/5 border border-white/10 rounded-sm text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
          <button className="bg-[#7D1C2B] text-white px-8 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-[#611521] transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </footer>
    </main>
  );
}

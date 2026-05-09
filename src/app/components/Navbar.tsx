// File: app/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";

const navLinks = [
  { label: "Eatery", href: "/restaurant" },
  { label: "Lounge", href: "/lounge" },
  { label: "Gym", href: "/gym" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#0f0a06]/95 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/5050_logo2.png"
              alt="Fortunate Hub Logo"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[#C9A84C]/30 group-hover:ring-[#C9A84C] transition-all duration-500"
            />
            <span
              className="hidden sm:block text-lg font-bold text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fortunate<span className="text-[#C9A84C]">Hub</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C9A84C] group-hover:w-3/4 transition-all duration-500" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/restaurant/book"
              className="group relative overflow-hidden px-7 py-2.5 rounded-sm bg-[#C9A84C] text-[#0f0a06] font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
            >
              <span className="relative z-10">Book a Table</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#0f0a06]/98 backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button inside overlay */}
        <button
          aria-label="Close mobile menu"
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-7 h-7" />
        </button>

        <ul className="flex flex-col items-center gap-2 mb-12">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-8 py-4 text-2xl font-bold text-white/80 hover:text-[#C9A84C] uppercase tracking-widest transition-all duration-300"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/restaurant/book"
          onClick={() => setIsOpen(false)}
          className="px-12 py-4 rounded-sm bg-[#C9A84C] text-[#0f0a06] font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
        >
          Book a Table
        </Link>
      </div>
    </header>
  );
}

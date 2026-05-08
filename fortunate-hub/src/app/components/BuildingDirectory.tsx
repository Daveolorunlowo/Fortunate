"use client";

import Link from "next/link";
import { UtensilsCrossed, Wine, Dumbbell, Sun, ArrowRight } from "lucide-react";

interface Floor {
  id: string;
  level: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  image: string;
  tag?: string;
  isReversed?: boolean;
}

const floors: Floor[] = [
  {
    id: "floor-ground",
    level: "Ground Floor",
    title: "Fortunate Restaurant",
    description:
      "Experience the art of fine dining with our signature African-fusion cuisine. From smoky jollof rice to chef-crafted platters in a breathtaking luxury setting.",
    icon: <UtensilsCrossed className="w-5 h-5" strokeWidth={1.5} />,
    href: "/restaurant",
    image: "/hero_bg.png",
    tag: "Open Now",
    isReversed: false,
  },
  {
    id: "floor-1st",
    level: "1st Floor",
    title: "Fortunate Lounge",
    description:
      "A premium social space for cocktails, live music, and curated events. Unwind in plush velvet seating surrounded by warm amber luxury.",
    icon: <Wine className="w-5 h-5" strokeWidth={1.5} />,
    href: "/lounge",
    image: "/lounge_bg.png",
    tag: "Weekend Events",
    isReversed: true,
  },
  {
    id: "floor-2nd",
    level: "2nd Floor",
    title: "Fortunate Gym",
    description:
      "State-of-the-art sleek black equipment, personal training, and group classes under moody LED lighting. Build strength, endurance, and consistency.",
    icon: <Dumbbell className="w-5 h-5" strokeWidth={1.5} />,
    href: "/gym",
    image: "/gym_bg.png",
    tag: "24/7 Access",
    isReversed: false,
  },
  {
    id: "floor-rooftop",
    level: "Rooftop",
    title: "The Sky Terrace",
    description:
      "Breathtaking views paired with handcrafted cocktails and al-fresco dining. The perfect backdrop for unforgettable evenings under fairy lights.",
    icon: <Sun className="w-5 h-5" strokeWidth={1.5} />,
    href: "/lounge#rooftop",
    image: "/rooftop_bg.png",
    tag: "Seasonal",
    isReversed: true,
  },
];

function FloorSection({ floor }: { floor: Floor }) {
  return (
    <div
      id={floor.id}
      className="relative flex flex-col justify-center min-h-[70vh] sm:min-h-[80vh] overflow-hidden group py-24 px-4 sm:px-12"
    >
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={floor.image} 
          alt={floor.title} 
          className="w-full h-full object-cover transition-all duration-[3000ms] ease-out group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-[2000ms]"></div>
      </div>

      {/* Floating Glassmorphic Content Side */}
      <div className={`relative z-10 w-full max-w-lg ${floor.isReversed ? 'lg:mr-auto lg:ml-12' : 'lg:ml-auto lg:mr-12'} backdrop-blur-2xl bg-[#0f0a06]/40 border border-white/10 p-10 sm:p-14 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:-translate-y-2`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
            {floor.icon}
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-[0.4em] text-white/80">
              {floor.level}
            </span>
            {floor.tag && (
              <span className="inline-block mt-1.5 text-[8px] font-bold px-2 py-0.5 border border-[#C9A84C]/50 uppercase tracking-widest bg-transparent text-[#C9A84C]">
                {floor.tag}
              </span>
            )}
          </div>
        </div>

        <h3
          className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {floor.title}
        </h3>

        <p className="text-gray-300 text-xs sm:text-sm leading-loose mb-10 font-light tracking-wide">
          {floor.description}
        </p>

        <Link
          href={floor.href}
          className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#C9A84C] transition-colors group/btn pb-2 border-b border-white/20 hover:border-[#C9A84C]"
        >
          Discover {floor.title.split(' ')[1]}
          <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-3" />
        </Link>
      </div>
    </div>
  );
}

export default function BuildingDirectory() {
  return (
    <section id="directory" className="bg-white">
      {/* Intro Header */}
      <div className="py-32 px-4 text-center bg-[#0f0a06]">
        <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.5em] mb-6 block">The Directory</span>
        <h2
          className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tighter"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Explore Every Level
        </h2>
        <div className="w-16 h-[1px] bg-[#C9A84C] mx-auto"></div>
      </div>

      {/* Zig-Zag Sections */}
      <div className="flex flex-col">
        {floors.map((floor) => (
          <FloorSection key={floor.id} floor={floor} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="py-24 px-4 text-center bg-[#0f0a06] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero_bg.png')] opacity-10 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Ready for an unforgettable experience?</h2>
          <Link
            href="/restaurant"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[#C9A84C] text-[#0f0a06] font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:-translate-y-1"
          >
            Make a Reservation
          </Link>
        </div>
      </div>
    </section>
  );
}

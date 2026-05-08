import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/hero_bg.png" 
          alt="Fortunate Hub Interior" 
          className="w-full h-full object-cover object-center animate-[cinematic-pan_30s_ease-in-out_infinite_alternate]" 
        />
        {/* Advanced radial to linear moody vignette */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a06] via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,10,6,0.8)_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 py-16 sm:px-16 sm:py-20 max-w-5xl mx-auto mt-16 backdrop-blur-xl bg-black/10 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
        <span className="block text-[#C9A84C] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] mb-6 drop-shadow-md">
          A New Era of Luxury
        </span>
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.1] tracking-tighter mb-8 text-white drop-shadow-2xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome to <br className="hidden sm:block" />
          <span className="text-[#C9A84C] drop-shadow-[0_0_40px_rgba(201,168,76,0.4)]">Fortunate</span> Hub
        </h1>

        <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto mb-14 leading-loose font-light tracking-widest">
          Dine on exquisite cuisine, push your limits in our state-of-the-art gym,
          and unwind in our premium lounge — all under one breathtaking roof.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/restaurant"
            className="group relative overflow-hidden w-full sm:w-auto px-12 py-5 rounded-sm bg-[#C9A84C] text-[#0f0a06] font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(201,168,76,0.4)]"
          >
            <span className="relative z-10">Explore The Hub</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          </Link>
          <a
            href="#directory"
            className="w-full sm:w-auto px-12 py-5 rounded-sm border border-white/20 text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-black/40 hover:-translate-y-1 backdrop-blur-md transition-all duration-500"
          >
            View Floors
          </a>
        </div>
      </div>

    </section>
  );
}

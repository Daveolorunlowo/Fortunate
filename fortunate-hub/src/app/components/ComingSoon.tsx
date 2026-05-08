import Link from "next/link";
import { HardHat } from "lucide-react";

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#faf8f5] px-4 font-['Inter'] pt-20">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
        <div className="w-20 h-20 bg-[#7D1C2B]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#7D1C2B]/10">
          <HardHat className="w-10 h-10 text-[#7D1C2B]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#7D1C2B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm">
          This section is currently under construction for <strong className="text-[#C9A84C]">Phase 4</strong> of the Fortunate Hub rollout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-white bg-[#7D1C2B] hover:bg-[#611521] transition-all duration-300 shadow-lg shadow-[#7D1C2B]/20 hover:-translate-y-0.5 border border-[#7D1C2B]"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}

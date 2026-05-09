"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function TableReservationForm() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2",
    name: "",
    phone: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // In a production app, trigger API call here
    setTimeout(() => {
      alert("Success! Your booking has been recorded.");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#0f0a06] flex items-center justify-center p-4 sm:p-8 font-['Inter'] relative bg-[url('/reserved_table.png')] bg-cover bg-center bg-no-repeat">
      {/* Dark overlay for luxury vibe */}
      <div className="absolute inset-0 bg-[#0f0a06]/80 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-xl">
        <Link href="/restaurant" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] font-bold text-xs uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Restaurant
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#4a1c21] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reserve a Table
            </h1>
            <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto"></div>
          </div>

          {isSuccess ? (
            <div className="text-center py-10 animate-in fade-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-[#C9A84C] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#4a1c21] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Booking Confirmed</h2>
              <p className="text-gray-500 mb-8 text-sm">We have received your reservation and will contact you shortly.</p>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-4 rounded-lg bg-[#7D1C2B] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#611521] transition-all"
              >
                Book Another Table
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</label>
                  <select
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all shadow-sm"
                  >
                    <option value="" disabled>Select Time</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Number of Guests</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, guests: Math.max(1, parseInt(formData.guests) - 1).toString() })}
                    className="px-6 py-3 text-[#7D1C2B] font-bold hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    name="guests"
                    readOnly
                    value={formData.guests}
                    className="w-full text-center bg-transparent text-gray-900 focus:outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, guests: Math.min(20, parseInt(formData.guests) + 1).toString() })}
                    className="px-6 py-3 text-[#7D1C2B] font-bold hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 0903 853 2190"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!formData.date || !formData.time || !formData.name || !formData.phone}
                className="w-full py-4 mt-4 rounded-lg bg-[#7D1C2B] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#611521] hover:shadow-xl disabled:opacity-50 transition-all duration-300"
              >
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

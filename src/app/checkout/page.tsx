"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CheckCircle2, AlertCircle } from "lucide-react";
import PaystackModal from "@/app/components/PaystackModal";
import { saveOrder } from "@/app/actions";

// ── Types ──────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_STORAGE_KEY = "fortunate_hub_cart";
const DELIVERY_FEE = 1000;

// ── Component ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");
  const [confirmedPhone, setConfirmedPhone] = useState("");
  const [confirmedAddress, setConfirmedAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch {}
    setIsLoaded(true);
  }, []);

  // Sync cart changes back to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch {}
    }
  }, [cart, isLoaded]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = cartSubtotal + DELIVERY_FEE;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.address.trim() !== "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || cart.length === 0) return;
    // Save form data then open Paystack
    setConfirmedName(formData.fullName);
    setConfirmedPhone(formData.phone);
    setConfirmedAddress(formData.address);
    setShowPaystack(true);
  };

  const handlePaystackSuccess = async () => {
    setShowPaystack(false);
    setIsSaving(true);
    setServerError("");

    const result = await saveOrder({
      customerName: confirmedName,
      phone: confirmedPhone,
      address: confirmedAddress,
      items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total,
      isPaid: true
    });

    setIsSaving(false);
    if (result.success) {
      localStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
      setIsSuccess(true);
    } else {
      setServerError(result.error);
    }
  };

  // ── Empty Cart State ────────────────────────────────────────────────────
  if (isLoaded && cart.length === 0 && !isSuccess) {
    return (
      <main className="min-h-screen bg-[#faf8f5] font-['Inter'] flex flex-col items-center justify-center p-8 text-center">
        <ShoppingCart className="w-20 h-20 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-[#4a1c21] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Cart is Empty
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xs">
          Head back to the menu and add some items to your order before checking out.
        </p>
        <Link
          href="/eatery"
          className="px-8 py-3.5 bg-[#7D1C2B] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#611521] transition-colors"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  // ── Order Success State ─────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#faf8f5] font-['Inter'] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-[#4a1c21] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Order Placed!
        </h2>
        <p className="text-gray-500 font-medium mb-2">Thank you, {confirmedName}!</p>
        <p className="text-gray-400 text-sm mb-10 max-w-sm leading-relaxed">
          Your order is being prepared. We will call <strong>{confirmedPhone}</strong> to confirm delivery to{" "}
          <strong>{confirmedAddress}</strong>.
        </p>
        <Link
          href="/eatery"
          className="px-8 py-3.5 bg-[#7D1C2B] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#611521] transition-colors"
        >
          Order Again
        </Link>
      </main>
    );
  }

  // ── Main Checkout Layout ────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#faf8f5] font-['Inter'] pb-12">
      {/* Paystack Modal */}
      <PaystackModal
        isOpen={showPaystack}
        onClose={() => setShowPaystack(false)}
        onSuccess={handlePaystackSuccess}
        amount={total}
        description="Fortunate Hub — Eatery Order"
        customerName={confirmedName}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#faf8f5]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 items-center">
          {/* Left: Back button */}
          <div className="flex items-center">
            <Link
              href="/eatery"
              className="flex items-center gap-2 text-[#7D1C2B] hover:text-[#611521] transition-colors font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs uppercase tracking-widest">Menu</span>
            </Link>
          </div>

          {/* Center: Title + Logo */}
          <div className="flex items-center justify-center gap-2.5">
            <img src="/5050_logo2.png" alt="Fortunate Hub" className="h-8 w-8 object-cover rounded-full ring-1 ring-[#C9A84C]/30" />
            <h1
              className="text-lg font-bold text-[#7D1C2B]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Checkout
            </h1>
          </div>

          {/* Right: Cart count */}
          <div className="flex items-center justify-end gap-1.5 text-[#7D1C2B]">
            <ShoppingCart className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-sm font-black">{totalItems}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Delivery Form ── */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2
                className="text-lg font-bold text-[#4a1c21] mb-6 pb-4 border-b border-gray-100"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Delivery Details
              </h2>
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-[11px] font-bold text-[#7D1C2B] tracking-widest uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Adewale Chukwuma"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#7D1C2B] focus:ring-1 focus:ring-[#7D1C2B]/20 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-[11px] font-bold text-[#7D1C2B] tracking-widest uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 000 000 0000"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#7D1C2B] focus:ring-1 focus:ring-[#7D1C2B]/20 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="address" className="block text-[11px] font-bold text-[#7D1C2B] tracking-widest uppercase">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full street address, apartment number, and nearest landmark"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#7D1C2B] focus:ring-1 focus:ring-[#7D1C2B]/20 transition-colors resize-none"
                    required
                  />
                </div>

                {serverError && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-500 text-xs">
                    <AlertCircle className="w-4 h-4" /> {serverError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4">

            {/* Cart Items */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2
                className="text-lg font-bold text-[#4a1c21] mb-5 pb-4 border-b border-gray-100"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#4a1c21] truncate">{item.name}</p>
                      <p className="text-xs font-bold text-[#C9A84C]">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    {/* Qty controls */}
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white transition-colors text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-black text-[#4a1c21] w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white transition-colors text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-[#4a1c21]">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-bold text-[#4a1c21]">₦{DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span
                    className="text-lg font-bold text-[#4a1c21]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Total
                  </span>
                  <span className="text-xl font-black text-[#7D1C2B]">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment CTA */}
            <div className="space-y-4">
              <button
                type="submit"
                form="checkout-form"
                disabled={!isFormValid || cart.length === 0 || isSaving}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${
                  isFormValid && cart.length > 0 && !isSaving
                    ? "bg-[#7D1C2B] text-white hover:bg-[#611521] hover:shadow-lg hover:shadow-[#7D1C2B]/30 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Finalizing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₦{total.toLocaleString()} via Paystack
                  </>
                )}
              </button>

              {/* Trust Signals */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-[1px] bg-gray-200 w-10" />
                  <span className="text-[9px] font-bold text-gray-300 tracking-widest uppercase">
                    Secured by Paystack
                  </span>
                  <div className="h-[1px] bg-gray-200 w-10" />
                </div>
                <div className="flex justify-center items-center gap-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">
                  <span>Card</span>
                  <span>·</span>
                  <span>Bank Transfer</span>
                  <span>·</span>
                  <span>GTBank / Access</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Minus, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// ── Menu Data ─────────────────────────────────────────────────────────────

const products: Product[] = [
  { id: "p1", name: "Smoky Jollof Rice", price: 6500, image: "/dish1.png", description: "Parboiled long-grain rice with hardwood smoke and heritage spice blend.", category: "Mains" },
  { id: "p2", name: "Vegetable Fried Rice", price: 7000, image: "/dish2.png", description: "Premium jasmine rice with mixed veggies, prawns, and savory soy-sesame notes.", category: "Mains" },
  { id: "p3", name: "Beans Porridge", price: 4500, image: "/beans_porridge.png", description: "Slow-cooked brown beans with palm oil, crayfish, and smoked fish.", category: "Mains" },
  { id: "p4", name: "Boiled Yam", price: 3000, image: "/boiled_yam.png", description: "Fresh-cut Nigerian yam, boiled to perfection. Served with a choice of sauce.", category: "Sides" },
  { id: "p5", name: "Fortunate Bread", price: 2500, image: "/fortunate_bread.png", description: "Our signature freshly baked artisan loaf — crispy crust, soft inside.", category: "Bakery" },
  { id: "p6", name: "Assorted Meat Platter", price: 5500, image: "/boiled_yam.png", description: "Perfectly seasoned and grilled mixed meats with our signature pepper sauce.", category: "Mains" },
];

const CART_STORAGE_KEY = "fortunate_hub_cart";

// ── Component ─────────────────────────────────────────────────────────────

export default function EateryPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getQty = (id: string) => cart.find((c) => c.id === id)?.quantity ?? 0;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
    // Briefly flash the added state
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const decreaseQty = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-[#faf8f5] font-['Inter'] pb-36">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/restaurant" className="p-2 -ml-2 text-[#7D1C2B] hover:bg-[#7D1C2B]/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#7D1C2B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Eatery Menu
              </h1>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Fortunate Hub</p>
            </div>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-5 py-2.5 bg-[#7D1C2B] text-white rounded-full hover:bg-[#611521] transition-all duration-300 hover:shadow-lg hover:shadow-[#7D1C2B]/30 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#C9A84C] text-[#0f0a06] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#7D1C2B]">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your Order
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white/60 hover:text-white transition-colors text-xl leading-none p-1"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">Your cart is empty.</p>
                  <p className="text-gray-300 text-sm mt-1">Add items from the menu below.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-[#faf8f5] p-3 rounded-xl">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#4a1c21] truncate">{item.name}</p>
                      <p className="text-xs font-bold text-[#C9A84C]">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-black text-[#4a1c21] w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(products.find((p) => p.id === item.id)!)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-black text-[#4a1c21]">₦{cartTotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#7D1C2B] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#611521] transition-all duration-300 hover:shadow-lg hover:shadow-[#7D1C2B]/30"
                >
                  <ShoppingCart className="w-4 h-4 text-[#C9A84C]" />
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Menu Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-lg font-black text-[#7D1C2B] uppercase tracking-widest">{category}</h2>
              <div className="flex-1 h-[1px] bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === category)
                .map((product) => {
                  const qty = getQty(product.id);
                  const justAdded = addedId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border border-gray-100 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {qty > 0 && (
                          <div className="absolute top-3 right-3 w-7 h-7 bg-[#7D1C2B] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">
                            {qty}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-bold text-[#4a1c21]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {product.name}
                          </h3>
                          <span className="text-[#C9A84C] font-black text-sm ml-3 shrink-0">
                            ₦{product.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-5 flex-1">{product.description}</p>

                        {/* Add / Quantity Controls */}
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-[#7D1C2B]/20 text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white hover:border-[#7D1C2B] transition-all duration-300"
                          >
                            <Plus className="w-4 h-4" /> Add to Order
                          </button>
                        ) : (
                          <div className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl border transition-colors duration-300 ${justAdded ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#7D1C2B] bg-[#7D1C2B]/5"}`}>
                            <button
                              onClick={() => decreaseQty(product.id)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#7D1C2B] hover:bg-[#7D1C2B] hover:text-white transition-colors shadow-sm"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-[#7D1C2B] text-sm">{qty} in cart</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-8 h-8 rounded-full bg-[#7D1C2B] border border-[#7D1C2B] flex items-center justify-center text-white hover:bg-[#611521] transition-colors shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Floating Checkout Bar (when cart has items) ── */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 text-[#7D1C2B]"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9A84C] text-[#0f0a06] text-[9px] font-black rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="text-sm font-bold">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
            </button>
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#7D1C2B] text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-[#611521] transition-all duration-300 hover:shadow-lg hover:shadow-[#7D1C2B]/30 hover:scale-105"
            >
              Checkout · ₦{cartTotal.toLocaleString()}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

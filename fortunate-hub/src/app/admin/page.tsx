// File: app/admin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import PinGate from "@/app/components/PinGate";

// Change this PIN to whatever the manager should use
const MANAGER_PIN = "1947";
import {
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  Settings,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChefHat,
  ArrowLeft,
} from "lucide-react";

// ── Dummy Data ──
const metrics = [
  { label: "Today's Revenue", value: "₦284,500", change: "+12.4%", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  { label: "Active Orders", value: "14", change: "+3 new", icon: <ShoppingBag className="w-5 h-5" />, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  { label: "Reservations Today", value: "8", change: "2 pending", icon: <CalendarCheck className="w-5 h-5" />, color: "text-blue-400", bgColor: "bg-blue-500/10" },
];

const sidebarLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, active: true },
  { label: "Orders", icon: <Utensils className="w-4 h-4" />, active: false },
  { label: "Reservations", icon: <CalendarCheck className="w-4 h-4" />, active: false },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, active: false },
];

interface Order {
  id: string;
  customer: string;
  items: string;
  total: string;
  time: string;
}

const orders: Record<string, Order[]> = {
  pending: [
    { id: "#FH-001", customer: "Adesola M.", items: "Smoky Jollof x2, Chapman", total: "₦15,500", time: "2 min ago" },
    { id: "#FH-004", customer: "Tunde K.", items: "Fried Rice, Assorted Meat", total: "₦12,500", time: "5 min ago" },
    { id: "#FH-007", customer: "Grace O.", items: "Beans Porridge, Bread x2", total: "₦4,800", time: "8 min ago" },
  ],
  preparing: [
    { id: "#FH-002", customer: "Bimpe A.", items: "Special Fried Rice, Chicken", total: "₦9,000", time: "12 min ago" },
    { id: "#FH-005", customer: "Yusuf D.", items: "Smoky Jollof, Assorted x2", total: "₦17,500", time: "15 min ago" },
  ],
  completed: [
    { id: "#FH-003", customer: "Kemi J.", items: "Boiled Yam, Egg Sauce", total: "₦4,200", time: "28 min ago" },
    { id: "#FH-006", customer: "Ibrahim S.", items: "Fried Rice x3, Chapman x3", total: "₦25,500", time: "35 min ago" },
  ],
};

const columnConfig: { key: string; label: string; icon: React.ReactNode; borderColor: string; dotColor: string }[] = [
  { key: "pending", label: "Pending", icon: <Clock className="w-4 h-4" />, borderColor: "border-amber-500/30", dotColor: "bg-amber-400" },
  { key: "preparing", label: "Preparing", icon: <ChefHat className="w-4 h-4" />, borderColor: "border-blue-500/30", dotColor: "bg-blue-400" },
  { key: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4" />, borderColor: "border-emerald-500/30", dotColor: "bg-emerald-400" },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <main className="min-h-screen bg-[#0b0b0f] font-['Inter'] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111116] border-r border-white/5 p-6 pt-24 shrink-0">
        {/* Back to Hub */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#C9A84C] transition-colors mb-10"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Hub
        </Link>

        {/* Sidebar Brand */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/5050_logo2.png" alt="Logo" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C9A84C]/30" />
          <div>
            <p className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              FH <span className="text-[#C9A84C]">Admin</span>
            </p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => setActiveTab(link.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === link.label
                  ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/5">
          <p className="text-[9px] text-white/20 uppercase tracking-widest">v1.0 — Phase 1 MVP</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 pt-24 overflow-auto">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Good afternoon, <span className="text-[#C9A84C]">Admin</span>
          </h1>
          <p className="text-white/30 text-xs sm:text-sm font-light tracking-wide">
            Here&apos;s what&apos;s happening at Fortunate Hub today.
          </p>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="bg-[#141419] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.bgColor} ${m.color}`}>
                  {m.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${m.color}`}>{m.change}</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight mb-1">{m.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{m.label}</p>
            </div>
          ))}
        </div>

        {/* ── Kanban Board ── */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold text-white tracking-tight mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Live Order Board
          </h2>
          <p className="text-white/20 text-xs font-light tracking-wide">Drag-and-drop coming in Phase 2</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {columnConfig.map((col) => (
            <div key={col.key} className={`bg-[#141419] border ${col.borderColor} rounded-xl p-5`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/60">
                  {col.icon}
                  <span className="text-xs font-bold uppercase tracking-widest">{col.label}</span>
                </div>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor} animate-pulse`} />
                  <span className="text-[10px] font-bold text-white/30">{orders[col.key].length}</span>
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {orders[col.key].map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#1a1a20] border border-white/5 rounded-lg p-4 hover:border-white/10 hover:bg-[#1e1e25] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#C9A84C] tracking-widest">{order.id}</span>
                      <span className="text-[9px] text-white/20 tracking-wider">{order.time}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/90 mb-1">{order.customer}</p>
                    <p className="text-[11px] text-white/40 font-light mb-3 leading-relaxed">{order.items}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white/70">{order.total}</span>
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest group-hover:text-[#C9A84C] transition-colors">
                        View →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── Export: Manager-PIN protected ─────────────────────────────────────────
export default function AdminPage() {
  return (
    <PinGate
      correctPin={MANAGER_PIN}
      storageKey="fh_manager_auth"
      role="Manager"
      accentColor="#7D1C2B"
    >
      <AdminDashboard />
    </PinGate>
  );
}

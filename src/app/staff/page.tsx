// File: app/staff/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PinGate from "@/app/components/PinGate";
import { getActiveOrders, getUpcomingReservations } from "@/app/actions/admin";
import { updateOrderStatus } from "@/app/actions";
import { formatDistanceToNow } from "date-fns";
import {
  ShoppingBag,
  CalendarCheck,
  Clock,
  ChefHat,
  CheckCircle2,
  ArrowLeft,
  Phone,
  MapPin,
  Users,
  Utensils,
  Wine,
  RefreshCw,
  Loader2,
} from "lucide-react";

const STAFF_PIN = "2580";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PREPARING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3 h-3" />,
  PREPARING: <ChefHat className="w-3 h-3" />,
  COMPLETED: <CheckCircle2 className="w-3 h-3" />,
  CONFIRMED: <CheckCircle2 className="w-3 h-3" />,
};

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");
  const [orderFilter, setOrderFilter] = useState<"ALL" | "PENDING" | "PREPARING" | "COMPLETED">("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [fetchedOrders, fetchedReservations] = await Promise.all([
        getActiveOrders(),
        getUpcomingReservations(),
      ]);
      setOrders(fetchedOrders);
      setReservations(fetchedReservations);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus as any);
    if (res.success) {
      fetchData();
    }
  };

  const filteredOrders =
    orderFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
  const todayResCount = reservations.filter((r) => {
    const d = new Date(r.date);
    return d >= todayStart && d <= todayEnd;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] font-['Inter'] text-white pb-20">
      <header className="sticky top-0 z-40 bg-[#0b0b0f]/95 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/30 hover:text-[#C9A84C] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-sm font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Staff <span className="text-[#C9A84C]">Portal</span>
            </p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">Fortunate Hub Operations</p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors disabled:opacity-30"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /> 
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending Orders", value: pendingCount, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Preparing Now", value: preparingCount, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Today's Bookings", value: todayResCount, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10 border-[#C9A84C]/20" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
              <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-[#141419] border border-white/5 rounded-xl p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "orders" ? "bg-[#C9A84C] text-[#0b0b0f]" : "text-white/40 hover:text-white/70"}`}
          >
            <Utensils className="w-3.5 h-3.5" /> Orders
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "reservations" ? "bg-[#C9A84C] text-[#0b0b0f]" : "text-white/40 hover:text-white/70"}`}
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Reservations
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {(["ALL", "PENDING", "PREPARING", "COMPLETED"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${orderFilter === f ? "bg-[#C9A84C] text-[#0b0b0f] border-[#C9A84C]" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"}`}
                >
                  {f} {f !== "ALL" && `(${orders.filter((o) => o.status === f).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#141419] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-[10px] font-black text-[#C9A84C] tracking-widest">#{order.id.slice(-5).toUpperCase()}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusStyles[order.status]}`}>
                          {statusIcons[order.status]} {order.status}
                        </span>
                        <span className="text-[9px] text-white/25">{formatDistanceToNow(new Date(order.createdAt))} ago</span>
                        {order.isPaid && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-sm font-bold tracking-widest border border-emerald-500/20">PAID</span>}
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{order.customerName}</p>
                      <p className="text-xs text-white/40 font-light mb-3">
                        {order.items.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <p className="text-lg font-black text-white">₦{order.totalAmount.toLocaleString()}</p>
                      <div className="flex gap-2">
                        {order.status === "PENDING" && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                            className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-500/20 transition-colors"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {(order.status === "PENDING" || order.status === "PREPARING") && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-500/20 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-20 text-white/20">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm font-medium">No {orderFilter.toLowerCase()} orders</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="space-y-3">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-[#141419] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-[10px] font-black text-[#C9A84C] tracking-widest">#{res.id.slice(-5).toUpperCase()}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusStyles[res.status]}`}>
                        {statusIcons[res.status]} {res.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
                        {res.type === "LOUNGE" ? <Wine className="w-2.5 h-2.5" /> : <Utensils className="w-2.5 h-2.5" />}
                        {res.type}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{res.customerName}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <Phone className="w-3 h-3" /> {res.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <CalendarCheck className="w-3 h-3" /> {new Date(res.date).toLocaleDateString()} at {res.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <Users className="w-3 h-3" /> {res.guests} {res.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                    {res.specialRequest && (
                      <p className="mt-3 text-[10px] text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
                        ⚠ {res.specialRequest}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <div className="text-center py-20 text-white/20">
                <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">No upcoming reservations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function StaffPage() {
  return (
    <PinGate
      correctPin={STAFF_PIN}
      storageKey="fh_staff_auth"
      role="Staff"
      accentColor="#C9A84C"
    >
      <StaffDashboard />
    </PinGate>
  );
}

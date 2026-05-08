// app/actions/admin.ts
"use server";

// Server-side data fetchers for the Admin Dashboard.
// These are now Server Actions so they can be called from client components.

import { prisma } from "@/lib/prisma";
import { OrderStatus, ReservationStatus } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────────────────────

export type DashboardMetrics = {
  todayRevenue: number;
  pendingOrdersCount: number;
  totalActiveMemberships: number;
  totalReservations: number;
  confirmedReservationsToday: number;
};

export type ActiveOrder = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  totalAmount: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: Date;
};

export type UpcomingReservation = {
  id: string;
  customerName: string;
  phone: string;
  type: string;
  date: Date;
  time: string;
  guests: number;
  specialRequest: string | null;
  status: ReservationStatus;
};

// ── Data Fetchers ──────────────────────────────────────────────────────────

/**
 * Fetches key operational metrics for the Admin Dashboard.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    todayOrders,
    pendingOrdersCount,
    totalActiveMemberships,
    totalReservations,
    confirmedReservationsToday,
  ] = await Promise.all([
    // Sum of all PAID orders placed today
    prisma.order.findMany({
      where: {
        isPaid: true,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      select: { totalAmount: true },
    }),

    // Count of all non-completed, non-cancelled orders
    prisma.order.count({
      where: {
        status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING] },
      },
    }),

    // Count of all currently active gym memberships
    prisma.membership.count({
      where: {
        isActive: true,
        expiryDate: { gte: new Date() },
      },
    }),

    // Total reservations ever created
    prisma.reservation.count(),

    // Reservations confirmed for today
    prisma.reservation.count({
      where: {
        status: ReservationStatus.CONFIRMED,
        date: { gte: todayStart, lte: todayEnd },
      },
    }),
  ]);

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return {
    todayRevenue,
    pendingOrdersCount,
    totalActiveMemberships,
    totalReservations,
    confirmedReservationsToday,
  };
}

/**
 * Fetches all active (non-completed) orders sorted oldest-first.
 * Used to populate the live order management feed in the Admin Dashboard.
 */
export async function getActiveOrders(): Promise<ActiveOrder[]> {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: [OrderStatus.PENDING, OrderStatus.PREPARING],
      },
    },
    orderBy: {
      createdAt: "asc", // Oldest first — FIFO queue
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    items: order.items as ActiveOrder["items"],
    totalAmount: order.totalAmount,
    status: order.status,
    isPaid: order.isPaid,
    createdAt: order.createdAt,
  }));
}

/**
 * Fetches all upcoming reservations sorted by date ascending.
 * Includes both Restaurant and Lounge reservations.
 */
export async function getUpcomingReservations(): Promise<UpcomingReservation[]> {
  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: new Date() },
      status: {
        in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 50, // Cap for dashboard performance
  });

  return reservations.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    phone: r.phone,
    type: r.type,
    date: r.date,
    time: r.time,
    guests: r.guests,
    specialRequest: r.specialRequest,
    status: r.status,
  }));
}

/**
 * Fetches all active gym memberships for the Admin Panel.
 */
export async function getActiveMemberships() {
  return prisma.membership.findMany({
    where: {
      isActive: true,
      expiryDate: { gte: new Date() },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Fetches all orders for a given date range (for revenue reports).
 */
export async function getOrdersByDateRange(from: Date, to: Date) {
  return prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: to },
    },
    orderBy: { createdAt: "desc" },
  });
}

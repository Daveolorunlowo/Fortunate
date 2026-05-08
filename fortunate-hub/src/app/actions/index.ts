// app/actions/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { OrderStatus, ReservationType, GymPlan, ReservationStatus } from "@prisma/client";
import { addDays, addMonths, addYears } from "date-fns";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

// ── Gym Membership ─────────────────────────────────────────────────────────

export async function saveGymMembership(data: {
  memberName: string;
  phone: string;
  plan: string; // mapped to enum
  isPaid: boolean;
}): Promise<ActionResult> {
  try {
    const planEnum = data.plan.toUpperCase().replace(" ", "_") as GymPlan;

    // Compute expiry date
    const now = new Date();
    let expiryDate: Date;
    switch (planEnum) {
      case "DAY_PASS": expiryDate = addDays(now, 1); break;
      case "MONTHLY_PRO": expiryDate = addMonths(now, 1); break;
      case "VIP_ANNUAL": expiryDate = addYears(now, 1); break;
      default: return { success: false, error: "Invalid plan" };
    }

    await prisma.membership.create({
      data: {
        memberName: data.memberName,
        phone: data.phone,
        plan: planEnum,
        isActive: data.isPaid,
        startDate: now,
        expiryDate,
        paystackRef: `MOCK_GYM_${Date.now()}`,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Gym Error:", error);
    return { success: false, error: "Failed to save membership" };
  }
}

// ── Lounge Reservation ──────────────────────────────────────────────────────

export async function saveReservation(data: {
  customerName: string;
  phone: string;
  type: "RESTAURANT" | "LOUNGE";
  date: string;
  time: string;
  guests: number;
  experience?: string;
  amount: number;
  isPaid: boolean;
}): Promise<ActionResult> {
  try {
    await prisma.reservation.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        type: data.type,
        date: new Date(data.date),
        time: data.time,
        guests: data.guests,
        specialRequest: data.experience,
        totalAmount: data.amount,
        isPaid: data.isPaid,
        status: data.isPaid ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING,
        paystackRef: `MOCK_RES_${Date.now()}`,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    console.error("Reservation Error Detailed:", error);
    const msg = error.message || "Failed to save reservation";
    return { success: false, error: msg };
  }
}

// ── Eatery Order ───────────────────────────────────────────────────────────

export async function saveOrder(data: {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  isPaid: boolean;
}): Promise<ActionResult> {
  try {
    await prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        items: data.items as any,
        totalAmount: data.total,
        isPaid: data.isPaid,
        status: "PENDING",
        paystackRef: `MOCK_ORD_${Date.now()}`,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    console.error("Order Error Detailed:", error);
    // Return a more descriptive error if it's a known prisma error
    const msg = error.message || "Failed to save order";
    return { success: false, error: msg };
  }
}

// ── Status Updates ─────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

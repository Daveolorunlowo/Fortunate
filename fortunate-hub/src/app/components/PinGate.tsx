// File: app/components/PinGate.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";

interface PinGateProps {
  /** The correct PIN to unlock access */
  correctPin: string;
  /** Storage key so the session persists on refresh */
  storageKey: string;
  /** Role label shown on the login screen e.g. "Manager" | "Staff" */
  role: string;
  /** Accent color class for ring/button e.g. "#C9A84C" */
  accentColor: string;
  /** The protected content to render once unlocked */
  children: React.ReactNode;
}

export default function PinGate({
  correctPin,
  storageKey,
  role,
  accentColor,
  children,
}: PinGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "authenticated") setIsUnlocked(true);
    } catch {}
  }, [storageKey]);

  // Lockout countdown
  useEffect(() => {
    if (!isLocked) return;
    if (lockTimer <= 0) {
      setIsLocked(false);
      setAttempts(0);
      return;
    }
    const t = setTimeout(() => setLockTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [isLocked, lockTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (pin === correctPin) {
      try {
        sessionStorage.setItem(storageKey, "authenticated");
      } catch {}
      setIsUnlocked(true);
      setError("");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");
      inputRef.current?.focus();

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(30);
        setError("Too many incorrect attempts. Locked for 30 seconds.");
      } else {
        setError(`Incorrect PIN. ${5 - newAttempts} attempt${5 - newAttempts === 1 ? "" : "s"} remaining.`);
      }
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {}
    setIsUnlocked(false);
    setPin("");
    setError("");
  };

  // ── Render protected content ────────────────────────────────────────────
  if (isUnlocked) {
    return (
      <div className="relative">
        {/* Logout button (top-right corner) */}
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors rounded-sm"
        >
          <Lock className="w-3 h-3" /> Lock Screen
        </button>
        {children}
      </div>
    );
  }

  // ── PIN Gate Screen ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0b0f] flex flex-col items-center justify-center px-4 font-['Inter']">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] blur-[150px] pointer-events-none opacity-20"
        style={{ background: accentColor }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <Image
              src="/5050_logo2.png"
              alt="Fortunate Hub"
              width={72}
              height={72}
              className="rounded-full ring-2 ring-white/10"
            />
            <div
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#0b0b0f]"
              style={{ background: accentColor }}
            >
              <Lock className="w-3 h-3 text-[#0b0b0f]" strokeWidth={3} />
            </div>
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Fortunate Hub
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {role} Access Only
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Enter {role} PIN
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="••••••"
                disabled={isLocked}
                className="w-full bg-[#141419] border border-white/10 rounded-lg px-5 py-4 text-center text-2xl font-black text-white tracking-[0.5em] focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/10 disabled:opacity-40"
                style={{ borderColor: error ? "#ef4444" : pin.length > 0 ? accentColor : undefined }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {isLocked ? `${error} (${lockTimer}s)` : error}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length < 4 || isLocked}
            className="w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: pin.length >= 4 && !isLocked ? accentColor : "#1a1a20",
              color: pin.length >= 4 && !isLocked ? "#0b0b0f" : "rgba(255,255,255,0.2)",
            }}
          >
            {isLocked ? `Locked (${lockTimer}s)` : "Unlock"}
          </button>
        </form>

        <p className="text-center text-[9px] text-white/15 mt-8 uppercase tracking-widest">
          Unauthorised access is prohibited
        </p>
      </div>
    </div>
  );
}

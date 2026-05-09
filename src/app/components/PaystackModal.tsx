// File: app/components/PaystackModal.tsx
"use client";

import { useState } from "react";
import { Lock, CreditCard, CheckCircle2, X, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called ONLY after successful mock payment */
  onSuccess: () => void;
  amount: number;          // In Naira e.g. 10000
  description: string;     // e.g. "Gym Day Pass"
  customerName: string;
}

type Step = "payment" | "processing" | "success" | "failed";
type Method = "card" | "transfer";

export default function PaystackModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  description,
  customerName,
}: PaystackModalProps) {
  const [step, setStep] = useState<Step>("payment");
  const [method, setMethod] = useState<Method>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const isCardValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    pin.length === 4;

  const handlePay = () => {
    setError("");
    if (method === "card" && cardNumber.startsWith("4000 0000 0000 0002")) {
      setStep("failed");
      return;
    }
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    }, 2200);
  };

  const handleClose = () => {
    if (step === "processing") return; // Prevent closing during processing
    setStep("payment");
    setMethod("card");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setPin("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header — Paystack brand bar */}
        <div className="bg-[#00C3F7] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
              <div className="w-4 h-4 bg-[#00C3F7] rounded-full" />
            </div>
            <div>
              <p className="text-white text-xs font-black tracking-wide">Paystack</p>
              <p className="text-white/70 text-[9px] font-medium uppercase tracking-tighter">Secure Checkout</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={step === "processing"}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#F7F9FB] border-b border-gray-100 px-6 py-4">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            {description}
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-black text-gray-900">
              ₦{amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">NGN</p>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            Paying as <span className="text-gray-600 font-semibold">{customerName || "Guest"}</span>
          </p>
        </div>

        <div className="p-6">
          {/* ── Step: Payment Method Selection ── */}
          {step === "payment" && (
            <div className="space-y-6">
              {/* Method Selector */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    method === "card" ? "bg-white text-[#00C3F7] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Card
                </button>
                <button
                  onClick={() => setMethod("transfer")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    method === "transfer" ? "bg-white text-[#00C3F7] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Transfer
                </button>
              </div>

              {method === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00C3F7] transition-colors pr-10 tracking-widest font-mono"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Expiry</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00C3F7] transition-colors font-mono tracking-widest"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00C3F7] transition-colors font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Card PIN</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00C3F7] transition-colors font-mono tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={!isCardValid}
                    className="w-full py-4 bg-[#00C3F7] text-white font-black text-sm rounded-xl hover:bg-[#00a8d5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#00C3F7]/20"
                  >
                    <Lock className="w-4 h-4" /> Pay ₦{amount.toLocaleString()}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Transfer to the account below</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Bank Name</p>
                        <p className="text-sm font-black text-gray-800">Titan Trust Bank / Paystack</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Account Number</p>
                        <div className="flex items-center justify-center gap-3">
                          <p className="text-2xl font-black text-[#00C3F7] tracking-widest font-mono">
                            {Math.floor(1000000000 + Math.random() * 9000000000)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Account Name</p>
                        <p className="text-xs font-bold text-gray-800">FORTUNATE HUB - {customerName || "ORDER"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-700 leading-relaxed">
                        Account expires in <b>30:00</b> minutes. Only use this account for this transaction.
                      </p>
                    </div>

                    <button
                      onClick={handlePay}
                      className="w-full py-4 bg-[#00C3F7] text-white font-black text-sm rounded-xl hover:bg-[#00a8d5] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#00C3F7]/20"
                    >
                      I have sent the money
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-widest pt-2">
                <ShieldCheck className="w-3 h-3" /> Secured by Paystack
              </div>
            </div>
          )}

          {/* ── Step: Processing ── */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full border-4 border-[#00C3F7] border-t-transparent animate-spin mb-6" />
              <p className="font-bold text-gray-800 mb-1">Processing Payment</p>
              <p className="text-sm text-gray-400">Please do not close this window...</p>
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
              </div>
              <p className="font-black text-gray-800 text-lg mb-1">Payment Successful!</p>
              <p className="text-sm text-gray-400">Your access has been confirmed.</p>
            </div>
          )}

          {/* ── Step: Failed ── */}
          {step === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-lg shadow-red-100">
                <AlertCircle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
              </div>
              <p className="font-black text-gray-800 text-lg mb-1">Payment Declined</p>
              <p className="text-sm text-gray-400 mb-6">Your transaction could not be processed. Please try again.</p>
              <button
                onClick={() => { setStep("payment"); setCardNumber(""); }}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

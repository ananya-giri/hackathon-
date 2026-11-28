"use client";

import React, { useEffect, useState } from "react";
import { X, QrCode, CheckCircle2, Copy, Check, Send, Sparkles, AlertCircle, Ticket, MessageCircle } from "lucide-react";
import StarButton from "./StarButton";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "1st Year",
    language: "Python",
  });

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("zypherix2026@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappText = encodeURIComponent(
    `Hi! I've registered for BYTEON 2027 (Zypherix).\nName: ${formData.fullName}\nCollege: ${formData.college}\nYear: ${formData.year}\nLanguage: ${formData.language}\nEmail: ${formData.email}`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Register for Byteon"
    >
      <div className="animate-modal-in relative overflow-hidden w-full max-w-2xl my-auto bg-[#080d1a]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-7 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)] text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close registration modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-lg bg-black/50 text-[#FFBA00] hover:text-white hover:bg-[#FFBA00]/15 border border-white/15 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 sm:py-10 space-y-4">
            <div className="w-16 h-16 bg-[#FFBA00]/15 rounded-full flex items-center justify-center mx-auto border border-[#FFBA00]/50 shadow-[0_0_25px_rgba(255,186,0,0.45)]">
              <CheckCircle2 className="w-8 h-8 text-[#FFBA00]" />
            </div>
            <h3 className="text-2xl font-bold font-mono">REGISTRATION SUBMITTED!</h3>
            <p className="desc-text text-sm text-[#F2EFE6]/85 max-w-md mx-auto">
              Thank you, <strong className="text-[#FFBA00]">{formData.fullName}</strong>. Please scan the QR code or message the coordinators on WhatsApp to confirm your ₹499 slot.
            </p>
            <div className="max-w-sm mx-auto rounded-xl bg-white/[0.04] border border-white/15 p-3.5 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-[#A8BFAF]">College:</span><span className="text-white truncate ml-2">{formData.college}</span></div>
              <div className="flex justify-between"><span className="text-[#A8BFAF]">Track / Lang:</span><span className="text-[#FFBA00] font-bold">{formData.language}</span></div>
              <div className="flex justify-between"><span className="text-[#A8BFAF]">Fee:</span><span className="text-white font-bold">Rs. 499</span></div>
            </div>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <StarButton
                as="a"
                href={`https://wa.me/918590090507?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="!py-2.5 !px-5 !text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                CONFIRM ON WHATSAPP
              </StarButton>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="cta-secondary !py-2.5 !px-5 !text-xs font-mono font-bold"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBA00]/10 border border-[#FFBA00]/40 text-[#FFBA00] text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBA00]" />
                ZYPHERIX 2027 // CODING EVENT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white">
                REGISTER FOR BYTEON
              </h2>
              <p className="desc-text text-xs sm:text-sm text-[#A8BFAF] mt-1">
                27 January 2027 • Jamia Hamdard Kannur Campus
              </p>

              {/* Registration Fee & Step Banner */}
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFBA00]/10 border border-[#FFBA00]/50 shadow-[0_0_18px_rgba(255,186,0,0.15)]">
                  <Ticket className="w-4 h-4 text-[#FFBA00] shrink-0" />
                  <span className="font-mono text-sm text-white">
                    Registration Fee:{" "}
                    <strong className="text-[#FFBA00] font-black text-base">Rs. 499</strong>
                    <span className="text-[#A8BFAF] text-xs ml-1.5">/ per participant</span>
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] tracking-wider text-[#A8BFAF]">
                  STEP 1: FILL DETAILS • STEP 2: SCAN QR
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* QR Code Section from Poster */}
              <div className="md:col-span-2 flex flex-col items-center bg-black/60 p-4 rounded-xl border border-white/15 text-center">
                <div className="relative p-2.5 bg-white rounded-xl border border-white/20 shadow-md mb-3">
                  <img
                    src="/qr-code.png"
                    alt="Registration QR Code from Poster"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[#FFBA00] flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  OFFICIAL SCANNER
                </span>
                <p className="desc-text text-[11px] text-[#A8BFAF] mt-1">
                  Scan with your phone camera or GPay / UPI scanner to register directly.
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 w-full flex flex-col gap-1.5 text-[11px] font-mono text-left">
                  <span className="text-[#FFBA00]/80">Support Mail:</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center justify-between text-[#F2EFE6] hover:text-white bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/15 hover:border-[#FFBA00]/45 transition-colors"
                  >
                    <span className="truncate">zypherix2026@gmail.com</span>
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-[#00F5A0] shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#FFBA00] shrink-0" />
                    )}
                  </button>
                  {copiedEmail && <span className="text-[10px] text-[#00F5A0]">Copied to clipboard!</span>}
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ada Lovelace"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="coder@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                    College / Institution *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jamia Hamdard / College Name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                      Academic Year
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d1426] border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A8BFAF] mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d1426] border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                    >
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="C">C</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <StarButton
                    type="submit"
                    className="w-full !py-3 !text-xs !border-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>CONFIRM REGISTRATION</span>
                  </StarButton>
                </div>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[#FFBA00]/60">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#FFBA00]" />
                Spot registration subject to seat limits.
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#FFBA00]/80 font-bold">
                  <Ticket className="w-3.5 h-3.5" /> Fee: Rs. 499
                </span>
                <span>Event Date: 27 Jan 2027</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, QrCode, CheckCircle2, Copy, Send, Sparkles, AlertCircle } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#080d1a] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,245,160,0.25)] text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-black/50 text-emerald-400 hover:text-white hover:bg-emerald-950/60 border border-emerald-500/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-[#00f5a0]/50 shadow-[0_0_25px_#00f5a0]">
              <CheckCircle2 className="w-8 h-8 text-[#00f5a0]" />
            </div>
            <h3 className="text-2xl font-bold font-mono">REGISTRATION SUBMITTED!</h3>
            <p className="text-sm font-mono text-emerald-300/80 max-w-md mx-auto">
              Your details have been received. Please scan the QR code to complete the verification or contact the coordinators on WhatsApp.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-bold font-mono text-xs"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00f5a0]" />
                ZYPHERIX 2026 // CODING EVENT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white">
                REGISTER FOR BYTEON
              </h2>
              <p className="text-xs sm:text-sm font-mono text-emerald-300/70 mt-1">
                27 January 2026 • Jamia Hamdard Kannur Campus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* QR Code Section from Poster */}
              <div className="md:col-span-2 flex flex-col items-center bg-black/60 p-4 rounded-xl border border-emerald-500/20 text-center">
                <div className="relative p-2 bg-white rounded-lg shadow-[0_0_20px_rgba(0,245,160,0.3)] mb-3">
                  <img
                    src="/qr-code.png"
                    alt="Registration QR Code from Poster"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[#00f5a0] flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  OFFICIAL SCANNER
                </span>
                <p className="text-[11px] font-mono text-emerald-300/60 mt-1">
                  Scan with your phone camera or GPay / UPI scanner to register directly.
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-500/20 w-full flex flex-col gap-1.5 text-[11px] font-mono text-left">
                  <span className="text-emerald-400/80">Support Mail:</span>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center justify-between text-emerald-200 hover:text-white bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20"
                  >
                    <span className="truncate">zypherix2026@gmail.com</span>
                    <Copy className="w-3 h-3 text-[#00f5a0]" />
                  </button>
                  {copiedEmail && <span className="text-[10px] text-[#00f5a0]">Copied to clipboard!</span>}
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ada Lovelace"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0] focus:ring-1 focus:ring-[#00f5a0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="coder@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0] focus:ring-1 focus:ring-[#00f5a0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0] focus:ring-1 focus:ring-[#00f5a0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                    College / Institution *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jamia Hamdard / College Name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0] focus:ring-1 focus:ring-[#00f5a0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-300/90 mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00f5a0]"
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
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-extrabold font-mono text-xs tracking-wider hover:shadow-[0_0_25px_rgba(0,245,160,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>CONFIRM REGISTRATION</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-400/60">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#00f5a0]" />
                Spot registration subject to seat limits.
              </span>
              <span>Event Date: 27 Jan 2026</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

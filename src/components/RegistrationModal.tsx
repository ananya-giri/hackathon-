"use client";

import React, { useState } from "react";
import { X, QrCode, CheckCircle2, Copy, Send, Sparkles, AlertCircle, Ticket } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-[#080d1a] border border-[#FFBA00]/40 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(255,186,0,0.25)] text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-black/50 text-[#FFBA00] hover:text-white hover:bg-[#FFBA00]/10 border border-white/15 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-[#FFBA00]/15 rounded-full flex items-center justify-center mx-auto border border-[#FFBA00]/50 shadow-[0_0_25px_#FFBA00]">
              <CheckCircle2 className="w-8 h-8 text-[#FFBA00]" />
            </div>
            <h3 className="text-2xl font-bold font-mono">REGISTRATION SUBMITTED!</h3>
            <p className="desc-text text-sm text-[#F2EFE6]/80 max-w-md mx-auto">
              Your details have been received. Please scan the QR code to complete the verification or contact the coordinators on WhatsApp.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <StarButton
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
              >
                CLOSE WINDOW
              </StarButton>
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

              {/* Registration Fee Banner */}
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFBA00]/10 border border-[#FFBA00]/50 shadow-[0_0_18px_rgba(255,186,0,0.15)]">
                <Ticket className="w-4 h-4 text-[#FFBA00] shrink-0" />
                <span className="font-mono text-sm text-white">
                  Registration Fee:{" "}
                  <strong className="text-[#FFBA00] font-black text-base">Rs. 499</strong>
                  <span className="text-[#A8BFAF] text-xs ml-1.5">/ per participant</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* QR Code Section from Poster */}
              <div className="md:col-span-2 flex flex-col items-center bg-black/60 p-4 rounded-xl border border-white/15 text-center">
                <div className="relative p-2 bg-white rounded-lg shadow-[0_0_20px_rgba(255,186,0,0.3)] mb-3">
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
                    onClick={handleCopyEmail}
                    className="flex items-center justify-between text-[#F2EFE6] hover:text-white bg-white/5 px-2 py-1 rounded border border-white/15"
                  >
                    <span className="truncate">zypherix2026@gmail.com</span>
                    <Copy className="w-3 h-3 text-[#FFBA00]" />
                  </button>
                  {copiedEmail && <span className="text-[10px] text-[#FFBA00]">Copied to clipboard!</span>}
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
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00]"
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
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#FFBA00]/40 text-white font-mono text-xs focus:outline-none focus:border-[#FFBA00]"
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

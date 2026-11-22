"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Calendar, QrCode, Image as ImageIcon } from "lucide-react";

interface NavbarProps {
  onRegisterClick: () => void;
  onPosterClick: () => void;
}

export default function Navbar({ onRegisterClick, onPosterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Countdown to Jan 27, 2026 09:00:00 AM
    const targetDate = new Date("2026-01-27T09:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        // If date has passed, show event day
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#050811]/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-[#00d9f5] p-0.5 shadow-[0_0_15px_rgba(0,245,160,0.4)] group-hover:shadow-[0_0_25px_rgba(0,245,160,0.7)] transition-all">
            <div className="w-full h-full bg-[#050811] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#00f5a0]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black text-lg tracking-wider text-white flex items-center gap-1.5">
              BYTEON <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00f5a0] border border-emerald-500/40">2026</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400/70 -mt-1">
              Zypherix IT Fest
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider text-emerald-200/80">
          <a href="#prizes" className="hover:text-[#00f5a0] transition-colors">
            // PRIZES
          </a>
          <a href="#rounds" className="hover:text-[#00f5a0] transition-colors">
            // ROUNDS
          </a>
          <a href="#schedule" className="hover:text-[#00f5a0] transition-colors">
            // TIMELINE
          </a>
          <a href="#sponsors" className="hover:text-[#00f5a0] transition-colors">
            // SPONSORS
          </a>
          <a href="#coordinators" className="hover:text-[#00f5a0] transition-colors">
            // CONTACT
          </a>
        </div>

        {/* Right CTA Group */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPosterClick}
            title="View Original Event Poster"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#00f5a0]" />
            <span>Poster</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-extrabold text-xs font-mono tracking-wider hover:shadow-[0_0_20px_rgba(0,245,160,0.6)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>REGISTER NOW</span>
          </button>
        </div>

      </div>
    </nav>
  );
}

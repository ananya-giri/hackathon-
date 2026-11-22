"use client";

import React from "react";
import { Trophy, Award, Gift, Sparkles, Check } from "lucide-react";

export default function PrizesSection({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <section id="prizes" className="relative py-24 bg-[#050811] text-emerald-100 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
            <Trophy className="w-3.5 h-3.5 text-[#00f5a0]" />
            Bounties & Accolades
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            COMPETE FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5a0] to-[#00d9f5]">₹9,000/- CASH POOL</span>
          </h2>
          <p className="mt-4 text-emerald-300/70 font-mono text-sm sm:text-base">
            Prove your algorithmic supremacy at Zypherix IT Fest. Take home substantial cash rewards, winner shields, certificates, and recognition.
          </p>
        </div>

        {/* Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* First Prize Card */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-emerald-950/40 to-black/80 border-2 border-[#00f5a0] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,245,160,0.25)] hover:shadow-[0_0_60px_rgba(0,245,160,0.4)] transition-all">
            <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-[#00f5a0] text-black font-mono font-black text-xs tracking-widest uppercase shadow-[0_0_15px_#00f5a0]">
              CHAMPION
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#00f5a0]">First Prize</p>
                <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mt-1 flex items-baseline gap-1">
                  <span>6000</span>
                  <span className="text-2xl text-emerald-400">/-</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-[#00f5a0]/40 flex items-center justify-center text-[#00f5a0]">
                <Trophy className="w-9 h-9 drop-shadow-[0_0_10px_#00f5a0]" />
              </div>
            </div>

            <p className="text-sm font-mono text-emerald-200/90 mb-6">
              Awarded to the coder with the highest algorithmic efficiency, zero syntactical flaws, and fastest execution timing.
            </p>

            <ul className="space-y-3 font-mono text-xs sm:text-sm text-emerald-300/80 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00f5a0]" />
                <span>₹6,000 Hard Cash Prize</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00f5a0]" />
                <span>Prestigious Winner Trophy & Shield</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00f5a0]" />
                <span>National Level Certificate of Excellence</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00f5a0]" />
                <span>Sponsor Goodies from Upcode Software Labs</span>
              </li>
            </ul>

            <button
              onClick={onRegisterClick}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-extrabold font-mono text-sm tracking-wider hover:shadow-[0_0_25px_rgba(0,245,160,0.6)] transition-all"
            >
              CLAIM FIRST PRIZE
            </button>
          </div>

          {/* Second Prize Card */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-cyan-950/30 to-black/80 border border-cyan-400/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(0,217,245,0.15)] hover:shadow-[0_0_50px_rgba(0,217,245,0.3)] transition-all">
            <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-[#00d9f5] text-black font-mono font-black text-xs tracking-widest uppercase shadow-[0_0_15px_#00d9f5]">
              RUNNER-UP
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#00d9f5]">Second Prize</p>
                <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mt-1 flex items-baseline gap-1">
                  <span>3000</span>
                  <span className="text-2xl text-cyan-400">/-</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-[#00d9f5]">
                <Award className="w-9 h-9 drop-shadow-[0_0_10px_#00d9f5]" />
              </div>
            </div>

            <p className="text-sm font-mono text-emerald-200/90 mb-6">
              Awarded to the outstanding runner-up demonstrating brilliant problem solving and code optimization.
            </p>

            <ul className="space-y-3 font-mono text-xs sm:text-sm text-emerald-300/80 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00d9f5]" />
                <span>₹3,000 Hard Cash Prize</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00d9f5]" />
                <span>Runner-up Trophy & Memento</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00d9f5]" />
                <span>National Level Certificate of Merit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00d9f5]" />
                <span>Recognition from Infomac Systems</span>
              </li>
            </ul>

            <button
              onClick={onRegisterClick}
              className="w-full py-3.5 rounded-xl bg-black/70 hover:bg-black/90 border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 font-extrabold font-mono text-sm tracking-wider transition-all"
            >
              REGISTER FOR ARENA
            </button>
          </div>

        </div>

        {/* Perks Bar for All Participants */}
        <div className="mt-12 max-w-4xl mx-auto p-6 rounded-2xl bg-black/60 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-[#00f5a0]">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-mono font-bold text-sm">Every Participant Receives Recognition</h4>
              <p className="text-emerald-300/70 font-mono text-xs">
                Official National Level Certificate of Participation + Networking with IT Industry Leaders.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-[#00f5a0]">
            VERIFIED CREDENTIALS
          </span>
        </div>

      </div>
    </section>
  );
}

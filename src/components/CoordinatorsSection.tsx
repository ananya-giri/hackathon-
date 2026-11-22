"use client";

import React from "react";
import { Phone, Mail, MessageSquare, MapPin, User, ExternalLink } from "lucide-react";

export default function CoordinatorsSection() {
  const coordinators = [
    {
      name: "Khalid Adeel",
      phone: "+91 8590090507",
      phoneRaw: "+918590090507",
      role: "Student Coordinator // Technical Head",
    },
    {
      name: "Nihma Parveen",
      phone: "+91 8137831382",
      phoneRaw: "+918137831382",
      role: "Student Coordinator // Event Operations",
    },
  ];

  return (
    <section id="coordinators" className="relative py-24 bg-[#050811] text-emerald-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4">
            <User className="w-3.5 h-3.5 text-[#00f5a0]" />
            Official Contacts
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            EVENT <span className="text-[#00f5a0]">COORDINATORS</span>
          </h2>
          <p className="mt-3 text-emerald-300/70 font-mono text-sm">
            Have questions regarding rounds, eligibility, or transportation? Reach out directly via Call or WhatsApp.
          </p>
        </div>

        {/* Coordinators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {coordinators.map((c, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-black/60 border border-emerald-500/30 hover:border-[#00f5a0] transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:shadow-[0_0_30px_rgba(0,245,160,0.2)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-white font-mono group-hover:text-[#00f5a0] transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400/70 mt-0.5">{c.role}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00f5a0]">
                  <Phone className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 mb-6 font-mono text-lg font-bold text-white tracking-wider flex items-center justify-between">
                <span>{c.phone}</span>
                <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${c.phoneRaw}`}
                  className="py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00f5a0]" />
                  <span>Call Directly</span>
                </a>

                <a
                  href={`https://wa.me/${c.phoneRaw.replace(/[^0-9]/g, "")}?text=Hi%20${c.name},%20I%20have%20an%20inquiry%20regarding%20Byteon%20Coding%20Contest%20at%20Zypherix.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#00f5a0]/10 hover:bg-[#00f5a0]/20 border border-[#00f5a0]/50 text-[#00f5a0] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,160,0.15)]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Location & Email Details Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/40 border border-emerald-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-[#00f5a0]">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Venue & Campus</p>
              <h4 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                JAMIA HAMDARD KANNUR CAMPUS
              </h4>
              <p className="text-xs font-mono text-emerald-300/70 mt-1">
                Kannur, Kerala, India • National Level IT Fest
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <a
              href="mailto:zypherix2026@gmail.com"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-black/60 hover:bg-black border border-emerald-500/40 text-emerald-200 font-mono text-xs flex items-center justify-center gap-2 hover:border-[#00f5a0] transition-all"
            >
              <Mail className="w-4 h-4 text-[#00f5a0]" />
              <span>zypherix2026@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

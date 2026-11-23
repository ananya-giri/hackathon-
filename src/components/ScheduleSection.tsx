"use client";

import React from "react";
import { Clock, Calendar, CheckCircle2, MapPin } from "lucide-react";

export default function ScheduleSection() {
  const events = [
    {
      time: "09:00 AM",
      title: "Reporting & Verification",
      desc: "Participant badge collection and desk verification at Jamia Hamdard Kannur Campus.",
      status: "Check-in",
    },
    {
      time: "10:00 AM",
      title: "Inaugural & Rules Briefing",
      desc: "Welcome address by Zypherix coordinators and technical breakdown of scoring systems.",
      status: "Briefing",
    },
    {
      time: "10:30 AM",
      title: "Round 1: Rapid Debugging",
      desc: "45 minutes sprint of bug identification and algorithmic output prediction.",
      status: "Round 01",
    },
    {
      time: "01:00 PM",
      title: "Lunch & Sponsor Networking",
      desc: "Complimentary lunch and interactive networking booth with Upcode & Infomac representatives.",
      status: "Break",
    },
    {
      time: "02:00 PM",
      title: "Round 2: The Core Coding Arena",
      desc: "Qualifiers compete on live algorithmic problem sets in the computer laboratory.",
      status: "Finals",
    },
    {
      time: "04:30 PM",
      title: "Grand Valedictory & Awards",
      desc: "Cash prize presentation (₹6000 & ₹3000), trophy distribution, and certificate felicitation.",
      status: "Awards",
    },
  ];

  return (
    <section id="schedule" className="relative py-24 bg-[#050811] text-emerald-100 border-t border-emerald-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#00f5a0]" />
            Timeline // 27 January 2027
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            EVENT <span className="text-[#00d9f5]">SCHEDULE</span>
          </h2>
          <p className="mt-3 text-emerald-300/70 font-mono text-sm">
            Day schedule for Byteon at Zypherix IT Fest, Jamia Hamdard Kannur Campus.
          </p>
        </div>

        {/* Schedule List */}
        <div className="relative border-l border-emerald-500/30 ml-4 sm:ml-32 space-y-8">
          {events.map((ev, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10 group">
              {/* Bullet node */}
              <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-[#050811] border-2 border-[#00f5a0] flex items-center justify-center group-hover:scale-125 transition-transform shadow-[0_0_10px_#00f5a0]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
              </div>

              {/* Time display for larger screens */}
              <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right font-mono text-xs font-bold text-[#00f5a0]">
                {ev.time}
              </div>

              {/* Card */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-500/20 group-hover:border-[#00f5a0]/50 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="sm:hidden font-mono text-xs font-bold text-[#00f5a0]">
                    {ev.time}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-400/20 text-emerald-300">
                    {ev.status}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-mono group-hover:text-[#00f5a0] transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-emerald-300/70 mt-1">
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

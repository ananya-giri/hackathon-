"use client";

import React from "react";
import { Code2, Bug, Zap, Cpu, Terminal, CheckCircle } from "lucide-react";

export default function RulesSection() {
  const rounds = [
    {
      number: "ROUND 01",
      title: "Syntax Hunt & Rapid Debugging",
      time: "45 Minutes",
      description: "A fast-paced test of code diagnostics and language fluency. Identify logical traps, fix broken algorithms, and deduce compiler outputs.",
      features: [
        "Time complexity & logic output prediction",
        "Bug hunting in pre-written code snippets",
        "Multiple-choice algorithmic traps",
        "Top qualifiers advance to Round 02",
      ],
      icon: Bug,
      accent: "#00f5a0",
    },
    {
      number: "ROUND 02",
      title: "The Core Algorithmic Arena",
      time: "90 Minutes",
      description: "The championship battle. Solve complex real-world algorithmic problems requiring optimum space and time complexity.",
      features: [
        "Dynamic programming & graph traversal",
        "Automated unit test execution suite",
        "Strict penalty for edge case failure",
        "Live leaderboard tracking winner times",
      ],
      icon: Code2,
      accent: "#00d9f5",
    },
  ];

  return (
    <section id="rounds" className="relative py-24 bg-[#050811] text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4">
            <Terminal className="w-3.5 h-3.5 text-[#00f5a0]" />
            Competition Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            BYTEON <span className="text-[#00f5a0]">ROUNDS & RULES</span>
          </h2>
          <p className="mt-3 text-emerald-300/70 font-mono text-sm sm:text-base">
            Engineered to assess real-world programming skill, code efficiency, and problem solving under pressure.
          </p>
        </div>

        {/* Rounds Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {rounds.map((round, idx) => {
            const Icon = round.icon;
            return (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-black/60 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-xs font-mono font-black tracking-widest px-3 py-1 rounded-full border"
                    style={{
                      color: round.accent,
                      borderColor: `${round.accent}50`,
                      backgroundColor: `${round.accent}15`,
                    }}
                  >
                    {round.number}
                  </span>
                  <span className="text-xs font-mono text-emerald-400/70 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/20">
                    ⏱ {round.time}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl border flex-shrink-0"
                    style={{
                      borderColor: `${round.accent}40`,
                      backgroundColor: `${round.accent}10`,
                      color: round.accent,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white font-mono group-hover:text-emerald-300 transition-colors">
                      {round.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-mono text-emerald-200/80 mb-6">
                  {round.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-emerald-500/20">
                  {round.features.map((item, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs font-mono text-emerald-300/80">
                      <CheckCircle className="w-3.5 h-3.5 text-[#00f5a0] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Permitted Languages & Specs */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-black/40 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-white font-mono font-bold text-sm mb-1">
              SUPPORTED PROGRAMMING ENVIRONMENTS
            </h4>
            <p className="text-xs font-mono text-emerald-300/70">
              Standard compilers provided on lab terminals. Offline and local execution only.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {["C / C++ (GCC 13)", "Python (3.11+)", "Java (OpenJDK 21)", "JavaScript / Node"].map((lang, lIdx) => (
              <span
                key={lIdx}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

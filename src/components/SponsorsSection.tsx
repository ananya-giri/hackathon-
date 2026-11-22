"use client";

import React from "react";
import { Building2, Cpu, ShieldCheck } from "lucide-react";

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-20 bg-[#050811] text-emerald-100 border-t border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400/80 mb-2">
            OFFICIAL PARTNERS & SPONSORS
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">
            POWERED BY TECH LEADERS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Sponsor 1: upcode */}
          <div className="p-8 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col items-center text-center hover:border-[#00f5a0] transition-all group">
            <div className="flex items-center gap-3 mb-3">
              {/* Upcode pixel cube logo representation */}
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                <div className="bg-[#00f5a0] w-2.5 h-2.5 rounded-sm" />
                <div className="bg-[#00d9f5] w-2.5 h-2.5 rounded-sm" />
                <div className="bg-emerald-700 w-2.5 h-2.5 rounded-sm" />
                <div className="bg-white w-2.5 h-2.5 rounded-sm" />
              </div>
              <span className="text-2xl font-black text-white font-mono tracking-tight group-hover:text-[#00f5a0] transition-colors">
                upcode.
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400/80">
              SOFTWARE LABS
            </span>
            <p className="text-xs font-mono text-emerald-300/60 mt-3">
              Official Technical Partner • Software Engineering, Cloud Architectures & Talent Incubation.
            </p>
          </div>

          {/* Sponsor 2: INFOMAC */}
          <div className="p-8 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col items-center text-center hover:border-[#00d9f5] transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-6 h-6 text-[#00d9f5]" />
              <span className="text-2xl font-black text-white font-mono tracking-wider group-hover:text-[#00d9f5] transition-colors">
                INFOMAC
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400/80">
              SYSTEMS
            </span>
            <p className="text-xs font-mono text-cyan-300/60 mt-3">
              Official Infrastructure Partner • High-Performance Computing, IT Solutions & Hardware Support.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

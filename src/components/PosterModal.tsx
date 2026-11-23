"use client";

import React from "react";
import { X, ExternalLink, Download } from "lucide-react";
import StarButton from "./StarButton";

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PosterModal({ isOpen, onClose }: PosterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative max-w-2xl w-full my-auto bg-[#080d1a] border border-[#FFBA00]/40 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(255,186,0,0.3)]">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFBA00]" />
            <h3 className="font-mono text-sm font-bold text-white tracking-wider">
              OFFICIAL EVENT POSTER // BYTEON '27
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <StarButton
              as="a"
              href="/poster.jpg"
              download="Byteon-Zypherix-2027.jpg"
              className="!px-3 !py-1.5 !text-xs !border-2"
              title="Download Poster"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </StarButton>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/60 text-[#FFBA00] hover:text-white hover:bg-[#FFBA00]/10 border border-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative rounded-xl overflow-hidden border border-white/15 max-h-[75vh] flex items-center justify-center bg-black">
          <img
            src="/poster.jpg"
            alt="Byteon 2027 Official Poster"
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#FFBA00]/70 desc-text">
          <span>National Level IT Fest: Zypherix • 27, 28 Jan</span>
          <span>Jamia Hamdard Kannur Campus</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import StarButton from "./StarButton";

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PosterModal({ isOpen, onClose }: PosterModalProps) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Official Event Poster"
    >
      <div className="animate-modal-in relative overflow-hidden max-w-2xl w-full my-auto bg-[#080d1a]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFBA00] animate-pulse" />
            <h3 className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
              OFFICIAL EVENT POSTER // BYTEON &apos;27
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? "Zoom out poster" : "Zoom in poster"}
              className="p-1.5 rounded-lg bg-black/60 text-[#FFBA00] hover:text-white hover:bg-[#FFBA00]/15 border border-white/15 transition-colors"
              title={zoomed ? "Zoom Out" : "Zoom In"}
            >
              {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

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
              aria-label="Close poster modal"
              className="p-1.5 rounded-lg bg-black/60 text-[#FFBA00] hover:text-white hover:bg-[#FFBA00]/15 border border-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative rounded-xl overflow-auto border border-white/15 max-h-[75vh] flex items-center justify-center bg-black">
          <img
            src="/poster.jpg"
            alt="Byteon 2027 Official Poster"
            onClick={() => setZoomed((z) => !z)}
            className={`transition-transform duration-300 cursor-zoom-in ${
              zoomed ? "scale-125 cursor-zoom-out" : "w-full h-auto max-h-[75vh] object-contain"
            }`}
          />
        </div>

        {/* Footer info */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#FFBA00]/80">
          <span>National Level IT Fest: Zypherix • 27, 28 Jan</span>
          <span>Jamia Hamdard Kannur Campus</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import ScrollCanvasAnimation from "@/components/ScrollCanvasAnimation";
import RegistrationModal from "@/components/RegistrationModal";
import PosterModal from "@/components/PosterModal";

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#050811] text-emerald-100 overflow-x-hidden">
      {/* 
        Full-Screen Apple / EDL-style scroll-linked canvas experience.
        The video sequence remains fixed across the entire website screen,
        revealing details and interactive sections across 8 scroll chapters.
      */}
      <ScrollCanvasAnimation
        onRegisterClick={() => setIsRegisterOpen(true)}
        onPosterClick={() => setIsPosterOpen(true)}
      />

      {/* Interactive Registration Modal with Cropped QR Code & Form */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* High-Resolution Event Poster Lightbox */}
      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />
    </main>
  );
}

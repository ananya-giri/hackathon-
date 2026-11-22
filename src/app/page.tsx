"use client";

import React, { useState } from "react";
import ScrollCanvasAnimation from "@/components/ScrollCanvasAnimation";
import RegistrationModal from "@/components/RegistrationModal";
import PosterModal from "@/components/PosterModal";

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#050811] text-[#F2EFE6]">
      {/*
        Full-screen scroll-linked video experience: the film stays fixed
        across the whole page, revealing one chapter at a time as you scroll.
        NOTE: do not put overflow-x-hidden (or any overflow) on this <main> —
        it makes <main> the scroll container for sticky descendants and the
        chapter viewport (now fixed) must stay viewport-anchored.
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

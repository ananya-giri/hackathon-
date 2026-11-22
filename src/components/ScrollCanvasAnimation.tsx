"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Terminal,
  Cpu,
  Sparkles,
  ChevronDown,
  Award,
  Trophy,
  Calendar,
  MapPin,
  Bug,
  Code2,
  Phone,
  MessageSquare,
  Mail,
  QrCode,
  Image as ImageIcon,
  CheckCircle2,
  Check,
  Gift,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
} from "lucide-react";

interface ScrollCanvasAnimationProps {
  onRegisterClick: () => void;
  onPosterClick: () => void;
}

// 8 Defined Story Chapters across the full-page scroll sequence
const CHAPTERS = [
  { id: "hero", title: "01 // Initiation", range: [0.00, 0.12] },
  { id: "about", title: "02 // Fest & Venue", range: [0.12, 0.27] },
  { id: "rounds", title: "03 // Rounds & Rules", range: [0.27, 0.44] },
  { id: "prizes", title: "04 // Bounties ₹9,000", range: [0.44, 0.61] },
  { id: "schedule", title: "05 // Event Timeline", range: [0.61, 0.76] },
  { id: "sponsors", title: "06 // Official Sponsors", range: [0.76, 0.86] },
  { id: "coordinators", title: "07 // Helpdesk", range: [0.86, 0.94] },
  { id: "register", title: "08 // Registration & QR", range: [0.94, 1.00] },
];

export default function ScrollCanvasAnimation({
  onRegisterClick,
  onPosterClick,
}: ScrollCanvasAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preloading & readiness
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Scroll & animation progress (0.0 to 1.0)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Image cache and RAF tracking
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Total frames in the processor zoom out sequence
  const TOTAL_FRAMES = 238;

  // Frame URL formatter: frames/ezgif-frame-001.jpg -> ezgif-frame-238.jpg
  const getFrameUrl = useCallback((frameNumber: number) => {
    const padded = String(frameNumber).padStart(3, "0");
    return `/frames/ezgif-frame-${padded}.jpg`;
  }, []);

  // 1. Draw frame to canvas maintaining full-screen 'cover' aspect ratio
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    // Cover math: scale to fill 100% of the screen without stretching or letterboxing
    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // 2. Resize canvas internal buffer to physical screen pixels for ultra-crisp output
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    if (currentFrameIndexRef.current >= 0) {
      drawFrame(currentFrameIndexRef.current);
    }
  }, [drawFrame]);

  // 3. Preload all frames on mount
  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      // For reduced motion, load only the final frame
      const singleImg = new Image();
      singleImg.src = getFrameUrl(TOTAL_FRAMES);
      singleImg.onload = () => {
        imagesRef.current = [singleImg];
        setLoadProgress(100);
        setLoading(false);
        currentFrameIndexRef.current = 0;
        resizeCanvas();
        drawFrame(0);
      };
      return;
    }

    // Mobile: if screen width < 768px, load every second frame (1, 3, 5, ...)
    const isMobile = window.innerWidth < 768;
    const frameStep = isMobile ? 2 : 1;

    const frameIndices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += frameStep) {
      frameIndices.push(i);
    }

    const totalToLoad = frameIndices.length;
    let loadedCount = 0;
    const preloadedImages: HTMLImageElement[] = new Array(totalToLoad);

    frameIndices.forEach((frameNum, index) => {
      const img = new Image();
      img.src = getFrameUrl(frameNum);

      const onImageLoad = () => {
        loadedCount += 1;
        setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));

        if (loadedCount === totalToLoad) {
          imagesRef.current = preloadedImages;
          setLoading(false);
          currentFrameIndexRef.current = 0;
          resizeCanvas();
          drawFrame(0);
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad;
      preloadedImages[index] = img;
    });

    return () => {
      preloadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [TOTAL_FRAMES, getFrameUrl, resizeCanvas, drawFrame]);

  // 4. Scroll-linked frame update using requestAnimationFrame
  useEffect(() => {
    if (loading || isReducedMotion) return;

    /*
     * =========================================================================
     * SCROLL-TO-FRAME MAPPING & SPEED ADJUSTMENT:
     * =========================================================================
     * The container height (750vh) spans the full website's interactive scrub.
     * - scrolledDistance: scroll offset from container top.
     * - maxScrollDistance: container height minus window innerHeight.
     * - fraction: normalized 0.0 to 1.0 representing progress across the whole site.
     *
     * SPEED TUNING GUIDE:
     * - TO MAKE ANIMATION SLOWER (more scroll distance needed per frame):
     *     Increase container height below (e.g. from 'h-[750vh]' to 'h-[900vh]').
     * - TO MAKE ANIMATION FASTER (less scroll distance needed per frame):
     *     Decrease container height below (e.g. from 'h-[750vh]' to 'h-[550vh]').
     * =========================================================================
     */
    const updateFrameOnScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      const scrolledDistance = -containerTop;
      const maxScrollDistance = containerHeight - windowHeight;

      let fraction = scrolledDistance / maxScrollDistance;
      fraction = Math.max(0, Math.min(1, fraction));

      setScrollProgress(fraction);

      // Determine active chapter for HUD indicator
      const activeIdx = CHAPTERS.findIndex(
        (ch) => fraction >= ch.range[0] && fraction <= ch.range[1]
      );
      if (activeIdx !== -1) {
        setActiveChapterIndex(activeIdx);
      }

      const totalImages = imagesRef.current.length;
      if (totalImages === 0) return;

      // Map progress fraction to frame index
      const targetFrame = Math.min(
        Math.floor(fraction * (totalImages - 1)),
        totalImages - 1
      );

      // Repaint ONLY if the frame index has changed!
      if (targetFrame !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = targetFrame;
        drawFrame(targetFrame);
      }

      rafIdRef.current = null;
    };

    const onScroll = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateFrameOnScroll);
      }
    };

    const onResize = () => {
      resizeCanvas();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    updateFrameOnScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [loading, isReducedMotion, drawFrame, resizeCanvas]);

  // Jump to specific chapter when clicking side navigation dots
  const jumpToChapter = (startFraction: number) => {
    const container = containerRef.current;
    if (!container) return;
    const maxScrollDistance = container.offsetHeight - window.innerHeight;
    const targetScrollY = container.offsetTop + startFraction * maxScrollDistance;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  // Helper to calculate smooth opacity & translateY for any chapter
  const getChapterStyle = (start: number, end: number) => {
    const buffer = 0.03; // transition feathering
    if (scrollProgress < start - buffer || scrollProgress > end + buffer) {
      return { opacity: 0, pointerEvents: "none" as const, transform: "scale(0.96) translateY(20px)" };
    }

    let opacity = 1;
    if (scrollProgress < start + buffer) {
      opacity = (scrollProgress - (start - buffer)) / (2 * buffer);
    } else if (scrollProgress > end - buffer) {
      opacity = (end + buffer - scrollProgress) / (2 * buffer);
    }
    opacity = Math.max(0, Math.min(1, opacity));

    const translateY = (1 - opacity) * 15;
    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      pointerEvents: opacity > 0.4 ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    /*
     * The tall 750vh scroll track anchors the ENTIRE website journey.
     * The canvas remains permanently fixed full-screen in the background,
     * while the chapters reveal their contents smoothly on each scroll.
     */
    <div
      ref={containerRef}
      className="relative w-full h-[750vh] bg-[#050811] text-emerald-100"
    >
      {/* 
        FIXED FULL-SCREEN CANVAS BACKGROUND 
        Covers the whole screen across all scrolls (Apple & EDL Inc style)
      */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block select-none"
        />

        {/* Ambient cyber scanlines & high-contrast readability vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-black/20 via-black/50 to-[#050811]/95" />
        <div className="absolute inset-0 scanlines opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/80" />
      </div>

      {/* Preloading Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-emerald-400 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-8 h-8 text-[#00f5a0] animate-spin" />
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400/80">
              // Zypherix Hardware Neural Bus
            </span>
          </div>

          <div className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-2 font-mono">
            BYTEON<span className="text-[#00f5a0]">.2026</span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-emerald-300/70 mb-8 tracking-wider">
            SYNCHRONIZING SILICON ANIMATION BUFFER [{loadProgress}%]
          </p>

          <div className="w-64 sm:w-80 h-2 bg-emerald-950/60 rounded-full overflow-hidden border border-emerald-500/30 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-[#00f5a0] to-[#00d9f5] rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_#00f5a0]"
              style={{ width: `${loadProgress}%` }}
            />
          </div>

          <div className="mt-4 font-mono text-xs text-emerald-400/50 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
            Preloading 238 full-resolution sequence frames...
          </div>
        </div>
      )}

      {/* 
        FIXED HUD OVERLAYS (Navigation, Scrubber, Frame Status)
      */}
      {!loading && (
        <>
          {/* Top Fixed Bar */}
          <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00f5a0]/15 border border-[#00f5a0]/40 flex items-center justify-center text-[#00f5a0] shadow-[0_0_15px_rgba(0,245,160,0.3)]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono font-black text-white text-base tracking-wider flex items-center gap-1.5">
                  BYTEON <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00f5a0] border border-emerald-500/30 font-bold">2026</span>
                </span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 -mt-1">
                  Zypherix National IT Fest • 27, 28 Jan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onPosterClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#00f5a0]" />
                <span>Event Poster</span>
              </button>

              <button
                onClick={onRegisterClick}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-mono font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(0,245,160,0.4)] hover:shadow-[0_0_30px_rgba(0,245,160,0.7)] transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>REGISTER NOW</span>
              </button>
            </div>
          </header>

          {/* Right Floating Chapter Scrubber Dots */}
          <nav
            aria-label="Chapter timeline"
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 p-2.5 rounded-2xl bg-black/60 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => jumpToChapter(ch.range[0])}
                  className="group relative flex items-center justify-end"
                >
                  {/* Tooltip on hover */}
                  <span className="absolute right-7 px-2.5 py-1 rounded-md bg-black/90 border border-emerald-500/40 text-[10px] font-mono whitespace-nowrap text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[0_0_10px_rgba(0,245,160,0.2)]">
                    {ch.title}
                  </span>
                  
                  {/* Dot */}
                  <div
                    className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                      isActive
                        ? "w-4 h-4 bg-[#00f5a0] shadow-[0_0_12px_#00f5a0]"
                        : "w-2.5 h-2.5 bg-emerald-950 border border-emerald-500/40 group-hover:bg-[#00f5a0]/50"
                    }`}
                  >
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Fixed Status Bar */}
          <footer className="fixed bottom-0 left-0 right-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between text-[11px] font-mono text-emerald-400/70 backdrop-blur-md bg-black/50 border-t border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse" />
              <span className="hidden sm:inline">CURRENT CHAPTER:</span>
              <span className="text-white font-bold">{CHAPTERS[activeChapterIndex]?.title}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">FRAME: {currentFrameIndexRef.current + 1} / {imagesRef.current.length || TOTAL_FRAMES}</span>
              <span>ZOOM SCRUB: {(scrollProgress * 100).toFixed(0)}%</span>
            </div>
          </footer>
        </>
      )}

      {/* 
        STICKY FULL-SCREEN VIEWPORT HOLDING THE SCROLL-LINKED CHAPTERS
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-10 pointer-events-none">
        
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">

          {/* ========================================================================= */}
          {/* CHAPTER 1: INITIATION & HERO (0% - 12%)                                  */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 transition-all duration-500"
            style={getChapterStyle(0.00, 0.12)}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(0,245,160,0.3)]">
              <Terminal className="w-4 h-4 text-[#00f5a0]" />
              Zypherix 2026 // National Level IT Fest
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-[#00f5a0] drop-shadow-[0_0_40px_rgba(0,245,160,0.5)] font-mono">
              BYTEON
            </h1>

            <p className="mt-2 text-xl sm:text-3xl font-mono text-[#00f5a0] font-bold tracking-wider flex items-center gap-3">
              <span>CODING CHALLENGE</span>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-400/40 text-emerald-200">
                27 JAN
              </span>
            </p>

            <p className="mt-3 text-xs sm:text-sm font-mono text-emerald-300/80 max-w-md">
              Camera deep inside the silicon microarchitecture. Scroll down to zoom out and traverse the event details.
            </p>

            {/* Quick Hero Highlights */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-black/70 border border-emerald-500/30 text-white">
                💰 ₹9,000 Total Prize Pool
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-black/70 border border-emerald-500/30 text-white">
                📍 Jamia Hamdard Kannur Campus
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-black/70 border border-emerald-500/30 text-white">
                ⚡ Powered by Upcode & Infomac
              </span>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-emerald-400/80 animate-bounce">
              <span>SCROLL TO STEP THROUGH SYSTEM</span>
              <ChevronDown className="w-4 h-4 text-[#00f5a0]" />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 2: FEST, EVENT & VENUE (12% - 27%)                                */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.12, 0.27)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-[#00d9f5]/40 text-[#00d9f5] text-xs font-mono tracking-widest uppercase mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Chapter 02 // Venue & Fest
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                WHERE LOGIC MEETS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5a0] to-[#00d9f5]">
                  RAW COMPUTING POWER
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
              <div className="p-6 rounded-2xl bg-black/75 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">// FEST</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">ZYPHERIX '26</h3>
                <p className="text-xs font-mono text-emerald-300/70 mt-2">
                  National Level IT Fest spanning 27 & 28 January. Gathering tech enthusiasts and developers across India.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/75 border border-[#00f5a0]/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,245,160,0.2)]">
                <span className="text-xs font-mono text-[#00f5a0] uppercase tracking-widest">// EVENT</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">BYTEON CODING</h3>
                <p className="text-xs font-mono text-emerald-300/70 mt-2">
                  Scheduled for 27 January 2026. Fast-paced individual coding battle featuring algorithmic mastery.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/75 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                <span className="text-xs font-mono text-[#00d9f5] uppercase tracking-widest">// VENUE</span>
                <h3 className="text-lg font-bold font-mono text-white mt-1">JAMIA HAMDARD</h3>
                <p className="text-xs font-mono text-emerald-300/70 mt-2">
                  Kannur Campus, Kerala. High-speed laboratory workstations and offline compilation terminals provided.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 3: COMPETITION ROUNDS & RULES (27% - 44%)                         */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.27, 0.44)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-3">
                <Code2 className="w-3.5 h-3.5 text-[#00f5a0]" />
                Chapter 03 // Competition Structure
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono">
                TWO RIGOROUS ROUNDS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
              {/* Round 1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/80 border-2 border-emerald-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,245,160,0.15)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-xs font-mono font-bold text-[#00f5a0]">
                    ROUND 01
                  </span>
                  <span className="text-xs font-mono text-emerald-400/70">⏱ 45 Minutes</span>
                </div>
                <h3 className="text-2xl font-bold font-mono text-white mb-2 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-[#00f5a0]" />
                  Syntax Hunt & Rapid Debugging
                </h3>
                <p className="text-xs sm:text-sm font-mono text-emerald-200/80 mb-4">
                  Identify syntax flaws, rectify broken snippets, and deduce output predictions against the clock.
                </p>
                <div className="space-y-1.5 text-xs font-mono text-emerald-300/80 border-t border-emerald-500/20 pt-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f5a0]" />
                    <span>Time complexity & output prediction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f5a0]" />
                    <span>Top scorers advance to Round 02</span>
                  </div>
                </div>
              </div>

              {/* Round 2 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/80 border-2 border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,217,245,0.15)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-xs font-mono font-bold text-[#00d9f5]">
                    ROUND 02
                  </span>
                  <span className="text-xs font-mono text-cyan-400/70">⏱ 90 Minutes</span>
                </div>
                <h3 className="text-2xl font-bold font-mono text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#00d9f5]" />
                  The Core Algorithmic Arena
                </h3>
                <p className="text-xs sm:text-sm font-mono text-emerald-200/80 mb-4">
                  Championship sprint. Solve complex algorithmic challenges with optimal space and time complexities.
                </p>
                <div className="space-y-1.5 text-xs font-mono text-emerald-300/80 border-t border-emerald-500/20 pt-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00d9f5]" />
                    <span>Automated test-case evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00d9f5]" />
                    <span>Live ranking & execution benchmarks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported languages banner */}
            <div className="mt-4 px-4 py-2 rounded-xl bg-black/70 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center gap-3">
              <span className="text-emerald-400/70">LANGUAGES:</span>
              <span className="text-white font-bold">C • C++ • Python • Java • JavaScript</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 4: PRIZES & BOUNTIES (44% - 61%)                                  */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.44, 0.61)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-[#00f5a0] text-xs font-mono tracking-widest uppercase mb-3">
                <Trophy className="w-3.5 h-3.5" />
                Chapter 04 // Bounties & Stakes
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-mono">
                TOTAL POOL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5a0] to-[#00d9f5]">₹9,000/-</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
              {/* First Prize */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-black/85 border-2 border-[#00f5a0] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,245,160,0.3)]">
                <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-[#00f5a0] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_15px_#00f5a0]">
                  CHAMPION
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">First Prize</span>
                    <div className="text-5xl sm:text-6xl font-black text-white font-mono mt-1">
                      6000<span className="text-2xl text-[#00f5a0]">/-</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-[#00f5a0]/40 flex items-center justify-center text-[#00f5a0]">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-mono text-emerald-200/90 border-t border-emerald-500/20 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f5a0]" />
                    <span>₹6,000 Cash Prize</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f5a0]" />
                    <span>Winner Trophy & Shield</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f5a0]" />
                    <span>Certificate of Excellence</span>
                  </li>
                </ul>
              </div>

              {/* Second Prize */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-black/85 border-2 border-cyan-400/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,217,245,0.25)]">
                <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-[#00d9f5] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_15px_#00d9f5]">
                  RUNNER-UP
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#00d9f5]">Second Prize</span>
                    <div className="text-5xl sm:text-6xl font-black text-white font-mono mt-1">
                      3000<span className="text-2xl text-cyan-400">/-</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-[#00d9f5]">
                    <Award className="w-8 h-8" />
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-mono text-emerald-200/90 border-t border-cyan-500/20 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d9f5]" />
                    <span>₹3,000 Cash Prize</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d9f5]" />
                    <span>Runner-up Trophy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d9f5]" />
                    <span>Certificate of Merit</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/20 text-xs font-mono text-emerald-300">
              🎖 Official National Certificates awarded to all verified participants.
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 5: EVENT TIMELINE & SCHEDULE (61% - 76%)                          */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.61, 0.76)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#00f5a0]" />
                Chapter 05 // Day Schedule (27 Jan)
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono">
                TIMELINE OF THE ARENA
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full max-w-4xl">
              {[
                { time: "09:00 AM", title: "Reporting & Check-in", desc: "Badge collection at Jamia Hamdard desk." },
                { time: "10:00 AM", title: "Inaugural & Rules Brief", desc: "Coordinators present guidelines & setup." },
                { time: "10:30 AM", title: "Round 1: Rapid Debug", desc: "45-minute sprint of bug hunt & MCQ output." },
                { time: "01:00 PM", title: "Lunch & Networking", desc: "Complimentary lunch & sponsor booth." },
                { time: "02:00 PM", title: "Round 2: Algorithmic Duel", desc: "Qualifiers compete on live problem sets." },
                { time: "04:30 PM", title: "Grand Valedictory", desc: "Presentation of ₹6000 & ₹3000 cash prizes." },
              ].map((ev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 backdrop-blur-xl">
                  <span className="font-mono text-xs font-bold text-[#00f5a0]">{ev.time}</span>
                  <h4 className="font-mono text-sm font-bold text-white mt-1">{ev.title}</h4>
                  <p className="font-mono text-[11px] text-emerald-300/70 mt-1">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 6: OFFICIAL SPONSORS (76% - 86%)                                  */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.76, 0.86)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-3">
                <Cpu className="w-3.5 h-3.5 text-[#00f5a0]" />
                Chapter 06 // Corporate Backing
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono">
                OFFICIAL SPONSORS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
              {/* Upcode */}
              <div className="p-8 rounded-3xl bg-black/85 border-2 border-emerald-500/40 backdrop-blur-xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,245,160,0.2)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="grid grid-cols-2 gap-1 w-6 h-6">
                    <div className="bg-[#00f5a0] w-2.5 h-2.5 rounded-sm" />
                    <div className="bg-[#00d9f5] w-2.5 h-2.5 rounded-sm" />
                    <div className="bg-emerald-700 w-2.5 h-2.5 rounded-sm" />
                    <div className="bg-white w-2.5 h-2.5 rounded-sm" />
                  </div>
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    upcode.
                  </span>
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold">
                  SOFTWARE LABS
                </span>
                <p className="text-xs font-mono text-emerald-300/70 mt-4">
                  Official Technical Partner • Software Engineering, Cloud Infrastructure & Talent Mentorship.
                </p>
              </div>

              {/* Infomac */}
              <div className="p-8 rounded-3xl bg-black/85 border-2 border-cyan-500/40 backdrop-blur-xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,217,245,0.2)]">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-8 h-8 text-[#00d9f5]" />
                  <span className="text-3xl font-black text-white font-mono tracking-wider">
                    INFOMAC
                  </span>
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  SYSTEMS
                </span>
                <p className="text-xs font-mono text-cyan-300/70 mt-4">
                  Official Infrastructure Partner • High-Performance Computing, IT Solutions & Hardware Support.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 7: EVENT COORDINATORS & HELPDESK (86% - 94%)                      */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.86, 0.94)}
          >
            <div className="max-w-3xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-3">
                <Phone className="w-3.5 h-3.5 text-[#00f5a0]" />
                Chapter 07 // Student Coordinators
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono">
                GET IN TOUCH
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-4">
              {/* Coordinator 1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/85 border border-emerald-500/40 backdrop-blur-xl">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Student Coordinator</span>
                <h3 className="text-2xl font-black text-white font-mono mt-1">Khalid Adeel</h3>
                <p className="text-lg font-mono font-bold text-[#00f5a0] mt-1">+91 8590090507</p>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <a
                    href="tel:+918590090507"
                    className="py-2 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-center text-emerald-300 hover:text-white transition-colors"
                  >
                    📞 Call
                  </a>
                  <a
                    href="https://wa.me/918590090507?text=Hi%20Khalid,%20I%20have%20an%20inquiry%20regarding%20Byteon%20Zypherix."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#00f5a0]/15 border border-[#00f5a0]/50 text-xs font-mono text-center text-[#00f5a0] hover:bg-[#00f5a0]/30 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* Coordinator 2 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/85 border border-emerald-500/40 backdrop-blur-xl">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Student Coordinator</span>
                <h3 className="text-2xl font-black text-white font-mono mt-1">Nihma Parveen</h3>
                <p className="text-lg font-mono font-bold text-[#00f5a0] mt-1">+91 8137831382</p>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <a
                    href="tel:+918137831382"
                    className="py-2 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-center text-emerald-300 hover:text-white transition-colors"
                  >
                    📞 Call
                  </a>
                  <a
                    href="https://wa.me/918137831382?text=Hi%20Nihma,%20I%20have%20an%20inquiry%20regarding%20Byteon%20Zypherix."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#00f5a0]/15 border border-[#00f5a0]/50 text-xs font-mono text-center text-[#00f5a0] hover:bg-[#00f5a0]/30 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="px-5 py-2 rounded-xl bg-black/70 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#00f5a0]" />
              <span>Official Mail: <strong className="text-white">zypherix2026@gmail.com</strong></span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTER 8: REGISTRATION & OFFICIAL QR CODE (94% - 100%)                   */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500"
            style={getChapterStyle(0.94, 1.00)}
          >
            <div className="p-6 sm:p-10 rounded-3xl bg-black/90 border-2 border-emerald-500/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,245,160,0.3)] max-w-3xl w-full flex flex-col md:flex-row items-center gap-8">
              
              {/* QR Code from poster */}
              <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,245,160,0.4)] flex-shrink-0">
                <img
                  src="/qr-code.png"
                  alt="Registration QR Code from Poster"
                  className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
                />
                <span className="mt-2 text-[10px] font-mono font-black text-black uppercase tracking-wider">
                  SCAN WITH ANY UPI / CAMERA
                </span>
              </div>

              {/* Text & CTAs */}
              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-[#00f5a0] font-mono text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Final Chapter // Lock Your Slot
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  REGISTER FOR BYTEON
                </h3>
                <p className="text-xs sm:text-sm font-mono text-emerald-300/80">
                  Ready to compete for ₹9,000/- and take home the national trophy? Register using the camera scanner or click below.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={onRegisterClick}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-extrabold font-mono text-xs tracking-wider shadow-[0_0_25px_rgba(0,245,160,0.5)] hover:shadow-[0_0_35px_rgba(0,245,160,0.8)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>OPEN REGISTRATION FORM</span>
                  </button>

                  <button
                    onClick={onPosterClick}
                    className="px-5 py-3 rounded-xl bg-black/60 hover:bg-black border border-emerald-500/30 text-emerald-300 font-mono text-xs transition-all flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4 text-[#00f5a0]" />
                    <span>VIEW POSTER</span>
                  </button>
                </div>

                <p className="text-[10px] font-mono text-emerald-500/60 pt-1">
                  Jamia Hamdard Kannur Campus • 27 January 2026
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

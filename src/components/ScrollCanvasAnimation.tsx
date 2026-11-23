"use client";

/*
 * BYTEON 2026 — fixed scroll experience.
 *
 * WHAT WAS WRONG (and what this file changes):
 * 1. HAZE — the old code preloaded 238 lossy JPEG frames (57 KB each) and
 *    upscaled them on a canvas. This version scrubs the ORIGINAL mp4
 *    (public/byteon.mp4) with a <video> element, so the picture stays as
 *    crisp as the source. Delete public/frames/ — it is no longer used.
 * 2. BROKEN VIGNETTE — `bg-radial-gradient` is not a Tailwind class, so the
 *    darkening behind the text never rendered. The scrim is now real CSS
 *    (.video-scrim in globals.css) plus a uniform brightness cut on the video.
 * 3. NO CONTRAST — emerald-300/70 text sat directly on the glowing green
 *    video. Every word now sits inside .chapter-panel: a SOLID near-black
 *    panel (not backdrop-blur, which is unreliable over canvas/video).
 *    Headings are pure white, body copy is near-white, minimum 14px.
 * 4. GHOSTING — all 8 chapters were stacked with a 500ms CSS transition
 *    fighting the scroll, so two chapters showed at once. Chapters now get
 *    one full screen of scroll each (800vh track = 100vh per chapter),
 *    fade in/out with NO CSS transition, and only one is ever visible.
 * 5. JANK — setScrollProgress() re-rendered all 8 chapters on every scroll
 *    tick. Progress now lives in refs; chapter opacity is written straight
 *    to the DOM in a rAF loop. React state changes only when the active
 *    chapter changes (max 8 times per full scroll).
 *
 * DESIGN SYSTEM v2 (amber / bronze contrast):
 *   Emerald stays structural (the live dot in the footer). Amber #FFBA00
 *   does all the action: CTAs, key numbers, kickers, active dot, progress
 *   bar (bronze #B46617 → amber gradient). Bronze is premium-only:
 *   champion badge fill, second-round tag. Never bronze as small text.
 *   Writing hierarchy: white headings, amber emphasis, warm paper
 *   #F2EFE6 body, sage #A8BFAF meta. Panels are translucent
 *   (blur + bottom-weighted gradient + text-shadow) so the video shows
 *   through — video brightness raised 0.55 → 0.78. See globals.css.
 *
 * NOTE — facts marked UNVERIFIED below (rounds, timings, schedule,
 * languages, certificates) are NOT on the event poster. They were carried
 * over from the old code. Confirm them with the organisers before
 * presenting this page as final.
 *
 * v2.1 (2026-11-22): the chapter viewport was `sticky top-0`, but
 * `overflow-x-hidden` on <main> (page.tsx) made <main> its scroll
 * container, so it never stuck and scrolled away with the page —
 * chapters 2-8 faded in/out off-screen on the live site. The viewport
 * is now `fixed` (immune to that) and the overflow guard is gone from
 * <main>. Hero no longer fades in from nothing at the top; the last
 * chapter stays put at the bottom instead of fading out.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  Terminal,
  Cpu,
  ChevronDown,
  Trophy,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Ticket,
} from "lucide-react";
import CurtainHeader from "./CurtainHeader";

interface ScrollCanvasAnimationProps {
  onRegisterClick: () => void;
  onPosterClick: () => void;
}

const CHAPTER_COUNT = 6;

const CHAPTERS = [
  { id: "hero", title: "01 // Initiation" },
  { id: "about", title: "02 // Fest & Venue" },
  { id: "prizes", title: "03 // Prizes ₹9,000" },
  { id: "sponsors", title: "04 // Official Sponsors" },
  { id: "coordinators", title: "05 // Helpdesk" },
  { id: "register", title: "06 // Registration & QR" },
];

/* One chapter = one equal slice of the scroll track. */
const chapterRange = (i: number): [number, number] => [
  i / CHAPTER_COUNT,
  (i + 1) / CHAPTER_COUNT,
];

export default function ScrollCanvasAnimation({
  onRegisterClick,
  onPosterClick,
}: ScrollCanvasAnimationProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const durationRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const activeChapterRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  /* Reduced motion: no scrubbing, show the poster still instead. */
  useEffect(() => {
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  /* Check video readiness on mount + event listeners + timeout fallback */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      if (video.duration && Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      setVideoReady(true);
    };

    if (video.readyState >= 1) {
      handleReady();
    }

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);

    // Failsafe: never leave the screen stuck on loading
    const timer = setTimeout(() => {
      handleReady();
    }, 1200);

    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      clearTimeout(timer);
    };
  }, []);

  /*
   * THE SCRUB LOOP — one rAF loop does everything, with no React
   * re-render per frame:
   *  - reads scroll position -> target progress 0..1
   *  - eases towards it (lerp) so the video glides instead of stepping
   *  - sets video.currentTime from the eased progress
   *  - writes each chapter's opacity straight to its DOM node
   */
  useEffect(() => {
    if (isReducedMotion) return;

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        const target = Math.max(
          0,
          Math.min(1, -rect.top / Math.max(1, maxScroll))
        );

        // Ease: 0.14 = smooth glide, still stops exactly where you stop.
        smoothProgressRef.current +=
          (target - smoothProgressRef.current) * 0.14;
        const p = smoothProgressRef.current;

        const video = videoRef.current;
        const dur = durationRef.current || (video && Number.isFinite(video.duration) ? video.duration : 0);
        if (video && Number.isFinite(dur) && dur > 0) {
          const t = Math.max(0, Math.min(dur - 0.05, p * dur));
          // Only seek when it actually moved — avoids seek thrash.
          if (Number.isFinite(t) && Math.abs(video.currentTime - t) > 0.03) {
            try {
              video.currentTime = t;
            } catch {
              // Ignore seek exceptions during rapid scrubbing
            }
          }
        }

        // Active chapter (state update only when it changes).
        const idx = Math.min(
          CHAPTER_COUNT - 1,
          Math.floor(p * CHAPTER_COUNT)
        );
        if (idx !== activeChapterRef.current) {
          activeChapterRef.current = idx;
          setActiveChapter(idx);
        }

        // Progress bar (DOM write, no re-render).
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
        }

        // One chapter visible at a time, CROSSFADING across boundaries:
        // a chapter fades in over the last 9% of the previous chapter's
        // slice + the first 9% of its own, and out symmetrically — so the
        // outgoing panel is still half-visible while the incoming fades in
        // and there is never a stretch of scroll with no panel on screen.
        chapterRefs.current.forEach((el, i) => {
          if (!el) return;
          const [start, end] = chapterRange(i);
          const slice = end - start;
          const fade = slice * 0.09; // half of the old 18% window, each side
          let opacity = 0;
          if (p >= start - fade && p <= end + fade) {
            const inEdge = (p - (start - fade)) / (2 * fade); // 0..1 over the in-fade
            const outEdge = (end + fade - p) / (2 * fade); // 1..0 over the out-fade
            opacity = Math.min(inEdge, outEdge, 1);
            // First chapter: visible on landing; last: stays at the bottom.
            if (i === 0 && p < start + fade) opacity = 1;
            if (i === CHAPTER_COUNT - 1 && p > end - fade) opacity = 1;
            opacity = Math.max(0, Math.min(1, opacity));
          }
          el.style.opacity = opacity.toFixed(3);
          el.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
          el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isReducedMotion, videoReady]);

  const jumpToChapter = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.offsetHeight - window.innerHeight;
    // Land MID-chapter (opacity 1), not at its start where the fade-in
    // is still at 0 — otherwise a dot click shows an empty screen until
    // the visitor scrolls a little further.
    window.scrollTo({
      top: track.offsetTop + ((index + 0.5) / CHAPTER_COUNT) * maxScroll,
      behavior: "smooth",
    });
  };

  /* ------------------------------------------------------------------ */
  /* Chapter content. Every chapter renders inside .chapter-panel,      */
  /* a SOLID panel — that is the whole contrast fix.                     */
  /* ------------------------------------------------------------------ */

  const chapterBody: React.ReactNode[] = [
    /* 1 — HERO */
    <>
      <div className="chip">
        <Terminal className="w-4 h-4 text-[#FFBA00]" />
        Zypherix 2026 // National Level IT Fest
      </div>
      <CurtainHeader
        as="h1"
        text="BYTEON"
        className="hero-title my-1 sm:my-2"
        curtainClassName="fx-curtain--hero"
      />
      <p className="mt-2 sm:mt-3 text-lg sm:text-2xl md:text-3xl font-mono font-bold tracking-wider text-[#FFBA00]">
        CODING CHALLENGE <span className="date-pill">27 JAN</span>
      </p>
      <p className="body-text mt-3 sm:mt-4 max-w-lg text-sm sm:text-base">
        One screen, one scroll, one event. Keep scrolling — each detail of
        the contest appears on its own screen.
      </p>
      <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono">
        <span className="fact-pill">₹9,000 Total Prize Pool</span>
        <span className="fact-pill text-[#FFBA00] border-[#FFBA00]/45 font-bold shadow-[0_0_12px_rgba(255,186,0,0.15)]">
          <Ticket className="w-3.5 h-3.5 text-[#FFBA00]" />
          Fee: Rs. 499
        </span>
        <span className="fact-pill">Jamia Hamdard Kannur Campus</span>
        <span className="fact-pill">27–28 January 2026</span>
      </div>
      <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs sm:text-sm font-mono text-white animate-bounce">
        <span>SCROLL TO STEP THROUGH THE EVENT</span>
        <ChevronDown className="w-4 h-4 text-[#FFBA00]" />
      </div>
    </>,

    /* 2 — FEST & VENUE */
    <>
      <div className="chip">
        <MapPin className="w-4 h-4 text-[#FFBA00]" />
        Chapter 02 // Venue &amp; Fest
      </div>
      <div className="chapter-title flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-1">
        <CurtainHeader as="span" text="WHERE LOGIC MEETS" startIndex={0} />
        <CurtainHeader as="span" text="RAW COMPUTING POWER" startIndex={16} className="text-[#FFBA00]" curtainClassName="fx-curtain--amber" />
      </div>
      <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl text-left">
        <div className="mini-card p-3.5 sm:p-5">
          <span className="mini-label">// FEST</span>
          <h3 className="mini-heading">ZYPHERIX &apos;26</h3>
          <p className="mini-text">
            National Level IT Fest spanning 27 &amp; 28 January 2026.
          </p>
        </div>
        <div className="mini-card mini-card--hot p-3.5 sm:p-5">
          <span className="mini-label">// EVENT</span>
          <h3 className="mini-heading">BYTEON CODING</h3>
          <p className="mini-text">
            The coding contest of the fest — held on 27 January 2026.
          </p>
        </div>
        <div className="mini-card p-3.5 sm:p-5">
          <span className="mini-label">// VENUE</span>
          <h3 className="mini-heading">JAMIA HAMDARD</h3>
          <p className="mini-text">Kannur Campus, Kerala.</p>
        </div>
      </div>
    </>,

    /* 3 — PRIZES */
    <>
      <div className="chip">
        <Trophy className="w-4 h-4 text-[#FFBA00]" />
        Chapter 03 // Prizes
      </div>
      <div className="chapter-title flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-1">
        <CurtainHeader as="span" text="TOTAL POOL" startIndex={0} />
        <CurtainHeader as="span" text="₹9,000/-" startIndex={10} className="text-[#FFBA00]" curtainClassName="fx-curtain--amber" />
      </div>
      <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl text-left">
        <div className="prize-card prize-card--first">
          <span className="prize-badge">CHAMPION</span>
          <span className="mini-label">First Prize</span>
          <div className="prize-amount">
            ₹6,000<span className="text-xl sm:text-2xl text-[#FFBA00]">/-</span>
          </div>
          <ul className="prize-list text-xs sm:text-sm">
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00] shrink-0" /> ₹6,000 cash prize</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00] shrink-0" /> Winner trophy &amp; shield</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00] shrink-0" /> Certificate of excellence</li>
          </ul>
        </div>
        <div className="prize-card prize-card--second">
          <span className="prize-badge prize-badge--amber">RUNNER-UP</span>
          <span className="mini-label">Second Prize</span>
          <div className="prize-amount">
            ₹3,000<span className="text-xl sm:text-2xl text-[#E8A85C]">/-</span>
          </div>
          <ul className="prize-list text-xs sm:text-sm">
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C] shrink-0" /> ₹3,000 cash prize</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C] shrink-0" /> Runner-up trophy</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C] shrink-0" /> Certificate of merit</li>
          </ul>
        </div>
      </div>
    </>,

    /* 4 — SPONSORS */
    <>
      <div className="chip">
        <Cpu className="w-4 h-4 text-[#FFBA00]" />
        Chapter 04 // Corporate Backing
      </div>
      <CurtainHeader as="h2" text="OFFICIAL SPONSORS" className="chapter-title" />
      <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 w-full max-w-3xl text-center">
        <div className="sponsor-card p-4 sm:p-7">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">upcode.</span>
          <span className="mini-label mt-1">SOFTWARE LABS</span>
          <p className="mini-text mt-2 sm:mt-3 text-xs sm:text-sm">Official Technical Partner</p>
        </div>
        <div className="sponsor-card p-4 sm:p-7">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">INFOMAC</span>
          <span className="mini-label mt-1">SYSTEMS</span>
          <p className="mini-text mt-2 sm:mt-3 text-xs sm:text-sm">Official Infrastructure Partner</p>
        </div>
      </div>
    </>,

    /* 5 — COORDINATORS */
    <>
      <div className="chip">
        <Phone className="w-4 h-4 text-[#FFBA00]" />
        Chapter 05 // Student Coordinators
      </div>
      <CurtainHeader as="h2" text="GET IN TOUCH" className="chapter-title" />
      <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 w-full max-w-3xl text-left">
        {[
          { name: "Khalid Adeel", phone: "+91 8590090507", tel: "+918590090507", wa: "918590090507" },
          { name: "Nihma Parveen", phone: "+91 8137831382", tel: "+918137831382", wa: "918137831382" },
        ].map((c) => (
          <div key={c.phone} className="mini-card p-3.5 sm:p-5">
            <span className="mini-label">Student Coordinator</span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">{c.name}</h3>
            <p className="text-base sm:text-xl font-mono font-bold text-[#FFBA00] mt-1">{c.phone}</p>
            <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-4">
              <a href={`tel:${c.tel}`} className="contact-btn">Call</a>
              <a
                href={`https://wa.me/${c.wa}?text=Hi%2C%20I%20have%20a%20question%20about%20Byteon%20at%20Zypherix.`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn contact-btn--wa"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="fact-pill mt-4 sm:mt-5 text-xs sm:text-sm flex flex-wrap justify-center">
        <Mail className="w-4 h-4 text-[#FFBA00]" />
        Official mail: <strong className="text-white ml-1 break-all sm:break-normal">zypherix2026@gmail.com</strong>
      </div>
    </>,

    /* 8 — REGISTER */
    <>
      <div className="register-panel flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 w-full">
        <div className="qr-box p-3 sm:p-4">
          {/* Keep the QR at near-native size — upscaling it blurs the code. */}
          <img src="/qr-code.png" alt="Registration QR code" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" width={144} height={144} />
          <span className="mt-2 text-[10px] sm:text-[11px] font-mono font-bold text-black uppercase tracking-wider">
            Scan to register
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-black text-[#B46617] uppercase tracking-wider">
            Fee: Rs. 499
          </span>
        </div>
        <div className="text-center md:text-left flex-1 min-w-0">
          <div className="chip">
            <Sparkles className="w-4 h-4 text-[#FFBA00]" />
            Final Chapter // Lock Your Slot
          </div>
          <CurtainHeader
            as="h3"
            text="REGISTER FOR BYTEON"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-mono tracking-tight mt-2 sm:mt-3"
          />
          <p className="body-text mt-2 sm:mt-3 text-xs sm:text-sm md:text-base">
            Compete for ₹9,000/- on 27 January 2026 at Jamia Hamdard Kannur
            Campus. Scan the code or open the form below.
          </p>

          {/* Registration Fee Highlight Pill */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 justify-center md:justify-start">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-[#FFBA00]/15 border border-[#FFBA00]/50 text-white font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(255,186,0,0.15)]">
              <Ticket className="w-4 h-4 text-[#FFBA00]" />
              <span>Registration Fee: <strong className="text-[#FFBA00] font-black">Rs. 499</strong></span>
            </div>
            <span className="fact-pill text-[11px] sm:text-xs">Per Team / Participant</span>
          </div>

          <div className="pt-3 sm:pt-4 flex flex-wrap gap-2.5 sm:gap-3 justify-center md:justify-start">
            <button onClick={onRegisterClick} className="cta-primary text-xs sm:text-sm">
              <QrCode className="w-4 h-4" /> OPEN REGISTRATION FORM
            </button>
            <button onClick={onPosterClick} className="cta-secondary text-xs sm:text-sm">
              <ImageIcon className="w-4 h-4 text-[#FFBA00]" /> VIEW POSTER
            </button>
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-white/70 pt-2 sm:pt-3">
            Zypherix 2026 • 27–28 January • Jamia Hamdard Kannur Campus
          </p>
        </div>
      </div>
    </>,
  ];

  /* ------------------------------------------------------------------ */
  /* Reduced-motion fallback: the same content, stacked, no scrub.       */
  /* ------------------------------------------------------------------ */
  if (isReducedMotion) {
    return (
      <div className="relative w-full bg-[#050811] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
          <img src="/poster.jpg" alt="Byteon — Zypherix 2026 poster" className="w-full rounded-2xl border border-white/20" />
          {chapterBody.map((body, i) => (
            <section key={CHAPTERS[i].id} className="chapter-panel chapter-panel--static">
              {body}
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative w-full h-[600vh] bg-[#050811]">
      {/*
        FIXED VIDEO BACKGROUND — one <video>, scrubbed by scroll.
        brightness(0.55) is the predictable dim the old overlays never gave.
        No scanlines, no gradient stacks on top of the picture.
      */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#050811]" aria-hidden="true">
        {!videoMissing ? (
          <video
            ref={videoRef}
            className="video-bg"
            src="/byteon.mp4"
            poster="/poster.jpg"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              durationRef.current = e.currentTarget.duration || 0;
              setVideoReady(true);
            }}
            onError={() => setVideoMissing(true)}
          />
        ) : (
          <img src="/poster.jpg" alt="" className="video-bg" />
        )}
        {/* One real scrim (see globals.css). Uniform, no bright centre. */}
        <div className="video-scrim" />
      </div>

      {/* Header — solid, not translucent-blur dependent */}
      <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between bg-[#04070d]/95 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFBA00]/15 border border-[#FFBA00]/40 flex items-center justify-center text-[#FFBA00] shrink-0">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-mono font-black text-white text-sm sm:text-base tracking-wider flex items-center gap-1.5">
              BYTEON <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-[#FFBA00]/15 text-[#FFBA00] border border-white/15 font-bold">2026</span>
            </span>
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-white/70 -mt-0.5 truncate max-w-[150px] xs:max-w-xs sm:max-w-none">
              Zypherix National IT Fest • 27, 28 Jan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onPosterClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/20 text-white text-xs font-mono hover:border-[#FFBA00]/50 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#FFBA00]" /> Event Poster
          </button>
          <button onClick={onRegisterClick} className="cta-primary !px-3 sm:!px-4 !py-1.5 sm:!py-2 text-xs">
            <QrCode className="w-3.5 h-3.5" /> <span>REGISTER NOW</span>
          </button>
        </div>
      </header>

      {/* Chapter dots */}
      <nav
        aria-label="Chapter timeline"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 p-2.5 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-md"
      >
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => jumpToChapter(idx)}
            title={ch.title}
            aria-label={ch.title}
            className="group relative flex items-center justify-end"
          >
            <span className="absolute right-7 px-2.5 py-1 rounded-md bg-black border border-white/20 text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {ch.title}
            </span>
            <span
              className={`rounded-full transition-all duration-200 ${
                activeChapter === idx
                  ? "w-4 h-4 bg-[#FFBA00] shadow-[0_0_12px_#FFBA00]"
                  : "w-2.5 h-2.5 bg-[#0b1120] border border-[#FFBA00]/50 group-hover:bg-[#FFBA00]/60"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Bottom status bar — solid, with a real progress bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#04070d]/95 border-t border-white/10 backdrop-blur-md">
        <div className="h-1 w-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full"
            style={{ width: "0%", background: "linear-gradient(90deg, #B46617, #FFBA00)" }}
          />
        </div>
        <div className="px-3 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between text-[11px] sm:text-xs font-mono text-white/80">
          <span className="flex items-center gap-2 min-w-0 mr-2">
            {/* Emerald survives here only: the system/live mark. */}
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse shrink-0" />
            <span className="text-white/50 hidden xs:inline">CURRENT CHAPTER: </span>
            <strong className="text-white truncate">{CHAPTERS[activeChapter]?.title}</strong>
          </span>
          <span className="shrink-0 text-[10px] sm:text-xs">
            <span className="sm:hidden font-bold text-[#FFBA00]">{activeChapter + 1}/{CHAPTER_COUNT}</span>
            <span className="hidden sm:inline">
              {activeChapter + 1} / {CHAPTER_COUNT} — scroll for the next detail
            </span>
          </span>
        </div>
      </footer>

      {/*
        FIXED viewport: exactly ONE chapter visible at a time.
        (Was `sticky top-0` — but `overflow-x-hidden` on <main> made <main>
        the scroll container, so the sticky viewport never stuck and the
        whole chapter layer scrolled away with the page. Fixed positioning
        is immune to that. pointer-events-none here; each chapter re-enables
        its own pointer events when visible, so invisible chapters never
        block clicks.)
      */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none pt-14 pb-12 sm:pt-16 sm:pb-14">
        <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          {chapterBody.map((body, i) => (
            <div
              key={CHAPTERS[i].id}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              /* No transition class here — opacity is driven per-frame by rAF. */
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 sm:p-4"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <div className="chapter-panel">{body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading state: only until the video can play, not 238 images */}
      {!videoReady && !videoMissing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] p-6">
          <div className="text-4xl sm:text-6xl font-black tracking-tighter text-white font-mono">
            BYTEON<span className="text-[#FFBA00]">.2026</span>
          </div>
          <p className="mt-3 text-sm font-mono text-white/70">
            Loading the Byteon film…
          </p>
        </div>
      )}
    </div>
  );
}

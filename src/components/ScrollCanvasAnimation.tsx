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
  Award,
  Trophy,
  Calendar,
  MapPin,
  Bug,
  Code2,
  Phone,
  Mail,
  QrCode,
  Image as ImageIcon,
  CheckCircle2,
  Check,
  Sparkles,
  Clock,
} from "lucide-react";

interface ScrollCanvasAnimationProps {
  onRegisterClick: () => void;
  onPosterClick: () => void;
}

const CHAPTER_COUNT = 8;

const CHAPTERS = [
  { id: "hero", title: "01 // Initiation" },
  { id: "about", title: "02 // Fest & Venue" },
  { id: "rounds", title: "03 // Rounds & Rules" },
  { id: "prizes", title: "04 // Prizes ₹9,000" },
  { id: "schedule", title: "05 // Event Timeline" },
  { id: "sponsors", title: "06 // Official Sponsors" },
  { id: "coordinators", title: "07 // Helpdesk" },
  { id: "register", title: "08 // Registration & QR" },
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

        // One chapter visible at a time: fade in 0–18%, hold, fade out 82–100%.
        chapterRefs.current.forEach((el, i) => {
          if (!el) return;
          const [start, end] = chapterRange(i);
          const local = (p - start) / (end - start); // 0..1 inside this chapter
          let opacity = 0;
          if (local >= 0 && local <= 1) {
            // First chapter: visible on landing (no fade-in from nothing).
            // Last chapter: stays visible at the bottom (no fade-out).
            if (local < 0.18) opacity = i === 0 ? 1 : local / 0.18;
            else if (local > 0.82) opacity = i === CHAPTER_COUNT - 1 ? 1 : (1 - local) / 0.18;
            else opacity = 1;
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
    window.scrollTo({
      top: track.offsetTop + (index / CHAPTER_COUNT) * maxScroll,
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
      <h1 className="hero-title">BYTEON</h1>
      <p className="mt-3 text-xl sm:text-3xl font-mono font-bold tracking-wider text-[#FFBA00]">
        CODING CHALLENGE <span className="date-pill">27 JAN</span>
      </p>
      <p className="body-text mt-4 max-w-lg">
        One screen, one scroll, one event. Keep scrolling — each detail of
        the contest appears on its own screen.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
        <span className="fact-pill">₹9,000 Total Prize Pool</span>
        <span className="fact-pill">Jamia Hamdard Kannur Campus</span>
        <span className="fact-pill">27–28 January 2026</span>
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm font-mono text-white animate-bounce">
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
      <h2 className="chapter-title">
        WHERE LOGIC MEETS
        <span className="accent-text"> RAW COMPUTING POWER</span>
      </h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-left">
        <div className="mini-card">
          <span className="mini-label">// FEST</span>
          <h3 className="mini-heading">ZYPHERIX &apos;26</h3>
          <p className="mini-text">
            National Level IT Fest spanning 27 &amp; 28 January 2026.
          </p>
        </div>
        <div className="mini-card mini-card--hot">
          <span className="mini-label">// EVENT</span>
          <h3 className="mini-heading">BYTEON CODING</h3>
          <p className="mini-text">
            The coding contest of the fest — held on 27 January 2026.
          </p>
        </div>
        <div className="mini-card">
          <span className="mini-label">// VENUE</span>
          <h3 className="mini-heading">JAMIA HAMDARD</h3>
          <p className="mini-text">Kannur Campus, Kerala.</p>
        </div>
      </div>
    </>,

    /* 3 — ROUNDS & RULES (UNVERIFIED — not on the poster) */
    <>
      <div className="chip">
        <Code2 className="w-4 h-4 text-[#FFBA00]" />
        Chapter 03 // Competition Structure
      </div>
      <h2 className="chapter-title">TWO ROUNDS</h2>
      <p className="verify-note">
        Details below are from the previous draft, not the poster — confirm
        with the organisers before publishing.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl text-left">
        <div className="mini-card">
          <div className="flex items-center justify-between">
            <span className="round-tag">ROUND 01</span>
            <span className="flex items-center gap-1 text-sm font-mono text-white">
              <Clock className="w-4 h-4 text-[#FFBA00]" /> 45 Minutes
            </span>
          </div>
          <h3 className="mini-heading mt-3 flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#FFBA00]" /> Syntax Hunt &amp;
            Debugging
          </h3>
          <p className="mini-text">
            Find the flaws, fix broken snippets, predict the output — against
            the clock. Top scorers advance.
          </p>
        </div>
        <div className="mini-card">
          <div className="flex items-center justify-between">
            <span className="round-tag round-tag--bronze">ROUND 02</span>
            <span className="flex items-center gap-1 text-sm font-mono text-white">
              <Clock className="w-4 h-4 text-[#E8A85C]" /> 90 Minutes
            </span>
          </div>
          <h3 className="mini-heading mt-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#E8A85C]" /> The Algorithmic
            Arena
          </h3>
          <p className="mini-text">
            Solve algorithmic challenges with optimal time and space
            complexity. Automated test-case evaluation, live ranking.
          </p>
        </div>
      </div>
      <div className="fact-pill mt-5">
        LANGUAGES: <strong className="text-white">C • C++ • Python • Java • JavaScript</strong>
      </div>
    </>,

    /* 4 — PRIZES */
    <>
      <div className="chip">
        <Trophy className="w-4 h-4 text-[#FFBA00]" />
        Chapter 04 // Prizes
      </div>
      <h2 className="chapter-title">
        TOTAL POOL <span className="accent-text">₹9,000/-</span>
      </h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl text-left">
        <div className="prize-card prize-card--first">
          <span className="prize-badge">CHAMPION</span>
          <span className="mini-label">First Prize</span>
          <div className="prize-amount">
            ₹6,000<span className="text-2xl text-[#FFBA00]">/-</span>
          </div>
          <ul className="prize-list">
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00]" /> ₹6,000 cash prize</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00]" /> Winner trophy &amp; shield</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#FFBA00]" /> Certificate of excellence</li>
          </ul>
        </div>
        <div className="prize-card prize-card--second">
          <span className="prize-badge prize-badge--amber">RUNNER-UP</span>
          <span className="mini-label">Second Prize</span>
          <div className="prize-amount">
            ₹3,000<span className="text-2xl text-[#E8A85C]">/-</span>
          </div>
          <ul className="prize-list">
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C]" /> ₹3,000 cash prize</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C]" /> Runner-up trophy</li>
            <li><CheckCircle2 className="w-4 h-4 text-[#E8A85C]" /> Certificate of merit</li>
          </ul>
        </div>
      </div>
    </>,

    /* 5 — SCHEDULE (UNVERIFIED — not on the poster) */
    <>
      <div className="chip">
        <Calendar className="w-4 h-4 text-[#FFBA00]" />
        Chapter 05 // Day Schedule — 27 Jan
      </div>
      <h2 className="chapter-title">TIMELINE OF THE ARENA</h2>
      <p className="verify-note">
        Timings below are from the previous draft, not the poster — confirm
        with the organisers before publishing.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl text-left">
        {[
          { time: "09:00 AM", title: "Reporting & Check-in", desc: "Badge collection at the Jamia Hamdard desk." },
          { time: "10:00 AM", title: "Inaugural & Rules Brief", desc: "Coordinators present the guidelines." },
          { time: "10:30 AM", title: "Round 1: Rapid Debug", desc: "45-minute bug hunt & output prediction." },
          { time: "01:00 PM", title: "Lunch & Networking", desc: "Lunch and sponsor booths." },
          { time: "02:00 PM", title: "Round 2: Algorithmic Duel", desc: "Qualifiers compete on live problem sets." },
          { time: "04:30 PM", title: "Grand Valedictory", desc: "₹6,000 & ₹3,000 prizes presented." },
        ].map((ev) => (
          <div key={ev.time} className="mini-card">
            <span className="font-mono text-sm font-bold text-[#FFBA00]">{ev.time}</span>
            <h4 className="font-mono text-base font-bold text-white mt-1">{ev.title}</h4>
            <p className="mini-text">{ev.desc}</p>
          </div>
        ))}
      </div>
    </>,

    /* 6 — SPONSORS */
    <>
      <div className="chip">
        <Cpu className="w-4 h-4 text-[#FFBA00]" />
        Chapter 06 // Corporate Backing
      </div>
      <h2 className="chapter-title">OFFICIAL SPONSORS</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl text-center">
        <div className="sponsor-card">
          <span className="text-3xl font-black text-white font-mono tracking-tight">upcode.</span>
          <span className="mini-label mt-1">SOFTWARE LABS</span>
          <p className="mini-text mt-3">Official Technical Partner</p>
        </div>
        <div className="sponsor-card">
          <span className="text-3xl font-black text-white font-mono tracking-wider">INFOMAC</span>
          <span className="mini-label mt-1">SYSTEMS</span>
          <p className="mini-text mt-3">Official Infrastructure Partner</p>
        </div>
      </div>
    </>,

    /* 7 — COORDINATORS */
    <>
      <div className="chip">
        <Phone className="w-4 h-4 text-[#FFBA00]" />
        Chapter 07 // Student Coordinators
      </div>
      <h2 className="chapter-title">GET IN TOUCH</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl text-left">
        {[
          { name: "Khalid Adeel", phone: "+91 8590090507", tel: "+918590090507", wa: "918590090507" },
          { name: "Nihma Parveen", phone: "+91 8137831382", tel: "+918137831382", wa: "918137831382" },
        ].map((c) => (
          <div key={c.phone} className="mini-card">
            <span className="mini-label">Student Coordinator</span>
            <h3 className="text-2xl font-black text-white font-mono mt-1">{c.name}</h3>
            <p className="text-xl font-mono font-bold text-[#FFBA00] mt-1">{c.phone}</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
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
      <div className="fact-pill mt-5">
        <Mail className="w-4 h-4 text-[#FFBA00]" />
        Official mail: <strong className="text-white">zypherix2026@gmail.com</strong>
      </div>
    </>,

    /* 8 — REGISTER */
    <>
      <div className="register-panel">
        <div className="qr-box">
          {/* Keep the QR at near-native size (source is 150px) — upscaling it blurs the code. */}
          <img src="/qr-code.png" alt="Registration QR code" width={150} height={150} />
          <span className="mt-2 text-[11px] font-mono font-bold text-black uppercase tracking-wider">
            Scan to register
          </span>
        </div>
        <div className="text-center md:text-left">
          <div className="chip">
            <Sparkles className="w-4 h-4 text-[#FFBA00]" />
            Final Chapter // Lock Your Slot
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mt-3">
            REGISTER FOR BYTEON
          </h3>
          <p className="body-text mt-3">
            Compete for ₹9,000/- on 27 January 2026 at Jamia Hamdard Kannur
            Campus. Scan the code or open the form below.
          </p>
          <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <button onClick={onRegisterClick} className="cta-primary">
              <QrCode className="w-4 h-4" /> OPEN REGISTRATION FORM
            </button>
            <button onClick={onPosterClick} className="cta-secondary">
              <ImageIcon className="w-4 h-4 text-[#FFBA00]" /> VIEW POSTER
            </button>
          </div>
          <p className="text-xs font-mono text-white/70 pt-3">
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
    <div ref={trackRef} className="relative w-full h-[800vh] bg-[#050811]">
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
      <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between bg-[#04070d]/95 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFBA00]/15 border border-[#FFBA00]/40 flex items-center justify-center text-[#FFBA00]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono font-black text-white text-base tracking-wider">
              BYTEON <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFBA00]/15 text-[#FFBA00] border border-white/15 font-bold">2026</span>
            </span>
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/70 -mt-0.5">
              Zypherix National IT Fest • 27, 28 Jan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onPosterClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/20 text-white text-xs font-mono"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#FFBA00]" /> Event Poster
          </button>
          <button onClick={onRegisterClick} className="cta-primary !px-4 !py-2">
            <QrCode className="w-3.5 h-3.5" /> REGISTER NOW
          </button>
        </div>
      </header>

      {/* Chapter dots */}
      <nav
        aria-label="Chapter timeline"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 p-2.5 rounded-2xl bg-black/85 border border-white/20"
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
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#04070d]/95 border-t border-white/10">
        <div className="h-1 w-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full"
            style={{ width: "0%", background: "linear-gradient(90deg, #B46617, #FFBA00)" }}
          />
        </div>
        <div className="px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-mono text-white/80">
          <span className="flex items-center gap-2">
            {/* Emerald survives here only: the system/live mark. */}
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-white/50">CURRENT CHAPTER: </span>
            <strong className="text-white">{CHAPTERS[activeChapter]?.title}</strong>
          </span>
          <span className="hidden sm:inline">
            {activeChapter + 1} / {CHAPTER_COUNT} — scroll for the next detail
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
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          {chapterBody.map((body, i) => (
            <div
              key={CHAPTERS[i].id}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              /* No transition class here — opacity is driven per-frame by rAF. */
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
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

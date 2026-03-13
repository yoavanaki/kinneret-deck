"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";
import { themes } from "@/lib/themes";
import Slide from "@/components/Slide";

export default function ViewPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = use(params);
  const [email, setEmail] = useState(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )viewer_email=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
    return "";
  });
  const [verified, setVerified] = useState(() => {
    if (typeof document !== "undefined") {
      return !!document.cookie.match(/(?:^|; )viewer_email=([^;]*)/);
    }
    return false;
  });
  const [linkStatus, setLinkStatus] = useState<"loading" | "ok" | "disabled">("loading");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [themeId, setThemeId] = useState("aipac-light");
  const [slideData, setSlideData] = useState(initialSlides);
  const slideStartTime = useRef<number>(Date.now());
  const currentSlideRef = useRef(currentSlide);

  const theme = themes[themeId];
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideScale, setSlideScale] = useState(1);

  // Calculate scale to fit slide in container
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / 960;
    const scaleY = rect.height / 540;
    setSlideScale(Math.min(scaleX, scaleY) * 1.1);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useEffect(() => {
    // Fetch link status + slide snapshot (if any) in parallel with slide content
    Promise.all([
      fetch(`/api/share?id=${linkId}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/slides").then((r) => r.json()),
    ])
      .then(([link, edits]) => {
        if (link?.disabled) {
          setLinkStatus("disabled");
          return;
        }
        setLinkStatus("ok");

        // Build slide content from edits — order comes from slides.ts
        const merged = edits.length > 0 ? applyEdits(initialSlides, edits) : [...initialSlides];
        setSlideData(merged);
      })
      .catch(() => {
        // If the API is unreachable, just show the deck
        setLinkStatus("ok");
      });
  }, [linkId]);

  // Track time on slide changes
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  function trackCurrentSlide() {
    if (!verified) return;
    const duration = (Date.now() - slideStartTime.current) / 1000;
    const slideId = slideData[currentSlideRef.current]?.id;
    // Cap at 5 minutes – longer durations are idle tabs, not real viewing
    const cappedDuration = Math.min(duration, 300);
    if (cappedDuration > 0.5 && slideId) {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId,
          email,
          slideId,
          duration: Math.round(cappedDuration * 10) / 10,
        }),
      }).catch(() => {});
    }
    // Reset timer so subsequent fires (e.g. cleanup + beforeunload) don't double-count
    slideStartTime.current = Date.now();
  }

  function goToSlide(index: number) {
    trackCurrentSlide();
    setCurrentSlide(index);
    slideStartTime.current = Date.now();
  }

  // Track on unmount / tab close
  useEffect(() => {
    const handler = () => trackCurrentSlide();
    window.addEventListener("beforeunload", handler);
    return () => {
      handler();
      window.removeEventListener("beforeunload", handler);
    };
  }, [verified, email]);

  // Keyboard navigation (must be before conditional returns to respect Rules of Hooks)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!verified) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          if (prev > 0) {
            trackCurrentSlide();
            slideStartTime.current = Date.now();
            return prev - 1;
          }
          return prev;
        });
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          if (prev < slideData.length - 1) {
            trackCurrentSlide();
            slideStartTime.current = Date.now();
            return prev + 1;
          }
          return prev;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slideData.length, verified, email]);

  function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@") && email.includes(".")) {
      document.cookie = `viewer_email=${encodeURIComponent(email)}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
      setVerified(true);
      slideStartTime.current = Date.now();
    }
  }

  // Loading state
  if (linkStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Disabled link
  if (linkStatus === "disabled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No longer available</h1>
          <p className="text-gray-500">This presentation has been disabled by its owner.</p>
        </div>
      </div>
    );
  }

  // Email gate
  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cognitory Deck</h1>
          <p className="text-gray-500 mb-6">Enter your email to view this presentation.</p>
          <form onSubmit={handleSubmitEmail}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              View Presentation
            </button>
          </form>
        </div>
      </div>
    );
  }

  const slide = slideData[currentSlide];

  const isDark = themeId === "aipac";

  // Presentation viewer
  return (
    <div className={`h-screen flex flex-col overflow-hidden relative ${isDark ? "bg-gray-900" : "bg-[#f0edea]"}`}>
      {/* Theme toggle */}
      <button
        onClick={() => setThemeId(isDark ? "aipac-light" : "aipac")}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isDark
            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
            : "bg-white/80 hover:bg-white text-gray-600 shadow-sm"
        }`}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 pt-2 pb-1 min-h-0">
        <div ref={containerRef} className="flex-1 w-full flex items-center justify-center min-h-0">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 960 * slideScale, height: 540 * slideScale }}>
            <Slide slide={slide} theme={theme} scale={slideScale} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-1.5 mb-3 shrink-0">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className={`px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 ${
              isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white/80 text-gray-600 hover:bg-white shadow-sm"
            }`}
          >
            ←
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-1">
            <span className={`text-[10px] mr-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{currentSlide + 1}/{slideData.length}</span>
            {slideData.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-blue-500 w-3"
                    : isDark
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goToSlide(Math.min(slideData.length - 1, currentSlide + 1))}
            disabled={currentSlide === slideData.length - 1}
            className={`px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 ${
              isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white/80 text-gray-600 hover:bg-white shadow-sm"
            }`}
          >
            →
          </button>
        </div>

      </div>
    </div>
  );
}

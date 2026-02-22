"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";
import { themes } from "@/lib/themes";
import Slide from "@/components/Slide";

export default function ViewPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = use(params);
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [linkStatus, setLinkStatus] = useState<"loading" | "ok" | "disabled">("loading");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [themeId, setThemeId] = useState("minimal");
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
    setSlideScale(Math.min(scaleX, scaleY));
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

        // Build slide content from edits
        let merged = edits.length > 0 ? applyEdits(initialSlides, edits) : [...initialSlides];

        // Use link's snapshot slide_ids if available; otherwise fetch global order
        if (link?.slide_ids && Array.isArray(link.slide_ids) && link.slide_ids.length > 0) {
          const slideMap = new Map(merged.map((s) => [s.id, s]));
          const ordered: typeof merged = [];
          for (const id of link.slide_ids) {
            const slide = slideMap.get(id);
            if (slide) ordered.push(slide);
          }
          setSlideData(ordered);
        } else {
          // Fallback: use global slide order
          fetch("/api/slide-order")
            .then((r) => r.json())
            .then((order) => {
              if (order && Array.isArray(order.slide_ids) && order.slide_ids.length > 0) {
                const slideMap = new Map(merged.map((s) => [s.id, s]));
                const ordered: typeof merged = [];
                for (const id of order.slide_ids) {
                  const slide = slideMap.get(id);
                  if (slide) { ordered.push(slide); slideMap.delete(id); }
                }
                slideMap.forEach((s) => ordered.push(s));
                merged = ordered;

                const gyIdx = typeof order.graveyard_index === "number" ? order.graveyard_index : -1;
                if (gyIdx >= 0 && gyIdx < merged.length) {
                  merged = merged.slice(0, gyIdx);
                }
              }
              setSlideData(merged);
            })
            .catch(() => setSlideData(merged));
        }
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
    if (duration > 0.5 && slideId) {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId,
          email,
          slideId,
          duration: Math.round(duration * 10) / 10,
        }),
      }).catch(() => {});
    }
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

  function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@") && email.includes(".")) {
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

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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

  const slide = slideData[currentSlide];

  // Presentation viewer
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shrink-0">
        <span className="text-sm font-medium">Cognitory Deck</span>
        <span className="text-sm text-gray-400">
          {currentSlide + 1} / {slideData.length}
        </span>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        <div ref={containerRef} className="flex-1 w-full flex items-center justify-center min-h-0">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 960 * slideScale, height: 540 * slideScale }}>
            <Slide slide={slide} theme={theme} scale={slideScale} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-3 shrink-0">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600"
          >
            ← Previous
          </button>

          {/* Slide dots */}
          <div className="flex gap-1">
            {slideData.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide ? "bg-blue-500 w-4" : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goToSlide(Math.min(slideData.length - 1, currentSlide + 1))}
            disabled={currentSlide === slideData.length - 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}

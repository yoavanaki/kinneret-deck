"use client";

import { useState, useEffect, useRef, use } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";
import { themes } from "@/lib/themes";
import Slide from "@/components/Slide";

export default function ViewPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = use(params);
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [themeId, setThemeId] = useState("minimal");
  const [slideData, setSlideData] = useState(initialSlides);
  const slideStartTime = useRef<number>(Date.now());
  const currentSlideRef = useRef(currentSlide);

  const theme = themes[themeId];

  // Validate the link exists + fetch slide edits
  useEffect(() => {
    fetch(`/api/share?id=${linkId}`)
      .then((r) => {
        if (r.ok) setValid(true);
        else setValid(false);
      })
      .catch(() => setValid(false));

    fetch("/api/slides")
      .then((r) => r.json())
      .then((edits) => {
        if (edits.length > 0) {
          setSlideData(applyEdits(initialSlides, edits));
        }
      })
      .catch(() => {});
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
  if (valid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Invalid link
  if (valid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link not found</h1>
          <p className="text-gray-500">This share link is invalid or has been refreshed.</p>
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

  // Presentation viewer
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <span className="text-sm font-medium">Cognitory Deck</span>
        <span className="text-sm text-gray-400">
          {currentSlide + 1} / {slideData.length}
        </span>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 960, height: 540 }}>
          <Slide slide={slide} theme={theme} />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600"
          >
            Previous
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
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

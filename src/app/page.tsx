"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { slides as initialSlides, SlideContent } from "@/lib/slides";
import { themes } from "@/lib/themes";
import Slide from "@/components/Slide";
import Comments from "@/components/Comments";
import ThemePicker from "@/components/ThemePicker";

export default function Home() {
  const [themeId, setThemeId] = useState("minimal");
  const [slideData, setSlideData] = useState<SlideContent[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [slideScale, setSlideScale] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const theme = themes[themeId];

  // Dynamically scale slide to fill available space
  const SLIDE_W = 960;
  const SLIDE_H = 540;
  const PAD = 48; // padding around the slide

  const updateScale = useCallback(() => {
    const el = slideContainerRef.current;
    if (!el) return;
    const availW = el.clientWidth - PAD * 2;
    const availH = el.clientHeight - PAD * 2;
    const scale = Math.min(availW / SLIDE_W, availH / SLIDE_H, 1.6);
    setSlideScale(Math.max(scale, 0.4));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  // Arrow key navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't navigate if user is editing text
      const tag = (e.target as HTMLElement).tagName;
      if ((e.target as HTMLElement).isContentEditable || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, initialSlides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load saved state from localStorage (version-gated to avoid stale data)
  useEffect(() => {
    const SLIDES_VERSION = "v11";
    const savedTheme = localStorage.getItem("cognitory-theme");
    if (savedTheme && themes[savedTheme]) setThemeId(savedTheme);

    const savedVersion = localStorage.getItem("cognitory-slides-version");
    if (savedVersion === SLIDES_VERSION) {
      const savedSlides = localStorage.getItem("cognitory-slides");
      if (savedSlides) {
        try { setSlideData(JSON.parse(savedSlides)); } catch {}
      }
    } else {
      localStorage.setItem("cognitory-slides-version", SLIDES_VERSION);
      localStorage.removeItem("cognitory-slides");
    }

    const savedLinkId = localStorage.getItem("cognitory-link-id");
    if (savedLinkId) {
      setShareLinkId(savedLinkId);
      setShareLink(`${window.location.origin}/view/${savedLinkId}`);
    }

    setHydrated(true);
  }, []);

  // Save to localStorage on changes (only after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cognitory-theme", themeId);
  }, [themeId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cognitory-slides", JSON.stringify(slideData));
  }, [slideData, hydrated]);

  // Fetch comment counts for all slides
  function refreshCommentCounts() {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((allComments: { slide_id: string }[]) => {
        const counts: Record<string, number> = {};
        allComments.forEach((c) => {
          counts[c.slide_id] = (counts[c.slide_id] || 0) + 1;
        });
        setCommentCounts(counts);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshCommentCounts();
  }, []);

  function handleSlideUpdate(slideId: string, field: string, value: string) {
    setSlideData((prev) =>
      prev.map((s) => {
        if (s.id !== slideId) return s;
        const parts = field.split(".");

        // Simple top-level field (title, subtitle, body, note, leftText, rightText)
        if (parts.length === 1) {
          return { ...s, [field]: value };
        }

        // Nested updates — clone and set value at path
        const updated = JSON.parse(JSON.stringify(s));
        let target: any = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = /^\d+$/.test(parts[i]) ? parseInt(parts[i]) : parts[i];
          target = target[key];
        }
        const lastKey = /^\d+$/.test(parts[parts.length - 1])
          ? parseInt(parts[parts.length - 1])
          : parts[parts.length - 1];
        target[lastKey] = value;
        return updated;
      })
    );
  }

  async function generateLink() {
    // If we already have a link, just show it (stable URL)
    if (shareLinkId) {
      setShareLink(`${window.location.origin}/view/${shareLinkId}`);
      return;
    }

    const id = crypto.randomUUID().slice(0, 8);
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setShareLinkId(id);
    localStorage.setItem("cognitory-link-id", id);
    setShareLink(`${window.location.origin}/view/${id}`);
  }

  async function refreshLink() {
    const id = crypto.randomUUID().slice(0, 8);
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setShareLinkId(id);
    localStorage.setItem("cognitory-link-id", id);
    setShareLink(`${window.location.origin}/view/${id}`);
    setCopied(false);
  }

  function copyLink() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const slide = slideData[currentSlide];

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Theme Picker */}
      <ThemePicker currentTheme={themeId} onSelect={setThemeId} />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Cognitory Deck</h1>
          <span className="text-sm text-gray-500">
            Slide {currentSlide + 1} of {slideData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard"
            className="px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </a>

          {!shareLink ? (
            <button
              onClick={generateLink}
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Generate Share Link
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate">
                {shareLink}
              </code>
              <button
                onClick={copyLink}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={refreshLink}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                title="Generate a new URL (old link stops working)"
              >
                Refresh Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Slide Thumbnails */}
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-2 space-y-2">
          {slideData.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(i)}
              className={`w-full text-left rounded-lg overflow-hidden border-2 transition-all ${
                i === currentSlide ? "border-blue-500 shadow-md" : "border-transparent hover:border-gray-300"
              }`}
            >
              <div className="relative" style={{ width: "100%", paddingBottom: "56.25%" }}>
                <div className="absolute inset-0 overflow-hidden">
                  <Slide slide={s} theme={theme} scale={0.18} />
                </div>
                {commentCounts[s.id] > 0 && (
                  <div className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {commentCounts[s.id]}
                  </div>
                )}
              </div>
              <div className="px-2 py-1 text-xs text-gray-500 truncate">
                {i + 1}. {s.title.slice(0, 30)}
              </div>
            </button>
          ))}
        </div>

        {/* Main Slide View */}
        <div ref={slideContainerRef} className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
          {/* Scaled slide wrapper */}
          <div
            className="shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: SLIDE_W * slideScale,
              height: SLIDE_H * slideScale,
              flexShrink: 0,
            }}
          >
            <Slide
              slide={slide}
              theme={theme}
              editable={true}
              onUpdate={handleSlideUpdate}
              scale={slideScale}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-4 flex-shrink-0">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {currentSlide + 1} / {slideData.length}
            </span>
            <button
              onClick={() => setCurrentSlide(Math.min(slideData.length - 1, currentSlide + 1))}
              disabled={currentSlide === slideData.length - 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Comments Panel - always visible on the right */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <Comments
            slideId={slide.id}
            theme="light"
            onCommentPosted={refreshCommentCounts}
          />
        </div>
      </div>
    </div>
  );
}

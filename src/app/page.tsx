"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { slides as initialSlides, SlideContent, applyEdits } from "@/lib/slides";
import { themes } from "@/lib/themes";
import Slide from "@/components/Slide";
import ThemePicker from "@/components/ThemePicker";
import AdminAuth from "@/components/AdminAuth";

export default function Home() {
  const [themeId, setThemeId] = useState("aipac");
  const [slideData, setSlideData] = useState<SlideContent[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [slideScale, setSlideScale] = useState(1);
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
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slideData.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load slide edits from server + local preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("cognitory-theme");
    if (savedTheme && themes[savedTheme]) setThemeId(savedTheme);

    const savedLinkId = localStorage.getItem("cognitory-link-id");
    if (savedLinkId) {
      setShareLinkId(savedLinkId);
      setShareLink(`${window.location.origin}/view/${savedLinkId}`);
    }

    // Fetch server-stored edits
    fetch("/api/slides")
      .then((r) => r.json())
      .then((edits) => {
        const merged = edits.length > 0 ? applyEdits(initialSlides, edits) : initialSlides;
        setSlideData(merged);
      })
      .catch(() => {});
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("cognitory-theme", themeId);
  }, [themeId]);

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
      body: JSON.stringify({ id, slide_ids: slideData.map((s) => s.id) }),
    });

    setShareLinkId(id);
    localStorage.setItem("cognitory-link-id", id);
    setShareLink(`${window.location.origin}/view/${id}`);
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
    <AdminAuth>
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
            href="/links"
            className="px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Links
          </a>
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
              Generate Link
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
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Slide Thumbnails */}
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-2 space-y-1 flex flex-col">
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
              </div>
              <div className="px-2 py-1 text-xs truncate text-gray-500">
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
      </div>
    </div>
    </AdminAuth>
  );
}

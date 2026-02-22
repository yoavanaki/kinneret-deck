"use client";

import { useState, useEffect, useRef } from "react";
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
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = themes[themeId];

  // Load saved state from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("kinneret-theme");
    if (savedTheme && themes[savedTheme]) setThemeId(savedTheme);

    const savedSlides = localStorage.getItem("kinneret-slides");
    if (savedSlides) {
      try { setSlideData(JSON.parse(savedSlides)); } catch {}
    }

    const savedLinkId = localStorage.getItem("kinneret-link-id");
    if (savedLinkId) {
      setShareLinkId(savedLinkId);
      setShareLink(`${window.location.origin}/view/${savedLinkId}`);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("kinneret-theme", themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem("kinneret-slides", JSON.stringify(slideData));
  }, [slideData]);

  function handleSlideUpdate(slideId: string, field: string, value: string) {
    setSlideData((prev) =>
      prev.map((s) => {
        if (s.id !== slideId) return s;
        // Handle nested bullet updates like "bullets.0"
        if (field.startsWith("bullets.")) {
          const idx = parseInt(field.split(".")[1]);
          const newBullets = [...(s.bullets || [])];
          newBullets[idx] = value;
          return { ...s, bullets: newBullets };
        }
        return { ...s, [field]: value };
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
    localStorage.setItem("kinneret-link-id", id);
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
    localStorage.setItem("kinneret-link-id", id);
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Theme Picker */}
      <ThemePicker currentTheme={themeId} onSelect={setThemeId} />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Kinneret Deck</h1>
          <span className="text-sm text-gray-500">
            Slide {currentSlide + 1} of {slideData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`px-3 py-1.5 rounded text-sm ${
              showComments ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Comments
          </button>

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
      <div className="flex-1 flex">
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
              </div>
              <div className="px-2 py-1 text-xs text-gray-500 truncate">
                {i + 1}. {s.title.slice(0, 30)}
              </div>
            </button>
          ))}
        </div>

        {/* Main Slide View */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
          <div className="shadow-2xl rounded-lg overflow-hidden" style={{ width: 960, height: 540 }}>
            <Slide
              slide={slide}
              theme={theme}
              editable={true}
              onUpdate={handleSlideUpdate}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-6">
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

          {/* Comments Panel */}
          {showComments && (
            <div className="w-full max-w-[960px] mt-4">
              <Comments
                slideId={slide.id}
                theme={themeId === "dark" ? "dark" : "light"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

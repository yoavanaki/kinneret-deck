"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { slides as initialSlides, SlideContent, applyEdits } from "@/lib/slides";
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
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingEditsRef = useRef<Map<string, { slideId: string; field: string; value: string }>>(new Map());

  // Slide ordering & graveyard
  const [graveyardIndex, setGraveyardIndex] = useState(-1); // -1 = no graveyard
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const orderSaveTimerRef = useRef<ReturnType<typeof setTimeout>>();

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
        setCurrentSlide((prev) => Math.min(prev + 1, slideData.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Save slide order to server (debounced)
  function persistOrder(slides: SlideContent[], gyIndex: number) {
    clearTimeout(orderSaveTimerRef.current);
    orderSaveTimerRef.current = setTimeout(() => {
      fetch("/api/slide-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideIds: slides.map((s) => s.id),
          graveyardIndex: gyIndex,
        }),
      }).catch(() => {});
    }, 300);
  }

  // Load slide edits from server + local preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("cognitory-theme");
    if (savedTheme && themes[savedTheme]) setThemeId(savedTheme);

    const savedLinkId = localStorage.getItem("cognitory-link-id");
    if (savedLinkId) {
      setShareLinkId(savedLinkId);
      setShareLink(`${window.location.origin}/view/${savedLinkId}`);
    }

    // Fetch server-stored edits and slide order
    Promise.all([
      fetch("/api/slides").then((r) => r.json()),
      fetch("/api/slide-order").then((r) => r.json()),
    ])
      .then(([edits, order]) => {
        let merged = edits.length > 0 ? applyEdits(initialSlides, edits) : initialSlides;

        // Apply saved order if it exists
        if (order && Array.isArray(order.slide_ids) && order.slide_ids.length > 0) {
          const slideMap = new Map(merged.map((s) => [s.id, s]));
          const ordered: SlideContent[] = [];
          for (const id of order.slide_ids) {
            const slide = slideMap.get(id);
            if (slide) {
              ordered.push(slide);
              slideMap.delete(id);
            }
          }
          // Insert any new slides (not in saved order) at their original position
          if (slideMap.size > 0) {
            const originalIds = merged.map((s) => s.id);
            slideMap.forEach((s) => {
              const origIdx = originalIds.indexOf(s.id);
              let insertAt = ordered.length;
              for (let j = origIdx - 1; j >= 0; j--) {
                const prevIdx = ordered.findIndex((o) => o.id === originalIds[j]);
                if (prevIdx !== -1) {
                  insertAt = prevIdx + 1;
                  break;
                }
              }
              ordered.splice(insertAt, 0, s);
            });
          }
          merged = ordered;
          if (typeof order.graveyard_index === "number") {
            setGraveyardIndex(order.graveyard_index);
          }
        }

        setSlideData(merged);
      })
      .catch(() => {});
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("cognitory-theme", themeId);
  }, [themeId]);

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

    // Accumulate edit (keyed by slideId+field so latest value wins)
    pendingEditsRef.current.set(`${slideId}::${field}`, { slideId, field, value });

    // Debounced flush — sends ALL pending edits in one batch
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const edits = Array.from(pendingEditsRef.current.values());
      pendingEditsRef.current.clear();
      if (edits.length === 0) return;
      fetch("/api/slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits }),
      }).catch(() => {});
    }, 500);
  }

  function activeSlideIds() {
    return graveyardIndex >= 0
      ? slideData.slice(0, graveyardIndex).map((s) => s.id)
      : slideData.map((s) => s.id);
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
      body: JSON.stringify({ id, slide_ids: activeSlideIds() }),
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
          <a
            href="/links"
            className="px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Links
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
              <a
                href="/links"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                Manage
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Slide Thumbnails — drag to reorder */}
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-2 space-y-1 flex flex-col">
          {slideData.map((s, i) => {
            const isGraveyard = graveyardIndex >= 0 && i >= graveyardIndex;
            const showDivider = graveyardIndex >= 0 && i === graveyardIndex;

            return (
              <div key={s.id}>
                {showDivider && (
                  <div
                    className="flex items-center gap-1 py-2 px-1 select-none"
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex === null || dragIndex === graveyardIndex) { setDragIndex(null); setDragOverIndex(null); return; }
                      setSlideData((prev) => {
                        const next = [...prev];
                        const [moved] = next.splice(dragIndex, 1);
                        let newGy = graveyardIndex;
                        if (dragIndex < graveyardIndex) newGy--;
                        next.splice(newGy, 0, moved);
                        setGraveyardIndex(newGy);
                        if (currentSlide === dragIndex) setCurrentSlide(newGy);
                        else if (dragIndex < currentSlide) setCurrentSlide(currentSlide - 1);
                        persistOrder(next, newGy);
                        return next;
                      });
                      setDragIndex(null); setDragOverIndex(null);
                    }}
                  >
                    <div className="flex-1 border-t-2 border-dashed border-red-300" />
                    <span className="text-[10px] font-semibold text-red-400 whitespace-nowrap uppercase tracking-wide">
                      Slide Graveyard
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-red-300" />
                  </div>
                )}

                {dragOverIndex === i && dragIndex !== null && dragIndex !== i && dragIndex !== i - 1 && (
                  <div className="h-0.5 bg-blue-500 rounded-full mx-1 my-0.5" />
                )}

                <button
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                    const ghost = document.createElement("div");
                    ghost.style.cssText = "width:160px;height:20px;background:#3b82f6;border-radius:4px;opacity:0.7;position:absolute;top:-1000px;color:#fff;font-size:11px;padding:2px 8px";
                    ghost.textContent = s.title.slice(0, 25);
                    document.body.appendChild(ghost);
                    e.dataTransfer.setDragImage(ghost, 80, 10);
                    requestAnimationFrame(() => ghost.remove());
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverIndex(i); }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex === null || dragIndex === i) { setDragIndex(null); setDragOverIndex(null); return; }
                    setSlideData((prev) => {
                      const next = [...prev];
                      const [moved] = next.splice(dragIndex, 1);
                      const targetIdx = dragIndex < i ? i - 1 : i;
                      next.splice(targetIdx, 0, moved);

                      let newGy = graveyardIndex;
                      if (graveyardIndex >= 0) {
                        if (dragIndex >= graveyardIndex && targetIdx < graveyardIndex) newGy++;
                        else if (dragIndex < graveyardIndex && targetIdx >= graveyardIndex) newGy--;
                      }
                      setGraveyardIndex(newGy);

                      if (currentSlide === dragIndex) setCurrentSlide(targetIdx);
                      else if (dragIndex < currentSlide && targetIdx >= currentSlide) setCurrentSlide(currentSlide - 1);
                      else if (dragIndex > currentSlide && targetIdx <= currentSlide) setCurrentSlide(currentSlide + 1);

                      persistOrder(next, newGy);
                      return next;
                    });
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-full text-left rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                    dragIndex === i ? "opacity-40 border-blue-300"
                      : i === currentSlide ? "border-blue-500 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  } ${isGraveyard ? "opacity-50" : ""}`}
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
                    {isGraveyard && <div className="absolute inset-0 bg-red-50/40" />}
                  </div>
                  <div className={`px-2 py-1 text-xs truncate ${isGraveyard ? "text-red-400 line-through" : "text-gray-500"}`}>
                    {i + 1}. {s.title.slice(0, 30)}
                  </div>
                </button>
              </div>
            );
          })}

          {/* Graveyard toggle / drop zone at bottom */}
          {graveyardIndex < 0 ? (
            <button
              onClick={() => { const newGy = slideData.length; setGraveyardIndex(newGy); persistOrder(slideData, newGy); }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex === null) return;
                setSlideData((prev) => {
                  const next = [...prev];
                  const [moved] = next.splice(dragIndex, 1);
                  next.push(moved);
                  const newGy = next.length - 1;
                  setGraveyardIndex(newGy);
                  if (currentSlide === dragIndex) setCurrentSlide(next.length - 1);
                  else if (dragIndex < currentSlide) setCurrentSlide(currentSlide - 1);
                  persistOrder(next, newGy);
                  return next;
                });
                setDragIndex(null); setDragOverIndex(null);
              }}
              className="flex items-center gap-1 py-2 px-1 mt-2 group cursor-pointer"
            >
              <div className="flex-1 border-t-2 border-dashed border-gray-200 group-hover:border-red-300 transition-colors" />
              <span className="text-[10px] font-semibold text-gray-300 group-hover:text-red-400 whitespace-nowrap uppercase tracking-wide transition-colors">
                Slide Graveyard
              </span>
              <div className="flex-1 border-t-2 border-dashed border-gray-200 group-hover:border-red-300 transition-colors" />
            </button>
          ) : graveyardIndex >= 0 && (
            <div
              className={`flex items-center gap-1 py-2 px-1 ${graveyardIndex < slideData.length ? "min-h-[32px]" : ""}`}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex === null) return;
                setSlideData((prev) => {
                  const next = [...prev];
                  const [moved] = next.splice(dragIndex, 1);
                  next.push(moved);
                  let newGy = graveyardIndex;
                  if (dragIndex < graveyardIndex) newGy--;
                  setGraveyardIndex(newGy);
                  if (currentSlide === dragIndex) setCurrentSlide(next.length - 1);
                  else if (dragIndex < currentSlide) setCurrentSlide(currentSlide - 1);
                  persistOrder(next, newGy);
                  return next;
                });
                setDragIndex(null); setDragOverIndex(null);
              }}
            >
              {graveyardIndex >= slideData.length && <>
                <div className="flex-1 border-t-2 border-dashed border-red-300" />
                <span className="text-[10px] font-semibold text-red-400 whitespace-nowrap uppercase tracking-wide">
                  Slide Graveyard
                </span>
                <div className="flex-1 border-t-2 border-dashed border-red-300" />
              </>}
            </div>
          )}
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

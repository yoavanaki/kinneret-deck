"use client";

import { useState, useEffect } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";

interface ShareLink {
  id: string;
  created_at: string;
  updated_at?: string;
  disabled?: boolean;
  slide_ids?: string[];
  label?: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // link id being acted on

  // Current active slide IDs (for refresh snapshot)
  const [activeSlideIds, setActiveSlideIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/share")
      .then((r) => r.json())
      .then((data) => {
        setLinks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Load current slide order to know what to snapshot on refresh
    Promise.all([
      fetch("/api/slides").then((r) => r.json()).catch(() => []),
      fetch("/api/slide-order").then((r) => r.json()).catch(() => null),
    ]).then(([edits, order]) => {
      let merged = edits.length > 0 ? applyEdits(initialSlides, edits) : [...initialSlides];
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
        if (gyIdx >= 0) merged = merged.slice(0, gyIdx);
      }
      setActiveSlideIds(merged.map((s) => s.id));
    });
  }, []);

  function viewUrl(id: string) {
    return `${window.location.origin}/view/${id}`;
  }

  function copyUrl(id: string) {
    navigator.clipboard.writeText(viewUrl(id));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function toggleDisable(link: ShareLink) {
    const action = link.disabled ? "enable" : "disable";
    setBusy(link.id);
    // Optimistic update
    setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, disabled: !l.disabled } : l));
    await fetch("/api/share", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, action }),
    }).catch(() => {
      // Revert on failure
      setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, disabled: link.disabled } : l));
    });
    setBusy(null);
  }

  async function refreshSnapshot(link: ShareLink) {
    if (activeSlideIds.length === 0) return;
    setBusy(link.id);
    const now = new Date().toISOString();
    // Optimistic update
    setLinks((prev) =>
      prev.map((l) => l.id === link.id ? { ...l, slide_ids: activeSlideIds, updated_at: now } : l)
    );
    await fetch("/api/share", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, action: "refresh", slide_ids: activeSlideIds }),
    }).catch(() => {});
    setBusy(null);
  }

  function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Share Links</h1>
            <p className="text-sm text-gray-500">
              {links.length} link{links.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Dashboard
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Back to Deck
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {links.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-gray-900 mb-2">No links yet</h2>
            <p className="text-gray-500 mb-4">Generate a share link from the deck editor to get started.</p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Go to Deck Editor
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const url = viewUrl(link.id);
              const isBusy = busy === link.id;
              return (
                <div
                  key={link.id}
                  className={`bg-white rounded-xl border p-5 transition-opacity ${
                    link.disabled ? "border-gray-200 opacity-60" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: URL + dates */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            link.disabled
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {link.disabled ? "Disabled" : "Active"}
                        </span>
                        {link.label && (
                          <span className="text-sm font-medium text-gray-700">{link.label}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded truncate max-w-sm">
                          {url}
                        </code>
                        <button
                          onClick={() => copyUrl(link.id)}
                          className="flex-shrink-0 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          {copied === link.id ? "Copied!" : "Copy"}
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          Open ↗
                        </a>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Created {formatDate(link.created_at)}</span>
                        {link.updated_at && link.updated_at !== link.created_at && (
                          <span>Refreshed {formatDate(link.updated_at)}</span>
                        )}
                        {link.slide_ids && (
                          <span>{link.slide_ids.length} slides snapshotted</span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => refreshSnapshot(link)}
                        disabled={isBusy || activeSlideIds.length === 0}
                        title="Update this link to show the current deck"
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-40"
                      >
                        {isBusy ? "..." : "Refresh Snapshot"}
                      </button>
                      <button
                        onClick={() => toggleDisable(link)}
                        disabled={isBusy}
                        className={`px-3 py-1.5 text-sm rounded-lg disabled:opacity-40 ${
                          link.disabled
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {isBusy ? "..." : link.disabled ? "Enable" : "Disable"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

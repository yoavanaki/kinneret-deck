"use client";

import { useState, useEffect } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";

interface ShareLink {
  id: string;
  created_at: string;
  disabled?: boolean;
  slide_ids?: string[];
}

interface ViewEvent {
  link_id: string;
  email: string;
  slide_id: string;
  duration: number;
  timestamp: string;
}

interface RecipientData {
  email: string;
  totalTime: number;
  slideViews: Record<string, number>;
  lastSeen: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<ViewEvent[]>([]);
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [slideData, setSlideData] = useState(initialSlides);
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then((r) => r.json()).catch(() => []),
      fetch("/api/share").then((r) => r.json()).catch(() => []),
      fetch("/api/slides").then((r) => r.json()).catch(() => []),
      fetch("/api/slide-order").then((r) => r.json()).catch(() => null),
    ]).then(([evts, lnks, edits, order]) => {
      setEvents(Array.isArray(evts) ? evts : []);
      setLinks(Array.isArray(lnks) ? lnks : []);

      // Build slide data
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
      setSlideData(merged);
      setLoading(false);
    });
  }, []);

  // Aggregate analytics by recipient
  const recipients: Record<string, RecipientData> = {};
  for (const e of events) {
    if (!recipients[e.email]) {
      recipients[e.email] = { email: e.email, totalTime: 0, slideViews: {}, lastSeen: e.timestamp };
    }
    const r = recipients[e.email];
    r.totalTime += e.duration;
    r.slideViews[e.slide_id] = (r.slideViews[e.slide_id] || 0) + e.duration;
    if (e.timestamp > r.lastSeen) r.lastSeen = e.timestamp;
  }
  const recipientList = Object.values(recipients).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );

  const activeLinks = links.filter((l) => !l.disabled);
  const totalViewTime = Object.values(recipients).reduce((sum, r) => sum + r.totalTime, 0);

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/links"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Links
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

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-gray-900">{slideData.length}</div>
            <div className="text-sm text-gray-500 mt-1">Active Slides</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-gray-900">{links.length}</div>
            <div className="text-sm text-gray-500 mt-1">
              Share Links ({activeLinks.length} active)
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-gray-900">{recipientList.length}</div>
            <div className="text-sm text-gray-500 mt-1">Unique Viewers</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-gray-900">
              {totalViewTime > 0 ? formatDuration(totalViewTime) : "—"}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total View Time</div>
          </div>
        </div>

        {/* Share links summary */}
        {links.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Share Links
              </h2>
              <a href="/links" className="text-sm text-blue-600 hover:text-blue-700">
                Manage
              </a>
            </div>
            <div className="space-y-2">
              {links.slice(0, 5).map((link) => {
                const linkEvents = events.filter((e) => e.link_id === link.id);
                const uniqueViewers = new Set(linkEvents.map((e) => e.email)).size;
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          link.disabled
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {link.disabled ? "Off" : "On"}
                      </span>
                      <code className="text-sm text-gray-600 truncate">
                        /view/{link.id}
                      </code>
                    </div>
                    <div className="text-sm text-gray-400 flex-shrink-0">
                      {uniqueViewers > 0
                        ? `${uniqueViewers} viewer${uniqueViewers !== 1 ? "s" : ""}`
                        : "No views yet"}
                    </div>
                  </div>
                );
              })}
              {links.length > 5 && (
                <a href="/links" className="block text-sm text-blue-600 hover:text-blue-700 pt-2">
                  View all {links.length} links
                </a>
              )}
            </div>
          </div>
        )}

        {/* Analytics */}
        {recipientList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recipient List */}
            <div className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Viewers
              </h2>
              <div className="space-y-2">
                {recipientList.map((r) => (
                  <button
                    key={r.email}
                    onClick={() => setSelectedRecipient(r.email)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedRecipient === r.email
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{r.email}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDuration(r.totalTime)} &middot;{" "}
                      {Object.keys(r.slideViews).length} slides viewed
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Last seen: {new Date(r.lastSeen).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slide-by-Slide Breakdown */}
            <div className="lg:col-span-2">
              {selectedRecipient ? (
                <>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Slide engagement: {selectedRecipient}
                  </h2>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">#</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Slide</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Time Spent</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slideData.map((slide, i) => {
                          const r = recipients[selectedRecipient];
                          const time = r?.slideViews[slide.id] || 0;
                          const maxTime = Math.max(...Object.values(r?.slideViews || {}), 1);
                          const pct = (time / maxTime) * 100;
                          return (
                            <tr key={slide.id} className="border-b border-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                                {slide.title}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {time > 0 ? formatDuration(time) : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Select a viewer to see slide-by-slide engagement</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">No viewer analytics yet</h2>
            <p className="text-gray-500">
              {links.length > 0
                ? "Share your links and viewer engagement will appear here once someone views the deck."
                : "Create a share link first, then viewer engagement will appear here."}
            </p>
            {links.length === 0 && (
              <a
                href="/links"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Create a Link
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { slides } from "@/lib/slides";

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
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Aggregate data by recipient
  const recipients: Record<string, RecipientData> = {};
  for (const e of events) {
    if (!recipients[e.email]) {
      recipients[e.email] = {
        email: e.email,
        totalTime: 0,
        slideViews: {},
        lastSeen: e.timestamp,
      };
    }
    const r = recipients[e.email];
    r.totalTime += e.duration;
    r.slideViews[e.slide_id] = (r.slideViews[e.slide_id] || 0) + e.duration;
    if (e.timestamp > r.lastSeen) r.lastSeen = e.timestamp;
  }

  const recipientList = Object.values(recipients).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );

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
            <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500">
              {recipientList.length} recipient{recipientList.length !== 1 ? "s" : ""} &middot; {events.length} view events
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Back to Deck
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {recipientList.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-gray-900 mb-2">No views yet</h2>
            <p className="text-gray-500">Share your deck link to start tracking engagement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recipient List */}
            <div className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Recipients
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
                      Total: {formatDuration(r.totalTime)} &middot;{" "}
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
                        {slides.map((slide, i) => {
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
                  <p>Select a recipient to see slide-by-slide engagement</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { slides as initialSlides, applyEdits } from "@/lib/slides";
import AdminAuth from "@/components/AdminAuth";

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
  const [busy, setBusy] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState("");
  const [activeSlideIds, setActiveSlideIds] = useState<string[]>([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetch("/api/share")
      .then((r) => r.json())
      .then((data) => {
        setLinks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Load current slide order for creating new links / refreshing snapshots
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

  async function createNewLink() {
    if (activeSlideIds.length === 0) return;
    setCreating(true);
    const id = crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    const label = newLinkName.trim() || undefined;
    const newLink: ShareLink = {
      id,
      created_at: now,
      updated_at: now,
      disabled: false,
      slide_ids: activeSlideIds,
      label,
    };
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, slide_ids: activeSlideIds, label }),
      });
      setLinks((prev) => [newLink, ...prev]);
      setNewLinkName("");
    } catch {}
    setCreating(false);
  }

  async function toggleDisable(link: ShareLink) {
    const action = link.disabled ? "enable" : "disable";
    setBusy(link.id);
    setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, disabled: !l.disabled } : l));
    await fetch("/api/share", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, action }),
    }).catch(() => {
      setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, disabled: link.disabled } : l));
    });
    setBusy(null);
  }

  async function refreshSnapshot(link: ShareLink) {
    if (activeSlideIds.length === 0) return;
    setBusy(link.id);
    const now = new Date().toISOString();
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

  async function renameLink(link: ShareLink, newLabel: string) {
    const label = newLabel.trim();
    setBusy(link.id);
    setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, label: label || undefined } : l));
    await fetch("/api/share", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, action: "rename", label }),
    }).catch(() => {});
    setBusy(null);
    setEditingLabel(null);
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
    <AdminAuth>
    <div className={`min-h-screen ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Share Links</h1>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {links.length} link{links.length !== 1 ? "s" : ""} &middot; {links.filter((l) => !l.disabled).length} active
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dark ? "bg-blue-600" : "bg-gray-300"}`}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dark ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{dark ? "Dark" : "Light"}</span>

            <input
              type="text"
              placeholder="Link name (optional)"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createNewLink(); }}
              className={`px-3 py-2 border rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-300 text-gray-900"}`}
            />
            <button
              onClick={createNewLink}
              disabled={creating || activeSlideIds.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40"
            >
              {creating ? "Creating..." : "New Link"}
            </button>
            <a
              href="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm ${dark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Dashboard
            </a>
            <a
              href="/"
              className={`px-4 py-2 rounded-lg text-sm ${dark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Back to Deck
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {links.length === 0 ? (
          <div className="text-center py-16">
            <h2 className={`text-lg font-medium mb-2 ${dark ? "text-white" : "text-gray-900"}`}>No links yet</h2>
            <p className={`mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Create a share link to let others view your deck.</p>
            <button
              onClick={createNewLink}
              disabled={creating || activeSlideIds.length === 0}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create First Link"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const url = viewUrl(link.id);
              const isBusy = busy === link.id;
              return (
                <div
                  key={link.id}
                  className={`rounded-xl border p-5 transition-opacity ${
                    dark
                      ? `bg-gray-900 ${link.disabled ? "border-gray-800 opacity-60" : "border-gray-800"}`
                      : `bg-white ${link.disabled ? "border-gray-200 opacity-60" : "border-gray-200"}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: URL + dates */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            link.disabled
                              ? dark ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700"
                              : dark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {link.disabled ? "Disabled" : "Active"}
                        </span>
                        {editingLabel === link.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={editingLabelValue}
                            onChange={(e) => setEditingLabelValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") renameLink(link, editingLabelValue);
                              if (e.key === "Escape") setEditingLabel(null);
                            }}
                            onBlur={() => renameLink(link, editingLabelValue)}
                            className={`text-sm font-medium border rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 ${dark ? "bg-gray-800 border-gray-700 text-white" : "text-gray-700 border-gray-300"}`}
                          />
                        ) : (
                          <button
                            onClick={() => { setEditingLabel(link.id); setEditingLabelValue(link.label || ""); }}
                            className={`text-sm font-medium cursor-pointer ${dark ? "text-gray-200 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"}`}
                            title="Click to rename"
                          >
                            {link.label || <span className={`italic font-normal ${dark ? "text-gray-600" : "text-gray-400"}`}>Add name...</span>}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className={`text-sm px-2 py-1 rounded truncate max-w-sm ${dark ? "text-blue-400 bg-blue-950/50" : "text-blue-700 bg-blue-50"}`}>
                          {url}
                        </code>
                        <button
                          onClick={() => copyUrl(link.id)}
                          className={`flex-shrink-0 text-xs px-2 py-1 rounded ${dark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {copied === link.id ? "Copied!" : "Copy"}
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-shrink-0 text-xs px-2 py-1 rounded ${dark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          Open
                        </a>
                      </div>

                      <div className={`flex items-center gap-4 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        <span>Created {formatDate(link.created_at)}</span>
                        {link.updated_at && link.updated_at !== link.created_at && (
                          <span>Refreshed {formatDate(link.updated_at)}</span>
                        )}
                        {link.slide_ids && (
                          <span>{link.slide_ids.length} slides</span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => refreshSnapshot(link)}
                        disabled={isBusy || activeSlideIds.length === 0}
                        title="Update this link to show the current deck"
                        className={`px-3 py-1.5 text-sm rounded-lg disabled:opacity-40 ${dark ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                      >
                        {isBusy ? "..." : "Refresh"}
                      </button>
                      <button
                        onClick={() => toggleDisable(link)}
                        disabled={isBusy}
                        className={`px-3 py-1.5 text-sm rounded-lg disabled:opacity-40 ${
                          link.disabled
                            ? dark ? "bg-green-900/30 text-green-400 hover:bg-green-900/50" : "bg-green-50 text-green-700 hover:bg-green-100"
                            : dark ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-50 text-red-700 hover:bg-red-100"
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
    </AdminAuth>
  );
}

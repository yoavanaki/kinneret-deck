"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/lib/store";

interface CommentsProps {
  slideId: string;
  theme: "light" | "dark";
}

export default function Comments({ slideId, theme }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?slideId=${slideId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [slideId]);

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slideId, author: author || "Anonymous", text }),
    });
    const comment = await res.json();
    setComments((prev) => [...prev, comment]);
    setText("");
    setLoading(false);
  }

  const isDark = theme === "dark";

  return (
    <div className={`mt-2 p-3 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-gray-800"}`}>
      <h4 className="font-semibold mb-2">Comments on this slide</h4>

      {comments.length === 0 && (
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-400"}`}>No comments yet</p>
      )}

      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className={`p-2 rounded ${isDark ? "bg-slate-700" : "bg-white border border-gray-200"}`}>
            <span className="font-medium text-xs">{c.author}</span>
            <p className="mt-0.5">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={`px-2 py-1 rounded text-xs w-24 ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} border`}
        />
        <input
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`px-2 py-1 rounded text-xs flex-1 ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} border`}
        />
        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Comment } from "@/lib/store";

interface CommentsProps {
  slideId: string;
  theme: "light" | "dark";
  onCommentPosted?: () => void;
}

export default function Comments({ slideId, theme, onCommentPosted }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved author name
  useEffect(() => {
    const saved = localStorage.getItem("cognitory-comment-author");
    if (saved) setAuthor(saved);
  }, []);

  // Save author name when it changes
  useEffect(() => {
    if (author) localStorage.setItem("cognitory-comment-author", author);
  }, [author]);

  useEffect(() => {
    fetch(`/api/comments?slideId=${slideId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [slideId]);

  // Auto-scroll to bottom when comments change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

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
    onCommentPosted?.();
  }

  const isDark = theme === "dark";

  return (
    <div className={`flex flex-col h-full ${isDark ? "bg-slate-800 text-slate-200" : "bg-white text-gray-800"}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
        <h4 className="font-semibold text-sm">Comments</h4>
        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-gray-400"}`}>
          Slide-specific feedback
        </p>
      </div>

      {/* Comment list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {comments.length === 0 && (
          <p className={`text-xs text-center py-8 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            No comments on this slide yet
          </p>
        )}

        {comments.map((c) => (
          <div key={c.id} className={`p-2.5 rounded-lg text-sm ${isDark ? "bg-slate-700" : "bg-gray-50 border border-gray-100"}`}>
            <div className="flex items-baseline justify-between gap-2">
              <span className={`font-medium text-xs ${isDark ? "text-blue-300" : "text-blue-600"}`}>{c.author}</span>
              <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                {new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="mt-1 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className={`p-3 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
        <input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={`w-full px-3 py-1.5 rounded text-xs mb-2 ${isDark ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"} border`}
        />
        <div className="flex gap-2">
          <textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            className={`flex-1 px-3 py-1.5 rounded text-sm resize-none ${isDark ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"} border`}
          />
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="px-3 self-end py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

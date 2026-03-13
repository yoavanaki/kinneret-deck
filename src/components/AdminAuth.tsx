"use client";

import { useState, useEffect, ReactNode } from "react";

export default function AdminAuth({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authed" | "locked">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setStatus(d.authenticated ? "authed" : "locked"))
      .catch(() => setStatus("locked"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setStatus("authed");
    } else {
      setError(true);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Cognitory Deck</h1>
          <p className="text-gray-500 text-sm mb-6">Enter password to continue.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg mb-3 text-base ${
                error ? "border-red-400" : "border-gray-300"
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-3">Wrong password.</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

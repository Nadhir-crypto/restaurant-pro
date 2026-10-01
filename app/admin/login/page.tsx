"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid password.");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0e0f0c] px-5 text-[#f4eee4]">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d9b27c]/25 bg-[#d9b27c]/10 text-[#d9b27c]">
            <LockKeyhole size={25} />
          </div>

          <p className="mt-7 font-serif text-2xl">
            MAISON <span className="text-[#d9b27c]">ÉMERAUDE</span>
          </p>

          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/35">
            Administration
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-[#161813] p-7 sm:p-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9b27c]">
            Private access
          </p>

          <h1 className="mt-4 font-serif text-4xl">Welcome back.</h1>

          <p className="mt-4 text-sm leading-7 text-white/40">
            Enter the restaurant administration password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <label
              htmlFor="password"
              className="text-[10px] uppercase tracking-[0.18em] text-white/40"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="mt-3 min-h-14 w-full rounded-full border border-white/10 bg-[#0e0f0c] px-6 text-sm outline-none transition placeholder:text-white/20 focus:border-[#d9b27c]/60"
            />

            {error && (
              <p className="mt-4 text-center text-xs text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#d9b27c] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#11120f] transition hover:bg-[#efd0a2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Enter dashboard
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
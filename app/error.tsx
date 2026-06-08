"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-5 py-16">
      <section className="mx-auto max-w-2xl rounded bg-white p-8 text-center shadow-sm ring-1 ring-blue-100">
        <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
          Service temporarily unavailable
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#073b7a]">
          We could not load this page right now.
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Please try again in a moment. If the issue continues, contact Gifted-Faith Global Ventures
          on WhatsApp or by phone for support.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
          >
            Try again
          </button>
          <Link
            href="/contact"
            className="rounded border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-[#0b4ea2] transition hover:bg-blue-50"
          >
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}

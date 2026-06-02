"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Wrong username or password.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setStatus("error");
      setError(loginError instanceof Error ? loginError.message : "Wrong username or password.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded bg-white p-6 shadow-xl shadow-blue-950/10 ring-1 ring-blue-100 sm:p-8"
    >
      <span className="grid h-12 w-12 place-items-center rounded bg-[#fff3d8] text-[#8a6423]">
        <LockKeyhole size={24} aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-3xl font-bold text-[#073b7a]">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in to view and manage travel application submissions.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Username
        <input className={inputClass} name="username" type="text" autoComplete="username" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Password
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? (
        <p className="rounded bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded bg-[#0b4ea2] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#073b7a] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <LogIn size={18} aria-hidden="true" />
        {status === "submitting" ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}

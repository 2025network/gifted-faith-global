import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Megaphone, Sparkles } from "lucide-react";
import { isAdminLoggedIn } from "@/lib/auth";
import { PageShell } from "../../components/PageShell";
import { MarketingGenerator } from "./MarketingGenerator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Marketing Content",
  description: "Protected marketing content generator for Gifted-Faith Global Ventures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMarketingPage() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  return (
    <PageShell>
      <section className="bg-[#073b7a] py-12 text-white">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            Admin marketing
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Marketing content generator
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
            Create reusable captions, hashtags, calls to action, and content plans from local
            templates. AI and auto-posting integrations can be connected later.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded border border-blue-100 bg-white p-5 shadow-sm">
            <Megaphone className="text-[#0b4ea2]" size={28} aria-hidden="true" />
            <p className="mt-4 text-2xl font-bold text-[#073b7a]">Manual content</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Generate posts for Facebook, Instagram, WhatsApp Status, TikTok/Reels, Google
              Business Profile, and Blog without connecting external APIs.
            </p>
          </article>
          <article className="rounded border border-blue-100 bg-white p-5 shadow-sm">
            <Sparkles className="text-[#d9a441]" size={28} aria-hidden="true" />
            <p className="mt-4 text-2xl font-bold text-[#073b7a]">AI-ready workflow</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Templates are structured so future AI generation can replace the local copy engine
              without changing the admin workflow.
            </p>
          </article>
        </div>

        <div className="mt-10">
          <MarketingGenerator />
        </div>
      </section>
    </PageShell>
  );
}

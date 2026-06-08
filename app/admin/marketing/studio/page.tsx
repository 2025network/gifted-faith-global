import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BarChart3, Download, Palette } from "lucide-react";
import { isAdminLoggedIn } from "@/lib/auth";
import { logProductionError } from "@/lib/runtime";
import { PageShell } from "../../../components/PageShell";
import { MarketingStudio } from "./MarketingStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Marketing Studio",
  description: "Protected travel marketing studio for Gifted-Faith Global Ventures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMarketingStudioPage() {
  let loggedIn = false;

  try {
    loggedIn = await isAdminLoggedIn();
  } catch (error) {
    logProductionError("Admin marketing studio auth check failed", error);
  }

  if (!loggedIn) {
    redirect("/admin/login");
  }

  return (
    <PageShell>
      <section className="bg-[#073b7a] py-12 text-white">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            Admin marketing studio
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Travel Marketing Studio
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
            Generate branded flyers, platform-specific content, and reusable travel marketing
            campaigns without connecting external posting or AI services.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Flyer Generator",
              description: "Create branded travel advert layouts.",
              icon: Palette,
            },
            {
              label: "Campaign Packages",
              description: "Build single, 7-day, and 30-day content plans.",
              icon: Download,
            },
            {
              label: "Local Dashboard",
              description: "Track generated campaigns in this browser.",
              icon: BarChart3,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded border border-blue-100 bg-white p-5 shadow-sm">
                <Icon className="text-[#0b4ea2]" size={26} aria-hidden="true" />
                <p className="mt-4 text-xl font-bold text-[#073b7a]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <MarketingStudio />
        </div>
      </section>
    </PageShell>
  );
}

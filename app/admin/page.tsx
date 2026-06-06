import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, FileCheck2, Megaphone, Palette, Plane, ShieldCheck } from "lucide-react";
import { isAdminLoggedIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageShell } from "../components/PageShell";
import { ApplicationAdmin } from "./ApplicationAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Protected Gifted-Faith Global Ventures admin dashboard for reviewing applications, documents, tracking codes, and status updates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  const applications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = applications.filter((application) => application.status === "Pending").length;
  const documentsCount = applications.filter(
    (application) =>
      application.passportUploadPath ||
      application.passportPhotoPath ||
      application.bankStatementPath ||
      application.supportingDocPath
  ).length;

  return (
    <PageShell>
      <section className="bg-[#073b7a] py-12 text-white">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Admin dashboard</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Application control center
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
            Review submitted applications, open uploaded documents, update statuses, and manage
            tracking codes from one secure workspace.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total applications", value: applications.length, icon: ClipboardList },
            { label: "Pending review", value: pendingCount, icon: ShieldCheck },
            { label: "With documents", value: documentsCount, icon: FileCheck2 },
            { label: "Service platform", value: "Live", icon: Plane },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded border border-blue-100 bg-white p-5 shadow-sm">
                <Icon className="text-[#0b4ea2]" size={26} aria-hidden="true" />
                <p className="mt-4 text-3xl font-bold text-[#073b7a]">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{item.label}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#073b7a]">Recent application submissions</h2>
              <p className="mt-2 text-sm text-slate-600">Newest entries appear first.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/marketing"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#d9a441] px-4 py-2.5 text-sm font-bold text-[#102033] transition hover:bg-[#c9942f]"
              >
                <Megaphone size={17} aria-hidden="true" />
                Marketing Content
              </Link>
              <Link
                href="/admin/marketing/studio"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#073b7a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
              >
                <Palette size={17} aria-hidden="true" />
                Marketing Studio
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <ApplicationAdmin
              applications={applications.map((application) => ({
                ...application,
                createdAt: application.createdAt.toISOString(),
              }))}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

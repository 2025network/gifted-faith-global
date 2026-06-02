import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { brand, reasons, trustPoints } from "../data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Gifted-Faith Global Ventures, a professional travel, visa assistance, booking, and document support company.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="bg-[#f4f8ff] py-14 sm:py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">About us</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-[#073b7a] sm:text-5xl">
            {brand.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{brand.slogan}</p>
        </div>
      </section>

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-bold text-[#073b7a]">
            Travel preparation with structure, care, and accountability.
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Gifted-Faith Global Ventures helps clients prepare for visa applications, travel
            appointments, itinerary planning, reservations, passport renewal, and document
            organization. Our platform supports uploads, tracking codes, status updates, and admin
            review workflows.
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            Whether you are traveling for study, tourism, business, medical care, or a family visit,
            we make the preparation steps clearer and easier to follow.
          </p>
          <Link
            href="/apply-now"
            className="mt-7 inline-flex items-center gap-2 rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
          >
            Start Your Application <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded bg-white p-6 shadow-lg shadow-blue-900/10 ring-1 ring-blue-100">
          <h3 className="text-xl font-bold text-[#102033]">What clients can expect</h3>
          <div className="mt-5 grid gap-4">
            {reasons.map((reason) => (
              <p key={reason.title} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#d9a441]" size={22} aria-hidden="true" />
                <span>
                  <span className="block font-bold">{reason.title}</span>
                  <span className="text-sm leading-6 text-slate-600">{reason.description}</span>
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#073b7a] py-14 text-white">
        <div className="section-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.label} className="rounded border border-white/15 bg-white/8 p-5">
              <p className="text-2xl font-bold text-[#d9a441]">{point.value}</p>
              <p className="mt-1 text-sm font-semibold text-blue-100">{point.label}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

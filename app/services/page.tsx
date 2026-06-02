import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { services } from "../data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Gifted-Faith Global Ventures visa assistance, appointment booking, travel planning, reservation, passport renewal, and document support services.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="bg-[#073b7a] py-14 text-white sm:py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Our services</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Visa, travel, booking, and document support in one place.
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            Choose the service that matches your destination, travel purpose, and current stage of
            preparation.
          </p>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded border border-blue-100 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded bg-blue-50 text-[#0b4ea2]">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-[#102033]">{service.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10 rounded bg-[#fff3d8] p-6 ring-1 ring-[#f0d89c] md:p-8">
          <h2 className="text-2xl font-bold text-[#073b7a]">Need more than one service?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-700">
            Many applications need appointment support, reservations, uploads, and document
            organization together. Submit your request and we will review the best next step.
          </p>
          <Link
            href="/apply-now"
            className="mt-6 inline-flex items-center gap-2 rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
          >
            Apply Now <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

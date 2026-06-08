import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "./components/PageShell";
import { SocialLinks } from "./components/SocialLinks";
import { WhatsAppCta } from "./components/WhatsAppCta";
import {
  brand,
  faqs,
  processSteps,
  reasons,
  services,
  supportedCountries,
  testimonials,
  trustPoints,
} from "./data";

export const metadata: Metadata = {
  title: "Visa Assistance, Travel Planning and Document Support",
  description:
    "Gifted-Faith Global Ventures provides visa assistance, travel planning, appointment booking, document upload, tracking, and reservation support.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Gifted-Faith Global Ventures",
    description:
      "Visa assistance, travel planning, UK visa support, Canada visa assistance, study visa support, tourism travel, and business travel support in Nigeria.",
  },
};

export default function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#f4f8ff]">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(11,78,162,0.97)_0%,rgba(11,78,162,0.92)_52%,rgba(255,255,255,0)_52%)]" />
        <div className="section-shell relative grid min-h-[680px] items-center gap-10 py-14 sm:py-18 lg:grid-cols-[1.03fr_0.97fr]">
          <div className="max-w-2xl text-white">
            <p className="inline-flex rounded bg-[#d9a441] px-3 py-1.5 text-sm font-bold text-[#102033]">
              {brand.slogan}
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Professional visa and travel support from application to arrival.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-blue-50 sm:text-lg">
              Apply online, upload your documents, receive a tracking code, and follow your
              application status while our team supports your travel preparation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply-now"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#d9a441] px-6 py-3.5 text-sm font-bold text-[#102033] shadow-lg shadow-blue-950/20 transition hover:bg-[#c9942f]"
              >
                Apply Now <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/track-application"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/60 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Track Application <Globe2 size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="rounded bg-white p-4 shadow-2xl shadow-blue-950/20 ring-1 ring-blue-100 sm:p-6">
            <div className="aspect-[4/3] rounded bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Secure uploads", "Tracking code", "Admin review"].map((item) => (
                <div key={item} className="rounded border border-blue-100 bg-blue-50 p-3 text-center">
                  <p className="text-sm font-bold text-[#073b7a]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-white py-8">
        <div className="section-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <article key={point.label} className="rounded border border-blue-100 bg-[#f4f8ff] p-5">
              <p className="text-2xl font-bold text-[#073b7a]">{point.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{point.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Services</p>
          <h2 className="mt-3 text-3xl font-bold text-[#073b7a] sm:text-4xl">
            Travel support for the details that matter.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            From visa guidance to reservations and document organization, every service is built to
            help you prepare with clarity.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded border border-blue-100 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded bg-blue-50 text-[#0b4ea2]">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-[#102033]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f4f8ff] py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Why choose us</p>
            <h2 className="mt-3 text-3xl font-bold text-[#073b7a] sm:text-4xl">
              A trustworthy process with visible progress.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Your submission is saved, your documents are attached securely, and your tracking code
              helps you follow updates without guessing.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article key={reason.title} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
                  <Icon className="text-[#d9a441]" size={30} aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-[#102033]">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{reason.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
              Supported countries
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#073b7a] sm:text-4xl">
              Destination guidance for popular travel routes.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {supportedCountries.map((country) => (
              <div key={country} className="flex items-center gap-3 rounded border border-blue-100 p-4">
                <Globe2 className="text-[#0b4ea2]" size={22} aria-hidden="true" />
                <span className="font-semibold text-slate-800">{country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#073b7a] py-16 text-white">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Application process</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
            Submit once, then track every important update.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <article key={step} className="rounded border border-white/20 bg-white/8 p-5">
                <span className="grid h-10 w-10 place-items-center rounded bg-[#d9a441] font-bold text-[#102033]">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-[#d9a441]">
                {[0, 1, 2, 3, 4].map((item) => (
                  <Star key={item} size={18} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">&quot;{testimonial.quote}&quot;</p>
              <p className="mt-5 font-bold text-[#073b7a]">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f8ff] py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-[#073b7a] sm:text-4xl">
              Answers before you apply.
            </h2>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded bg-white p-5 ring-1 ring-blue-100">
                <h3 className="flex gap-3 text-lg font-bold text-[#102033]">
                  <CheckCircle2 className="mt-1 shrink-0 text-[#d9a441]" size={20} aria-hidden="true" />
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid items-center gap-8 rounded bg-white p-6 shadow-sm ring-1 ring-blue-100 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Follow us</p>
            <h2 className="mt-3 text-3xl font-bold text-[#073b7a]">
              Connect with Gifted-Faith Global Ventures
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Follow us for visa tips, travel updates, study abroad guidance, and immigration
              support.
            </p>
          </div>
          <SocialLinks
            showLabels
            linkClassName="inline-flex items-center justify-center rounded border border-blue-100 bg-[#f4f8ff] px-4 py-3 text-sm font-bold text-[#0b4ea2] transition hover:border-[#d9a441] hover:bg-[#fff3d8] focus-visible:focus-ring"
          />
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid items-center gap-8 rounded bg-[#fff3d8] p-6 ring-1 ring-[#f0d89c] md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <h2 className="text-3xl font-bold text-[#073b7a]">Ready to begin?</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Submit your travel request today and keep your tracking code for updates.
            </p>
          </div>
          <WhatsAppCta className="px-6 py-3.5" />
        </div>
      </section>
    </PageShell>
  );
}

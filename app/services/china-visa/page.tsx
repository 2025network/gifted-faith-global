import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { PageShell } from "../../components/PageShell";

export const metadata: Metadata = {
  title: "China Visa Application Assistance",
  description:
    "China visa application preparation and document guidance for individuals, business travelers, students, tourists, and family visitors.",
  alternates: { canonical: "/services/china-visa" },
  openGraph: {
    url: "/services/china-visa",
    title: "China Visa Application Assistance",
    description:
      "Guidance for China business visa, tourist visa, student visa, document review, appointment booking, and invitation letter preparation.",
  },
};

const serviceItems = [
  "Visa Eligibility Assessment",
  "China Business Visa Guidance",
  "China Tourist Visa Guidance",
  "China Student Visa Guidance",
  "Document Review",
  "Appointment Booking Assistance",
  "Travel Itinerary Guidance",
  "Invitation Letter Guidance",
];

const requiredDocuments = [
  "Valid International Passport",
  "Passport Photograph",
  "Bank Statement",
  "Flight Reservation",
  "Hotel Reservation",
  "Invitation Letter (if applicable)",
  "Employment or Business Documents",
];

const visaCategories = [
  "Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Family Visit Visa",
  "Work Visa",
];

export default function ChinaVisaPage() {
  return (
    <PageShell>
      <section className="bg-[#073b7a] py-14 text-white sm:py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            China visa support
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            China Visa Application Assistance
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            We assist individuals, business travelers, students, and tourists with China visa
            application preparation and document guidance.
          </p>
          <Link
            href="/apply-now"
            className="mt-7 inline-flex items-center gap-2 rounded bg-[#d9a441] px-6 py-3 text-sm font-bold text-[#102033] transition hover:bg-[#c9942f]"
          >
            Apply for China Visa <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section-shell grid gap-8 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            Services we provide
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {serviceItems.map((item) => (
              <div key={item} className="flex gap-3 rounded border border-blue-100 bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#0b4ea2]" size={20} aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded bg-[#f4f8ff] p-6 ring-1 ring-blue-100">
          <FileCheck2 className="text-[#0b4ea2]" size={32} aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold text-[#073b7a]">Visa categories</h2>
          <div className="mt-4 grid gap-2">
            {visaCategories.map((category) => (
              <p key={category} className="rounded bg-white px-4 py-3 text-sm font-bold text-slate-700 ring-1 ring-blue-100">
                {category}
              </p>
            ))}
          </div>
        </aside>
      </section>

      <section className="bg-[#f4f8ff] py-14">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            Required documents
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#073b7a]">
            Prepare your China visa file with clearer documentation.
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requiredDocuments.map((document) => (
              <article key={document} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
                <h3 className="text-base font-bold text-[#102033]">{document}</h3>
              </article>
            ))}
          </div>
          <Link
            href="/apply-now"
            className="mt-8 inline-flex items-center gap-2 rounded bg-[#0b4ea2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
          >
            Apply for China Visa <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

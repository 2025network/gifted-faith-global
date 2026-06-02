import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { brand } from "../data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Gifted-Faith Global Ventures for visa assistance, travel planning, reservations, appointment booking, document support, and application inquiries.",
};

export default function ContactPage() {
  const message = encodeURIComponent(
    `Hello ${brand.name}, I would like to make an inquiry about your travel services.`
  );

  return (
    <PageShell>
      <section className="bg-[#073b7a] py-14 text-white sm:py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Contact</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Let us help with your next trip.
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            Reach out for visa assistance, appointments, document organization, reservations, and
            travel planning.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {[
            { icon: Phone, title: "Phone", value: brand.phone },
            { icon: Mail, title: "Email", value: brand.email },
            { icon: MapPin, title: "Office", value: brand.address },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded border border-blue-100 bg-white p-5">
                <Icon className="text-[#0b4ea2]" size={26} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-[#102033]">{item.title}</h2>
                <p className="mt-2 text-slate-600">{item.value}</p>
              </div>
            );
          })}
        </div>
        <div className="rounded bg-[#f4f8ff] p-6 ring-1 ring-blue-100 md:p-8">
          <h2 className="text-3xl font-bold text-[#073b7a]">Send a quick WhatsApp message.</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Use WhatsApp for inquiries about services, requirements, uploaded documents, tracking,
            or appointment support.
          </p>
          <Link
            href={`https://wa.me/${brand.whatsapp}?text=${message}`}
            target="_blank"
            className="mt-7 inline-flex items-center gap-2 rounded bg-[#0b4ea2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
          >
            Chat on WhatsApp <MessageCircle size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, navItems } from "../data";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="bg-[#073b7a] text-white">
      <div className="section-shell grid gap-8 py-12 md:grid-cols-[1.3fr_0.7fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-bold">{brand.name}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">{brand.slogan}</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Travel, visa assistance, appointment booking, itinerary planning, reservations, and
            document support for individuals, families, students, and business travelers.
          </p>
          <div className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Follow us</h3>
            <SocialLinks
              className="mt-3"
              linkClassName="inline-flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-white/10 text-white transition hover:border-[#d9a441] hover:bg-[#d9a441] hover:text-[#102033] focus-visible:focus-ring"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Pages</h3>
          <div className="mt-4 grid gap-2 text-sm text-blue-100">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-blue-100">
            <p className="flex gap-2">
              <Phone size={18} aria-hidden="true" /> {brand.phone}
            </p>
            <p className="flex gap-2">
              <Mail size={18} aria-hidden="true" /> {brand.email}
            </p>
            <p className="flex gap-2">
              <MapPin size={18} aria-hidden="true" /> {brand.address}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5">
        <p className="section-shell text-sm text-slate-300">
          Copyright {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

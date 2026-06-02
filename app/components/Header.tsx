import Link from "next/link";
import { Plane } from "lucide-react";
import { brand, navItems } from "../data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-[#0b4ea2] text-white">
            <Plane size={22} aria-hidden="true" />
          </span>
          <span className="max-w-[220px]">
            <span className="block text-base font-bold leading-tight text-[#111827] sm:text-lg">
              {brand.name}
            </span>
            <span className="block text-xs font-medium text-[#8a6423]">{brand.slogan}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#0b4ea2] focus-visible:focus-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/apply-now"
          className="hidden rounded bg-[#d9a441] px-4 py-2.5 text-sm font-bold text-[#102033] shadow-sm transition hover:bg-[#c9942f] focus-visible:focus-ring sm:inline-flex"
        >
          Start Application
        </Link>
      </div>
      <nav className="section-shell flex gap-2 overflow-x-auto pb-3 lg:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { brand, navItems } from "../data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-5 py-3 md:min-h-[92px]">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Gifted-Faith Global Ventures logo"
            width={64}
            height={64}
            priority
            unoptimized
            className="h-12 w-12 shrink-0 object-contain md:h-16 md:w-16"
          />
          <span className="min-w-0 max-w-[220px]">
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

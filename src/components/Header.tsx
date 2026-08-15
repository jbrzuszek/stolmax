"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-charcoal/90 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between px-5 md:h-20 md:px-10 lg:px-16">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-wide text-cream transition-colors group-hover:text-oak md:text-3xl">
            Stolmax
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-muted">
            Producent stołów
          </span>
        </Link>

        <nav aria-label="Główne menu" className="hidden items-center gap-5 lg:gap-7 xl:gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-sm uppercase tracking-[0.12em] transition-colors hover:text-oak xl:tracking-[0.15em] ${
                isActive(item.href) ? "text-oak" : "text-cream/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.colorsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-sm uppercase tracking-[0.12em] text-cream/80 transition-colors hover:text-oak xl:tracking-[0.15em]"
          >
            Kolorystyka
          </a>
        </nav>

        <a
          href={`tel:${siteConfig.phoneHref}`}
          className="hidden text-sm tracking-wide text-oak transition-opacity hover:opacity-80 lg:block"
        >
          {siteConfig.phone}
        </a>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center text-cream md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-full bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav aria-label="Menu mobilne" className="border-t border-white/5 bg-charcoal px-5 py-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block text-lg ${isActive(item.href) ? "text-oak" : "text-cream"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.colorsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-cream"
              >
                Kolorystyka
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.phoneHref}`} className="block text-lg text-oak">
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

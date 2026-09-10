"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
  { code: "en", label: "EN" },
];

function withLocale(pathname, locale) {
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/") || "/";
}

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="border-b border-majorelle/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display-scoped text-xl font-semibold text-majorelleDeep">
          Dar<span className="text-clay">Dzair</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <Link href="#" className="text-ink/80 hover:text-ink">
            {t("explore")}
          </Link>
          <Link href="/host/new" className="text-ink/80 hover:text-ink">
            {t("host")}
          </Link>
          <Link href="/trips" className="text-ink/80 hover:text-ink">
            {t("trips")}
          </Link>
          <Link
            href="/login"
            className="rounded-sm border border-majorelle px-4 py-2 text-majorelleDeep hover:bg-majorelle hover:text-sand transition-colors"
          >
            {t("login")}
          </Link>

          <div className="flex items-center gap-1 border-l border-ink/10 pl-5">
            {locales.map(({ code, label }) => (
              <Link
                key={code}
                href={withLocale(pathname, code)}
                className="px-1.5 text-xs text-ink/60 hover:text-clay"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

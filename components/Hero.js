"use client";

import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-5 md:py-24">
      <div className="md:col-span-3">
        <h1 className="font-display-scoped text-4xl leading-tight text-majorelleDeep md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink/70">{t("subtitle")}</p>

        <form action="/search" method="get" className="mt-10 max-w-lg">
          <div className="flex overflow-hidden rounded-sm border border-majorelle/30 bg-white">
            <input
              type="text"
              name="city"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent px-5 py-4 text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-clay px-6 py-4 font-medium text-sand transition-colors hover:bg-majorelleDeep"
            >
              {t("cta")}
            </button>
          </div>

          <div className="mt-2 flex gap-2">
            <label className="flex flex-1 items-center gap-2 rounded-sm border border-majorelle/30 bg-white px-4 py-2 text-sm text-ink/60">
              {t("checkin")}
              <input
                type="date"
                name="start"
                className="w-full bg-transparent text-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-1 items-center gap-2 rounded-sm border border-majorelle/30 bg-white px-4 py-2 text-sm text-ink/60">
              {t("checkout")}
              <input
                type="date"
                name="end"
                className="w-full bg-transparent text-ink focus:outline-none"
              />
            </label>
          </div>
        </form>
      </div>

      <div className="md:col-span-2">
        <ZelligePanel />
      </div>
    </section>
  );
}

// A repeating 8-point star lattice, the geometric core of zellige tilework —
// used here as the hero's one bold visual gesture instead of a photo or gradient blob.
function ZelligePanel() {
  const tile = (
    <g stroke="currentColor" strokeWidth="1.2" fill="none">
      <path d="M20 0 L26 14 L40 20 L26 26 L20 40 L14 26 L0 20 L14 14 Z" />
      <circle cx="20" cy="20" r="5" />
    </g>
  );

  return (
    <div className="aspect-square w-full overflow-hidden rounded-sm bg-majorelleDeep">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <rect width="200" height="200" fill="#173247" />
        <g className="text-saffron/70">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <g
                key={`${row}-${col}`}
                transform={`translate(${col * 40}, ${row * 40})`}
              >
                {tile}
              </g>
            ))
          )}
        </g>
        <g className="text-clay">
          {[[1, 1], [3, 2], [2, 4]].map(([col, row]) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 40 + 20}
              cy={row * 40 + 20}
              r="3"
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

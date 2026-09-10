"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ListingCard({ id, title, city, price, imageColor = "#28527A" }) {
  const t = useTranslations("listings");

  return (
    <Link href={`/listing/${id}`} className="group block cursor-pointer">
      <div
        className="aspect-[4/3] w-full rounded-sm border-t-4"
        style={{ backgroundColor: `${imageColor}22`, borderColor: imageColor }}
      />
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <h3 className="font-display-scoped text-lg text-majorelleDeep">{title}</h3>
          <p className="text-sm text-ink/60">{city}</p>
        </div>
        <p className="whitespace-nowrap text-sm text-ink/80">
          {price} DA <span className="text-ink/50">{t("perNight")}</span>
        </p>
      </div>
    </Link>
  );
}

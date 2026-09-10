import { getTranslations } from "next-intl/server";
import Header from "../../../components/Header";
import ListingCard from "../../../components/ListingCard";
import { getListings } from "../../../lib/listings";

export default async function SearchPage({ params, searchParams }) {
  const { locale } = params;
  const city = searchParams?.city?.trim();
  const startDate = searchParams?.start;
  const endDate = searchParams?.end;
  const t = await getTranslations({ locale, namespace: "search" });
  const listings = await getListings({ city, startDate, endDate, limit: 24 });

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display-scoped text-2xl text-majorelleDeep">
          {city ? t("resultsFor", { city }) : t("allResults")}
        </h1>

        {listings.length === 0 ? (
          <p className="mt-8 text-ink/60">{t("noResults")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                city={listing.city}
                price={listing.price_per_night}
                imageColor={listing.imageColor}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

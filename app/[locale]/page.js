export const dynamic = 'force-dynamic';
import { getTranslations } from "next-intl/server";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import ListingCard from "../../components/ListingCard";
import { getListings } from "../../lib/listings";

async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-majorelle/15 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-ink/60">
        <p>{t("tagline")}</p>
        <p>© {new Date().getFullYear()} DarDzair. {t("rights")}</p>
      </div>
    </footer>
  );
}

export default async function Home() {
  const t = await getTranslations("listings");
  const listings = await getListings();

  return (
    <main>
      <Header />
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display-scoped text-2xl text-majorelleDeep">{t("title")}</h2>
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
      </section>

      <Footer />
    </main>
  );
}

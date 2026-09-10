import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import BookingForm from "../../../../components/BookingForm";
import { getListingById } from "../../../../lib/listings";

export default async function ListingDetailPage({ params }) {
  const { id, locale } = params;
  const t = await getTranslations({ locale, namespace: "listing" });
  const listing = await getListingById(id);

  if (!listing) notFound();

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <a href="../" className="text-sm text-majorelle underline underline-offset-4">
          &larr; {t("back")}
        </a>

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="aspect-[16/9] w-full rounded-sm bg-majorelleDeep/10 border-t-4 border-majorelle" />

            <h1 className="mt-6 font-display-scoped text-3xl text-majorelleDeep">
              {listing.title}
            </h1>
            <p className="mt-1 text-ink/60">{listing.city}</p>

            {listing.description && (
              <p className="mt-6 max-w-2xl text-ink/80">{listing.description}</p>
            )}

            {listing.max_guests && (
              <p className="mt-4 text-sm text-ink/60">
                {listing.max_guests} {t("guests")}
              </p>
            )}

            <p className="mt-6 text-lg text-ink">
              {listing.price_per_night} DA{" "}
              <span className="text-sm text-ink/50">/ nuit</span>
            </p>
          </div>

          <div>
            <BookingForm listingId={listing.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

import { supabase } from "./supabaseClient";

// Placeholder shown until real listings exist in Supabase.
const fallbackListings = [
  { id: "1", title: "Riad au cœur de la Casbah", city: "Alger", price_per_night: 6500, imageColor: "#28527A" },
  { id: "2", title: "Maison troglodyte", city: "Ghardaïa", price_per_night: 4200, imageColor: "#B0522D" },
  { id: "3", title: "Villa face à la baie", city: "Béjaïa", price_per_night: 8900, imageColor: "#7FA99B" },
  { id: "4", title: "Kasbah aux portes du désert", city: "Timimoun", price_per_night: 5300, imageColor: "#E2A33B" },
];

const palette = ["#28527A", "#B0522D", "#7FA99B", "#E2A33B"];

export async function getListings({ limit = 8, city, startDate, endDate } = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (!city) return fallbackListings;
    return fallbackListings.filter((l) =>
      l.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  let excludedIds = [];

  if (startDate && endDate) {
    // A listing is unavailable if it has a pending/confirmed booking that
    // overlaps the requested range: existing.start < requested.end AND existing.end > requested.start.
    const { data: overlapping } = await supabase
      .from("bookings")
      .select("listing_id")
      .neq("status", "cancelled")
      .lt("start_date", endDate)
      .gt("end_date", startDate);

    excludedIds = (overlapping ?? []).map((b) => b.listing_id);
  }

  let query = supabase
    .from("listings")
    .select("id, title, city, price_per_night")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (excludedIds.length > 0) {
    query = query.not("id", "in", `(${excludedIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  if (data.length === 0 && !city && !startDate) {
    return fallbackListings;
  }

  return data.map((listing, i) => ({
    ...listing,
    imageColor: palette[i % palette.length],
  }));
}

export async function getListingById(id) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return fallbackListings.find((listing) => listing.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, description, city, address, price_per_night, max_guests")
    .eq("id", id)
    .single();

  if (error || !data) {
    return fallbackListings.find((listing) => listing.id === id) ?? null;
  }

  return data;
}

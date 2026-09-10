"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const statusStyles = {
  pending: "text-saffron",
  confirmed: "text-mint",
  cancelled: "text-clay",
};

export default function MyTrips() {
  const t = useTranslations("trips");
  const tNav = useTranslations("nav");

  const [user, setUser] = useState(undefined);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("bookings")
          .select("id, start_date, end_date, status, listings(id, title, city)")
          .eq("guest_id", currentUser.id)
          .order("created_at", { ascending: false });
        setBookings(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (user === null) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <p className="text-ink/70">{t("loginRequired")}</p>
        <a href="../login" className="mt-4 inline-block text-majorelle underline underline-offset-4">
          {tNav("login")}
        </a>
      </div>
    );
  }

  if (user === undefined || loading) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display-scoped text-3xl text-majorelleDeep">{t("title")}</h1>

      {bookings.length === 0 ? (
        <div className="mt-8">
          <p className="text-ink/60">{t("noTrips")}</p>
          <Link href="../" className="mt-4 inline-block text-majorelle underline underline-offset-4">
            {t("exploreLink")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-majorelle/10">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`../listing/${booking.listings?.id}`}
              className="flex items-center justify-between py-5 hover:bg-majorelle/5 -mx-2 px-2"
            >
              <div>
                <p className="font-medium text-ink">{booking.listings?.title}</p>
                <p className="text-sm text-ink/60">
                  {booking.listings?.city} · {booking.start_date} → {booking.end_date}
                </p>
              </div>
              <p className={`text-sm ${statusStyles[booking.status]}`}>
                {t(`status${booking.status[0].toUpperCase()}${booking.status.slice(1)}`)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

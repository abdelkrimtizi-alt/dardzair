"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "../lib/supabaseClient";

const statusStyles = {
  pending: "text-saffron",
  confirmed: "text-mint",
  cancelled: "text-clay",
};

export default function HostDashboard() {
  const t = useTranslations("host");
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
          .select("id, start_date, end_date, status, listings(title, city)")
          .order("created_at", { ascending: false });
        setBookings(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id, status) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await supabase.from("bookings").update({ status }).eq("id", id);
  }

  if (user === null) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <p className="text-ink/70">{t("loginRequired")}</p>
        <a href="../../login" className="mt-4 inline-block text-majorelle underline underline-offset-4">
          {tNav("login")}
        </a>
      </div>
    );
  }

  if (user === undefined || loading) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display-scoped text-3xl text-majorelleDeep">{t("dashboardTitle")}</h1>

      {bookings.length === 0 ? (
        <p className="mt-8 text-ink/60">{t("noBookings")}</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-majorelle/10">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-5">
              <div>
                <p className="font-medium text-ink">{booking.listings?.title}</p>
                <p className="text-sm text-ink/60">
                  {booking.listings?.city} · {booking.start_date} → {booking.end_date}
                </p>
                <p className={`mt-1 text-sm ${statusStyles[booking.status]}`}>
                  {t(`status${booking.status[0].toUpperCase()}${booking.status.slice(1)}`)}
                </p>
              </div>

              {booking.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(booking.id, "confirmed")}
                    className="border border-mint px-4 py-2 text-sm text-mint hover:bg-mint hover:text-white transition-colors"
                  >
                    {t("confirm")}
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, "cancelled")}
                    className="border border-clay px-4 py-2 text-sm text-clay hover:bg-clay hover:text-white transition-colors"
                  >
                    {t("decline")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

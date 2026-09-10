"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "../lib/supabaseClient";

export default function BookingForm({ listingId }) {
  const t = useTranslations("listing");

  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState({ type: null, message: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setStatus({ type: null, message: null });

    const { error } = await supabase.from("bookings").insert({
      listing_id: listingId,
      guest_id: user.id,
      start_date: startDate,
      end_date: endDate,
    });

    setStatus(
      error
        ? { type: "error", message: t("requestSent") + " ⚠" }
        : { type: "success", message: t("requestSent") }
    );
    setLoading(false);
  }

  return (
    <div className="border border-majorelle/20 bg-white p-6">
      <h2 className="font-display-scoped text-xl text-majorelleDeep">{t("bookingTitle")}</h2>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("startDate")}
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-sm border border-majorelle/30 px-3 py-2 focus:outline-none focus:border-majorelle"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("endDate")}
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-sm border border-majorelle/30 px-3 py-2 focus:outline-none focus:border-majorelle"
          />
        </label>

        <button
          type="submit"
          disabled={!user || loading}
          className="bg-clay px-6 py-3 font-medium text-sand transition-colors hover:bg-majorelleDeep disabled:opacity-50"
        >
          {t("requestBooking")}
        </button>

        {!user && <p className="text-sm text-ink/60">{t("loginRequired")}</p>}
        {status.message && (
          <p className={status.type === "error" ? "text-sm text-clay" : "text-sm text-mint"}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}

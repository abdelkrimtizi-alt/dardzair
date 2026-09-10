"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function NewListingForm() {
  const t = useTranslations("host");
  const tNav = useTranslations("nav");
  const router = useRouter();

  const [user, setUser] = useState(undefined); // undefined = not checked yet
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState(2);
  const [photo, setPhoto] = useState(null);
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

    let cover_image_url = null;

    if (photo) {
      const fileExt = photo.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, photo);

      if (!uploadError) {
        const { data } = supabase.storage.from("listing-images").getPublicUrl(filePath);
        cover_image_url = data.publicUrl;
      }
    }

    const { error } = await supabase.from("listings").insert({
      host_id: user.id,
      title,
      description,
      city,
      price_per_night: Number(price),
      max_guests: Number(maxGuests),
      cover_image_url,
    });

    if (error) {
      setStatus({ type: "error", message: t("error") });
    } else {
      setStatus({ type: "success", message: t("success") });
      setTitle("");
      setDescription("");
      setCity("");
      setPrice("");
      setPhoto(null);
      router.push("../");
      router.refresh();
    }

    setLoading(false);
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

  if (user === undefined) return null; // checking auth state

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display-scoped text-3xl text-majorelleDeep">{t("newListingTitle")}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("titleLabel")}
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("description")}
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("city")}
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
          />
        </label>

        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1 text-sm text-ink/70">
            {t("price")}
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
            />
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm text-ink/70">
            {t("maxGuests")}
            <input
              type="number"
              required
              min={1}
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("photo")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-clay px-6 py-3 font-medium text-sand transition-colors hover:bg-majorelleDeep disabled:opacity-50"
        >
          {t("publish")}
        </button>

        {status.message && (
          <p className={status.type === "error" ? "text-sm text-clay" : "text-sm text-mint"}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}

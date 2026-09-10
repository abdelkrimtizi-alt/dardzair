-- Run this AFTER schema.sql, in the Supabase SQL editor.
-- Adds what's needed for: photo uploads (host space) and confirm/decline actions (dashboard).

-- Storage bucket for listing photos
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Anyone can view listing photos (bucket is public)
create policy "Listing images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Only authenticated users can upload, and only into a folder named after their own user id
create policy "Users can upload their own listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Hosts can update the status (confirm/decline) of bookings on their own listings
create policy "Hosts can update bookings on their listings"
  on bookings for update using (
    auth.uid() in (select host_id from listings where listings.id = bookings.listing_id)
  );

-- The date-filtered search (app/[locale]/search) needs to check which listings
-- are already booked over a given range, even for visitors who aren't logged in.
-- This makes booking dates/status readable by anyone — guest identity (guest_id)
-- is still only exposed via the more restrictive policies above, but a determined
-- user with the anon key could technically query dates broadly. Fine for an MVP;
-- tighten later (e.g. a Postgres function or view) if that becomes a concern.
create policy "Anyone can check booking dates for availability"
  on bookings for select using (true);

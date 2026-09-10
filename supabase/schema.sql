-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

-- Profiles: one row per user, linked to Supabase Auth
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_host boolean default false,
  phone text,
  created_at timestamptz default now()
);

-- Listings: one row per property
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  city text not null,
  address text,
  price_per_night numeric not null check (price_per_night > 0),
  max_guests int default 2,
  cover_image_url text,
  created_at timestamptz default now()
);

-- Bookings: one row per reservation request
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade not null,
  guest_id uuid references profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now(),
  constraint valid_dates check (end_date > start_date)
);

-- Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;

-- Profiles: users can read any profile, but only edit their own
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- Listings: readable by everyone, editable only by their host
create policy "Listings are viewable by everyone"
  on listings for select using (true);

create policy "Hosts can insert their own listings"
  on listings for insert with check (auth.uid() = host_id);

create policy "Hosts can update their own listings"
  on listings for update using (auth.uid() = host_id);

create policy "Hosts can delete their own listings"
  on listings for delete using (auth.uid() = host_id);

-- Bookings: guests see their own bookings, hosts see bookings on their listings
create policy "Guests can view their own bookings"
  on bookings for select using (auth.uid() = guest_id);

create policy "Hosts can view bookings on their listings"
  on bookings for select using (
    auth.uid() in (select host_id from listings where listings.id = bookings.listing_id)
  );

create policy "Guests can create bookings"
  on bookings for insert with check (auth.uid() = guest_id);

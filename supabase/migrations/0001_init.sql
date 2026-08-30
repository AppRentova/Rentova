-- =====================================================================
-- Rentova — Supabase initial schema (Postgres + Auth + Storage)
-- Apply with:  supabase db push   (or paste into the SQL editor)
-- Mirrors prisma/schema.prisma; strings (not native enums) to keep the
-- existing API contract (AUTOMATIC/MANUAL, GASOLINE/..., statuses).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- USERS (profile row, 1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text unique not null,
  phone      text,
  role       text not null default 'USER' check (role in ('USER', 'ADMIN')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- CARS
-- ---------------------------------------------------------------------
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.users (id) on delete cascade,
  brand         text not null,
  model         text not null,
  year          integer not null,
  transmission  text not null check (transmission in ('MANUAL', 'AUTOMATIC')),
  fuel_type     text not null check (fuel_type in ('GASOLINE','DIESEL','ELECTRIC','HYBRID','LPG')),
  seats         integer not null,
  price_per_hour numeric not null default 0,
  price_per_day  numeric not null default 0,
  deposit       numeric not null default 0,
  description   text,
  lat           double precision,
  lng           double precision,
  address       text,
  city          text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists cars_city_idx on public.cars (city);
create index if not exists cars_active_idx on public.cars (is_active);

-- ---------------------------------------------------------------------
-- CAR IMAGES
-- ---------------------------------------------------------------------
create table if not exists public.car_images (
  id         uuid primary key default gen_random_uuid(),
  car_id     uuid not null references public.cars (id) on delete cascade,
  url        text not null,
  is_primary boolean not null default false
);
create index if not exists car_images_car_idx on public.car_images (car_id);

-- ---------------------------------------------------------------------
-- BOOKINGS
-- ---------------------------------------------------------------------
create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  car_id     uuid not null references public.cars (id) on delete cascade,
  renter_id  uuid not null references public.users (id) on delete cascade,
  start_date timestamptz not null,
  end_date   timestamptz not null,
  total_price numeric not null default 0,
  status     text not null default 'CONFIRMED'
             check (status in ('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_car_idx on public.bookings (car_id);
create index if not exists bookings_renter_idx on public.bookings (renter_id);

-- ---------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid unique not null references public.bookings (id),
  reviewer_id uuid not null references public.users (id),
  car_id      uuid not null references public.cars (id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_car_idx on public.reviews (car_id);
create index if not exists reviews_reviewer_idx on public.reviews (reviewer_id);

-- ---------------------------------------------------------------------
-- CAR AVAILABILITY (blocked/unavailable days)
-- ---------------------------------------------------------------------
create table if not exists public.car_availability (
  id           uuid primary key default gen_random_uuid(),
  car_id       uuid not null references public.cars (id) on delete cascade,
  date         date not null,
  is_available boolean not null default true,
  unique (car_id, date)
);
create index if not exists car_avail_car_idx on public.car_availability (car_id);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.users             enable row level security;
alter table public.cars              enable row level security;
alter table public.car_images        enable row level security;
alter table public.bookings          enable row level security;
alter table public.reviews           enable row level security;
alter table public.car_availability  enable row level security;

-- users: public read (name/email needed for listings); self update.
create policy "users_read_public"   on public.users for select using (true);
create policy "users_update_self"   on public.users for update using (auth.uid() = id);

-- cars: anyone reads active cars; owner manages.
create policy "cars_read"       on public.cars for select using (is_active = true or owner_id = auth.uid());
create policy "cars_insert"     on public.cars for insert with check (owner_id = auth.uid());
create policy "cars_update"     on public.cars for update using (owner_id = auth.uid());
create policy "cars_delete"     on public.cars for delete using (owner_id = auth.uid());

-- car_images: public read; owner manages through car ownership.
create policy "car_images_read" on public.car_images for select using (true);
create policy "car_images_write"
  on public.car_images for all
  using (exists (select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()))
  with check (exists (select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()));

-- bookings: renter or car owner can read; renter creates; both update status.
create policy "bookings_read"
  on public.bookings for select
  using (renter_id = auth.uid() or exists (
    select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()));
create policy "bookings_insert" on public.bookings for insert with check (renter_id = auth.uid());
create policy "bookings_update"
  on public.bookings for update
  using (renter_id = auth.uid() or exists (
    select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()));

-- reviews: public read; reviewer creates for their completed booking.
create policy "reviews_read"     on public.reviews for select using (true);
create policy "reviews_insert"   on public.reviews for insert with check (reviewer_id = auth.uid());
create policy "reviews_update"   on public.reviews for update using (reviewer_id = auth.uid());

-- car_availability: public read; owner manages.
create policy "car_avail_read" on public.car_availability for select using (true);
create policy "car_avail_write"
  on public.car_availability for all
  using (exists (select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()))
  with check (exists (select 1 from public.cars c where c.id = car_id and c.owner_id = auth.uid()));

-- ---------------------------------------------------------------------
-- STORAGE: public "car-images" bucket + policies
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

create policy "car_images_public_read"
  on storage.objects for select
  using (bucket_id = 'car-images');

create policy "car_images_auth_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'car-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "car_images_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'car-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

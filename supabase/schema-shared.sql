-- Cali Fades: database for a project you ALREADY use for another site (for example the hair salon's).
-- Everything lives in its own schema called "cali", so nothing collides with the other site's tables.
--
-- Run once: Supabase -> SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- Then run owner-login.local.sql (creates the dashboard login). That's it.
-- Use together with NEXT_PUBLIC_SUPABASE_SCHEMA=cali and NEXT_PUBLIC_SUPABASE_BUCKET=cali-media.

create schema if not exists cali;
grant usage on schema cali to anon, authenticated, service_role;
alter default privileges in schema cali grant all on tables to anon, authenticated, service_role;
alter default privileges in schema cali grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema cali grant all on functions to anon, authenticated, service_role;

------------------------------------------------------------------
-- Admin identity
------------------------------------------------------------------
create table if not exists cali.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table cali.admins enable row level security;

create or replace function cali.is_admin() returns boolean
language sql security definer stable set search_path = cali as $$
  select exists (select 1 from cali.admins where user_id = auth.uid());
$$;

-- The first signed-in user can claim ownership; after that it returns false.
create or replace function cali.claim_admin() returns boolean
language plpgsql security definer set search_path = cali as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from cali.admins) then return false; end if;
  insert into cali.admins (user_id) values (auth.uid());
  return true;
end $$;
revoke all on function cali.claim_admin() from public, anon;
grant execute on function cali.claim_admin() to authenticated;
grant execute on function cali.is_admin() to anon, authenticated;

drop policy if exists "admins read self" on cali.admins;
create policy "admins read self" on cali.admins for select to authenticated using (user_id = auth.uid());

------------------------------------------------------------------
-- Content tables
------------------------------------------------------------------
create table if not exists cali.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb
);
insert into cali.site_settings (id) values (1) on conflict do nothing;

create table if not exists cali.services (
  id text primary key,
  name text not null,
  category text not null default 'Fades',
  blurb text not null default '',
  price numeric not null default 0,
  minutes int not null default 60,
  deposit numeric not null default 0,
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.addons (
  id text primary key,
  name text not null,
  blurb text not null default '',
  price numeric not null default 0,
  minutes int not null default 15,
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.looks (
  id text primary key,
  title text not null,
  category text not null default 'Fades',
  kind text not null default 'skin',
  palette text[] not null default '{#111113,#8a5a3c,#e63946}',
  service_id text,
  story text not null default '',
  hours text not null default '',
  seed int not null default 1,
  image_url text,
  before_url text,
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service text not null default '',
  quote text not null,
  stars int not null default 5 check (stars between 1 and 5),
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.faqs (
  id uuid primary key default gen_random_uuid(),
  q text not null,
  a text not null,
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo_url text,
  instagram text not null default '',
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists cali.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  service_id text not null,
  service_name text not null,
  addon_ids text[] not null default '{}',
  date date not null,
  time text not null,
  minutes int not null,
  total numeric not null default 0,
  deposit numeric not null default 0,
  name text not null,
  email text not null,
  phone text not null,
  first_visit boolean not null default true,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);
-- Hard stop against two clients grabbing the exact same start time.
create unique index if not exists bookings_slot_unique on cali.bookings (date, time) where status <> 'cancelled';

------------------------------------------------------------------
-- Spanish translations (one jsonb per row: {"name": "...", "blurb": "..."})
------------------------------------------------------------------
alter table if exists cali.services add column if not exists es jsonb not null default '{}'::jsonb;
alter table if exists cali.addons   add column if not exists es jsonb not null default '{}'::jsonb;
alter table if exists cali.looks    add column if not exists es jsonb not null default '{}'::jsonb;
alter table if exists cali.reviews  add column if not exists es jsonb not null default '{}'::jsonb;
alter table if exists cali.faqs     add column if not exists es jsonb not null default '{}'::jsonb;
alter table if exists cali.team     add column if not exists es jsonb not null default '{}'::jsonb;

------------------------------------------------------------------
-- Row level security
------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['services','addons','looks','reviews','faqs','team'] loop
    execute format('alter table cali.%I enable row level security', t);
    execute format('drop policy if exists "public read" on cali.%I', t);
    execute format('create policy "public read" on cali.%I for select to anon, authenticated using (active or cali.is_admin())', t);
    execute format('drop policy if exists "admin write" on cali.%I', t);
    execute format('create policy "admin write" on cali.%I for all to authenticated using (cali.is_admin()) with check (cali.is_admin())', t);
  end loop;
end $$;

alter table cali.site_settings enable row level security;
drop policy if exists "public read" on cali.site_settings;
create policy "public read" on cali.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin write" on cali.site_settings;
create policy "admin write" on cali.site_settings for all to authenticated using (cali.is_admin()) with check (cali.is_admin());

alter table cali.bookings enable row level security;
drop policy if exists "anyone can request" on cali.bookings;
create policy "anyone can request" on cali.bookings for insert to anon, authenticated
  with check (status = 'pending' and char_length(name) between 2 and 80 and char_length(notes) <= 1000);
drop policy if exists "admin manage" on cali.bookings;
create policy "admin manage" on cali.bookings for all to authenticated using (cali.is_admin()) with check (cali.is_admin());

-- Visitors can see WHICH times are busy, never WHO booked them.
create or replace function cali.busy_slots(from_date date, to_date date)
returns table (date date, "time" text, minutes int)
language sql security definer stable set search_path = cali as $$
  select b.date, b.time, b.minutes from cali.bookings b
  where b.status <> 'cancelled' and b.date between from_date and to_date;
$$;
grant execute on function cali.busy_slots(date, date) to anon, authenticated;

------------------------------------------------------------------
-- Image storage (portrait, portfolio photos)
------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('cali-media', 'cali-media', true)
on conflict (id) do update set public = true;

drop policy if exists "cali media public read" on storage.objects;
create policy "cali media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'cali-media');
drop policy if exists "cali media admin insert" on storage.objects;
create policy "cali media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'cali-media' and cali.is_admin());
drop policy if exists "cali media admin update" on storage.objects;
create policy "cali media admin update" on storage.objects for update to authenticated using (bucket_id = 'cali-media' and cali.is_admin());
drop policy if exists "cali media admin delete" on storage.objects;
create policy "cali media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'cali-media' and cali.is_admin());

-- Safety net for tables/functions created above.
grant all on all tables in schema cali to anon, authenticated, service_role;
grant all on all sequences in schema cali to anon, authenticated, service_role;
grant execute on all functions in schema cali to anon, authenticated, service_role;
revoke execute on function cali.claim_admin() from anon;

-- Make the Data API serve the "cali" schema (same as ticking it under Project Settings -> Data API ->
-- Exposed schemas), so there is no manual dashboard step. If this block is not allowed on your project,
-- add "cali" there by hand and everything else still works.
do $$
declare cur text;
begin
  select split_part(c, '=', 2) into cur
  from pg_roles r, unnest(r.rolconfig) c
  where r.rolname = 'authenticator' and c like 'pgrst.db_schemas=%';
  if cur is null then cur := 'public, graphql_public'; end if;
  if position('cali' in cur) = 0 then
    execute format('alter role authenticator set pgrst.db_schemas = %L', cur || ', cali');
  end if;
exception when others then
  raise notice 'Could not auto-expose the cali schema (%). Add it in Project Settings -> Data API -> Exposed schemas.', sqlerrm;
end $$;
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

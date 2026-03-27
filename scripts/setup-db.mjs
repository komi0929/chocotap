// Run DB setup via Supabase REST (requires service_role key or use SQL editor)
// This script creates all tables, RLS policies, and storage bucket

const SUPABASE_URL = "https://hzdvsywmsrsstmilerzc.supabase.co";

const SQL = `
-- ===== PROFILES =====
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- ===== CHECKINS =====
create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  shop_name text not null,
  prefecture text,
  memo text,
  created_at timestamptz default now(),
  unique(user_id, shop_name)
);

-- ===== PHOTOS =====
create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  checkin_id uuid references checkins on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  storage_path text not null,
  caption text,
  created_at timestamptz default now()
);

-- ===== RLS =====
alter table profiles enable row level security;
alter table checkins enable row level security;
alter table photos enable row level security;

-- Profiles policies
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Checkins policies
create policy "Users read own checkins" on checkins for select using (auth.uid() = user_id);
create policy "Users insert own checkins" on checkins for insert with check (auth.uid() = user_id);
create policy "Users delete own checkins" on checkins for delete using (auth.uid() = user_id);
create policy "Users update own checkins" on checkins for update using (auth.uid() = user_id);

-- Photos policies
create policy "Users read own photos" on photos for select using (auth.uid() = user_id);
create policy "Users insert own photos" on photos for insert with check (auth.uid() = user_id);
create policy "Users delete own photos" on photos for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`;

console.log("=== chocotap DB Schema ===");
console.log("Copy the SQL below and paste it into Supabase SQL Editor:");
console.log("URL: " + SUPABASE_URL + "/project/hzdvsywmsrsstmilerzc/sql/new");
console.log("");
console.log(SQL);
console.log("");
console.log("Then create a Storage bucket named 'checkin-photos' with:");
console.log("  - Public: Yes");
console.log("  - File size limit: 5MB");
console.log("  - Allowed MIME types: image/jpeg, image/png, image/webp");

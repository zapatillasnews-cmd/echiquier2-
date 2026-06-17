-- ============================================================
-- Schema Supabase pour l'app Echiquier
-- A coller dans : Supabase > SQL Editor > New query > Run
-- Securise par Row Level Security : chaque user ne voit que ses donnees.
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Cree automatiquement un profil a l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- games (parties + PGN) ----------
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  white text,
  black text,
  result text,                       -- '1-0', '0-1', '1/2-1/2', '*'
  event text,
  game_date text,
  eco text,
  opening_name text,
  pgn text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists games_user_created_idx on public.games (user_id, created_at desc);

-- ---------- studies (arbres de coups / ouvertures) ----------
create table if not exists public.studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text,
  color text not null default 'white',   -- perspective d'etude
  tree jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studies_user_idx on public.studies (user_id, created_at desc);

-- ---------- srs_cards (revision espacee) ----------
create table if not exists public.srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  study_id uuid references public.studies on delete cascade,
  fen text not null,
  expected_uci text not null,
  line_name text,
  due_date timestamptz not null default now(),
  interval_days int not null default 0,
  ease real not null default 2.5,
  reps int not null default 0
);
create index if not exists srs_due_idx on public.srs_cards (user_id, due_date);

-- ---------- puzzles (sous-ensemble Lichess) ----------
create table if not exists public.puzzles (
  id text primary key,
  fen text not null,
  moves text not null,               -- coups UCI separes par espace
  rating int,
  themes text[] not null default '{}',
  popularity int
);

-- ---------- puzzle_attempts ----------
create table if not exists public.puzzle_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  puzzle_id text references public.puzzles on delete cascade,
  success boolean not null,
  ms int,
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.puzzle_attempts (user_id, created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.games           enable row level security;
alter table public.studies         enable row level security;
alter table public.srs_cards       enable row level security;
alter table public.puzzle_attempts enable row level security;
alter table public.puzzles         enable row level security;

-- Helper : policy "owner" sur une table donnee
-- profiles
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- games
drop policy if exists "own games" on public.games;
create policy "own games" on public.games
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- studies
drop policy if exists "own studies" on public.studies;
create policy "own studies" on public.studies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- srs_cards
drop policy if exists "own cards" on public.srs_cards;
create policy "own cards" on public.srs_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- puzzle_attempts
drop policy if exists "own attempts" on public.puzzle_attempts;
create policy "own attempts" on public.puzzle_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- puzzles : lecture pour tous les utilisateurs connectes (catalogue partage)
drop policy if exists "read puzzles" on public.puzzles;
create policy "read puzzles" on public.puzzles
  for select using (auth.role() = 'authenticated');

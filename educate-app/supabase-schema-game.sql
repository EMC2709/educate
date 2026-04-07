-- Run this in Supabase SQL editor to add game/social tables

-- Profiles: stores XP, level, display name
create table if not exists public.profiles (
  user_id       text primary key,
  display_name  text not null default 'Student',
  avatar_url    text,
  xp            integer not null default 0,
  level         integer not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "service role full access on profiles" on public.profiles using (true) with check (true);

-- Friendships: bidirectional friend system
create table if not exists public.friendships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  text not null,
  addressee_id  text not null,
  status        text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at    timestamptz not null default now(),
  unique (requester_id, addressee_id)
);
alter table public.friendships enable row level security;
create policy "service role full access on friendships" on public.friendships using (true) with check (true);

-- Game sessions: tracks multiplayer game state
create table if not exists public.game_sessions (
  id            uuid primary key default gen_random_uuid(),
  game_type     text not null default 'tic-tac-toe',
  player_x      text not null,
  player_o      text,
  board_state   jsonb not null default '["","","","","","","","",""]',
  current_turn  text not null default 'X',
  winner        text,
  subject       text not null,
  status        text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.game_sessions enable row level security;
create policy "service role full access on game_sessions" on public.game_sessions using (true) with check (true);

-- User subjects: stores each user's chosen subjects + exam board
create table if not exists public.user_subjects (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,
  subject       text not null,
  board         text not null,
  created_at    timestamptz not null default now(),
  unique (user_id, subject, board)
);
alter table public.user_subjects enable row level security;
create policy "service role full access on user_subjects" on public.user_subjects using (true) with check (true);
create index if not exists idx_user_subjects_user on public.user_subjects (user_id);

-- Index for leaderboard queries
create index if not exists idx_profiles_xp on public.profiles (xp desc);
create index if not exists idx_friendships_users on public.friendships (requester_id, addressee_id, status);

create extension if not exists pgcrypto;

create table if not exists public.staff_members (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

create table if not exists public.pre_anamneses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(name) between 2 and 100),
  age smallint not null check (age between 1 and 120),
  city text not null check (city in ('Recife', 'Surubim', 'Ainda não decidi')),
  interests jsonb not null default '[]'::jsonb,
  objective text not null default '',
  health jsonb not null default '{}'::jsonb,
  notes text not null default '',
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'agendado', 'arquivado')),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pre_anamneses_created_at_idx on public.pre_anamneses (created_at desc);
create index if not exists pre_anamneses_status_idx on public.pre_anamneses (status);

alter table public.staff_members enable row level security;
alter table public.pre_anamneses enable row level security;
revoke all on table public.staff_members from anon, authenticated;
revoke all on table public.pre_anamneses from anon, authenticated;
grant select on table public.staff_members to authenticated;
grant select, update on table public.pre_anamneses to authenticated;

create policy "Staff can verify own membership" on public.staff_members for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "Staff can read pre anamneses" on public.pre_anamneses for select to authenticated
using (exists (select 1 from public.staff_members s where lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))));

create policy "Staff can update pre anamneses" on public.pre_anamneses for update to authenticated
using (exists (select 1 from public.staff_members s where lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))))
with check (exists (select 1 from public.staff_members s where lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))));

create or replace function public.set_pre_anamnese_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists set_pre_anamnese_updated_at on public.pre_anamneses;
create trigger set_pre_anamnese_updated_at before update on public.pre_anamneses for each row execute function public.set_pre_anamnese_updated_at();

insert into public.staff_members(email) values ('paulabrito.anamnese@outlook.com')
on conflict (email) do nothing;

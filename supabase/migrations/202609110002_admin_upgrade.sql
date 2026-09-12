alter table public.pre_anamneses
  add column if not exists whatsapp text not null default '',
  add column if not exists internal_notes text not null default '',
  add column if not exists priority boolean not null default false,
  add column if not exists appointment_at timestamptz;

alter table public.pre_anamneses
  drop constraint if exists pre_anamneses_whatsapp_check,
  add constraint pre_anamneses_whatsapp_check
  check (whatsapp = '' or whatsapp ~ '^55[0-9]{10,11}$');

alter table public.pre_anamneses
  drop constraint if exists pre_anamneses_internal_notes_check,
  add constraint pre_anamneses_internal_notes_check
  check (char_length(internal_notes) <= 1200);

create index if not exists pre_anamneses_priority_idx
  on public.pre_anamneses (priority, created_at desc);

insert into public.staff_members (email)
values ('paula_erika@hotmail.com')
on conflict (email) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'pre_anamneses'
  ) then
    alter publication supabase_realtime add table public.pre_anamneses;
  end if;
end
$$;

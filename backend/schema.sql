create extension if not exists "pgcrypto";

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email,''), '@', 1), 'there'))
  on conflict (id) do nothing;
  insert into public.ai_permissions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 timezone text default 'Africa/Nairobi',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists goals (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text not null, description text,
 target_amount numeric(12,2), current_amount numeric(12,2) not null default 0,
 deadline date,
 status text not null default 'active' check (status in ('active','completed','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists tasks (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text not null, description text, due_at timestamptz,
 category text not null default 'personal' check (category in ('study','career','personal')),
 completed boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists expenses (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 category text not null, amount numeric(12,2) not null check (amount >= 0),
 note text, occurred_on date not null default current_date, created_at timestamptz not null default now()
);

create table if not exists routines (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text not null, time_of_day text not null check (time_of_day in ('morning','evening','custom')),
 created_at timestamptz not null default now()
);

create table if not exists routine_items (
 id uuid primary key default gen_random_uuid(),
 routine_id uuid not null references routines(id) on delete cascade,
 title text not null, sort_order integer not null default 0, completed boolean not null default false
);

create table if not exists important_dates (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text not null,
 date_on date not null,
 notes text,
 created_at timestamptz not null default now()
);

create table if not exists relationship_notes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text,
 body text not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create index if not exists important_dates_user_date_idx on important_dates(user_id,date_on);
create index if not exists relationship_notes_user_date_idx on relationship_notes(user_id,created_at desc);

create table if not exists journal_entries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 body text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists mood_checkins (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 mood text not null check (mood in ('Great','Okay','Low','Tired')),
 note text, recorded_at timestamptz not null default now()
);

create table if not exists water_logs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 glasses integer not null check (glasses between 1 and 8),
 recorded_on date not null default current_date, created_at timestamptz not null default now()
);

create table if not exists wellness_checkins (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 energy text check (energy in ('Low','Okay','Good','Full')),
 sleep_minutes integer check (sleep_minutes >= 0),
 movement_minutes integer check (movement_minutes >= 0),
 reflection text,
 recorded_on date not null default current_date,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists wellness_user_date_idx on wellness_checkins(user_id,recorded_on);

create table if not exists cycles (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 start_date date not null, end_date date, flow text,
 confirmed boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists cycle_symptoms (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 cycle_id uuid references cycles(id) on delete set null,
 symptom text not null,
 recorded_on date not null default current_date,
 created_at timestamptz not null default now()
);

create index if not exists cycle_symptoms_user_date_idx on cycle_symptoms(user_id,recorded_on desc);

create table if not exists cycle_predictions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 predicted_start_date date not null,
 confidence text check (confidence in ('low','medium','high')),
 created_at timestamptz not null default now()
);

create table if not exists reminders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 title text not null,
 due_at timestamptz not null,
 source text not null default 'manual' check (source in ('manual','cycle','routine','study','relationship','ai')),
 completed boolean not null default false,
 created_at timestamptz not null default now()
);
create index if not exists reminders_user_due_idx on reminders(user_id,due_at);
alter table reminders enable row level security;
drop policy if exists reminders_own on reminders;
create policy reminders_own on reminders for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists ai_conversations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade, created_at timestamptz not null default now()
);

create table if not exists ai_messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references ai_conversations(id) on delete cascade,
 role text not null check (role in ('user','assistant','tool')),
 content text not null, created_at timestamptz not null default now()
);

create table if not exists ai_action_logs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 conversation_id uuid references ai_conversations(id) on delete set null,
 action_type text not null, action_payload jsonb not null default '{}'::jsonb,
 status text not null check (status in ('requested','approved','completed','rejected','failed')),
 created_at timestamptz not null default now()
);

create table if not exists ai_permissions (
 user_id uuid primary key references profiles(id) on delete cascade,
 access_goals boolean not null default true, access_tasks boolean not null default true,
 access_money boolean not null default false, access_wellness boolean not null default false,
 access_cycle boolean not null default false, access_journal boolean not null default false,
 can_create_reminders boolean not null default false, can_create_goals boolean not null default false,
 can_add_expenses boolean not null default false, can_edit_journal boolean not null default false,
 updated_at timestamptz not null default now()
);

-- Forward-compatible permission columns for existing databases.
alter table ai_permissions add column if not exists access_routines boolean not null default false;
alter table ai_permissions add column if not exists can_create_tasks boolean not null default false;

create index if not exists goals_user_idx on goals(user_id);
create index if not exists tasks_user_due_idx on tasks(user_id,due_at);
create index if not exists expenses_user_date_idx on expenses(user_id,occurred_on);
create index if not exists journal_user_date_idx on journal_entries(user_id,created_at desc);
create index if not exists cycles_user_date_idx on cycles(user_id,start_date desc);
create index if not exists ai_messages_conversation_idx on ai_messages(conversation_id,created_at);

-- Row-level security: every user-owned table is isolated to auth.uid().
drop policy if exists profiles_own on profiles;
create policy profiles_own on profiles for all using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists goals_own on goals;
create policy goals_own on goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists tasks_own on tasks;
create policy tasks_own on tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists expenses_own on expenses;
create policy expenses_own on expenses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists routines_own on routines;
create policy routines_own on routines for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists routine_items_own on routine_items;
create policy routine_items_own on routine_items for all using (routine_id in (select id from routines where user_id = auth.uid())) with check (routine_id in (select id from routines where user_id = auth.uid()));
drop policy if exists important_dates_own on important_dates;
create policy important_dates_own on important_dates for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists relationship_notes_own on relationship_notes;
create policy relationship_notes_own on relationship_notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists journal_own on journal_entries;
create policy journal_own on journal_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists mood_own on mood_checkins;
create policy mood_own on mood_checkins for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists water_own on water_logs;
create policy water_own on water_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists wellness_own on wellness_checkins;
create policy wellness_own on wellness_checkins for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists cycles_own on cycles;
create policy cycles_own on cycles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists cycle_symptoms_own on cycle_symptoms;
create policy cycle_symptoms_own on cycle_symptoms for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists predictions_own on cycle_predictions;
create policy predictions_own on cycle_predictions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists ai_conversations_own on ai_conversations;
create policy ai_conversations_own on ai_conversations for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists ai_messages_own on ai_messages;
create policy ai_messages_own on ai_messages for all using (conversation_id in (select id from ai_conversations where user_id = auth.uid()));
drop policy if exists ai_actions_own on ai_action_logs;
create policy ai_actions_own on ai_action_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists ai_permissions_own on ai_permissions;
create policy ai_permissions_own on ai_permissions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

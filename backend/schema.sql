create extension if not exists "pgcrypto";

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

create table if not exists cycles (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 start_date date not null, end_date date, flow text,
 confirmed boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists cycle_predictions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references profiles(id) on delete cascade,
 predicted_start_date date not null,
 confidence text check (confidence in ('low','medium','high')),
 created_at timestamptz not null default now()
);

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

create index if not exists goals_user_idx on goals(user_id);
create index if not exists tasks_user_due_idx on tasks(user_id,due_at);
create index if not exists expenses_user_date_idx on expenses(user_id,occurred_on);
create index if not exists journal_user_date_idx on journal_entries(user_id,created_at desc);
create index if not exists cycles_user_date_idx on cycles(user_id,start_date desc);
create index if not exists ai_messages_conversation_idx on ai_messages(conversation_id,created_at);

-- Row-level security: every user-owned table is isolated to auth.uid().
alter table profiles enable row level security;
alter table goals enable row level security;
alter table tasks enable row level security;
alter table expenses enable row level security;
alter table routines enable row level security;
alter table journal_entries enable row level security;
alter table mood_checkins enable row level security;
alter table water_logs enable row level security;
alter table cycles enable row level security;
alter table cycle_predictions enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table ai_action_logs enable row level security;
alter table ai_permissions enable row level security;

create policy if not exists profiles_own on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy if not exists goals_own on goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists tasks_own on tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists expenses_own on expenses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists routines_own on routines for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists journal_own on journal_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists mood_own on mood_checkins for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists water_own on water_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists cycles_own on cycles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists predictions_own on cycle_predictions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists ai_conversations_own on ai_conversations for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists ai_messages_own on ai_messages for all using (conversation_id in (select id from ai_conversations where user_id = auth.uid()));
create policy if not exists ai_actions_own on ai_action_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy if not exists ai_permissions_own on ai_permissions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

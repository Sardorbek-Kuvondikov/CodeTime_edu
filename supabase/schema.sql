create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.coin_students (
  id text primary key,
  first_name text not null,
  last_name text not null,
  age integer not null check (age between 1 and 100),
  phone text not null,
  direction text not null check (
    direction in (
      'Web dasturlash',
      'IT Kids',
      'Robototexnika',
      'Kiberxavfsizlik'
    )
  ),
  coins integer not null default 0 check (coins >= 0),
  level text not null check (
    level in ('Starter', 'Bronze', 'Silver', 'Gold', 'Platinum')
  ),
  progress integer not null default 0 check (progress between 0 and 100),
  joined_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coin_students_set_updated_at on public.coin_students;

create trigger coin_students_set_updated_at
before update on public.coin_students
for each row
execute function public.set_updated_at();

alter table public.teacher_profiles enable row level security;
alter table public.coin_students enable row level security;

drop policy if exists "teacher profiles read own profile" on public.teacher_profiles;
drop policy if exists "coin students public read" on public.coin_students;
drop policy if exists "coin students teacher insert" on public.coin_students;
drop policy if exists "coin students teacher update" on public.coin_students;
drop policy if exists "coin students teacher delete" on public.coin_students;

create policy "teacher profiles read own profile"
on public.teacher_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "coin students public read"
on public.coin_students
for select
to anon, authenticated
using (true);

create policy "coin students teacher insert"
on public.coin_students
for insert
to authenticated
with check (
  exists (
    select 1
    from public.teacher_profiles
    where teacher_profiles.user_id = auth.uid()
  )
);

create policy "coin students teacher update"
on public.coin_students
for update
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles
    where teacher_profiles.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.teacher_profiles
    where teacher_profiles.user_id = auth.uid()
  )
);

create policy "coin students teacher delete"
on public.coin_students
for delete
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles
    where teacher_profiles.user_id = auth.uid()
  )
);

insert into public.coin_students (
  id,
  first_name,
  last_name,
  age,
  phone,
  direction,
  coins,
  level,
  progress,
  joined_at
)
values
  ('azizbek-karimov', 'Azizbek', 'Karimov', 16, '+998 90 123 45 67', 'Web dasturlash', 1280, 'Gold', 86, '2026-01-10'),
  ('jasurbek-rasulov', 'Jasurbek', 'Rasulov', 15, '+998 91 234 56 78', 'Robototexnika', 1110, 'Gold', 81, '2026-02-12'),
  ('madina-tursunova', 'Madina', 'Tursunova', 17, '+998 93 345 67 89', 'Kiberxavfsizlik', 1045, 'Silver', 74, '2026-01-18'),
  ('imrona-qodirova', 'Imrona', 'Qodirova', 14, '+998 94 456 78 90', 'Robototexnika', 940, 'Silver', 69, '2026-03-08'),
  ('javohir-sobirov', 'Javohir', 'Sobirov', 16, '+998 95 567 89 01', 'Web dasturlash', 920, 'Silver', 68, '2026-02-21'),
  ('sardor-olimov', 'Sardor', 'Olimov', 15, '+998 97 678 90 12', 'Web dasturlash', 870, 'Silver', 63, '2026-04-05'),
  ('diyorbek-hakimov', 'Diyorbek', 'Hakimov', 17, '+998 88 789 01 23', 'Kiberxavfsizlik', 830, 'Bronze', 61, '2026-03-16'),
  ('sevinch-akmalova', 'Sevinch', 'Akmalova', 12, '+998 99 890 12 34', 'IT Kids', 760, 'Bronze', 55, '2026-01-25'),
  ('muhammadali-ergashev', 'Muhammadali', 'Ergashev', 11, '+998 90 901 23 45', 'IT Kids', 690, 'Bronze', 48, '2026-04-13'),
  ('malika-nurmatova', 'Malika', 'Nurmatova', 10, '+998 91 012 34 56', 'IT Kids', 620, 'Starter', 42, '2026-05-09')
on conflict (id) do nothing;

-- Auth > Users bo'limida teacher user yarating, masalan:
-- anvar@codetime.local / kuchli-parol
-- Keyin teacher huquqini berish uchun quyidagini emailga moslab run qiling:
--
-- insert into public.teacher_profiles (user_id, display_name)
-- select id, 'Anvar'
-- from auth.users
-- where email = 'anvar@codetime.local'
-- on conflict (user_id) do update set display_name = excluded.display_name;


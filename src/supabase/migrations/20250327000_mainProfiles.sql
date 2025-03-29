create table public.profiles (
  id uuid not null,
  updated_at timestamp with time zone null,
  username text null,
  full_name text null,
  avatar_url text null,
  website text null,
  email text null,
  age numeric null default '18'::numeric,
  character text null default 'Elf'::text,
  address text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_age_check check ((age > (17)::numeric)),
  constraint username_length check ((char_length(username) >= 3))
) TABLESPACE pg_default;
create table public.posts (
  id uuid not null default gen_random_uuid (),
  title text not null,
  content text not null,
  category text not null,
  user_id uuid null,
  created_at timestamp without time zone null default now(),
  category_group text null,
  image_url text null,
  constraint posts_pkey primary key (id),
  constraint posts_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.posts_categories (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  category_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);
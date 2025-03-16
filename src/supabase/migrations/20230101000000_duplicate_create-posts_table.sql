-- Create the profiles table
CREATE TABLE
  public.profiles (
    id UUID REFERENCES auth.users (id) PRIMARY KEY,
    full_name TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL
  );

-- Create the posts table
CREATE TABLE
  public.posts (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles (id) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE ('utc'::text, NOW()) NOT NULL
  );

-- Add new category_group column to posts table
ALTER TABLE posts ADD COLUMN category_group TEXT;

alter table posts add column image_url text;

-- Update existing records to maintain backwards compatibility
UPDATE posts SET category_group = category WHERE category_group IS NULL;

-- Add an index for the new column
CREATE INDEX posts_category_group_idx ON posts (category_group);

-- Update RLS policies to include the new column
ALTER POLICY "Allow users to read all posts" ON posts FOR SELECT USING (true);

ALTER POLICY "Allow users to insert their own posts" ON posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Allow users to update their own posts" ON posts 
  FOR UPDATE USING (auth.uid() = user_id);


-- Check if category_group exists and add it if it doesn't
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'posts' 
    AND column_name = 'category_group'
  ) THEN 
    ALTER TABLE public.posts ADD COLUMN category_group TEXT;
    CREATE INDEX posts_category_group_idx ON public.posts (category_group);
  END IF;
END $$;

-- Update existing records
UPDATE public.posts 
SET category_group = category 
WHERE category_group IS NULL;

-- Create indexes for faster queries
CREATE INDEX posts_profile_id_idx ON public.posts (profile_id);

CREATE INDEX posts_category_idx ON public.posts (category);

-- Create a function to automatically update the updated_at column
CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to call the function before each update
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON public.profiles FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_posts_updated_at BEFORE
UPDATE ON public.posts FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- Create a trigger to automatically create a profile when a new user signs up
CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.email, 'https://example.com/default-avatar.png');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user ();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT
WITH
  CHECK (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
  USING (auth.uid () = id);

-- Create policies for the posts table
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR
SELECT
  USING (true);

CREATE POLICY "Users can insert their own posts" ON public.posts FOR INSERT
WITH
  CHECK (auth.uid () = profile_id);

CREATE POLICY "Users can update their own posts" ON public.posts
FOR UPDATE
  USING (auth.uid () = profile_id);

CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid () = profile_id);

-- Check the structure of the posts table
SELECT
  column_name,
  data_type,
  is_nullable
FROM
  information_schema.columns
WHERE
  table_name = 'posts';

-- Check the structure of the profiles table
SELECT
  column_name,
  data_type,
  is_nullable
FROM
  information_schema.columns
WHERE
  table_name = 'profiles';

-- Verify the foreign key relationship
SELECT
  tc.table_schema,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE
  tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'posts';

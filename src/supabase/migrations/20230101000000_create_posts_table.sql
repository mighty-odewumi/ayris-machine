-- Create the posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all posts
CREATE POLICY "Allow users to read all posts" ON posts
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own posts
CREATE POLICY "Allow users to insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own posts
CREATE POLICY "Allow users to update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own posts
CREATE POLICY "Allow users to delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index on the category column for faster queries
CREATE INDEX posts_category_idx ON posts (category);

-- Create an index on the user_id column for faster queries
CREATE INDEX posts_user_id_idx ON posts (user_id);


-- Add new category_group column
ALTER TABLE posts ADD COLUMN category_group TEXT;

-- Update existing records to maintain backwards compatibility
UPDATE posts SET category_group = category WHERE category_group IS NULL;

-- Add an index for the new column
CREATE INDEX posts_category_group_idx ON posts (category_group);
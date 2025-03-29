-- Create Categories Table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Posts Table
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL, -- Using TEXT for your category dropdown values
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name) VALUES ('Arts'), ('Location'), ('Era/Style');

-- Update RLS policies to include the new column
ALTER POLICY "Allow users to read all posts" ON posts FOR SELECT USING (true);

ALTER POLICY "Allow users to insert their own posts" ON posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Allow users to update their own posts" ON posts 
  FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE posts
DROP CONSTRAINT posts_user_id_fkey;

ALTER TABLE posts
ADD CONSTRAINT posts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles (id)
ON DELETE SET NULL;


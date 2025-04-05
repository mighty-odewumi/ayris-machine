// types/post.ts
export interface Category {
  id: string;
  name: string;
  group_name?: string;
  group?: string;
}

export interface PostCategory {
  category: Category;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  categories: PostCategory[];
  isLegacy?: boolean;
}

// Database types for better type safety with Supabase
export interface DatabasePost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  category: string | null;
  category_group: string | null;
}

export interface DatabasePostCategory {
  post_id: string;
  category_id: string;
  category_name: string;
  category_group: string | null;
}
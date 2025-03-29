import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from "next/navigation";

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    // Fetch posts and include posts_categories relation
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        posts_categories (
          post_id,
          category_id,
          category_name,
          category_group
        )
      `)
      .eq('id', id)
      .single()
    
    if (postError) throw postError;
    if (!post) {
      notFound();
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', post.user_id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
    }

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <Image 
            src={profile?.avatar_url || '/avatar.svg'} 
            alt={profile?.full_name || 'User'} 
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>{profile?.full_name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          
          {/* Display category section */}
          {post.posts_categories && post.posts_categories.length > 0 ? (
            <div className="flex items-center">
              <span className="mx-2">•</span>
              <div className="flex flex-wrap gap-1">
                {post.posts_categories.map((category: { id: string, category_name: string, category_id: string }) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category.category_id.toLowerCase()}`}
                    className="text-indigo-400 hover:underline mr-1"
                  >
                    {category.category_name}
                    {post.posts_categories.indexOf(category) < post.posts_categories.length - 1 && ","}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Fallback to the primary category if no categories in the junction table
            <>
              <span className="mx-2">•</span>
              <Link href={`/category/${post.category?.toLowerCase()}`} className="text-indigo-400 hover:underline">
                {post.category}
              </Link>
            </>
          )}
        </div>
        <div className="prose prose-invert">
          {post.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="text-white">{paragraph}</p>
          ))}
        </div>
      </div>
    )

  } catch (error) {
    console.error('Error in Post component:', error);
    throw error;
  }
}
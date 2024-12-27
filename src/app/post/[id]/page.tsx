import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from "next/navigation";

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    // Fetch posts first
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
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
          <span className="mx-2">•</span>
          <Link href={`/category/${post.category.toLowerCase()}`} className="text-indigo-400 hover:underline">
            {post.category}
          </Link>
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
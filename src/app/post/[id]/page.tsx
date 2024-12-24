import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Log the raw ID
  console.log('Raw ID from params:', params.id);
  
  // If your IDs in the database are UUIDs, verify the format
  try {
    // Try fetching without any ID transformation first
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()
    
    console.log('Post fetch result:', { post, error });

    if (error) throw error;
    if (!post) {
      console.log('Post not found');
      notFound();
    }

    // If we found the post, now try to get its profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', post.user_id)
      .single()
    
    console.log('Profile fetch result:', { profile, profileError });

    // Combine the data
    const fullPost = {
      ...post,
      profiles: profile
    };

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">{fullPost.title}</h1>
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <Image 
            src={fullPost.profiles?.avatar_url || '/placeholder.svg?height=32&width=32'} 
            alt={fullPost.profiles?.full_name || 'User'} 
            className="w-8 h-8 rounded-full mr-2"
            width={32}
            height={32}
          />
          <span>{fullPost.profiles?.full_name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(fullPost.created_at).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <Link href={`/category/${fullPost.category.toLowerCase()}`} className="text-indigo-400 hover:underline">
            {fullPost.category}
          </Link>
        </div>
        <div className="prose prose-invert">
          {fullPost.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    )

  } catch (error) {
    console.error('Error in Post component:', error);
    throw error;
  }
}
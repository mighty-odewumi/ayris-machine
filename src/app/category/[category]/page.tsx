import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Category({ params }: { params: { category: string } }) {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('category', params.category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading posts</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white capitalize">{params.category} Posts</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-400 mb-2">{post.content.substring(0, 150)}...</p>
            <div className="flex items-center text-sm text-gray-500">
              <img 
                src={post.profiles.avatar_url || '/placeholder.svg?height=32&width=32'} 
                alt={post.profiles.full_name} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{post.profiles.full_name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

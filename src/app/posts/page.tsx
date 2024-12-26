import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Posts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading posts</div>
  }

  const categories = [...new Set(posts.map(post => post.category))]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">All Posts</h1>
        {user && (
          <Link 
            href="/write" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Create New Post
          </Link>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-white">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Link 
              key={category} 
              href={`/category/${category.toLowerCase()}`}
              className="px-3 py-1 bg-gray-700 text-white rounded-full hover:bg-gray-600"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-400 mb-2">{post.content.substring(0, 150)}...</p>
            <div className="flex items-center text-sm text-gray-500">
              <Image 
                src={post.profiles.avatar_url || '/placeholder.svg?height=32&width=32'} 
                alt={post.profiles.full_name} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{post.profiles.full_name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <Link href={`/category/${post.category.toLowerCase()}`} className="text-indigo-400 hover:underline">
                {post.category}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

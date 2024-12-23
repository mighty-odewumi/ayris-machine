import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Profiles() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(id, full_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading posts</div>
  }

  const categories = [...new Set(posts.map(post => post.category))]
  const users = [...new Set(posts.map(post => post.profiles.id))]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Profiles</h1>
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
      <div className="mb-4">
        <p className="text-white">Total Posts: {posts.length}</p>
        <p className="text-white">Total Users: {users.length}</p>
      </div>
      <div className="space-y-8">
        {users.map(userId => {
          const userPosts = posts.filter(post => post.profiles.id === userId)
          const user = userPosts[0].profiles
          return (
            <div key={userId} className="border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={user.avatar_url || '/placeholder.svg?height=48&width=48'} 
                  alt={user.full_name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h2 className="text-2xl font-semibold text-white">{user.full_name}</h2>
              </div>
              <div className="space-y-4">
                {userPosts.map(post => (
                  <div key={post.id} className="border-t border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      <Link href={`/post/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-400 mb-2">{post.content.substring(0, 100)}...</p>
                    <div className="flex items-center text-sm text-gray-500">
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
        })}
      </div>
    </div>
  )
}

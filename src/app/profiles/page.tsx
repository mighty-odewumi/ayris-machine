import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Profiles() {
  const supabase = await createClient()
  
  // First fetch all posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Posts error:', postsError)
    return <div>Error loading posts</div>
  }

  // Then fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')

  if (profilesError) {
    console.error('Profiles error:', profilesError)
    return <div>Error loading profiles</div>
  }

  // Create a map of profiles for easy lookup
  const profileMap = new Map(profiles.map(profile => [profile.id, profile]))

  // Combine posts with their profile data
  const postsWithProfiles = posts.map(post => ({
    ...post,
    profiles: profileMap.get(post.user_id)
  })).filter(post => post.profiles) // Only keep posts where we found the profile

  const categories = [...new Set(postsWithProfiles.map(post => post.category))]
  const users = [...new Set(profiles.map(profile => profile.id))]

  // Debug logging
  console.log('Posts:', posts)
  console.log('Profiles:', profiles)
  console.log('Combined:', postsWithProfiles)

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
        <p className="text-white">Total Posts: {postsWithProfiles.length}</p>
        <p className="text-white">Total Users: {users.length}</p>
      </div>
      <div className="space-y-8">
        {users.map(userId => {
          const userPosts = postsWithProfiles.filter(post => post.profiles.id === userId)
          const userProfile = profileMap.get(userId)
          
          if (!userProfile || userPosts.length === 0) return null

          return (
            <div key={userId} className="border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Image 
                  src={userProfile.avatar_url || '/placeholder.svg'} 
                  alt={userProfile.full_name || 'User'} 
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h2 className="text-2xl font-semibold text-white">
                  {userProfile.full_name}
                </h2>
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
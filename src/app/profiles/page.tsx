'use client'

import PostsList from '../search/components/PostsList'
import { useProfilePosts } from '@/hooks/useProfilePosts'

export default function SearchPage() {
  const { posts, loading } = useProfilePosts()

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl text-white mb-4">Profiles</h1>

      <PostsList 
        posts={posts}
        loading={loading}
      />
    </div>
  )
}
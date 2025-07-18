import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Post } from '@/types/post'

export function useProfilePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        // First, get all posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            image_url,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
        
        if (postsError) throw postsError
        
        // Get unique user IDs from posts
        const userIds = [...new Set(postsData.map(post => post.user_id).filter(Boolean))]
        
        // Fetch profiles for these users
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let profilesData: any[] = []
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select(`
              id,
              username,
              avatar_url,
              full_name
            `)
            .in('id', userIds)
          
          if (profilesError) {
            console.warn('Error fetching profiles:', profilesError)
            // Continue without profiles if there's an error
            profilesData = []
          } else {
            profilesData = profiles || []
          }
        }
        
        // Manually join posts with profiles
        const typedPosts: Post[] = postsData.map(post => {
          const profile = profilesData.find(p => p.id === post.user_id)
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            image_url: post.image_url || undefined,
            created_at: post.created_at,
            categories: [], // Empty array since we don't need categories
            author: profile ? {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name
            } : undefined
          }
        })
        
        setPosts(typedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [supabase])

  return { posts, loading }
}
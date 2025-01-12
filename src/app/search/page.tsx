'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { categories } from "@/app/constants/categories";


export default function SearchPage() {

  interface Post {
    id: string
    title: string
    content: string
    category: string
  }
  
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()

  const searchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select('*')
        
      // Add search filter if query exists
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
      }
      
      // Add category filter if not 'all'
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchPosts()
  }, [searchQuery, selectedCategory])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-gray-600 text-3xl font-bold mb-6">Search Posts</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((category) => (
            <>
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            </>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {posts.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-gray-600">
                No posts found {searchQuery && `for "${searchQuery}"`} 
                {selectedCategory !== 'all' && ` in category "${selectedCategory}"`}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border p-4 rounded hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold">
                  <a 
                    href={`/posts/${post.id}`} 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {post.title}
                  </a>
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Category: {post.category}
                </p>
                <p className="mt-2 text-gray-700">{post.content}</p>
                <div className="mt-3">
                  <a 
                    href={`/post/${post.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

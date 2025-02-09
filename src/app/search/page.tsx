'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { categoryGroups } from "@/constants/categories";
import Image from "next/image";

export default function SearchPage() {
  interface Post {
    id: string
    title: string
    content: string
    category: string
    category_group: string
    image_url?: string
  }
  
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()

  
  useEffect(() => {
    const searchPosts = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('posts')
          .select('*')
          
        // Add search filter if query exists
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        }
        
        // Add category group filter
        if (selectedGroup !== 'all') {
          query = query.eq('category_group', selectedGroup)
        }

        // Add specific category filter
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
    searchPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedGroup, selectedCategory ])

  // Reset selected category when group changes
  useEffect(() => {
    setSelectedCategory('all')
  }, [selectedGroup])

  // Get titles from categoryGroups
  const groupTitles = ['all', ...categoryGroups.map(group => group.title)]

  // Get categories for selected group
  const filteredCategories = ['all', ...(selectedGroup === 'all' 
    ? categoryGroups.flatMap(group => group.categories)
    : categoryGroups.find(group => group.title === selectedGroup)?.categories || []
  )]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-gray-600 text-3xl font-bold mb-6">Search Posts</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded text-ellipsis"
        >
          {groupTitles.map((title) => (
        <option key={title} value={title}>
          {title === 'all' ? 'All Groups' : title}
        </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded text-ellipsis"
        >
          {filteredCategories.map((category) => (
        <option key={category} value={category}>
          {category === 'all' ? 'All Categories' : category}
        </option>
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
                {post.image_url && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold">
                  <a 
                    href={`/post/${post.id}`} 
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

'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const categories = ["Location", "Era-Style", "Empresses", "Year", "Mythology", "Philosophy", "Medium", "Dream Engine", "Etherith", "Banners", "Heaven", "Music", "Library", "Court", "Empire", "Army", "Market", "Treasury"] 

export default function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to create a post')
      setLoading(false)
      return
    }

    const { error, data } = await supabase.from('posts').insert({
      title,
      content,
      category,
      user_id: user.id
    }).select()

    if (error) {
      alert('Error creating post')
      console.error(error)
    } else {
      router.push(`/post/${data[0].id}`)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-2 ring-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black text-white"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-white">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-2 ring-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black text-white"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-white">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-2 ring-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black text-white"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2"> 
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      <button
        type="button"
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Cancel
      </button>
      </div>
    </form>
  )
}

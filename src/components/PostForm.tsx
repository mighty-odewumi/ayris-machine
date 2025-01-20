'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { categoryGroups } from '@/constants/categories'
// import { Upload, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [categoryGroup, setCategoryGroup] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadError, setUploadError] = useState<string>('')
  
  const supabase = createClient()
  const router = useRouter()

  const handleCategoryGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryGroup(e.target.value)
    setCategory('')
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError('')

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image must be smaller than 5MB')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setUploadError('')
  }

  const currentCategories = categoryGroups.find(group => group.title === categoryGroup)?.categories || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('You must be logged in to create a post')
        setLoading(false)
        return
      }

      let imageUrl = null

      // Upload image if one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Create post with image URL if available
      const { error, data } = await supabase.from('posts').insert({
        title,
        content,
        category_group: categoryGroup,
        category,
        user_id: user.id,
        image_url: imageUrl
      }).select()

      if (error) throw error

      router.push(`/post/${data[0].id}`)
    } catch (error) {
      alert('Error creating post')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block text-sm font-medium text-white mb-2">Image (optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {/* <Upload className="h-8 w-8 text-gray-400" /> */}
            <span className="text-sm text-gray-500">
              Click to upload an image
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG up to 5MB
            </span>
          </label>
        </div>

        {uploadError && (
          <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
            {/* <AlertCircle className="h-4 w-4" /> */}
            alert(`${uploadError}`)
            <span>{uploadError}</span>
          </div>
        )}

        {imagePreview && (
          <div className="mt-4 relative">
            <Image 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-48 rounded-lg mx-auto"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

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
        <label htmlFor="categoryGroup" className="block text-sm font-medium text-white">Category Group</label>
        <select
          id="categoryGroup"
          value={categoryGroup}
          onChange={handleCategoryGroupChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-2 ring-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black text-white"
        >
          <option value="">Select a category group</option>
          {categoryGroups.map((group) => (
            <option key={group.title} value={group.title}>{group.title}</option>
          ))}
        </select>
      </div>

      {categoryGroup && (
        <>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white">Subcategory</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-2 ring-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black text-white"
            >
              <option value="">Select a subcategory</option>
              {currentCategories.map((cat) => (
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
        </>
      )}
    </form>
  )
}

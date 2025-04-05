'use client'

import { useState, useRef } from 'react'
import FormFields from './FormFields'
import ImageUploader from './ImageUploader'
import CategorySelector from './CategorySelector'
import { submitPost } from '@/app/actions'

export default function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCategoryData, setSelectedCategoryData] = useState<{id: string, name: string, group: string}[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setFormError(null)
    
    try {
      const result = await submitPost(formData)
      
      if (result.error) {
        setFormError(result.error)
        setLoading(false)
      } else if (result.success) {
        window.location.href = `/post/${result.postId}`
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormError(error instanceof Error ? error.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-white">Create New Post</h1>

      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <FormFields 
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
        />

        <ImageUploader 
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Select Categories</h3>
          
          <input
            type="hidden"
            name="categoriesData"
            value={JSON.stringify(selectedCategoryData)}
          />

          <CategorySelector 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedCategoryData={selectedCategoryData}
            setSelectedCategoryData={setSelectedCategoryData}
          />
        </div>

        {formError && <p className="text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Publish Post'}
        </button>
      </form>
    </>
  )
}
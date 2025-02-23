// app/build/page.tsx
'use client'

import Image from 'next/image'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Combobox, ComboboxButton, ComboboxOption, ComboboxInput, } from '@headlessui/react'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { categoryGroups, type CategoryGroup } from '@/constants/categories1'

interface Category {
  id: string
  name: string
  group_name: string
}

export default function BuildPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      // Upload image
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError
        imageUrl = (await supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)).data.publicUrl
      }

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          user_id: user.id,
          image_url: imageUrl
        })
        .select()
        .single()

      if (postError) throw postError

      // Link categories
      if (selectedCategories.length > 0) {
        const { error: categoryError } = await supabase
          .from('posts_categories')
          .insert(selectedCategories.map(categoryId => ({
            post_id: post.id,
            category_id: categoryId
          })))

        if (categoryError) throw categoryError
      }

      router.push(`/post/${post.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl text-white mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="w-full p-3 border rounded-lg"
          />
          {previewUrl && (
            <div className="mt-4 relative w-64 h-64">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Categories</h3>
          
          <Combobox 
            as="div" 
            value={selectedCategories}
            onChange={setSelectedCategories}
            multiple
            className="relative text-gray-100"
          >
            {({ open }) => (
              <>
                <ComboboxButton className="w-full p-3 border rounded-lg text-left flex items-center justify-between">
                  <span className="truncate">
                    {selectedCategories.length > 0 
                      ? `${selectedCategories.length} selected` 
                      : 'Select categories...'
                    }
                  </span>
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </ComboboxButton>

                {open && <ComboboxOption 
                  className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  value={open}
                >
                  <div className="p-2">
                    <div className="relative">
                      <ComboboxInput
                        placeholder="Search categories..."
                        className="w-full p-2 mb-2 border rounded"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        displayValue={() => searchQuery}
                      />
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>

                    {categoryGroups.map((group: CategoryGroup) => (
                      <div key={group.title} className="mb-4 text-black">
                        <h4 className="font-medium p-2 bg-gray-50 rounded">
                          {group.title}
                        </h4>
                        <div className="mt-1 space-y-1">
                          {group.categories
                            .filter((category: Category) => 
                              category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              group.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((category: Category) => (
                              <ComboboxOption
                                key={category.id}
                                value={category.id}
                                className={({ active }) => 
                                  `relative cursor-default select-none p-2 pl-8 rounded ${
                                    active ? 'bg-blue-100' : ''
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                      {category.name}
                                    </span>
                                    {selected && (
                                      <span className="absolute left-2 top-2.5">
                                        <CheckIcon className="h-4 w-4 text-blue-600" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ComboboxOption>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ComboboxOption>}
              </>
            )}
          </Combobox>

          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = categoryGroups
                .flatMap(g => g.categories)
                .find((c: Category) => c.id === categoryId)
              return (
                <span 
                  key={categoryId}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                >
                  {category?.name}
                  <button
                    type="button"
                    onClick={() => setSelectedCategories(prev => prev.filter(id => id !== categoryId))}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}
'use client'

import Image from 'next/image'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { categoryGroups } from '@/constants/categories1'
import { submitPost } from '@/app/actions'
// import { submitPost } from '@/app/actions/submitPost'

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  // const supabase = createClientComponentClient()
  // const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Filter categories based on search query
  const filteredCategoryGroups = categoryGroups.map(group => ({
    ...group,
    categories: group.categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.categories.length > 0);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDropdownOpen(prev => !prev)
  }

  // Get category names for display
  const selectedCategoryNames = selectedCategories
    .map(id => {
      const category = categoryGroups
        .flatMap(g => g.categories)
        .find(c => c.id === id)
      return category?.name || ''
    })
    .filter(Boolean)
    .join(', ')

  return (
    <div className="max-w-3xl text-white mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      <form action={submitPost} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            name="title"
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
            name='content'
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            name='image'
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
          
          <input
            type="hidden"
            name="categories"
            value={selectedCategories.join(',')}
          />

          {/* Custom Category Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="w-full p-3 border rounded-lg text-left flex items-center justify-between bg-white text-black"
            >
              <span className="truncate">
                {selectedCategories.length === 0
                  ? 'Select categories...'
                  : `${selectedCategories.length} selected: ${selectedCategoryNames}`}
              </span>
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-white shadow-lg border p-2 text-black">
                {/* Search input */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                {/* Category groups */}
                {filteredCategoryGroups.map((group) => (
                  <div key={group.title} className="mb-4">
                    <h4 className="font-medium p-2 bg-gray-50 rounded">
                      {group.title}
                    </h4>
                    <div className="mt-1">
                      {group.categories.map((category) => {
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                          <div 
                            key={category.id}
                            className={`relative cursor-pointer select-none py-2 pl-8 pr-4 rounded ${
                              isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(category.id);
                            }}
                          >
                            <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                              {category.name}
                            </span>
                            {isSelected && (
                              <span className="absolute left-2 top-2.5 text-blue-600">
                                <CheckIcon className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Actions */}
                {selectedCategories.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {selectedCategories.length} categories selected
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategories([]);
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
                
                {filteredCategoryGroups.length === 0 && (
                  <div className="py-2 text-gray-500 text-center">
                    No categories found matching your search.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected category pills */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categoryGroups
                  .flatMap(g => g.categories)
                  .find((c: Category) => c.id === categoryId)
                
                if (!category) return null;
                
                return (
                  <span 
                    key={categoryId}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {category.name}
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
          )}
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
'use client'

import { useState } from 'react'
import { categoryGroups } from '@/constants/categories1'
import SearchInput from './components/SearchInput'
import CategoryFilter from './components/CategoryFilter'
import FilterModeToggle from './components/CategoryFilter/FilterModeToggle'
import PostsList from './components/PostsList'
import { usePosts } from '@/hooks/usePosts'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND')
  
  // Process categories
  const allCategories = categoryGroups.flatMap(group => 
    group.categories.map(category => ({
      ...category,
      group: group.title
    }))
  )

  const filteredCategories = query === ''
    ? allCategories
    : allCategories.filter((category) =>
        category.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )
      
  // Use custom hook for fetching posts
  const { posts, loading } = usePosts(searchQuery, selectedCategories, filterMode)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Discover Posts</h1>
        
        <div className="space-y-4">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <CategoryFilter
            query={query}
            setQuery={setQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            allCategories={allCategories}
            filteredCategories={filteredCategories}
            categoryGroups={categoryGroups}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </div>

      {selectedCategories.length > 1 && (
        <FilterModeToggle
          filterMode={filterMode}
          setFilterMode={setFilterMode}
        />
      )}

      <PostsList 
        posts={posts}
        loading={loading}
      />
    </div>
  )
}
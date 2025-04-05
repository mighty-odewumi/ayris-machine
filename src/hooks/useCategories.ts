import { useState, useMemo } from 'react'
import { categoryGroups } from '@/constants/categories1'

export function useCategories() {
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Process all categories once
  const allCategories = useMemo(() => 
    categoryGroups.flatMap(group => 
      group.categories.map(category => ({
        ...category,
        group: group.title
      }))
    ),
    []
  )

  // Filter categories based on search query
  const filteredCategories = useMemo(() => 
    query === ''
      ? allCategories
      : allCategories.filter((category) =>
          category.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        ),
    [query, allCategories]
  )

  // Get selected category names for display
  const selectedCategoryNames = useMemo(() => 
    selectedCategories
      .map(id => allCategories.find(cat => cat.id === id)?.name)
      .filter(Boolean),
    [selectedCategories, allCategories]
  )

  return {
    query,
    setQuery,
    selectedCategories,
    setSelectedCategories,
    allCategories,
    filteredCategories,
    selectedCategoryNames,
  }
}
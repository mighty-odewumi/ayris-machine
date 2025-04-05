import { useState } from 'react'
import CategoryDropdown from './CategoryDropdown'
import CategoryPills from './CategoryPills'
import { categoryGroups } from '@/constants/categories1'

interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedCategoryData: {id: string, name: string, group: string}[];
  setSelectedCategoryData: (data: {id: string, name: string, group: string}[]) => void;
}

export default function CategorySelector({
  selectedCategories,
  setSelectedCategories,
  selectedCategoryData,
  setSelectedCategoryData
}: CategorySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filter categories based on search query
  const filteredCategoryGroups = categoryGroups.map(group => ({
    ...group,
    categories: group.categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.categories.length > 0)

  const toggleCategory = (categoryId: string, categoryName: string, groupName: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId)
      
      // Update the selectedCategoryData state
      if (isSelected) {
        setSelectedCategoryData(prev => prev.filter(item => item.id !== categoryId))
        return prev.filter(id => id !== categoryId)
      } else {
        setSelectedCategoryData(prev => [
          ...prev, 
          { id: categoryId, name: categoryName, group: groupName }
        ])
        return [...prev, categoryId]
      }
    })
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
    <>
      <CategoryDropdown 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        selectedCategories={selectedCategories}
        selectedCategoryNames={selectedCategoryNames}
        filteredCategoryGroups={filteredCategoryGroups}
        toggleCategory={toggleCategory}
        setSelectedCategories={setSelectedCategories}
        setSelectedCategoryData={setSelectedCategoryData}
      />

      {selectedCategories.length > 0 && (
        <CategoryPills
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categoryGroups={categoryGroups}
        />
      )}
    </>
  )
}
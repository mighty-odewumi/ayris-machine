import React, { useRef } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import CategoryDropdown from './CategoryDropdown';
import CategoryPills from './CategoryPills';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CategoryFilterProps {
  // Common props
  query: string; 
  setQuery: (query: string) => void; 
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  allCategories: Array<{id: string; name: string; group: string}>;
  filteredCategories: Array<{id: string; name: string; group: string}>;
  categoryGroups: Array<{
    title: string;
    categories: Array<{
      id: string;
      name: string;
      group_name: string;
    }>;
  }>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Optional props for different contexts
  placeholder?: string;  // Different placeholder text
  onCategorySelect?: (categoryId: string, categoryName: string, groupName: string) => void; // For build page
  variant?: 'search' | 'postForm'; 
  selectedCategoryData?: Array<{id: string, name: string, group: string}>;
  setSelectedCategoryData?: React.Dispatch<React.SetStateAction<Array<{id: string, name: string, group: string}>>>;

  // setSelectedCategoryData?: (data: Array<{id: string; name: string; group: string}>) => void; // For build page
}

export default function CategoryFilter({
  query,
  setQuery,
  selectedCategories,
  setSelectedCategories,
  allCategories,
  filteredCategories,
  categoryGroups,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedCategoryData,
  setSelectedCategoryData
}: CategoryFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsDropdownOpen(false));
  
  // Selected category names for display
  const selectedCategoryNames = selectedCategories
    .map(id => allCategories.find(cat => cat.id === id)?.name)
    .filter(Boolean);
  
  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const handleCategorySelect = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    
    // Update selectedCategories
    setSelectedCategories(prev => 
      isSelected ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
    
    // If we have setSelectedCategoryData (in build page context), update it too
    if (setSelectedCategoryData) {
      const category = allCategories.find(cat => cat.id === categoryId);
      
      if (category) {
        if (isSelected) {
          // Remove from data if deselected
          setSelectedCategoryData(prev => prev.filter(item => item.id !== categoryId));
        } else {
          // Add to data if selected
          setSelectedCategoryData(prev => [...prev, {
            id: category.id,
            name: category.name,
            group: category.group
          }]);
        }
      }
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={handleDropdownToggle}
        className="w-full p-3 border rounded-lg text-left flex items-center justify-between bg-white"
      >
        <span className="truncate">
          {selectedCategories.length === 0
            ? 'Filter by categories...'
            : `${selectedCategories.length} categories selected: ${selectedCategoryNames.join(', ')}`}
        </span>
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <CategoryDropdown 
          query={query}
          setQuery={setQuery}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          filteredCategories={filteredCategories}
          categoryGroups={categoryGroups}
          onCategorySelect={handleCategorySelect}
        />
      )}
      
      {/* Selected category pills */}
      {selectedCategories.length > 0 && (
        <CategoryPills
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          allCategories={allCategories}
          onRemoveCategory={handleCategorySelect}
        />
      )}
    </div>
  );
}

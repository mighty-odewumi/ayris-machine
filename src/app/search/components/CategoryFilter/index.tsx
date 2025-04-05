import React, { useRef } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import CategoryDropdown from './CategoryDropdown';
import CategoryPills from './CategoryPills';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CategoryFilterProps {
  query: string;
  setQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  allCategories: Array<{
    id: string; name: string; group: string
  }>;
  filteredCategories: Array<{
    id: string; name: string; group: string
  }>;
  categoryGroups:  {
    title: string;
    categories: {
        id: string;
        name: string;
        group_name: string;
    }[];
  }[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsDropdownOpen
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
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
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
        />
      )}
      
      {/* Selected category pills */}
      {selectedCategories.length > 0 && (
        <CategoryPills
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          allCategories={allCategories}
        />
      )}
    </div>
  );
}
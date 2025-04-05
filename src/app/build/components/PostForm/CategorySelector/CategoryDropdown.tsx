import { useRef, useEffect } from 'react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CategoryDropdownProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedCategories: string[];
  selectedCategoryNames: string;
  filteredCategoryGroups: any[]; 
  toggleCategory: (categoryId: string, categoryName: string, groupName: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedCategoryData: (data: {id: string, name: string, group: string}[]) => void;
}

export default function CategoryDropdown({
  searchQuery,
  setSearchQuery,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedCategories,
  selectedCategoryNames,
  filteredCategoryGroups,
  toggleCategory,
  setSelectedCategories,
  setSelectedCategoryData
}: CategoryDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

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
  }, [dropdownRef, setIsDropdownOpen]);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDropdownOpen(prev => !prev)
  }

  return (
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
                {group.categories.map((category: any) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <div 
                      key={category.id}
                      className={`relative cursor-pointer select-none py-2 pl-8 pr-4 rounded ${
                        isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id, category.name, group.title);
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
                    setSelectedCategoryData([]);
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
  )
}
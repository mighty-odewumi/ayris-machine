import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface CategoryDropdownProps {
  query: string;
  setQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  filteredCategories: Array<{id: string; name: string; group: string}>;
  categoryGroups: {
    title: string;
    categories: {
        id: string;
        name: string;
        group_name: string;
    }[];
  }[]; 
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategoryDropdown({
  query,
  setQuery,
  selectedCategories,
  setSelectedCategories,
  filteredCategories,
  categoryGroups,
  onCategorySelect
}: CategoryDropdownProps) {
  return (
    <div className="absolute z-20 mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-white shadow-lg border p-2">
      {/* Category search input */}
      <input
        type="text"
        className="w-full p-2 mb-2 border rounded"
        placeholder="Search categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Category list */}
      {categoryGroups.map((group) => {
        const groupCategories = filteredCategories.filter(
          cat => cat.group === group.title
        );
        
        if (groupCategories.length === 0) return null;
        
        return (
          <div key={group.title} className="mb-4">
            <h4 className="font-medium p-2 bg-gray-50 rounded">
              {group.title}
            </h4>
            <div className="mt-1">
              {groupCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <div 
                    key={category.id}
                    className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      isSelected ? 'bg-blue-100' : 'hover:bg-blue-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (onCategorySelect) {
                        onCategorySelect(category.id);
                      } else {
                        setSelectedCategories(prev => 
                          isSelected 
                            ? prev.filter(id => id !== category.id) 
                            : [...prev, category.id]
                        );
                      }
                    }}
                  >
                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                      {category.name}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Selected categories display and actions */}
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
    </div>
  );
}
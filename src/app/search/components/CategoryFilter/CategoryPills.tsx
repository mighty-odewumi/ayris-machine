import React from 'react';

interface CategoryPillsProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  allCategories: Array<{id: string; name: string; group: string}>;
}

export default function CategoryPills({
  selectedCategories,
  setSelectedCategories,
  allCategories
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {selectedCategories.map(id => {
        const category = allCategories.find(c => c.id === id);
        if (!category) return null;
        
        return (
          <span 
            key={id}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
          >
            {category.name}
            <button 
              onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== id))}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              &times;
            </button>
          </span>
        );
      })}
    </div>
  );
}
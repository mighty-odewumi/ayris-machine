interface Category {
  id: string;
  name: string;
  group_name: string;
}

interface CategoryPillsProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categoryGroups: any[]; // Use proper type from your constants
}

export default function CategoryPills({
  selectedCategories,
  setSelectedCategories,
  categoryGroups
}: CategoryPillsProps) {
  return (
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
              onClick={() => setSelectedCategories(prev.filter(id => id !== categoryId))}
              className="hover:text-blue-600"
            >
              ×
            </button>
          </span>
        )
      })}
    </div>
  )
}